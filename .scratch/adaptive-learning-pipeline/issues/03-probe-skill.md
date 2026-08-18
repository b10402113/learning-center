# 03. `/probe` skill — adaptive mastery probe + per-area report

Status: ready-for-agent
Blocked by: 02

## Parent

`.scratch/adaptive-learning-pipeline/spec.md`

## What to build

A new agent skill `/probe <subject>` that runs after `/learn-init` and before `/roadmap`. It quizzes the learner with interactive adaptive multiple-choice questions from shallow to deep across the whole source scope, binary-searching each knowledge strand, and writes a per-area mastery report (`unknown | partial | solid`) persisted per subject, chunked by source area. It never prunes content — mastery only calibrates how deep later stages teach.

## Acceptance criteria

- [ ] New skill file `.opencode/skills/probe/SKILL.md` with `argument-hint` for the subject.
- [ ] Reads source material via digests only (`docs/reference/source-reading.md`), never raw sources.
- [ ] Covers the entire source scope — no area skipped because `MEMORY.md` looks strong there.
- [ ] Asks MCQ shallow → deep per knowledge strand; binary-searches each strand, stopping once the learner demonstrates understanding (not bored by already-answered questions).
- [ ] Writes a per-area mastery report (`unknown | partial | solid`), chunked by source area, to `learn/<subject>/mastery.md`.
- [ ] Never proposes pruning or deletion; all content stays complete and readable.
- [ ] Report format matches the contract documented in ticket 02 so `/roadmap` and `/nodes` can read it.

## Reference files

- [ ] `.opencode/skills/learn-init/SKILL.md` (pipeline position)
- [ ] `docs/reference/source-reading.md`
- [ ] `AGENTS.md` (mastery report shape)

## Blocked by

- 02 — Pipeline contract sync (defines the mastery report file shape and pipeline position)
