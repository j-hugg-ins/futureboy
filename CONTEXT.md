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

_Last update: 2026-11-15 — TLS verified on custom domain_

**Goal:** Confirm customer order email on next live order; decide Shopify residual.

**Done recently:**
- Restored Shermer to £45; webhook now sends seller alert + customer confirmation via Resend
- Paid smoke test OK (2026-11-15): £5 Shermer paid; webhook 200; seller email delivered
- Per-product `pricePence` Checkout; `futureboy.uk` TLS + webhook live

**Next steps:**
1. Smoke-check customer confirmation on next paid order (or Stripe webhook resend)
2. Decide Shopify residual (`*.myshopify.com` only vs remove)
3. Refund £5 test payment if not already

**Blockers / landmines:**
- Do not use Sparkinity Express Stripe for this shop
- Never commit secrets; never read `.env` into chat
- Leave MX + Resend DNS alone on GoDaddy

**Suggested skills:** `/sync`, `/grilling`

**Artifacts:** `docs/website.md`, Netlify project `futureboy`, Stripe `we_1Ubefh…`, Resend domain `futureboy.uk`

## Open items

- [x] Smoke-test paid checkout + Resend sale email on https://futureboy.uk (Shermer £5)
- [x] Restore Shermer to £45 after smoke test
- [x] Customer confirmation email via Resend on `checkout.session.completed`
- [x] Netlify TLS for `futureboy.uk` / `www`; padlock + Netlify shop (verified 2026-11-15)
- [x] `PUBLIC_URL` + Stripe webhook on `https://futureboy.uk`
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
| Click and Drop | Royal Mail UK fulfilment portal (future lean-shop interest; Shopify for now) |
