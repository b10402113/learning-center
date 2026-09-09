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
