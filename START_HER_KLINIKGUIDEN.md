# Start her - KlinikGuiden

Denne mappe er lavet som dit lokale kontrolcenter til hjemmesiden.

## Det vigtigste

- `klinikguiden_analytics_dashboard.xlsx`: Excel-overblik over data, events, leads, køb og omsætning.
- `analytics-template.csv`: eksempel på rådata-kolonnerne.
- `google-apps-script.js`: koden der skal ligge i Google Sheets Apps Script.
- `STRIPE_SETUP.md`: teknisk Stripe-opsætning til hjemmesiden.
- `STRIPE_KONTO_SETUP.md`: konkret tjekliste til din Stripe-konto.
- `DOMAENE_OPSAETNING_KLINIKGUIDEN.md`: trin-for-trin guide til Simply.com og Netlify.
- `NETLIFY_UPLOAD.md`: hvordan siden uploades til Netlify.
- `LIVE_LAUNCH_CHECKLIST.md`: hvad du skal teste efter upload.
- `klinikguiden-stripe-netlify-source.zip`: Stripe-klar Netlify-pakke med functions.
- `klinikguiden-netlify-upload.zip`: statisk uploadpakke uden Stripe Functions.

## Brug mappen sådan

1. Åbn Excel-dashboardet for at se overblik.
2. Brug Google Sheet-dashboardet til de data, der opdaterer automatisk.
3. Brug Stripe-tjeklisten til at aktivere betaling.
4. Brug live launch checklisten efter hver deploy.

## Status lige nu

Hjemmesiden er lokalt Stripe-klar, men betaling virker først live, når Stripe-nøgler og webhook secret er sat i Netlify.
