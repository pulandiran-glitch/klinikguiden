const BREVO_API_BASE = "https://api.brevo.com/v3";
const NEWSLETTER_LIST_ID = 5;

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function numericEnv(name) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : null;
}

async function brevoGet(path) {
  const brevoResponse = await fetch(`${BREVO_API_BASE}${path}`, {
    headers: {
      "api-key": process.env.BREVO_API_KEY
    }
  });

  if (brevoResponse.status === 404) {
    return { exists: false };
  }

  if (!brevoResponse.ok) {
    return { exists: false, status: brevoResponse.status };
  }

  const text = await brevoResponse.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }

  return { exists: true, data };
}

async function checkBrevoResource(name, envName, pathFactory, options = {}) {
  const id = numericEnv(envName);
  if (!id) {
    return { name, envName, configured: false, verified: false };
  }

  const result = await brevoGet(pathFactory(id));
  const isDoiTemplate = result.data && result.data.doiTemplate === true;
  const active = !result.data || result.data.isActive !== false;
  const verified = Boolean(result.exists) &&
    active &&
    (!options.requireDoiTemplate || isDoiTemplate);

  return {
    name,
    envName,
    configured: true,
    verified,
    status: result.status || 200,
    active,
    doiTemplate: options.requireDoiTemplate ? isDoiTemplate : undefined
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return response(204, {});
  }

  if (event.httpMethod !== "GET") {
    return response(405, { error: "Metoden er ikke tilladt." });
  }

  const apiKeyConfigured = Boolean(process.env.BREVO_API_KEY);

  const env = {
    BREVO_API_KEY: apiKeyConfigured,
    BREVO_LIST_ID: numericEnv("BREVO_LIST_ID") === NEWSLETTER_LIST_ID,
    BREVO_SENDER_EMAIL: Boolean(process.env.BREVO_SENDER_EMAIL),
    BREVO_SENDER_NAME: Boolean(process.env.BREVO_SENDER_NAME),
    BREVO_WELCOME_TEMPLATE_ID: Boolean(numericEnv("BREVO_WELCOME_TEMPLATE_ID")),
    BREVO_DOUBLE_OPTIN_TEMPLATE_ID: Boolean(numericEnv("BREVO_DOUBLE_OPTIN_TEMPLATE_ID")),
    BREVO_REDIRECT_URL_AFTER_CONFIRMATION: Boolean(process.env.BREVO_REDIRECT_URL_AFTER_CONFIRMATION)
  };

  if (!apiKeyConfigured) {
    return response(200, {
      ok: false,
      env,
      message: "BREVO_API_KEY mangler i Netlify."
    });
  }

  const resources = await Promise.all([
    checkBrevoResource("newsletter list", "BREVO_LIST_ID", (id) => `/contacts/lists/${id}`),
    checkBrevoResource("welcome template", "BREVO_WELCOME_TEMPLATE_ID", (id) => `/smtp/templates/${id}`),
    checkBrevoResource("double opt-in template", "BREVO_DOUBLE_OPTIN_TEMPLATE_ID", (id) => `/smtp/templates/${id}`, { requireDoiTemplate: true })
  ]);

  const newsletterList = resources.find((resource) => resource.envName === "BREVO_LIST_ID");
  const welcomeTemplate = resources.find((resource) => resource.envName === "BREVO_WELCOME_TEMPLATE_ID");
  const doubleOptInTemplate = resources.find((resource) => resource.envName === "BREVO_DOUBLE_OPTIN_TEMPLATE_ID");
  const doubleOptInReady = env.BREVO_DOUBLE_OPTIN_TEMPLATE_ID &&
    env.BREVO_REDIRECT_URL_AFTER_CONFIRMATION &&
    Boolean(doubleOptInTemplate && doubleOptInTemplate.verified);
  const welcomeAutomationReady = env.BREVO_WELCOME_TEMPLATE_ID &&
    Boolean(welcomeTemplate && welcomeTemplate.verified);
  const ready = env.BREVO_API_KEY &&
    env.BREVO_LIST_ID &&
    Boolean(newsletterList && newsletterList.verified) &&
    env.BREVO_SENDER_EMAIL &&
    env.BREVO_SENDER_NAME &&
    doubleOptInReady &&
    welcomeAutomationReady;

  return response(200, {
    ok: ready,
    env,
    resources,
    requiredListId: NEWSLETTER_LIST_ID,
    doubleOptInReady,
    welcomeAutomationReady,
    message: ready
      ? "Brevo nyhedsbrev er klar til double opt-in og velkomstmail via automation."
      : "Brevo API-nøglen findes, men liste/template/sender-opsætning eller automation-grundlag mangler endnu."
  });
};
