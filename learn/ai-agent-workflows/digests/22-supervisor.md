---
source: sources/ai-agent-workflows/20261105/course/22-supervisor.txt
source_type: text
source_lines: 281
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- A supervisor is a main coordinating agent that receives the query, decomposes it into subtasks, delegates to sub-agents, and synthesizes their outputs back to the user.
- Sub-agents do not know about each other; only the supervisor knows its sub-agents. Supervisors can nest, with supervisor sub-agents managing their own sub-agents.
- The office analogy: a CEO supervises reports who supervise their own reports, down to individual contributors, with information flowing back up.
- Unlike parallelization, subtasks are not predefined — the supervisor decides them per input, making the supervisor essentially "planning turned into an agent."
- Context is excellent (supervisor holds the big picture, sub-agents stay narrow) and reliability is strong (small asks, plus redirect on bad output), but cost is very high.
- Anthropic figures: a regular agent uses ~4× a chat's tokens; a multi-agent system uses ~15×, so the question is whether the task justifies that.
- Bad fits: shared-context or highly dependent work such as coding; breadth-first research and correctness-critical work are good fits.
- Risks: stacked supervisors can rubber-stamp each other's hallucinations; reflection on tangible signals is the guardrail.
- The career example is a poor supervisor use: it depends on prior answers and has only a few code paths, so it is overcomplicated and expensive.

# L2 detail

- `#L1-L16` — Supervisor basics: one coordinating main agent takes the query, breaks it into subtasks, delegates, and receives sub-agent output; sub-agents need no knowledge of each other.
- `#L17-L25` — Nesting: any supervisor sub-agent can itself supervise other sub-agents, producing supervisor-over-supervisor hierarchies.
- `#L26-L41` — Office/CEO analogy for the hierarchy: reports supervise their reports down to individual contributors, and information is eventually reported back to the top.
- `#L42-L62` — Distinction from parallelization: subtasks are created dynamically, the supervisor is the only agent talking to the user, and it decides whether to call more agents or answer.
- `#L63-L72` — Core idea: the supervisor is the planner, i.e. the earlier planning concept made into its own agent.
- `#L73-L98` — Diagram walkthrough: the supervisor receives the request, chooses subtasks, delegates to specialized agents, and synthesizes a final response; subtasks are not fixed in advance and it may delegate additional work.
- `#L99-L110` — Example: supervisor delegates to a career agent, then a training agent, then a funding agent, making those decisions itself; final response combines recommendations, training options, and payment paths.
- `#L111-L130` — Scorecard upside: excellent context (big picture up top, extremely narrow sub-agents), strong reliability (focus chunks make each ask simpler, and the supervisor can catch and redirect bad output).
- `#L131-L155` — Cost downside: the supervisor needs a capable model that fits knowledge of every sub-agent and its function, and with many agents or nested supervisors the cost runs very high.
- `#L156-L171` — Anthropic token figures: regular agent ≈ 4× chat tokens, multi-agent ≈ 15×; the build decision is whether the task is worth ~15 chats' worth of tokens.
- `#L172-L209` — Fit guidance: worth it for correctness-critical breadth-first research over independent documents; not for an FAQ bot, or where agents must share context or have many dependencies (common in coding, which parallelizes poorly).
- `#L210-L232` — Context allocation: what each sub-agent receives is mostly decided by you via the system prompt (and harness), e.g. attaching relevant documentation; absent instruction, the supervisor decides.
- `#L233-L262` — Failure mode: stacked supervisors can become a tower of rubber stamps that confidently validate each other's hallucinations; capable supervisor models help, but real reflection on tangible things is needed.
- `#L263-L281` — The career example is a terrible supervisor use: answers depend on the prior question (no school before a career), there are only a few paths, and the system is overcomplicated and very expensive.
