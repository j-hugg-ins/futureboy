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

_Last handoff: 2026-11-16 — branch `develop` (prod `master` at v2.0.1)_

**Goal:** Prove Click and Drop from a real paid order; smoke non-GBP checkout.

**Done this session:**
- Custom currency switcher (padded listbox) replaced native `<select>`; shipped as **v2.0.1** via `/prod`
- `develop` caught up with `master` (merge + doc conflict resolve) before release
- Prior same-day: ship-to from `collected_information`; success static layout; Shermer £45; C&D create-order on webhook

**Next steps:**
1. Next genuine paid order → confirm C&D portal order + seller email note
2. Smoke non-GBP checkout (EUR or USD) + confirm email totals match session currency
3. Decide despatch-email path (poll C&D UI vs ship-from-site + Resend vs RM recipient notify)
4. Decide Shopify residual (`*.myshopify.com` only vs remove)

**Blockers / landmines:**
- No C&D inbound webhook on despatch; do not wait for one
- One C&D API integration per account; `CLICK_AND_DROP_API_KEY` env only
- Label PDFs need OBA (not OLP)
- Sparkinity Express Stripe is wrong account; never read `.env` into chat; leave MX + Resend DNS alone

**Suggested skills:** `/sync`, `/prod`, `/grilling` (despatch-email path)

**Artifacts:** `src/components/CurrencySwitcher.tsx`, `src/styles/header.css`, `netlify/functions/_shared/click-and-drop.ts`, `docs/website.md`, package `2.0.1`

## Open items

- [x] Smoke-test paid checkout + Resend sale email on https://futureboy.uk (Shermer £5)
- [x] Restore Shermer to £45 after smoke test
- [x] Customer confirmation email via Resend on `checkout.session.completed`
- [x] Netlify TLS for `futureboy.uk` / `www`; padlock + Netlify shop (verified 2026-11-15)
- [x] `PUBLIC_URL` + Stripe webhook on `https://futureboy.uk`
- [x] Wire paid Stripe orders → C&D Create Orders (labels printed in portal)
- [ ] Next genuine paid order → confirm C&D portal create + seller note
- [ ] Smoke non-GBP checkout (EUR/USD) + email totals
- [ ] Choose despatch-email path (poll UI vs ship-from-site + Resend vs RM notify)
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
