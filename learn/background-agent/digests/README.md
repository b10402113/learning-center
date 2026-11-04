---
source: sources/background-agent/20261105/README.md
source_type: text
source_lines: 99
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1007-L1034
  - service.md#L1-L221
---

# L1 overview

- Workshop shape — one-day TypeScript workshop; students build the agent harness while a supplied checkout service (port 3004) and operator app supply the world and the inbox; not a chat demo.
- System boundary — checkout owns in-memory state and sends stable-ID alerts to operator API (3001); agent (3002) reads fresh state over HTTP; operator API opens one run per active incident and later alerts join it; human decision resumes the same Inngest run.
- Ports and processes — three long-running terminals (`dev:agent` 3002, `dev` = operator API 3001 + dashboard 5173 + Inngest Dev Server 8288, `dev:checkout` 3004), plus a fourth for docs at 5174; `npm run preflight` / `db:push` / `db:seed` before teaching; `npm run stop` frees every port.
- Fault flags — `--fault none|feature|release|dependency`, plus `--alerts`, `--interval-ms`, `--recover-after-ms`, `--lose-next-action-response`; one checkout process at a time; each start resets state and creates a new `instanceId`.
- Branches and tooling — six lessons `lesson-1`..`lesson-6` with `main` as final solution; each branch starts from the prior solution; Oxfmt single quotes/no semicolons; run `npm run format`, `lint`, `typecheck` after edits.

# L2 detail

- `#L1-L3` — Title, one-day framing, the three moving parts: student-built harness, supplied checkout service, operator app.
- `#L4-L16` — System boundary diagram and prose contract: one run per active incident, alerts join and wake, event is a notification not a state snapshot, actions verified by re-observation, restart supersedes unfinished runs; `AGENT_GOAL` override and `health.status = healthy` condition live in `server/environment.ts`.
- `#L17-L38` — Setup: Node LTS/npm/Git/LLM key, `npm install`, `cp .env.example .env`, Neon connection string from neon.new, `DATABASE_URL`/`OPENAI_API_KEY`/`OPENAI_MODEL`/optional `OPENAI_BASE_URL` (Command Code / `deepseek/deepseek-v4-flash`).
- `#L39-L45` — First-run sequence `npm run db:push`, `npm run preflight`, `npm run db:seed`.
- `#L46-L61` — Three-terminal table and what each owns, docs at 127.0.0.1:5174, dashboard 5173, Inngest 8288, agent health at `/api/health`, port-in-use failure behavior, `npm run stop`, and `AGENT_SETTLE_DELAY=20s` for the durable-restart drill.
- `#L62-L69` — Process/command/address table for the five individually runnable processes (`dev:checkout`, `dev:operator`, `dev:agent`, `dev:web`, `dev:inngest`).
- `#L70-L84` — Fault drill commands, `--fault`/`--alerts`/`--interval-ms`/`--recover-after-ms`/`--lose-next-action-response` semantics, agent-only restart for durability, UI routes `/`, `/activity`, `/events`, and the stated limits (single service, no LLM classifier for correlation).
- `#L85-L91` — Branch workflow (start branch = prior solution), note that branch switches change code only, Oxfmt/style and the format/lint/typecheck gates.
- `#L92-L99` — Lesson start→solution table, `lesson-1`..`lesson-6` mapping to `lesson-2`..`main`.
