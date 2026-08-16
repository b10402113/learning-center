# 01. Generator seam — emit steps, step-DAG, teaches links; deprecate `question`

Status: ready-for-agent
Blocked by: none

## Parent

`.scratch/adaptive-learning-pipeline/spec.md`

## What to build

The generator is the pipeline's executable contract. Extend `scripts/generate-data.mjs` so a subject whose nodes are step-DAGs still builds correctly: step files under `nodes/<node-id>/` are scanned and emitted as steps with their DAG deps and the elements each step `teaches`; step→element links resolve; `question`-typed elements are marked deprecated. A node with no steps (legacy single-article) keeps emitting exactly as today, so pre-migration subjects continue to build.

## Acceptance criteria

- [ ] `scanSubject` also collects step files under each `nodes/<node-id>/` directory (one `steps` collection keyed by `nodes/<node-id>/<step-id>.mdx`).
- [ ] `buildSubjectGraph` parses each node's step-DAG (step ids + deps, declared centrally in the node file) and emits steps as first-class structural entries — `id` (node-qualified `<node-id>/<step-id>`), `stepId`, `nodeId`, `title`, `order`, `deps`, `teaches` (element ids), `sources` — with no rendered HTML, matching the existing node/element "structural data only" contract.
- [ ] Step→element links resolve in both directions: a step's `teaches` points to elements, and each element records the steps that teach it.
- [ ] DAG edges are emitted between steps per the node's declared deps.
- [ ] A legacy node with no steps emits exactly as before (no step fields added, node shape unchanged) — backward compatibility.
- [ ] `question`-typed elements are marked deprecated in the emitted data.
- [ ] `scripts/generate-data.d.mts` types are updated to describe steps and the deprecated marker.
- [ ] New generator tests cover: a step-DAG node with multiple steps and deps; a legacy no-step node; step `teaches` element resolution; a `question` element marked deprecated. Existing `generator.test.ts` stays green. Tests assert the emitted graph structure, not parser internals.
- [ ] `npm run test` and `npm run typecheck` pass in `knowledge-map`; `node scripts/generate-data.mjs` writes `graph.json` without error.

## Reference files

- [ ] `scripts/generate-data.mjs`
- [ ] `scripts/generate-data.d.mts`
- [ ] `knowledge-map/src/__tests__/generator.test.ts`

## Blocked by

None — can start immediately.
