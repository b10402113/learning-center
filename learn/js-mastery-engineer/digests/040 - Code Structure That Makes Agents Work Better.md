---
source: sources/js-mastery-engineer/20261107/supplement/040 - Code Structure That Makes Agents Work Better.txt
source_type: text
source_lines: 116
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Your code is context: on every feature the agent reads your actual source, and that reading is paid for like any other context.
- File size is a context cost; touching one function in a 600-line file drags in unrelated code, while small focused files load close to just the needed piece.
- Predictable naming and location cut search cost: `auth.ts` is found in one search, while the same logic in `utils2.ts` behind `handleThing` causes wide searching and expensive misses.
- Colocation means one read instead of a scavenger hunt; pieces of a feature that live together load in one neighborhood.
- The unifying idea is that structural choices are context costs paid every session, not once.
- The test before accepting a proposed structure: how much will the agent have to load to find and safely touch this on a future change?
- Good structure is a standing discount on every agent task; bad structure is a tax on all of them.

# L2 detail

- `#L1-L13` — code itself is context and why structure is a context cost
- `#L14-L27` — file size: big files drag in code the task never needed
- `#L28-L64` — predictable naming and location cut the agent's search
- `#L65-L83` — colocation turns a scavenger hunt into a single read
- `#L84-L108` — the one idea under all three and the test to apply before accepting a structure
- `#L109-L116` — transition to the checkpoint lesson
