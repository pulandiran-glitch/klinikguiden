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

## Netlify environment variables

Sæt disse i Netlify under `Site configuration` -> `Environment variables`:

1. `BREVO_API_KEY`
2. `BREVO_LIST_ID`
3. `BREVO_SENDER_EMAIL`
4. `BREVO_SENDER_NAME`
5. `BREVO_WELCOME_TEMPLATE_ID`
6. `BREVO_DOUBLE_OPTIN_TEMPLATE_ID`
7. `BREVO_REDIRECT_URL_AFTER_CONFIRMATION`

`BREVO_API_KEY` og `BREVO_LIST_ID` kræves for at skrive kontakter til Brevo.

Double opt-in aktiveres automatisk i funktionen, når både `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` og `BREVO_REDIRECT_URL_AFTER_CONFIRMATION` findes.

Hvis double opt-in ikke er sat op, oprettes eller opdateres kontakten direkte i Brevo. Velkomstmail sendes kun, hvis `BREVO_WELCOME_TEMPLATE_ID` findes.

## Manuel Brevo-opsætning

1. Opret en kontaktliste til KlinikGuiden-nyhedsbrevet.
2. Opret attributterne fra afsnittet `GDPR-felter`.
3. Opret en double opt-in template i Brevo.
4. Indsæt Brevos bekræftelseslink i double opt-in templaten.
5. Opret en velkomstmail-template.
6. Sørg for, at velkomstmail og nyhedsbreve indeholder Brevos unsubscribe-blok eller standard afmeldingslink.
7. Sæt miljøvariablerne i Netlify.
8. Test en rigtig tilmelding med en test-e-mail.

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
2. Modtag double opt-in og/eller velkomstmail.
3. Kontroller at afmeldingslinket er synligt.
4. Klik afmeldingslinket.
5. Kontroller i Brevo, at kontakten er afmeldt.

Brevo håndterer afmelding, når standard unsubscribe-blokken bruges korrekt.

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
7. Kontroller at double opt-in virker, hvis det er aktivt.
8. Kontroller at afmeldingslinket findes i mailen.
9. Kontroller at Brevo registrerer afmelding.
10. Kontroller at `privatliv.html` virker.
11. Kontroller at footer-linket til privatlivspolitik virker.
12. Kontroller at ingen API keys vises i frontend.
13. Kontroller at Netlify logs ikke indeholder unødige persondata.

## Juridisk note

Denne opsætning er lavet efter GDPR-principper om samtykke, dataminimering og gennemsigtighed, men bør gennemgås juridisk før større annoncering, betalt leadindsamling eller kommerciel skalering.
