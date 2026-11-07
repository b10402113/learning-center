---
source: sources/js-mastery-engineer/20261107/course/013 - Clearing vs Compacting.en.txt
source_type: text
source_lines: 47
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Distinguishes two reset actions that both address too much context but behave very differently.
- Clearing wipes the window completely, carrying nothing over so the next prompt starts from zero.
- Compacting summarizes the conversation into a condensed version that remains in the window going forward.
- Warns that a compaction summary is model-generated and unreviewed, so important details can be silently compressed or reworded; clearing carries no such loss.
- Calls clearing predictable and compacting efficient but convenience traded for predictability.
- Gives guidance: clear for new unrelated tasks, drifted or looping sessions, or when restating a few facts is safer.
- Advises compacting for long continuous tasks or when the history of a design discussion carries value; the deeper rule is that precise details favor clearing while momentum favors compacting.

# L2 detail

- `#L1-L4` — Resetting is two actions, and the wrong choice has a cost.
- `#L5-L14` — Definitions of clearing and compacting and the shared problem they solve.
- `#L15-L26` — Lossy, unreviewable summaries versus the predictability of an empty window.
- `#L27-L38` — Situations that call for clearing.
- `#L39-L47` — Situations that call for compacting and the underlying decision rule.
