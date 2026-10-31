---
source: sources/real-agent/20261030/Language/006 Writing an ADR Solution.en.srt
source_type: text
source_lines: 1235
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Prompt in glossary vocabulary (open refund request, refund, pending/issued refund) to get precise questions.
- The first pass exposes enrollment vs purchase, progress storage, overloaded "admin", and a 50% eligibility gap.
- Settle authority, access-loss timing, progress retention, re-purchase, and queue scope question by question.
- New terms (platform admin, claimed seat) clarify existing entries but also bloat the glossary.
- Confusion in the agent's output is the trigger for scenario testing, which exposes a wrong-purchase refund bug.
- A second ADR pass over money decisions yields four tiny ADRs; implementation then renames the enum and code.

# L2 detail

- `#L1-L34` — set up glossary plus Grill with Docs; deliberately word the prompt in glossary terms.
- `#L35-L114` — scope the approval screen, progress visibility, and what happens after approval.
- `#L115-L226` — first pass: access comes from enrollment, progress is per learner/lesson, "admin" is overloaded, team collides, 50% rule is unenforced.
- `#L227-L294` — question one: platform admins decide; platform vs team admin wording; declining is in scope.
- `#L295-L398` — access loss on approval, keep progress, re-purchase, progress display, eligibility rule, queue contents.
- `#L399-L470` — people section added; new entries clarify old ones; team-license refund scenario feels woolly.
- `#L471-L556` — confusion triggers scenario testing; coupon vs seat vs team license; access not linked to purchase; wrong-purchase refund.
- `#L557-L690` — scenario matrix: individual purchase vs team license; hierarchy; void seat rejected; claimed vs unclaimed seats.
- `#L691-L812` — refund request targets a purchase; seat holder cannot refund; regain access with old progress; glossary bloats.
- `#L813-L958` — prune glossary: reject `void seat` and `access`; platform-admin edge cases; communication feels easy.
- `#L959-L1030` — shared understanding; the "no ADR" call is challenged because money is involved; second pass yields four ADRs.
- `#L1031-L1235` — review the four ADRs (progress, place ends, all-or-nothing seats, one place per course); wrap-up and exercise.
