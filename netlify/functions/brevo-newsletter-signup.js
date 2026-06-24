const CONSENT_TEXT = "Jeg accepterer at modtage nyheder og guides fra KlinikGuiden på e-mail. Jeg kan altid afmelde mig igen.";
const BREVO_API_BASE = "https://api.brevo.com/v3";
const NEWSLETTER_LIST_ID = 5;

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function parseBody(event) {
  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
  const rawBody = event.body || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  try {
    return JSON.parse(rawBody || "{}");
  } catch {
    return null;
  }
}

function cleanText(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSignupPage(payload, event) {
  const suppliedPage = cleanText(payload.signup_page || payload.signupPage, 260);
  if (suppliedPage) return suppliedPage;

  const referer = event.headers.referer || event.headers.referrer || "";
  if (!referer) return "ukendt";

  try {
    return new URL(referer).pathname || "/";
  } catch {
    return "ukendt";
  }
}

function getListId() {
  const id = Number(process.env.BREVO_LIST_ID || NEWSLETTER_LIST_ID);
  return Number.isInteger(id) && id === NEWSLETTER_LIST_ID ? id : null;
}

function getTemplateId(name) {
  const id = Number(process.env[name]);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function brevoFetch(path, body) {
  const brevoResponse = await fetch(`${BREVO_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: JSON.stringify(body)
  });

  const text = await brevoResponse.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!brevoResponse.ok) {
    const error = new Error(data.message || "Brevo afviste tilmeldingen.");
    error.statusCode = brevoResponse.status;
    error.brevoCode = data.code || "";
    error.brevoMessage = data.message || "";
    throw error;
  }

  return data;
}

async function createDoubleOptInContact({ email, listId }) {
  return brevoFetch("/contacts/doubleOptinConfirmation", {
    email,
    includeListIds: [listId],
    templateId: getTemplateId("BREVO_DOUBLE_OPTIN_TEMPLATE_ID"),
    redirectionUrl: process.env.BREVO_REDIRECT_URL_AFTER_CONFIRMATION
  });
}

async function createOrUpdateContact({ email, attributes, listId }) {
  const body = {
    email,
    attributes,
    updateEnabled: true
  };

  if (listId) {
    body.listIds = [listId];
  }

  return brevoFetch("/contacts", body);
}

async function saveConsentAttributes({ email, attributes }) {
  return createOrUpdateContact({ email, attributes });
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return response(204, {});
  }

  if (event.httpMethod !== "POST") {
    return response(405, { error: "Metoden er ikke tilladt." });
  }

  const payload = parseBody(event);
  if (!payload) {
    return response(400, { error: "Ugyldig forespørgsel." });
  }

  if (payload["bot-field"]) {
    return response(200, { ok: true, message: "Tak for tilmeldingen." });
  }

  const email = cleanText(payload.email, 254).toLowerCase();
  const name = cleanText(payload.name, 120);
  const consent = cleanText(payload.consent);

  if (!isValidEmail(email)) {
    return response(400, { error: "Skriv en gyldig e-mailadresse." });
  }

  if (consent !== "accepted") {
    return response(400, { error: "Du skal aktivt acceptere nyhedsbrevet, før formularen kan sendes." });
  }

  if (!process.env.BREVO_API_KEY) {
    return response(503, {
      error: "Nyhedsbrevet er ikke sat op i Brevo endnu. Tilføj BREVO_API_KEY i Netlify."
    });
  }

  const listId = getListId();
  if (!listId) {
    return response(503, {
      error: "Nyhedsbrevet kræver BREVO_LIST_ID=5 i Netlify."
    });
  }

  const doubleOptInTemplateId = getTemplateId("BREVO_DOUBLE_OPTIN_TEMPLATE_ID");
  const redirectAfterConfirmation = cleanText(process.env.BREVO_REDIRECT_URL_AFTER_CONFIRMATION, 500);
  const doubleOptInReady = Boolean(doubleOptInTemplateId && redirectAfterConfirmation);

  if (!doubleOptInReady) {
    return response(503, {
      error: "Nyhedsbrevet kræver aktiv double opt-in, før tilmeldinger kan modtages.",
      doubleOptInReady: false,
      missing: {
        BREVO_DOUBLE_OPTIN_TEMPLATE_ID: !doubleOptInTemplateId,
        BREVO_REDIRECT_URL_AFTER_CONFIRMATION: !redirectAfterConfirmation
      }
    });
  }

  const timestamp = cleanText(payload.consent_timestamp || payload.created_at) || new Date().toISOString();
  const signupPage = getSignupPage(payload, event);
  const signupForm = cleanText(payload.signup_form || payload.signupForm, 120) || "newsletter-signup";
  const consentSource = cleanText(payload.consent_source || payload.consentSource, 160) || "KlinikGuiden newsletter-signup";

  const attributes = {
    FIRSTNAME: name,
    CONSENT_NEWSLETTER: true,
    CONSENT_TEXT: CONSENT_TEXT,
    CONSENT_TIMESTAMP: timestamp,
    CONSENT_SOURCE: consentSource,
    SIGNUP_PAGE: signupPage,
    SIGNUP_FORM: signupForm,
    DOUBLE_OPT_IN_STATUS: "pending"
  };

  try {
    await saveConsentAttributes({ email, attributes });
    await createDoubleOptInContact({ email, listId });

    return response(200, {
      ok: true,
      listId,
      doubleOptIn: true,
      welcomeEmail: "brevo_automation_after_confirmation",
      message: "Tak. Tjek din e-mail og bekræft tilmeldingen, før nyhedsbrevet starter."
    });
  } catch (error) {
    console.error("Brevo newsletter signup failed", {
      statusCode: error.statusCode || 500,
      brevoCode: error.brevoCode || "",
      brevoMessage: error.brevoMessage || "",
      signupForm,
      signupPage
    });

    return response(error.statusCode || 502, {
      error: "Tilmeldingen kunne ikke gennemføres lige nu. Prøv igen senere.",
      brevoStatus: error.statusCode || 500,
      brevoCode: error.brevoCode || "unknown",
      brevoMessage: error.brevoMessage || "Brevo afviste forespørgslen uden en offentlig fejlbesked."
    });
  }
};
