---
name: to-article
description: 把既有 step HTML 課程改寫成圖文並茂的文章（只改寫與規劃配圖，不花錢生圖）。
disable-model-invocation: true
argument-hint: "/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N] [-max-parallel N]"
---

Rewrite the HTML lessons of a subject's steps into readable illustrated articles, planning where images go but **not generating them**. One `article-agent` handles each **node**: it first rewrites every step in one bounded-parallel batch (one `.env` text-model call per step, by `src/html-cli.mjs`), then plans where each step's images go. A later `/to-image` spends the image money. Prose cleanup (`/speak-human-tw`) is a separate concern, not part of this skill.

**Invocation modes:**
- `/to-article <subject>` — all nodes in the roadmap.
- `/to-article <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap (e.g. `tier1`).
- `/to-article <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3): how many nodes run in parallel.
- Append `-max-parallel N` (default 2): how many text calls one node's batch may run at once. At most `max-subagents × max-parallel` text calls are ever in flight.

Prereqs: `learn/<subject>/MEMORY.md` and `learn/<subject>/ROADMAP.md` exist; the repo root has `npm install` run and a `.env` with `TEXT_API_KEY` (see `.env.example`). If any is missing, say so and stop.

1. **Resolve.** Parse `subject`, `-max-subagents N`, `-max-parallel N`, and the scope per `docs/reference/skill-scope.md`. Validate each resolved slug has a container at `learn/<subject>/nodes/<slug>.mdx`. Do **not** enumerate steps here — the batch CLI reads each node's `steps` DAG itself and reports any step it skips.
2. **Article.** Batch the resolved **nodes** into groups of `max-subagents`. Process batches sequentially; nodes within a batch run in parallel. For each node dispatch one `task` call with `subagent_type: article-agent` and the [Article-prompt](#article-prompt) filled in — the same agent rewrites the node's steps in one batch, then plans each rewritten step (one at a time). Wait for the batch, show a progress line, then continue.
3. **Report.** Summarise: steps rewritten / planned, steps failed, steps skipped (with reasons). List failed steps and suggest re-running `/to-article <subject> <node-slug>`. Remind the learner to review the rewritten HTML before running `/to-image`.

Completion: every node was dispatched to its own article-agent, every agent returned, each step reports rewritten / planned / failed / skipped, and the final report is delivered.

## Article-prompt

Passed to each `task` call. Fill `<SUBJECT>`, `<NODE-ID>` and `<MAX-PARALLEL>` first; dispatch with `subagent_type: article-agent`.

```
Process one whole lesson node in node-article mode. Subject: <SUBJECT>. Node: <NODE-ID>.

Follow your article-agent instructions (mode `node-article`) exactly: run the `src/html-cli.mjs article-batch --subject <SUBJECT> --node <NODE-ID> --max-parallel <MAX-PARALLEL>` call (it uses the .env text model and rewrites every step of the node in one batch), then for each step it reports as `rewritten`, one step at a time: read the rewrite, decide the image plan, insert the `<!--image:N-->` marker lines (the only edit you may make to that file), write the plan file, and run the `src/html-cli.mjs figures` call for that step to finalize.

Report one line per step with the step id, status (rewritten / planned / failed / skipped), the rewritten path, the planned image count, and any error message.
```
