# KlinikGuiden

KlinikGuiden er en dansk patientrettet vidensplatform om tandpleje, tandbehandlinger, priser og patientforståelse.

## Nyhedsbrev med Brevo og Netlify

Nyhedsbrev-formularerne sender til en Netlify Function: `/.netlify/functions/brevo-newsletter-signup`.

Formularerne findes på:

1. Forsidens PDF-downloadsektion.
2. Forsidens footer.
3. `nyhedsbrev.html`.

Alle formularer bruger stadig Netlify Forms som backup med formularnavnet `newsletter-signup`.

## GDPR-felter

Nyhedsbrevet indsamler kun:

1. Navn.
2. E-mail.
3. Samtykkeoplysninger.

Der indsamles ikke adresse, telefonnummer, fødselsdato eller helbredsoplysninger til nyhedsbrevet.

Følgende Brevo-attributter bør oprettes i Brevo:

1. `FIRSTNAME`
2. `EMAIL`
3. `CONSENT_NEWSLETTER`
4. `CONSENT_TEXT`
5. `CONSENT_TIMESTAMP`
6. `CONSENT_SOURCE`
7. `SIGNUP_PAGE`
8. `SIGNUP_FORM`
9. `DOUBLE_OPT_IN_STATUS`

Samtykketeksten er:

`Jeg accepterer at modtage nyheder og guides fra KlinikGuiden på e-mail. Jeg kan altid afmelde mig igen.`

## Brevo status endpoint

Efter deploy kan opsætningen kontrolleres uden at vise API-nøglen:

`https://klinikguiden.com/.netlify/functions/brevo-newsletter-status`

Endpointet viser:

1. Om `BREVO_API_KEY` findes.
2. Om `BREVO_LIST_ID=5` er sat.
3. Om `BREVO_WELCOME_TEMPLATE_ID` er sat og kan findes i Brevo.
4. Om `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` er sat og kan findes i Brevo.
5. Om double opt-in og velkomstmail-grundlaget er klar.

Endpointet viser ikke API-nøglen og viser ikke persondata.

## Netlify environment variables

Sæt disse i Netlify under `Site configuration` -> `Environment variables`:

1. `BREVO_API_KEY`
2. `BREVO_LIST_ID=5`
3. `BREVO_SENDER_EMAIL`
4. `BREVO_SENDER_NAME`
5. `BREVO_WELCOME_TEMPLATE_ID`
6. `BREVO_DOUBLE_OPTIN_TEMPLATE_ID`
7. `BREVO_REDIRECT_URL_AFTER_CONFIRMATION`

`BREVO_API_KEY` og `BREVO_LIST_ID` kræves for at skrive kontakter til Brevo.

Double opt-in er et krav. Funktionen afviser tilmeldinger med `503`, hvis `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` eller `BREVO_REDIRECT_URL_AFTER_CONFIRMATION` mangler. Funktionen sender aldrig velkomstmail direkte; velkomstmailen skal sendes fra Brevo automation efter brugerens bekræftelse.

Krav i Netlify:

1. `BREVO_API_KEY`
2. `BREVO_LIST_ID=5`
3. `BREVO_SENDER_EMAIL=nyheder@klinikguiden.com`
4. `BREVO_SENDER_NAME=KlinikGuiden`
5. `BREVO_REDIRECT_URL_AFTER_CONFIRMATION=https://klinikguiden.com/tak.html?newsletter=confirmed`
6. `BREVO_DOUBLE_OPTIN_TEMPLATE_ID`
7. `BREVO_WELCOME_TEMPLATE_ID`

`nyheder@klinikguiden.com` bør først bruges til rigtige udsendelser, når `klinikguiden.com` er verificeret i Brevo. Hvis domænet ikke er verificeret endnu, kan Brevo afvise afsendelse eller give dårlig leverbarhed. Brug kun `kontakt@klinikguiden.com` midlertidigt, hvis den adresse allerede er verificeret i Brevo.

Færdige HTML-templates ligger i:

1. `brevo-templates/klinikguiden-double-opt-in.html`
2. `brevo-templates/klinikguiden-velkomstmail.html`

Se også `BREVO_MANUEL_OPSAETNING.md` for den korte trin-for-trin opsætning.

## Manuel Brevo-opsætning

Fordi `BREVO_API_KEY` ligger sikkert som secret i Netlify, kan koden bruge den ved tilmelding. Den bør ikke læses ud i terminalen eller vises i browseren.

Kontaktliste:

1. Log ind i Brevo.
2. Gå til `Contacts`.
3. Opret eller find listen `KlinikGuiden Nyhedsbrev`.
4. Kontroller at liste-ID'et er `5`.
5. Sæt `BREVO_LIST_ID=5` i Netlify.

Attributter:

1. Gå til `Contacts` -> `Settings` -> `Contact attributes`.
2. Opret de manglende attributter fra afsnittet `GDPR-felter`.
3. Brug boolean til `CONSENT_NEWSLETTER`.
4. Brug tekst/date-tekst til samtykketekst, tidspunkt, kilde, side og formular.

Double opt-in template:

1. Gå til Brevos templates.
2. Opret en template til double opt-in.
3. Brug emne som `Bekræft din tilmelding til KlinikGuiden`.
4. Indsæt Brevos double opt-in link i knappen/linket. Brevo API-dokumentationen angiver tagget `{{ params.DOIurl }}` til dette link.
5. Kopier template-ID'et.
6. Sæt værdien som `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` i Netlify.
7. Sæt `BREVO_REDIRECT_URL_AFTER_CONFIRMATION` til `https://klinikguiden.com/tak.html?newsletter=confirmed`.
8. Kontroller at `tak.html?newsletter=confirmed` viser beskeden: `Tak. Din e-mail er nu bekræftet, og du er tilmeldt nyheder fra KlinikGuiden.`

Velkomstmail:

1. Opret en Brevo e-mail-template til velkomstmail.
2. Emneforslag: `Velkommen til KlinikGuiden`.
3. Brug en kort velkomsttekst og link til `https://klinikguiden.com/vidensbase.html`.
4. Indsæt Brevos standard unsubscribe-blok eller standard afmeldingslink.
5. Kopier template-ID'et.
6. Sæt værdien som `BREVO_WELCOME_TEMPLATE_ID` i Netlify.

Automation for velkomstmail:

1. Gå til `Automation` i Brevo.
2. Klik `Create an automation` eller `Create workflow`.
3. Vælg en blank/custom automation, hvis Brevo viser flere skabeloner.
4. Vælg triggeren `A contact is added to a list` / `Contact added to list`.
5. Vælg listen `KlinikGuiden Nyhedsbrev` med liste-ID `5`.
6. Tilføj handlingen `Send an email`.
7. Vælg templaten `KlinikGuiden Velkomstmail`.
8. Sørg for at workflowet kun starter for kontakter, der er kommet på listen efter double opt-in. Brevo double opt-in lægger først kontakten på listen efter bekræftelsen, så denne trigger er den rigtige.
9. Slå automationen til.

Funktionen sender derfor ikke velkomstmail direkte i double opt-in-flowet. Den gemmer samtykkeoplysninger og beder Brevo sende bekræftelsesmailen. Velkomstmailen kommer først, når Brevo efter bekræftelsen placerer kontakten på liste `5`.

Anbefalet flow:

1. Brugeren indtaster navn og e-mail.
2. Brugeren accepterer samtykke aktivt.
3. Brevo sender double opt-in mail.
4. Brugeren bekræfter sin e-mail.
5. Først derefter starter velkomstmail eller automation i Brevo.

## Afmeldingslink

Afmeldingslinket skal ligge i Brevo-template eller Brevo-nyhedsbrevets standard footer.

Test:

1. Tilmeld en test-e-mail.
2. Modtag double opt-in-mailen.
3. Kontroller i Brevo, at kontakten endnu ikke er endeligt tilmeldt nyhedsbrevslisten før klik på bekræftelseslinket.
4. Klik bekræftelseslinket.
5. Kontroller at du lander på `https://klinikguiden.com/tak.html?newsletter=confirmed`.
6. Kontroller at kontakten ligger på listen `KlinikGuiden Nyhedsbrev` / ID `5`.
7. Kontroller at velkomstmailen sendes fra automationen.
8. Kontroller at afmeldingslinket er synligt.
9. Klik afmeldingslinket.
10. Kontroller i Brevo, at kontakten er afmeldt.

Brevo håndterer afmelding, når standard unsubscribe-blokken bruges korrekt.

## DNS for klinikguiden.com

DNS-værdierne skal kopieres fra Brevo, fordi Brevo genererer konkrete hostnames og værdier til kontoen.

Opret eller kontroller disse records hos DNS-udbyderen for `klinikguiden.com`:

1. Brevo code: normalt en TXT-record med hostname og value fra Brevo.
2. DKIM: enten to CNAME-records eller en TXT-record, afhængigt af hvad Brevo viser.
3. DMARC: TXT-record på `_dmarc.klinikguiden.com`.

Anbefalet startværdi for DMARC, hvis Brevo ikke giver en anden:

`v=DMARC1; p=none; rua=mailto:klinikguiden@gmail.com`

Når mailflowet er testet, kan DMARC senere strammes til `quarantine` eller `reject`.

Brevo-domænet skal stå som verificeret/authenticated, før `nyheder@klinikguiden.com` eller en anden domæneadresse bør bruges som afsender.

## Sletning, eksport og afmelding i Brevo

Find en kontakt:

1. Åbn Brevo.
2. Gå til `Contacts`.
3. Søg på e-mailadressen.

Eksporter en kontakt:

1. Åbn kontakten eller kontaktlisten.
2. Brug Brevos eksportfunktion.

Afmeld en kontakt:

1. Åbn kontakten.
2. Marker kontakten som afmeldt fra e-mailmarketing, eller fjern kontakten fra nyhedsbrevslisten.

Slet en kontakt:

1. Åbn kontakten.
2. Brug Brevos slettefunktion.
3. Bekræft sletning.

## Netlify Forms backup

Netlify Forms bruges kun som backup af tilmeldinger.

Find tilmeldinger:

1. Gå til Netlify-dashboardet.
2. Åbn projektet `klinikguiden`.
3. Gå til `Forms`.
4. Vælg formularen `newsletter-signup`.

Slet Netlify Forms-data:

1. Åbn formularen `newsletter-signup`.
2. Find den relevante submission.
3. Slet submission i Netlify.

Eksport:

1. Åbn formularen `newsletter-signup`.
2. Brug Netlifys eksportfunktion til CSV.

## Databehandlere

KlinikGuiden bruger:

1. Brevo til nyhedsbrev, kontaktliste, samtykkeoplysninger og e-mail.
2. Netlify til hosting, formularer og serverless functions.

## Cookie og tracking

KlinikGuidens frontend-kode aktiverer ikke Brevo tracking.

Brevo kan understøtte åbnings- og kliktracking i e-mails, hvis det aktiveres i Brevo. Hvis det bruges, skal privatlivspolitikken opdateres, og brugerne skal kunne se det tydeligt.

## Test efter deploy

1. Åbn `https://klinikguiden.com`.
2. Kontroller at samtykkefeltet ikke er forhåndsafkrydset.
3. Kontroller at formularen ikke kan sendes uden samtykke.
4. Send en testtilmelding med aktivt samtykke.
5. Kontroller at kontakten oprettes i Brevo.
6. Kontroller at samtykkedata gemmes på kontakten.
7. Kontroller at double opt-in virker.
8. Kontroller at afmeldingslinket findes i mailen.
9. Kontroller at Brevo registrerer afmelding.
10. Kontroller at `privatlivspolitik.html` virker.
11. Kontroller at footer-linket til privatlivspolitik virker.
12. Kontroller at ingen API keys vises i frontend.
13. Kontroller at Netlify logs ikke indeholder unødige persondata.
14. Åbn `/.netlify/functions/brevo-newsletter-status` og kontroller at opsætningen står klar.

## Juridisk note

Denne opsætning er lavet efter GDPR-principper om samtykke, dataminimering og gennemsigtighed, men bør gennemgås juridisk før større annoncering, betalt leadindsamling eller kommerciel skalering.
