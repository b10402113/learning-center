---
source: sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt
source_type: text
source_lines: 151
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Reflection needs an external failure signal — a test suite, an API error, or model-written tests — and is only as good as that signal.
- The agent writes the failure in plain language and carries that note into its next attempt.
- Self-refine has no external signal: the model generates, critiques, and revises its own work.
- Self-refine is effectively the evaluator-optimizer workflow with the loop and iteration count handed to the model.
- The pattern is try, get feedback, evaluate against the goal, reflect, retry until success or a stop condition.
- Reflection critiques a produced answer; ReAct observes tool output and updates the plan while working.
- The two can be combined, and production systems often layer these patterns rather than using one alone.
- The written reflection enters the model context, so a note like "also search scholarships and grants" shapes the retry.

# L2 detail

- `#L1-L7` — Introduces reflection and self-refine as familiar terms now examined inside single-agent systems.
- `#L8-L17` — Defines reflection as requiring something outside the model to report failure, ideally a test suite or API error; model-written tests lower reliability.
- `#L18-L27` — Describes the model writing down what went wrong in plain language and carrying it into the next attempt.
- `#L28-L48` — Defines self-refine as no external signal, and maps it to an automated evaluator-optimizer where the model chooses when it is good enough.
- `#L49-L64` — Diagram setup: the agent tries a solution, gets feedback, reflects, and improves the next attempt by feeding written feedback back.
- `#L65-L89` — Worked career example: research with tools, evaluate against external signals, reflect on missed funding options, retry until success or a stop condition.
- `#L90-L108` — Shows the final answer and contrasts reflection (critique the answer) with ReAct (observe tool results and update the plan).
- `#L109-L132` — Says the patterns can be combined, e.g. a ReAct loop with reflection at the end, while still learning each separately.
- `#L133-L151` — Explains that the textual reflection joins the context and makes the retry more likely to remember the missed scholarships and grants.
