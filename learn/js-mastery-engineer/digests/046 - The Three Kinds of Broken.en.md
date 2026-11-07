---
source: sources/js-mastery-engineer/20261107/course/046 - The Three Kinds of Broken.en.txt
source_type: text
source_lines: 51
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Argues the first move when something breaks is not a debugging technique but a question: what kind of broken is this?
- Defines the first kind, a normal code bug: a real, observable, reproducible fault that behaves the same regardless of who wrote the code.
- Defines the second kind, specific to AI-written code: nonexistent library functions, quietly wrong logic, hidden decisions, and missed edge cases that only surface with unusual input.
- Explains the second kind is hard to investigate because you cannot reason from the author's intent — that intent was never yours.
- Defines the third kind, which is not code at all: the agent has lost the path, repeating actions and changing files back and forth while staying confident.
- Explains why classification matters: each wrong response costs differently — prompting an unfixable bug, clearing a session too early, or editing code when the agent lost track.
- States the underlying rule: a fix you cannot explain is a bug you haven't caught; take evidence over intuition.

# L2 detail

- `#L1-L13` — Introduces the three kinds and describes the first, an ordinary reproducible code bug.
- `#L14-L32` — Describes the AI-code failure kind and the lost-the-path kind, and why each resists normal investigation.
- `#L33-L51` — Explains the cost of misclassification, the "fix you cannot explain" rule, and to classify before fixing.
