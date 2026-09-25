---
name: to-image
description: 依 /to-article 產生的配圖計畫逐張生圖，插入既有 HTML 課程文章。
disable-model-invocation: true
argument-hint: "/to-image <subject> [tier<N> | node-slug ...] [-max-subagents N] [-skip-ask]"
---

Generate the images planned by `/to-article` and insert them into each step's HTML article. This stage spends money on the image API, so it lists what it will generate and waits for confirmation unless `-skip-ask` is passed.

**Invocation modes:**
- `/to-image <subject>` — all nodes in the roadmap.
- `/to-image <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap.
- `/to-image <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3) to any mode.
- Append `-skip-ask` to skip the confirmation prompt.

Prereqs: `/to-article` has already run for the target steps (each has a `learn/<subject>/output/<node>/<step>/plan.json`); the repo root has `npm install` run and a `.env` with the image API keys (see `.env.example`). If a step has no `plan.json`, skip it and report it.

1. **Resolve.** Parse `subject`, `-max-subagents N`, `-skip-ask`, and the scope per `docs/reference/skill-scope.md`. For every node in scope, read each step's `learn/<subject>/output/<node>/<step>/plan.json` and count its items. Steps without a plan are skipped.
2. **Confirm.** The plan count is "M lessons, N images". Unless `-skip-ask`, list each node/step with its image count and ask the learner to confirm before generating. On refusal, stop without generating.
3. **Process.** Batch and dispatch per `docs/reference/skill-scope.md`, filling `<SUBJECT>` and `<NODE-ID>` into [Image-prompt](#image-prompt). Record done / failed / skipped per step.
4. **Report.** Summarise: images generated, images reused, steps failed, steps skipped. List failed steps with their errors and suggest re-running `/to-image <subject> <node-slug>`.

Completion: every resolved step with a plan was dispatched, every subagent returned, each step reports done / failed / skipped, and the final report includes the generated and reused image counts.

## Image-prompt

The prompt below is the complete text passed to each `task` call. Dispatch with `subagent_type: teach-agent`. Fill `<SUBJECT>` and `<NODE-ID>` before dispatching.

```
Generate the planned illustrations for one node's articles. Subject: <SUBJECT>. Node: <NODE-ID>.

Work from the repo root. For each step id in learn/<SUBJECT>/nodes/<NODE-ID>.mdx's `steps` DAG that has a plan file at learn/<SUBJECT>/output/<NODE-ID>/<step-id>/plan.json, in order:

1. Run
   node src/html-cli.mjs image --subject <SUBJECT> --node <NODE-ID> --step <step-id>
   The command generates one image per plan item, writes it to learn/<SUBJECT>/output/<NODE-ID>/<step-id>/assets/image-N.png, copies it to learn/<SUBJECT>/lessons/<NODE-ID>/<step-id>-assets/image-N.png, and replaces each "配圖 N 待生成" placeholder with a <figure> that references the copied image. Images that already exist are reused, so the command is safe to re-run.
2. If a step has no plan.json, record it as skipped and continue.
3. If the command fails, record the step as failed with the error message and continue to the next step.

Do not call the text model and do not edit the lesson HTML by hand — the CLI owns both.

Report back per step: the step id, status (done / failed / skipped), the image count, how many were reused, and any error message. Also report the node's total generated / reused / failed / skipped counts.
```
