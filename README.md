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

1. Create a Stripe account; use **test** keys first.
2. Set `STRIPE_SECRET_KEY` in Netlify env (and local `.env`).
3. Add webhook endpoint: `https://<site>/api/stripe-webhook` for `checkout.session.completed`.
4. Set `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SALE_NOTIFY_EMAIL`.

Checkout validates prices server-side (£45) and locks shipping countries to the zone chosen in the cart:

| Zone | Rate |
|------|------|
| UK | Free |
| Europe | £10 |
| Rest of world | £20 |

## Catalog

Products live in `src/data/products.json` with images under `public/products/{handle}/`. Mark sold-out with `"available": false` and redeploy.

Re-pull from Shopify (while it still exists):

```bash
npm run migrate:products
```

## Deploy

Netlify: build `npm run build`, publish `dist`, connect repo `j-hugg-ins/futureboy`. Point `futureboy.uk` DNS when ready.
