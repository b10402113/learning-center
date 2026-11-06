---
source: sources/ai-agent-workflows/20261105/course/15-plan-execute.txt
source_type: text
source_lines: 126
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Plan-and-execute is a single-agent pattern that makes one full plan up front, then executes the steps in order.
- Fewer model calls and no replanning usually make it cheaper than ReAct, though a large planning model can invert that.
- It cannot observe results and adjust the plan, so it is worse at adaptation when research or answers turn out wrong.
- Best fit: tasks whose decomposition is known ahead of time; otherwise an LLM-powered workflow may be the better comparison.
- Choosing between plan-and-execute and ReAct hinges on whether steps may need fixing mid-run.
- Coding work generally needs ReAct, except trivial changes like renaming fields in an object.
- The worked example plans career search, training search, and funding lookup once, then executes them in that fixed order.
- It is inexpensive, easy to test, and viable when an LLM can reason about all steps at once.

# L2 detail

- `#L1-L9` — Defines plan-and-execute as building the full plan upfront and then executing it, contrasted as simpler than ReAct.
- `#L10-L16` — Explains the cost advantage: fewer model calls and no plan edits, with the caveat that a huge planning model can erase it.
- `#L17-L24` — States the core weakness: the agent will think and act but not observe and adjust, so it just follows the initial plan.
- `#L25-L46` — Says it works when task decomposition is known in advance; raises the "why not a workflow?" question and notes it is a less popular design.
- `#L47-L58` — Frames the ReAct-versus-plan choice as the ability to say something went wrong and fix it, driven by concerns about wrong answers or needed research.
- `#L59-L75` — Coding example: plan-and-execute only suits trivial edits; substantial codebase changes need think-act-observe-think replanning.
- `#L76-L105` — Walks the diagram: the career-advisor plan is created once, then step 1 finds careers, step 2 finds programs, step 3 finds funding.
- `#L106-L126` — Explains the fixed order comes from the initial decomposition, then gives the final answer and the viability checklist: simple, stable, cheap, easy to test, otherwise use ReAct.
