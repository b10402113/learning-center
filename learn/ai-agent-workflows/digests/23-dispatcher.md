---
source: sources/ai-agent-workflows/20261105/course/23-dispatcher.txt
source_type: text
source_lines: 256
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- The dispatcher (aka routing, triage, classifier, router) runs a classification step that examines the input and picks exactly one specialized agent.
- It is the multi-agent version of the routing workflow; best for inputs in clear, distinct categories.
- Only one path executes per input — a fork, not a decomposition; there is no plan and no continued delegation.
- Bad routes are hard to recover from, unless you add a dedicated "confused/guessing" path that asks the user clarifying questions.
- Cheap classifier models (e.g. Gemini as a classifier) turn dollar-per-call routing into cents-per-call across many users.
- The speaker's own first multi-agent build: classify ticket difficulty and send easy work to smaller models, hard work to frontier models.
- Reliability is bottlenecked on the classifier; cost is the cheapest of the multi-agent patterns when routing easy work to small models.
- Anthropic's 2025 "advisor strategy" inverts the pyramid: Haiku/Sonnet do the work and escalate to Opus on failure; Cognition found small models struggle to know when and what to escalate.
- For the career product, the dispatcher is the pattern the speaker would actually ship: three small lanes with a finite menu.

# L2 detail

- `#L1-L14` — Definition and aliases: dispatcher/routing/triage/classifier/router; a classification step examines input and decides which agent handles it, as the multi-agent version of the routing workflow.
- `#L15-L32` — Fit: inputs in clear, distinct categories; only one path executes per input, making it a fork rather than a decomposition.
- `#L33-L38` — Main weakness: bad routes are very hard to recover from.
- `#L39-L52` — Cost shift: cheap, fast classifier models (Gemini cited) replace large LLMs for routing, taking cost from dollars to cents per call, which matters at 100s/1,000s/millions of users.
- `#L53-L84` — Origin story: classify how hard a ticket is and route easy work to smaller models and hard work to larger models, to avoid defaulting everything to a frontier model.
- `#L85-L100` — Classification is imperfect: tickets estimated as small can take three weeks, but the LLM makes the same mistake everyone makes and most of the time the routing saves money.
- `#L101-L116` — Recovery tactic: add a path for "I'm confused and guessing" so that route asks the user clarifying questions before proceeding.
- `#L117-L157` — Diagram: dispatcher classifies (career vs training vs funding) and routes to one specialized agent; input includes question type; output is a selected route from a finite set; user can then initiate another request.
- `#L158-L189` — Scorecard: context good, reliability good-and-bad because it is bottlenecked on classification, cost the cheapest pattern when easy inputs go to small models and expensive models are reserved for hard work.
- `#L190-L218` — 2025 shift: Anthropic's advisor strategy let Haiku/Sonnet run tasks and tools and call Opus only when stuck, lowering cost; Cognition found a small model struggled to know when to escalate and what to ask.
- `#L219-L233` — Meta-point: every pattern can work and can fail; choice depends on the situation, models, tasks, and implementation, so trade-offs are not just confusion.
- `#L234-L256` — Why the career product would ship as a dispatcher: users need only a career, school, or funding agent, each lane is small, the menu is finite, and a fourth clarification route can handle classifier confusion; a supervisor would pay a large model to choose among a menu already known.
