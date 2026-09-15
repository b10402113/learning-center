---
source: 9-durable-tools
source_type: pdf
source_lines: 546
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 9-durable-tools

## Overview (L1)

- Deciding what to make durable — With DBOS, anything wrapped in a step has its inputs and outputs persisted so it can be retried, suspended, or replayed. The lesson identifies two candidates in the current runtime: each individual tool call (so it can be retried and survive server failure) and each emitted event (since the bus now writes to the event log, wrapping emits prevents duplicate rows). Wrapped together, these steps form a workflow.
- Taking tool execution back from the AI SDK — Because the AI SDK auto-runs any tool that has an `execute` function, tool `execute` functions are deleted so calls only happen inside a DBOS step. A single `runTool` switch statement replaces them, keeping the original mocked logic but centralizing dispatch and making it independently exportable (no DBOS dependency in the tools file; the step wrapping happens at the call site inside the workflow).
- New runtime types: ToolCall and Turn — `ToolCall` carries `toolCallId`, `toolName`, and `inputs`; `Turn` carries the turn's text stream, its tool calls, and the response messages. Tracking turns in the event log lets recovery restart from the turn that was in progress.
- Extracting modelTurn — A function wraps `streamText({ model, messages, tools })`, iterates `fullStream` emitting `modelDelta` for text chunks, awaits `result.toolCalls`, and returns a `Turn` with cleaned tool calls and the awaited response messages.
- Extracting toolStep — A function for a single tool call emits `toolRequested` (with ID, name, and args), runs `runTool`, then emits `toolCompleted` with the output, all correlated by tool-call ID.
- Converting the runtime into a DBOS workflow — `DBOS.workflowID` supplies the workflow ID (falling back to "unknown"), and previously bare emits are wrapped in `await DBOS.runStep(async () => emit(...), { name })`. Wrapping in a step is described as the entire mechanism: DBOS is the simplest durable engine because existing code stays and only gets wrapped.

## Sections (L2)

### what-to-make-durable

- Locator: `[[sources/agent-harness/20260915/9-durable-tools.txt#what-to-make-durable]]`
- Summary: Reasons about which parts of the runtime should be durable: individual tool calls and event emissions.
- Key claims: DBOS persists the inputs/outputs of anything wrapped in a step so it can be retried, suspended, or survive server failure; each tool should be its own step; emits should be steps so duplicate events never land in the database; steps combine into a workflow.
- Learner-relevant: The design decision process for choosing durability boundaries — a reusable mental model beyond this specific agent.

### removing-execute-and-adding-run-tool

- Locator: `[[sources/agent-harness/20260915/9-durable-tools.txt#removing-execute-and-adding-run-tool]]`
- Summary: Deletes the `execute` fields from every tool and introduces one `runTool(name, args)` function containing the switch that dispatches to the original mocked logic.
- Key claims: If a tool has an `execute` function the AI SDK will run it and complete the harness loop, bypassing the DBOS step; removing `execute` forces execution to happen in a step the author controls; passing step/workflow IDs into each tool would waste tokens; the default case throws for unknown tools.
- Learner-relevant: The concrete refactor and its rationale — controlling execution is what makes durability and auditing possible.

### wrapping-runtool-in-a-step

- Locator: `[[sources/agent-harness/20260915/9-durable-tools.txt#wrapping-runtool-in-a-step]]`
- Summary: Explains that the DBOS boundary is applied where `runTool` is called inside the workflow, not inside the tools file.
- Key claims: Keeping `runTool` free of DBOS imports lets it be exported and reused elsewhere; wrapping at the call site keeps all steps in one workflow rather than scattered across the repo (a pattern to avoid).
- Learner-relevant: A concrete module-boundary/ownership pattern for applying cross-cutting concerns like durability.

### toolcall-and-turn-types

- Locator: `[[sources/agent-harness/20260915/9-durable-tools.txt#toolcall-and-turn-types]]`
- Summary: Defines TypeScript helper types `ToolCall` (`toolCallId`, `toolName`, `inputs`) and `Turn` (tool calls, response messages, plus a text stream).
- Key claims: The harness must now handle its own tool calls; a turn is one model call that either requests a tool call or finishes; tracking turns in the event log is what allows resuming from the turn in progress.
- Learner-relevant: The data model for the durable workflow's unit of progress and recovery.

### model-turn-function

- Locator: `[[sources/agent-harness/20260915/9-durable-tools.txt#model-turn-function]]`
- Summary: Extracts the streaming/model logic into `modelTurn(workflowId, messages)`, emitting text deltas and returning a `Turn`.
- Key claims: It iterates `result.fullStream` and emits `modelDelta` per text chunk; after the loop it awaits `result.toolCalls` and maps them into clean `ToolCall` objects; response messages are awaited and returned; the logic is unchanged from the earlier inline loop, only abstracted so it can be wrapped in a step.
- Learner-relevant: Shows how to refactor monolithic turn logic into a step-ready unit without altering behavior.

### tool-step-function

- Locator: `[[sources/agent-harness/20260915/9-durable-tools.txt#tool-step-function]]`
- Summary: Extracts `toolStep(workflowId, call)`, which emits `toolRequested`, executes `runTool`, and emits `toolCompleted`.
- Key claims: Every function takes the workflow ID; the request event carries toolCallId, name, and args; the completion event carries the same toolCallId plus the output so results correlate with the model's request.
- Learner-relevant: The per-tool durability unit and the event contract that makes tool progress visible and replayable.

### converting-runtime-to-dbos-workflow

- Locator: `[[sources/agent-harness/20260915/9-durable-tools.txt#converting-runtime-to-dbos-workflow]]`
- Summary: Turns the runtime into a DBOS workflow: import DBOS, derive the workflow ID from `DBOS.workflowID` (or "unknown"), and wrap emits in `DBOS.runStep`.
- Key claims: `DBOS.runStep(callback, { name })` persists the step's inputs/outputs and prevents re-execution after a crash; wrapping existing code in steps is the whole change, so DBOS is the simplest durable-execution engine the author has used.
- Learner-relevant: The capstone transformation that makes the harness crash-safe and resumable while keeping the original logic intact.

