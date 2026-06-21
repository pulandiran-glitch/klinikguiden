# KlinikGuiden - live launch checklist

Brug denne liste lige efter upload til Netlify.

## 1. Bekræft at ny version er live

Åbn `https://klinikguiden.com/` og tjek at forsiden viser:

- Hero-kortet siger `Ofte` i stedet for `3,2M`.
- Trust-linjen siger `Skrevet ud fra klinisk hverdag`.
- Om os-sektionen har den personlige tekst om Jonathan og Sophia.
- Der er ingen person-emojis eller tale-emoji i Om os-sektionen.

Hvis du stadig ser `3,2M`, er den gamle version stadig live.

## 2. Test redirects

Åbn disse adresser:

- `https://klinikguiden.com/rodbehandling`
- `https://klinikguiden.com/regningen`
- `https://klinikguiden.com/besoegsfrekvens`
- `https://klinikguiden.com/guide-komplette`
- `https://klinikguiden.com/tjekliste`

Alle skal åbne uden 404-fejl.

## 3. Test data til Google Sheet

Gør dette på live-siden:

1. Accepter statistik-banneret.
2. Klik på en guide.
3. Brug quizzen.
4. Brug tilskudsberegneren.
5. Udfyld nyhedsbrev-formularen med en testmail.
6. Udfyld bestillingsformularen med en testmail og vælg `Forstå din tandlæge - den komplette guide`.
7. Gennemfør Stripe Checkout med et Stripe testkort, hvis Stripe testnøgler er sat op.

Åbn derefter Google Sheet og bekræft, at der kommer rækker med:

- `page_view`
- `quiz_answer_selected`
- `subsidy_calculated`
- `newsletter_signup`
- `checkout_started`
- `order_form_submit`

For `order_form_submit` skal kolonnerne `product` og `price` være udfyldt. Når Stripe webhooken er aktiv, skal betalte køb lande som `order_form_submit`.

## 4. Test dashboard

I Google Sheet skal `Dashboard`-fanen opdatere:

- Sidevisninger
- Nyhedsbrev leads
- Bestillinger
- Estimeret omsætning
- Produktfordeling

## 5. Test Stripe

Stripe virker først, når disse Netlify environment variables er sat:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GOOGLE_SHEET_ENDPOINT`
- `SITE_URL`

Åbn derefter:

- `https://klinikguiden.com/.netlify/functions/create-checkout-session`

Den bør ikke vise 404. Funktionen accepterer kun POST, så en almindelig browseråbning kan godt give en metode-fejl. Det er fint.

## 6. Gem første baseline

Når live-testen virker, notér datoen og nulstil eller marker test-rækker i Google Sheet, så du kan skelne dine egne tests fra rigtige brugere.
