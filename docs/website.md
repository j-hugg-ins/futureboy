# Website

Commerce and site stack for Future Boy.

## Current

| Surface | Role |
|---------|------|
| **Custom shop** | Netlify + Stripe Checkout — https://futureboy.netlify.app (reliable) |
| **Custom domain** | `futureboy.uk` DNS → Netlify; TLS certificate still provisioning |
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

1. If custom-domain TLS not ready: point `PUBLIC_URL` + Stripe webhook at `https://futureboy.netlify.app` temporarily
2. Place one refundable live order; confirm Stripe payment, `/success`, Resend sale email
3. When `https://futureboy.uk` shows Netlify shop with valid padlock, set `PUBLIC_URL` + webhook to `https://futureboy.uk`

## Open threads

- [ ] Paid smoke test + Resend email
- [ ] Netlify TLS for `futureboy.uk` complete
- [ ] Decide when (if ever) to shut Shopify storefront entirely
