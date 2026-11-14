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
| **Site** | Vite + React + Netlify + Stripe Checkout — https://futureboy.netlify.app |
| **Domain** | `futureboy.uk` DNS → Netlify; custom-domain TLS still provisioning |

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

**Goal:** Complete first paid smoke test, then finish `futureboy.uk` HTTPS so the custom domain is the primary shop URL.

**Done this session:**
- Closed Sparkinity Express Stripe; new Standard Futureboy account + Stripe MCP
- Netlify `futureboy` (Minnow) linked to GitHub; production branch `master`; site ID `86514a25-0a64-440b-ac8c-c10cbd753b05`
- Checkout prefers `PUBLIC_URL` (Netlify reserves `URL`); shipped on `master`
- Live Netlify env (names only): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PUBLIC_URL`, `RESEND_API_KEY`, `SALE_NOTIFY_EMAIL`, `SALE_NOTIFY_FROM`
- Resend domain `futureboy.uk` verified (sending); MCP connected
- GoDaddy via Minnow Tools: apex `A` → `75.2.60.5`, `www` → `futureboy.netlify.app` (after Website product unlock)
- Stripe webhook destination currently `https://futureboy.uk/api/stripe-webhook` (`checkout.session.completed`)

**Next steps:**
1. Smoke-test a refundable live order on https://futureboy.netlify.app (if custom-domain TLS still broken, temporarily point `PUBLIC_URL` + webhook at `*.netlify.app`)
2. Wait for Netlify TLS cert for `futureboy.uk` (currently still serves `*.netlify.app` cert); then keep `PUBLIC_URL` + webhook on `https://futureboy.uk`
3. Confirm sale email via Resend after a real `checkout.session.completed`

**Blockers / landmines:**
- Do not use Sparkinity Express Stripe for this shop
- Custom-domain HTTPS not ready: Stripe webhooks / browsers may fail on `futureboy.uk` until cert matches
- Some resolvers still cache Shopify apex IP — flush/wait TTL
- Never commit secrets; never read `.env` into chat
- Minnow GoDaddy allowlist now includes `futureboy.uk`; leave MX + Resend DNS alone

**Suggested skills:** `/sync`, `/prod` (if master needs another merge), `/grilling`

**Artifacts:** `docs/website.md`, Netlify project `futureboy`, Stripe `we_1Ubefh…`, Resend domain `futureboy.uk`

## Open items

- [ ] Smoke-test paid checkout + Resend sale email (prefer netlify.app until TLS green)
- [ ] Netlify TLS for `futureboy.uk` / `www` fully provisioned; verify padlock + Netlify shop (not Shopify)
- [ ] After TLS: confirm `PUBLIC_URL` + Stripe webhook stay on `https://futureboy.uk`
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
