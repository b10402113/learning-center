---
source: sources/real-agent/20261030/Review/029 The Three Kinds Of Review.en.srt
source_type: text
source_lines: 247
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- Frames the software factory as a car: learning to slow down comes before learning to accelerate, otherwise you build a "slop cannon".
- Names three brakes on shipping: automated checks (deterministic, CPU-priced), automated review (agent-driven), and human review.
- Automated checks are unit tests, type checking, and linters; they cost tokens nothing, so you can layer them aggressively.
- Automated review is the layer with the most unexploited value; human review is the last and most expensive layer.
- The section covers automated and human review now, leaves automated checks to the later feedback-loop section.
- Strategy: use human review to improve automated review so the agent carries more and the human less, keeping quality high while shipping.

# L2 detail

- `#L1-L60` — Opening: aligning and planning already covered; the car metaphor; the first skill is slowing down; accelerating without brakes produces slop; quality prevents burnout; three brakes announced.
- `#L61-L132` — Automated checks: deterministic quality checks; unit tests, type checking, linters; cost CPU cycles rather than tokens; layer as many as you want to constrain agent behavior.
- `#L133-L168` — Automated review: agent-driven rather than deterministic; already seen in the code review skill and the implement-spec skill; much more value to extract.
- `#L169-L212` — Human review: a real person reading code; this section covers the bottom two layers; automated checks deferred to the feedback-loop section; how much code to read and when.
- `#L213-L247` — Closing: human review trains automated review; automated review should grow while human review shrinks; the three brakes keep quality high as shipping begins.
