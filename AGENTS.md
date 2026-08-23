# Agent instructions

This repo is a **project brain** for Future Boy — context and progress live here, not only in chat history.

Personal brand / apparel hobby project (not a Minnow client). No HQ Airtable client project, Drive client layout, or client portal.

## Auto-update (do without being asked)

When you **complete a unit of work** (file edits, integrations/MCP calls, multi-step task):

1. **`docs/checklist.md`** — tick completed items; add new tasks if discovered
2. **`CONTEXT.md` → Current work** — refresh Goal, Done recently, Next steps (keep concise)
3. **`docs/progress.md`** — append one dated line: what changed + what's next

**Skip doc updates** for: quick factual answers, clarifying questions, or mid-task back-and-forth before the task is done.

**Never** write secret values (API keys, tokens, passwords) into any repo file — IDs and URLs only.

## Conventions (code repos)

Follow **`docs/conventions.md`** when writing or editing application code:

- **Secrets** → environment variables only — never constants in source
- **Non-sensitive config** → committed settings (or equivalent)
- **Netlify Functions** → `Netlify.env.get("VAR")`, not `process.env`

## Status footer (quick-recap)

After completing a unit of work, end the response with one line:

- `🟢` — finished
- `🟡` — done but non-routine follow-up remains (name it)
- `🔴` — blocked on user input

Keep under 100 characters. Skip the footer for quick Q&A.

## Session boundaries

| Command | When |
|---------|------|
| **`/handoff`** | End of session — rewrite Current work + open items into docs |
| **`/sync`** | Commit and sync with remote (when asked) |

## Agent skills

### Issue tracker

GitHub Issues on `j-hugg-ins/futureboy` (including `/wayfinder` maps and child tickets). See `docs/agents/issue-tracker.md`.

### Triage labels

`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `CONTEXT.md` + `docs/adr/`. See `docs/agents/domain.md`.

## Useful commands

| Command | Use |
|---------|-----|
| `/wayfinder` | Chart or work a decision map on GitHub Issues |
| `/grilling` | Stress-test a plan one question at a time |
| `/grill-with-docs` | Grill against glossary; update CONTEXT glossary inline |
| `/to-spec` | Synthesize conversation into a spec on the tracker |
| `/to-tickets` | Break a spec/plan into tracer-bullet tickets |
| `/handoff` | Session handoff into repo docs |
| `/sync` | Commit and sync with remote |
