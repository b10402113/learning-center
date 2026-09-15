---
source: 10-durable-agent-loop
source_type: pdf
source_lines: 265
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 10-durable-agent-loop

## Overview (L1)

- Keeping deterministic setup outside steps — Pure, side-effect-free initialization that repeats identically on every run is safe to leave outside a durable step; only nondeterministic or costly work must be captured.
- Wrapping the model turn in a durable step — The `streamText` call moves into a `runStep`-backed `modelTurn` function keyed by workflow ID, so a restart resumes instead of re-invoking the LLM and re-billing tokens. Awaiting the step does not stop streaming because the inner stream is still awaited inside the step.
- Persisting database emits as steps — The "model done" and "completed" emits (which write to the DB) are wrapped in `DBOS.runStep` so they are idempotent and never fire twice on retry.
- Owning tool-call execution — Because the AI SDK's automatic tool execution was opted out of elsewhere, the loop now iterates `turn.toolCalls`, runs each through a durable tool step, and pushes a role `tool` result message (type `tool-result`, matching toolCallId/toolName, JSON output) back into the message array.
- Durable failure emit — The workflow-failed emit is also wrapped in a step (`failedStep`) so failure bookkeeping is not duplicated.
- Registering the workflow — The runtime function is renamed `agentWorkflow` and passed to `DBOS.registerWorkflow`; steps only gain meaning once the container is registered as a workflow.

## Sections (L2)

### deterministic-setup-outside-steps

- Locator: `[[sources/agent-harness/20260915/10-durable-agent-loop.txt#deterministic-setup-outside-steps]]`
- Summary: Opens by establishing the rule for what may live outside a durable step — code that always does the same thing and does not depend on anything nondeterministic.
- Key claims: Work that "literally does the same thing every time" can stay outside a step; keeping it out avoids needless step bookkeeping; the criterion is nondeterminism, not size.
- Learner-relevant: Gives the learner a concrete test for deciding step boundaries, the core skill of durable workflow design.

### model-turn-as-a-step

- Locator: `[[sources/agent-harness/20260915/10-durable-agent-loop.txt#model-turn-as-a-step]]`
- Summary: The in-loop `streamText` call is replaced by awaiting a durable step that invokes the previously created `modelTurn` function, passing workflow ID, messages, and a step name.
- Key claims: Leaving `streamText` outside a step means it reruns on every workflow restart, costing extra LLM money and tokens; awaiting a step is not the same as awaiting the stream result, so streaming continues; the step is named with the current step count for visibility.
- Learner-relevant: Teaches the flagship durability win — deduplicating expensive LLM calls across restarts — and clears up a common confusion about awaiting inside streaming.

### emit-steps-no-tool-calls

- Locator: `[[sources/agent-harness/20260915/10-durable-agent-loop.txt#emit-steps-no-tool-calls]]`
- Summary: In the branch where the turn has zero tool calls, the two emits (talking to the database) are wrapped in `DBOS.runStep` as the "model done" and "completed" steps, then the text is returned.
- Key claims: Emits are non-idempotent when left floating in the workflow and could produce different results each run; `turn.response.messages` is pushed into the message array; zero tool calls signals the agent is finished answering.
- Learner-relevant: Shows how side-effecting UI/database notifications become idempotent and how the loop's termination branch is shaped.

### own-tool-call-execution

- Locator: `[[sources/agent-harness/20260915/10-durable-agent-loop.txt#own-tool-call-execution]]`
- Summary: The tool-calls branch now manually loops over `turn.toolCalls`, runs each inside a durable tool step, and feeds a properly shaped tool-result message back to the model.
- Key claims: Each tool call runs via `DBOS.runStep` calling the custom tool step with workflow ID and the tool call, named by tool-call ID; the response message must use role `tool`, type `tool-result`, `toolCallId`, `toolName`, and a JSON output value (`{type: "json", value: output}`); this manual work exists only because control was taken back from the AI SDK.
- Learner-relevant: The central mechanics of a hand-rolled agent loop — how tool results are persisted and formatted for the next generation.

### failed-emit-step

- Locator: `[[sources/agent-harness/20260915/10-durable-agent-loop.txt#failed-emit-step]]`
- Summary: The workflow-failed emit at the bottom of the loop is wrapped in its own step so a failure signal is emitted only once.
- Key claims: The failed emit must not happen more than once; it is wrapped with `DBOS.runStep` and named `failedStep`; the handler returns an empty string.
- Learner-relevant: Reinforces the idempotency rule for the failure path, a frequently overlooked branch.

### register-workflow

- Locator: `[[sources/agent-harness/20260915/10-durable-agent-loop.txt#register-workflow]]`
- Summary: The runtime function is renamed `agentWorkflow` and exported via `DBOS.registerWorkflow`, making the steps meaningful; a naming convention about the `workflow` suffix is explained.
- Key claims: Steps mean nothing unless the enclosing function is registered as a workflow; the `Workflow` naming suffix is a deliberate signal that the function has special durable semantics; behavior is unchanged, only step separation was added. It also fixes the `toolCalls` type spelling.
- Learner-relevant: Connects the writing of steps to the registration step that activates durability, and establishes a readable workflow-naming convention.
