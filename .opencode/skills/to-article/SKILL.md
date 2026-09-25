---
name: to-article
description: 把既有 step HTML 課程改寫成圖文並茂的文章（只改寫與規劃配圖，不花錢生圖）。
disable-model-invocation: true
argument-hint: "/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N]"
---

Rewrite the HTML lessons of a subject's steps into readable illustrated articles, planning where images go but **not generating them**. The rewrite is done by `src/html-cli.mjs`, which calls the `.env` `TEXT_MODEL`; the dispatched `article-agent` reads the finished rewrite, decides where images go, and marks those spots. A later `/to-image` spends the image money.

**Invocation modes:**
- `/to-article <subject>` — all nodes in the roadmap.
- `/to-article <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap (e.g. `tier1`).
- `/to-article <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3) to any mode.

Prereqs: `learn/<subject>/MEMORY.md` and `learn/<subject>/ROADMAP.md` exist; the repo root has `npm install` run and a `.env` with `TEXT_API_KEY` (see `.env.example`). If any is missing, say so and stop.

1. **Resolve.** Parse `subject`, `-max-subagents N`, and the scope per `docs/reference/skill-scope.md`. Within each resolved node, collect every step id from the container's `steps` DAG. Drop steps whose `learn/<subject>/lessons/<node>/<step>.html` is missing; report them as skipped.
2. **Process.** Batch the resolved **steps** (not nodes) into groups of `max-subagents`. Process batches sequentially; steps within a batch run in parallel. For each batch dispatch one `task` call per step — all calls in a single message, each with `subagent_type: article-agent` and the [Dispatch-prompt](#dispatch-prompt) filled in — so every article-agent owns exactly one step. Wait for the batch, show a progress line, then continue.
3. **Report.** Summarise: steps rewritten, steps failed, steps skipped (with reasons). List failed steps and suggest re-running `/to-article <subject> <node-slug>`. Remind the learner to review the rewritten HTML before running `/to-image`.

Completion: every step with an HTML lesson was dispatched to its own article-agent, every agent returned, each step reports rewritten / failed / skipped, and the final report is delivered.

## Dispatch-prompt

The prompt below is the complete text passed to each `task` call. Dispatch with `subagent_type: article-agent`; fill `<SUBJECT>`, `<NODE-ID>` and `<STEP-ID>` first.

```
Process exactly one lesson step in article mode. Subject: <SUBJECT>. Node: <NODE-ID>. Step: <STEP-ID>.

Follow your article-agent instructions exactly. The rewrite and finalization go through `src/html-cli.mjs` (which calls the .env text model); between the two CLI calls you read the rewritten article, decide where images go, add `<!--image:N-->` marker lines to `rewritten.html`, and write the plan file. Do not rewrite the prose yourself.

Report the step id, status (rewritten / failed / skipped), the image count planned, and any error message.
```
