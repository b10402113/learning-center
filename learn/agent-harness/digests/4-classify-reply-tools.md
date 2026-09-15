---
source: 4-classify-reply-tools
source_type: pdf
source_lines: 279
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 4-classify-reply-tools

## Overview (L1)

- `classify_item` tool — Builds a mocked classification tool with Zod: an `item_id` and a `category` enum (billing, technical, sales, other), whose execute returns `{ ok: true }`; the agent is an intentionally terrible fixture that exists only to exercise the harness.
- Input-schema descriptions and `draft_reply` tool — Q&A on when to `.describe()` schema fields (model-dependent but recommended), then a `draft_reply` tool taking `item_id` and a `message` string and returning a made-up draft ID.
- `send_reply` tool and the danger of unguarded actions — A tool that actually sends a drafted reply; used to show why guardrails and approvals cannot live in prompt text and must be enforced by the harness.
- System prompt — Creating `system-prompt`, the agent's foundational instructions/persona, why exposed system prompts are not a big deal, and how large system prompts can consume much of a context window.

## Sections (L2)

### classify-item-tool

- Locator: `[[sources/agent-harness/20260915/4-classify-reply-tools.txt#classify-item-tool]]`
- Summary: Adds the `classify_item` tool using Zod for a runtime-validated schema with an `item_id` and a `category` enum. Stresses that the agent and its strings are deliberately meaningless fixtures.
- Key claims: Zod is a runtime schema validator for JavaScript objects, popular and AI-SDK-compatible; the tool requires an `item_id` and a `category` constrained to an enum of billing, technical, sales, or other; the execute function is mocked and returns `{ ok: true }` (echoing inputs) just so the agent believes something happened; the categories were chosen arbitrarily and need not map to the knowledge base; the agent can be terrible and do nothing because the point is building a harness, not an effective agent — it is a fixture for testing the harness; some thought goes into tool/detail phrasing only to make the harness easy to trigger for testing; no evals were written for this.
- Learner-relevant: Reinforces the course's fixture philosophy and adds enum-constrained arguments to the learner's tool-authoring vocabulary.

### input-descriptions-and-draft-reply

- Locator: `[[sources/agent-harness/20260915/4-classify-reply-tools.txt#input-descriptions-and-draft-reply]]`
- Summary: Answers whether to describe input-schema fields and then adds the `draft_reply` tool. Explains that field descriptions are another influence surface on the agent, though their value depends on the model.
- Key claims: Describing input-schema fields is worthwhile when the goal is to make sure the agent knows what a field means; descriptions are one of many services/techniques for improving agent output (covered in AI Engineering and Intro to Agents); whether a description is needed depends on the model — obvious fields like `item_id` may need none, but if the field is named differently in the incoming data, a description should map it; `draft_reply` takes `item_id` and a `message` string and returns a mocked `{ ok: true, draft_id }`; the message value is not actually used.
- Learner-relevant: Teaches field-level `.describe()` as a targeted influence mechanism and where to apply it, deepening the schema-authoring skill.

### send-reply-tool

- Locator: `[[sources/agent-harness/20260915/4-classify-reply-tools.txt#send-reply-tool]]`
- Summary: Adds `send_reply`, a tool that actually sends a drafted reply, to dramatize why an unguarded harness is dangerous and why text-level guardrails are ineffective.
- Key claims: An agent with a send tool may send drafts on its own because sending is required to satisfy the objective, without the user ever reviewing them; nobody would trust such an agent; the naive harness will actually send the reply, which is terrifying and must be prevented; putting "don't use this unless you ask the user" in a tool description does not work — guardrails and safety implemented in text will fail; real enforcement must live in the harness.
- Learner-relevant: Provides the motivating example for the approval/guardrail features the harness will implement, showing why prompts are not a security boundary.

### system-prompt

- Locator: `[[sources/agent-harness/20260915/4-classify-reply-tools.txt#system-prompt]]`
- Summary: Creates the `system-prompt` file and explains the system prompt as the agent's foundational instruction and persona, distinct from user messages.
- Key claims: The system prompt is where the agent author defines background/foundational instructions, persona, and user context — not the per-message user instruction; settings like ChatGPT's tone/personality map to the system prompt; people often extract and publish other products' system prompts, but vendors like Anthropic do not consider it a big deal; system prompts can be thousands of tokens and consume a large share of the context window (roughly four to six characters per token depending on model); this course's basic system prompt describes the triage agent and instructs it to work through each work item and briefly summarize it.
- Learner-relevant: Introduces the system prompt as a harness-adjacent configuration surface and primes the learner for context-window and instruction-design concerns.
