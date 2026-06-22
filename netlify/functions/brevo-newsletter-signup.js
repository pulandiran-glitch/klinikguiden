const CONSENT_TEXT = "Jeg accepterer at modtage nyheder og guides fra KlinikGuiden på e-mail. Jeg kan altid afmelde mig igen.";
const BREVO_API_BASE = "https://api.brevo.com/v3";

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
  const id = Number(process.env.BREVO_LIST_ID);
  return Number.isInteger(id) && id > 0 ? id : null;
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

async function sendWelcomeTemplate({ email, name }) {
  const templateId = getTemplateId("BREVO_WELCOME_TEMPLATE_ID");
  if (!templateId) {
    return { skipped: true, reason: "BREVO_WELCOME_TEMPLATE_ID mangler." };
  }

  return brevoFetch("/smtp/email", {
    sender: {
      name: process.env.BREVO_SENDER_NAME || "KlinikGuiden",
      email: process.env.BREVO_SENDER_EMAIL || "kontakt@klinikguiden.com"
    },
    to: [{ email, name: name || email }],
    templateId,
    params: {
      FIRSTNAME: name || "",
      SIGNUP_SOURCE: "KlinikGuiden"
    }
  });
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
      error: "Nyhedsbrevet mangler BREVO_LIST_ID i Netlify."
    });
  }

  const doubleOptInEnabled = Boolean(
    getTemplateId("BREVO_DOUBLE_OPTIN_TEMPLATE_ID") &&
    process.env.BREVO_REDIRECT_URL_AFTER_CONFIRMATION
  );

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
    DOUBLE_OPT_IN_STATUS: doubleOptInEnabled ? "pending" : "not_enabled"
  };

  try {
    if (doubleOptInEnabled) {
      await createDoubleOptInContact({ email, listId });
      await saveConsentAttributes({ email, attributes });
      return response(200, {
        ok: true,
        doubleOptIn: true,
        message: "Tak. Tjek din e-mail og bekræft tilmeldingen, før nyhedsbrevet starter."
      });
    }

    await createOrUpdateContact({ email, attributes, listId });
    const welcome = await sendWelcomeTemplate({ email, name });

    return response(200, {
      ok: true,
      doubleOptIn: false,
      welcomeEmail: welcome.skipped ? "template_missing" : "sent",
      message: "Tak for tilmeldingen. Du er skrevet op til KlinikGuidens nyhedsbrev."
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
