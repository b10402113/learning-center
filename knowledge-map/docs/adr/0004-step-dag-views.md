# ADR-0004: Steps are the map's units — step-DAG in both views, step-based completion

The learning pipeline migrated to a step-DAG node model (repo ADRs 0003–0005):
a node is a container holding a step-DAG plus a main lesson; steps are
first-class article files; elements are keyword pages; a step is the only
completion unit. The knowledge-map generator already emits `steps`,
`taughtBySteps`, `deprecated`, and `step-dep` edges. We align the site with
that model — steps become the map's lesson units, node→element teach links
move to step→element, completion is step-based, and legacy single-article
nodes are not supported.

## Decisions

- **Nebula**: graph nodes are steps (with their owning node as a label), not
  node cards. Element circles stay. Links: `step-dep` edges and step→element
  teach links only. Spine / shared-concept / explicit edges are not drawn in
  the nebula.
- **Roadmap**: tiers still group node cards; a card expands to show the node's
  step-DAG (step cards + dependency arrows) and the node's lesson description.
  Element markers tether to the steps that teach them.
- **Completion**: a step is the only completion unit. Steps rated `solid` in
  `learn/<subject>/mastery.md` are seeded complete at generate time; the
  learner may override by hand (`localStorage`). A node is complete when every
  step in its DAG is complete. Element checkboxes are removed.
- **Reading**: steps have standalone routes `#/steps/<subject>/<node-id>/<step-id>`
  and reader-modal targets. Node pages show lesson description + step-DAG;
  element pages list "taught by steps" (with owning node).
- **Retired**: `question` element type (graded verification moved to `/tackle`);
  legacy single-article nodes (no steps) are not rendered as lessons.

## Considered Options

- **Keep node cards and derive node→element teach links from steps (rejected).**
  Preserves the old visual, but the map then shows a structure (node = lesson)
  the pipeline no longer produces — steps are the addressable, completable
  articles, so the map's units must be steps.
- **Render a step layer between node and element in the nebula (rejected).**
  Adds visual depth without adding signal; the step is the lesson node itself,
  not an intermediate chip.
- **Draw spine / shared-concept / explicit edges at step granularity
  (rejected).** Clutters the teaching graph; the DAG and teach links are the
  structure the learner needs in the nebula.

## Consequences

- `graph.json` regenerates to `quant-resource` (muscle-ladder's dir is empty).
  `EdgeKind` gains `step-dep`; `SubjectGraph` gains `steps`; `Node` loses
  `taughtElementIds` as a source of teach links. `completion.ts` and
  `progress.ts` move from element ids to step ids. The mdx registry must glob
  nested step files (`nodes/<node-id>/<step-id>.mdx`).
