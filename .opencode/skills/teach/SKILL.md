---
name: teach
description: Design one node's teaching plan from its material bundles — mission, reader, spine, and one short decision block per step. Use when a course node needs its structure settled before any article is written.
---

# Teaching plan: material + mission → one short plan per node

Turn a node's material bundles into a single `teaching-plan.md`. The plan records the decisions an article writer cannot make alone: what each step is for, which question it answers, which sections carry it, what the reader must recall, and what it must not teach. It never contains article prose.

A whole node's plan should land around **60–90 lines**. Going over means you are drafting the article instead of deciding it.

## Inputs

The dispatch supplies:

- the node container `learn/<subject>/nodes/<node-id>.md` — the steps array is the contract
- `learn/<subject>/MEMORY.md` — mission, reader profile, and output language
- one material bundle per ready step at `learn/<subject>/output/materials/<node>/<step>.json`
- the published articles of skipped steps, when any exist
- the plan path: `learn/<subject>/output/jobs/<node-id>/teaching-plan.md`
- the output language

A bundle's `sources[]` carries `path`, `locator`, and `text`; `text` is the exact cited slice, and its `locator` is a coarse range covering the whole step. Work from local material only. Do not search the web, and do not add knowledge the bundles do not support.

## Principles

- **Mission first.** Every step traces back to why the learner wants this. If MEMORY is thin, derive the mission from the node goal and roadmap and say so. Never invent one.
- **Zone of proximal development.** Read what the learner already knows and what earlier steps taught; add one new demand, not three.
- **Retention over fluency.** Design for what the reader can still answer unaided a week later.
- **Ground the load-bearing claims.** Each step names the few facts its argument cannot survive without, each with a locator. Everything else the writer takes from the bundle.
- **One job per section.** A section that cannot be stated as a reader question is two sections.

## Steps

### 1. Read the material

Read every slice of a ready step before planning that step. If a slice is missing or unreadable, stop and report the step.

### 2. Write the node block

From MEMORY, the node goal, and the roadmap, write one short block: **Why**, **Success looks like**, **Out of scope**. Then the **Reader** (knows / wants / may assume) and the **Zone of proximal development** (closest known / new demand / speed).

### 3. Write the Spine

One line per step, in the node's order: `step-id — the question it answers → hands off: the next question`. Skipped steps that already have published articles appear in the Spine marked as already published.

### 4. Write one decision block per step

For each ready step, decide:

- **Type** — Explanation, Tutorial, or How-to (Diátaxis), plus one sentence on why.
- **After this step** — one observable outcome.
- **Prerequisites** — what may be assumed, or "none".
- **Load-bearing facts** — 2–4 claims, one per line. Open the step's source file once and cite the lines that actually state each claim, usually a range of 15 lines or fewer. Never cite the bundle's whole `locator`; a range that wide grounds nothing. Do not inventory every fact in the bundle.
- **Outline** — 2–4 sections, one line each: `**<section heading>** — reader question: <...>`. The heading must convey information. No per-section fact lists.
- **Example** — at most one worked example for the whole step.
- **Retrieval checkpoint** — 1–3 questions with single defensible answers.
- **Handoff** — the sentence that hands the next question to the next step.
- **Deliberately not taught** — what belongs to another step or node.

### 5. Write the plan

Write the plan path once. Use this shape:

```markdown
# Teaching plan — <node title>

## Mission
- Why: <the concrete outcome, in the learner's terms>
- Success looks like: <observable outcome>, <observable outcome>
- Out of scope: <what this node does not chase>

## Reader
- Knows: <...>
- Wants: <...>
- May assume: <...>

## Zone of proximal development
- Closest known: <...>
- New demand: <the one thing this node adds>
- Speed: <how fast to move, and what not to re-teach>

## Glossary
- **<term>** — <one-line definition> [[sources/<subject>/<file>.txt#Lx-Ly]]

## Spine
1. <step-id> — <question it answers> → hands off: <next question>

## <step-id> — <one-line purpose>

- Type: Explanation | Tutorial | How-to — <why>
- After this step: <observable outcome>
- Prerequisites: <...>
- Load-bearing facts:
  - <claim> [[sources/<subject>/<file>.txt#Lx-Ly]]
  - <claim> [[sources/<subject>/<file>.txt#Lx-Ly]]
- Outline:
  1. **<section heading>** — <reader question>
  2. **<section heading>** — <reader question>
- Example: <the one example, or "none">
- Retrieval checkpoint: <question> / <question>
- Handoff: <sentence>
- Deliberately not taught: <...>

## Gaps
- <what the material cannot support, so later articles must not claim it>
```

Glossary carries only terms reused across steps, at most eight, defined once. Gaps carries at most five lines and only real limits of the material.

## Completion

Check these once, then report:

1. One block per ready step, in the node's order.
2. Every step has a type, an outcome, a retrieval checkpoint, and 2–4 outline sections.
3. Every load-bearing fact cites a tight line range inside that step's bundle, not the bundle's whole range.
4. Every handoff has a matching pickup in the next step's Spine line.

## Working rules

- Write the whole plan in one pass. Do not re-read finished sections to polish them, and do not rewrite the file unless a fact, path, or step is actually wrong.
- If a check fails, fix that line only.
- A failed node: report the error and leave the plan unwritten rather than half-written.

## Boundaries

- Write only the teaching-plan file named by the dispatch.
- Do not write article prose, image plans, quizzes, or anything under `learn/<subject>/nodes/`.
- Do not run the article wrapper or any model CLI.
- Do not search the web, do not invent a mission, and do not add facts the material does not support.
