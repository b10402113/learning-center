---
name: batch-nodes
description: Batch-create a subject's node step-DAGs, teach their lesson content, and optionally rewrite the lessons into illustrated articles or generate the planned figures, via parallel subagents.
disable-model-invocation: true
argument-hint: "/batch-nodes <subject> [tier<N> | node-slug ...] [-max-subagents N] [-gen-article] [-gen-image] [-skip-humanize] [-force]"
---

Bulk-process a subject's nodes through `/nodes -skip-probe` then `/teach -skip-task`, one parallel subagent per node. When asked, two generation phases follow the teaching batches: `-gen-article` rewrites the finished HTML lessons into illustrated articles and plans their figures; `-gen-image` generates those planned figures.

**Invocation modes:**
- `/batch-nodes <subject>` — all nodes in the roadmap.
- `/batch-nodes <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap (e.g. `tier1`, `tier3`).
- `/batch-nodes <subject> <slug> [<slug> ...]` — only the listed nodes.
- `-max-subagents N` — batch width (default 3).
- `-gen-article` — after teaching, rewrite each in-scope step's HTML lesson into an article and plan its figures (one text-model call per step, no image spend).
- `-gen-image` — generate the figures planned for each in-scope step that has a plan (spends image-API money).
- `-skip-humanize` — skip the Humanize step, leaving the lessons as `/teach` or `/to-article` wrote them.
- `-force` — regenerate the generation phases for steps the skip guards would otherwise pass over. With `-gen-image`, this also clears each forced step's cached `output/<node>/<step>/assets/`, since `/to-image` reuses those images rather than re-spending.

The two generation flags are independent: pass both to plan and then generate, or `-gen-image` alone to generate the plans an earlier run left behind.

Prereqs: `learn/<subject>/MEMORY.md`, `learn/<subject>/ROADMAP.md`, and `learn/<subject>/digests/` exist. With either generation flag, the repo root also has `npm install` run and a `.env` holding `TEXT_API_KEY` (and the image API keys for `-gen-image`). If a prerequisite is missing, name it and stop before dispatching anything.

1. **Resolve.** Parse `subject`, `-max-subagents N` (default 3), the flags, and the scope (`tier<N>` | explicit slugs | all) per `docs/reference/skill-scope.md`. Validate each slug's container at `learn/<subject>/nodes/<slug>.mdx`. Nodes already `content-written` or `edges-written` leave the teaching batches but stay in scope for the generation phases. Gate the prereqs here, so a missing key ends the run before any subagent fires.
2. **Teach.** Batch the teaching nodes into groups of `max-subagents`; run batches sequentially and nodes within a batch in parallel. For each batch dispatch one `task` call per node — all calls in one message, each with `subagent_type: teach-agent` so the writing rules (Taiwan Traditional Chinese, plain wording, no AI tells) apply. Each subagent receives [NODES-AND-TEACH-PROMPT](#nodes-and-teach-prompt) with `<NODE-ID>` and `<SUBJECT>` filled in and runs `/nodes` then `/teach` for its node. Wait for every subagent to return, record each outcome, show a progress line, and continue.
3. **Article** (`-gen-article` only). Run the `/to-article` flow (`.opencode/skills/to-article/SKILL.md`) over the resolved scope — one `article-agent` per step runs the rewrite and then the plan, reusing this skill's `-max-subagents`. One delta from that skill: a step whose `illustration` is already `planned` or `done` and which has `output/<node>/<step>/plan.json` is skipped, unless `-force`.
4. **Humanize** (skip with `-skip-humanize`). One `task` call per node, batched by `max-subagents`, with `subagent_type: humanize-agent` and the [Humanize-prompt](#humanize-prompt) filled in. Each call cleans every step HTML file in that node's published `lessons/<node>/` directory; run this after the Article step, so with `-gen-article` it cleans the article Article just planned and without it — Article skipped — it cleans the lesson Teach just wrote. Exactly one humanize-agent per node; `/to-article` itself stays unaware of it.
5. **Image** (`-gen-image` only). Run the `/to-image` flow (`.opencode/skills/to-image/SKILL.md`) over every in-scope step that has a `plan.json` and whose `illustration` is not `done` — one `article-agent` per step, unless `-force`. The flag is the consent: generate without the confirmation prompt.
6. **Report.** Summarise the teaching nodes (completed / failed / skipped, with reasons) and, when run, each generation phase (rewritten / planned / humanized / generated / failed / skipped). List failures with their errors and suggest re-running `/batch-nodes <subject> <failed-slug>`, or running `/edges <subject>/<node-id>` on completed nodes.

Completion: every in-scope node and step was dispatched to its owning subagent (exactly one humanize-agent per node, unless `-skip-humanize`), every subagent returned, every outcome recorded, and the final report delivered.

## Nodes-and-teach-prompt

The prompt below is the complete text passed to each `task` call. Dispatch every call with `subagent_type: teach-agent`. Fill `<NODE-ID>` and `<SUBJECT>` before dispatching.

```
Build the step-DAG and fill lesson content for one node. Node: <SUBJECT>/<NODE-ID>.

You will run two stages sequentially: /nodes (structure) then /teach (content).

### Stage 1 — Structure

Load the /nodes skill via the skill tool (name: "nodes"). Follow it for node <NODE-ID> with skip-probe. This creates the step-DAG, skeleton step files, and node container. The skip-probe flag accepts draft nodes directly and teaches every step deep.

Decide everything autonomously — do not ask questions or wait for confirmation. You own the step-DAG design: choose step count, ids, order, deps, and calibrated depth based on the digests. The /nodes skill's step 5 checkpoint (confirm the DAG with the learner) is skipped: when invoked from batch-nodes the subagent decides autonomously and proceeds directly to step 6.

Stop stage 1 after the node container is written and verified. Proceed immediately to stage 2.

### Stage 2 — Content

Load the /teach skill via the skill tool (name: "teach"). Follow it for node <NODE-ID> with skip-task. The skeleton step files already exist from stage 1 — fill each step's MDX lesson body and generate the HTML lesson files. Skip-task means no check questions, no user confirmation. Write in Taiwan Traditional Chinese per the teach-agent writing rules. Read each step's located source and mark every `<pre>` block's provenance (`docs/reference/source-reading.md` §Source-grounded teaching). Do not run `/zh-tw-humanizer` and do not dispatch any subagents — the batch orchestrator runs the humanize pass itself after you return.

#### Asset verification (mandatory, after all HTML written)

After writing all HTML lesson files, verify assets are present and correctly referenced:

1. **Ensure assets exist.** `learn/<SUBJECT>/lessons/assets/` must contain `shared.css` and `quiz.js`. If either is missing, copy from the canonical source:
   - `shared.css` ← `.opencode/skills/teach/assets/shared.css`
   - `quiz.js` ← `assets/quiz.js` (repo root)
   Do not skip this — HTML lessons will render broken without them.

2. **Verify every HTML file.** For each `.html` file in `learn/<SUBJECT>/lessons/<node-id>/`, confirm:
   - `<head>` contains `<link rel="stylesheet" href="../assets/shared.css">`
   - `</body>` is preceded by `<script src="../assets/quiz.js"></script>`
   If either tag is missing, edit the file to add it. Do not proceed until every HTML file passes both checks.

Workspace context:
- Subject root: learn/<SUBJECT>/
- Node container: learn/<SUBJECT>/nodes/<NODE-ID>.mdx
- Step files: learn/<SUBJECT>/nodes/<NODE-ID>/
- MEMORY.md: learn/<SUBJECT>/MEMORY.md
- Digests: learn/<SUBJECT>/digests/
- Step sources: each step's `sources` locators (read the located slice; `docs/reference/source-reading.md` §Source-grounded teaching)
- Canonical shared.css: .opencode/skills/teach/assets/shared.css
- Canonical quiz.js: assets/quiz.js

Report back: step count, DAG confirmed, skeleton files created, which steps completed, lesson character counts, asset check result (files verified, any fixes applied), any errors or missing sources.
```

## Humanize-prompt

Run this one `task` call per node in the Humanize step; dispatch every call with `subagent_type: humanize-agent`. Fill `<NODE-ID>` and `<SUBJECT>` before dispatching.

```
Run /zh-tw-humanizer over the step HTML lessons of one node. Subject: <SUBJECT>. Node: <NODE-ID>.

Target directory: learn/<SUBJECT>/lessons/<NODE-ID>/

Process every `.html` file in that directory, one file at a time. For each file, follow your humanize-agent instructions exactly: load the `zh-tw-humanizer` skill, run it in 非互動「跳過確認、事後摘要」mode, change only the Chinese prose, and preserve all HTML markup, code, links, quiz markup and marker lines byte-for-byte. Do not touch files outside this node's directory.

Report per file: filename, edit count, one-line summary; then any errors.
```

