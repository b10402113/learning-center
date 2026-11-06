---
source: sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt
source_type: text
source_lines: 240
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Multi-agent systems exist because one agent holding everything raises mistakes, forgotten context, and hallucinations versus specialized agents.
- Sequential agents are also called prompt chaining, pipeline, chain, waterfall, or cascade.
- Topology matches the prompt-chaining workflow — output of one agent becomes input of the next — but every step is a full agent.
- Each agent can plan, use tools, and reflect, with its own model, prompt, and tool set; agents need not know the others exist.
- Because each agent completes its whole loop before handing off, failures can be retried and corrected instead of passed downstream.
- The component agents are the single-agent systems (ReAct, CodeAct, etc.); the multi-agent system lives on top.
- Use it when later agents depend on earlier agents' work, e.g. you cannot pick a school before knowing the intended career.
- Scorecard: context improves through smaller prompts; reliability suffers from compounding errors because agents trust confident upstream output; cost is usually the cheapest multi-agent setup; latency is high and stacks linearly.

# L2 detail

- `#L1-L13` — Motivates multi-agent work: a single agent had too much to hold, increasing mistakes, forgotten context, and hallucination.
- `#L14-L38` — Notes each system has several names across papers and books, and that per-system scorecards are needed because diagrams differ.
- `#L39-L55` — Introduces sequential (prompt chaining, pipeline, chain, waterfall, cascade): output of one agent becomes input of the next.
- `#L56-L68` — Each step is a full independent agent that can plan, use tools, reflect, retry, and run its own model, prompt, and tool set before passing output down.
- `#L69-L94` — Explains each agent runs its complete loop, so failures can be reflected on and fixed; reminds that components are the single-agent systems.
- `#L95-L106` — When to use: later agents depend on prior agents' output, illustrated by needing a career before choosing a school.
- `#L107-L131` — Diagram: user input feeds a career agent that plans, searches a database, reflects, and loops until satisfied with recommended directions.
- `#L132-L171` — The training agent consumes career output, then the funding agent; each has its own prompt, model, and tools and need not know the others.
- `#L172-L190` — Funding agent finds scholarships, loans, and grants; the final response still combines careers, training, and payment options.
- `#L191-L199` — Context improves because each agent gets its own window and the huge prompt is split into smaller prompts.
- `#L200-L220` — Reliability risk: errors compound down the chain because confident-sounding output makes the next agent unlikely to challenge it, so validation matters.
- `#L221-L240` — Cost is usually the cheapest multi-agent setup (with classification models possibly cheaper later), while latency is high and stacks linearly per added agent.
