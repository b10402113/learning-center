---
name: ingest
description: Incrementally absorb new source material into an existing learning subject — digest, classify, integrate into nodes/steps/elements, and archive. Fully automated, no confirmation gate.
disable-model-invocation: true
argument-hint: "Which subject has new material to ingest? (e.g. /ingest ai-coding-crash-course)"
---

Incrementally integrate new source material into an existing subject's knowledge map. Invoke as `/ingest <subject>`. This is the _update_ path: the subject already has a `ROADMAP.md`, nodes, and elements, and new sources have appeared in `sources/<subject>/` that the map does not yet cover. For bootstrapping a brand-new subject from scratch, use `/learn-init` + `/roadmap` instead.

Fully automated: the agent classifies each concept and executes without confirmation. The classification rules in step 4 are the decision engine — follow them precisely.

Prereqs: `learn/<subject>/MEMORY.md` exists, `learn/<subject>/ROADMAP.md` exists, and `sources/<subject>/` exists. If any is missing, say which and stop.

## Step 1 — Detect new sources

Inventory `sources/<subject>/` recursively. Collect every **file** at any depth, skipping `.DS_Store`. These are the candidates. Then filter out any that have already been processed:

1. Create `sources/<subject>/YYYYMMDD/` (today's date) if missing.
2. For each candidate file, compute its relative path from `sources/<subject>/` (e.g. `chapter-notes/fig1.png` for a file in a subdirectory, or just `notes.pdf` for a top-level file). Check if `sources/<subject>/<any-date-folder>/<relative-path>` already exists in any dated subfolder. If it does, skip it — it was ingested in a prior run.
3. Move the remaining (unprocessed) files into `sources/<subject>/YYYYMMDD/<relative-path>`. Use `mv`, not copy. If the relative path includes subdirectories, create them under the dated folder first (`mkdir -p`).

If no files needed moving (all were already in dated subfolders), say so and stop.

## Step 2 — Digest the newly archived sources

For each file that was **just moved** in step 1 (not files that were already in dated subfolders before step 1), compute the digest stem — the original filename **without** extension.

Check `learn/<subject>/digests/<stem>.md`: reuse it if the stored `source_hash` matches the archived file's sha256; rebuild if missing or stale.

For sources needing a digest:

1. Follow `docs/reference/source-reading.md`. Check size via `pdftotext | wc -l`. Large sources (> 5,000 lines or > ~250 KB): parallel sub-agents write part digests to `learn/<subject>/digests/<stem>.<n>.part.md`, then merge into `<stem>.md`. Small sources: read directly in context, write the digest.
2. Record `source_hash`, `source_lines`, `L1` overview, and `L2` section detail with locators.

When citing a source that came from a subdirectory, preserve its relative path inside the dated folder in source links: `[[sources/<subject>/YYYYMMDD/chapter-notes/fig1.png]]` rather than flattening to the filename alone.

If all newly archived sources already have current digests (hash match), say so — their content will still be included in the integration analysis in step 4.

## Step 3 — Read the existing knowledge map

Load the full current state:

1. `learn/<subject>/MEMORY.md` — language, learner profile.
2. `learn/<subject>/ROADMAP.md` — the tiered node index with source locators.
3. Every node container in `learn/<subject>/nodes/*.mdx` — their step-DAGs, source lists, and goals.
4. Every element in `learn/<subject>/elements/*.mdx` — their `sources`, `Connections`, and `nodes` fields.
5. `learn/<subject>/mastery.md` if it exists — per-node strand ratings.

This is the map the new material must be fitted into.

## Step 4 — Classify new material against the map

Read each new digest's L1 + L2. For every significant concept, claim, or mechanism, classify it using these rules **in order** — the first match wins:

1. **Existing element** — search `learn/<subject>/elements/*.mdx` for an element whose Problem Statement or How it works covers the same concept. Match by semantic overlap of `Key claims` against the element's existing sections. If found → supplement that element.
2. **Existing node — gap** — search node containers for one whose `goal` statement encompasses this concept, AND none of that node's existing steps or elements already cover it. If found → add a step to that node.
3. **New node** — the concept doesn't fit any existing element or node. Check `target = clamp(round(total_lines / 1100), 3, 30)` with the new source's line count included. If the resulting node count stays within ±40% of baseline → create a new node.

When a concept could match multiple rules, **the first match wins** — prefer supplementing an existing element over adding a step, and prefer adding a step over creating a new node. This keeps the map compact.

For new nodes, assign: a kebab-case `id`, a title, a one-sentence learner-facing goal, placement in the correct tier (general before specific), and an `order` that slots it near related existing nodes.

## Step 5 — Execute the integration

Work through the classified material, category by category.

### 5a. Supplement existing elements

For each element being updated:

1. Read the current element file.
2. Add new detail to the appropriate section (How it works, Practical use, Deep dive). **Preserve** existing explanations — elements compound; add alongside, don't overwrite.
3. Add new `[[sources/<subject>/<file>#<section>]]` locators to `sources:` and `## Deep dive` if the new source adds substantively different claims.
4. Add new element links to `## Connections` if the new material reveals a relationship the element didn't previously capture. Each connection must be bidirectional — update the target element's Connections too.
5. Bump `updated` in frontmatter.

### 5b. Add steps to existing nodes

For each new step:

1. Read the node container. Append the step to the node's `steps` frontmatter DAG (new id, order after the last existing step, deps on the node's terminal step if any). Update `## Steps` reading order.
2. Create the skeleton step file at `learn/<subject>/nodes/<node-id>/<step-id>.mdx` with frontmatter, `<LearningGoal>`, and empty `## Lesson` + `## Sources`. The step file is a skeleton — content is filled by `/teach <subject>/<node-id>`.
3. Add `teaches` element ids to the step's frontmatter (the elements the new step covers — create new element files if needed per 5c).
4. Bump the node's `updated`. Set status to `draft` if it was `edges-written` or `content-written` (new content was added), or leave as-is if already `draft`/`probed`/`confirmed`/`nodes-written`.

### 5c. Create new elements

For each new concept that needs an element:

1. Generate a kebab-case `id` derived from the concept name.
2. Write `learn/<subject>/elements/<element-id>.mdx` following the element format: frontmatter (`id`, `title`, `subject`, `tier`, `order`, `type: article`, `nodes`, `sources`, `created`, `updated`), then sections: Problem Statement · Why it matters · How it works · In plain terms (optional) · Analogy (optional) · Practical use · Prerequisites (optional) · Connections · Deep dive · Questions.
3. Populate Connections with at least 2 links to existing elements. Cross-reference back from the linked elements too.
4. Populate Questions with at least 2 retrieval questions.

### 5d. Create new nodes

For each new node:

1. Write `learn/<subject>/nodes/<node-id>.mdx` as a container — `steps: []`, tier, order, goal, sources, `status: draft`. Use the format from `ROADMAP.md`'s node container template.
2. Update `learn/<subject>/ROADMAP.md`: insert the node into the correct tier and position, adjust order numbers, and update the node count note.
3. The new node enters the standard pipeline: `/probe <subject>/<node-id>` → `/nodes <subject>/<node-id>` → `/teach <subject>/<node-id>` → `/edges <subject>/<node-id>`. Ingest does not run these — it only creates the container.

## Step 6 — Verify

Run `node scripts/verify.mjs --subject <subject>` (whole-subject). Fix each non-zero exit and re-run, up to 3 rounds. After the 3rd round, list any surviving failures. The script checks format only — content judgment is the learner's manual pass.

## Step 7 — Report

Summarize:
- How many sources were ingested, archived, and digested.
- How many elements were supplemented, how many created.
- How many steps were added to existing nodes, how many new nodes created.
- The verify result (exit status, surviving failures).
- Next steps for new nodes: tell the learner to run `/probe <subject>/<node-id>` then `/nodes <subject>/<node-id>` then `/teach <subject>/<node-id>` for each new node.

Completion: every new source has a digest with a matching hash, every concept from the new material is mapped (supplemented into an element, added as a step, or landed as a new node), all processed sources are in a dated subfolder under `sources/<subject>/`, verify passes (or surviving failures are listed), and the learner knows the next stage for each new node.
