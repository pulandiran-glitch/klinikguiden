const assert = require("node:assert/strict");
const test = require("node:test");

const { handler } = require("../../netlify/functions/brevo-newsletter-signup");

const originalEnv = { ...process.env };

function resetEnv(overrides = {}) {
  process.env = {
    ...originalEnv,
    BREVO_API_KEY: "test-api-key",
    BREVO_LIST_ID: "5",
    BREVO_SENDER_EMAIL: "nyheder@klinikguiden.com",
    BREVO_SENDER_NAME: "KlinikGuiden",
    ...overrides
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
      email: "test@example.com",
      name: "Test Person",
      consent: "accepted",
      consent_timestamp: "2026-06-24T08:00:00.000Z",
      signup_page: "/nyhedsbrev.html",
      signup_form: "Nyhedsbrevside",
      ...payload
    })
  };
}

function parseResponse(response) {
  return JSON.parse(response.body);
}

function installBrevoFetchMock() {
  const calls = [];
  global.fetch = async (url, options = {}) => {
    const body = options.body ? JSON.parse(options.body) : null;
    calls.push({
      url,
      path: new URL(url).pathname,
      method: options.method || "GET",
      body
    });

    return {
      ok: true,
      status: 200,
      async text() {
        return JSON.stringify({ id: 123 });
      }
    };
  };
  return calls;
}

test.afterEach(() => {
  process.env = { ...originalEnv };
  delete global.fetch;
});

test("afviser tilmelding uden aktivt samtykke", async () => {
  resetEnv();
  const calls = installBrevoFetchMock();

  const response = await handler(signupEvent({ consent: "" }));
  const body = parseResponse(response);

  assert.equal(response.statusCode, 400);
  assert.match(body.error, /aktivt acceptere/);
  assert.equal(calls.length, 0);
});

test("afviser tilmelding naar BREVO_API_KEY mangler", async () => {
  resetEnv({ BREVO_API_KEY: "" });
  const calls = installBrevoFetchMock();

  const response = await handler(signupEvent());
  const body = parseResponse(response);

  assert.equal(response.statusCode, 503);
  assert.match(body.error, /BREVO_API_KEY/);
  assert.equal(calls.length, 0);
});

test("afviser tilmelding naar BREVO_LIST_ID mangler", async () => {
  resetEnv({ BREVO_LIST_ID: "" });
  const calls = installBrevoFetchMock();

  const response = await handler(signupEvent());
  const body = parseResponse(response);

  assert.equal(response.statusCode, 503);
  assert.match(body.error, /BREVO_LIST_ID/);
  assert.equal(calls.length, 0);
});

test("double opt-in bruger Brevos doubleOptinConfirmation endpoint", async () => {
  resetEnv({
    BREVO_DOUBLE_OPTIN_TEMPLATE_ID: "42",
    BREVO_REDIRECT_URL_AFTER_CONFIRMATION: "https://klinikguiden.com/tak.html?newsletter=confirmed",
    BREVO_WELCOME_TEMPLATE_ID: "43"
  });
  const calls = installBrevoFetchMock();

  const response = await handler(signupEvent());
  const body = parseResponse(response);

  assert.equal(response.statusCode, 200);
  assert.equal(body.doubleOptIn, true);
  assert.equal(calls[0].path, "/v3/contacts/doubleOptinConfirmation");
  assert.deepEqual(calls[0].body.includeListIds, [5]);
  assert.equal(calls[0].body.templateId, 42);
  assert.equal(calls[0].body.redirectionUrl, "https://klinikguiden.com/tak.html?newsletter=confirmed");
});

test("velkomstmail sendes ikke direkte i double opt-in-flowet", async () => {
  resetEnv({
    BREVO_DOUBLE_OPTIN_TEMPLATE_ID: "42",
    BREVO_REDIRECT_URL_AFTER_CONFIRMATION: "https://klinikguiden.com/tak.html?newsletter=confirmed",
    BREVO_WELCOME_TEMPLATE_ID: "43"
  });
  const calls = installBrevoFetchMock();

  const response = await handler(signupEvent());
  const body = parseResponse(response);

  assert.equal(response.statusCode, 200);
  assert.equal(body.doubleOptIn, true);
  assert.equal(calls.some((call) => call.path === "/v3/smtp/email"), false);
});

test("samtykkedata gemmes uden at tilfoeje kontakten til listen i double opt-in-flowet", async () => {
  resetEnv({
    BREVO_DOUBLE_OPTIN_TEMPLATE_ID: "42",
    BREVO_REDIRECT_URL_AFTER_CONFIRMATION: "https://klinikguiden.com/tak.html?newsletter=confirmed"
  });
  const calls = installBrevoFetchMock();

  const response = await handler(signupEvent());

  assert.equal(response.statusCode, 200);
  assert.equal(calls[1].path, "/v3/contacts");
  assert.equal(calls[1].body.email, "test@example.com");
  assert.equal(calls[1].body.updateEnabled, true);
  assert.equal(Object.hasOwn(calls[1].body, "listIds"), false);
  assert.equal(calls[1].body.attributes.DOUBLE_OPT_IN_STATUS, "pending");
});

test("velkomstmail sendes kun i fallback-flow uden double opt-in", async () => {
  resetEnv({
    BREVO_DOUBLE_OPTIN_TEMPLATE_ID: "",
    BREVO_REDIRECT_URL_AFTER_CONFIRMATION: "",
    BREVO_WELCOME_TEMPLATE_ID: "43"
  });
  const calls = installBrevoFetchMock();

  const response = await handler(signupEvent());
  const body = parseResponse(response);

  assert.equal(response.statusCode, 200);
  assert.equal(body.doubleOptIn, false);
  assert.equal(body.welcomeEmail, "sent");
  assert.deepEqual(
    calls.map((call) => call.path),
    ["/v3/contacts", "/v3/smtp/email"]
  );
  assert.deepEqual(calls[0].body.listIds, [5]);
  assert.equal(calls[1].body.templateId, 43);
});
