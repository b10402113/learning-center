---
source: 20-billing-agent-handoff-tool
source_type: pdf
source_lines: 308
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 20-billing-agent-handoff-tool

## Overview (L1)

- Creating the billing agent — `billingAgent` is created much like the triage agent: a name, a system prompt, and its tools. Its toolset includes run code, draft reply, and send reply (reply drafting/sending being common to all agents), while the refund capability is its distinguishing power. Both agents are exported.
- Reply capabilities as a shared concern — Because agents must be able to follow up with the user, draft/send reply tools belong on every agent by default; the lesson notes an alternative is to make reply-handling its own narrowly tuned agent if distraction and prompt-tuning cost justify the split.
- Issue-refund tool — Adds an `issueRefund` tool with a `z.object` input schema (`customerId`, `chargeId`, `amountCents`), no `execute` function (execution happens in the runtime switch so it can be wrapped in a workflow step), and a description noting the action is irreversible and moves real money.
- Handoff tool — Adds a `handoff` tool whose input schema captures who the task is being sent to (`to`, currently only `billing`) and the reason. The agent needs an explicit tool to hand off; otherwise you would have to build a separate micromanaging overseer agent.
- Why handoff is handled in the runtime, not the tool — Refund is a standard tool handled in the switch statement with hard-coded return objects, but handoff is deliberately not handled there. If handled inside the tool, the result would just return to the same agent's context and that agent would remain involved. A true handoff must be orchestrated one level up, where the runtime is the only component controlling which agent loop runs — an agent cannot remove itself and swap in another. The same principle applies to approvals and other deterministic harness concerns: keep them out of LLM reasoning so they happen reliably.
- Making context and tools agent-aware — `buildContext` is changed to take a system prompt as its first argument so each agent's prompt is used instead of a hard-coded one; a handoff event already exists in shared events so the UI can react. In the runtime, `toolSet` replaces the old singular `tools`, agents are imported, `modelTurn` takes an `agentTools: toolSet` argument passed through to `streamText`, and a new `toolResultsMessage(call, value)` helper formats a tool-call result message (role, type `tool_result`, tool call ID, tool name, JSON output) so the runtime can respond to a handoff call like any other tool.

## Sections (L2)

### billing-agent

- Locator: `[[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#billing-agent]]`
- Summary: Defines `billingAgent` by copying the triage pattern and supplying a billing system prompt and a tool set (run code, draft reply, send reply) that later gains the issue-refund power. Both triage and billing agents are exported.
- Key claims: Agents differ only by name, prompt, and tools; reply tools are broadly useful across agents; refund authority is what distinguishes the billing agent.
- Learner-relevant: A concrete second agent that makes handoff meaningful and shows the minimal per-agent surface.

### reply-tools-as-shared-capability

- Locator: `[[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#reply-tools-as-shared-capability]]`
- Summary: Discusses whether draft/send reply belongs on every agent or as its own agent. Because agents must follow up with users, the default is to give every agent reply tools; splitting reply handling into a dedicated, tightly tuned agent is a legitimate alternative if focus and prompt quality demand it.
- Key claims: Without reply tools an agent would have to hand off just to respond; a focused reply agent may produce better results at the cost of more agents; there is no single correct decomposition.
- Learner-relevant: A design trade-off exercise in agent decomposition and capability sharing.

### issue-refund-tool

- Locator: `[[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#issue-refund-tool]]`
- Summary: Adds `issueRefund` to the tools object with a `z.object` schema for `customerId`, `chargeId`, and `amountCents`, plus a description flagging it as irreversible and moving real money. It has no `execute` function because execution is handled in the runtime switch and wrapped in a workflow step.
- Key claims: Tool schemas are defined with zod objects; omitting `execute` lets the runtime control execution and durability; the description should warn that the action is irreversible.
- Learner-relevant: Shows how a high-stakes, side-effecting tool is declared and isolated.

### handoff-tool

- Locator: `[[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#handoff-tool]]`
- Summary: Adds the `handoff` tool whose input schema records `to` (destination agent, currently only `billing`) and the reason for the transfer. The lesson argues an agent needs an explicit handoff tool because the alternative would be a separate overseer agent micromanaging every call.
- Key claims: Handoff is exposed as a tool so the agent can invoke it; the destination is extensible as more agents are added; the reason field captures intent for routing and observability.
- Learner-relevant: The mechanism/interface by which an agent requests a transfer.

### runtime-level-handoff-handling

- Locator: `[[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#runtime-level-handoff-handling]]`
- Summary: Explains why the handoff tool has no handler in the tools switch: handling it there would keep the same agent in its own context. Because only the runtime controls which agent loop runs, the handoff must be intercepted at the runtime level, which can swap the active agent entirely. The same deterministic-in-the-harness principle applies to approvals, which must not be left to LLM reasoning.
- Key claims: An agent cannot replace itself in its own context — the runtime must orchestrate the swap; refund is handled as a normal tool while handoff is deliberately elevated to the runtime; deterministic harness concerns (approvals, handoff) should not depend on model judgment.
- Learner-relevant: A central architectural rule of agent harness design: control-flow primitives live in the runtime, not the LLM.

### agent-aware-context-and-tools

- Locator: `[[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#agent-aware-context-and-tools]]`
- Summary: Refactors `buildContext` to accept the agent's system prompt as its first argument, updates the runtime to use `toolSet` instead of `tools`, imports the agents, and changes `modelTurn` to accept an `agentTools: toolSet` argument that is passed to `streamText`. A handoff event already exists in shared events for the UI.
- Key claims: Each agent's system prompt and tools must flow into context building and the model turn; `toolSet` generalizes the single tool concept; a handoff event supports UI reactions.
- Learner-relevant: The plumbing that makes the same runtime serve multiple differently-tooled agents.

### tool-results-message-helper

- Locator: `[[sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt#tool-results-message-helper]]`
- Summary: Adds `toolResultsMessage(call, value)`, a helper that builds a model message shaped as a tool result: role tool, type `tool_result`, tool call ID, tool name, and JSON output value. It exists because there is no function executed for handoff, so the runtime must synthesize the return value format itself. The lesson notes SDK tooling normally does this automatically, and this is the raw shape you would hand-roll without an SDK.
- Key claims: A tool call must be followed by a response carrying the matching tool call ID; the helper converts any tool call and value into a valid tool response message; the same formatting is what SDKs generate under the hood.
- Learner-relevant: Enables the runtime to acknowledge a handoff tool call without breaking the message sequence.
