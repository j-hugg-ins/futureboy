# Website

Commerce and site stack for Future Boy.

## Current

| Surface | Role |
|---------|------|
| **Shopify** | Live storefront (~£25/mo) — stick with this for now |
| **This repo** | Vite + React + Netlify + Stripe scaffold for a lean custom shop later |
| **Branches** | `develop` day-to-day; `master` production |

## Custom site (later)

Goals when revisited:

- Simple, elegant ecommerce; few products; limited runs
- Basket + checkout
- Possible Royal Mail Click and Drop for UK fulfilment (not required while on Shopify)

Local: `npm install` && `npm run dev`. Stripe/Netlify details in root `README.md`. Env names in `.env.example` — never commit values.

## Deploy

Netlify: build `npm run build`, publish `dist`, repo `j-hugg-ins/futureboy`. Point production branch at **`master`**. Domain `futureboy.uk` when DNS is ready.

## Open threads

- [ ] Confirm Netlify production branch
- [ ] Decide when (if ever) to leave Shopify for the custom stack
