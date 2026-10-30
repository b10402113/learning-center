---
name: roadmap
description: Partition one subject's source material into confirmed lesson nodes along a learner-chosen learning path.
disable-model-invocation: true
argument-hint: "Which subject needs a roadmap?"
---

Build the lesson plan for one subject. A **node** is a `.md` container with one learner-facing goal; its steps are entries in the node's `steps` array, taught in array order. The roadmap plans nodes; it does not write step content.

Prereqs: `learn/<subject>/MEMORY.md` exists (run `/learn-init` first).

1. **Inventory.** Follow the shared `docs/reference/source-reading.md` protocol. Ensure `learn/<subject>/digests/` exists for the subject's material in `sources/<subject>/` — that folder only. For each source, check if a digest with `status: pending` already exists — skip it if so. Build missing digests via parallel sub-agents for large sources (each chunk sub-agent reads `sources/<subject>/` only and does not write outside the digests folder). Small sources: read directly, write the digest yourself. Every new digest must have `status: pending` in its frontmatter.
2. **Read digests and decide their fate.** Read the L1 overviews for all sources. Pull L2 line-map detail lazily when a proposed node needs confirmation that it has enough source support. Every digest ends this run as either `absorbed` (some node teaches it) or `skipped` (deliberately unused); decide which as you partition, not afterwards.
3. **No depth calibration here.** Step depth is decided by `/nodes` from each step's purpose and sources. The roadmap proposes uniform scope — it does not annotate per-node depth and it never prunes content.
4. **Propose learning paths (checkpoint).** From the digests' shape, draft **at least 5 distinct learning paths** through the material, each from a different angle. A path is a lens on the same material — a different front-load, tiering, and ordering — never a renamed copy of one order. Angles to start from: **concept-first** (mental model → rules → practice), **practice-first** (build first, pull concepts on demand), **problem-driven** (organize around questions a learner actually hits), **systems** (organize around how the pieces fit together), **historical** (organize by how ideas emerged), **depth-first** (one thread taken deep at a time). For each path, state the angle, what it optimizes for, and the learner it suits. Ask the learner to pick one before partitioning. Exit options: pick a proposed path; or name a different angle and re-propose once. Do not partition until a path is chosen.
5. **Partition.** Group the material into nodes, organized along the chosen path's angle. Each node must have one learning goal, enough source support for a complete set of steps, and an explicit list of the digests it teaches. A digest may back several nodes. A codebase supplement is listed only when a step will cite its files; its coverage otherwise rides on the text digest. Code digests nobody would teach are the normal `skipped` case — do not invent a node for them. Do not turn every keyword into a node.
6. **Compute the baseline.** `target = clamp(round(total_lines / 1100), 3, 30)` where `total_lines` sums the `.txt` line counts (PDF sources) and `wc -l` counts (codebase sources) recorded in the digests. Use this as the proposal's starting point, not a gate.
7. **Propose and confirm (checkpoint).** Present the full candidate partition — tiered node list with titles, one-line goals, each node's digests, the digests you plan to skip with one-line reasons, and the formula baseline (`target`, and the proposed count) — and ask the learner to confirm before writing anything. Every title must come from a heading or phrase that actually appears in the source material, translated faithfully into Traditional Chinese; check the source when the digest does not preserve the wording. Do not invent a title. Exit options: accept; or give a target count and re-partition once; or manually add/remove specific nodes. Do not write `ROADMAP.md` or containers until this checkpoint passes.
8. **Tier.** Organize nodes from general to specific along the chosen path. Tier 1 establishes the learner's mental model; later tiers add operating rules, mechanisms, implementation order, or practice. Tiers contain nodes.
9. **Write the index.** Write `learn/<subject>/ROADMAP.md`. Every node line is a standard relative Markdown link to `nodes/<node-id>.md` (relative to `ROADMAP.md`), never a wiki link, so it resolves in an editor, on GitHub, and in course-app. Each entry lists the node's goal.
10. **Write node containers.** Create one `learn/<subject>/nodes/<node-id>.md` per node. Frontmatter: `id` (equal to the filename), `title`, `subject`, `tier`, `order`, `status: draft`, `goal`, `digests` (the filenames from `digests/` this node teaches), `prerequisites: []`, `steps: []`, `created`, `updated`. The body is an `# <title>` H1, a short `## Lesson` (2–3 sentences), and a `## Steps` heading waiting for `/nodes`. There is no node-level `sources` field — sources live on step entries.
11. **Resolve digest status.** For every digest this roadmap read: a digest some node teaches becomes `status: absorbed` with `absorbed_at: YYYY-MM-DD`; a digest you deliberately left unused becomes `status: skipped` with a non-empty `skip_reason`. Leaving a digest `pending` makes the subject check fail.
12. **Hand off.** Present the tiered node set. For each node, the next command is `/nodes <subject>/<node-id>`, which confirms the node and writes its `steps` array. Do not require a separate confirmation command.

Completion: the learner picked one of at least 5 proposed learning paths before partitioning; `ROADMAP.md` indexes every proposed node with relative Markdown links; the partition passed the learner checkpoint (count aligned with the formula baseline or deliberately adjusted); every node has one goal and its own `digests` list; every node container exists as a `draft` `.md` file with `steps: []`; every digest is either `absorbed` and listed by at least one node or `skipped` with a reason.

## ROADMAP.md

```markdown
---
subject: <subject>
status: draft # draft → confirmed
path: <chosen learning path, e.g. concept-first>
created: YYYY-MM-DD
---

# ROADMAP — <subject>

## Goal

<from MEMORY.md>

## Learning path

<the chosen path: its angle, what it optimizes for, and how it orders the tiers>

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — <mental model>

1. **[<Node title>](nodes/<node-id>.md)**
   - Goal: <learner-facing outcome>

### Tier 2 — <operating rules>

2. **[<Node title>](nodes/<node-id>.md)**
   - Goal: <learner-facing outcome>

### Tier 3 — <practice>

3. **[<Node title>](nodes/<node-id>.md)**

## Status

- [ ] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
```

## Node container

`learn/<subject>/nodes/<node-id>.md`:

```markdown
---
id: <node-id>
title: "<Node title>"
subject: <subject>
tier: <node tier>
order: <node order>
status: draft
goal: "<learner-facing outcome>"
digests:
  - <digest>.md
prerequisites: []
steps: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Node title>

## Lesson

<2–3 sentences tying the node's steps together.>

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
```
