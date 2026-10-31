---
source: >-
  sources/real-agent/20261030/Review/035 Testing Out The Code Review Skill
  Solution.en.srt
source_type: text
source_lines: 467
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- The run fixes point at `main` (the PR base) and dispatches standards and spec reviews as background agents, then fixes both sets without deferring decisions.
- Standards findings: a missing lesson returns an error instead of throwing, "learner" instead of the glossary's "student", notes exposed to instructors against the glossary, and about a dozen comments contradicting the code.
- Judgment calls: duplicated code in `save.tsx`, N+1 queries on saved, bookmark/note logic in route files with no tests, and data clumps; built-in code smells come from Refactoring and work without `codingstandards.md`.
- Spec findings: unfulfilled user stories, unrequested features, and wrong behavior (5000 vs 2000 character cap, no content-access check on either action).
- The agent rewrites the PR body through the PR skill, pushes fixes, and improves evidence by adding and running tests that did not exist.
- Merge danger stays one-way with privacy as blast radius, but the blast radius shrinks once no instructor or platform admin can read note bodies.
- Takeaway: automated review against both spec and standards radically raises PR quality before any human reads the diff.

# L2 detail

- `#L1-L44` — Run starts by identifying the fixed point (`main`, the PR base), launching standards and spec review as background agents, then acting on both reports immediately: proactive fixing rather than deferring decisions.
- `#L45-L96` — Standards report: documented rules broken (missing lesson returns an error instead of throwing, "learner" vs glossary "student", notes shown to instructors despite being private, comments contradicting adjacent code); judgment calls surfaced for review.
- `#L97-L160` — Judgment-call detail: duplicated code in `save.tsx`, N+1 queries on saved, bookmark/note logic in route files without tests, data clumps with a duplicated inline type; these smells are built into the skill and drawn from Refactoring; user approves fixing them.
- `#L161-L232` — Spec report: missing user stories (last-edited time absent, notebook placed under lesson content instead of the video), unrequested instructor student-notes section, wrong implementation (5000 cap not 2000, no `requireContentAccess`), then the change summary and the decisions list.
- `#L233-L319` — Foreign keys with `on delete no action` discussed as genuinely bad; the agent fixes other approved items and rewrites the PR description via the PR skill; push to PR 34; follow-up issues noted as a normal review output.
- `#L320-L392` — Rewritten body with validation pseudocode (trim, refuse empty, refuse over 2000, replace body on conflict), richer evidence from newly added tests, and merge danger still one-way with privacy as blast radius but reduced.
- `#L393-L467` — Privacy rationale: instructors can no longer read note bodies, so the earlier privacy promise now holds; closing claim that automated review against spec and standards materially improves a PR before human review, with human diff reading still to come.
