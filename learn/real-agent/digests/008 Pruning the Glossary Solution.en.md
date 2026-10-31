---
source: sources/real-agent/20261030/Language/008 Pruning the Glossary Solution.en.srt
source_type: text
source_lines: 799
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Delete anything that is implementation detail or too general to count as domain language.
- Implementation specifics (refunds table, two-hour watch limit) go stale and force glossary churn.
- Terms like button, component, CWD, and loader are too generic; slug is routing detail unless it becomes user-facing.
- Compress vague phrases such as "place on a course" into a single term, enrolment.
- Let usage decide synonyms: student appears 180 times vs learner 8, so keep student.
- Propagate chosen terms into ADR text, file names, and code comments.

# L2 detail

- `#L1-L30` — open with a simple ask: the glossary is bloated and contains non-domain material.
- `#L31-L110` — question one: strip implementation details like the refunds table; they churn and add nothing.
- `#L111-L194` — too-general entries (button, component, CWD, loader, slug) are removed.
- `#L195-L274` — question two: slug is a routing detail, not ubiquitous; include it only if it becomes user-facing.
- `#L275-L330` — question three: the stale two-hour watch limit shows why numbers do not belong; drop the number.
- `#L331-L362` — question four: compress "place on a course" to enrolment.
- `#L363-L422` — question five: keep lapsed, define it as lost enrolment with retained progress, place it near enrolments.
- `#L423-L506` — question six: learner vs student has no clear winner; agree to unify, leave headings unopinionated.
- `#L507-L618` — rewrite drops 113 to 87 lines; student outnumbers learner 180 to 8, so keep student; update ADRs to enrolment.
- `#L619-L706` — comments and ADR file names updated; these renames are cheap with agents, so fix the broken windows.
- `#L707-L799` — final glossary shape (refund, enrolments, people); pruning is an art that improves with attention.
