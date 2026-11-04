---
source: sources/background-agent/20261105/notes/lesson-authoring.md
source_type: text
source_lines: 11
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - scripts.md#L1-L132
---

# L1 overview

- Branch model — six code lessons on adjacent branches: a lesson starts on `lesson-N`, `lesson-(N+1)` holds its finished code, and `main` is the final solution; the checkout service, dashboard, event intake, DB access, and model adapter ship from the starter branch so students only live code `server/agent-workflow.ts`.
- Note generation — `npm run notes:generate` builds the six lesson pages from `scripts/lesson-data.json`, `scripts/lesson-prose/*.md`, and the real diffs between adjacent branches; `npm run notes:check` fails on drift; `npm run docs` serves locally and `npm run docs:build` checks links/rendering.
- Authoring rules — concept prose in Scott's voice precedes live coding; diffs keep unchanged context, green additions, red removals so an instructor can locate each edit; keep talk cues aligned with the generated hunks.
- Rehearsal — rehearse the talk, type the diff from the start branch, run `npm run format`, `lint`, `typecheck`, test against a fresh checkout process, and leave 15 minutes for catch-up; branch switches do not reset Neon or Inngest.
- Required demonstrations — feature repair, event wait and recovery, release rollback with approval, lost acknowledgement with safe retry, dependency help request; verify outcome and policy rather than exact tool order, on the same real model used in class.

# L2 detail

- `#L1-L3` — Branch-to-lesson mapping, what is supplied from the starter branch, and the deliberate concentration of student edits in `server/agent-workflow.ts`.
- `#L4-L5` — Note pipeline: `npm run notes:generate` inputs (`scripts/lesson-data.json`, `scripts/lesson-prose/*.md`, branch diffs), `npm run notes:check` drift detection, diff formatting conventions, and `npm run docs` / `npm run docs:build`.
- `#L6-L7` — Per-lesson rehearsal loop (talk, type the diff, format/lint/typecheck, test on a fresh checkout, 15 minutes catch-up) and the warning that Git, Neon data, and Inngest history reset independently.
- `#L8-L11` — The five required traces and where to read them (`/activity`, `/events`, `/` inbox, Inngest steps), plus maintenance rules: regenerate notes after branch changes, keep the checkout API contract stable, never expose the startup fault flag to the model, and keep `.env` and the Neon URL out of Git.
