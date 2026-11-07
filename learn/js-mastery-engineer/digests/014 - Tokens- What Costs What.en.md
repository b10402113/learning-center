---
source: sources/js-mastery-engineer/20261107/course/014 - Tokens- What Costs What.en.txt
source_type: text
source_lines: 77
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Establishes that everything the agent reads, writes, and reasons through is measured in tokens, roughly a few characters each.
- States the core pattern: reading is expensive and reasoning is cheap, which explains most of where the context budget goes.
- Lists expensive activities: reading whole files, search results with paths and surrounding context, long conversation histories, and verbose output.
- Lists cheap activities: short in-loop decisions, precise well-scoped questions, and small scoped file reads.
- Adds a scope note that extended thinking on a genuinely hard problem can legitimately spend real tokens, so only routine in-loop judgment is cheap.
- Ties cost back to naming and structure: poor naming causes extra searches, guesses, and file opens, all of which are expensive.
- Reframes clearing versus compacting in token terms and argues traditional engineering practices matter more than ever.
- Offers a practical habit — ask whether a task forces broad or targeted reading — and points to Claude Code's `/context` command for a live breakdown.

# L2 detail

- `#L1-L11` — Tokens as the unit of cost and the reading-expensive/reasoning-cheap pattern.
- `#L12-L23` — Expensive activities: full file reads, search results, long histories, and verbose output.
- `#L24-L33` — Cheap in-loop reasoning and the caveat about extended deep thinking.
- `#L34-L42` — Precise questions and small scoped reads as cheaper alternatives.
- `#L43-L55` — How cost connects to naming, structure, and clear-versus-compact decisions.
- `#L56-L66` — The broad-versus-targeted reading habit and worked task examples.
- `#L67-L77` — The `/context` command, module recap, and handoff to the exercise.
