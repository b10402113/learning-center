---
source: 19-agent-handoffs
source_type: pdf
source_lines: 285
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 19-agent-handoffs

## Overview (L1)

- When one agent handles everything — A single agent with many tools is often fine; routing/handoffs are not a default you reach for just because tool count grows. Real reasons to split include sensitive or destructive tools that should not be broadly available, different guard rails, separate team ownership, and cleaner division of responsibility. The decision should follow your architecture, metrics, and observed problems — not fashion.
- Anti-pattern of premature multi-agent — Splitting agents before you have the problem is likened to buying the most expensive AWS box before you have customers. Agent "swarms" (many agents on one objective) are largely a marketing fantasy sold by labs; if a top LLM with a decent harness cannot solve the problem, a swarm probably will not either — it just burns money.
- What a handoff actually is — A handoff is not about intelligence but about routing to a better-qualified or properly privileged agent. Using a barbershop analogy: you talk to someone initially, they determine someone else is better suited, and control transfers completely — the first agent is no longer involved, not supervising, and does not get the task back.
- Handoff vs subagent — A subagent pattern is like a project manager with subcontractors: the user keeps talking to one point of contact, which spins up workers, synthesizes their work, and reports back. Handoffs fully transfer control; subagents retain the main contact. The same agent can serve either role — there is no inherent right or wrong, only fit.
- Refactoring to an agent primitive — The agent workflow loop is abstracted into an agent definition/primitive so multiple agents can be created, each with its own runtime, memory, conversation, workflow, tools, and state. In this implementation an agent is just a name, a system prompt, and a set of tools (`toolSet`); everything else is shared runtime machinery.
- Creating the triage agent — Defines the first agent, `triageAgent`, using the classify-item tools plus a not-yet-built handoff tool. Its system prompt makes it a support triage point of contact and explicitly forbids issuing refunds, forcing it to hand off billing-type work to a billing agent.

## Sections (L2)

### why-route-and-handoff

- Locator: `[[sources/agent-harness/20260915/19-agent-handoffs.txt#why-route-and-handoff]]`
- Summary: Opens the routing/handoff lesson by asking what happens when one agent handles every kind of task. A single agent is often fine; splitting is justified by security/privilege boundaries (sensitive or destructive tools), different guard rails, separate ownership, or per-agent responsibilities — not merely by tool count.
- Key claims: One agent for everything is acceptable if the harness, architecture, and metrics support it; sensitive/destructive tools are a strong reason to isolate agents; there is no fixed tool threshold that forces a split.
- Learner-relevant: Frames handoffs as a deliberate architectural choice tied to constraints, not a default scaling move.

### premature-multi-agent-and-swarms

- Locator: `[[sources/agent-harness/20260915/19-agent-handoffs.txt#premature-multi-agent-and-swarms]]`
- Summary: Warns against adopting multi-agent/agent-swarms prematurely, comparing it to over-provisioning infrastructure before having customers. Argues swarms are mostly a way for labs to charge more, and that they rarely solve problems a strong single LLM with a good harness cannot.
- Key claims: Do not reach for routing/handoffs until you actually have the problem; swarms are not a magic solution and tend to waste money; labs have an incentive to promote swarm narratives.
- Learner-relevant: A judgment anchor for when (not) to introduce multi-agent complexity.

### handoff-vs-subagent

- Locator: `[[sources/agent-harness/20260915/19-agent-handoffs.txt#handoff-vs-subagent]]`
- Summary: Defines a handoff via a barbershop analogy: an entry agent routes the request to a better-qualified party and fully relinquishes control — it is not supervising and the task does not return. Contrasts this with subagents, where a main point of contact spins up subcontractors, synthesizes their work, and keeps communicating with the user. Notes the same agent can be used in either pattern.
- Key claims: A handoff is a complete transfer of control, not delegation-with-oversight; a subagent keeps one main point of contact and hides the workers; handoff vs subagent is about topology, not agent capability.
- Learner-relevant: The core conceptual distinction the implementation must preserve.

### agent-primitive

- Locator: `[[sources/agent-harness/20260915/19-agent-handoffs.txt#agent-primitive]]`
- Summary: Refactors the single workflow loop into an agent definition in `harness/agents.ts`. An agent is modeled as a name, a system prompt, and a tool set; all other machinery (runtime, loop, DBOS durability, tool handling) is shared. Each agent gets its own memory, conversation, workflow, tools, and state, sharing nothing.
- Key claims: A handoff is effectively a switch of which agent's loop is running; each agent owns its own isolated state; the variable surface per agent is only name, system prompt, and tools in this implementation.
- Learner-relevant: Introduces the abstraction that makes multi-agent routing implementable.

### triage-agent

- Locator: `[[sources/agent-harness/20260915/19-agent-handoffs.txt#triage-agent]]`
- Summary: Defines `triageAgent` with the classify-item tools plus a planned handoff tool (commented out until built). Its system prompt establishes it as the support triage entry agent and explicitly states it may not issue refunds, which is intended to push billing-related work toward a handoff.
- Key claims: The handoff tool is the mechanism by which one agent transfers to another; the triage agent is the always-on point of entry; the refund prohibition is a prompt-level forcing function for handoff behavior.
- Learner-relevant: Shows how an agent's prompt and tool set encode its role and boundaries.
