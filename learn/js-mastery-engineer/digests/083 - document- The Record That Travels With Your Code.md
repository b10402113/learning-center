---
source: sources/js-mastery-engineer/20261107/supplement/083 - document- The Record That Travels With Your Code.txt
source_type: text
source_lines: 160
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- /document writes the record that travels with a change after it is built, proven, tested and reviewed; it is the natural partner to review because a description lets reviewers trust the change before opening files.
- It picks the artifact type by situation: PR description for reviewers (what changed in product language), changelog entry for developers, release note for users (flagging breaking changes), and postmortem for the team (facts, unknowns marked unknown).
- It works out which one fits — on a feature branch ahead of base it suggests a PR description and asks you to confirm; the postmortem pairs with /debug.
- It reads the commits/diff (what changed), the spec (why), the review findings (risks) and the tests (how to check), so the two hardest parts of a PR description — the reason and the risk — are already on disk rather than reconstructed from memory.
- Code beats commit message: a claimed performance improvement with no measuring diff gets dropped; it will not invent benefits, unmeasured numbers, or timelines.
- The PR body groups changes by purpose (not a file list), takes the why from the spec, uses real testing steps, and includes review-derived risks; it asks before pushing, updates an existing PR rather than duplicating, and writes prose only — it does not commit, push or merge.
- Run it before opening a PR, when a change merges and needs a changelog, when a version needs user-facing notes, and after an incident for a facts-based postmortem.
- Honest limits: it is only as good as the trail behind it, and truthfulness is a discipline, not a technical guarantee.
- It differs from most AI writing tools because it is not inventing a story from the final diff — it reads the one the workflow already recorded, so every claim traces to an artifact.

# L2 detail

- `#L1-L10` — intro: /document writes the record that travels with the change and pairs with review
- `#L11-L43` — the four artifact types and what each leads with
- `#L44-L52` — choosing the artifact from context and pairing the postmortem with /debug
- `#L53-L83` — what it reads (commits/diff, spec, review findings, tests) and why reason and risk are already recorded
- `#L84-L98` — code beats commit message; it will not invent benefits, numbers or timelines
- `#L99-L115` — anatomy of the PR body: product-language changes, spec-sourced why, grouped changes, real test steps, review-derived risks
- `#L116-L128` — asking before it pushes, updating an existing PR, and writing prose only
- `#L129-L134` — when to run it
- `#L135-L143` — honest limits: a thin trail produces a thin document
- `#L144-L156` — why it differs from other AI writing tools: it reads the recorded trail so claims trace to artifacts
- `#L157-L160` — next: taking a feature through all four GA steps
