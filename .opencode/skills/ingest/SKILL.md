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

Collect all files that were **just moved** in step 1. These form the **current batch**.

### Single-file batch → fallback to per-file mode

If the batch contains only one file, or if the learner explicitly wants the old behavior, proceed directly to single-file mode (see §Single-file mode below).

### Batch mode (two or more files)

1. **Read all files.** Load the content of every file in the batch into context.
2. **Group by topic.** Analyze the batch holistically and cluster the files into groups by topic/concept relevance. Each cluster must be a single meaningful learning unit that downstream `/absorb` can reason about as one concept block. Files that have no thematic overlap with any other file remain as single-file clusters.
3. **Choose digest names.** For each cluster, derive a semantic name from its unified topic. If the cluster contains exactly one file and its content is self-contained, the name may be that file's stem; otherwise pick a name that reflects the shared topic (e.g. `closure-basics`, `async-event-loop`).
4. **Check size.** For each file in a cluster, determine source type and size:
   - PDF: `pdftotext | wc -l` for line count; also check byte size (`du -b`).
   - Codebase: `wc -l` for line count.
   - Else: treat as small (read directly).
   Large sources (> 3,000 lines or > ~250 KB) follow the sub-agent path in `docs/reference/source-reading.md`; their part files are grouped under the cluster digest name (e.g. `closure-basics.1.part.md`, `closure-basics.2.part.md`).
5. **Check for existing digest.** Before writing, check `learn/<subject>/digests/<name>.md` (and `<name>.*.part.md`). If a digest with the same name already exists, skip writing — it was produced in a prior run.
6. **Write the cluster digest.** For each new cluster:
   1. Frontmatter must include `source` (the digest name), `source_lines` (total lines across all cluster members), `status: pending`, and `absorbed_at: ""`.
   2. L1 overview: summarize the unified topic. If the cluster contains multiple files, list them and note what each contributes.
   3. L2 sections: organized by sub-topic, not by original file boundary. Each `Locator:` entry references the specific source file(s) that support that sub-topic. A section may list multiple locators on separate lines when more than one file contributes.
   4. **Images:** if a cluster's text members reference images, cite those image locators inside the relevant L2 section. Images with no text counterpart in the cluster get their own minimal image-only digest (see §Image-only digests).
7. **Mark remaining singles.** Files that did not group with any other file still get their own digest, named from their content/topic (or their stem when the file is clearly self-contained).

### Image-only digests

For images, screenshots, and other non-text sources that did not attach to any text cluster:

1. One digest per image, or one digest per small group of related images (e.g. all figures from the same tutorial).
2. Minimal L1: one-line summary of what the batch of images depicts.
3. L2: one entry per image, with `Locator:` and a one-line description of what it shows.
4. Frontmatter: `source_type: image` (or appropriate type), `source_lines: 0`.

### Single-file mode

One file in the batch, or a file that stands alone. One digest per source, named after the source stem. Follow `docs/reference/source-reading.md` for size check and sub-agent dispatch.

### Source path preservation

When citing a source that came from a dated subfolder, preserve its relative path inside the dated folder in source links: `[[sources/<subject>/YYYYMMDD/chapter-notes/fig1.png]]` rather than flattening to the filename alone. This applies to both single-file and batch digests.

### Backward compatibility

Existing per-file digests (created before this change) are not modified. This new logic applies only to files archived in future `/ingest` runs.

## Step 3 — Report

Summarise:
- How many sources were archived.
- Whether the batch was processed in batch mode (clustering applied) or single-file mode.
- How many clusters were formed and which files went into each cluster.
- How many digests were created or reused.
- That digest status is `pending` — run `/absorb <subject>` to integrate into the learning graph.

Completion: every new source file is in a dated subfolder under `sources/<subject>/`, every source contributes to exactly one digest (either a topic cluster or a standalone file digest) with `status: pending`, and the learner knows to run `/absorb` next.
