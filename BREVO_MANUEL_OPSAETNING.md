# Brevo manuel opsaetning

Den automatiske bootstrap-function er beskyttet og maa ikke aabnes uden en fungerende server-side setup-token. Hvis Netlify ikke eksponerer `KG_BREVO_SETUP_TOKEN` til function runtime, skal templates oprettes manuelt i Brevo.

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
9. Kontroller at velkomstmailen sendes via Brevo automation eller template-flow.
10. Klik afmeldingslinket og kontroller i Brevo, at kontakten afmeldes.

## 5. Velkomstmail automation i Brevo

Velkomstmailen maa foerst sendes efter brugeren har bekraeftet double opt-in. Netlify Functionen sender derfor ikke velkomstmailen direkte.

Klik saadan i Brevo:

1. Gaa til `Automation`.
2. Klik `Create an automation` eller `Create workflow`.
3. Vaelg `Create from scratch`, `Blank workflow` eller tilsvarende custom workflow.
4. Vaelg triggeren `A contact is added to a list` / `Contact added to list`.
5. Vaelg listen `KlinikGuiden Nyhedsbrev`.
6. Kontroller at listen har ID `5`.
7. Tilfoej action/handling `Send an email`.
8. Vaelg templaten `KlinikGuiden Velkomstmail`.
9. Aktiver workflowet.

Trigger:

`A contact is added to a list` / `Contact added to list`

Liste:

`KlinikGuiden Nyhedsbrev` med liste-ID `5`

Template:

`KlinikGuiden Velkomstmail`

Hvorfor denne trigger:

Brevos double opt-in flow tilfoejer foerst kontakten til listen, naar brugeren har klikket bekraeftelseslinket. Derfor sender automationen foerst velkomstmail efter bekraeftelse.

Test af automation:

1. Brug en ny testadresse, der ikke allerede ligger paa listen.
2. Tilmeld adressen fra `https://klinikguiden.com/nyhedsbrev.html`.
3. Kontroller at du modtager double opt-in-mailen.
4. Vent med at klikke og kontroller, at velkomstmailen ikke er sendt endnu.
5. Klik bekraeftelseslinket i double opt-in-mailen.
6. Kontroller at du lander paa `https://klinikguiden.com/tak.html?newsletter=confirmed`.
7. Kontroller i Brevo at kontakten nu ligger paa listen `KlinikGuiden Nyhedsbrev`.
8. Kontroller at automationen sender `KlinikGuiden Velkomstmail`.
9. Kontroller at afmeldingslinket i velkomstmailen virker.

## 6. Fremtidige nyhedsbreve

Fremtidige nyhedsbreve sendes fra Brevo:

1. Gaa til `Campaigns` -> `Email`.
2. Opret en ny e-mail-kampagne.
3. Vaelg modtagerlisten `KlinikGuiden Nyhedsbrev` med liste-ID `5`.
4. Brug kun listen som modtager, saa kun bekraeftede kontakter modtager nyhedsbrevet.
5. Send en testmail til dig selv.
6. Planlaeg eller send kampagnen fra Brevo.
