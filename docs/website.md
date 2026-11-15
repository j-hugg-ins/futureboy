# Website

Commerce and site stack for Future Boy.

## Current

| Surface | Role |
|---------|------|
| **Custom shop** | Netlify + Stripe Checkout — https://futureboy.uk (primary) |
| **Custom domain** | `futureboy.uk` DNS → Netlify; TLS live (Let's Encrypt, apex + www) |
| **Alias** | https://futureboy.netlify.app still serves the same deploy |
| **Shopify** | Still exists on `futureboy-xyz.myshopify.com`; apex DNS no longer intentional for Shopify |
| **Branches** | `develop` day-to-day; `master` production |

## Custom shop (Netlify)

- Site ID `86514a25-0a64-440b-ac8c-c10cbd753b05` · dashboard https://app.netlify.com/projects/futureboy
- Stripe account Futureboy (Standard, not Sparkinity Express)
- Webhook event: `checkout.session.completed` → `/api/stripe-webhook`
- Env names: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_URL` (Netlify reserves `URL`), `RESEND_API_KEY`, `SALE_NOTIFY_EMAIL`, `SALE_NOTIFY_FROM`
- Resend: domain `futureboy.uk` verified for sending
- DNS (GoDaddy via Minnow Tools): apex `A` `75.2.60.5`; `www` `CNAME` `futureboy.netlify.app`
- Local: `npm install` && `npm run dev`. See root `README.md` / `.env.example` — never commit values.

## Deploy

Build `npm run build`, publish `dist`, production branch **`master`**.

## Smoke test (next)

1. Place one refundable live order on https://futureboy.uk
2. Confirm Stripe payment, `/success`, Resend sale email (`james@futureboy.uk`)
3. `PUBLIC_URL` and webhook already on `https://futureboy.uk` (verified 2026-11-15)

## Open threads

- [ ] Paid smoke test + Resend email
- [x] Netlify TLS for `futureboy.uk` complete
- [ ] Decide when (if ever) to shut Shopify storefront entirely
