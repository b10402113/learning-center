# Adaptive Learning Pipeline: Probe, Step-DAG Nodes, and Tackle

Status: ready-for-agent

## Problem Statement

The learning system teaches each learner the same way regardless of what they already know. A subject's profile (`MEMORY.md`) records prior experience once at `/learn-init`, but nothing measures the learner's current understanding of the actual material. Lessons are single linear articles (`nodes/`), so there is no granular teaching path to calibrate, no per-concept verification, and no way to confirm — for the learner or the system — that anything was actually learned. The existing `question` element type is unused, and completion relies on the learner marking elements done by hand, which invites the self-deception the system exists to prevent.

The reference workflow in `reference/How I Use AI to Learn Things.srt` (probe → plan → teach with per-step feedback) shows the shape of the fix: measure before, plan as a graph, teach step by step, verify per step.

## Solution

Turn the pipeline into a calibrated loop with steps as the atomic teaching-and-verification unit:

```
/learn-init → /probe → /roadmap → /nodes → /edges    (+ /tackle at learning time)
```

- **`/probe`** — after `/learn-init`, before `/roadmap`: an interactive adaptive MCQ session from shallow to deep across the whole source scope, binary-searching each knowledge strand. Writes a per-area **mastery** report (`unknown | partial | solid`) persisted per subject, chunked by source area. It never prunes content; mastery only calibrates depth.
- **Step-DAG nodes** — a node is no longer a single article. It is a **step-DAG**: the node file holds the DAG (step ids + deps) and the main lesson; each step is a first-class article file. A step references the **elements** (keyword dictionary pages) it teaches. `/nodes` generates the DAG and gets learner confirmation before writing step articles.
- **`/tackle`** — at learning time, per step: a runtime adaptive MCQ. Questions are generated on the fly from the step's elements, anchored to `MEMORY.md` for starting level, and adapt to live answers. Passing means the system estimates the step's concepts at `solid`; it marks the step complete and writes mastery back.
- **Completion** — a step is the only completion unit (passing `/tackle`). A node completes automatically once every step in its DAG is complete. Elements are keywords and are not marked complete.
- **Frontend** — out of scope this round. `docs/site-migration-memo.md` records what `knowledge-map` must absorb later.

## User Stories

1. As a learner, I want `/probe` to quiz me adaptively over the whole source from shallow to deep, so that the system measures what I already know instead of assuming it.
2. As a learner, I want `/probe` to stop probing a strand once I demonstrate understanding, so that I am not bored by questions I have already answered.
3. As a learner, I want the probe result to be recorded as per-area mastery (`unknown | partial | solid`), so that my current understanding is visible and reusable.
4. As the system, I want probe mastery persisted per subject in a chunked report, so that later stages can calibrate without re-measuring or reloading the whole source.
5. As a learner, I want `/probe` to cover the entire source scope, so that no area is skipped just because my profile looked strong there.
6. As a learner, I want probe results to only adjust depth, never delete content, so that every part of the subject stays complete and readable.
7. As a learner, I want the roadmap to reflect probe mastery in how deeply each node is taught, so that lessons start from what I actually know.
8. As a learner, I want to see a node as a **step-DAG** before its lessons are written, so that I can confirm or adjust how the lesson will walk.
9. As a learner, I want each step to be an article file, so that I read one digestible teaching unit at a time.
10. As a learner, I want each step to reference the elements (keyword pages) it uses, so that I can look up a concept in the dictionary when I need it.
11. As the system, I want the DAG's edges to live centrally in the node file, so that a lesson's full path is one coherent plan.
12. As the system, I want `/nodes` to reason out the step-DAG before writing any article, so that the teaching path is deliberate rather than improvised.
13. As a learner, I want `/tackle <step-id>` to test me on a step's concepts with 5–10 adaptive MCQ, so that I verify I actually understood the step.
14. As a learner, I want `/tackle` to adapt questions to my live answers (correct → harder, wrong → easier), so that it probes the edge of my understanding rather than a fixed difficulty.
15. As a learner, I want `/tackle` to anchor its starting difficulty to my `MEMORY.md` profile, so that the test starts at a sensible level for me.
16. As the system, I want a step to pass only when the estimated mastery of its concepts reaches `solid`, so that passing means understanding, not luck.
17. As a learner, I want passing `/tackle` to mark the step complete, so that I get a truthful, machine-graded signal of progress.
18. As the system, I want `/tackle` to write mastery back on pass, so that the calibration loop stays fresh across the whole subject.
19. As a learner, I want node completion to derive automatically from all steps in its DAG being complete, so that I never have to hand-mark a lesson done.
20. As a learner, I want elements to remain keyword dictionary pages with their existing structure, so that concept explanations stay stable and reusable across steps and nodes.
21. As a learner, I want to keep the element `Questions` section as a no-grade preview self-check, so that I can test myself while reading without it affecting completion.
22. As the system, I want the `question` element type deprecated, so that graded verification has exactly one home (`/tackle`).
23. As the learner, I want step articles written in my language with my chosen tune, so that teaching voice applies where the teaching happens.
24. As a learner, I want `prepares/` preview notes removed, so that the step-DAG confirmation replaces them and the pipeline stays lean.
25. As the system, I want the generator to parse the new node-container format, step files, and step-DAG edges into the graph, so that the new formats are validated automatically.
26. As the system, I want the generator to keep emitting the old shape for pre-migration nodes, so that existing subjects keep working during the pilot.
27. As a learner, I want muscle-ladder to be the first subject migrated to the new pipeline, so that the new formats get validated against real material.
28. As the system, I want the pipeline documented in `CONTEXT.md`, `AGENTS.md`, and ADRs, so that the vocabulary and decisions stay traceable.

## Implementation Decisions

- **Pipeline order** becomes `/learn-init → /probe → /roadmap → /nodes → /edges`, with `/tackle` as a runtime skill invoked at learning time. ADR-0004.
- **Node anatomy** (ADR-0003): a node file is a container holding the step-DAG (step ids + deps), the reading order, and the main lesson. `elements` is no longer a flat frontmatter list on the node; each step file declares the elements it teaches.
- **Step files** live under the node directory and are first-class articles. Each step file's frontmatter declares the elements it teaches (`teaches`); deps are declared centrally in the node file, not in the step file.
- **Element role** (ADR-0003): a keyword dictionary page. Existing element structure is preserved. The `question` element type is deprecated; the element `Questions` section remains as a no-grade self-check.
- **Probe mechanics** (ADR-0004): interactive adaptive MCQ, shallow → deep, binary search per strand, `unknown | partial | solid` mastery, chunked per-area report, no pruning.
- **Tackle mechanics** (ADR-0004): runtime adaptive MCQ per step, generated from the step's elements, starting level anchored to `MEMORY.md`, passing = system estimates `solid`.
- **Completion model** (ADR-0005, supersedes ADR-0002): step is the only completion unit; node completion derived from all steps in its DAG; elements not marked complete.
- **Progress split**: mastery persists per subject in a file (calibration data); step completion stays client-side UI state.
- **tune-scope** changes from `nodes | elements-nodes | all` to `steps | elements-steps | all`, since steps are the article carriers. `prepare notes` are removed.
- **Generator seam** (`scripts/generate-data.mjs`): extend `scanSubject`/`buildSubjectGraph` to scan step files under each node directory, parse step-DAG edges from the node container, and emit steps, step-DAG edges, and step→element links into `graph.json`. Preserve the existing node shape for nodes with no steps (main-lesson-only) so pre-migration subjects keep building. Mark `question`-typed elements as deprecated in the emitted data.
- **Site**: deferred. `docs/site-migration-memo.md` is the hand-off for `knowledge-map` (step nodes, DAG rendering, step-based completion, search over step bodies).

## Testing Decisions

- **Test the external contract, not internals.** The generator is the seam: given a fixture subject's markdown in the new format, assert on the emitted graph structure — not on parsing helpers.
- **Module under test**: `scripts/generate-data.mjs` via `buildSubjectGraph` / `scanSubject`, exercised through the existing Vitest setup in `knowledge-map`.
- **Prior art**: `knowledge-map/src/__tests__/generator.test.ts` already drives `buildSubjectGraph` with an in-memory fixture subject (`ROADMAP`, node/element/edge files) and asserts tiers, nodes, elements, edges. New fixtures follow the same pattern:
  - A step-DAG node with multiple steps and deps → emitted steps, DAG edges, and step→element links are correct.
  - A legacy node with no steps → emitted as before (backward compatibility).
  - Step files with `teaches` → elements resolve; element→step links resolve.
  - A `question`-typed element → marked deprecated in output.
- **What a good test does not do**: asserting on internal parser function signatures, or snapshot-testing the full graph blob (brittle).

## Out of Scope

- Frontend changes to `knowledge-map` (rendering step-DAGs, step pages, step-based completion, search). Tracked separately via `docs/site-migration-memo.md`.
- Migration of the full muscle-ladder subject — only the pilot node(s) needed to validate the new formats.
- Building a `/probe`-style browser UI — probe and tackle are agent skills.
- Any pruning or content deletion driven by mastery.

## Further Notes

- Decisions trace to ADRs 0003–0005 and the updated `CONTEXT.md` glossary (probe, mastery, step, tackle, completion).
- The reference workflow that inspired this design is `reference/How I Use AI to Learn Things.srt`: one-to-one teaching, engineered trust, work at the edge of understanding, plan-then-teach, and per-step feedback.
- `prepares/` removal and the deprecated `question` type may surface dead references in existing muscle-ladder files; clean them during the pilot.
