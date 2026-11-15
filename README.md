# Futureboy

Personal hobby shop for Futureboy trucker caps — static Vite + React site on Netlify with Stripe Checkout.

## Fonts

One size everywhere via `--text-size` (default `0.8rem`) and `--text-tracking` (`0.07em`), colour `--ink`.

- **Geist Sans** — titles and body copy  
- **Geist Mono** — nav, footer, product labels, buttons (uppercase)

Tweak size globally by changing `--text-size` in `src/styles/global.css`.

```bash
npm install
npm run dev
```

For Stripe functions locally, use Netlify’s Vite plugin (`npm run dev`) with env vars from `.env.example` (copy to `.env` — never commit secrets).

## Stripe + sale emails

1. Create a Stripe account; use **test** keys first (or a live restricted key `rk_live_…` with Checkout Sessions write).
2. Set `STRIPE_SECRET_KEY` in Netlify env (and local `.env`).
3. Set `PUBLIC_URL` to the public site origin (Netlify reserves the name `URL`). Example: `https://futureboy.netlify.app`, later `https://futureboy.uk`.
4. Add webhook endpoint: `https://<site>/api/stripe-webhook` for `checkout.session.completed`.
5. Set `STRIPE_WEBHOOK_SECRET`, and for emails `RESEND_API_KEY`, `SALE_NOTIFY_EMAIL`, `SALE_NOTIFY_FROM` (seller alert + customer confirmation).

Checkout charges each product’s `pricePence` and locks shipping countries to the zone chosen in the cart:

| Zone | Rate |
|------|------|
| UK | Free |
| Europe | £10 |
| Rest of world | £20 |

## Catalog

Products live in `src/data/products.json` with images under `public/products/{handle}/`. Edit per-product fields there (including `pricePence`); Checkout charges each product’s `pricePence`. Mark sold-out with `"available": false` and redeploy.

Re-pull from Shopify (while it still exists):

```bash
npm run migrate:products
```

## Deploy

Netlify project `futureboy` (Minnow team): build `npm run build`, publish `dist`, production branch `master`, site https://futureboy.netlify.app. Point `futureboy.uk` DNS when ready, then update `PUBLIC_URL` and the Stripe webhook URL.
