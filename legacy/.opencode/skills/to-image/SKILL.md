---
name: to-image
description: 為每個 step 規劃配圖位置（文字模型）並生成圖片（圖片模型），就地把 figure 插進既有 HTML 文章。
disable-model-invocation: true
argument-hint: "/to-image <subject> [tier<N> | node-slug ...] [-max-subagents N] [-plan-only] [-skip-ask]"
---

Plan where each step's figures go and generate them. This stage owns **both** the planning (a `.env` text-model call per step) and the generation (the `.env` `IMAGE_MODEL` / `IMAGE_PROVIDER`): planning runs first, then it lists what it will generate and waits for confirmation, then generates. Generation goes through `src/html-cli.mjs`, which inserts each `<figure>` into the published lesson **in place** — the lesson is never rebuilt.

**Invocation modes:**
- `/to-image <subject>` — all nodes in the roadmap.
- `/to-image <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap.
- `/to-image <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3) to any mode.
- Append `-plan-only` to stop after planning: write the plans and mark the steps `planned`, but generate nothing.
- Append `-skip-ask` to skip the confirmation prompt.

Prereqs: each target step's HTML lesson exists (usually published by `/to-article`); the repo root has `npm install` run and a `.env` with `TEXT_API_KEY` (for planning) and the image API keys (see `.env.example`). A step with no HTML lesson is skipped and reported.

1. **Resolve.** Parse `subject`, `-max-subagents N`, `-plan-only`, `-skip-ask`, and the scope per `docs/reference/skill-scope.md`. For every node in scope, enumerate its steps (the node's `steps` DAG) and split them: a step with a `learn/<subject>/output/<node>/<step>/plan.json` **reuses** that plan; every other step needs planning.
2. **Plan.** Batch the steps that need planning into groups of `max-subagents`. Process batches sequentially; steps within a batch run in parallel. For each batch dispatch one `task` call per step — all calls in a single message, each with `subagent_type: article-agent` and the [Plan-prompt](#plan-prompt) filled in — so every article-agent owns exactly one step. Wait for the batch, show a progress line, then continue. A step that fails to plan is dropped from the generate phase and reported.
3. **Confirm.** Read each step's `plan.json` and count items. The total is "M lessons, N images". Unless `-skip-ask`, list each step with its image count and section heading and ask the learner to confirm before generating. On refusal, stop without generating (the plans remain recorded).
4. **Stop if planning-only.** With `-plan-only`, skip the generate phase, report, and stop.
5. **Generate.** Batch the steps that have a plan and are not already `done` into groups of `max-subagents`; steps within a batch run in parallel. For each batch dispatch one `task` call per step — all in a single message, each with `subagent_type: article-agent` and the [Image-prompt](#image-prompt) filled in. Wait for the batch, show a progress line, then continue.
6. **Report.** Summarise: planned, images generated, images reused, steps failed, steps skipped. List failed steps with their errors and suggest re-running `/to-image <subject> <node-slug>`.

Completion: every scoped step either reused or freshly planned, the plans were confirmed (unless `-skip-ask`/`-plan-only`), every step with a plan was dispatched to its own article-agent in the generate phase, every agent returned, each step reports done / failed / skipped, and the final report includes the generated and reused image counts.

## Plan-prompt

Passed to each planning `task` call. Fill `<SUBJECT>`, `<NODE-ID>` and `<STEP-ID>` first; dispatch with `subagent_type: article-agent`.

```
Plan the figures for one lesson step. Subject: <SUBJECT>. Node: <NODE-ID>. Step: <STEP-ID>.

Follow your article-agent instructions (mode `plan`) exactly: read the live lesson at learn/<SUBJECT>/lessons/<NODE-ID>/<STEP-ID>.html, decide the image count from its Chinese-character length, insert the `<!--image:N-->` marker lines (the only edit you may make to that file), write the plan to that step's plan.input.json, then run the `node src/html-cli.mjs plan --subject <SUBJECT> --node <NODE-ID> --step <STEP-ID>` call to record it.

Report the step id, status (planned / failed / skipped), the image count, and any error message.
```

## Image-prompt

Passed to each generation `task` call. Fill `<SUBJECT>`, `<NODE-ID>` and `<STEP-ID>` first; dispatch with `subagent_type: article-agent`.

```
Generate the planned figures for one lesson step. Subject: <SUBJECT>. Node: <NODE-ID>. Step: <STEP-ID>.

Follow your article-agent instructions (mode `image`) exactly. The CLI calls the .env image provider; do not edit any HTML yourself.

Report the step id, status (done / failed / skipped), the image count, how many were reused, and any error message.
```
