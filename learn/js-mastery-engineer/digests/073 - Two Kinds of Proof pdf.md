---
source: sources/js-mastery-engineer/20261107/supplement/073 - Two Kinds of Proof pdf.txt
source_type: text
source_lines: 52
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Two questions, two skills: "Does it work today?" is /check verify, which runs the real app and proves the behaviour happened; "Will it keep working?" is /test, which writes a suite that guards it against future changes.
- Neither replaces the other: a green suite does not prove the real feature works (tests can be incomplete, measure the wrong thing, or miss the real user path), and proving it works today does not stop next month's change from breaking it.
- The order is verify first, then test — prove the behaviour in the running app, then protect the behaviour you just proved.
- The tier ladder: Prototype means built and self-checked, Alpha means built and proven, Beta means built, proven and protected.
- Both skills work from the acceptance criteria /architect wrote: /develop builds them, /check verify proves them in the running app, /test turns the important ones into lasting protection.

# L2 detail

- `#L1-L4` — title block and lecture summary header
- `#L5-L24` — the two questions and the table mapping /check verify and /test to what each does
- `#L25-L34` — why neither replaces the other and why verify must come before test
- `#L35-L52` — the tier ladder and how both skills use /architect's acceptance criteria
