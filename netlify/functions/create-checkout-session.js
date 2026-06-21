const STRIPE_API_VERSION = "2026-02-25.clover";

const products = {
  komplette: {
    name: "Forstå din tandlæge - den komplette guide",
    description: "PDF-guide til danske patienter",
    unitAmount: 9900
  },
  boern: {
    name: "Børnenes tandplejeguide",
    description: "PDF-guide til forældre",
    unitAmount: 7900
  }
};

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

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return response(204, {});
  }

  if (event.httpMethod !== "POST") {
    return response(405, { error: "Metoden er ikke tilladt." });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return response(503, {
      error: "Stripe er ikke sat op endnu. Tilføj STRIPE_SECRET_KEY i Netlify."
    });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { error: "Ugyldig forespørgsel." });
  }

  const productKey = payload.product;
  const product = products[productKey];

  if (!product) {
    return response(400, { error: "Ukendt produkt." });
  }

  const siteUrl = (process.env.SITE_URL || event.headers.origin || "https://klinikguiden.com").replace(/\/$/, "");
  const metadata = {
    product: productKey,
    source: "klinikguiden_checkout",
    name: String(payload.name || "").slice(0, 120)
  };

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${siteUrl}/tak.html?checkout=success&product=${encodeURIComponent(productKey)}&session_id={CHECKOUT_SESSION_ID}`);
  params.append("cancel_url", `${siteUrl}/guide-komplette.html?checkout=cancelled&product=${encodeURIComponent(productKey)}`);
  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", "dkk");
  params.append("line_items[0][price_data][unit_amount]", String(product.unitAmount));
  params.append("line_items[0][price_data][product_data][name]", product.name);
  params.append("line_items[0][price_data][product_data][description]", product.description);
  params.append("metadata[product]", metadata.product);
  params.append("metadata[source]", metadata.source);
  params.append("metadata[name]", metadata.name);
  params.append("allow_promotion_codes", "true");
  params.append("billing_address_collection", "auto");

  if (payload.email && String(payload.email).includes("@")) {
    params.append("customer_email", String(payload.email).slice(0, 200));
    params.append("metadata[email]", String(payload.email).slice(0, 200));
  }

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": STRIPE_API_VERSION
    },
    body: params
  });

  const body = await stripeResponse.json();

  if (!stripeResponse.ok) {
    return response(stripeResponse.status, {
      error: "Stripe kunne ikke oprette betaling.",
      stripeError: body.error && body.error.message ? body.error.message : "Ukendt Stripe-fejl"
    });
  }

  return response(200, { url: body.url, id: body.id });
};
