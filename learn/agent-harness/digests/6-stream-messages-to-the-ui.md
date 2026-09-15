---
source: 6-stream-messages-to-the-ui
source_type: pdf
source_lines: 330
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 6-stream-messages-to-the-ui

## Overview (L1)

- Appending model responses to the message array — After streaming, the harness must push the model's completed output back onto `messages`, because the LLM keeps nothing in server-side memory and must be re-sent the entire conversation each turn. The stream is awaited, then `result.messages` is spread into the array, which is why long conversations get slower and more expensive.
- The missing persistence layer — Asked what happens if a WebSocket consumer fails, the instructor answers that events are simply lost today: there is no storage or memory layer yet, and replay/pick-up-where-it-left-off is deferred to the durability lesson.
- Tool-call branch and workflow finalization — The turn awaits `result.toolCalls`; if there are none the workflow emits `modelCompleted` and `workflowCompleted` and returns. Exiting the loop without that return means `maxSteps` was hit, so the final emit is changed to `workflowFailed`.
- API key setup — Copy `dev.vars.example` to `.dev.vars` and paste the provider key (here OpenAI); non-OpenAI providers require their own variable names per their docs.
- Dry-run and the inspector — After `npm run dev`, a live WebSocket run shows the model requesting tool calls but nothing executing them, exposing real harness gaps: duplicate send-reply calls and no approval before a destructive action. The inspector replays every `emit` as an ordered event log for debugging.
- Why the harness owns the loop — The AI SDK offers `maxRetries`/its own agent loop, but using it forces you onto its hooks and couples you to that SDK; the course keeps the AI SDK only for the LLM call so the harness stays portable and under the author's control.

## Sections (L2)

### appending-model-responses

- Locator: `[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#appending-model-responses]]`
- Summary: Shows the `messages.push(...(await result.messages))` step that records the assistant's completed response so the next turn can see it.
- Key claims: Nothing about the interaction is retained on the LLM server side, so the full conversation must be sent every time; only fully completed results should be pushed, not partial stream chunks; growing message arrays make conversations slower and more costly.
- Learner-relevant: The core constraint behind context management — the client harness is the only long-term memory until a persistence layer is added.

### no-persistence-yet

- Locator: `[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#no-persistence-yet]]`
- Summary: Answers a question about a downstream WebSocket consumer failing and acknowledges that, at this stage, events that are not consumed are lost.
- Key claims: A storage/memory layer is needed to replay events and resume work; if something breaks now, the event "is not there"; persistence is the next thing to build.
- Learner-relevant: Frames the motivating failure case for the durable-execution lessons that follow.

### tool-call-branch-and-finalization

- Locator: `[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#tool-call-branch-and-finalization]]`
- Summary: Adds the `const toolCalls = await result.toolCalls` branch, emits `modelCompleted` + `workflowCompleted` and returns when there are none, and repurposes the loop-exit emit as `workflowFailed` with a max-steps message.
- Key claims: Tool calls are only collected here, not executed yet; leaving the loop can only mean max steps or another failure; a completed workflow must always return from inside the loop.
- Learner-relevant: Defines the terminal states of a turn and the honest failure signal, which the durable refactor will preserve while owning execution.

### api-key-setup

- Locator: `[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#api-key-setup]]`
- Summary: Step-by-step environment setup: duplicate `dev.vars.example` as `.dev.vars` and add the provider API key.
- Key claims: The key belongs in `.dev.vars`; each provider specifies its own environment variable name, so consult that provider's docs.
- Learner-relevant: A practical prerequisite for running and inspecting the harness locally.

### dry-run-and-inspector

- Locator: `[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#dry-run-and-inspector]]`
- Summary: Runs the agent with a sample prompt and inspects the resulting events, revealing that tool calls are requested but not executed.
- Key claims: With no tool execution the run is effectively a dry run; the model may request duplicate send-reply calls and sends replies without approval, which is unacceptable for a real product; the inspector shows every emitted event (deltas, model/workflow completion, tool requests) and how the run reached its state.
- Learner-relevant: Makes observable the exact holes (duplication, missing approval, destructive actions) that durable execution and human-in-the-loop steps must close.

### why-own-loop-not-sdk-hooks

- Locator: `[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#why-own-loop-not-sdk-hooks]]`
- Summary: Explains why the harness reimplements the agent loop instead of using the AI SDK's built-in `maxRetries`/loop hooks.
- Key claims: The SDK's loop does the same thing but opts you into its hooks, making the implementation AI-SDK-specific; the course uses the AI SDK only to make the LLM call so that switching SDKs or languages changes nothing else.
- Learner-relevant: A portability and control principle for choosing abstraction boundaries in an agent harness.

