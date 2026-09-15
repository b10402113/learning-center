---
source: 16-memory-context-hydration
source_type: pdf
source_lines: 407
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 16-memory-context-hydration

## Overview (L1)

- Why context growth degrades agents — An ever-growing conversation makes the model "dumber," slower, and more expensive; content buried in the middle of the context window is effectively forgotten (only the beginning and end are reliably attended to). Bigger context windows (e.g. a million tokens) do not solve this and are not automatically better. Eventually the app hits a hard error when the window overflows.
- The illusion of full history — Every chat product shows the user their entire history, but the LLM only ever sees a compacted subset. The harness must explicitly compact the persistent event log and reassemble ("hydrate") the exact context the model needs for the current turn.
- Building a hydrator — A `buildContext` function assembles the messages the model sees: a system message (the agent's system prompt, optionally with an injected running summary), a user message with the task just asked, and the retained turns. This is the "context on demand" step, modeled after real teams whose whole job is context assembly.
- Estimating tokens — A cheap `estimateTokens` helper measures input size; production should use the same tokenizer/encoder as the model (e.g. TikToken), but the lesson fakes it at roughly four characters per token. Token budgets care about combined input/output, with typical asymmetry between how much is sent vs. received.
- Summarization via a separate LLM call — The `summarize` function calls `generateText` (not streaming, because the summary is not shown live and must complete before proceeding) with a distinct summarizer system prompt. It flattens prior turns to text, folds in any prior summary to produce "summaries of summaries," and returns terse text preserving concrete facts, IDs, categories, amounts, and what was already sent.
- System-message and message-array discipline — Only one system message is allowed (multiple system-role messages are frowned upon and may warn/error); extra summary content should be appended to the existing system content. When using a messages array, the sequence must end on a user (or tool) message or the model has nothing to act on.

## Sections (L2)

### context-growth-problem

- Locator: `[[sources/agent-harness/20260915/16-memory-context-hydration.txt#context-growth-problem]]`
- Summary: Opens the lesson on memory and context by describing what happens when context grows forever: the model gets dumber, slower, and more expensive, and middle-of-context content is effectively lost. Larger context windows do not fix this, and eventually the app errors out when it cannot accept more input.
- Key claims: Middle content is treated as forgotten, with reliable attention only at the start and end; longer context is not better and often worse; every conversation app will eventually break without compaction.
- Learner-relevant: Motivates why an agent harness needs explicit compaction and context hydration rather than relying on a large window.

### hydration-and-compaction-plan

- Locator: `[[sources/agent-harness/20260915/16-memory-context-hydration.txt#hydration-and-compaction-plan]]`
- Summary: Frames the lesson's two deliverables — a hydrator that assembles the exact context the agent needs right now, and a compactor (token-threshold based, set artificially low for demonstration) that shrinks the ballooning persistent event log. Notes that users see full history while the LLM sees only a slice.
- Key claims: The persistent event log balloons and must be compacted; a hydrator decides what the LLM sees on demand; context assembly is a real team/role responsibility.
- Learner-relevant: Gives the build plan and naming (hydrator, compactor) that later steps implement.

### memory-file-and-limits

- Locator: `[[sources/agent-harness/20260915/16-memory-context-hydration.txt#memory-file-and-limits]]`
- Summary: Creates `memory.ts` in the harness and sets compaction limits (`maxTokens`, `keepContextTokens`) very low so compaction is visible in demos. Notes tokens average about four characters and depend on the model's encoder.
- Key claims: `generateText` is imported instead of `streamText` because compaction must complete before continuing; limit values are configurable and deliberately small for demonstration; token counts depend on the model's encoder.
- Learner-relevant: Establishes the concrete code artifact and tuning knobs for all later compaction behavior.

### estimate-tokens

- Locator: `[[sources/agent-harness/20260915/16-memory-context-hydration.txt#estimate-tokens]]`
- Summary: Defines `estimateTokens` over the entire messages array, with the caveat that this crude character-based estimate should not be used in production. Production should use the same tokenizer/encoder as the target model (TikToken is the standard, but tooling availability pushed the demo to a fake estimate).
- Key claims: Measure the whole combined context, not just one message; input and output token budgets differ, with cheaper/larger budgets typically on output; a real tokenizer gives accurate counts because it matches the model's encoder.
- Learner-relevant: Teaches the token-measurement primitive that compaction thresholds and context budgets depend on.

### build-context

- Locator: `[[sources/agent-harness/20260915/16-memory-context-hydration.txt#build-context]]`
- Summary: Implements `buildContext`, which returns a new messages array: it starts from a baseline system message (the system prompt, optionally with an injected prior summary), then a user message containing the current task, then appends the retained turns. Demonstrates that adding summary content should append to the existing system content rather than pushing a second system message.
- Key claims: Context is rebuilt every time the user sends a new message and is the place to check whether compaction is needed; the summary is injected into the system prompt so the LLM knows what already happened; two system-role messages are bad practice and may warn or error.
- Learner-relevant: The central hydration function — shows exactly what the model sees each turn and how summaries re-enter context.

### summarize-function

- Locator: `[[sources/agent-harness/20260915/16-memory-context-hydration.txt#summarize-function]]`
- Summary: Implements `summarize` as a single `generateText` call using a summarizer-specific system prompt that is distinct from the task agent's prompt. It flattens the old turns into role-and-content strings, truncates to a bounded size, folds in any prior summary, and instructs the model to compress the work log into a short running summary preserving concrete facts.
- Key claims: The summarizer is just an LLM call and can be enhanced; summaries of summaries are supported by feeding the prior summary back in; the messages array must end with a user message or the LLM will not act; the summarizer prompt should preserve IDs, categories, amounts, and what was already sent, and be terse.
- Learner-relevant: Provides the reusable summarization primitive and prompt-design guidance that the runtime calls during compaction.
