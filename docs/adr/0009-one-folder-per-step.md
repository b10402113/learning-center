# One folder per step, an immutable original, and staged articles

One step's artifacts are spread across `materials/`, `jobs/`, `image-plans/`, `humanize/`, `humanized/`, and `quiz-candidates/` under `learn/<subject>/output/`. Deleting a step means remembering six locations; `reset-nodes` carries its own list.

Worse, the stage contract is broken. `polish-article draft` rewrites `<step>.original.md` in place, so the publisher's original is gone as soon as polish runs. The markers-only run then copies it to `<step>.article.md` and `<step>.protected.md`, producing three byte-identical files. `publish` reads `.article.md`, so the duplicate is load-bearing only by accident. The single formal image plan lives under the gitignored `output/`, which is why `batch-nodes` has to keep a `.plan.backup.json` just to check that the plan survived humanize.

We make each stage's artifact explicit, keep the publisher's original immutable, and put everything about one step in one folder.

## Decision

### Layout

```text
learn/<subject>/nodes/<node>/
  <step>.md                 final article
  <step>.plan.json          formal image plan, tracked by git
  <step>.quiz.json          quiz sidecar, tracked by git
  <step>-assets/image-N.webp

learn/<subject>/output/<node>/
  prepare.json
  teaching-plan.md
  <step>/
    material.json
    original.md
    polish.md
    humanized.md
    request.json
    result.json
    blocks.json
```

`output/` stays gitignored. Only `original.md`, `polish.md`, and `humanized.md` need to survive within a working copy; they are stage artifacts, not deliverables. The formal plan moves to the node directory because it is needed to regenerate figures after a clone.

### Stage contract

- `original.md` is written once by the publisher and never written again. Every later stage reads it or reads something derived from it.
- `polish-article draft` reads `original.md` and writes `polish.md`, and rewrites the plan.
- `run-article-agent --markers-only` validates that the markers in `polish.md` match the plan in count and order, then writes `result.json`. It no longer produces an article file.
- `publish` reads `polish.md` (through `result.json`), restores protected code, and writes `nodes/<node>/<step>.md`.
- Continuity editing by the main agent edits prose in `step.md` only.
- Humanize seeds `humanized.md` from `step.md`. The subagent edits `humanized.md` and the plan's `heading`/`prompt`; validation compares the structural parts against `step.md`; then `humanized.md` is copied back to `step.md`. There is no separate workspace directory, and no plan backup.
- `generate-images` reads `nodes/<node>/<step>.plan.json` and replaces markers in `step.md` with image lines.
- `--force` is split by stage. `prepare --force` clears the step's stale `polish.md`, `result.json`, `blocks.json`, and `request.json` so an old run cannot publish; the publisher then rewrites `original.md`, `polish.md`, and the plan. `publish --force` clears the step's figures, quiz, and polish/humanize records only after the new article is written. A failed run leaves the old article and figures in place.

### Migration

Move every `output/image-plans/<node>/<step>.json` whose step is still in the node's `steps` array to `nodes/<node>/<step>.plan.json`, then delete the rest of `output/`. A plan for a step that no longer exists is stale and is dropped with it. Quiz candidates are already copied into the node directory, and the old `jobs/*.original.md` files are post-polish copies, not real originals, so there is nothing worth carrying over.

## Rejected

- **Keep three files (original, polish, article) as a verification gate.** The article file is always identical to polish, so the gate would keep a duplicate without adding a check.
- **Protect the plan's raw version too.** The plan is configuration, not prose; only its latest version is consumed.
- **Keep the legacy humanize workspace.** `humanized.md` can be the workspace: the subagent edits only that file, and it is copied to `step.md` only after validation.

## Consequences

- `original.md` and the polished stages are lost on a fresh clone, because `output/` is ignored. That is accepted: the published article is the deliverable.
- `<step>.plan.json` becomes a tracked course artifact, so `verify`, `reset-nodes`, and course-app data generation must know about it instead of treating the node directory as articles-only.
- Code paths that hardcode the old locations change: `article-agent-bridge`, `article-cli`, `polish-article`, `run-article-agent`, `publish-article`, `render-images`, `reset-nodes`, `verify`, `pdf-backfill`, the `article` and `batch-nodes` skills, `AGENTS.md`, and their tests.
