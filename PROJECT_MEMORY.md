# KlinikGuiden Project Memory

## Current Live Status

- GitHub repository: `pulandiran-glitch/klinikguiden`
- Production site: `https://klinikguiden.com`
- Baseline commit when this Brevo verification work started: `251faf0`
- Latest pushed commit on `main`: `2e8c198`
- Commit message: `Validate Brevo DOI template status`
- Netlify and GitHub are connected.
- Netlify deploys GitHub `main`; live status endpoint changed after push, confirming the latest Brevo function deployed.
- Live Brevo status endpoint currently returns `ok: false`.
- `BREVO_API_KEY` is configured and verified by the live status endpoint.
- `BREVO_LIST_ID=5` is configured and the list is verified by the live status endpoint.
- `BREVO_DOUBLE_OPTIN_TEMPLATE_ID` is configured, but Brevo reports the template is not a valid DOI template: `doiTemplate:false`.
- Live signup with consent returns Brevo `400 invalid_parameter`: `An active DOI template does not exist`.
- `BREVO_WELCOME_TEMPLATE_ID` is configured and the welcome template is verified by the live status endpoint.
- `BREVO_REDIRECT_URL_AFTER_CONFIRMATION` is configured and points to `https://klinikguiden.com/tak.html?newsletter=confirmed`.
- Newsletter signups must use Brevo double opt-in before newsletters start.
- The welcome email must be sent by Brevo automation after the contact confirms double opt-in.
- The Netlify Function must not send the welcome email directly before double opt-in confirmation.

## Deployment Source Of Truth

- GitHub `main` and the Netlify Git build are the source of truth for the Brevo newsletter function.
- Do not deploy Brevo function code from `outputs/klinikguiden-netlify-upload` or an old manual upload zip.
- If a manual upload package is ever regenerated, it must be rebuilt from the current GitHub source after tests pass.
