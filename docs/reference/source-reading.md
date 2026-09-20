# Source Reading Protocol

Shared contract for how `learn-init`, `roadmap`, `nodes`, and `edges` read source material. The goal: raw text never enters the main context wholesale. Sources are read once, condensed into **digests**, and the digests are reused across stages.

## When to use a sub-agent

A source is **large** when it exceeds either bound:

| Source   | Metric            | Threshold | Action                                                |
| -------- | ----------------- | --------- | ----------------------------------------------------- |
| PDF      | `pdftotext` lines | > 3,000   | sub-agent path                                        |
| PDF      | `pdftotext` size  | > ~250 KB | sub-agent path                                        |
| Codebase | `wc -l` lines     | > 3,000   | sub-agent path                                        |
| else     | —                 | —         | main context reads directly, writes the digest itself |

## Digest files

- Location: `learn/<subject>/digests/<source-stem>.md` — one file per source (the stem is the original filename without extension for files, or the directory name for codebases). Large sources are split into one **part file per chunk**, named `<source-stem>.<n>.part.md`; each part is a self-contained digest. Digests are two-level:
  - **L1 — overview**: a few lines per chapter (PDF) or per module (codebase). Enough for `learn-init` grilling and `roadmap` partitioning without loading detail.
  - **L2 — detail**: per-section entry (PDF) or per-module entry (codebase) with a summary, key claims, learner-relevant outcomes, and the exact locator. Used by `nodes` for element extraction.
- Every source gets a digest, large or small (parts included). `nodes` reads digests only — never raw sources.
- Frontmatter records `source`, `source_lines`, and `status` (`pending` | `absorbed`).

### PDF digest format

```markdown
---
source: <source-stem>
source_type: pdf
source_lines: <pdftotext line count>
part: <n> # parts only; omit for single-file digests
status: pending | absorbed
absorbed_at: YYYY-MM-DD # set when consumed by /roadmap or /absorb
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Digest — <source-stem> (part <n>)

## Overview (L1)

- <chapter/part> — <2–4 line summary>

## Sections (L2)

### <section id>

- Locator: `[[sources/<subject>/<YYYYMMDD>/<file>#<section>]]`
- Summary: <what this section explains>
- Key claims: <claim 1>; <claim 2>
- Learner-relevant: <outcome or anchor this section can support>
```

### Codebase digest format

Large codebases are split into one **part file per top-level directory**, named `<dir-stem>.<n>.part.md`; each part is a self-contained digest. Single-file digests are used only when the codebase is small enough to read in the main context.

```markdown
---
source: <dir-stem>
source_type: codebase
source_lines: <wc -l line count for this directory>
language: <primary language by file count>
file_count: <code files in this directory>
part: <n> # parts only; omit for single-file digests
status: pending | absorbed
absorbed_at: YYYY-MM-DD # set when consumed by /roadmap or /absorb
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Digest — <dir-stem> (part <n>)

## Overview (L1)

- <module/directory> — <2–4 line summary of what it does>

## Structure (L2)

### <module-path>

- Locator: `[[sources/<subject>/<YYYYMMDD>/<dir-stem>/<path>]]`
- Purpose: <what this module/file does>
- Key exports: <function/class names>
- Dependencies: <what it imports from within the codebase>
- Learner-relevant: <what concept this module teaches>
```

## Sub-agent workflow (large sources)

### PDF

1. Compute `pdftotext` output and line count in the main context; chunk on section boundaries (book chapters, numbered sections), each chunk < 2000 lines.
2. Dispatch sub-agents **in parallel**, one per chunk (<2000 lines). Each sub-agent reads only the relevant `sources/<subject>/<YYYYMMDD>/` subfolder, writes a self-contained part digest to `learn/<subject>/digests/<source-stem>.<n>.part.md` with `source_lines` and `status: pending` in its frontmatter, and returns only a compact TOC line for its chunk (chapter ids + one-line summaries).

There is no merge step: the part files together are the digest.

### Codebase

1. Compute `wc -l` line count across all code files in the main context; split on top-level directory boundaries.
2. Dispatch sub-agents **in parallel**, one per top-level directory. Each sub-agent reads only its directory, writes a self-contained part digest to `learn/<subject>/digests/<dir-stem>.<n>.part.md` with `source_lines` (that directory's `wc -l`) and `status: pending` in its frontmatter, and returns only a compact TOC line for its directory (directory name + one-line summary).

There is no merge step: the part files together are the digest.

Sub-agents never write anywhere outside `learn/<subject>/digests/`. Their returned message must stay small — the file carries the content, not the message.

## Batch-aware digest grouping

### Scope
This protocol extends the one-file-per-digest rule to accommodate the `ingest` skill’s new batch-aware behavior. When `ingest` processes a set of files archived in the same dated subfolder, it groups them into **clusters** based on topic relevance before creating digests. The goal is to produce one digest per meaningful learning unit that downstream `/absorb` can treat as a single concept block.

### Grouping principles

1. **The batch is the input.** `ingest` reads all files that were just moved into `sources/<subject>/YYYYMMDD/`. It does not consider earlier archived files, even if they share the same subject.
2. **Clustering.** Files are clustered by semantic similarity. Two files belong in the same cluster if their combined content forms a coherent learning unit that `absorb` can reasonably consider as a single node goal. Standalone files that do not match any other file’s topic form single-file clusters.
3. **Digest name.** The digest name is derived from the cluster’s unified topic (e.g., `closure-basics`). For a single-file cluster where the file is self-contained, the name may be the original file stem.
4. **Large-source handling.** The size check and sub-agent path from the large-source sections still apply within a cluster. Part digests are named `<cluster-name>.<n>.part.md`.
5. **Locator preservation.** Each L2 section records source locators exactly as in the one-file format, e.g., `[[sources/<subject>/YYYYMMDD/chapter-notes/fig1.png]]`.

### Image-only digests

Images without text counterparts are treated as a separate class: they form their own minimal digest(s) (one per related batch of images) with `source_type: image`. Their L1/L2 structure is lighter (no section summaries, just locator + one-line description).

### Backward compatibility

Existing per-file digests remain untouched. This batch-aware grouping applies only to files archived by future runs of `/ingest`. If a batch contains a single file, or if the learner explicitly opts out of clustering, the system falls back to the original one-file-per-digest behavior.

### Design rationale

- **Why not merge all files into one digest?** A single digest would obscure the semantic boundaries that `/absorb` needs to decide what goes into existing nodes vs. new nodes.
- **Why not keep strict one-file-per-digest?** Without clustering, the learning graph would become unnecessarily fragmented, leading to many single-file nodes that are trivial to teach.
- **Why not re-ingest existing digests?** Sources are immutable, and existing digests already have `status: absorbed`. Re-processing would duplicate work and risk breaking existing pipelines.

### Lint considerations

When validating digests, the linter should still check for broken locators and correct frontmatter. It does not enforce the new batch-aware constraints: it only checks that each file referenced in `[[...]]` points to an actual source file, and that every cluster’s L2 entries have at least one matching locator.

## Digest lifecycle

Each digest has a `status` field in its frontmatter:

- `pending` — newly created, not yet consumed. Set by `/learn-init`, `/roadmap` (when building missing digests), and `/ingest`.
- `absorbed` — consumed and integrated. Set by `/roadmap` (after partitioning into nodes) or `/absorb` (after integrating into the learning graph).

Sources are immutable, so a digest is stable once written. A `pending` digest is ready for consumption; an `absorbed` digest has already been processed.

## Lazy detail pulls (`nodes`)

When a node's element extraction needs detail beyond the digest:

1. Locate the section via its L2 locator.
2. Dispatch one sub-agent to run `pdftotext` and extract that section's original text.
3. The sub-agent returns the excerpt in its message — one-off reads, no file. Only pull when the digest is genuinely insufficient.

## Node count formula

```text
lines  = total pdftotext lines (PDFs) + total wc -l lines (codebases)
target = clamp(round(lines / 1100), 3, 30)
```

The formula produces the **baseline** for the roadmap checkpoint — a soft target, not a gate. The learner confirms or adjusts the final partition. Lint warns when the actual node count deviates more than ±40% from the target.
