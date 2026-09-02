---
name: batch-nodes
description: Batch-create step-DAGs and teach content for all nodes in a subject via parallel subagents.
disable-model-invocation: true
argument-hint: "/batch-nodes <subject> [-max-subagents N] [node-slug ...]"
---

Bulk-process every node in a subject through `/nodes -skip-probe` then `/teach -skip-task`, dispatching parallel subagents in **batches**. Nodes and teach are separate phases — each subagent handles one concern only. Invoke as `/batch-nodes <subject>` or `/batch-nodes <subject> -max-subagents 5`. Optionally pass specific node slugs to process a subset.

Prereqs: `learn/<subject>/MEMORY.md` exists, `learn/<subject>/ROADMAP.md` exists, `learn/<subject>/digests/` exists. If any is missing, say so and stop.

1. **Resolve.** Parse arguments: extract `subject` (first positional arg), `-max-subagents N` (default 3), and optional node slugs. When no slugs given, read `learn/<subject>/ROADMAP.md` and extract every node id from `[[learn/<subject>/nodes/<node-id>|...]]` links in tier order. Validate each slug has a container at `learn/<subject>/nodes/<slug>.mdx`. Skip nodes whose status is already `content-written` or `edges-written` — report them as skipped.
2. **Phase 1 — Structure.** Partition the resolved node list into batches of size `max-subagents`. Process batches sequentially; nodes within a batch run in parallel. For each batch, launch one subagent per node via the `task` tool — all calls in a single message. Each subagent receives [NODES-PROMPT](#nodes-prompt) with `<NODE-ID>` and `<SUBJECT>` filled in. Wait for every subagent to return. Record each node's outcome: structure-succeeded or failed. Show a progress line after each batch. After all batches, report phase 1 totals and list failures.
3. **Phase 2 — Content.** Take only the nodes that succeeded in phase 1. Partition into batches of size `max-subagents`. For each batch, launch one subagent per node — all calls in a single message. Each subagent receives [TEACH-PROMPT](#teach-prompt) with `<NODE-ID>` and `<SUBJECT>` filled in. Wait for every subagent to return. Record outcomes — a node is content-succeeded only if its report confirms both lesson writes and asset verification passed. Show a progress line after each batch.
4. **Report.** Summarise: total completed (both phases), total failed (per phase), total skipped. List any failed nodes with their errors and which phase failed. Suggest re-running `/batch-nodes <subject> <failed-slug>` for failures, or running `/edges <subject>/<node-id>` on completed nodes.

Completion: every non-skipped node was dispatched through both phases, every subagent returned, outcomes recorded, and the final report delivered.

## Nodes-prompt

The prompt below is the complete text passed to each phase-1 `task` call. Fill `<NODE-ID>` and `<SUBJECT>` before dispatching.

```
Create the step-DAG and skeleton step files for one node. Node: <SUBJECT>/<NODE-ID>.

Load the /nodes skill via the skill tool (name: "nodes"). Follow it for node <NODE-ID> with skip-probe. This creates the step-DAG, skeleton step files, and node container. The skip-probe flag accepts draft nodes directly and teaches every step deep.

Do not teach content or write lesson bodies — that is a separate phase. Stop after the node container is written and verified.

Workspace context:
- Subject root: learn/<SUBJECT>/
- Node container: learn/<SUBJECT>/nodes/<NODE-ID>.mdx
- MEMORY.md: learn/<SUBJECT>/MEMORY.md
- Digests: learn/<SUBJECT>/digests/

Report back: step count, DAG confirmed, skeleton files created, script result, any errors.
```

## Teach-prompt

The prompt below is the complete text passed to each phase-2 `task` call. Fill `<NODE-ID>` and `<SUBJECT>` before dispatching.

```
Fill lesson content for one node's step files. Node: <SUBJECT>/<NODE-ID>.

Load the /teach skill via the skill tool (name: "teach"). Follow it for node <NODE-ID> with skip-task. The skeleton step files already exist from the /nodes phase — fill each step's MDX lesson body and generate the HTML lesson files. Skip-task means no check questions, no user confirmation.

### Asset verification (mandatory, after all HTML written)

After writing all HTML lesson files, verify assets are present and correctly referenced:

1. **Ensure assets exist.** `learn/<SUBJECT>/lessons/assets/` must contain `shared.css` and `quiz.js`. If either is missing, copy from the canonical source:
   - `shared.css` ← `.opencode/skills/teach/assets/shared.css`
   - `quiz.js` ← `assets/quiz.js` (repo root)
   Do not skip this — HTML lessons will render broken without them.

2. **Verify every HTML file.** For each `.html` file in `learn/<SUBJECT>/lessons/`, confirm:
   - `<head>` contains `<link rel="stylesheet" href="./assets/shared.css">`
   - `</body>` is preceded by `<script src="./assets/quiz.js"></script>`
   If either tag is missing, edit the file to add it. Do not proceed to the next step until every HTML file passes both checks.

Workspace context:
- Subject root: learn/<SUBJECT>/
- Node container: learn/<SUBJECT>/nodes/<NODE-ID>.mdx
- Step files: learn/<SUBJECT>/nodes/<NODE-ID>/
- MEMORY.md: learn/<SUBJECT>/MEMORY.md
- Digests: learn/<SUBJECT>/digests/
- Canonical shared.css: .opencode/skills/teach/assets/shared.css
- Canonical quiz.js: assets/quiz.js

Report back: which steps completed, lesson character counts, asset check result (files verified, any fixes applied), any errors or missing sources.
```
