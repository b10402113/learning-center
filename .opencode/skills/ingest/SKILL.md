---
name: ingest
description: Archive new source files and create digests. Does not modify roadmap, nodes, or steps.
disable-model-invocation: true
argument-hint: "Which subject has new material to ingest? (e.g. /ingest js-reverse)"
---

Phase 1 of the ingest pipeline. Archive new source files and create two-level digests. Does **not** touch the learning graph — that is `/absorb`'s job.

Invoke as `/ingest <subject>`. The subject **comes from the argument** — `sources/<subject>/` must exist.

Prereqs: `learn/<subject>/MEMORY.md` exists, `sources/<subject>/` exists. If either is missing, say which and stop.

## Step 1 — Detect and archive new sources

Inventory `sources/<subject>/` recursively. Collect every **file** at any depth, skipping `.DS_Store`. These are the candidates. Then filter out any that have already been processed:

1. Create `sources/<subject>/YYYYMMDD/` (today's date) if missing.
2. For each candidate file, compute its relative path from `sources/<subject>/` (e.g. `chapter-notes/fig1.png` for a file in a subdirectory, or just `notes.pdf` for a top-level file). Check if `sources/<subject>/<any-date-folder>/<relative-path>` already exists in any dated subfolder. If it does, skip it — it was ingested in a prior run.
3. Move the remaining (unprocessed) files into `sources/<subject>/YYYYMMDD/<relative-path>`. Use `mv`, not copy. If the relative path includes subdirectories, create them under the dated folder first (`mkdir -p`).

If no files needed moving (all were already in dated subfolders), say so and stop.

## Step 2 — Create digests

For each file that was **just moved** in step 1 (not files that were already in dated subfolders before step 1), compute the digest stem — the original filename **without** extension.

Check `learn/<subject>/digests/<stem>.md`: reuse it if the stored `source_hash` matches the archived file's sha256; rebuild if missing or stale.

For sources needing a digest:

1. Follow `docs/reference/source-reading.md`. Check size via `pdftotext | wc -l`. Large sources (> 5,000 lines or > ~250 KB): parallel sub-agents write part digests to `learn/<subject>/digests/<stem>.<n>.part.md`, then merge into `<stem>.md`. Small sources: read directly in context, write the digest.
2. Frontmatter must include `status: pending` and `absorbed_at: ""`.
3. Record `source_hash`, `source_lines`, `L1` overview, and `L2` section detail with locators.

When citing a source that came from a subdirectory, preserve its relative path inside the dated folder in source links: `[[sources/<subject>/YYYYMMDD/chapter-notes/fig1.png]]` rather than flattening to the filename alone.

If all newly archived sources already have current digests (hash match), say so.

## Step 3 — Report

Summarise:
- How many sources were archived.
- How many digests were created or reused.
- That digest status is `pending` — run `/absorb <subject>` to integrate into the learning graph.

Completion: every new source file is in a dated subfolder under `sources/<subject>/`, every source has a digest with a matching hash and `status: pending`, and the learner knows to run `/absorb` next.
