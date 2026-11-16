# Future Boy — context

**Start here** on a cold start (new machine, Cloud Agent, or fresh session).

## What this is

Personal boutique apparel label — retro vintage Americana trucker hats and caps first; a bucket for hobby and passion projects in fashion, clothing, and apparel. Creative expression vehicle, not a Minnow client engagement.

| Item | Value |
|------|-------|
| **Type** | Personal |
| **Repo** | https://github.com/j-hugg-ins/futureboy |
| **Branches** | `master` (production), `develop` (day-to-day) |
| **Commerce today** | Custom Netlify/Stripe shop + Shopify still on `*.myshopify.com` |
| **Site** | Vite + React + Netlify + Stripe Checkout — https://futureboy.uk |
| **Domain** | `futureboy.uk` DNS → Netlify; TLS live (Let's Encrypt, apex + www) |

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

_Last update: 2026-11-16 — Ship-to fix + success layout_

**Goal:** Wait for genuine orders to prove Click and Drop; non-GBP smoke still open.

**Done recently:**
- Ship-to resolves `collected_information.shipping_details` (Link/quick pay) before customer_details
- Success page matches About/Contact static layout; Shermer restored to £45
- Checkout Stripe country allowlist; C&D webhook create-order live
**Next steps:**
1. Let a real paid order confirm C&D portal create + seller note
2. Smoke non-GBP checkout (EUR or USD) + email totals
3. Decide Shopify residual

**Blockers / landmines:**
- Do not wait for a Click & Drop despatch webhook (not in the published API)
- One C&D API integration per account; auth key from Settings → Integrations (env only, never commit)
- Label PDF retrieval needs OBA, not OLP
- Do not use Sparkinity Express Stripe; never read `.env` into chat; leave MX + Resend DNS alone

**Suggested skills:** `/grilling` (pick poll vs ship-from-site), then implement with permission; `/sync`

**Artifacts:** `docs/website.md` (C&D notes), [C&D API help](https://help.parcel.royalmail.com/hc/en-gb/articles/360011462338-Integrating-with-the-Click-Drop-API), [api.parcel.royalmail.com](https://api.parcel.royalmail.com/), Stripe webhook `netlify/functions/stripe-webhook.ts`

## Open items

- [x] Smoke-test paid checkout + Resend sale email on https://futureboy.uk (Shermer £5)
- [x] Restore Shermer to £45 after smoke test
- [x] Customer confirmation email via Resend on `checkout.session.completed`
- [x] Netlify TLS for `futureboy.uk` / `www`; padlock + Netlify shop (verified 2026-11-15)
- [x] `PUBLIC_URL` + Stripe webhook on `https://futureboy.uk`
- [ ] Choose Click & Drop despatch path (poll UI vs ship-from-site vs RM notify) for futureboy.uk
- [ ] Optional: wire paid Stripe orders → C&D Create Orders + Resend tracking email
- [ ] Smoke non-GBP checkout (EUR/USD) + email totals
- [ ] Decide Shopify cutover / keep `*.myshopify.com` only
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
| Click and Drop | Royal Mail fulfilment portal; API creates orders on paid Checkout (labels printed in portal) |
| OBA | Royal Mail Online Business Account — required for C&D API label PDF retrieval |
| OLP | Online Postage account — cannot retrieve labels/docs via C&D API |
