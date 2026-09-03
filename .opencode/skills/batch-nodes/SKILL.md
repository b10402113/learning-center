---
name: batch-nodes
description: Batch-create step-DAGs and teach content for nodes in a subject via parallel subagents. Supports all nodes, a single tier, or explicit node slugs.
disable-model-invocation: true
argument-hint: "/batch-nodes <subject> [tier<N> | node-slug ...] [-max-subagents N]"
---

Bulk-process nodes in a subject through `/nodes -skip-probe` then `/teach -skip-task`, dispatching parallel subagents in **batches**. Each subagent handles both structure and content for its node — `/nodes` first, then `/teach`, sequentially within the same subagent.

**Invocation modes:**
- `/batch-nodes <subject>` — all nodes in the roadmap.
- `/batch-nodes <subject> tier<N>` — all nodes under `### Tier <N>` in the roadmap (e.g. `tier1`, `tier3`).
- `/batch-nodes <subject> <slug> [<slug> ...]` — only the listed nodes.
- Append `-max-subagents N` (default 3) to any mode to control batch width.

Prereqs: `learn/<subject>/MEMORY.md` exists, `learn/<subject>/ROADMAP.md` exists, `learn/<subject>/digests/` exists. If any is missing, say so and stop.

1. **Resolve.** Parse arguments: extract `subject` (first positional arg), `-max-subagents N` (default 3), and the **scope** — one of:
   - **tier** — an arg matching `tier<N>` (e.g. `tier1`, `tier3`). Read `learn/<subject>/ROADMAP.md`, locate the `### Tier <N> — ...` heading, and extract node ids from `[[learn/<subject>/nodes/<node-id>|...]]` links under that heading until the next `### Tier` heading or end of file.
   - **explicit slugs** — one or more args that are not `tier<N>` and not `-max-subagents`. Use them as-is.
   - **all** — no scope args. Read `learn/<subject>/ROADMAP.md` and extract every node id from `[[learn/<subject>/nodes/<node-id>|...]]` links in tier order.

   Validate each resolved slug has a container at `learn/<subject>/nodes/<slug>.mdx`. Skip nodes whose status is already `content-written` or `edges-written` — report them as skipped.
2. **Process.** Partition the resolved node list into batches of size `max-subagents`. Process batches sequentially; nodes within a batch run in parallel. For each batch, launch one subagent per node via the `task` tool — all calls in a single message. Each subagent receives [NODES-AND-TEACH-PROMPT](#nodes-and-teach-prompt) with `<NODE-ID>` and `<SUBJECT>` filled in. The subagent runs `/nodes` then `/teach` sequentially for its node. Wait for every subagent to return. Record each node's outcome: succeeded (both structure and content written, asset verification passed) or failed. Show a progress line after each batch.
3. **Report.** Summarise: total completed, total failed, total skipped. List any failed nodes with their errors and which part failed (structure or content). Suggest re-running `/batch-nodes <subject> <failed-slug>` for failures, or running `/edges <subject>/<node-id>` on completed nodes.

Completion: every non-skipped node was dispatched to a subagent, every subagent returned, outcomes recorded, and the final report delivered.

## Nodes-and-teach-prompt

The prompt below is the complete text passed to each `task` call. Fill `<NODE-ID>` and `<SUBJECT>` before dispatching.

```
Build the step-DAG and fill lesson content for one node. Node: <SUBJECT>/<NODE-ID>.

You will run two stages sequentially: /nodes (structure) then /teach (content).

### Stage 1 — Structure

Load the /nodes skill via the skill tool (name: "nodes"). Follow it for node <NODE-ID> with skip-probe. This creates the step-DAG, skeleton step files, and node container. The skip-probe flag accepts draft nodes directly and teaches every step deep.

Decide everything autonomously — do not ask questions or wait for confirmation. You own the step-DAG design: choose step count, ids, order, deps, and calibrated depth based on the digests. The /nodes skill's step 5 checkpoint (confirm the DAG with the learner) is skipped: when invoked from batch-nodes the subagent decides autonomously and proceeds directly to step 6.

Stop stage 1 after the node container is written and verified. Proceed immediately to stage 2.

### Stage 2 — Content

Load the /teach skill via the skill tool (name: "teach"). Follow it for node <NODE-ID> with skip-task. The skeleton step files already exist from stage 1 — fill each step's MDX lesson body and generate the HTML lesson files. Skip-task means no check questions, no user confirmation.

#### Asset verification (mandatory, after all HTML written)

After writing all HTML lesson files, verify assets are present and correctly referenced:

1. **Ensure assets exist.** `learn/<SUBJECT>/lessons/assets/` must contain `shared.css` and `quiz.js`. If either is missing, copy from the canonical source:
   - `shared.css` ← `.opencode/skills/teach/assets/shared.css`
   - `quiz.js` ← `assets/quiz.js` (repo root)
   Do not skip this — HTML lessons will render broken without them.

2. **Verify every HTML file.** For each `.html` file in `learn/<SUBJECT>/lessons/`, confirm:
   - `<head>` contains `<link rel="stylesheet" href="./assets/shared.css">`
   - `</body>` is preceded by `<script src="./assets/quiz.js"></script>`
   If either tag is missing, edit the file to add it. Do not proceed until every HTML file passes both checks.

Workspace context:
- Subject root: learn/<SUBJECT>/
- Node container: learn/<SUBJECT>/nodes/<NODE-ID>.mdx
- Step files: learn/<SUBJECT>/nodes/<NODE-ID>/
- MEMORY.md: learn/<SUBJECT>/MEMORY.md
- Digests: learn/<SUBJECT>/digests/
- Canonical shared.css: .opencode/skills/teach/assets/shared.css
- Canonical quiz.js: assets/quiz.js

Report back: step count, DAG confirmed, skeleton files created, which steps completed, lesson character counts, asset check result (files verified, any fixes applied), any errors or missing sources.
```
