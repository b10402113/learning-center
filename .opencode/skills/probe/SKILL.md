---
name: probe
description: Quiz the learner adaptively over the whole subject source and write a per-area mastery report.
disable-model-invocation: true
argument-hint: "Which subject should be probed for mastery? (e.g. /probe muscle-ladder)"
---

Measure what the learner already knows before anything is planned. Invoke as `/probe <subject>`. The probe runs after `/learn-init` (so `MEMORY.md` and the digests exist) and before `/roadmap` (so the roadmap can calibrate depth). It quizzes the whole source scope from shallow to deep, binary-searching each knowledge strand, and writes a per-area mastery report (`unknown | partial | solid`) to `learn/<subject>/mastery.md`. Mastery calibrates how deep later stages teach — it never prunes content.

Prereqs: `learn/<subject>/MEMORY.md` exists (run `/learn-init` first) and the subject's digests exist in `learn/<subject>/digests/`. If either is missing, say so and stop. Read the digests only — never raw sources, per `docs/reference/source-reading.md`.

1. **Inventory the full source scope.** Ensure `learn/<subject>/digests/` exists for every file in `sources/<subject>/` (that folder only). Reuse digests whose `source_hash` matches; rebuild via the sub-agent workflow when missing, stale, or large. Read the L1 overview of every digest — this is the complete **area** list (one chapter/part per area). Every area gets an entry in the report, no exceptions. A large source may already be chunked into several L1 entries; treat each entry as its own area.
2. **Anchor starting depth from MEMORY.** Read `learn/<subject>/MEMORY.md` — prior experience and "how to teach me" set *where each strand's binary search starts* (start deeper for areas the learner claims to know), and set the question `language`. This only shifts the starting rung; it never causes an area to be skipped. `MEMORY.md` looking strong in an area means start at the deep end there — not skip it.
3. **Decompose each area into strands.** A **strand** is one coherent claim/mechanism/decision thread the source teaches (the digest's `Key claims` and `Learner-relevant` lines name them). Typically 2–5 strands per area. For each strand, build a **depth ladder** of 3–4 questions from shallow to deep, each grounded in a digest claim and carrying its `[[sources/<subject>/<file>#<section>]]` locator:
   - **L1 — recall**: recognize or name the term / basic fact.
   - **L2 — state**: restate the key claim or mechanism.
   - **L3 — apply**: a worked example or "now decide" using the learner's own context.
   - **L4 — judge**: compare, weigh a tradeoff, or handle an edge case across strands.
4. **Binary-search each strand, one question at a time.** Start at the mid rung (L2/L3, shifted by MEMORY). Present one MCQ at a time and wait for each answer, grading immediately — correct or not, then a short explanation and the source locator, in the `/quiz` rhythm. Four options, distractors drawn from the subject's real concepts, never invented words. Correct → next ask halfway toward the deepest rung; wrong → halfway toward the shallowest. Stop the strand the moment the frontier is bracketed (a correct and an incorrect answer on adjacent rungs, or the deepest rung reached) — do not ask questions the learner has already effectively answered. The frontier is the deepest rung answered correctly.
5. **Rate each strand, then each area.** Map the frontier to a rating:
   - `solid` — the deepest rung (L4) was answered correctly.
   - `partial` — correct at shallow/mid, wrong somewhere deeper.
   - `unknown` — wrong at the shallowest rung.
   Rate an **area** by its weakest strand (most conservative), so later stages never assume more than is measured.
6. **Write the report.** Write `learn/<subject>/mastery.md` in the format below — one entry per area, `Status`, a one-line depth note, the strands probed, and their source locators. Write it in English (calibration data read by `/roadmap`, `/nodes`, `/tackle`); only the interactive questions run in the subject's `language`. The report never proposes pruning or deletion — `unknown` and `partial` areas stay complete; they just get taught deeper.
7. **Hand off.** Report the overall picture (areas `solid` / `partial` / `unknown`) and point to `/roadmap <subject>` as the next stage.

Completion: every area in the digest L1 has a rated entry in `mastery.md`, each strand's frontier was found by binary search (no already-answered questions re-asked), the report never prunes content, and the learner was told the next stage.

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

## Areas

### <area id>
- Status: <unknown | partial | solid>
- Notes: <one line — the frontier reached, and what depth /roadmap & /nodes should teach>
- Strands:
  - <strand> — <unknown | partial | solid>
  - <strand> — <unknown | partial | solid>
- Sources:
  - [[sources/<subject>/<file>#<section>]]

### <area id>
- Status: <unknown | partial | solid>
- Notes: <...>
- Strands:
  - <strand> — <unknown | partial | solid>
- Sources:
  - [[sources/<subject>/<file>#<section>]]
```

- `<area id>` is the digest L1 entry id (the chapter/part id, or the source stem for a single-part source).
- `Status` uses exactly `unknown`, `partial`, or `solid` — the vocabulary `/roadmap` and `/nodes` read to calibrate depth (`solid` → teach shallow, `unknown` → teach deep).
- `Notes` carries the frontier detail so a later `/probe` (or `/tackle`) can resume without re-probing from scratch.
- The report is re-readable and re-writable: `/tackle` updates a strand/area to `solid` on a passing step; a re-run of `/probe` reuses already-rated areas.
