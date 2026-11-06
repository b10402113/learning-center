---
source: sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt
source_type: text
source_lines: 246
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Systems are modeled as boxes (code or LLM steps) and arrows (control flow); the course tracks who writes the arrows.
- Control decreases from hand-written code to workflows to single agents to multi agents, while flexibility increases at the cost of context, reliability, and cost.
- Russell and Norvig define an agent as something that perceives its environment through sensors and acts through actuators.
- The course's working definition is an LLM plus tools, memory, planning, and reflection.
- Cautionary example: a 2025 Replit agent deleted a production database, motivating guardrails, stop conditions, and care with third-party code and spend.
- A reasoning LLM is an LLM trained to reason before responding, descended from chain-of-thought prompting ("think step by step").
- Reasoning output shown by tools is a summary of thinking, not the final answer, and no explicit think-step-by-step prompt is needed.
- An LLM is only a component inside an agent; apps like Claude or ChatGPT are agents whose underlying model can be swapped.

# L2 detail

- `#L1-L20` — Boxes-and-arrows mental model: every code step or LLM call is a box, connectors are arrows, and the key question is who controls the arrows.
- `#L21-L57` — Spectrum of control: code writes both boxes and arrows; workflows still choose arrows; single agents choose among offered paths; multi-agent systems may let agents write boxes and arrows too.
- `#L58-L68` — Trade-off thesis: giving up control buys flexibility, and every release of control costs context, reliability, or money.
- `#L69-L95` — Formal definition from Russell and Norvig (perceive via sensors, act via actuators); today's shorthand: agent = LLM + tools + memory + planning + reflection.
- `#L96-L111` — Replit 2025 production-database deletion; lessons about guardrails, third-party code, stop conditions, and runaway spend.
- `#L112-L142` — Reasoning LLMs vs agents; chain-of-thought prompting reduced hallucination and improved correctness, so labs trained models to reason before answering.
- `#L143-L175` — Live demo in Copilot/Claude: "thinking" text is a summary of reasoning, not the answer, and happens without the user prompting step by step.
- `#L176-L199` — LLMs run inside agents as one node/component; agents could in theory exist without an LLM, but autonomy is what makes an agent.
- `#L200-L246` — LLMs only turn text into text and cannot act; agents perform tasks from environmental feedback. Claude.ai and ChatGPT are agents (web search, local files), and their model is replaceable.
