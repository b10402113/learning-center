---
source: >-
  sources/real-agent/20261030/Review/034 Testing Out The Code Review
  Skill.en.srt
source_type: text
source_lines: 179
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Exercise: run `code review` on the low-quality PR and add "and fix what you find", because automated review should be proactive.
- Comments-only review pushes work onto humans and makes the process slower; the goal is the fastest possible human review.
- Automated review is two-axis: review against coding standards and review against a written spec.
- A spec catches shortcuts the implementer took; you do not always have one, but here a spec exists in a gist using the spec-to-tickets layout.
- Setup: file the spec as issue 35, point the agent at the PR and the spec, and let it fix what it finds before human review.

# L2 detail

- `#L1-L44` — Framing: a suspiciously low-quality PR that should be raised in quality before human review; grab the PR number and run code review on it; add "and fix what you find".
- `#L45-L92` — Rationale for proactive fixing: a pile of comments handed to humans slows everything down; automated review should fix what it finds and escalate only the iffy or uncertain; the review is two-axis, standards plus spec.
- `#L93-L140` — Spec axis: coding is complicated and agents take shortcuts, so verify against a written spec; specs are not always available, but this project has one in a gist in the spec-to-tickets layout; copy it into issue 35.
- `#L141-L179` — Ready state: spec passed, PR pointed at, fix instruction given; expectation is many findings and a materially better PR for the human to review.
