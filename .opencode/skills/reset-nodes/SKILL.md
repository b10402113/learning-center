---
name: reset-nodes
description: Reset nodes to the confirmed plan: keep the node container, replace generated articles with H1 skeletons, and delete their figures.
disable-model-invocation: true
argument-hint: "/reset-nodes <subject> [tier<N> | <node-id> ...] [-dry-run] [-skip-ask]"
---

Invoke as `/reset-nodes <subject> [tier<N> | <node-id> ...] [-dry-run] [-skip-ask]`.

Reset nodes to the state `/nodes` leaves behind: status `confirmed`, node container intact, every step a bare `# <title>` skeleton, no figures. That is the trigger state `/article` regenerates from — use it to rebuild a node with a different model or after the plan changed.

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

2. **Confirm.** Show each resolved node and its transition to `confirmed`, and what disappears: article bodies become `# <title>` skeletons, `<step>-assets/` folders are removed. State what survives: the node container, roadmap, MEMORY, digests, edges, and every other node. Ask the learner to confirm; skip with `-skip-ask`.

3. **Reset.** Re-run the same command without `--dry-run`. The script owns the file surgery — never delete or rewrite files by hand.

4. **Verify and report.** Run `node scripts/verify.mjs --node <subject>/<node-id>` for each reset node. Report per node: status, articles reset, asset folders removed, verify exit. Point to the next command: `/article <subject>/<node-id>`.

Completion: every resolved node is `confirmed` with its step skeletons restored, no generated body or `-assets/` remains, `verify` exits 0 for each node, and the next command is named.

## Kept and removed

| Artifact | Action |
| --- | --- |
| `nodes/<node>.md` | kept; `status` → `confirmed`, `updated` refreshed |
| `nodes/<node>/<step>.md` | body replaced by `# <title>` |
| `nodes/<node>/<step>-assets/` | removed |
| orphan files in `nodes/<node>/` | removed |
| `ROADMAP.md`, `MEMORY.md`, `digests/`, `edges/`, other nodes | untouched |

A `draft` node has no steps to reset; it is reported and skipped.
