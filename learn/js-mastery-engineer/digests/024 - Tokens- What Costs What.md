---
source: sources/js-mastery-engineer/20261107/supplement/024 - Tokens- What Costs What.txt
source_type: text
source_lines: 27
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- The lesson builds instincts for managing context by understanding what costs tokens in an agent workflow.
- The key principle is that reading is expensive while reasoning is cheap.
- Expensive activities include reading entire files for a few needed lines, search results with every match and surrounding context, long conversation histories, and verbose agent output.
- Cheap activities include short targeted in-loop reasoning, precise questions, and small scoped file reads.
- File and function naming materially affects how easily an agent finds information and how many tokens it spends.
- Strategies limit broad reading and promote targeted reading.
- The Clot code command visualizes token costs and the split between reading and reasoning in real time.

# L2 detail

- `#L1-L4` — Page header and "Lecture Summary" label.
- `#L5-L10` — Why token-cost intuition matters and the reading-expensive / reasoning-cheap principle.
- `#L11-L16` — Expensive activities: whole-file reads, full search results, long histories, and verbose output.
- `#L17-L20` — Cheap activities: quick in-loop decisions, precise questions, and small scoped reads.
- `#L21-L27` — Naming's effect on token usage, targeted-reading strategies, and the Clot code visualizer.
