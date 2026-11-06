---
source: sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt
source_type: text
source_lines: 331
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- For self-improving agents, add a reflection step to every agent and ground it in something tangible or deterministic rather than relying only on model self-critique.
- The reinforcement-learning analogy: run against tests and teach deterministic behaviors, and build that reflection into single-agent, workflow, or multi-agent systems, including as a separate reflection agent.
- Reflection criteria can be numeric KPIs or any external signal placed in the prompt; the more real, tangible checkpoints, the better.
- There is no hard rule for what to use: "use an agent" is a position on a spectrum, and the speaker starts as far left as possible with deterministic code and no LLM.
- Add LLMs one step at a time; when a frontier model alone is not enough, move to a single-agent loop, and only then rearchitect into multi-agent.
- Chatbots fit single agents: the user's request is unknown but the allowed paths are known; the developer still draws the arrows and the model chooses among them at runtime.
- The main argument for multi-agent is context: sub-agents buy context back but at high cost; reliability rises with feedback loops and falls with handoffs, and sophistication does not guarantee reliability.
- Ship the simplest thing that works, run both the boring workflow and the fancy multi-agent more than once, compare scorecard columns, and test everything.

# L2 detail

- `#L1-L26` — Self-improving agents: always use self-improvement loops where possible, focus on reflection in every workflow/single/multi-agent system, and prefer a tangible thing to check against over model self-critique.
- `#L27-L55` — RL parallel: reinforcement learning is running against many deterministic tests; this can be built into any system, from a reflection step in a single agent to an added reflection agent, and more real deterministic touchpoints are better.
- `#L56-L91` — Reflection criteria: whether to give the model KPIs or free evaluation depends on the system, but reflection is at its most basic just adding to the prompt; include available numbers, tests, and deterministic signals that can say right/wrong and check again.
- `#L92-L127` — "What do I use and when": there is no hard-and-fast rule; using an agent is a spectrum, so start left with full control and plain code (which Copilot/Claude can still write), then add an LLM where natural-language processing helps and keep asking whether there are too many.
- `#L128-L162` — Single-agent fit: when the path is unknown but all existing paths are known, reach for a single agent; the developer still draws the arrows and lets the model choose among them at runtime, preserving substantial control.
- `#L163-L177` — Chatbot example: a chatbot is the perfect single-agent case because the user's question is unknown, but the allowed paths (product/company questions, not complex math theorems) are known.
- `#L178-L199` — Multi-agent restraint: hold back because multi-agent systems are expensive; the progression is deterministic code, then an LLM, then a single-agent loop when a frontier model is not enough, then another agent, and finally rearchitecting into multi-agent.
- `#L200-L211` — Career-advisor choice: the speaker would ship the dispatcher, not the most impressive system, because it fits the problem, keeps context small, keeps cost low, and has an easy classification step despite unpredictable needs.
- `#L212-L233` — Scorecard recap, context: every tool costs context on input and output, RAG buys some back at additional cost, sub-agents buy back a lot at a lot of cost; context pressure is the real argument for moving to multi-agent.
- `#L234-L251` — Scorecard recap, reliability and cost: reliability moves up with feedback loops and down with handoffs because errors compound, so a more sophisticated system is not necessarily more reliable; cost mostly goes up, though a well-planned multi-agent system can occasionally help.
- `#L252-L281` — Caveat and outside evidence: all of this is a guess/experiment until measured in your own system; study public write-ups from Uber, Netflix, and other companies, but remember your customers and use case are unique.
- `#L282-L315` — Testing and career advice: test everything through evals, manual checks, or a friend clicking through 100 times; pay attention to pattern names because interviews will increasingly ask how and when to use AI, workflows, and agents.
- `#L316-L331` — Final advice: run the boring workflow and the fancy multi-agent more than once, compare reliability and average cost across the scorecard columns, pick the simplest thing on the spectrum that does the job, build test cases, and stay open to being completely wrong.
