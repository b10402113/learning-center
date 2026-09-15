---
name: absorb
description: Read pending digests, match concepts to nodes, add steps or create nodes. Integrates new source material into the learning graph.
disable-model-invocation: true
argument-hint: "Which subject to absorb? (e.g. /absorb js-reverse [--teach])"
---

Phase 2 of the ingest pipeline. Read digests with `status: pending`, match their concepts against the existing learning graph, and integrate — add steps to existing nodes or create new nodes. Does **not** write step content; that is `/teach`'s job.

Invoke as `/absorb <subject>` or `/absorb <subject> --teach`. The `--teach` flag automatically runs `/teach` on each affected node after absorption.

Prereqs: `learn/<subject>/MEMORY.md` exists, `learn/<subject>/ROADMAP.md` exists, `learn/<subject>/digests/` has at least one `status: pending` digest. If no pending digests exist, say so and stop.

## Step 1 — Collect pending digests

Grep `learn/<subject>/digests/` for `status: pending`. For each pending digest:

1. Read its L1 overview and L2 section detail.
2. Record the digest stem, significant concepts, claims, mechanisms, and source locators.

If no pending digests exist, say so and stop.

## Step 2 — Match pending concepts against the roadmap

Read `learn/<subject>/ROADMAP.md` as the node index. For each significant concept, claim, or mechanism in the pending digests' L2:

1. Scan the roadmap for a node whose `goal` encompasses the concept. Use the one-line goals as the first-pass index; do not load every node container or step file.
2. If a candidate node is found, record the node ID and the matching concept for targeted inspection in Step 3.
3. If no candidate node is found, classify the concept as **new node** for Step 6.

## Step 3 — Inspect only matched nodes

For each candidate node identified in Step 2:

1. Read its node container `learn/<subject>/nodes/<node-id>.mdx` to obtain the current step-DAG, step goals, source list, and prerequisites.
2. Read only the candidate node's referenced step HTML lessons (`learn/<subject>/lessons/<step-id>.html`) to determine whether each matched concept is already covered.
   - **Covered** — the concept appears in an existing step's HTML lesson. Skip it.
   - **Not covered** — the concept belongs to this node's scope but no existing step teaches it. Classify as **node gap**.
3. Read `learn/<subject>/mastery.md` only when mastery ratings are needed to decide depth or placement; otherwise leave it unloaded.

Do not read unrelated node containers, step files, or lessons.

## Step 4 — Classify concepts

The first match wins:

1. **Node gap** — an existing node's goal encompasses the concept, but none of its targeted step HTML lessons cover it → add a step to that node (Step 5).
2. **New node** — no existing node's goal encompasses the concept → create a new node (Step 6).

Prefer node gap over new node. This keeps the graph compact.

## Step 5 — Add step to existing node

For each node gap:

### 5a. Read the current DAG

Load `learn/<subject>/nodes/<node-id>.mdx`. Parse the `steps` frontmatter — every step's `id`, `order`, and `deps`. This is the graph you will modify.

### 5b. Reason the insertion point

Determine where the new step fits in the DAG:

1. Read the node's `goal` and all existing step goals (from `## Steps` reading order in the node container).
2. Decide what the new step teaches relative to existing steps — does it build on an existing step? Extend it? Branch from it?
3. Choose a **deps** set: which existing steps must complete before this new step can begin. Default: the terminal step (the step no other step depends on). Override when the new step logically depends on a specific earlier step.
4. If the new step should be inserted mid-chain (e.g., between step 2 and step 3), re-order the downstream steps. Recalculate all `order` numbers and `deps` references to preserve a valid DAG.

### 5c. Create the skeleton step file

Write `learn/<subject>/nodes/<node-id>/<new-step-id>.mdx`:

```markdown
---
id: <new-step-id>
title: <step title>
subject: <subject>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <step title>

## Learning goal

<one-sentence learner-facing goal>

## Lesson

## Sources
```

Follow the segmented writing protocol from `nodes/SKILL.md`: write skeleton first, then fill sections via `edit`. No lesson content — that is `/teach`'s job.

### 5d. Rewrite the node container

Update `learn/<subject>/nodes/<node-id>.mdx`:

1. Update `steps` frontmatter with the new step and recalculated order/deps.
2. Update `## Steps` reading order — insert the new step link in the correct position.
3. Bump `updated` in frontmatter.
4. Set `status: nodes-written` (rolls back from `content-written` or `edges-written`). Leave as-is if already `draft`/`probed`/`confirmed`/`nodes-written`.

### 5e. Run verify

Run `node scripts/verify.mjs --node <subject>/<node-id>`. Fix each non-zero exit and re-run, up to 3 rounds.

## Step 6 — Create new node

For each new node:

1. Generate a kebab-case `id` derived from the concept name.
2. Write `learn/<subject>/nodes/<node-id>.mdx` as a container — `steps: []`, tier, order, goal, sources, `status: draft`. Use the format from `ROADMAP.md`'s node container template.
3. Update `learn/<subject>/ROADMAP.md`: insert the node into the correct tier and position, adjust order numbers, and update the node count note.
4. The new node enters the standard pipeline: `/probe <subject>/<node-id>` → `/nodes <subject>/<node-id>` → `/teach <subject>/<node-id>` → `/edges <subject>/<node-id>`. Absorb does not run these — it only creates the container.

## Step 7 — Mark digests absorbed

For each digest that contributed at least one concept (step added or node created), update its frontmatter:

- `status: absorbed`
- `absorbed_at: YYYY-MM-DD`

Digests whose concepts were all skipped (already covered) remain `pending` — they may match future nodes.

## Step 8 — Verify

Run `node scripts/verify.mjs --subject <subject>` (whole-subject). Fix each non-zero exit and re-run, up to 3 rounds. After the 3rd round, list any surviving failures.

## Step 9 — Report

Summarise:
- How many digests were processed, how many concepts absorbed vs skipped (already covered).
- How many steps were added to existing nodes (list each node + step).
- How many new nodes were created.
- The verify result (exit status, surviving failures).
- **Next steps**: for each modified node (status `nodes-written`), tell the learner to run `/nodes <subject>/<node-id>` to re-confirm the DAG, then `/teach <subject>/<node-id>` to fill step content. For each new node, the full pipeline applies.

### `--teach` mode

When `--teach` is in the invocation, automatically run `/teach <subject>/<node-id>` for each affected node (modified or new) after Step 9. Skip the learner confirmation between `/nodes` and `/teach` — proceed directly. Report the combined result.

Completion: every processed digest has `status: absorbed`, every new step has a skeleton file and its node has been rolled back to `nodes-written` (or remains `draft` for new nodes), verify passes (or surviving failures are listed), and the learner knows the next stage for each affected node.
