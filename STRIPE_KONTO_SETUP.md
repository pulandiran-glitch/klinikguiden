# Stripe-konto setup til KlinikGuiden

Stripe-konto fundet i connectoren:

- Konto: `acct_1TjtPEJOUr5bkNmc`
- Navn: `klinikguiden.netlify.app`
- API keys: `https://dashboard.stripe.com/acct_1TjtPEJOUr5bkNmc/apikeys`

## Produkter der skal sælges

Stripe Checkout-funktionen på hjemmesiden har allerede disse produkter kodet ind:

| Produkt | Pris | Produktkode |
|---|---:|---|
| Forstå din tandlæge - den komplette guide | 99 kr. | `komplette` |
| Børnenes tandplejeguide | 79 kr. | `boern` |

Der bruges dynamiske Stripe Checkout Sessions. Det betyder, at produkterne ikke behøver ligge som faste Stripe Payment Links for at checkout kan virke. Hjemmesiden opretter checkout-sessionen via Netlify Function.

## Det du skal sætte i Netlify

Gå til Netlify-projektet `klinikguiden` -> Site configuration -> Environment variables.

Tilføj:

```txt
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_SHEET_ENDPOINT=https://script.google.com/macros/s/AKfycbyezQI9c6rX15R9PMnvf5gsSDFo8g_Yv81Yvc88zFiClzOI1iXvYmx1YwOVZMVNbGRbPA/exec
SITE_URL=https://klinikguiden.com
```

Start med `sk_test_...`, ikke live key. Skift først til live key efter test.

## Webhook i Stripe

I Stripe Dashboard:

1. Gå til Developers -> Webhooks.
2. Opret endpoint:
   `https://klinikguiden.com/.netlify/functions/stripe-webhook`
3. Vælg events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
4. Kopiér signing secret.
5. Gem signing secret som `STRIPE_WEBHOOK_SECRET` i Netlify.

## Test betaling

1. Deploy Stripe-versionen af hjemmesiden.
2. Brug test secret key i Netlify.
3. Gå til hjemmesiden og vælg en betalt guide.
4. Gennemfør Stripe Checkout med et Stripe testkort.
5. Bekræft at du lander på `tak.html`.
6. Bekræft at Google Sheet får en række med `order_form_submit`.

## Vigtigt

Del aldrig `STRIPE_SECRET_KEY` eller `STRIPE_WEBHOOK_SECRET` i chat eller i frontend-kode.
De skal kun ligge som environment variables i Netlify.
