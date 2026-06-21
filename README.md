# KlinikGuiden

KlinikGuiden er en dansk patientrettet vidensplatform om tandpleje, tandbehandlinger, priser og patientforståelse.

## Nyhedsbrev

Nyhedsbrevet bruger Netlify Forms med formularnavnet `newsletter-signup`.

Tilmeldinger findes i Netlify:

1. Gå til Netlify-dashboardet.
2. Åbn projektet `klinikguiden`.
3. Gå til `Forms`.
4. Vælg formularen `newsletter-signup`.

Eksport af e-mails:

1. Åbn formularen `newsletter-signup`.
2. Brug Netlifys eksportfunktion til CSV.
3. Gem CSV-filen lokalt og importer den i det e-mailværktøj, der vælges senere.

Senere integration med Mailchimp, Brevo eller ConvertKit:

1. Eksporter først tilmeldinger fra Netlify Forms som CSV.
2. Importer CSV-filen i Mailchimp, Brevo eller ConvertKit.
3. Når et værktøj er valgt, kan formularens `action` eller en Netlify Function kobles til værktøjets API.
4. Behold samtykkefeltet, så consent følger med listen.

Test efter deploy:

1. Åbn `https://klinikguiden.com`.
2. Find nyhedsbrev-formularen på forsiden.
3. Indtast navn, e-mail og marker samtykke.
4. Send formularen.
5. Kontroller at `tak.html` vises.
6. Kontroller i Netlify under `Forms`, at `newsletter-signup` har modtaget tilmeldingen.
7. Test også den mindre footer-formular og `nyhedsbrev.html`.
