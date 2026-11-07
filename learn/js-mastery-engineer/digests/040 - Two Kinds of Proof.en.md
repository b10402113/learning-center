---
source: sources/js-mastery-engineer/20261107/course/040 - Two Kinds of Proof.en.txt
source_type: text
source_lines: 23
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Explains that "prototype done" only meant the agent built the feature and checked its own work; proof raises the bar.
- Distinguishes two kinds of proof answering two questions: does the feature work today, and will it keep working later.
- Assigns `check verify` to "works today" (alpha tier): it opens the real app and tests behavior against acceptance criteria, not just builds or test files.
- Assigns `test` to "keeps working" (beta tier): it protects existing behavior against future changes.
- Argues the two do not replace each other — a green suite can test the wrong thing, and today's proof does not protect next month.
- Fixes the order (verify first, then test) and ties all work to the acceptance criteria the architect wrote, with a tier summary: prototype built, alpha proven, beta protected.

# L2 detail

- `#L1-L11` — Contrasts prototype self-check with proof, names the two questions, and assigns check verify (alpha) and test (beta).
- `#L12-L23` — Explains why the skills are complementary, fixes the order verify-then-test, and summarizes the three tiers.
