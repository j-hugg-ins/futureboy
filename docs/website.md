# Website

Commerce and site stack for Future Boy.

## Current

| Surface | Role |
|---------|------|
| **Shopify** | Still live (~£25/mo); no cutover yet |
| **Custom shop** | Netlify + Stripe Checkout live at https://futureboy.netlify.app |
| **Branches** | `develop` day-to-day; `master` production |

## Custom shop (Netlify)

- Site ID `86514a25-0a64-440b-ac8c-c10cbd753b05` · dashboard https://app.netlify.com/projects/futureboy
- Stripe account Futureboy (Standard); webhook `checkout.session.completed` → `/api/stripe-webhook`
- Env (names only): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_URL` (Netlify reserves `URL`), optional Resend vars
- Local: `npm install` && `npm run dev`. Details in root `README.md` / `.env.example` — never commit values.

## Deploy

Build `npm run build`, publish `dist`, production branch **`master`**. Domain `futureboy.uk` when DNS is ready; then set `PUBLIC_URL` and update the Stripe webhook URL.

## Open threads

- [x] Confirm Netlify production branch (`master`)
- [ ] Point `futureboy.uk` DNS at Netlify
- [ ] Optional Resend sale emails
- [ ] Decide when (if ever) to leave Shopify for the custom stack
