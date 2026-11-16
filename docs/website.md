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
- Webhook event: `checkout.session.completed` → `/api/stripe-webhook` (seller email flags shipping rate vs address country mismatch)
- Cart shipping: `/api/shipping-estimate` uses Netlify geo; final rate chosen in Stripe Checkout from address
- Presentment currency: header switcher (GBP / EUR / USD / CAD / JPY); IP default via `/api/currency-rates` + Netlify geo; override in `localStorage`. Catalogue stays GBP in JSON; Checkout `price_data` and shipping options convert via Stripe Exchange Rates so display and charge match. JPY is zero-decimal.
- Checkout: all UK / Europe / ROW rates offered; `allowed_countries` = Stripe Checkout shipping enum (`STRIPE_CHECKOUT_SHIPPING_COUNTRIES` in `shipping.ts`); zone rates still GB / Europe / RoW
- Env names: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_URL` (Netlify reserves `URL`), `RESEND_API_KEY`, `SALE_NOTIFY_EMAIL`, `SALE_NOTIFY_FROM`, `EMAIL_PREVIEW_SECRET`, `CLICK_AND_DROP_API_KEY`
- Fulfilment defaults: `src/data/fulfilment.json` (packed weight, package format, HS code, origin, delivery term)
- On `checkout.session.completed`, webhook creates a Click and Drop order (UK / Europe / RoW) then sends emails; C&D failure is noted in the seller email and does not block the sale receipt. Labels are printed in the Click and Drop portal.
- Ship-to for emails + C&D: `collected_information.shipping_details` → legacy `shipping_details` → `customer_details.address` (covers Stripe Link / quick pay)
- Resend: domain `futureboy.uk` verified for sending
- Preview smoke: `POST /api/email-preview?kind=all` with header `X-Email-Preview-Secret` → sample seller + ONE + TWO customer mails to `SALE_NOTIFY_EMAIL` only
- DNS (GoDaddy via Minnow Tools): apex `A` `75.2.60.5`; `www` `CNAME` `futureboy.netlify.app`
- Local: `npm install` && `npm run dev`. See root `README.md` / `.env.example` — never commit values.

## Deploy

Build `npm run build`, publish `dist`, production branch **`master`**.

## Smoke test

Passed 2026-11-15 (Shermer £5): Checkout paid, `checkout.session.completed` webhook → Netlify 200, Resend seller email delivered. Customer confirmation added after that test (Resend to Checkout customer email).

Order emails (seller + customer) use a shared HTML brand wrap: centred `futureboy-logo-light-reg.png`, large headline, borderless product/shipping/total rows, footer. Customer body switches on total quantity (1 vs 2+). Plain-text fallback included.

## Click & Drop (planned — futureboy.uk only)

Royal Mail Click & Drop custom API for Stripe shop fulfilment. **Do not** rebuild around Shopify; the old Shopify C&D channel is convenience history only.

| Topic | Notes |
|-------|--------|
| Docs | [Help centre](https://help.parcel.royalmail.com/hc/en-gb/articles/360011462338-Integrating-with-the-Click-Drop-API) · [OpenAPI](https://api.parcel.royalmail.com/) |
| Auth | One API integration per C&D account; key in `Authorization` header (env only) |
| Create orders | `POST /api/v1/orders` from Stripe `checkout.session.completed` |
| Tracking / labels | Available via create/get orders + labels; label PDFs need **OBA** (not OLP) |
| Despatch | API can mark despatched; **no inbound webhook** when you despatch in the C&D UI |
| Customer email | Resend “shipped” with tracking URL (or RM `receiveEmailNotification` / `sendNotificationsTo: recipient`) |

**Open design choice:** poll C&D for newly labelled/despatched orders while staying in their UI, or ship from futureboy.uk (call C&D + Resend), or lean on Royal Mail’s own recipient notifications.

## Open threads

- [x] Paid smoke test + Resend seller email
- [x] Restore Shermer to £45
- [x] Customer confirmation email
- [x] Branded HTML order emails
- [x] Netlify TLS for `futureboy.uk` complete
- [ ] Choose C&D despatch-email path (poll vs ship-from-site vs RM notify)
- [ ] Optional: implement Stripe → C&D create + Resend tracking
- [ ] Decide when (if ever) to shut Shopify storefront entirely
- [x] Set `EMAIL_PREVIEW_SECRET` on Netlify + smoke `POST /api/email-preview` (seller + ONE + TWO)
- [ ] Confirm Click and Drop create-order on next genuine paid checkout (portal + seller note)
