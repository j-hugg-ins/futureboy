# Future Boy — context

**Start here** on a cold start (new machine, Cloud Agent, or fresh session).

## What this is

Personal boutique apparel label — retro vintage Americana trucker hats and caps first; a bucket for hobby and passion projects in fashion, clothing, and apparel. Creative expression vehicle, not a Minnow client engagement.

| Item | Value |
|------|-------|
| **Type** | Personal |
| **Repo** | https://github.com/j-hugg-ins/futureboy |
| **Branches** | `master` (production), `develop` (day-to-day) |
| **Commerce today** | Shopify (~£25/mo) + custom Netlify/Stripe shop (https://futureboy.netlify.app) |
| **Site** | Vite + React + Netlify + Stripe Checkout |
| **Domain** | futureboy.uk (DNS not pointed yet) |

## Brand docs

| Doc | Contents |
|-----|----------|
| [docs/workstreams.md](docs/workstreams.md) | Five streams: Development, Production, Marketing, Website, Ops |
| [docs/google-drive.md](docs/google-drive.md) | Futureboy Drive root + folder IDs |
| [docs/studio.md](docs/studio.md) | Home studio equipment wishlist + budget |
| [docs/brand.md](docs/brand.md) | Aesthetic, voice, look |
| [docs/suppliers.md](docs/suppliers.md) | Hat manufacturers, apparel sourcing |
| [docs/products.md](docs/products.md) | Runs, limited editions, catalog |
| [docs/marketing.md](docs/marketing.md) | Instagram, promotion, awareness |
| [docs/website.md](docs/website.md) | Shopify vs custom site status |

## Current work

_Last handoff: 2026-11-14 — branch `develop`_

**Goal:** Finish custom-shop go-live (smoke test, optional Resend, `futureboy.uk` DNS); keep Shopify until cutover is decided.

**Done this session:**
- New Standard Stripe account (not Sparkinity Express); Stripe MCP connected
- Netlify project `futureboy` on Minnow team, GitHub linked, production on `master`
- Live env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_URL`
- Stripe webhook → `https://futureboy.netlify.app/api/stripe-webhook` (`checkout.session.completed`)
- Checkout reads `PUBLIC_URL` (Netlify reserves `URL`)

**Next steps:**
1. Smoke-test checkout on https://futureboy.netlify.app (refundable live or test)
2. Optional Resend sale-email vars; point `futureboy.uk` DNS and update `PUBLIC_URL` + webhook
3. Hobby track: studio kit pricing / CWT when time allows

**Blockers / landmines:**
- Do not reuse Sparkinity Express Stripe account for this shop
- Never commit secrets; Netlify env holds live keys
- Minnow Tools cannot create/move personal Drive files — cherry-pick in Drive UI

**Suggested skills:** `/sync`, `/handoff`, `/grilling`

**Artifacts:** Netlify `futureboy`, Stripe webhook on netlify.app, `docs/website.md`

## Open items

- [ ] Smoke-test paid checkout (+ optional Resend)
- [ ] Point `futureboy.uk` DNS at Netlify; update `PUBLIC_URL` + webhook URL
- [ ] Price home studio kit in `docs/studio.md`
- [ ] Cherry-pick Archive → live Drive folders (as needed)
- [ ] Record current hat runs / SKUs in `docs/products.md`
- [ ] Note Instagram account and promo habits in `docs/marketing.md`
- [ ] Resume CWT samples / first home-print experiments

## Glossary

| Term | Meaning |
|------|---------|
| Future Boy | Personal apparel brand / label in this repo |
| Workstream | One of five top-level streams: Development, Production, Marketing, Website, Ops |
| Development | R&D, design, references, planning for new pieces (not yet an order) |
| Production | Suppliers and assets for actual orders / runs |
| Run | A limited production batch of an item (not open-ended stock) |
| Trucker | Mesh-back baseball-style cap — early Future Boy product focus |
| CWT | Colourways / CWT Blanks (Karandeep) — UK blank supplier under sampling |
| Aung Crown | Chinese hat manufacturer (Lydia / Alibaba) — historical production partner |
| Chris Isherwood / &Sons | Style + home screen-print mentor; early Futureboy collaborator |
| Click and Drop | Royal Mail UK fulfilment portal (future lean-shop interest; Shopify for now) |
