---
name: to-article
description: 把既有 step HTML 課程改寫成圖文並茂的文章（只改寫與規劃配圖，不花錢生圖）。
disable-model-invocation: true
argument-hint: "/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N]"
---

Rewrite the HTML lessons of a subject's steps into readable illustrated articles, planning where images go but **not generating them**. Each step's rewritten HTML replaces `learn/<subject>/lessons/<node>/<step>.html`; the image plan is written to `learn/<subject>/output/<node>/<step>/plan.json`. A later `/to-image` spends the money.

**Invocation modes:**
- `/to-article <subject>` — all nodes in the roadmap.
- `/to-article <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap (e.g. `tier1`).
- `/to-article <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3) to any mode.

Prereqs: `learn/<subject>/MEMORY.md` and `learn/<subject>/ROADMAP.md` exist; the repo root has `npm install` run and a `.env` with `TEXT_API_KEY` (see `.env.example`). If any is missing, say so and stop.

1. **Resolve.** Parse `subject`, `-max-subagents N`, and the scope per `docs/reference/skill-scope.md`. Within each resolved node, collect every step id from the container's `steps` DAG. Drop steps whose `learn/<subject>/lessons/<node>/<step>.html` is missing; report them as skipped.
2. **Process.** Batch and dispatch per `docs/reference/skill-scope.md`, filling `<SUBJECT>` and `<NODE-ID>` into [Article-prompt](#article-prompt). Record rewritten / failed / skipped per step.
3. **Report.** Summarise: steps rewritten, steps failed, steps skipped (with reasons). List failed steps and suggest re-running `/to-article <subject> <node-slug>`. Remind the learner to review the rewritten HTML before running `/to-image`.

Completion: every resolved step with an HTML lesson was dispatched to a subagent, every subagent returned, each step reports rewritten / failed / skipped, and the final report is delivered.

## Article-prompt

The prompt below is the complete text passed to each `task` call. Dispatch with `subagent_type: teach-agent`. Fill `<SUBJECT>` and `<NODE-ID>` before dispatching.

```
Rewrite the HTML lessons of one node into illustrated articles. Subject: <SUBJECT>. Node: <NODE-ID>.

Work from the repo root. For each step id in learn/<SUBJECT>/nodes/<NODE-ID>.mdx's `steps` DAG, in order:

1. Confirm the step has an HTML lesson at learn/<SUBJECT>/lessons/<NODE-ID>/<step-id>.html. If not, record it as skipped and continue.
2. Prepare the article: run
   node src/html-cli.mjs clean --subject <SUBJECT> --node <NODE-ID> --step <step-id>
   The command prints JSON with `outDir`, `original`, `cleaned` and `plan` paths, and writes the cleaned body to the `cleaned` path.
3. Read the `cleaned` file. It is the lesson body with quiz, lesson-nav, footer and script already removed.
4. Decide the image plan yourself: read the cleaned article and pick the 1–5 places where an illustration most helps a reader. Spread them across the article instead of clustering. For each chosen place produce an object with:
   - heading: the section heading it belongs to
   - anchor: a short verbatim sentence from the cleaned article that locates the place
   - prompt: what the illustration should convey (Traditional Chinese)
   Write the ordered array as JSON to the `plan` path (create parent directories if needed).
5. Run
   node src/html-cli.mjs article --subject <SUBJECT> --node <NODE-ID> --step <step-id>
   This makes exactly one text-model call, rewrites the body, validates that every code block and link survives and that every image marker is present and in order, then writes the article back to learn/<SUBJECT>/lessons/<NODE-ID>/<step-id>.html with visible "配圖 N 待生成" placeholder boxes.
6. If the command fails, do not retry automatically and do not edit the lesson HTML by hand. Record the step as failed with the error message and continue to the next step.

Do not generate any images — that is /to-image's job. Do not edit other files.

Report back per step: the step id, status (rewritten / failed / skipped), the image count planned, and any error message. Also report the node's step list and the total rewritten / failed / skipped counts.
```
