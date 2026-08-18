# 04. `/nodes` step-DAG skill — reason + confirm DAG, write step articles

Status: ready-for-agent
Blocked by: 02

## Parent

`.scratch/adaptive-learning-pipeline/spec.md`

## What to build

Rewrite the `/nodes` skill so a node is no longer written as a single article. `/nodes <subject>/<node-id>` first reasons out the node's step-DAG (step ids + deps) from the digests, presents it for learner confirmation, then writes each step as a first-class article file that declares the elements it `teaches`, and writes the node file as a container holding only the DAG, reading order, and main lesson. It stops authoring `prepares/` notes and `question`-typed elements, and applies the subject's tune to step prose.

## Acceptance criteria

- [ ] `/nodes` reasons out the step-DAG before writing any step article, and presents it for learner confirmation (a deliberate plan, not improvised).
- [ ] Step files are first-class articles at `learn/<subject>/nodes/<node-id>/<step-id>.mdx`, each frontmatter declaring the elements it `teaches`.
- [ ] Deps are declared centrally in the node file's DAG, not in step files; the node file holds the DAG (step ids + deps), reading order, and main lesson.
- [ ] The node's flat `elements` frontmatter list is replaced by step-level `teaches` declarations.
- [ ] Step prose is written in the subject's `language` with the chosen tune applied to `steps` scope (`docs/reference/tune.md`).
- [ ] Element pages keep their existing keyword-dictionary structure; `prepares/` preview notes are no longer written (existing ones are left to ticket 06 to remove).
- [ ] `question`-typed elements are no longer authored.
- [ ] Node status flow still ends at `content-written` after all step articles exist and checks pass.

## Reference files

- [ ] `.opencode/skills/nodes/SKILL.md`
- [ ] `docs/reference/article-writing.md`
- [ ] `docs/reference/tune.md`
- [ ] `AGENTS.md` (node-container and step-file formats)

## Blocked by

- 02 — Pipeline contract sync (defines the node-container and step-file formats this skill writes)
