---
name: roadmap
description: Partition one subject's source material into confirmed 10–15 minute lesson nodes.
disable-model-invocation: true
argument-hint: "Which subject needs a roadmap?"
---

Build the lesson plan for one subject. A **node** is a step-DAG — a set of 10–15 minute step lessons with one learner-facing goal. The roadmap plans nodes; it does not extract canonical elements or write detailed explanations.

Prereqs: `learn/<subject>/MEMORY.md` exists (run `/learn-init` first) and `learn/<subject>/mastery.md` exists (run `/probe` first — the probe runs before the roadmap).

1. **Inventory.** Follow the shared `docs/reference/source-reading.md` protocol. Ensure `learn/<subject>/digests/` exists for the subject's material in `sources/<subject>/` — that folder only. Reuse digests whose `source_hash` matches; rebuild via parallel sub-agents for large sources (each chunk sub-agent reads `sources/<subject>/` only and does not write outside the digests folder). Small sources: read directly, write the digest yourself. Never re-read a source whose digest is current.
2. **Read digests.** Read the L1 overviews (and compact TOC lines) for all sources. Pull L2 section detail lazily when a proposed node needs confirmation that it has enough source support.
3. **Calibrate from mastery.** Read `learn/<subject>/mastery.md` (written by `/probe`). Mastery is a depth input only: `solid` areas are taught shallow, `unknown` areas deep. It never prunes content — every area stays complete and readable; mastery only shapes how deep each node is taught.
4. **Partition.** Group the material into nodes. Each node must have one learning goal, a coherent 10–15 minute scope, and enough source support for a complete lesson. A node may later use several elements across its steps. Do not turn every keyword into a roadmap element.
5. **Compute the baseline.** `target = clamp(round(total_lines / 1100), 3, 30)` where `total_lines` is the pdftotext line count across the subject's sources. Use this as the proposal's starting point, not a gate.
6. **Propose and confirm (checkpoint).** Present the full candidate partition — tiered node list with titles, one-line goals, durations, and the formula baseline (`target`, and the proposed count) — and ask the learner to confirm before writing anything. Exit options: accept; or give a target count and re-partition once; or manually add/remove specific nodes. Do not write `ROADMAP.md` or containers until this checkpoint passes.
7. **Tier.** Organize nodes from general to specific. Tier 1 establishes the learner's mental model; later tiers add operating rules, mechanisms, implementation order, or practice. Tiers contain nodes, never extracted elements.
8. **Write the index.** Write `learn/<subject>/ROADMAP.md` with the tiered node index, subject goal, node order, durations, goals, and source references. Do not include a tiered element list.
9. **Write node containers.** Create one `learn/<subject>/nodes/<node-id>.mdx` per node. Include its tier and order, metadata, learning goal, source references, and empty `Steps` (step-DAG) and `Lesson` sections. Set each node status to `draft`.
10. **Hand off.** Present the tiered node set. The learner confirms an individual node by invoking `/nodes <subject>/<node-id>`; that command changes the node from `draft` to `confirmed` and reasons out the node's step-DAG for confirmation before writing step articles. Do not require a separate confirmation command.

Completion: `ROADMAP.md` indexes every proposed node, the partition passed the learner checkpoint (count aligned with the formula baseline or deliberately adjusted), every node has one goal and traceable sources, every node container exists, and each node becomes `confirmed` when the learner invokes `/nodes` for it.

## ROADMAP.md

```markdown
---
subject: <subject>
status: draft            # draft → confirmed
created: YYYY-MM-DD
---

# ROADMAP — <subject>

## Goal
<from MEMORY.md>

## How to use
Read the nodes in order. Each node is a step-DAG of 10–15 minute steps. Run `/nodes <subject>/<node-id>` to confirm and start work on that node.

## Nodes

### Tier 1 — <mental model>
1. **[[learn/<subject>/nodes/<node-id>|<Node title>]]** — 10–15 minutes
   - Goal: <learner-facing outcome>
   - Sources:
     - [[sources/<subject>/<file>#<section>]]
     - [[sources/<subject>/<file>#<section>]]

### Tier 2 — <operating rules>
2. **[[learn/<subject>/nodes/<node-id>|<Node title>]]** — 10–15 minutes
   - Goal: <learner-facing outcome>
   - Sources:
     - [[sources/<subject>/<file>#<section>]]

### Tier 3 — <practice>
3. **[[learn/<subject>/nodes/<node-id>|<Node title>]]** — 10–15 minutes

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
duration: 10-15 minutes
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
{/* /nodes fills this step-DAG — step ids + order + deps — and gets confirmation. */}

## Lesson
{/* /nodes writes the main lesson here; step articles live under this node's folder. */}

## Sources
- [[sources/<subject>/<file>#<section>]]
- [[sources/<subject>/<file>#<section>]]
```
