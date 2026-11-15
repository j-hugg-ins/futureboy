# Products

Runs, SKUs, and catalogue notes. Code catalogue for the Vite scaffold lives in `src/data/products.json` (images under `public/products/`).

Display fields: `style` (Murphy, Shermer, Porkchop, …) and `name` (`Trucker Cap`) render on two lines on cards and PDP. URL slug stays `handle`; Stripe/emails still use full `title`.

## Stance

- Low product count; limited runs
- Custom shop on Netlify is primary; Shopify may still exist on `*.myshopify.com`
- One-shot import script: `npm run migrate:products` (do not re-run casually; overwrites local catalogue)

## Active / recent runs

| Handle / name | Run size | Status | Channel | Notes |
|---------------|----------|--------|---------|-------|
| | | | Shopify / custom | |

## Pricing

Per-product `pricePence` in `src/data/products.json` is the source of truth for display and Stripe Checkout. Most hats are currently `4500` (£45).

## Shipping zones

Source of truth: `src/data/shipping.json` (cart geo estimate, PDP accordion, Stripe Checkout rates, policy page). Final rate set at Checkout from address.

| Zone | Rate |
|------|------|
| United Kingdom | Free |
| Europe | £10 |
| Rest of world | £20 |

## Open threads

- [ ] List current hat designs and sold-out history
- [ ] Note which SKUs remain on Shopify only
