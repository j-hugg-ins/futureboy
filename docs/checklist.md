# Current checklist

**Focus:** Paid smoke test on `futureboy.uk`; hobby studio/CWT when time  
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

- [x] Deploy per-product pricing fix to `master`
- [x] Smoke-test paid checkout + sale email on https://futureboy.uk (Shermer £5)
- [x] Restore Shermer `pricePence` to 4500
- [x] Customer confirmation email via Resend
- [x] Netlify TLS on `futureboy.uk`; shop + webhook on custom domain (verified 2026-11-15)
- [x] Checkout uses per-product `pricePence` (not global constant)
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
