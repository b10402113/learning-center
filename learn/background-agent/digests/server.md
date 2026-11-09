---
source: sources/background-agent/20261109/supplement/server
source_type: codebase
source_lines: 1086
language: ts
file_count: 14
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- `agent-brain.ts` — Wraps the text model: `chooseAction` asks for exactly one typed action via a Zod-backed structured output, and `writeReport` produces a factual incident report. Teaches the decision boundary between model judgment and harness control.
- `agent-data.ts` — The durable state layer for a run: reads/writes `runs`, assembles `AgentState` from world, events, actions and human decisions, evaluates `goalSatisfied`, records decisions/tool calls, and manages human approval proposals including expiry, stale, and cancel behavior. Teaches idempotent run bookkeeping and human-in-the-loop state.
- `agent-log.ts` — Append-only activity log writing phase-tagged timeline rows (`start`, `observe`, `loop`, `predict`, `act`, `pause`, `human`, `terminal`) and reading them back. Teaches observability of a long-running agent.
- `agent-workflow.ts` — The core Inngest function: a bounded decision loop where every observe/choose/act/human-wait step is a named durable step, with version rechecks, stale handling, `waitForEvent`, sleep, cancel, concurrency and failure hooks. Teaches durable execution of an agent harness.
- `agent.ts` — Express entrypoint that serves the Inngest handler for `incidentAgent`, raises the JSON body limit for step replay, and exposes health. Teaches how a durable function is mounted as an HTTP endpoint.
- `db.ts` — Builds a shared `postgres` client and Drizzle instance from `DATABASE_URL`. Teaches wiring an agent's persistence to PostgreSQL.
- `environment.ts` — Defines the default goal and `DEFAULT_CONDITION` (`health.status === healthy`), plus `configuredGoal` and idempotent `ensureEnvironment`. Teaches how objective and success condition are configured, not hardcoded.
- `incident-data.ts` — Event ingestion and dashboard queries: dedupes stable event IDs, supersedes runs on service-instance change, opens or updates a run based on health, increments `eventSequence`, and emits `incident/opened`/`incident/updated`. Teaches alert-as-trigger semantics and restart reconciliation.
- `inngest.ts` — Single shared `Inngest` client (`background-agents-workshop`). Teaches central function/event client configuration.
- `observe.ts` — `checkoutServiceUrl` and `getLatestState`, which fetch and Zod-validate the checkout `/state` snapshot. Teaches observing the real world over HTTP instead of trusting event payloads.
- `operator.ts` — Operator HTTP API: dashboard, service-event intake, run cancel, run activity, approval decisions, plus Zod validation and error handling. Teaches the human control plane beside the agent.
- `schema.ts` — Drizzle Postgres tables (`environments`, `events`, `actions`, `runs`, `approvals`, `timeline`, plus legacy tables) with typed `WorldState`/`GoalCondition` columns. Teaches the durable data model behind the harness.
- `seed.ts` — Tiny bootstrap that calls `ensureEnvironment` and closes the client. Teaches idempotent first-run setup.
- `tool-policy.ts` — `actionPolicy` maps every `ActionName` to `read`, `write`, `approval`, `help`, `terminal` or `wait`. Teaches the harness-owned policy gate between proposal and execution.

# L2 detail

- `#L1-L51` — `agent-brain.ts` — Exports `chooseAction` and `writeReport`; `decisionSchema` constrains the model to `{action, reason, detail}` over the fixed `ACTIONS` enum, and the system prompt states that the harness validates and controls execution.
- `#L52-L339` — `agent-data.ts` — Exports `getRun`, `setRun`, `setIteration`, `cancelRun`, `agentState`, `AgentState`, `goalSatisfied`, `recordDecision`, `recordToolAction`, `proposeAction`, `getProposal`, `decideProposal`, `staleProposal`; terminal-status guards, typed state assembly, and approval lifecycle (pending/approved/rejected/expired/stale).
- `#L340-L380` — `agent-log.ts` — Exports `logAgentActivity` and `activityForRun`; the `AgentActivityPhase` union drives `agent:<phase>` timeline rows so every loop phase is traceable.
- `#L381-L596` — `agent-workflow.ts` — Exports `incidentAgent`; `executeAction` calls the service `/operations` endpoint and skips recording stale results; the function loops 24 cycles of `step.run` observe/choose/act, uses `step.waitForEvent` for service updates and approvals, rechecks state version before approved writes, and escalates at the decision limit.
- `#L597-L624` — `agent.ts` — Express app serving `/api/inngest` via `serve({ client: inngest, functions: [incidentAgent] })`, with a 10mb JSON limit for Inngest replay and a health route; listens on 127.0.0.1:3002.
- `#L625-L634` — `db.ts` — Exports `client` (postgres, max 5) and `db` (Drizzle with schema) from a validated `DATABASE_URL`.
- `#L635-L671` — `environment.ts` — Exports `DEFAULT_CONDITION`, `configuredGoal`, `ensureEnvironment`; the environment is the application contract and the goal defaults to an investigate/restore/verify/report mission.
- `#L672-L858` — `incident-data.ts` — Exports `ingestServiceEvent` and `dashboard`; a transaction with row-level lock dedupes events, supersedes runs on instance change, opens a run only for non-`service.started` unhealthy events, bumps `eventSequence` for updates, and sends Inngest events afterward.
- `#L859-L862` — `inngest.ts` — Exports the shared `inngest` client used by ingestion, workflow and approval wake events.
- `#L863-L879` — `observe.ts` — Exports `checkoutServiceUrl` and `getLatestState`; `snapshotSchema` validates `instanceId`, `version` and `state` read over HTTP, with a comment stressing no shared memory or event-payload snapshots.
- `#L880-L945` — `operator.ts` — Express operator API with Zod-validated routes for dashboard, service events, cancel, activity and approval decisions, a centralized error handler, and `ensureEnvironment` before listen on 127.0.0.1:3001.
- `#L946-L1065` — `schema.ts` — Drizzle tables: `environments` (physical `labs`, includes `version`, `goal`, `goalCondition`, legacy columns), `eventPlans`, `observations`, `events`, `actions`, `runs` (`eventSequence`, `iteration`, `waitReason`, `report`), `approvals` (`expiresAt`, `decidedAt`), and `timeline`.
- `#L1066-L1071` — `seed.ts` — Runs `ensureEnvironment()` and closes the postgres client; idempotent setup entrypoint.
- `#L1072-L1086` — `tool-policy.ts` — Exports `actionPolicy`, the single mapping from each `ActionName` to its execution class, so the harness enforces `approval`/`help`/`read`/`write` without inspecting fault flags.
