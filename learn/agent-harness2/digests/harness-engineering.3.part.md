---
source: sources/agent-harness2/20261029/harness-engineering
source_type: codebase
source_lines: 810
language: TypeScript
file_count: 5
part: 3
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- `server/` — The boot layer: loads `.dev.vars` before any env-reading import, then starts Express plus one WebSocket that accepts tasks, exposes approval and clear endpoints, and replays the durable event history to every inspector. It makes the harness observable and resumable without the UI knowing anything about the model.
- `shared/` — The event contract: a typed enum and discriminated union covering workflow, model, tool, memory, handoff, supervision, approval, and log events, plus the client `submit_task` message. The harness and inspector communicate only through this stream, which is the course's "the event log IS the system" idea.
- `scripts/` — Small operator tools: a log inspector that summarizes the durable event table and detects duplicated tool calls, and a sandbox smoke test that exercises timeouts, host isolation, and structured errors. They turn harness guarantees into something you can run and verify locally.
- `lessons/` — VitePress lesson notes that teach one harness capability at a time, with the first lesson building a deliberately brittle agent loop before later lessons repair it. The notes carry the course rhythm: pain, failure mode, harness addition, live code, demo, production mapping.
- `course metadata / agent instructions` — `CLAUDE.md` and `README.md` describe a one-day systems workshop where one persistent mini agent runtime accretes modules per lesson; the small READMEs and `openspec/config.yaml` mark curriculum source, private planning notes, and spec-driven scaffolding.

# L2 detail

- `#L1-L6` — `server/env.ts` — Loads `.dev.vars` through dotenv at import time. The comment explains the ordering constraint: ES module imports evaluate before top-level statements, so this module must be imported first by anything that reads env during load. It is the smallest example of explicit environment wiring in the harness.
- `#L1-L92` — `server/index.ts` — The server entrypoint: creates the Express app and WebSocket server, ensures the Postgres schema, and launches DBOS so interrupted workflows recover from their last checkpoint. It exposes `/health`, `/api/clear`, and `/api/approve/:workflowId`, subscribes the event bus to broadcast to all clients, and on `submit_task` starts either the single-agent or supervisor workflow. New sockets get the durable history replayed, so the browser can render a run it did not witness.
- `#L1-L71` — `shared/events.ts` — Defines `EventType`, the `EventInput` union, `AgentEvent` (with harness-stamped `id` and `ts`), the `Emit` function type, and `ClientMessage`. Every harness action becomes a typed event, and the inspector only renders that stream. This is the contract that lets invisible infrastructure become visible and the reason client commands share the same socket as server-initiated events.
- `#L1-L33` — `scripts/inspect-log.ts` — A CLI over the durable `event_log` table: it optionally truncates the table, reads rows ordered by `seq`, and prints totals by event type. It specifically counts repeated `tool.requested` events per `toolCallId`, surfacing duplicated side effects after a retry or recovery. This is the debugging counterpart to durable execution.
- `#L1-L34` — `scripts/test-sandbox.ts` — A smoke test for `runInSandbox` using a fake charges API. It demonstrates compute over a tool result, a runaway loop killed by an 800 ms timeout, blocked `require("fs")` host access, and a structured error returned for the model to read. The learner-relevant point is that sandbox guardrails can be verified without waiting for the agent to misbehave.
- `#L1-L311` — `lessons/01-intro-to-harness-engineering/index.md` — Lesson 1's full narrative and code: tool definitions, system prompt, and the brittle in-memory agent loop that streams AI SDK parts onto the harness event stream. It names the production failures the rest of the course fixes: lost state on crash, unmediated `sendReply`, unbounded context, and one agent doing everything. Success is a working demo, followed immediately by deliberately breaking it.
- `#L1-L135` — `CLAUDE.md` — The project overview for coding agents: the workshop builds one persistent mini agent runtime, not a vertical agent, under the mantra that agent systems are workflow systems. It gives the target workflow spine annotated with L2 durable, L3 sandbox, L4 memory, and L7 approval hooks, the reusable task scenario with safe versus dangerous tools, the repo layout, per-lesson rhythm, branch strategy, and code style. It is the clearest statement of the course architecture.
- `#L1-L99` — `README.md` — The learner-facing overview: seven lessons from the harness through durable execution, sandboxing, memory, orchestration, supervision, and human approval. It explains the branch-per-lesson model, where notes live, setup with an OpenAI key and a Postgres URL from Lesson 2, and the three commands `dev`, `docs`, and `typecheck`. It also frames the starter as a working pipe with a stubbed agent loop.
- `#L1-L4` — `src/README.md` — States that per-lesson example code is built under `src/` as each lesson is live-coded. It reveals that the curriculum source is expected to grow per lesson rather than live only in the harness runtime.
- `#L1-L5` — `notes/README.md` — Marks `notes/` as private, instructor-facing planning material for syllabus design, library evaluation, and lesson build plans. It is explicitly separate from the published VitePress notes in `lessons/`.
- `#L1-L20` — `openspec/config.yaml` — Declares `schema: spec-driven` and leaves the optional project context and per-artifact rules as commented examples. It is agent-facing scaffolding rather than a populated spec, showing that the repository anticipates structured AI-assisted planning.
