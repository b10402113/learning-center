# 05. `/tackle` skill — adaptive step verification + mastery write-back

Status: ready-for-agent
Blocked by: 02, 04

## Parent

`.scratch/adaptive-learning-pipeline/spec.md`

## What to build

A new agent skill `/tackle <subject>/<step-id>` run at learning time. It generates 5–10 adaptive multiple-choice questions on the fly from the step's elements, anchors starting difficulty to the learner's `MEMORY.md` profile, and adapts to live answers (correct → harder, wrong → easier). A step passes only when the system estimates its concepts at `solid`; passing marks the step complete and writes the mastery back, keeping the calibration loop fresh.

## Acceptance criteria

- [ ] New skill file `.opencode/skills/tackle/SKILL.md` with `argument-hint` for the step id.
- [ ] Generates 5–10 MCQ on the fly from the step's elements, grounded in those elements and their cited sources.
- [ ] Anchors starting difficulty to `MEMORY.md` (prior experience, language, "how to teach me").
- [ ] Adapts to live answers — correct → harder, wrong → easier — probing the edge of understanding rather than a fixed difficulty.
- [ ] Passing is the system's estimate of `solid` (e.g. N consecutive correct at target difficulty), not a fixed score threshold.
- [ ] On pass, marks the step complete and writes mastery back to the subject's mastery report (format per ticket 02).
- [ ] Questions stay deterministic enough that passing means understanding, not luck.

## Reference files

- [ ] `.opencode/skills/nodes/SKILL.md` (step + element format this consumes)
- [ ] `AGENTS.md` (tackle and mastery contract)

## Blocked by

- 02 — Pipeline contract sync (mastery write-back shape)
- 04 — `/nodes` step-DAG skill (steps and their `teaches` elements exist to test against)
