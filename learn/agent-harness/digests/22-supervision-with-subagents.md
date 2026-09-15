---
source: 22-supervision-with-subagents
source_type: pdf
source_lines: 259
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 22-supervision-with-subagents

## Overview (L1)

- Why sub-agents and supervision — Sub-agents pay off for coding (isolated git worktrees with no merge conflicts) and research (parallel speed and splitting a context window no single agent can hold). A fully autonomous, indefinitely self-communicating swarm is rejected as hallucination-prone.
- Plan mode as a first-class artifact — Rather than an ephemeral thread step, a plan is created, stored, and executed by sub-agents under a supervisor. Plan mode is explicitly opted into by the user, because deciding *when* sub-agents are needed would require evals the course does not cover.
- Read-only investigators — Investigator sub-agents are lightweight, read-only, and run inline through the AI SDK's `execute` functions rather than getting first-class DBOS-step treatment. Their interactions are bounded, they are safe to rerun, and an env var can force failure to demonstrate graceful degradation.
- Investigator registry and dispatch — A `Record<string, investigator>` maps agent names (billing, technical, sales) to a system prompt and a restricted tool set (getCharges or searchKB). `runInvestigation` looks up the agent by name, throws on unknown names, and runs a one-shot `generateText` with a bounded loop.

## Sections (L2)

### why-supervision

- Locator: `[[sources/agent-harness/20260915/22-supervision-with-subagents.txt#why-supervision]]`
- Summary: Explains when spawning supervised sub-agents is worth it, and warns against the fully autonomous version of the architecture.
- Key claims: Coding benefits from git worktrees giving isolated, conflict-free parallel work; research tasks benefit from parallel speed and from splitting context no single agent fits; fully independent sub-agents communicating with a supervisor forever would hallucinate heavily and should be avoided.
- Learner-relevant: Gives the decision criteria for reaching for supervision at all — a clear isolation boundary (worktrees) or a fan-out/fan-in merge (research) — before writing any code.

### plan-mode-artifact

- Locator: `[[sources/agent-harness/20260915/22-supervision-with-subagents.txt#plan-mode-artifact]]`
- Summary: Describes plan mode, where a plan is a first-class stored artifact executed by sub-agents under a supervisor, gated behind explicit user opt-in.
- Key claims: The plan is created and stored, not left as an ephemeral part of the thread; a supervisor manages execution of the plan by sub-agents; the user toggles plan mode on so the agent does not have to infer when to use sub-agents, since that inference would require evals and is out of scope.
- Learner-relevant: Establishes the core architecture to build and the reason the feature is user-triggered rather than automatic — useful for understanding why later steps gate on a `supervised` mode flag.

### read-only-investigators

- Locator: `[[sources/agent-harness/20260915/22-supervision-with-subagents.txt#read-only-investigators]]`
- Summary: Introduces investigators as a new harness module: read-only sub-agents given `execute` functions and run inline rather than as DBOS steps.
- Key claims: Investigators are lightweight and read-only, so rerunning them is safe; they are not bound to their own DBOS step but live inside a step; being inline, they get a "cubicle" rather than the "corner office" of a top-level supervisor agent; interactions are bounded and an environment variable can trigger a failure to observe graceful degradation.
- Learner-relevant: Clarifies the execution-model distinction (inline `execute` vs. durable DBOS step) that later determines retry behavior and observability.

### investigator-registry

- Locator: `[[sources/agent-harness/20260915/22-supervision-with-subagents.txt#investigator-registry]]`
- Summary: Builds the two investigator tools and the typed registry of billing, technical, and sales investigators, each with a system prompt and restricted tools.
- Key claims: `getCharges` and `searchKB` are exported from the tools module and wrapped as AI SDK tools with zod input schemas; investigators is a `Record<string, investigator>` where each entry pairs a system prompt with a tool list; the billing investigator only has `getCharges`, the technical and sales investigators only have `searchKB`; "gassing up" each agent with a confident system prompt is presented as a deliberate technique, with the sales prompt tuned toward pricing.
- Learner-relevant: Shows least-privilege tool scoping per sub-agent and the pattern of a typed registry keyed by agent name — directly reusable for any fan-out of specialized readers.

### run-investigation

- Locator: `[[sources/agent-harness/20260915/22-supervision-with-subagents.txt#run-investigation]]`
- Summary: Implements `runInvestigation`, which resolves an investigator by name and runs a one-shot inference for the given objective.
- Key claims: `runInvestigation(agent, objective)` looks up `investigators[agent]` and throws if no investigator matches; it calls `generateText` with the model, the investigator's system prompt, and the objective as `prompt` rather than `messages` because this is a background one-shot with no back-and-forth; the loop is bounded to five turns/steps via `stepCount`.
- Learner-relevant: The template for firing a bounded, stateless investigator call — the unit the parallel dispatch step in the next file invokes.

## Sources

- [[sources/agent-harness/20260915/22-supervision-with-subagents.txt]]
