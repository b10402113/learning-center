---
name: reset-nodes
description: 把某個 subject 的 node（或 tier 下的 nodes）重設回 nodes-written，刪掉已產生的課程內容，只留 node container .mdx，方便重跑 batch-nodes 或換模型重生內容。
disable-model-invocation: true
argument-hint: "/reset-nodes <subject> [tier<N> | node-slug ...] [-dry-run] [-skip-ask]"
---

Reset one or more nodes back to `nodes-written` and clear their generated content, so `/batch-nodes` (or `/teach` with another model) can rebuild it. The node container `.mdx` — DAG, reading order, main lesson, sources — is kept; everything the content stages produced is removed.

**Invocation modes:**
- `/reset-nodes <subject>` — every node in the roadmap.
- `/reset-nodes <subject> tier<N>` — every node under `### Tier <N>` in the roadmap (e.g. `tier1`).
- `/reset-nodes <subject> <slug> [<slug> ...]` — only the listed nodes.
- `-dry-run` — list what would change, touch nothing.
- `-skip-ask` — skip the confirmation prompt.

Prereqs: `learn/<subject>/ROADMAP.md` and `learn/<subject>/nodes/` exist. If either is missing, name it and stop.

1. **Resolve.** Parse `subject` and the scope per `docs/reference/skill-scope.md`. Validate each resolved node has a container at `learn/<subject>/nodes/<slug>.mdx`.

2. **Confirm.** Show the resolved nodes and say what happens to each: status → `nodes-written`, the node container kept, and `nodes/<node>/` (step files), `lessons/<node>/` (HTML + `<step>-assets/`), `output/<node>/` (article working files) removed. Ask the learner to confirm. Skip this step with `-skip-ask`.

3. **Reset.** Run the deterministic reset once for all resolved nodes:

   `node scripts/reset-nodes.mjs --subject <subject> --node <slug> [--node <slug> ...]`

   Add `--dry-run` when the learner passed `-dry-run`. The script owns the file surgery — do not edit the files by hand.

4. **Report.** Per node: status reset and what was removed. State that `mastery.md`, `digests/`, `elements/`, and the shared `lessons/assets/` are untouched, and that `node scripts/verify.mjs` will flag `dag-step-exists` until `/nodes` (or `/batch-nodes`) recreates the step files. Point to the next command: `/batch-nodes <subject> <slug>`.

Completion: every resolved node reports `status: nodes-written` with its step, lessons, and output directories removed, and the report is delivered.

## What is kept and what is removed

| Artifact | Action |
| --- | --- |
| `nodes/<node>.mdx` | kept; `status` → `nodes-written`, `updated` refreshed |
| `nodes/<node>/<step>.mdx` | removed |
| `lessons/<node>/<step>.html`, `lessons/<node>/<step>-assets/` | removed |
| `output/<node>/` (rewritten HTML, plans, manifests, assets) | removed |
| `lessons/assets/`, `mastery.md`, `digests/`, `elements/`, `ROADMAP.md` | untouched |
