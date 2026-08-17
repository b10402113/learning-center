---
name: probe
description: Measure one node's mastery before the learner views it; a hard gate before /nodes.
disable-model-invocation: true
argument-hint: "Which subject/node should be probed? (e.g. /probe muscle-ladder/choosing-rep-ranges)"
---

Measure what the learner already knows about one node before viewing it. Invoke as `/probe <subject>/<node-id>` — probe is node-scoped, not subject-scoped. It runs after `/roadmap` (so the node container exists) and before `/nodes` (so that node's step depth can be calibrated). It quizzes the node's source scope from shallow to deep, binary-searching each strand, and writes that node's mastery entry (`unknown | partial | solid`) into `learn/<subject>/mastery.md`. Probing a node is a **hard gate**: `/nodes` refuses a node that has not been probed.

Prereqs: `learn/<subject>/MEMORY.md` exists (run `/learn-init` first), the node container `learn/<subject>/nodes/<node-id>.mdx` exists (run `/roadmap` first), and `learn/<subject>/digests/` exists. If any is missing, say so and stop. Read the digests only — never raw sources, per `docs/reference/source-reading.md`.

1. **Resolve the node.** Read `learn/<subject>/MEMORY.md` (for `language`, prior experience, "how to teach me") and `learn/<subject>/nodes/<node-id>.mdx`. Confirm the node exists and read its `sources` locators — these define the probe's scope. A `draft` node is probed for the first time; a node already `probed` (or further) is being re-measured.
2. **Anchor starting depth from MEMORY.** Prior experience and "how to teach me" set *where each strand's binary search starts* (start deeper for strands the learner claims to know), and set the question `language`. This only shifts the starting rung; it never causes a strand to be skipped.
3. **Decompose the node's sources into strands.** A **strand** is one coherent claim/mechanism/decision thread the node's sources teach (the digest's `Key claims` and `Learner-relevant` lines name them). Typically 2–5 strands per node. For each strand, build a **depth ladder** of 3–4 questions from shallow to deep, each grounded in a digest claim and carrying its `[[sources/<subject>/<file>#<section>]]` locator:
   - **L1 — recall**: recognize or name the term / basic fact.
   - **L2 — state**: restate the key claim or mechanism.
   - **L3 — apply**: a worked example or "now decide" using the learner's own context.
   - **L4 — judge**: compare, weigh a tradeoff, or handle an edge case across strands.
4. **Binary-search each strand, one question at a time.** Start at the mid rung (L2/L3, shifted by MEMORY). Present one MCQ at a time and wait for each answer, grading immediately — correct or not, then a short explanation and the source locator, in the `/quiz` rhythm. Four options, distractors drawn from the subject's real concepts, never invented words. Put the correct answer at a random letter — never default to A, and vary its position across questions. Write all four options at the same length, tone, and grammatical completeness (every option is a full plausible statement, not fragments): no option may be the visibly longest or the obviously-right/obviously-wrong one. Correct → next ask halfway toward the deepest rung; wrong → halfway toward the shallowest. Stop the strand the moment the frontier is bracketed (a correct and an incorrect answer on adjacent rungs, or the deepest rung reached) — do not ask questions the learner has already effectively answered. The frontier is the deepest rung answered correctly.
5. **Rate each strand, then the node.** Map the frontier to a rating:
   - `solid` — the deepest rung (L4) was answered correctly.
   - `partial` — correct at shallow/mid, wrong somewhere deeper.
   - `unknown` — wrong at the shallowest rung.
   Rate the **node** by its weakest strand (most conservative), so `/nodes` never assumes more than is measured and `/tackle` knows where to focus.
6. **Write the node's mastery entry.** Write or update `learn/<subject>/mastery.md` in the format below — one entry per probed node, `Status`, a one-line depth note, the strands probed, and their source locators. Write it in English (calibration data read by `/nodes` and `/tackle`); only the interactive questions run in the subject's `language`. Then move the node container from `draft` to `probed` (never further). The report never proposes pruning — `unknown` and `partial` strands stay complete; they just get taught deeper.
7. **Hand off.** Report the node's picture (strands `solid` / `partial` / `unknown`) and point to `/nodes <subject>/<node-id>` as the next stage.

Completion: the node's strands each have a frontier found by binary search (no already-answered questions re-asked), the node's entry is written to `mastery.md` with no pruning, the node moved `draft → probed`, and the learner was told the next stage.

## Mastery report format

```markdown
---
subject: <subject>
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Mastery — <subject>

## Summary
<One or two lines: coverage and overall picture. Calibration data only — mastery never prunes content.>

## Nodes

### <node-id>
- Status: <unknown | partial | solid>
- Notes: <one line — the frontier reached, and what depth /nodes & /tackle should teach>
- Strands:
  - <strand> — <unknown | partial | solid>
  - <strand> — <unknown | partial | solid>
- Sources:
  - [[sources/<subject>/<file>#<section>]]

### <node-id>
- Status: <unknown | partial | solid>
- Notes: <...>
- Strands:
  - <strand> — <unknown | partial | solid>
- Sources:
  - [[sources/<subject>/<file>#<section>]]
```

- `<node-id>` is the node's id from `learn/<subject>/nodes/<node-id>.mdx`.
- `Status` uses exactly `unknown`, `partial`, or `solid` — the vocabulary `/nodes` reads to calibrate step depth (teach shallow where `solid`, deep where `unknown`) and `/tackle` reads to target weak strands.
- `Notes` carries the frontier detail so a later `/probe` (or `/tackle`) can resume without re-probing from scratch.
- The report is re-readable and re-writable: `/tackle` updates a node's strands to `solid` on a passing step; a re-run of `/probe <subject>/<node-id>` re-measures that node.
