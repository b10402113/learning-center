---
source: sources/ai-agent-workflows/20261105/course/24-evaluator-optimizer.txt
source_type: text
source_lines: 168
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Evaluator-optimizer (aka reflection, self-refine, critic) pairs one generating call with another evaluating call in a feedback loop.
- One agent is the optimizer doing the work; a second is the evaluator checking it and issuing critiques. The loop repeats until the evaluator is satisfied or a stop condition triggers.
- It is the multi-agent version of the same-named workflow, but each step is now its own agent with its own reasoning and tools.
- A stop condition is mandatory here (max iteration cap or timeout) because this pattern is the most likely to loop forever.
- Reliability and cost are directly connected: more reflection rounds means more spending.
- Coding agents are the canonical success: write code, run tests, read failure, fix, rerun — because the test is an external signal.
- External, tangible, deterministic feedback is far more reliable than a model judging its own work; prefer it over a fancy critique prompt.
- Context degrades: each round adds the entire prior attempt plus the critique, so context grows very quickly.
- Compaction tip: use another LLM to summarize, explicitly naming what to keep and what to drop, or store everything in a cache.

# L2 detail

- `#L1-L20` — Definition and aliases (reflection, self-refine, critic): one call generates, another evaluates and feeds critiques back; one agent optimizes, another critiques, looping until satisfied; the multi-agent version gives each step its own reasoning and tools.
- `#L21-L29` — Mandatory stop condition for safety — a max iteration cap or timeout — because the loop may never reach a satisfactory state.
- `#L30-L46` — Reliability and cost are coupled: each reflection/check adds spend; the coding-agent loop (write code, run tests, read failure, fix, rerun until passing) is generating then evaluating.
- `#L47-L60` — Why coding works so well: the external signal is the most reliable thing you can build, while a model merely asking "is this good?" is much less reliable.
- `#L61-L67` — Guidance and warning: prefer something tangible and deterministic to evaluate against over a fancy critique prompt, and always keep a stop condition or it will infinite-loop.
- `#L68-L93` — Diagram: one agent generates a solution, another evaluates and gives feedback, the generator uses feedback plus the prior trajectory to improve, repeating until satisfied or stopped — agents improve as they run.
- `#L94-L120` — Worked example: generator offers three career paths and programs; evaluator says options are too general and asks for specific programs with estimated costs; the loop repeats, then returns a final answer with details and next steps.
- `#L121-L149` — Scorecard: context is bad because it grows each round with the full prior attempt plus critique; reliability is super strong thanks to a dedicated repeated critique step; cost can rise fast and this is the pattern most likely to loop forever.
- `#L150-L168` — Compaction advice: use another LLM to summarize with explicit keep/drop guidance, or cache everything; the speaker prefers this over managing many direct agent connections.
