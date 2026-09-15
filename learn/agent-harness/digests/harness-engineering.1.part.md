---
source: harness-engineering
source_type: codebase
source_lines: 830
language: typescript
file_count: 11
part: 1
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — harness-engineering (part 1)

## Overview (L1)

The `harness/` directory is the runtime layer of a support-agent workshop — the middleware that wraps a bare LLM loop and makes it production-grade. Its central piece, `runtime.ts`, is the durable agent loop: it hydrates the current agent's context, streams one model turn, dispatches tool calls as exactly-once DBOS steps, intercepts `handoff` to switch the running agent laterally while keeping the conversation, and suspends on `DBOS.recv()` for human-in-the-loop approval of irreversible tools. `agents.ts` and `tools.ts` are pure data: an agent is a name plus system prompt plus an allowed tool subset (triage with `runCode`/`sendReply`/`handoff`; billing with the privileged `issueRefund`), while `tools.ts` defines the schemas the model sees and the harness-owned `runTool` executor. Code-mode execution is mediated by `sandbox.ts`, which runs agent-written JavaScript in a minimal `node:vm` context (no `require`/`process`/`fetch`) with a synchronous timeout and an honest admission that `vm` is not a true security boundary. `memory.ts` implements context compaction — a token-budget sliding window that peels old turns into a running LLM summary, distinguishing durable HISTORY, compacted STATE, and per-turn CONTEXT. `bus.ts` and `db.ts` provide the durable event log (Postgres via Drizzle), persisting every event and replaying the full timeline to the inspector after a crash. `supervisor.ts` demonstrates hierarchical supervision — plan via `generateObject`, dispatch read-only sub-agent investigators in parallel, fan in with `allSettled`, degrade on failure, then synthesize — while `investigators.ts` defines those bounded sub-agents, each in its own context window. `model.ts` and `system-prompt.ts` are configuration: the single OpenAI `gpt-5.5` model and a sample refund task used across lessons. Read together, these 11 files trace the course progression: basic harness → durable execution → sandbox/code-mode security → memory hydration and summarization → handoff routing → hierarchical supervision with sub-agents → durable human-in-the-loop approval.

## Structure (L2)

### agents.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/agents.ts]]`
- Purpose: Defines the `Agent` type (name, system prompt, allowed `ToolSet`) and two agents — the generalist `triageAgent` and the privileged `billingAgent` — plus an `agents` lookup map. Shows that adding a specialist is data, not new machinery.
- Key exports: `Agent` (type), `triageAgent`, `billingAgent`, `agents`
- Dependencies: `./tools`
- Learner-relevant: Contrasts triage (no `issueRefund`; must `handoff({ to: "billing" })`) with billing (holds the irreversible `issueRefund`), making the case that a handoff beats simply granting every agent every tool. Anchors the handoffs lesson and the per-agent tool-subset policy.

### bus.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/bus.ts]]`
- Purpose: The harness event bus. `emit` assigns an id/timestamp, durably inserts the event into Postgres, then broadcasts it live to subscribers; `history` reads the full ordered timeline back. `subscribe` registers live listeners.
- Key exports: `subscribe`, `emit`, `history`
- Dependencies: `./db`, `@shared/events`
- Learner-relevant: The durability lesson's core — every event is a persisted row (ordered by `seq`) rather than an in-memory emission, so the inspector can replay work that happened before a crash. Teaches write-before-broadcast ordering.

### db.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/db.ts]]`
- Purpose: Sets up the Postgres connection (Drizzle over `postgres.js`, small pool) and the `event_log` table (`seq` global order, `jsonb` event data). `ensureSchema` creates the table on boot; `clearEventLog` truncates it.
- Key exports: `db`, `eventLog`, `ensureSchema`, `clearEventLog`
- Dependencies: `@shared/events`
- Learner-relevant: Turns the durable-execution idea into a concrete store — the append-only event log backing crash recovery of the timeline. `clearEventLog` motivates the lesson on clearing the durable log so compaction/replay can be demonstrated cleanly.

### investigators.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/investigators.ts]]`
- Purpose: Defines the read-only sub-agents used by the supervisor: a `billing`, `technical`, and `sales` investigator, each with its own prompt and read-only tools that carry `execute`, plus `runInvestigator` which runs one over an objective with `stopWhen: stepCountIs(5)`.
- Key exports: `runInvestigator`
- Dependencies: `./model`, `./tools`
- Learner-relevant: Shows the sub-agent pattern explicitly — bounded, read-only work in its own context window so a re-run after a crash is safe, which is why each can be a single durable step. Includes a `CHAOS_FAIL` hook so failure handling is reproducible.

### memory.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/memory.ts]]`
- Purpose: Context hydration and compaction. `estimateTokens` approximates size; `buildContext` assembles system prompt + pinned task + running summary + recent turns; `summarize` folds older turns into a terse running summary via an LLM call. Token budgets `MAX_CONTEXT_TOKENS`/`KEEP_CONTEXT_TOKENS` drive the sliding window.
- Key exports: `estimateTokens`, `buildContext`, `summarize`, `MAX_CONTEXT_TOKENS`, `KEEP_CONTEXT_TOKENS`
- Dependencies: `./model`
- Learner-relevant: Distinguishes HISTORY (durable log), STATE (compacted summary), and CONTEXT (this turn's model input), and makes the case that token budget rather than turn count drives compaction. The summarization lesson's centerpiece.

### model.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/model.ts]]`
- Purpose: The single place the LLM is configured — exports the OpenAI model instance (`gpt-5.5`) via the AI SDK provider, reading `OPENAI_API_KEY` from the environment.
- Key exports: `model`
- Dependencies: `@ai-sdk/openai`
- Learner-relevant: Establishes a single configuration seam so every other module depends on one model, making provider swaps (and cheaper mini variants for workshops) a one-line change.

### runtime.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/runtime.ts]]`
- Purpose: The durable agent loop. `agentWorkflow` compacts context when over budget, hydrates the current agent's context, runs one streamed model turn (`modelTurn`), then handles each tool call: `handoff` is intercepted to switch `currentAgent`, approval-gated tools (`issueRefund`) suspend the workflow on `DBOS.recv`, and everything else runs as an exactly-once DBOS step. `runAgentWorkflow` registers it.
- Key exports: `runAgentWorkflow`
- Dependencies: `@dbos-inc/dbos-sdk`, `ai`, `@shared/events`, `./bus`, `./model`, `./tools`, `./agents`, `./memory`
- Learner-relevant: The spine the whole course fills in — every semantic decision is the model's, every execution/checkpoint is the harness's. Embodies durable execution, lateral handoff, and durable human-in-the-loop approval in one loop.

### sandbox.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/sandbox.ts]]`
- Purpose: The code-mode security boundary. `runInSandbox` executes agent-written code as an async function body inside a minimal `node:vm` context exposing only the passed `SandboxApi` and `console.log`, with a synchronous `timeout` and an async backstop race. Returns a union of success/error plus captured logs.
- Key exports: `runInSandbox`, `SandboxResult` (type), `SandboxApi` (type)
- Dependencies: `node:vm`
- Learner-relevant: The sandbox/code-mode lesson — the harness mediates the boundary, but `vm` is explicitly not a real security sandbox (can't kill leaked async work), motivating hosted isolates (e2b, Cloudflare Sandbox SDK, Fly, Daytona) as a deployment choice.

### supervisor.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/supervisor.ts]]`
- Purpose: Hierarchical supervision workflow — plan (`generateObject` with a Zod `PlanSchema`), dispatch sub-agents in parallel (`Promise.allSettled` over DBOS steps), fan in successes while emitting failures and degrading gracefully, then synthesize one reply. Registers `runSupervisorWorkflow`.
- Key exports: `runSupervisorWorkflow`
- Dependencies: `@dbos-inc/dbos-sdk`, `ai`, `zod`, `@shared/events`, `./bus`, `./model`, `./investigators`
- Learner-relevant: The supervision lesson — unlike a handoff the supervisor keeps control throughout, and the structured PLAN is a first-class durable artifact. Introduces parallel sub-agents, per-child durability, and failure-tolerant fan-in.

### system-prompt.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/system-prompt.ts]]`
- Purpose: A tiny module that no longer holds prompts (those moved to `agents.ts`); it exposes `SAMPLE_TASK`, a single refund request for `cus_88121` that exercises the triage→billing handoff.
- Key exports: `SAMPLE_TASK`
- Dependencies: none
- Learner-relevant: The standard demo input across lessons; demonstrates a task that triage must recognize as outside its authority and route to the billing specialist.

### tools.ts

- Locator: `[[sources/agent-harness/20260915/harness-engineering/harness/tools.ts]]`
- Purpose: The tool layer. Holds canned data (`CHARGES` with a planted duplicate, `KNOWLEDGE_BASE`), the read-only `sandboxApi` exposed into code mode, the Zod tool schemas the model sees (`runCode`, `classifyItem`, `draftReply`, `sendReply`, privileged `issueRefund`, intercepted `handoff`), and the harness-owned `runTool` executor.
- Key exports: `tools`, `runTool`, `searchKB`, `CHARGES`
- Dependencies: `ai`, `zod`, `./sandbox`
- Learner-relevant: Makes the safe/dangerous tool split concrete and shows code mode (one program instead of many tool round-trips) plus the harness-owned executor that routes `runCode` through the sandbox while side-effecting tools run as durable steps.
