---
source: 17-summarization-compaction
source_type: pdf
source_lines: 321
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 17-summarization-compaction

## Overview (L1)

- Wiring memory into the runtime — Imports `buildContext`, `summarize`, `estimateTokens`, `maxTokens`, and `keepContextTokens` from `memory.ts` into the runtime, increases the step allowance, and tracks per-workflow `turns` and a running `summary` across the agent loop.
- Compaction before the model turn — The token estimate is checked at the top of every iteration, before the LLM call, because that is where an overflow error would occur. If the estimate exceeds `maxTokens`, old turns are shifted off until the estimate drops below `keepContextTokens`.
- Turn-based sliding window — Compaction removes whole turns, never individual messages, because a sliding window over messages can strand a dangling tool call/response and break the API. A turn is defined as the input text, its associated tool calls, and its response messages, so a turn boundary is always a complete, valid cycle.
- Durable summarization step — When old turns exist, compaction runs `DBOS.runStep` with a named summarization step that takes the old history plus any prior summary, then recomputes tokens, rebuilds context with the new summary, and emits a `memory_compacted` event (workflow ID, summarized turn count, resulting tokens, and the summary text).
- Hydrated model turn — After compaction, `buildContext` produces the context actually passed to the model turn (user input + optional summary + retained turns), replacing the raw messages. The turn's response messages are pushed back onto the turn collection so future compaction works over complete turns.
- Prompting for turn-by-turn behavior — A sample system prompt instructs the agent to handle items one at a time, finish all four steps for an item before starting the next, and summarize briefly when done — deliberately chosen to force token growth and exercise compaction rather than as real-world prompt advice.

## Sections (L2)

### runtime-imports-and-state

- Locator: `[[sources/agent-harness/20260915/17-summarization-compaction.txt#runtime-imports-and-state]]`
- Summary: Imports the memory module's compaction helpers into the runtime, raises the allowed steps, and initializes `turns` (an array of model-message turns) and `summary` (a string) so later summaries can include prior summaries.
- Key claims: All memory primitives are consumed from `memory.ts`; `turns` starts as an empty array and `summary` as an empty string; the summary must persist across iterations to enable summaries of summaries.
- Learner-relevant: Shows the runtime state needed to make compaction stateful and cumulative.

### compact-before-model-turn

- Locator: `[[sources/agent-harness/20260915/17-summarization-compaction.txt#compact-before-model-turn]]`
- Summary: Explains that the compaction check belongs at the top of the loop, before the model turn, because the model turn is where hitting the context limit would error. It estimates tokens over the flattened turns and compares against the max context tokens.
- Key claims: Always compact before calling the LLM, not after; overflow risk lives at the model turn; the check estimates tokens across all accumulated turns.
- Learner-relevant: Establishes the ordering constraint that makes the harness robust to context limits.

### turn-based-sliding-window

- Locator: `[[sources/agent-harness/20260915/17-summarization-compaction.txt#turn-based-sliding-window]]`
- Summary: Implements a `while` loop that shifts the oldest turn off the front and pushes it into an `old` array until the estimate is below `keepContextTokens`. Stresses that compaction operates on turns, not messages, to avoid ending the array on a hanging tool call.
- Key claims: Turns are the atomic unit of compaction; message-level trimming can produce a broken message array; windowing keeps the most recent X tokens and moves older turns aside for summarization.
- Learner-relevant: The key correctness rule for context compaction — always trim complete turns to keep the API call valid.

### durable-summarize-step

- Locator: `[[sources/agent-harness/20260915/17-summarization-compaction.txt#durable-summarize-step]]`
- Summary: When old turns were shifted out, compaction calls `DBOS.runStep` with a named summarize step that receives the old history and optional prior summary. Afterwards it recomputes tokens and emits a `memory_compacted` event carrying workflow ID, summarized turn count, current tokens, and the summary text, so the user is warned their history was summarized.
- Key claims: Summarization is wrapped in a durable, named workflow step; the `memory_compacted` event informs the user that content was forgotten; the step records how many turns were summarized and the resulting token count.
- Learner-relevant: Connects the summarizer to durability and user-visible observability.

### hydrate-and-run-turn

- Locator: `[[sources/agent-harness/20260915/17-summarization-compaction.txt#hydrate-and-run-turn]]`
- Summary: After compaction and before the model turn, `buildContext` rebuilds the messages from the user input, the current summary (if any), and the retained turns. The model turn receives this built context instead of raw messages, and its response messages are tracked per turn and appended to `turns`.
- Key claims: The model turn must receive built context (including any summary), not the unsummarized messages; `turnMessages` come from `turn.response.messages`; each completed turn is pushed so future compaction and rebuilds stay consistent.
- Learner-relevant: Completes the hydration loop and shows how turns accumulate for the next compaction cycle.

### prompt-turn-by-turn

- Locator: `[[sources/agent-harness/20260915/17-summarization-compaction.txt#prompt-turn-by-turn]]`
- Summary: Updates the system prompt with instructions to process items one at a time, finish all four steps before moving on, and briefly summarize when all items are done. This is an artificial example designed to generate more tokens and trigger compaction, not necessarily a real-world recommendation. The sample task is also refreshed to the fuller version.
- Key claims: The prompt is written to deliberately grow token usage and force summarization; in a real deployment this prompt would likely be unnecessary; the sample task is updated to exercise the flow.
- Learner-relevant: Demonstrates how prompt design interacts with token budgets and gives a controllable way to observe compaction.
