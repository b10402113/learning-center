# 07. Depth calibration — roadmap + nodes read mastery

Status: ready-for-agent
Blocked by: 03, 04

## Parent

`.scratch/adaptive-learning-pipeline/spec.md`

## What to build

Close the calibration loop. `/roadmap` reads the subject's mastery report when proposing nodes and reflects it in how deeply each node is taught; `/nodes` reads the same report to calibrate how deep each step goes (teach shallow where `solid`, deep where `unknown`). Mastery adjusts depth only — it never prunes content.

## Acceptance criteria

- [ ] `/roadmap` reads `learn/<subject>/mastery.md` (when present) and reflects per-area mastery in its node-depth proposal.
- [ ] `/nodes` reads the mastery report and calibrates per-step depth from it (teach shallow where `solid`, deep where `unknown`).
- [ ] Calibration never prunes or deletes content — every part of the subject stays complete and readable.
- [ ] A subject with no mastery report behaves as today (no report → no calibration, not an error).

## Reference files

- [ ] `.opencode/skills/roadmap/SKILL.md`
- [ ] `.opencode/skills/nodes/SKILL.md`

## Blocked by

- 03 — `/probe` skill (produces the mastery report)
- 04 — `/nodes` step-DAG skill (the granular step depth this calibrates)
