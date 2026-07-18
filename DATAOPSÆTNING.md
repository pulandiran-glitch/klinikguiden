# KlinikGuiden dataopsætning

Denne opsætning koster ikke noget og bruger Google Sheets + Google Apps Script.

## Hvad bliver målt?

Hjemmesiden sender besøgsstatistik til et Google Sheet via Google Apps Script, når brugere har accepteret statistik. Der kan blandt andet behandles:

- besøger siden
- besøger som ny eller tilbagevendende bruger
- kommer fra Google, sociale medier, direkte trafik eller andre henvisninger
- besøger guide-undersider
- klikker på CTA-knapper
- klikker på produktkort
- vælger svar i quizzen
- bruger tilskudsberegneren
- downloader tjeklisten
- sender nyhedsbrev-formularen
- sender bestillingsformularen
- oplever JavaScript-fejl på siden
- sessions-id/UUID
- referrer
- tidspunkt
- skærmstørrelse
- IP-adresse

Google Apps Script er modtageren af dataene.

## Opret Google Sheet

1. Opret et nyt Google Sheet, fx `KlinikGuiden data`.
2. Gå til `Udvidelser` -> `Apps Script`.
3. Kopiér indholdet fra `google-apps-script.js` ind i Apps Script.
4. Gem projektet.
5. Kør funktionen `setup` én gang. Den opretter rådata, dashboard, rapporter og AI-analyse.
6. Kør funktionen `setupReportTriggers` én gang. Den opretter daglige og ugentlige rapporter.
7. Vælg `Deploy` -> `New deployment`.
8. Vælg type `Web app`.
9. Sæt `Execute as` til `Me`.
10. Sæt adgang til `Anyone`.
11. Kopiér Web app URL'en.

## Sæt URL'en i hjemmesiden

I `analytics.js` skal denne linje pege på din Web app URL:

```js
const endpoint = 'DIN_WEB_APP_URL_HER';
```

Der ligger allerede en URL i filen. Hvis den er din aktive Apps Script URL, behøver du ikke ændre den.

## Brug i Excel

Hvis du hellere vil se data i Excel:

1. Eksportér Google Sheet som `.xlsx` med jævne mellemrum.
2. Brug `analytics-template.csv` som reference for kolonnerne.
3. Brug dashboard-filen `klinikguiden_analytics_dashboard.xlsx` til overblik over events, leads og bestillinger.

## Vigtige noter

- Tracking gemmer en anonym session-id for at kunne tælle handlinger pr. besøg.
- Den anonyme session-id gemmes først, når brugeren accepterer statistik.
- Formularer gemmer navn og email, fordi brugeren selv sender dem.
- Undgå at gemme sundhedsoplysninger i fritekstfelter.
- Google Sheets er fint til starten. Når siden får meget trafik, bør tracking flyttes bag en Netlify Function.

## Events der sendes fra siden

De vigtigste eventnavne er:

- `page_view`
- `guide_page_view`
- `hero_free_guides`
- `hero_products`
- `product_complete_guide_click`
- `product_children_guide_click`
- `product_course_waitlist_click`
- `quiz_answer_selected`
- `subsidy_calculated`
- `newsletter_signup`
- `product_page_view`
- `pdf_download_started`
- `order_form_submit`
- `waitlist_signup`
- `thank_you_page_view`

## Dashboard i Google Sheets

Når `setup` er kørt, får arket to faner:

- `KlinikGuiden data`: rådata fra hjemmesiden.
- `Dashboard`: nøgletal der opdaterer sig selv med formler, inkl. bestillinger, produktvalg og estimeret omsætning.

Du kan altid eksportere Google Sheet til Excel, men Google Sheet-dashboardet er den del, der opdaterer automatisk.

Dashboardet viser:

- Besøgende i dag
- Besøgende denne uge
- Besøgende denne måned
- Sidevisninger
- Mest besøgte artikler
- Trafikkilder
- Nye e-mailtilmeldinger
- PDF-downloads
- Konverteringsrate
- Tilbagevendende besøgende
- Eventuelle registrerede fejl

## Automatiske rapporter

Når `setupReportTriggers` er kørt:

- `createDailyReport` kører dagligt omkring kl. 07.
- `createWeeklyReport` kører mandag omkring kl. 08.
- Rapporterne gemmes i fanen `Rapporter`.
- Hvis Google-kontoen tillader det, sendes rapporten også til din egen email.

Daglig rapport viser:

- Dagens besøgende
- Dagens e-mailtilmeldinger
- Dagens PDF-downloads
- Eventuelle fejl

Ugentlig rapport viser:

- Ugens trafik
- Konverteringsrate
- Henvisning til topartikler og trafikkilder
- Forslag til SEO- og indholdsarbejde

## Samtykke

Statistik-events sendes kun efter brugeren har trykket `Accepter statistik`.
Hvis brugeren vælger `Nej tak`, fungerer formularer stadig, men klik og sidevisninger sendes ikke som analytics-events.
Brugeren kan senere ændre eller trække samtykket tilbage via statistikbanneret.

## Køb og omsætning

Der er ikke et aktivt betalingsflow i den nuværende opsætning. `create-checkout-session` returnerer derfor et deaktiveret svar, og sitet bør ikke præsentere checkout som en aktiv funktion.

Hvis der senere indføres et rigtigt betalingsflow, skal eventnavne, tak-sider og dokumentation opdateres samtidig, så brugerfladen og backend beskriver den samme virkelighed.

## GA4, Search Console og Netlify Analytics

Det lokale Google Sheet-dashboard fungerer uden betalte værktøjer.

Ekstra integrationer:

- Google Analytics 4 kræver en GA4 property og et måle-ID.
- Google Search Console kræver domæneverificering for `klinikguiden.com`.
- Netlify Analytics kan være relevant, men er typisk en betalt Netlify-funktion.
- E-mailsystem kan tilføjes senere, fx nyhedsbrevsværktøj eller Google Sheets-baseret eksport.

Kontrolcenteret på skrivebordet samler links og instruktioner til det hele i én fil.
