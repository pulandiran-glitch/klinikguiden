# Stripe setup til KlinikGuiden

Siden er nu gjort klar til Stripe Checkout via Netlify Functions.

## Hvad integrationen gør

- Kunden vælger en guide på hjemmesiden.
- Siden kalder `/.netlify/functions/create-checkout-session`.
- Netlify-funktionen opretter en Stripe Checkout Session.
- Kunden betaler på Stripes sikre betalingsside.
- Stripe sender kunden tilbage til `tak.html`.
- En Stripe webhook kan registrere betalte køb i Google Sheet.

## Miljøvariabler i Netlify

Tilføj disse i Netlify under projektets environment variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_SHEET_ENDPOINT`
- `SITE_URL`

Eksempel:

- `SITE_URL=https://klinikguiden.com`

`STRIPE_SECRET_KEY` og `STRIPE_WEBHOOK_SECRET` må aldrig ligge i HTML, JavaScript på forsiden eller i Git.

## Stripe webhook

Opret en webhook i Stripe Dashboard med denne URL:

`https://klinikguiden.com/.netlify/functions/stripe-webhook`

Lyt til disse events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Kopier webhook signing secret fra Stripe og gem den som `STRIPE_WEBHOOK_SECRET` i Netlify.

## Produkter

Produkterne er defineret i `netlify/functions/create-checkout-session.js`:

- `komplette`: 99 kr.
- `boern`: 79 kr.

Hvis prisen ændres på hjemmesiden, skal prisen også ændres i funktionen.

## Gebyrer

Stripe kræver ikke et betalt abonnement for denne type integration, men Stripe tager normale transaktionsgebyrer, når en kunde betaler.

## Test

Før livebetaling:

1. Brug Stripe test secret key i Netlify.
2. Gå til hjemmesiden.
3. Vælg en guide og tryk på betaling.
4. Betal med Stripes testkort.
5. Tjek at du lander på `tak.html`.
6. Tjek at webhooken registrerer købet i Google Sheet.

Skift først til live secret key, når testflowet virker.
