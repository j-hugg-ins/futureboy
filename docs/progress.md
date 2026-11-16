# Progress log

Append-only notes when substantive work completes. Agents add a row; humans may trim old rows when focus changes.

| Date | What changed | Next |
|------|--------------|------|
| 2026-11-16 | Shermer temporarily £3 for Click and Drop paid smoke | Buy Shermer; restore £45 after |
| 2026-11-16 | Click and Drop: fulfilment.json + webhook create-order; seller email notes result | Smoke paid order in portal (env on Netlify) |
| 2026-11-15 | Nav: Shop → `/`; Instagram first in footer | Smoke non-GBP checkout |
| 2026-11-15 | Softened policy/contact/success copy; Terms stock snag-it line | Smoke non-GBP checkout |
| 2026-11-15 | v2.0.0; footer version + © Futureboy year; Courier Prime @ 13px | /prod then smoke non-GBP checkout |
| 2026-11-15 | Type settled for now: Courier Prime + 13px root | Smoke non-GBP checkout; optional prune A/B fonts later |
| 2026-11-15 | Type A/B: Quattro too narrow → Courier Prime on `--font-sans` | Kept; size bump applied |
| 2026-11-15 | UI font trial: `--font-sans` → iA Writer Quattro (woff2 in public/fonts) | Superseded by Courier Prime trial |
| 2026-11-15 | Shipping/product amounts remount on currency change; Frankfurter FX fallback | Smoke currency switch on shipping page |
| 2026-11-15 | Policy/success/emails: first person; drop generic “hats” product wording | Smoke non-GBP checkout |
| 2026-11-15 | Policy/contact copy: casual UK tone; 24h ship; drop hobby-brand line | Smoke non-GBP checkout |
| 2026-11-15 | Shipping policy rates: horizontal-rule table (match cart/email) | Smoke non-GBP checkout |
| 2026-11-15 | Static pages layout like About; currency switcher GBP/EUR/USD/CAD/JPY (IP default, Checkout presentment) | Smoke non-GBP checkout |
| 2026-11-15 | Reverted header cart icon → "Cart" text | — |
| 2026-11-15 | Geo shipping estimate; multi-rate Checkout; webhook mismatch flag | Smoke multi-rate checkout |
| 2026-11-15 | lucide-react thin icons on cart qty ± and trash | Spot-check cart icons |
| 2026-11-15 | Cart row: qty as column; Remove → trash icon | Spot-check cart on narrow widths |
| 2026-11-15 | PDP thumbs: no transition; hover/active border accent | Spot-check PDP gallery |
| 2026-11-15 | Buttons: max-content width, more inline pad, accent text/border hover | Spot-check contact/cart/PDP |
| 2026-11-15 | `--accent: #c23a28`; link hover colour fade (dropped sliding fill) | Spot-check nav/footer/policy hover |
| 2026-11-15 | Reverted accordion row padding to 0.95rem (dropped table-row-pad match) | Spot-check PDP accordions |
| 2026-11-15 | PDP thumbs: instant active/hover in, 1s ease fade-out | Spot-check gallery hover |
| 2026-11-15 | Shipping JSON + PDP Shipping accordion; first accordion = Shipping | Spot-check PDP + cart rates |
| 2026-11-15 | Catalogue `style` + `name`; two-line titles on product cards + PDP | Pick `--accent` for link hover |
| 2026-11-15 | Footer: disclaimer above copyright, text-wrap balance, natural breaks | Review latest [preview] mails |
| 2026-11-15 | Email layout polish: ~70% logo, grey table rules, tighter footer, more padding | Re-smoke preview; review inbox |
| 2026-11-15 | Preview endpoint smoked: seller + ONE + TWO to SALE_NOTIFY_EMAIL | Review inbox; optional copy tweaks |
| 2026-11-15 | Added gated `/api/email-preview` + shared order-email helpers | Set EMAIL_PREVIEW_SECRET on Netlify; curl smoke |
| 2026-11-15 | Synced branded emails + logo set to master (`5ef1a5c`); Netlify ready | Stripe event resend or paid order to smoke emails |
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
