---
source: sources/real-agent/20261030/Spec/028 Grill vs Wayfinder vs Ship First.en.srt
source_type: text
source_lines: 287
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- The full Wayfinder flow (grill, prototype, research, tickets, spec, implement) is heavy and front-loads thinking before code.
- Three options exist: one-shot, grill-with-docs, Wayfinder; the deciding variable is diff size, not ambition.
- Tiny diffs should be one-shot: if the diff is small, misalignment is cheap to discard and redo.
- Medium-or-larger diffs get grill-with-docs, which is the safe default because it can graduate into a Wayfinder session.
- The failure is asymmetric: over-ceremonied Wayfinder on a simple task is hard to unwind, so escalate rather than start big.
- Wayfinder is an escape hatch for fog, not a mandatory gate.

# L2 detail

- `#L1-L20` — Recap of the full Wayfinder flow from grilling through prototyping, research, tasks, spec, implementation; it is heavy even when done fast, which prompts when to use which approach.
- `#L21-L52` — Decision tree entry point: new session, and the first question is whether the diff is tiny (button colour, a failing test) and whether the review surface is small.
- `#L53-L108` — Tiny diffs do not need alignment work because the diff is cheap to throw away; one-shot it and review after, especially for UI and QA nits; anything medium or larger goes to grill-with-docs.
- `#L109-L184` — Default recommendation: start every session you are not one-shotting with grill-with-docs; it can graduate to a Wayfinder map mid-session if the work turns out to be in the dumb zone.
- `#L185-L252` — Why escalate rather than start at Wayfinder: starting big and discovering the task is simple means unrecoverable ceremony and dead assets, whereas starting small is always recoverable.
- `#L253-L287` — Synthesis: no obligation to grill or Wayfinder everything, one-shot more than you expect, and treat Wayfinder as the escape hatch when grill-with-docs gets too crazy.
