---
source: 5-harness-runtime
source_type: pdf
source_lines: 476
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 5-harness-runtime

## Overview (L1)

- Runtime setup and step budgeting — The harness runtime is the core of the system. It imports `streamText` from the AI SDK, TypeScript types, the model, the tools, and the system prompts, and defines a `maxSteps` guard (10) so a runaway agent cannot loop forever or run up the bill. A "step" is one turn of the think → act → think loop.
- Constructing the model message array — OpenAI-compatible LLMs take an array of `ModelMessage` objects with a `role` (`system`, `user`, `assistant`, `tool`) and `content`. The runtime seeds the array with the system prompt, then appends the user's input, so every call carries the full conversation.
- The agent loop and streaming — A `while` loop counts steps and calls `streamText({ model, messages, tools })`. Because it returns a stream rather than a final value, the code iterates `result.fullStream` and handles each chunk as it arrives (token-by-token UI).
- Stream part types become UI events — The stream emits typed parts (text delta, tool call, tool result/error) which the runtime switches on and re-emits as harness events (`modelDelta`, `toolRequest`, `toolCompleted`, `workflowFailed`) so clients stay updated. The transport (WebSocket, polling, etc.) is explicitly declared an unimportant implementation detail.
- Tool-calling semantics — The LLM never runs tool code; it only requests a tool by name with arguments and a tool-call ID, and the server must execute it and feed the result back correlated by that ID. Provider-hosted and client-side tools are acknowledged but out of scope.
- Why streaming is non-negotiable — If responses were not streamed, all the chunk-handling code could be deleted and the UI would only show the final answer; the instructor argues no one would pay for or use such a product.

## Sections (L2)

### runtime-setup-and-max-steps

- Locator: `[[sources/agent-harness/20260915/5-harness-runtime.txt#runtime-setup-and-max-steps]]`
- Summary: Opens the runtime file, explains that the three existing emits do nothing on their own, and pulls in the pieces needed to build the harness: `streamText` from `ai`, TypeScript types, the model, the tools, and the system prompts. Defines `maxSteps = 10` as a safety budget.
- Key claims: `streamText` sends messages to the LLM provider and streams the response back; the loop is limited to 10 steps to prevent runaway AI cost; a "step" is one turn (ask the model to do a thing, it does it, it thinks again).
- Learner-relevant: Establishes the runtime skeleton and the mental model of a step as a loop iteration, which every later durability refactor builds on.

### message-array-construction

- Locator: `[[sources/agent-harness/20260915/5-harness-runtime.txt#message-array-construction]]`
- Summary: Shows how to build the `ModelMessage[]` most OpenAI-compatible APIs expect, starting with the `system` role carrying the system prompt and then the `user` role carrying the input that kicked off the run.
- Key claims: Messages are objects with a `role` and `content`; the typical roles are system, user, assistant, and tool call; most SDKs abstract this away, but the course builds it explicitly.
- Learner-relevant: Gives the concrete shape of the message history the agent must maintain across turns for the model to "remember" anything.

### agent-loop-and-streaming

- Locator: `[[sources/agent-harness/20260915/5-harness-runtime.txt#agent-loop-and-streaming]]`
- Summary: Implements the `while (step < maxSteps)` loop that calls `streamText` and iterates the returned stream via `for await (const part of result.fullStream)`.
- Key claims: `streamText` is intentionally not awaited because it returns a subscribable stream; awaiting it or using `generateText` would give only the final result; the stream is iterated part-by-part so tokens can be shown as they arrive.
- Learner-relevant: The central mechanical pattern of the harness — call the model, consume the async stream, act on each chunk — reused verbatim in the later durable refactor.

### stream-part-types-and-events

- Locator: `[[sources/agent-harness/20260915/5-harness-runtime.txt#stream-part-types-and-events]]`
- Summary: Switches on `part.type` to translate raw provider chunks into harness events: text deltas become `modelDelta`, tool calls become `toolRequest` (with tool-call ID, name, and arguments), tool results become `toolCompleted`, and errors become `workflowFailed`.
- Key claims: Providers stream heterogeneous chunks (text delta, tool call, result, error) and each needs its own UI treatment; `emit` maps a Node stream onto a WebSocket stream; the transport layer is irrelevant to the core problem, which is keeping interested clients updated about an async process.
- Learner-relevant: Explains why each event type exists and why arguments are emitted (so a human-in-the-loop approval can actually see what is being approved).

### tool-calling-semantics

- Locator: `[[sources/agent-harness/20260915/5-harness-runtime.txt#tool-calling-semantics]]`
- Summary: Clarifies that the LLM does not execute tools — it only chooses a tool by name/description and supplies arguments, and the server must run the function and return the result back to the model.
- Key claims: Tools are provided to `streamText` so the model knows their name, description, and argument schema; the model generates a tool-call ID that must be echoed back on the tool result or most LLMs break; provider-hosted and client-side tools exist but are out of scope.
- Learner-relevant: The key conceptual correction that the harness is the model's "helper"/executor, motivating the later decision to own tool execution rather than let the SDK do it.

### why-streaming-matters

- Locator: `[[sources/agent-harness/20260915/5-harness-runtime.txt#why-streaming-matters]]`
- Summary: Wraps the section with a usability argument: streaming is the reason to write all the chunk-handling code, and without it the whole block disappears.
- Key claims: If not streaming, you would wait for the final response and drop it into the UI; such a product would not be paid for or used in 2026.
- Learner-relevant: A design rationale to anchor the "stream tokens to the client" requirement before persistence is layered on top.

