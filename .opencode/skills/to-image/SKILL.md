---
name: to-image
description: 依 /to-article 產生的配圖計畫逐張生圖，插入既有 HTML 課程文章。
disable-model-invocation: true
argument-hint: "/to-image <subject> [tier<N> | node-slug ...] [-max-subagents N] [-skip-ask]"
---

Generate the images planned by `/to-article` and insert them into each step's HTML article. Generation goes through `src/html-cli.mjs`, which calls the `.env` `IMAGE_MODEL` / `IMAGE_PROVIDER`. This stage spends money on the image API, so it lists what it will generate and waits for confirmation unless `-skip-ask` is passed.

**Invocation modes:**
- `/to-image <subject>` — all nodes in the roadmap.
- `/to-image <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap.
- `/to-image <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3) to any mode.
- Append `-skip-ask` to skip the confirmation prompt.

Prereqs: `/to-article` has already run for the target steps (each has a `learn/<subject>/output/<node>/<step>/plan.json`); the repo root has `npm install` run and a `.env` with the image API keys (see `.env.example`). If a step has no `plan.json`, skip it and report it.

1. **Resolve.** Parse `subject`, `-max-subagents N`, `-skip-ask`, and the scope per `docs/reference/skill-scope.md`. For every node in scope, read each step's `learn/<subject>/output/<node>/<step>/plan.json` and count its items. Steps without a plan are skipped.
2. **Confirm.** The plan count is "M lessons, N images". Unless `-skip-ask`, list each step with its image count and ask the learner to confirm before generating. On refusal, stop without generating.
3. **Process.** Batch the resolved **steps** (not nodes) into groups of `max-subagents`. Process batches sequentially; steps within a batch run in parallel. For each batch dispatch one `task` call per step — all calls in a single message, each with `subagent_type: article-agent` and the [Dispatch-prompt](#dispatch-prompt) filled in — so every article-agent owns exactly one step. Wait for the batch, show a progress line, then continue.
4. **Report.** Summarise: images generated, images reused, steps failed, steps skipped. List failed steps with their errors and suggest re-running `/to-image <subject> <node-slug>`.

Completion: every step with a plan was dispatched to its own article-agent, every agent returned, each step reports done / failed / skipped, and the final report includes the generated and reused image counts.

## Dispatch-prompt

The prompt below is the complete text passed to each `task` call. Dispatch with `subagent_type: article-agent`; fill `<SUBJECT>`, `<NODE-ID>` and `<STEP-ID>` first.

```
Process exactly one lesson step in image mode. Subject: <SUBJECT>. Node: <NODE-ID>. Step: <STEP-ID>.

Follow your article-agent instructions exactly. The CLI calls the .env image provider; do not edit any HTML yourself.

Report the step id, status (done / failed / skipped), the image count, how many were reused, and any error message.
```
