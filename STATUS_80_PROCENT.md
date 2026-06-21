# KlinikGuiden - status mod 80% klar

## Implementeret lokalt

- Dansk forside med guides, quiz, tilskudsberegner, produkter, gratis PDF og kontaktformular.
- Lokale guide-sider: rodbehandling, tandlægeregning, tandlægeangst, børn, besøgsfrekvens og bedøvelse.
- Lokal produktside for den komplette guide.
- Privatlivsside med kort forklaring af data og formularer.
- Gratis tracking til Google Sheets via Apps Script.
- Samtykke-banner til anonym statistik.
- Automatisk dashboard-fane i Google Sheets via `setup`-funktionen.
- Mere robust formularindsendelse til Google Apps Script med `no-cors`.
- Tak-side til senere betalingsflow, mailbekræftelser eller redirect efter formular.
- Excel-dashboard til overblik over sidevisninger, leads, bestillinger, quiz, downloads, produktvalg og estimeret omsætning.
- Produktfordeling i både Excel-dashboard og Google Sheets-dashboard, så bestillinger kan deles op på komplet guide, børneguide og venteliste.
- PDF-tjekliste til tandlægebesøg.
- PWA-grundlag med manifest, ikon og service worker.
- SEO-filer: `robots.txt`, `sitemap.xml`, canonical tags og favicon.
- Netlify-filer til headers og redirects.
- Alle primære interne links kan nu fungere fra denne mappe alene ved deploy.
- Lokal kontrol af HTML-links, JavaScript-syntaks, nødvendige filer og Excel-formler.
- Render-testet lokalt i browser på desktop og mobilbredde uden konsolfejl eller vandret overflow.
- Forsiden har fået renere formular-styling, færre inline-styles og mere ærlige tillidssignaler uden udokumenterede tal.
- Ren Netlify-uploadpakke oprettet som `outputs/klinikguiden-netlify-upload.zip` med kun produktionsfiler.
- Stripe-klar Netlify-pakke oprettet som `outputs/klinikguiden-stripe-netlify-source.zip` med `netlify.toml` og functions.
- Dansk uploadvejledning til Netlify tilføjet i `NETLIFY_UPLOAD.md`.
- Live-checkliste til efter deploy tilføjet i `LIVE_LAUNCH_CHECKLIST.md`.
- Stripe Checkout-kode tilføjet med Netlify Function og webhook til Google Sheet-registrering af betalte køb.

## Stadig vigtigt før live-lancering

- Upload `outputs/klinikguiden-netlify-upload.zip` til det rigtige Netlify-projekt, eller deploy de samme produktionsfiler via CLI.
- Live-siden viser stadig den gamle version, indtil den nye upload/deploy er gennemført.
- Bekræft at `endpoint` i `analytics.js` er den rigtige Web App URL fra dit eget Google Sheet.
- Tilføj Stripe environment variables i Netlify: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GOOGLE_SHEET_ENDPOINT` og `SITE_URL`.
- Test formularerne på live-siden efter deploy.
- Tjek at redirects virker på Netlify: `/rodbehandling`, `/regningen`, `/besoegsfrekvens` og `/guide-komplette`.
- Test at Google Apps Script modtager formularer på live-siden efter deploy.
- Gennemgå de hardcodede tilskudssatser i beregneren, før siden markedsføres bredt.
- Test Stripe Checkout i test mode og skift først til live key, når flowet virker.

## Live-status

Netlify-projektet `klinikguiden` er fundet med URL `https://klinikguiden.com/`.
Den nuværende live-side er ikke opdateret med de seneste lokale ændringer endnu.
Efter upload skal `LIVE_LAUNCH_CHECKLIST.md` bruges til at bekræfte den nye version og Google Sheet-dataflowet.

Stripe-koden er klar lokalt, men kan ikke tage rigtige betalinger før Stripe-nøgler og webhook secret er sat i Netlify.
Netlify CLI kunne ikke køres i dette lokale miljø, fordi `npx`, `npm` og `netlify` ikke findes i shellen.

## Gratis dataflow

1. Brug `google-apps-script.js` i et Google Sheet.
2. Deploy scriptet som Web App.
3. Indsæt Web App URL'en som `endpoint` i `analytics.js`.
4. Brug Google Sheet-fanen `Dashboard` til automatisk overblik.
5. Brug `outputs/klinikguiden_analytics_dashboard.xlsx` som ekstra Excel-overblik eller lokal model.

## Vurdering

Lokalt er siden nu tæt på en brugbar MVP. Den er ikke fuldt live-klar, før deploy, formular-test og Google Sheet-kobling er verificeret på den rigtige Netlify-side.
