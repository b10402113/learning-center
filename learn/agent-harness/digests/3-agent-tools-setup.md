---
source: 3-agent-tools-setup
source_type: pdf
source_lines: 395
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 3-agent-tools-setup

## Overview (L1)

- Anatomy of an agent without a harness — The minimal agent loop: give the LLM tools plus descriptions, invoke it, let it request tool calls with arguments, execute them, feed results back, and repeat until it answers; why this demos well but fails in production.
- Why the naive loop fails and where harness/evals fit — Wild unbounded loops, unhandled failures, no approval layer for dangerous tools, and probabilistic reliability that cannot be measured without evals; this course covers the infrastructure half.
- Mock knowledge base — A fake knowledge base (billing, refund, export, pricing runbooks) that tools query, used instead of stuffing context on every turn; evals measure its effect on outputs.
- The `search_knowledge_base` tool — Building a tool with the AI SDK's `tool()` helper: description, Zod input schema with a described `query` field, and an execute function doing a simple in-memory search that returns articles or a "no exact match" message.

## Sections (L2)

### anatomy-of-an-agent-loop

- Locator: `[[sources/agent-harness/20260915/3-agent-tools-setup.txt#anatomy-of-an-agent-loop]]`
- Summary: Scott reviews the textbook agent loop with no harness: an LLM is given tools and descriptions, decides whether to call one, returns a tool-call request with arguments, and the loop continues until the model is confident enough to answer.
- Key claims: The agent loop iterates over tool calls until the LLM feels it has enough context to respond; the model signals a tool call by naming the tool and the arguments in its response; the AI SDK now ships this loop built in; the loop is just a "wild loop" with no stopping or failure handling.
- Learner-relevant: Gives the baseline mental model of agent execution that the harness will make robust.

### why-the-naive-loop-fails

- Locator: `[[sources/agent-harness/20260915/3-agent-tools-setup.txt#why-the-naive-loop-fails]]`
- Summary: Explains why the basic loop cannot go to production despite producing impressive demos, and distinguishes infrastructure from evals as the two halves of reliability.
- Key claims: The loop is unbounded and has no failure handling; dangerous tools (e.g. "spend money") have no approval layer; a few lines with good tools and a good prompt can be a mind-blowing demo (even generating 3D games) but reliability depends on probability; LLMs are probabilistic and a good result often just reflects a good unmeasured prompt; evals are one half of the fix and infrastructure is the other; the course focuses on the infrastructure.
- Learner-relevant: Motivates each subsequent harness feature (bounded loops, retries, approvals) by tying it to a concrete production failure.

### mock-knowledge-base

- Locator: `[[sources/agent-harness/20260915/3-agent-tools-setup.txt#mock-knowledge-base]]`
- Summary: Creates a fake in-repo knowledge base of runbook-style text for billing, refund, export, and pricing, which the tools will query. Explains what a knowledge base is and why to externalize it.
- Key claims: A knowledge base is an external corpus of information (like a wiki) an agent can reference; keeping it external avoids stuffing all context into every turn and burning tokens; the agent queries it via any mechanism (RAG, classic search, etc.); these entries act as the agent's runbook for situations like refunds and billing; evals are needed to measure the knowledge base's effect on agent outputs.
- Learner-relevant: Provides the concrete domain fixture the tools operate on and teaches the externalize-vs-stuff context tradeoff.

### search-knowledge-base-tool

- Locator: `[[sources/agent-harness/20260915/3-agent-tools-setup.txt#search-knowledge-base-tool]]`
- Summary: Builds the first tool, `search_knowledge_base`, using the AI SDK's `tool()` helper. Covers the description the LLM sees, the Zod-enforced input schema, the described `query` argument, and the execute implementation.
- Key claims: `tools` is an exported object of tool definitions created with `tool()` from the AI SDK; every tool has a description that the LLM uses to decide whether to call it; the input schema is an enforced contract so the execution code always receives expected arguments; schema fields can carry `.describe()` text explaining the argument; the execute function receives the validated input and may do anything (even call another LLM) as long as it returns, because the return value is fed back to the model; this example does a simplistic in-memory lowercase substring search over knowledge-base keys and returns an articles array with a count or a "no exact match" message plus a hint to use best judgment; this search would not be used in production and the course does not cover RAG/search.
- Learner-relevant: Establishes the reusable tool-authoring pattern (description, schema, execute, return contract) that all later tools and harness features build on.
