---
source: sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt
source_type: text
source_lines: 205
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Multi-agent work means managing context for every agent, not just one; many smaller LLMs each reason and gather information and emit smaller outputs than one agent doing everything.
- Multi-agent systems can check each other through reviewers, critics, and second opinions, but those checks must be built in; "no one verified it" is the most common failure.
- Agents and models are easy to add, remove, or swap without betting the whole system, but cost is usually higher: typically one large model plus smaller models for the rest.
- Debugging is much harder because a bad output may have been led astray one or two agents earlier in the trajectory.
- The field is still new: Cognition's "don't build multi-agents" post and Anthropic's production success story landed days apart; both are honest research on different shapes of work (research vs coding).
- For deterministic results, prefer the more reliable patterns such as parallelization with voting; healthcare and banking deserve extra caution.
- Patterns rarely live alone: an orchestrator can be wrapped in an evaluator-optimizer, and aggregation can sit inside any other system.
- Arrow recap: sequential and parallelization keep arrows with the developer; dispatcher lets a classifier pick a set; evaluator-optimizer lets the model decide when to stop; supervisor and peer-to-peer are where the model draws arrows at runtime.

# L2 detail

- `#L1-L20` — Wrap-up thesis: managing context for every agent rather than one; many smaller LLMs each do their own reasoning and information gathering and should output less text than one agent thinking through everything.
- `#L21-L34` — Verification trade-off: multi-agent systems can implement reviewers, critics, and second opinions, but without a built-in check agents mostly trust whatever they were handed; "no one verified it" is the most common failure mode.
- `#L35-L59` — Modularity and cost: agents can be added, removed, and swapped without breaking the whole system, but costs are usually higher; usually one large model plus smaller models, which can be cost-effective if done correctly and expensive if rushed.
- `#L60-L87` — Debugging difficulty: a single agent's trajectory is hard, but multiple trajectories are worse because the visible failure may trace back to an earlier agent's research or output; systems with uncontrolled agent chatter also take extra time to trace in production.
- `#L88-L105` — Conflicting public claims: Cognition's "don't build multi-agents" and Anthropic's production praise days later; both valid because research and writing code are different shapes of work, as is the reader's own use case.
- `#L106-L137` — Determinism guidance: if results must be deterministic, favor reliable patterns such as parallelization with the voting subtype and aggregate repeated runs; be especially careful in healthcare or banking where lives or livelihoods depend on it; workflows with LLMs are still fine.
- `#L138-L151` — Tuning determinism: the speaker optimizes temperature and top-p to get as close to deterministic as possible without removing all creativity, while accepting the model still predicts the next token.
- `#L152-L162` — Composition: these systems rarely live on their own; an orchestrator may be wrapped in an evaluator-optimizer, and aggregation can sit in any other system; production patterns usually touch at least one other pattern.
- `#L163-L175` — Layer below: within the patterns, single agents can be ReAct agents, code execution agents, plan-and-execute agents, etc.; the point is a shared foundation and vocabulary for choosing patterns.
- `#L176-L205` — Who writes the arrows: sequential and parallelization keep arrows with the developer; dispatcher has the developer write arrows but a classifier picks which set; evaluator-optimizer is a developer-built loop where the model decides when to stop; supervisor and peer-to-peer are the first patterns where the model draws arrows at runtime, and control is given up progressively.
