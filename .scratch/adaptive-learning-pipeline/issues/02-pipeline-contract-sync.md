# 02. Pipeline contract sync — AGENTS.md + tune.md + learn-init/roadmap/edges

Status: ready-for-agent
Blocked by: 01

## Parent

`.scratch/adaptive-learning-pipeline/spec.md`

## What to build

`CONTEXT.md` and ADRs 0003–0005 already describe the new model, but the authoritative schema and the writer skills still describe the old one. Bring `AGENTS.md`, `docs/reference/tune.md`, and the `learn-init`/`roadmap`/`edges` skills in line with the step-DAG + probe + tackle pipeline, so the vocabulary, file formats, and command flow match what the generator (ticket 01) emits and what the new skills (tickets 03–05) will do.

## Acceptance criteria

- [ ] `AGENTS.md` documents the node-container format: node file holds the step-DAG (step ids + deps), reading order, and main lesson; `elements` is no longer a flat node-frontmatter list.
- [ ] `AGENTS.md` documents the step-file format: first-class article under `nodes/<node-id>/<step-id>.mdx`, frontmatter declaring the elements it `teaches`; deps declared centrally in the node file, not the step file.
- [ ] `AGENTS.md` documents the mastery report: per-subject file (`learn/<subject>/mastery.md`) chunked by source area, `unknown | partial | solid`, written by `/probe` and written back by `/tackle`; never prunes content.
- [ ] `AGENTS.md` pipeline becomes `/learn-init → /probe → /roadmap → /nodes → /edges`, with `/tackle <step-id>` as a runtime skill; `prepares/` removed; `question` element type deprecated.
- [ ] `AGENTS.md` tune-scope changes to `steps | elements-steps | all`; tune language updated to say steps are the article carriers.
- [ ] `docs/reference/tune.md` `tune-scope` values updated to `steps | elements-steps | all`, and consumption rules point at step articles.
- [ ] `learn-init` skill asks for `tune-scope` with the new values and points at `/probe` as the next stage after `MEMORY.md` is written.
- [ ] `roadmap` skill reflects the pipeline order (probe runs before roadmap) and notes mastery as a depth-calibration input.
- [ ] `edges` skill references the new `tune-scope` strings (edges apply the voice under `all` / `elements-steps`).
- [ ] Existing subject `MEMORY.md` files migrate `tune-scope: nodes → steps` (muscle-ladder is the only current subject).

## Reference files

- [ ] `AGENTS.md`
- [ ] `docs/reference/tune.md`
- [ ] `.opencode/skills/learn-init/SKILL.md`
- [ ] `.opencode/skills/roadmap/SKILL.md`
- [ ] `.opencode/skills/edges/SKILL.md`

## Blocked by

- 01 — Generator seam (pins the on-disk step/container format this schema documents)
