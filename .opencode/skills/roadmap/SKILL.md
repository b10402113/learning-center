---
name: roadmap
description: Partition one subject's source material into confirmed 10–15 minute lesson paths.
disable-model-invocation: true
argument-hint: "Which subject needs a roadmap?"
---

Build the lesson plan for one subject. A **path** is one 10–15 minute lesson with one learner-facing goal. The roadmap plans paths; it does not extract canonical nodes or write detailed explanations.

Prereqs: `learn/<subject>/MEMORY.md` exists (run `/learn-init` first).

1. **Inventory.** Follow the shared `docs/reference/source-reading.md` protocol. Ensure `learn/<subject>/digests/` exists for the subject's material in `sources/<subject>/` — that folder only. Reuse digests whose `source_hash` matches; rebuild via parallel sub-agents for large sources (each chunk sub-agent reads `sources/<subject>/` only and does not write outside the digests folder). Small sources: read directly, write the digest yourself. Never re-read a source whose digest is current.
2. **Read digests.** Read the L1 overviews (and compact TOC lines) for all sources. Pull L2 section detail lazily when a proposed path needs confirmation that it has enough source support.
3. **Partition.** Group the material into paths. Each path must have one learning goal, a coherent 10–15 minute scope, and enough source support for a complete lesson. A path may later use several nodes. Do not turn every keyword into a roadmap node.
4. **Compute the baseline.** `target = clamp(round(total_lines / 1100), 3, 30)` where `total_lines` is the pdftotext line count across the subject's sources. Use this as the proposal's starting point, not a gate.
5. **Propose and confirm (checkpoint).** Present the full candidate partition — tiered path list with titles, one-line goals, durations, and the formula baseline (`target`, and the proposed count) — and ask the learner to confirm before writing anything. Exit paths: accept; or give a target count and re-partition once; or manually add/remove specific paths. Do not write `ROADMAP.md` or skeletons until this checkpoint passes.
6. **Tier.** Organize paths from general to specific. Tier 1 establishes the learner's mental model; later tiers add operating rules, mechanisms, implementation order, or practice. Tiers contain paths, never extracted nodes.
7. **Write the index.** Write `learn/<subject>/ROADMAP.md` with the tiered path index, subject goal, path order, durations, goals, and source references. Do not include a tiered node list.
8. **Write skeletons.** Create one `learn/<subject>/paths/<path-id>.md` per path. Include its tier and order, metadata, learning goal, source references, and empty `Nodes` and `Lesson` sections. Set each path status to `draft`.
9. **Hand off.** Present the tiered path set. The learner confirms an individual path by invoking `/nodes <subject>/<path-id>`; that command changes the path from `draft` to `confirmed` and starts node extraction. Do not require a separate confirmation command.

Completion: `ROADMAP.md` indexes every proposed path, the partition passed the learner checkpoint (count aligned with the formula baseline or deliberately adjusted), every path has one goal and traceable sources, every path skeleton exists, and each path becomes `confirmed` when the learner invokes `/nodes` for it.

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
Read the paths in order. Each path is a 10–15 minute lesson. Run `/nodes <subject>/<path-id>` to confirm and start work on that path.

## Paths

### Tier 1 — <mental model>
1. **[[learn/<subject>/paths/<path-id>|<Path title>]]** — 10–15 minutes
   - Goal: <learner-facing outcome>
   - Sources:
     - [[sources/<subject>/<file>#<section>]]
     - [[sources/<subject>/<file>#<section>]]

### Tier 2 — <operating rules>
2. **[[learn/<subject>/paths/<path-id>|<Path title>]]** — 10–15 minutes
   - Goal: <learner-facing outcome>
   - Sources:
     - [[sources/<subject>/<file>#<section>]]

### Tier 3 — <practice>
3. **[[learn/<subject>/paths/<path-id>|<Path title>]]** — 10–15 minutes

## Status
- [ ] Roadmap and paths confirmed
- [ ] Nodes and path articles written
- [ ] Edges written
```

## Path skeleton

```markdown
---
id: <path-id>
title: <Path title>
subject: <subject>
tier: <path tier>
order: <path order>
duration: 10-15 minutes
status: draft
goal: <learner-facing outcome>
sources:
  - "[[sources/<subject>/<file>#<section>]]"
nodes: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# <Path title>

## Learning goal
<learner-facing outcome>

## Nodes
<!-- /nodes fills this list in teaching order. -->

## Lesson
<!-- /nodes writes the 10–15 minute article here. -->

## Sources
- [[sources/<subject>/<file>#<section>]]
- [[sources/<subject>/<file>#<section>]]
```
