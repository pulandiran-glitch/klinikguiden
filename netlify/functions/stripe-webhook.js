const crypto = require("crypto");

function getRawBody(event) {
  if (!event.body) return "";
  return event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
}

function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    })
  );

  if (!parts.t || !parts.v1) return false;

  const signedPayload = `${parts.t}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  const actual = parts.v1;

  if (expected.length !== actual.length) return false;

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

async function postToSheet(session) {
  if (!process.env.GOOGLE_SHEET_ENDPOINT) return;

  const product = session.metadata && session.metadata.product ? session.metadata.product : "";
  const amount = session.amount_total ? String(Math.round(session.amount_total / 100)) : "";
  const email = session.customer_details && session.customer_details.email
    ? session.customer_details.email
    : session.customer_email || (session.metadata && session.metadata.email) || "";
  const name = session.customer_details && session.customer_details.name
    ? session.customer_details.name
    : (session.metadata && session.metadata.name) || "";

  const body = new URLSearchParams({
    type: "order",
    event: "order_form_submit",
    page: "stripe_checkout",
    path: "/.netlify/functions/stripe-webhook",
    timestamp: new Date().toISOString(),
    name,
    email,
    guide: product,
    product,
    price: amount,
    value: amount,
    sessionId: session.id || "",
    referrer: "stripe",
    details: JSON.stringify({
      source: "stripe_webhook",
      payment_status: session.payment_status,
      checkout_session_id: session.id
    })
  });

  await fetch(process.env.GOOGLE_SHEET_ENDPOINT, {
    method: "POST",
    body
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return { statusCode: 503, body: "Missing STRIPE_WEBHOOK_SECRET" };
  }

  const rawBody = getRawBody(event);
  const signature = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  if (!verifyStripeSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)) {
    return { statusCode: 400, body: "Invalid signature" };
  }

  const stripeEvent = JSON.parse(rawBody);

  if (stripeEvent.type === "checkout.session.completed" || stripeEvent.type === "checkout.session.async_payment_succeeded") {
    await postToSheet(stripeEvent.data.object);
  }

  return { statusCode: 200, body: "ok" };
};
