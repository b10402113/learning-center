---
source: sources/background-agent/20261109/course/1-background-agents.txt
source_type: text
source_lines: 145
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Defining the term — learners offer definitions (endless loop, Kubernetes operator, event-activated process); background agents are not a replacement for chat agents.
- Productivity unlock — chat is synchronous and bounded by prompting, while background agents can be given a goal and keep working without you driving each step.
- Goal vs task — instead of a single prompt, you hand over a desired world state and the agent enforces that equilibrium.
- Durability — background agents survive failures, pauses, and long waits, resuming when events or human input arrive.
- Authority and harness — because the agent is fire-and-forget, deterministic harness code must own approvals rather than trusting the LLM to decide.
- Observe-decide-act — the loop the course builds; notably it uses no model-level tool calling and can suspend while waiting.

# L2 detail

- `#L1-L9` — Scott Moss opens with an audience poll on what a background agent is; one answer frames it as an endless reconcile loop like a Kubernetes operator.
- `#L10-L22` — Discussion continues: contrast with synchronous chat agents; coding agents use background subagents; background agents can be activated by external events.
- `#L23-L31` — Background agents as the real productivity unlock; chat work is capped by how fast you can prompt and still requires waiting on outputs.
- `#L32-L41` — Scheduling and interval triggers begin to approach background agents; true fire-and-forget resembles a capable team that knows when and how to do its job.
- `#L42-L47` — Chat agents get singular prompts and tasks; background agents get goals and a vision of the desired world state they must keep in equilibrium.
- `#L48-L57` — Even when a chat agent can do the same task, it is not durable: a broken API call, timeout, or failure ends in "I can't do it".
- `#L58-L67` — Background agents are more resilient and keep pursuing the goal, can pause and resume, but do not replace chat agents everywhere.
- `#L68-L77` — Examples: the operations agent watching a service, and an email-inbox agent that reacts to new emails and decides how to present them.
- `#L78-L95` — The email agent runs on a local model for privacy, tunnels remotely, and is built on the same architecture taught here; the architecture is reusable across tools.
- `#L96-L111` — Once an agent runs in the background, authority becomes the question; do not let a hallucinating LLM decide approvals—separate intelligent ambiguity in the model from deterministic control in the harness.
- `#L112-L129` — The course builds an observe-decide-act loop, akin to other thinking frameworks like ReAct, but with no model-level tool calling.
- `#L130-L145` — Background agents can wait for people for days, unlike coding agents whose process ends; a durable suspend uses no compute while blocked.
