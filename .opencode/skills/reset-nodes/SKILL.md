---
name: reset-nodes
description: Reset nodes to the confirmed plan: keep the node container and step plan, remove article titles, replace generated articles with empty skeletons, and delete their figures.
disable-model-invocation: true
argument-hint: "/reset-nodes <subject> [tier<N> | <node-id> ...] [-dry-run] [-skip-ask]"
---

Invoke as `/reset-nodes <subject> [tier<N> | <node-id> ...] [-dry-run] [-skip-ask]`.

Reset nodes to the state `/nodes` leaves behind: status `confirmed`, node container intact, step titles removed, every step an empty skeleton, no figures. It also clears the node's intermediate `output/` artifacts (material bundles, job files, image plans, polish records, legacy humanize records and workspaces, article-agent run folders, quiz candidates) so a later `/article` run starts fresh instead of resurrecting old articles. That is the trigger state `/article` regenerates from — use it to rebuild a node with a different model or after the plan changed.

**Scope**

- `<subject>` — every node in the roadmap.
- `tier<N>` — every node linked under `### Tier <N>` in `ROADMAP.md` (for example `tier2`).
- `<node-id> ...` — only the listed nodes.
- `-dry-run` — preview; touch nothing.
- `-skip-ask` — skip the confirmation.

Prereqs: `learn/<subject>/ROADMAP.md` and `learn/<subject>/nodes/` exist. If either is missing, name it and stop.

1. **Preview.** Translate the scope into one script call and add `--dry-run`:

   ```bash
   node scripts/reset-nodes.mjs --subject <subject> --all --dry-run
   node scripts/reset-nodes.mjs --subject <subject> --tier <n> --dry-run
   node scripts/reset-nodes.mjs --subject <subject> --node <id> [--node <id> ...] --dry-run
   ```

   The script resolves the roadmap and validates every node container. A missing container or tier fails before anything changes. If the learner passed `-dry-run`, stop here.

2. **Confirm.**    Show each resolved node and its transition to `confirmed`, and what disappears: article bodies become empty skeletons and step titles are removed from the plan, `<step>-assets/` folders are removed, and the node's `output/` artifacts (material bundles, job files, image plans, article-agent run folders, quiz candidates) are deleted. State what survives: the node container, roadmap, MEMORY, digests, edges, and every other node. Ask the learner to confirm; skip with `-skip-ask`.

3. **Reset.** Re-run the same command without `--dry-run`. The script owns the file surgery — never delete or rewrite files by hand.

4. **Verify and report.** Run `node scripts/verify.mjs --node <subject>/<node-id>` for each reset node. Report per node: status, articles reset, asset folders removed, verify exit. Point to the next command: `/article <subject>/<node-id>`.

Completion: every resolved node is `confirmed` with empty step skeletons restored and no step titles left, no generated body or `-assets/` remains, `verify` exits 0 for each node, and the next command is named.

## Kept and removed

| Artifact | Action |
| --- | --- |
| `nodes/<node>.md` | kept; step `title` fields removed, `status` → `confirmed`, `updated` refreshed |
| `nodes/<node>/<step>.md` | emptied |
| `nodes/<node>/<step>-assets/` | removed |
| orphan files in `nodes/<node>/` | removed |
| `output/materials/<node>/<step>.json` | removed |
| `output/image-plans/<node>/<step>.json` | removed |
| `output/jobs/<node>/` (`prepare.json`, `<step>/<step>.*`, incl. legacy `*.plan.json`) and pre-`<node>/<step>/` flat `<subject>-<node>-*` files | removed |
| `output/polished/<node>/<step>.json` | removed |
| `output/humanized/<node>/<step>.json` | removed (legacy) |
| `output/humanize/<node>/<step>/` | removed (legacy) |
| `output/quiz-candidates/<node>/` | removed |
| `output/article_<timestamp>_*` folders referenced by the node's `result.json` | removed |
| `ROADMAP.md`, `MEMORY.md`, `digests/`, `edges/`, other nodes | untouched |

A `draft` node has no steps to reset; it is reported and skipped.
