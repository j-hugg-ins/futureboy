# Current checklist

**Focus:** Click and Drop smoke + non-GBP checkout; hobby studio/CWT when time  
**Detail:** See `CONTEXT.md` · [website.md](website.md) · [studio.md](studio.md)

*Tick in Markdown preview. Commit/sync to persist. Replace this file when focus changes — not an archive.*

---

## Setup

- [x] `CONTEXT.md` and `AGENTS.md` present
- [x] `docs/agents/` issue tracker + triage + domain wired for `/wayfinder`
- [x] `master` / `develop` branches on GitHub
- [x] `.cursor/environment.json` present if using Cloud Agents
- [x] Drive root: Development, Production, Marketing, Website, Ops + Archive
- [x] Netlify production branch pointed at `master`
- [x] Netlify project `futureboy` + Stripe live keys / webhook / Resend env
- [x] GoDaddy DNS apex + `www` → Netlify (Minnow Tools)

## Main tasks

- [x] Product title split: `style` + `name` on cards and PDP (two lines)
- [x] Shipping rates in `src/data/shipping.json`; PDP Shipping accordion (top)
- [x] Cart geo estimate; Checkout all rates; webhook shipping mismatch check
- [x] Link hover → plain colour to `--accent` (`#c23a28`)
- [x] Deploy per-product pricing fix to `master`
- [x] Smoke-test paid checkout + sale email on https://futureboy.uk (Shermer £5)
- [x] Restore Shermer `pricePence` to 4500
- [x] Customer confirmation email via Resend
- [x] Branded HTML order emails (logo, qty copy, table, footer) — on `master`
- [x] Gated `/api/email-preview` for sample ONE / TWO / seller
- [x] Set `EMAIL_PREVIEW_SECRET` on Netlify and smoke preview endpoint
- [x] Netlify TLS on `futureboy.uk`; shop + webhook on custom domain (verified 2026-11-15)
- [x] Checkout uses per-product `pricePence` (not global constant)
- [x] Footer/static pages: About-style centred left-aligned layout; no em dashes
- [x] Success thank-you page uses same static-page layout as About/Contact
- [x] Presentment currency switcher (GBP/EUR/USD/CAD/JPY); IP default; Stripe Checkout in selected currency
- [x] Custom currency switcher UI (padded list; same header type styling)
- [x] Type: Courier Prime on `--font-sans`; root 13px (sticking for now; unused A/B fonts optional prune later)
- [x] Version 2.0.1 in package.json; footer shows version left of © Futureboy year
- [x] Softened policy/contact/success copy; Terms stock line = small-batch snag-it note
- [x] Nav: Shop → `/` (home); Instagram moved to footer first
- [x] Mobile chrome: hamburger + cart; ink slide-over (primary, currency, footer links); slim footer
- [x] Cart row: two-row stack at ≤640px (thumb+info / qty+line+remove)
- [x] Click and Drop: fulfilment.json + webhook create-order (UK / Europe / RoW)
- [x] Set `CLICK_AND_DROP_API_KEY` on Netlify
- [x] Ship-to prefers Checkout `collected_information.shipping_details` (Link/quick pay)
- [x] Restore Shermer `pricePence` to 4500 after smoke
- [x] Stripe paid → C&D Create Orders (create on webhook; labels in portal)
- [ ] Next genuine paid order → confirm Click and Drop portal + seller note
- [ ] Smoke non-GBP checkout (e.g. EUR) + confirm email totals match session currency
- [ ] Choose despatch-email path (poll UI vs ship-from-site + Resend vs RM notify); no C&D despatch webhook
- [ ] Decide Shopify residual (`*.myshopify.com` only vs remove)
- [ ] Price home studio kit in `docs/studio.md` (screen print first)
- [ ] Act on home print kit / first tee experiments (Development)
- [ ] Resume CWT sampling (Production)
- [ ] Fill `docs/products.md` / `docs/marketing.md`
- [ ] Cherry-pick Archive → live folders (as needed)

## Done

- [x] Scaffold personal project brain (no HQ / portal)
- [x] Wire GitHub Issues for wayfinder / triage / specs / tickets
- [x] Seed suppliers (Aung Crown, CWT, Chris/&Sons)
- [x] Verify new Drive folder structure; update workstream docs
- [x] Studio budget scaffold (`docs/studio.md`)
- [x] Custom shop Netlify + Stripe + PUBLIC_URL fix
- [x] Resend domain verified + Netlify sale-email env
