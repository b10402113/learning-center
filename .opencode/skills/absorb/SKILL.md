---
name: absorb
description: Read pending digests, match concepts to nodes, and append steps or create nodes in the Markdown learning graph.
disable-model-invocation: true
argument-hint: "Which subject to absorb? (e.g. /absorb agent-harness)"
---

Phase 2 of the ingest pipeline. Read digests with `status: pending`, match their concepts against the existing learning graph, and integrate — append steps to existing nodes or create new nodes. Does **not** write article prose; `/article` does.

Invoke as `/absorb <subject>`.

Prereqs: `learn/<subject>/MEMORY.md` exists, `learn/<subject>/ROADMAP.md` exists, `learn/<subject>/digests/` has at least one `status: pending` digest. If no pending digests exist, say so and stop.

## Step 1 — Collect pending digests

Grep `learn/<subject>/digests/` for `status: pending`. For each pending digest:

1. Read its L1 overview and L2 `#Lx-Ly` line map.
2. Record the digest stem, significant concepts, claims, mechanisms, and source line ranges.

If no pending digests exist, say so and stop.

## Step 2 — Match pending concepts against the roadmap

Read `learn/<subject>/ROADMAP.md` as the node index. For each significant concept, claim, or mechanism in the pending digests' L2:

1. Scan the roadmap for a node whose `goal` encompasses the concept. Use the one-line goals as the first-pass index; do not load every node container.
2. If a candidate node is found, record the node id and the matching concept for targeted inspection in Step 3.
3. If no candidate node is found, classify the concept as **new node** for Step 5.

## Step 3 — Inspect only matched nodes

For each candidate node:

1. Read `learn/<subject>/nodes/<node-id>.md` to obtain the current `steps` array, each step's purpose, and its sources.
2. Read only the candidate node's step articles (`learn/<subject>/nodes/<node-id>/<step-id>.md`) when they have a body.
   - **Covered** — the concept appears in an existing step's purpose or article. Skip it.
   - **Not covered** — the concept belongs to this node's scope but no existing step teaches it. Classify as **node gap**.
3. Do not read unrelated node containers or articles.

## Step 4 — Classify concepts

The first match wins:

1. **Node gap** — an existing node's goal encompasses the concept, but no step covers it → append a step to that node (Step 5).
2. **New node** — no existing node's goal encompasses the concept → create a new node (Step 6).

Prefer node gap over new node. This keeps the graph compact.

## Step 5 — Append a step to an existing node

For each node gap:

### 5a. Read the current plan

Load `learn/<subject>/nodes/<node-id>.md`. Parse the ordered `steps` array — this is the plan you will extend.

### 5b. Decide the position

1. Read the node's `goal` and every existing step's `title` + `purpose`.
2. Decide where the new step belongs in the teaching order: after the last step by default, or inserted where it logically builds on an earlier step.
3. The new step needs a unique kebab-case `id`, a `title`, a **one-sentence purpose (≤ 120 characters)**, and one or more `[[sources/<subject>/<file>#Lx-Ly]]` line ranges from the new digest.

### 5c. Write the step entry

Insert the step object into the `steps` array at the chosen position. Array order is teaching order; never add `deps`, `type`, or `order`.

### 5d. Create the article skeleton

Write `learn/<subject>/nodes/<node-id>/<new-step-id>.md` containing only:

```markdown
# <step title>
```

### 5e. Update the `## Steps` list

Insert the matching relative link at the same position:

```markdown
3. [<Step title>](<node-id>/<new-step-id>.md)
```

### 5f. Update the node status

Set `status: confirmed` (even if it was `written`), bump `updated`, and leave the existing articles untouched. The node now has one unwritten step.

## Step 6 — Create a new node

For each new node:

1. Generate a kebab-case `id` from the concept name.
2. Write `learn/<subject>/nodes/<node-id>.md` with `status: draft`, `steps: []`, a one-sentence `goal`, `prerequisites: []`, an `# <title>` H1, a short `## Lesson`, and an empty `## Steps` heading. Use the container contract in `.opencode/skills/nodes/NODE-FORMAT.md`.
3. Insert a standard relative Markdown link into `learn/<subject>/ROADMAP.md` in the correct tier and position: `**[<Node title>](nodes/<node-id>.md)**`.
4. The new node enters the standard pipeline: `/nodes <subject>/<node-id>` → `/article <subject>/<node-id>`. Absorb does not run these — it only creates the container.

## Step 7 — Mark digests absorbed

For each digest that contributed at least one concept (step appended or node created), update its frontmatter:

- `status: absorbed`
- `absorbed_at: YYYY-MM-DD`

Digests whose concepts were all skipped (already covered) remain `pending` — they may match future nodes.

## Step 8 — Verify

Run `node scripts/verify.mjs --subject <subject>`. Fix each failure and re-run, up to 3 rounds. After the 3rd round, list any surviving failures.

## Step 9 — Report

Summarise:
- How many digests were processed, how many concepts absorbed vs skipped (already covered).
- Which steps were appended to which nodes.
- Which new nodes were created.
- The verify result (exit status, surviving failures).
- **Next steps**: for each modified node, run `/article <subject>/<node-id>` to write the new step; for each new node, run `/nodes` first.

Completion: every contributing digest is `absorbed`, every appended step has an entry in the node's `steps` array, a skeleton article, and a matching `## Steps` link, every modified node is `confirmed`, and verify passes (or surviving failures are listed).
