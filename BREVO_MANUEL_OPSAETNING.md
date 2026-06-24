# Brevo manuel opsaetning

Den automatiske bootstrap-function er beskyttet og maa ikke aabnes uden en fungerende server-side setup-token. Hvis Netlify ikke eksponerer `KG_BREVO_SETUP_TOKEN` til function runtime, skal templates oprettes manuelt i Brevo.

Status: live status-endpointet er `ok: true`. `BREVO_LIST_ID=5`, double opt-in template, velkomstmail template og redirect URL er verificeret i Netlify/Brevo.

GitHub `main` og Netlify Git-deploy er source of truth for Brevo-funktionen. Brug ikke `outputs/klinikguiden-netlify-upload` eller en gammel manuel upload-zip som kilde til Brevo-function-kode.

## 1. Double opt-in template

1. Log ind i Brevo.
2. Gaa til `Transactional` -> `Templates`.
3. Klik `New template`.
4. Template name: `KlinikGuiden Double Opt-in`.
5. Subject: `Bekraeft din tilmelding til KlinikGuiden`.
6. Sender: `KlinikGuiden` og den verificerede afsenderadresse.
7. Vaelg HTML-editor/source mode.
8. Indsaet hele indholdet fra:

`brevo-templates/klinikguiden-double-opt-in.html`

Vigtigt: Knappen skal bruge Brevos double opt-in link:

`{{ params.DOIurl }}`

9. Gem og aktiver templaten.
10. Kopier template-ID'et fra Brevo.
11. Opret/opdater Netlify environment variable:

`BREVO_DOUBLE_OPTIN_TEMPLATE_ID=<template-id>`

## 2. Velkomstmail template

1. Gaa til `Transactional` -> `Templates`.
2. Klik `New template`.
3. Template name: `KlinikGuiden Velkomstmail`.
4. Subject: `Velkommen til KlinikGuiden`.
5. Sender: `KlinikGuiden` og den verificerede afsenderadresse.
6. Vaelg HTML-editor/source mode.
7. Indsaet hele indholdet fra:

`brevo-templates/klinikguiden-velkomstmail.html`

8. Kontroller afmeldingslinket nederst.
9. Hvis Brevo-editoren ikke accepterer `{{ unsubscribe }}`, skal Brevos egen standard unsubscribe-blok/link indsattes i stedet for den nederste afmeldingslinje.
10. Gem og aktiver templaten.
11. Kopier template-ID'et fra Brevo.
12. Opret/opdater Netlify environment variable:

`BREVO_WELCOME_TEMPLATE_ID=<template-id>`

## 3. Netlify environment variables

Disse skal findes i Netlify:

1. `BREVO_API_KEY`
2. `BREVO_LIST_ID=5`
3. `BREVO_SENDER_EMAIL`
4. `BREVO_SENDER_NAME`
5. `BREVO_REDIRECT_URL_AFTER_CONFIRMATION=https://klinikguiden.com/tak.html?newsletter=confirmed`
6. `BREVO_DOUBLE_OPTIN_TEMPLATE_ID=<double-opt-in-template-id>`
7. `BREVO_WELCOME_TEMPLATE_ID=<velkomstmail-template-id>`

Efter de to template-ID'er er sat, redeploy sitet.

## 4. Test

1. Aabn `https://klinikguiden.com/.netlify/functions/brevo-newsletter-status`.
2. Kontroller at `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` og `BREVO_WELCOME_TEMPLATE_ID` er configured og verified.
3. Test tilmelding uden samtykke. Den skal afvises.
4. Test gyldig tilmelding med en e-mail, du kan aabne.
5. Kontroller at double opt-in mailen ankommer.
6. Klik bekraeftelseslinket.
7. Kontroller at du lander paa `https://klinikguiden.com/tak.html?newsletter=confirmed`.
8. Kontroller at kontakten ligger paa liste ID 5.
9. Kontroller at velkomstmailen sendes via Brevo automation efter bekræftet double opt-in.
10. Klik afmeldingslinket og kontroller i Brevo, at kontakten afmeldes.

## 5. Velkomstmail automation

Velkomstmail via Brevo automation er et krav i double opt-in-flowet.

1. Automation skal foerst starte, naar kontakten har bekraeftet double opt-in.
2. Automation skal sende `KlinikGuiden Velkomstmail`.
3. Netlify-funktionen maa ikke sende velkomstmail direkte foer double opt-in er bekraeftet.
