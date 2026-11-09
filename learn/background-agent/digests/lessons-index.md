---
source: sources/background-agent/20261109/supplement/lessons/index.md
source_type: text
source_lines: 97
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
supplements:
  - server.md#L597-L624
  - service.md#L1-L221
---

# L1 overview

- Lesson 00 (welcome) — background agent vs chat agent: a standing goal, work done after the tab closes, and an inbox that reaches you only when judgment is needed; failures, authority, and recovery become part of the design.
- The example system — supplied local checkout service owns a small state object, develops a fault, and alerts; the first alert opens an incident run, later alerts join it, agent re-observes before claiming success, human approval/answer resumes the same run.
- Authority question — model proposes, harness validates/gates/bounds/finishes, checkout service owns the effect, a person authorizes or informs, Inngest checkpoints and waits, traces explain but do not verify.
- Setup and ports — `git switch lesson-1`, `npm install`, `cp .env.example .env`, Neon `DATABASE_URL`, `db:push`/`preflight`/`db:seed`; three terminals on 3002 (agent), 3001/5173/8288 (operator API, dashboard, Inngest), 3004 (checkout), docs on 5174.
- Drills and branches — fault flags `none|feature|release|dependency` with `--alerts`, `--interval-ms`, `--recover-after-ms`, `--lose-next-action-response`; lesson branches `lesson-1`..`lesson-6`/`main`; judge outcome **and** trajectory.

# L2 detail

- `#L1-L9` — Why background agents: standing goal, noticing change, acting after the tab closes; the concrete checkout-operations example; alert correlation by service instance rather than an LLM classifier; the recurring "who has authority over each decision?" framing.
- `#L10-L24` — "What we will build": observe–decide–act loop plus durable checkpoints, `wait` as a real pause until an incident event, human approval, state-version check, stable action ID, help request; the three operator pages (`/`, `/activity`, `/events`) table; each checkout restart resets state, issues a new instance ID, and invalidates previous unfinished work.
- `#L25-L28` — "What you need": JS/TS, `async`/`await`, npm, Git, basic Node server; Node LTS, npm, Git, editor, internet, LLM API key; local app + Inngest Dev Server, PostgreSQL on Neon, no Inngest Cloud.
- `#L29-L50` — Bootstrap from `background-agents`: `git switch lesson-1`, `npm install`, `cp .env.example .env`, neon.new connection string plus `OPENAI_API_KEY`/`OPENAI_MODEL`/optional `OPENAI_BASE_URL` (Command Code gateway, `deepseek/deepseek-v4-flash`), never commit `.env`.
- `#L51-L55` — `npm run db:push`, `npm run preflight`, `npm run db:seed` before starting anything.
- `#L56-L65` — Three-terminal table (`dev:agent`, `dev`, `dev:checkout`) and addresses: dashboard localhost:5173, Inngest localhost:8288, notes at localhost:5174 via `npm run docs`; Ctrl-C in terminal 3 only for drills.
- `#L66-L75` — The four drill commands (`--fault feature --alerts 3 --interval-ms 1000`, `--fault release`, `--fault dependency --recover-after-ms 30000`, `--fault feature --lose-next-action-response`); port 3004 allows one checkout process; agent-only restart in terminal 1 for durability.
- `#L76-L89` — "How the branches work": lesson N starts on the prior solution's branch, lesson 00 has no code edit, live-lesson→solution table, `git stash push -u -m "workshop progress"` then `git switch`, branch switches touch code but not Neon or Inngest history, 15 minutes of catch-up per coding lesson.
- `#L90-L97` — How to read the notes: engineering idea then exact diffs (red `-` removals, green `+` additions), model output may vary so judge state/policy/trace, pointer to the capstone lab at `/advanced-lab/`, and the two closing questions (what wakes a paused run; who can prove whether a retry is safe), then the Next link.
