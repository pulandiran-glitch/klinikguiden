# KlinikGuiden Project Memory

## Current Live Status

- GitHub repository: `pulandiran-glitch/klinikguiden`
- Production site: `https://klinikguiden.com`
- Baseline commit when this Brevo verification work started: `251faf0`
- Netlify and GitHub are connected.
- Brevo is configured.
- Live Brevo status endpoint returns `ok: true`.
- `BREVO_API_KEY` is configured and verified by the live status endpoint.
- `BREVO_LIST_ID=5` is configured and the list is verified by the live status endpoint.
- `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` is configured and the double opt-in template is verified by the live status endpoint.
- `BREVO_WELCOME_TEMPLATE_ID` is configured and the welcome template is verified by the live status endpoint.
- `BREVO_REDIRECT_URL_AFTER_CONFIRMATION` is configured and points to `https://klinikguiden.com/tak.html?newsletter=confirmed`.
- Newsletter signups must use Brevo double opt-in before newsletters start.
- The welcome email must be sent by Brevo automation after the contact confirms double opt-in.
- The Netlify Function must not send the welcome email directly before double opt-in confirmation.

## Deployment Source Of Truth

- GitHub `main` and the Netlify Git build are the source of truth for the Brevo newsletter function.
- Do not deploy Brevo function code from `outputs/klinikguiden-netlify-upload` or an old manual upload zip.
- If a manual upload package is ever regenerated, it must be rebuilt from the current GitHub source after tests pass.
