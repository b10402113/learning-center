---
source: sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt
source_type: text
source_lines: 236
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- A single-agent system is a model, tools, and instructions, plus a loop containing LLM calls, tool calls, memory, planning, and reflection.
- The agent is the loop, not the model; the model is one component that takes text in and returns text out.
- A stopping condition (max turns, tokens, cost, or time) is essential and commonly skipped; unclosed background runs can bill for weeks.
- Once the model controls the loop, only a stop condition bounds how many times it runs.
- Agents need maintenance: models can be deprecated, become cheaper, or be replaced by ones better suited to the use case.
- Prototype with the most capable model on every step, then downgrade; small models may force extra steps and calls.
- Log token counts, retry counts, and trajectories, and compare models without spending the whole budget.
- Tools should be designed for agents, not humans: give only the needed context, and tool overlap hurts more than tool count.

# L2 detail

- `#L1-L13` — Defines a single-agent system using OpenAI's framing: a model, tools, and instructions on how it behaves.
- `#L14-L34` — The agent is a loop, not the model; LLM, tools, memory/context window, planning, and reflection all live inside that loop, and the model is just one box taking text in and out.
- `#L35-L66` — Stopping conditions (maximum turns, tokens, cost, time) are the most commonly skipped and most important part; closing a laptop does not stop background processes, and people have run models for weeks and received five-figure bills.
- `#L67-L77` — Once the model controls the agent loop, the number of runs is unknowable unless a stopping condition is supplied.
- `#L78-L106` — Do not leave the same model in an agent forever: models can be pulled or replaced, and unmonitored agents can break or cost more without anyone noticing.
- `#L107-L127` — Upgrades need not be fancier models; a newer, more token-efficient, or better-trained model (including classification models) can save money and time. Agents still need maintenance.
- `#L128-L161` — Model choice: build a prototype with the most capable model on every step, then swap in cheaper models; the labs recommend starting expensive and moving down, because a weak model may force extra steps and calls.
- `#L162-L182` — A larger model making one call can be cheaper than a small model retrying three to five times; experiment, watch token and retry counts, log trajectories, compare models, and stay within budget.
- `#L183-L201` — Tools must be designed for agents rather than humans: a human can skim a 5,000-word paper, but an LLM consumes all those tokens in context, so provide no more and no less than needed.
- `#L202-L236` — Tool overlap is worse than tool count: similar tools make it hard to pick reliably, so inspect tool names and descriptions first and fix them before reaching for a better model.
