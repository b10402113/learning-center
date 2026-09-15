---
source: harness-engineering
source_type: codebase
source_lines: 276
language: typescript
file_count: 6
part: 3
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — harness-engineering (part 3)

## Overview (L1)

- `server/` — the harness's entry point. `index.ts` boots an Express HTTP server plus a `ws` WebSocket server, launches DBOS (which recovers crashed workflows), wires the durable event bus to all connected inspectors, exposes `/api/clear` and `/api/approve/:workflowId`, and dispatches `submit_task` messages to either the single-agent runtime or the supervisor. `env.ts` is a tiny first-import shim that loads `.dev.vars` before any module reads env at load time.
- `shared/events.ts` — the typed contract between the harness (server) and the inspector (browser). It defines the `EventType` enum (workflow, model, tool, memory, handoff, plan/subagent, approval, log), the discriminated-union `EventInput` payloads, the stamped `AgentEvent`, the `Emit` signature, and the client `ClientMessage` (including the `mode: "default" | "supervised"` toggle). Everything the harness does becomes an event on this stream.
- CLI inspection scripts — `scripts/inspect-log.ts` reads the durable Postgres event log straight from the terminal, counting events by type and flagging duplicated tool calls (repeated side effects); it also supports a `truncate` mode. `scripts/test-sandbox.ts` drives `runInSandbox` directly to demonstrate the guardrails (Code Mode compute, timeout on an infinite loop, blocked `require`, structured error on a bug).
- Course/lessons outline — `lessons/` is a VitePress site describing the seven-lesson workshop. `.vitepress/config.ts` declares the title/description, sidebar and dead-link policy; `lessons/index.md` is the home hero ("Build a mini agent runtime from scratch"); the seven `lessons/<nn-slug>/index.md` files carry the full lesson narratives. The arc: the harness, durable execution, sandboxing, memory, routing/handoffs, supervision, human-in-the-loop.
- Repo-level configuration — `package.json` scripts (`dev`, `dev:server`, `dev:web`, `typecheck`, `docs`) and dependencies (Vercel AI SDK, DBOS, Drizzle, postgres, express, ws, zod, Vite/React, VitePress); `course.yml` gives the workshop metadata, schedule and learning benefits; `CLAUDE.md` documents the project as a one-day systems workshop where the runtime — not the agent — is the protagonist, plus the "spine" execution loop and repo structure. `README.md` is the companion overview (setup, branching, tech stack).

## Structure (L2)

### server/index.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/server/index.ts]]`
- Purpose: the harness server entry. It loads env first (`import "./env"`), ensures the event-log schema, points DBOS at Postgres and calls `DBOS.launch()` (which also recovers in-flight workflows), builds the Express app (health check, permissive CORS, `/api/clear`, `/api/approve/:workflowId`), creates the WebSocket server at `/ws`, forwards every emitted event to connected clients, and on `submit_task` picks the runtime (`supervised` → `runSupervisorWorkflow`, else `runAgentWorkflow`) via `DBOS.startWorkflow`. On each new socket connection it replays the durable timeline from `history()`.
- Key exports: none directly — `main()` is invoked at module load; indirectly exposes the running server and the routed runtimes `runAgentWorkflow` / `runSupervisorWorkflow`.
- Dependencies: `./env`, `@dbos-inc/dbos-sdk`, `express`, `node:http`, `ws`, `../harness/db` (`ensureSchema`, `clearEventLog`), `../harness/bus` (`subscribe`, `history`), `../harness/runtime`, `../harness/supervisor`, `@shared/events`.
- Learner-relevant: shows how the harness owns the transport — one WebSocket carries both client commands and the server-initiated event stream — and how the durable bus, DBOS lifecycle/recovery, CORS/approval routes, and runtime selection compose in the real entry point.

### shared/events.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/shared/events.ts]]`
- Purpose: the type contract between the harness and the inspector. `EventType` enumerates every event the harness can emit; `EventInput` is a discriminated union with one variant per event (workflow started/completed/failed, model delta/completed, tool requested/completed/failed, memory compacted, agent handoff, plan created, subagent started/completed/failed, approval requested/resolved, log); `AgentEvent` adds the harness-stamped `id` and `ts`; `Emit` is the push signature; `ClientMessage` is what the browser sends back (with a `mode` field choosing default vs. supervised).
- Key exports: `EventType` (enum), `EventInput`, `AgentEvent`, `Emit`, `ClientMessage`.
- Dependencies: none (leaf module) — imported by the server, bus, runtime, supervisor, and scripts.
- Learner-relevant: the course's core thesis made concrete — "the event log IS the system" and the UI only ever renders this stream; a single typed enum/union is how every harness capability becomes observable and replayable.

### server/env.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/server/env.ts]]`
- Purpose: loads `.dev.vars` into `process.env` via dotenv `config()`; a separate module so the server can import it first, before any module (e.g. `harness/db.ts`) that reads env at import time.
- Key exports: none (side-effecting module).
- Dependencies: `dotenv`.
- Learner-relevant: illustrates ES module evaluation order — imports run before top-level statements, so env loading must be its own first-import module or `DATABASE_URL` will be undefined when the DB client initializes.

### scripts/inspect-log.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/scripts/inspect-log.ts]]`
- Purpose: a small CLI that reads the durable `event_log` table directly from Postgres (ordered by `seq`), prints totals by event type, counts distinct tool calls, and flags any `tool.requested` call id seen more than once as a duplicated side effect; a `truncate` argv flag wipes the log first.
- Key exports: none (top-level script, run via `tsx`).
- Dependencies: `dotenv`, `postgres`.
- Learner-relevant: proves the durability claims from the terminal — checkpointed tool calls should show zero duplicates across a crash/resume — and shows how to introspect the durable state store without the UI.

### scripts/test-sandbox.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/scripts/test-sandbox.ts]]`
- Purpose: drives `runInSandbox` directly (no agent needed) to demonstrate guardrails: (1) Code Mode fetch-and-compute over a `tools` API, (2) a `while (true) {}` sync loop killed by the timeout, (3) `require("fs")` blocked because it is absent from the context, (4) a bug returned as a structured error the model could act on.
- Key exports: none (top-level script).
- Dependencies: `../harness/sandbox` (`runInSandbox`, `SandboxApi`).
- Learner-relevant: makes the sandbox boundary observable and shows why structured errors support model self-correction; reinforces that `node:vm` is a mediation point, not a true security boundary.

### lessons/.vitepress/config.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/lessons/.vitepress/config.ts]]`
- Purpose: VitePress configuration for the notes site — title "Harness Engineering", a description, `ignoreDeadLinks` for localhost links, and the sidebar mapping the seven lessons (01 The Agent Harness → 07 Human-in-the-Loop) to their URLs.
- Key exports: default `defineConfig({...})`.
- Dependencies: `vitepress`.
- Learner-relevant: shows the course's canonical lesson ordering and titles, useful as a stable index for building the learning path.

### lessons/index.md

- Locator: `[[sources/agent-harness/20260915/harness-engineering/lessons/index.md]]`
- Purpose: the VitePress home page — a hero with name "Harness Engineering", text "Build a mini agent runtime from scratch", a tagline listing the seven capabilities, and a "Start with Lesson 1" action.
- Key exports: none (markdown with `layout: home` frontmatter).
- Dependencies: none.
- Learner-relevant: states the course framing in one screen — "not build an agent; build the thing that can durably run any of them" — which is the top-level learning goal.

### lessons/<nn-slug>/index.md (course outline)

- Locator: `[[sources/agent-harness/20260915/harness-engineering/lessons/01-intro-to-harness-engineering/index.md]]` (and siblings 02–07)
- Purpose: the seven full lesson notes, each following the rhythm *The pain / failure mode / What the harness adds / Live code (full diffs) / The demo / In production*:
  - **01 The Agent Harness** — builds the brittle demo agent (`tools.ts`, `system-prompt.ts`, `runtime.ts`), names its production failure modes.
  - **02 Durable Execution** — DBOS checkpointed steps + a Drizzle/Postgres event log; crash-and-resume with no duplicate side effects.
  - **03 Sandboxed Tools & Code Mode** — `harness/sandbox.ts` (`node:vm`, timeout, no host access) and the `runCode` tool; the durable loop is unchanged.
  - **04 Memory & Context Hydration** — separates History / State / Context; `ContextHydrator`, token-budget summarization, `memory.compacted`, and log clearing.
  - **05 Routing & Handoffs** — agents as data (`harness/agents.ts`), least-privilege `issueRefund`, and a runtime-intercepted `handoff` (lateral control transfer).
  - **06 Hierarchical Supervision** — supervisor does plan → parallel dispatch → fan-in → synthesize; a first-class plan artifact and graceful degradation of failed sub-agents (hierarchical control).
  - **07 Human-in-the-Loop** — gates `issueRefund` behind durable `DBOS.recv`/`DBOS.send`, testing that approval survives a crash and unbounded waits.
- Key exports: none (markdown lessons, with embedded TypeScript snippets).
- Dependencies: cross-references `@shared/events`, `harness/*` modules, DBOS, the Vercel AI SDK, Drizzle/postgres, and `node:vm`.
- Learner-relevant: this is the course's teaching spine — every production failure mode and the one harness capability that fixes it, with runnable code and a demo per lesson.

### repo configuration (package.json, course.yml, CLAUDE.md, README.md)

- Locator: `[[sources/agent-harness/20260915/harness-engineering/package.json]]` (plus `course.yml`, `CLAUDE.md`, `README.md`)
- Purpose: defines what the project is and how it runs. `package.json` exposes scripts `dev` (concurrently: `tsx watch server/index.ts` + `vite`), `dev:server`, `dev:web`, `build`, `preview`, `typecheck` (`tsc --noEmit`), and `docs`/`docs:build`/`docs:preview` (VitePress), with deps including `ai`/`@ai-sdk/openai`, `@dbos-inc/dbos-sdk`, `drizzle-orm`, `postgres`, `express`, `ws`, `zod`, and Vite/React/Tailwind. `course.yml` gives the workshop title, subtitle, teacher, excerpt, seven benefits, schedule and audience. `CLAUDE.md` frames the repo as a one-day systems workshop, states the mantra "agent systems are workflow systems", and documents the spine loop and repo layout. `README.md` is the companion overview with setup, branch strategy, and tech stack.
- Key exports: none (configuration/docs).
- Dependencies: n/a.
- Learner-relevant: establishes the mental model and the runnable environment — the harness (not the agent) is the protagonist, and `npm run dev` boots the server plus the prebuilt inspector that renders the event stream.

## Sources

- [[sources/agent-harness/20260915/harness-engineering/server/env.ts]]
- [[sources/agent-harness/20260915/harness-engineering/server/index.ts]]
- [[sources/agent-harness/20260915/harness-engineering/shared/events.ts]]
- [[sources/agent-harness/20260915/harness-engineering/scripts/inspect-log.ts]]
- [[sources/agent-harness/20260915/harness-engineering/scripts/test-sandbox.ts]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/.vitepress/config.ts]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/01-intro-to-harness-engineering/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/02-durable-execution/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/03-secure-sandboxing/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/04-advanced-memory/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/05-orchestration-routing-handoffs/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/06-hierarchical-supervision/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/lessons/07-human-in-the-loop/index.md]]
- [[sources/agent-harness/20260915/harness-engineering/package.json]]
- [[sources/agent-harness/20260915/harness-engineering/course.yml]]
- [[sources/agent-harness/20260915/harness-engineering/CLAUDE.md]]
- [[sources/agent-harness/20260915/harness-engineering/README.md]]
