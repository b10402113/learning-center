---
source: 21-agent-triage-handoff
source_type: pdf
source_lines: 277
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 21-agent-triage-handoff

## Overview (L1)

- Active-agent state — The runtime introduces a mutable `currentAgent`, defaulting to the triage agent as the point of entry (the agent that accepts every request, handles what it can, and routes the rest). Handoffs will toggle this reference.
- Wiring agents through the loop — Because `buildContext` now takes a system prompt, both call sites in the loop are updated to pass `currentAgent.systemPrompt`; the model turn is also updated to receive the third argument `currentAgent.tools`.
- Intercepting the handoff tool call — Inside the tool-call iteration loop, before executing any registered tool, the runtime checks whether the call's name is `handoff`. If so, it extracts the destination (`input.to`, defaulted) and the reason, and captures the sender from `currentAgent.name`.
- Durable handoff event and agent swap — The handoff is persisted in a named DBOS step that emits an `agent_handoff` event carrying workflow ID, from, to, and reason. Then `currentAgent` is switched to `agents[to]` (or left unchanged if the destination does not exist), and the outgoing turn messages are pushed.
- Responding to the tool call — Because a tool call must be immediately followed by a response with the same ID, the runtime pushes a synthetic tool result via the `toolResultsMessage` helper (success plus the destination). Skipping this breaks the API; this is another reason turns are the compaction unit — leaving a message array in a broken state forces painful recursive self-healing.
- Demonstrated handoff — Running the sample prompt with the now-enabled handoff tool shows the triage agent classify the request, decide it needs a billing specialist, and hand off; the event log records the transfer from triage to billing with a reason, and the billing agent takes over and continues the task. The lesson suggests making handoffs visible in the UI (e.g. changing the active-agent icon based on the `to` field) or having the new agent introduce itself.

## Sections (L2)

### track-current-agent

- Locator: `[[sources/agent-harness/20260915/21-agent-triage-handoff.txt#track-current-agent]]`
- Summary: The runtime now tracks `currentAgent`, starting as the triage agent, the fixed point-of-entry that takes all requests and delegates when it cannot or is not permitted to act. This variable is what a handoff toggles.
- Key claims: There is always an entry/point-of-contact agent; the triage agent is the default; handoffs are implemented as switching this active agent reference.
- Learner-relevant: Establishes the single mutable piece of state that drives agent switching.

### wire-agent-prompt-and-tools

- Locator: `[[sources/agent-harness/20260915/21-agent-triage-handoff.txt#wire-agent-prompt-and-tools]]`
- Summary: Both `buildContext` call sites are updated to pass `currentAgent.systemPrompt` as the new first argument, and the model turn is updated to pass `currentAgent.tools` as its third argument.
- Key claims: Context building and model turns must use the active agent's prompt and tool set; the earlier refactor breaks the loop until these call sites are updated.
- Learner-relevant: The concrete integration points where per-agent configuration reaches the model.

### intercept-handoff-call

- Locator: `[[sources/agent-harness/20260915/21-agent-triage-handoff.txt#intercept-handoff-call]]`
- Summary: In the iteration over tool calls, before executing any step, the runtime checks whether the call name equals `handoff`. If it does, it reads the destination (`input.to`, defaulted to empty string) and the reason (`input.reason`), and identifies the sender via `currentAgent.name`.
- Key claims: Handoff has no registered execution, so it must be intercepted specially; the lesson suggests defining the tool name as a constant/enum to avoid typos; from/to/reason are collected for the event.
- Learner-relevant: The precise branch point where runtime control-flow diverges from normal tool execution.

### handoff-event-and-agent-swap

- Locator: `[[sources/agent-harness/20260915/21-agent-triage-handoff.txt#handoff-event-and-agent-swap]]`
- Summary: The handoff is persisted via `DBOS.runStep` under the name `handoff_step`, emitting an `agent_handoff` event with workflow ID, from, to, and reason so subscribers/UI can react. The runtime then sets `currentAgent = agents[to]`, falling back to staying on the current agent if the destination does not exist.
- Key claims: Handoff events are durable and observable through the workflow event stream; the agent swap is a simple map lookup; an unknown destination safely leaves the agent unchanged.
- Learner-relevant: Shows the durable, event-driven implementation of the handoff itself.

### immediate-tool-response

- Locator: `[[sources/agent-harness/20260915/21-agent-triage-handoff.txt#immediate-tool-response]]`
- Summary: After the handoff, the runtime immediately pushes a synthetic tool response (via `toolResultsMessage`) with the success value and the destination. The lesson stresses that a tool call must be followed by a response carrying the same tool call ID, or the API breaks, and that sending any other kind of message next is invalid. This is cited as another justification for turn-based compaction.
- Key claims: Tool calls require an immediately following matching response; the helper supplies the correct shape and ID; an inconsistent array would require recursive traversal and self-healing, which is why turns keep arrays valid.
- Learner-relevant: Reinforces message-sequence integrity as a hard constraint and shows the resolution.

### demonstrated-handoff

- Locator: `[[sources/agent-harness/20260915/21-agent-triage-handoff.txt#demonstrated-handoff]]`
- Summary: Running the sample prompt (after re-enabling the commented-out tools) shows the triage agent classify the request, conclude it needs a billing specialist, and actually hand off. The event log records the transfer from triage to billing with the reason (duplicate pro-plan monthly charge), memory is compacted, and the billing agent completes the work. The lesson also notes a URL/param typo the agent produced and suggests making the active agent visually distinct or prompting the new agent to introduce itself.
- Key claims: End-to-end handoff works: classification, routing, durable event, agent swap, and continued execution by the billing agent; UI can surface handoffs via the `to` field or active-agent styling; the agent can still make small mistakes (e.g. a typo) that do not necessarily break the flow.
- Learner-relevant: The validating demonstration that routing, handoff, events, and compaction all interoperate.
