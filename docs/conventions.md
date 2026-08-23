# Conventions

Apply when this repo contains **application or function code**.

## Secrets vs settings

| Kind | Where | Examples |
|------|-------|----------|
| **Secrets** | Environment only — `.env`, Netlify env | Stripe keys, webhook secrets, Resend, Shopify tokens |
| **Non-sensitive config** | Committed settings / data files | Product catalogue in `src/data/`, public URLs, shipping zone amounts |

**Rules:**

- **Never** hardcode secrets in source or repo docs.
- **Never** commit `.env` or paste secret values in chat.
- Documented names in `.env.example` are fine; values are not.

### Netlify Functions

Use **`Netlify.env.get("VAR")`** — not raw `process.env` in functions.

## Scope

- Minimize changes — only what the task needs.
- Match existing naming, types, and patterns.
- Ask before large refactors or re-creating existing UI/styling.

## Git

- **`develop`** — day-to-day work
- **`master`** — production / stable
- **`/sync`** — commit and sync when asked
- **`/handoff`** — session handoff into `CONTEXT.md`
- Do not commit secrets or `.env`

## Not in this repo

No Minnow HQ Airtable client project, Drive client layout, or client portal. Future Boy is personal.
