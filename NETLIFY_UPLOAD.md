# KlinikGuiden - upload til Netlify

Denne mappe indeholder en statisk hjemmeside. Den kan uploades gratis til Netlify uden build-step.

Hvis Stripe-betaling skal virke, skal siden deployes med Netlify Functions. Brug derfor Netlify CLI eller Git-deploy med `netlify.toml`.

## Hurtigste gratis metode uden Stripe

1. Gå til Netlify-dashboardet.
2. Vælg din KlinikGuiden-side.
3. Gå til deploys.
4. Upload filen `outputs/klinikguiden-netlify-upload.zip`.
5. Åbn siden og test:
   - Forsiden loader.
   - `/rodbehandling`, `/regningen`, `/besoegsfrekvens` og `/guide-komplette` virker.
   - Nyhedsbrev-formularen sender data til Google Sheet.
   - Bestillings-formularen sender produkt, pris og email til Google Sheet.

## Metode med Stripe

Stripe kræver Netlify Functions, så brug denne metode:

1. Tilføj Stripe-miljøvariabler i Netlify, som beskrevet i `STRIPE_SETUP.md`.
2. Deploy projektet med Netlify CLI eller Git.
3. Netlify bruger `netlify.toml`, hvor:
   - Publish directory er `outputs/klinikguiden-netlify-upload`
   - Functions directory er `netlify/functions`
4. Test checkout-flowet på live-siden.

## Filer der skal med i upload

- Alle `.html`-sider
- `analytics.js`
- `sw.js`
- `site.webmanifest`
- `icon.svg`
- `robots.txt`
- `sitemap.xml`
- `_headers`
- `_redirects`
- `tjekliste_tandlaegebesoeg.pdf`
- `netlify/functions/create-checkout-session.js` hvis Stripe bruges
- `netlify/functions/stripe-webhook.js` hvis Stripe bruges
- `netlify.toml` hvis Stripe/Git/CLI-deploy bruges

## Filer der ikke skal med i upload

- `build_analytics_dashboard.mjs`
- `verify_analytics_dashboard.mjs`
- `generate_checklist_pdf.py`
- `DATAOPSÆTNING.md`
- `STATUS_80_PROCENT.md`
- `analytics-template.csv`
- `google-apps-script.js`
- `outputs/rendered/`
- `tmp_pdf_render/`

## Efter upload

Det vigtigste efter deploy er at teste formularerne på live-siden og se, om nye rækker lander i Google Sheet. Hvis formularerne virker, har du gratis tracking af:

- Sidevisninger
- Guideklik
- Quizbrug
- Beregnerbrug
- PDF-downloads
- Nyhedsbrev-leads
- Bestillinger
- Produktvalg og estimeret omsætning

Hvis Stripe er aktivt, registreres betalte køb via webhooken som `order_form_submit`.
