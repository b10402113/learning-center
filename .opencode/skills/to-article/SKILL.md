---
name: to-article
description: 把既有 step HTML 課程改寫成圖文並茂的文章（只改寫與規劃配圖，不花錢生圖）。
disable-model-invocation: true
argument-hint: "/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N]"
---

Rewrite the HTML lessons of a subject's steps into readable illustrated articles, planning where images go but **not generating them**. One `article-agent` handles each step: it first rewrites the lesson (one `.env` text-model call by `src/html-cli.mjs`) and then plans where the images go. A later `/to-image` spends the image money. Prose cleanup (`/speak-human-tw`) is a separate concern, not part of this skill.

**Invocation modes:**
- `/to-article <subject>` — all nodes in the roadmap.
- `/to-article <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap (e.g. `tier1`).
- `/to-article <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3) to any mode.

Prereqs: `learn/<subject>/MEMORY.md` and `learn/<subject>/ROADMAP.md` exist; the repo root has `npm install` run and a `.env` with `TEXT_API_KEY` (see `.env.example`). If any is missing, say so and stop.

1. **Resolve.** Parse `subject`, `-max-subagents N`, and the scope per `docs/reference/skill-scope.md`. Within each resolved node, collect every step id from the container's `steps` DAG. Drop steps whose `learn/<subject>/lessons/<node>/<step>.html` is missing; report them as skipped.
2. **Article.** Batch the resolved **steps** (not nodes) into groups of `max-subagents`. Process batches sequentially; steps within a batch run in parallel. For each step dispatch one `task` call with `subagent_type: article-agent` and the [Article-prompt](#article-prompt) filled in — the same agent rewrites the step, then plans its figures. Wait for the batch, show a progress line, then continue.
3. **Report.** Summarise: steps rewritten / planned, steps failed, steps skipped (with reasons). List failed steps and suggest re-running `/to-article <subject> <node-slug>`. Remind the learner to review the rewritten HTML before running `/to-image`.

Completion: every step with an HTML lesson was dispatched to its own article-agent, every agent returned, each step reports rewritten / planned / failed / skipped, and the final report is delivered.

## Article-prompt

Passed to each `task` call. Fill `<SUBJECT>`, `<NODE-ID>`, `<STEP-ID>` first; dispatch with `subagent_type: article-agent`.

```
Process exactly one lesson step in article mode. Subject: <SUBJECT>. Node: <NODE-ID>. Step: <STEP-ID>.

Follow your article-agent instructions (mode `article`) exactly: run the `src/html-cli.mjs article` call (it uses the .env text model) to rewrite the lesson, then read the rewrite, decide the image plan, insert the `<!--image:N-->` marker lines (the only edit you may make to the file), write the plan file, and run the `src/html-cli.mjs figures` call to finalize.

Report the step id, status (rewritten / planned / failed / skipped), the rewritten path, the planned image count, and any error message.
```
