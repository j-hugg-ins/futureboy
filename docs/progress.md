# Progress log

Append-only notes when substantive work completes. Agents add a row; humans may trim old rows when focus changes.

| Date | What changed | Next |
|------|--------------|------|
| 2026-11-15 | Branded Resend HTML emails: logo wrap, 1 vs 2+ copy, order table, footer | Deploy; smoke via paid order or Stripe event resend |
| 2026-11-15 | Restored Shermer to £45; Resend customer order confirmation on webhook | Deploy; optional second smoke or Stripe event resend |
| 2026-11-15 | Smoke test passed: £5 Shermer paid, webhook 200, Resend seller email; no customer receipt yet | Restore Shermer to £45; optional buyer email |
| 2026-11-15 | Shermer temporarily £5 for live smoke test; package.json → 0.9.0 | Deploy; buy Shermer; restore £45 after test |
| 2026-11-15 | Per-product Stripe pricing via `pricePence`; merged `/prod` to master (`ca0ed47`) | Wait for Netlify; paid smoke test on futureboy.uk |
| 2026-11-15 | Verified futureboy.uk live: TLS, Netlify shop, PUBLIC_URL + Stripe webhook on custom domain | Paid smoke test + Resend sale email on futureboy.uk |
| 2026-11-14 | Session handoff: Stripe/Resend/DNS cutover; TLS pending; smoke test outstanding | Paid smoke test on netlify.app; wait for futureboy.uk cert |
| 2026-11-14 | Netlify `futureboy` + live Stripe webhook; checkout uses `PUBLIC_URL` | Smoke test; Resend optional; point futureboy.uk DNS |
| 2026-08-23 | `master`/`develop` branches; personal project brain + wayfinder agent docs | Fill brand/suppliers/products/marketing; Netlify → `master` |
| 2026-08-23 | Five workstreams + Drive index; suppliers seeded (Aung Crown, CWT) from email/Drive scan | Products/marketing fill; optional wayfinder for Drive or CWT; no Drive moves yet |
| 2026-08-23 | Verified Drive: Development/Production/Marketing/Website/Ops (+ Archive legacy); docs retargeted | Cherry-pick Archive → live folders |
| 2026-08-23 | Chris / &Sons: style refs + home screen-print kit into brand + suppliers | Optional first tee print experiments |
| 2026-08-23 | Added `docs/studio.md` equipment budget scaffold from Chris’s kit | Fill Est. £ as priced |
| 2026-08-23 | Session handoff — CONTEXT/checklist refreshed for cold start | `/sync`; price studio or resume CWT when ready |
