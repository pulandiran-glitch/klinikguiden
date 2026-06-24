const assert = require("node:assert/strict");
const test = require("node:test");

const functionPath = require.resolve("../../netlify/functions/brevo-newsletter-signup");

function loadHandler(env = {}) {
  delete require.cache[functionPath];
  const previousEnv = { ...process.env };
  process.env = {
    ...previousEnv,
    BREVO_API_KEY: "test-api-key",
    BREVO_LIST_ID: "5",
    BREVO_SENDER_EMAIL: "nyheder@klinikguiden.com",
    BREVO_SENDER_NAME: "KlinikGuiden",
    BREVO_REDIRECT_URL_AFTER_CONFIRMATION: "https://klinikguiden.com/tak.html?newsletter=confirmed",
    ...env
  };

  return {
    handler: require("../../netlify/functions/brevo-newsletter-signup").handler,
    restore() {
      process.env = previousEnv;
      delete require.cache[functionPath];
    }
  };
}

function signupEvent(payload) {
  return {
    httpMethod: "POST",
    headers: {
      "content-type": "application/json",
      referer: "https://klinikguiden.com/nyhedsbrev.html"
    },
    body: JSON.stringify({
      name: "Test Person",
      email: "test@example.com",
      consent: "accepted",
      consent_timestamp: "2026-06-24T10:00:00.000Z",
      consent_source: "KlinikGuiden newsletter-signup",
      signup_form: "Nyhedsbrevside",
      ...payload
    })
  };
}

test("rejects signup when double opt-in template is missing", async () => {
  const calls = [];
  const previousFetch = global.fetch;
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ id: 123 }), { status: 201 });
  };

  const { handler, restore } = loadHandler({
    BREVO_DOUBLE_OPTIN_TEMPLATE_ID: "",
    BREVO_WELCOME_TEMPLATE_ID: "42"
  });

  try {
    const result = await handler(signupEvent());
    const body = JSON.parse(result.body);

    assert.equal(result.statusCode, 503);
    assert.equal(body.doubleOptInReady, false);
    assert.equal(calls.length, 0);
  } finally {
    restore();
    global.fetch = previousFetch;
  }
});

test("sends double opt-in and stores GDPR attributes on list 5", async () => {
  const calls = [];
  const previousFetch = global.fetch;
  global.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return new Response(JSON.stringify({ id: 123 }), { status: 201 });
  };

  const { handler, restore } = loadHandler({
    BREVO_DOUBLE_OPTIN_TEMPLATE_ID: "24",
    BREVO_WELCOME_TEMPLATE_ID: "42"
  });

  try {
    const result = await handler(signupEvent());
    const body = JSON.parse(result.body);

    assert.equal(result.statusCode, 200);
    assert.equal(body.doubleOptIn, true);
    assert.equal(body.welcomeEmail, "brevo_automation_after_confirmation");
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, "https://api.brevo.com/v3/contacts");
    assert.equal(calls[0].body.email, "test@example.com");
    assert.equal(calls[0].body.updateEnabled, true);
    assert.equal(calls[0].body.attributes.CONSENT_NEWSLETTER, true);
    assert.equal(calls[0].body.attributes.CONSENT_TEXT, "Jeg accepterer at modtage nyheder og guides fra KlinikGuiden på e-mail. Jeg kan altid afmelde mig igen.");
    assert.equal(calls[0].body.attributes.CONSENT_TIMESTAMP, "2026-06-24T10:00:00.000Z");
    assert.equal(calls[0].body.attributes.SIGNUP_PAGE, "/nyhedsbrev.html");
    assert.equal(calls[0].body.attributes.SIGNUP_FORM, "Nyhedsbrevside");
    assert.equal(calls[0].body.attributes.DOUBLE_OPT_IN_STATUS, "pending");
    assert.equal(calls[1].url, "https://api.brevo.com/v3/contacts/doubleOptinConfirmation");
    assert.deepEqual(calls[1].body.includeListIds, [5]);
    assert.equal(calls[1].body.templateId, 24);
  } finally {
    restore();
    global.fetch = previousFetch;
  }
});
