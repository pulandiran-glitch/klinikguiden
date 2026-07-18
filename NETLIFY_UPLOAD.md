# KlinikGuiden - upload til Netlify

Denne mappe indeholder den statiske hjemmeside.
Den kan uploades gratis til Netlify uden et aktivt betalingsflow.

## Hurtigste metode

1. Gå til Netlify-dashboardet.
2. Vælg din KlinikGuiden-side.
3. Gå til deploys.
4. Upload filen `outputs/klinikguiden-netlify-upload.zip`.
5. Åbn siden og test:
   - Forsiden loader.
   - Undersiderne virker.
   - Nyhedsbrev-formularen sender data til Google Sheet.
   - Bestillings-/ventelisteformularen sender data som forventet.

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
- `netlify/functions/create-checkout-session.js` som deaktiveret svar
- `netlify/functions/stripe-webhook.js` kun hvis historisk reference ønskes bevaret

## Efter upload

Test formularerne på live-siden og se, om nye rækker lander i Google Sheet.
Den nuværende version har ikke et aktivt betalingsflow.
