---
name: to-article
description: 把既有 step HTML 課程改寫成純文章（只改寫、發佈，不規劃配圖、不花錢）。
disable-model-invocation: true
argument-hint: "/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N] [-max-parallel N]"
---

Rewrite the HTML lessons of a subject's steps into readable articles and publish them. **This stage only rewrites and publishes — it does not plan or place figures.** Image planning and generation are `/to-image`'s job. Prose cleanup (`/zh-tw-humanizer`) is a separate concern, not part of this skill.

The rewrite goes through `src/html-cli.mjs`, which makes one `.env` text-model call per step, validates that code blocks and links survive, writes `rewritten.html`, and publishes the plain rewritten article (rewrite body + the original quiz/nav/footer) to the live lesson. No agent is involved — the whole stage is the CLI batch.

**Invocation modes:**
- `/to-article <subject>` — all nodes in the roadmap.
- `/to-article <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap (e.g. `tier1`).
- `/to-article <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3): how many nodes are processed at once.
- Append `-max-parallel N` (default 2): how many text calls one node's batch may run at once. At most `max-subagents × max-parallel` text calls are ever in flight.

Prereqs: `learn/<subject>/MEMORY.md` and `learn/<subject>/ROADMAP.md` exist; the repo root has `npm install` run and a `.env` with `TEXT_API_KEY` (see `.env.example`). If any is missing, say so and stop.

1. **Resolve.** Parse `subject`, `-max-subagents N`, `-max-parallel N`, and the scope per `docs/reference/skill-scope.md`. Validate each resolved slug has a container at `learn/<subject>/nodes/<slug>.mdx`. Do **not** enumerate steps — the batch CLI reads each node's `steps` DAG itself and reports any step it skips.
2. **Rewrite.** For each batch of `max-subagents` nodes, run one command per node in parallel:
   `node src/html-cli.mjs article-batch --subject <subject> --node <node> [--max-parallel <max-parallel>]`
   It rewrites every step of the node, publishes each rewrite to the live lesson, and prints JSON with per-step statuses (`rewritten` / `failed` / `skipped`, with a reason). Process batches sequentially; wait for every command in a batch before the next, and show a progress line.
3. **Report.** Summarise: steps rewritten / failed / skipped (with reasons). List failed steps and suggest re-running `/to-article <subject> <node-slug>`. Remind the learner the article is published and figures come later from `/to-image`.

Completion: every node in scope ran its `article-batch`, each step reports rewritten / failed / skipped, and the final report is delivered.
