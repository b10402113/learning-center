---
name: roadmap
description: Partition one subject's source material into confirmed lesson nodes along a learner-chosen learning path.
disable-model-invocation: true
argument-hint: "Which subject needs a roadmap?"
---

Build the lesson plan for one subject. A **node** is a step-DAG — a set of step lessons with one learner-facing goal. The roadmap plans nodes; it does not extract canonical elements or write detailed explanations.

Prereqs: `learn/<subject>/MEMORY.md` exists (run `/learn-init` first). The probe now runs _after_ the roadmap, per node — there is no mastery to calibrate from here, so the roadmap proposes uniform depth and `/nodes` refines it per node from that node's probe.

1. **Inventory.** Follow the shared `docs/reference/source-reading.md` protocol. Ensure `learn/<subject>/digests/` exists for the subject's material in `sources/<subject>/` — that folder only. For each source, check if a digest with `status: pending` already exists — skip it if so. Build missing digests via parallel sub-agents for large sources (each chunk sub-agent reads `sources/<subject>/` only and does not write outside the digests folder). Small sources: read directly, write the digest yourself. Every new digest must have `status: pending` in its frontmatter.
2. **Read digests.** Read the L1 overviews (and compact TOC lines) for all sources. Pull L2 section detail lazily when a proposed node needs confirmation that it has enough source support.
3. **No depth calibration here.** Depth is deferred: `/probe <subject>/<node-id>` runs after the roadmap, per node, and `/nodes` reads that node's mastery entry to calibrate step depth. The roadmap proposes uniform depth — it does not annotate per-node depth and it never prunes content.
4. **Propose learning paths (checkpoint).** From the digests' shape, draft **at least 5 distinct learning paths** through the material, each from a different angle. A path is a lens on the same material — a different front-load, tiering, and ordering — never a renamed copy of one order. Angles to start from: **concept-first** (mental model → rules → practice), **practice-first** (build first, pull concepts on demand), **problem-driven** (organize around questions a learner actually hits), **systems** (organize around how the pieces fit together), **historical** (organize by how ideas emerged), **depth-first** (one thread taken deep at a time). For each path, state the angle, what it optimizes for, and the learner it suits. Ask the learner to pick one before partitioning. Exit options: pick a proposed path; or name a different angle and re-propose once. Do not partition until a path is chosen.
5. **Partition.** Group the material into nodes, organized along the chosen path's angle. Each node must have one learning goal and enough source support for a complete lesson. A node may later use several elements across its steps. Do not turn every keyword into a roadmap element.
6. **Compute the baseline.** `target = clamp(round(total_lines / 500), 3, 30)` where `total_lines` is the pdftotext line count across the subject's sources. Use this as the proposal's starting point, not a gate.
7. **Propose and confirm (checkpoint).** Present the full candidate partition — tiered node list with titles, one-line goals, and the formula baseline (`target`, and the proposed count) — and ask the learner to confirm before writing anything. Exit options: accept; or give a target count and re-partition once; or manually add/remove specific nodes. Do not write `ROADMAP.md` or containers until this checkpoint passes.
8. **Tier.** Organize nodes from general to specific along the chosen path. Tier 1 establishes the learner's mental model; later tiers add operating rules, mechanisms, implementation order, or practice. Tiers contain nodes, never extracted elements.
9. **Write the index.** Write `learn/<subject>/ROADMAP.md` with the tiered node index, subject goal, node order, goals, source references, and the chosen path. Do not include a tiered element list or per-node depth.
10. **Write node containers.** Create one `learn/<subject>/nodes/<node-id>.mdx` per node. Include its tier and order, metadata, learning goal, source references, and empty `Steps` (step-DAG) and `Lesson` sections. Set each node status to `draft`.
11. **Mark digests absorbed.** For every digest that was read during this roadmap (all `status: pending` digests for this subject), update its frontmatter to `status: absorbed` and `absorbed_at: YYYY-MM-DD`. The roadmap has consumed these digests — their content is now reflected in the node plan.
12. **Hand off.** Present the tiered node set. For each node, the learner first runs `/probe <subject>/<node-id>` (measures that node's mastery — a hard gate) and then `/nodes <subject>/<node-id>`, which confirms the node and reasons out its step-DAG before writing step articles. Do not require a separate confirmation command.

Completion: the learner picked one of at least 5 proposed learning paths before partitioning; `ROADMAP.md` indexes every proposed node (with no per-node depth — that is determined at `/nodes` time from each node's probe) and records the chosen path; the partition passed the learner checkpoint (count aligned with the formula baseline or deliberately adjusted); every node has one goal and traceable sources; every node container exists as `draft`; all digests consumed by the roadmap have `status: absorbed`; and each node becomes `probed` via `/probe` then `confirmed` via `/nodes`. No node or area was pruned.

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

Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — <mental model>

1. **[[learn/<subject>/nodes/<node-id>|<Node title>]]**
   - Goal: <learner-facing outcome>
   - Sources:
     - [[sources/<subject>/<file>#<section>]]
     - [[sources/<subject>/<file>#<section>]]

### Tier 2 — <operating rules>

2. **[[learn/<subject>/nodes/<node-id>|<Node title>]]**
   - Goal: <learner-facing outcome>
   - Sources:
     - [[sources/<subject>/<file>#<section>]]

### Tier 3 — <practice>

3. **[[learn/<subject>/nodes/<node-id>|<Node title>]]**

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
```

## Node container

```markdown
---
id: <node-id>
title: <Node title>
subject: <subject>
tier: <node tier>
order: <node order>
status: draft
goal: <learner-facing outcome>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
steps: []
prerequisites: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Node title>

## Learning goal

<learner-facing outcome>

## Steps

{/_ /nodes fills this step-DAG — step ids + order + deps — and gets confirmation. _/}

## Lesson

{/_ /nodes writes the main lesson here; step articles live under this node's folder. _/}

## Sources

- [[sources/<subject>/<file>#<section>]]
- [[sources/<subject>/<file>#<section>]]
```
