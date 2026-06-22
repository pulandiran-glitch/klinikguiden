const BREVO_API_BASE = "https://api.brevo.com/v3";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Setup-Token",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const attributes = [
  { name: "FIRSTNAME", type: "text" },
  { name: "CONSENT_NEWSLETTER", type: "boolean" },
  { name: "CONSENT_TEXT", type: "text" },
  { name: "CONSENT_TIMESTAMP", type: "text" },
  { name: "CONSENT_SOURCE", type: "text" },
  { name: "SIGNUP_PAGE", type: "text" },
  { name: "SIGNUP_FORM", type: "text" },
  { name: "DOUBLE_OPT_IN_STATUS", type: "text" }
];

function response(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body)
  };
}

function getListId() {
  const id = Number(process.env.BREVO_LIST_ID || "5");
  return Number.isInteger(id) && id > 0 ? id : 5;
}

function getSender() {
  return {
    name: process.env.BREVO_SENDER_NAME || "KlinikGuiden",
    email: process.env.BREVO_SENDER_EMAIL || "nyheder@klinikguiden.com"
  };
}

async function brevoRequest(method, path, body) {
  const brevoResponse = await fetch(`${BREVO_API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: body ? JSON.stringify(body) : undefined
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

  return {
    ok: brevoResponse.ok,
    status: brevoResponse.status,
    data
  };
}

async function createAttribute(attribute) {
  const result = await brevoRequest(
    "POST",
    `/contacts/attributes/normal/${encodeURIComponent(attribute.name)}`,
    { type: attribute.type }
  );

  if (result.ok || result.status === 400) {
    return {
      name: attribute.name,
      ok: true,
      status: result.status,
      note: result.ok ? "created" : "already_exists_or_unchanged"
    };
  }

  return {
    name: attribute.name,
    ok: false,
    status: result.status
  };
}

function emailShell(title, body) {
  return `<!doctype html>
<html lang="da">
  <body style="margin:0;background:#FDFAF5;color:#2C2C2C;font-family:Arial,sans-serif;line-height:1.6;padding:24px;">
    <main style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #E2DDD4;border-radius:12px;padding:32px;">
      <p style="color:#4E7A62;font-size:12px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 16px;">KlinikGuiden</p>
      <h1 style="font-size:28px;line-height:1.2;margin:0 0 20px;">${title}</h1>
      ${body}
      <p style="margin-top:28px;color:#7A7A72;font-size:14px;">Venlig hilsen<br>KlinikGuiden</p>
    </main>
  </body>
</html>`;
}

function doubleOptInHtml() {
  return emailShell(
    "Bekræft din tilmelding til KlinikGuiden",
    `<p>Hej</p>
      <p>Tak fordi du vil modtage nyheder fra KlinikGuiden.</p>
      <p>Klik på knappen nedenfor for at bekræfte din tilmelding.</p>
      <p><a href="{{ params.DOIurl }}" style="background:#4E7A62;border-radius:999px;color:#ffffff;display:inline-block;padding:12px 20px;text-decoration:none;">Bekræft tilmelding</a></p>
      <p>Når du har bekræftet, får du korte og brugbare guides om tandbehandlinger, priser, tilskud og spørgsmål før tandlægebesøg.</p>
      <p style="color:#7A7A72;font-size:14px;">Hvis du ikke har tilmeldt dig, kan du ignorere denne mail.</p>`
  );
}

function welcomeHtml() {
  return emailShell(
    "Velkommen til KlinikGuiden",
    `<p>Hej {{ params.FIRSTNAME }}</p>
      <p>Tak fordi du har tilmeldt dig nyheder fra KlinikGuiden.</p>
      <p>Du får fremover korte og brugbare guides om tandbehandlinger, priser, tilskud og gode spørgsmål før tandlægebesøg.</p>
      <p>KlinikGuiden er lavet for at gøre tandpleje lettere at forstå, før man står i stolen eller får regningen.</p>
      <p>Du kan altid afmelde dig igen via linket nederst i mailen.</p>
      <p style="color:#7A7A72;font-size:13px;margin-top:28px;">Afmeld nyhedsbrev: {{ unsubscribe }}</p>`
  );
}

async function createTemplate(template) {
  const result = await brevoRequest("POST", "/smtp/templates", {
    sender: getSender(),
    templateName: template.templateName,
    subject: template.subject,
    htmlContent: template.htmlContent,
    isActive: true,
    tag: "klinikguiden-newsletter",
    replyTo: process.env.BREVO_SENDER_EMAIL || "nyheder@klinikguiden.com"
  });

  return {
    templateName: template.templateName,
    ok: result.ok,
    status: result.status,
    id: result.data && result.data.id ? result.data.id : null,
    message: result.ok ? "created" : result.data.message || "Brevo kunne ikke oprette templaten."
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return response(204, {});
  }

  if (event.httpMethod !== "POST") {
    return response(405, { error: "Metoden er ikke tilladt." });
  }

  const setupToken = event.headers["x-setup-token"] || event.headers["X-Setup-Token"];
  if (!process.env.BREVO_SETUP_TOKEN || setupToken !== process.env.BREVO_SETUP_TOKEN) {
    return response(401, { error: "Ikke autoriseret." });
  }

  if (!process.env.BREVO_API_KEY) {
    return response(503, { error: "BREVO_API_KEY mangler i Netlify." });
  }

  const listId = getListId();
  const listCheck = await brevoRequest("GET", `/contacts/lists/${listId}`);
  const attributeResults = await Promise.all(attributes.map(createAttribute));

  const doubleOptInTemplate = await createTemplate({
    templateName: "KlinikGuiden Double Opt-in",
    subject: "Bekræft din tilmelding til KlinikGuiden",
    htmlContent: doubleOptInHtml()
  });

  const welcomeTemplate = await createTemplate({
    templateName: "KlinikGuiden Velkomstmail",
    subject: "Velkommen til KlinikGuiden",
    htmlContent: welcomeHtml()
  });

  return response(200, {
    ok: Boolean(listCheck.ok && doubleOptInTemplate.ok && welcomeTemplate.ok),
    list: {
      id: listId,
      verified: listCheck.ok,
      status: listCheck.status
    },
    attributes: attributeResults,
    templates: {
      doubleOptIn: doubleOptInTemplate,
      welcome: welcomeTemplate
    },
    nextEnv: {
      BREVO_LIST_ID: String(listId),
      BREVO_DOUBLE_OPTIN_TEMPLATE_ID: doubleOptInTemplate.id,
      BREVO_WELCOME_TEMPLATE_ID: welcomeTemplate.id
    }
  });
};
