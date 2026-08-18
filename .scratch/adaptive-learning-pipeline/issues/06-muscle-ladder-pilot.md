# 06. muscle-ladder pilot migration

Status: ready-for-agent
Blocked by: 01, 04

## Parent

`.scratch/adaptive-learning-pipeline/spec.md`

## What to build

Migrate one muscle-ladder node to the new step-DAG format to validate the formats against real material — not the whole subject. The pilot node's file becomes a container holding the step-DAG and main lesson, its step article files are written (each declaring `teaches`), its `prepares/` note is removed, and any dead references from the removed `prepares/` or deprecated `question` type are cleaned. The generator must round-trip the migrated node green.

## Acceptance criteria

- [ ] One pilot node (a Tier-1 node such as `muscle-ladder-and-handrails`) is migrated to the step-DAG container format.
- [ ] Its step article files are written under `learn/muscle-ladder/nodes/<node-id>/`, each with a `teaches` frontmatter declaring its elements.
- [ ] The node file's flat `elements` list is replaced by the DAG (step ids + deps) plus the main lesson.
- [ ] The `learn/muscle-ladder/prepares/muscle-ladder-and-handrails.mdx` note is removed.
- [ ] No `question`-typed elements or stale references remain in the migrated node's scope; element pages keep their keyword-dictionary structure.
- [ ] `node scripts/generate-data.mjs` and `knowledge-map` tests stay green, and the emitted graph contains the pilot node's steps, DAG edges, and step→element links (round-trip validation).

## Reference files

- [ ] `learn/muscle-ladder/nodes/muscle-ladder-and-handrails.mdx`
- [ ] `learn/muscle-ladder/prepares/muscle-ladder-and-handrails.mdx`
- [ ] `learn/muscle-ladder/elements/*.mdx`

## Blocked by

- 01 — Generator seam (parses the new step files and DAG)
- 04 — `/nodes` step-DAG skill (defines how the node and steps are written)
