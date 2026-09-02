# Source Reading Protocol

Shared contract for how `learn-init`, `roadmap`, `nodes`, and `edges` read source material. The goal: raw text never enters the main context wholesale. Sources are read once, condensed into **digests**, and the digests are reused across stages.

## When to use a sub-agent

A source is **large** when its `pdftotext` output exceeds either bound:

| Metric    | Threshold | Action                                                |
| --------- | --------- | ----------------------------------------------------- |
| Lines     | > 5,000   | sub-agent path                                        |
| Text size | > ~250 KB | sub-agent path                                        |
| else      | —         | main context reads directly, writes the digest itself |

## Digest files

- Location: `learn/<subject>/digests/<source-stem>.md` — one file per source for small sources (the stem is the original filename without the `YYYYMMDD_` archive prefix). Large sources are split into one **part file per chunk**, named `<source-stem>.<n>.part.md`; each part is a self-contained digest carrying the full source fingerprint. Digests are two-level:
  - **L1 — chapter overview**: a few lines per chapter. Enough for `learn-init` grilling and `roadmap` partitioning without loading detail.
  - **L2 — section detail**: per-section entry with a summary, key claims, learner-relevant outcomes, and the exact `[[sources/<subject>/completed/<file>#<section>]]` locator. Used by `nodes` for element extraction.
- Every source gets a digest, large or small (parts included). `nodes` reads digests only — never raw sources.
- Frontmatter records the source fingerprint for staleness checks. A small source uses a single file; each part of a large source repeats the same `source_hash`/`source_lines`:

```markdown
---
source: <source-stem>
source_hash: <sha256 of source file>
source_lines: <pdftotext line count>
part: <n>            # parts only; omit for single-file digests
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Digest — <source-stem> (part <n>)

## Overview (L1)

- <chapter/part> — <2–4 line summary>

## Sections (L2)

### <section id>

- Locator: `[[sources/<subject>/completed/<file>#<section>]]`
- Summary: <what this section explains>
- Key claims: <claim 1>; <claim 2>
- Learner-relevant: <outcome or anchor this section can support>
```

## Sub-agent workflow (large sources)

1. Compute `pdftotext` output and the source fingerprint (`sha256` hash + line count) in the main context; chunk on section boundaries (book chapters, numbered sections), each chunk < 2000 lines.
2. Dispatch sub-agents **in parallel**, one per chunk(<2000 lines). Each sub-agent reads only `sources/<subject>/completed/`, writes a self-contained part digest to `learn/<subject>/digests/<source-stem>.<n>.part.md` with the full `source_hash`/`source_lines` in its frontmatter, and returns only a compact TOC line for its chunk (chapter ids + one-line summaries).

Sub-agents never write anywhere outside `learn/<subject>/digests/`. Their returned message must stay small — the file carries the content, not the message. There is no merge step: the part files together are the digest.

## Digest lifecycle

Before reading a source, compare the stored `source_hash` against the current file:

- Hash matches → reuse the digest, do not re-read the source. For part digests, any part's frontmatter carries the fingerprint, so match on one part and reuse them all.
- Digest missing, or hash differs → rebuild via the sub-agent workflow (or main-context write for small sources).

Sources are immutable, so a digest is stable once written. Rebuild only on mismatch.

## Lazy detail pulls (`nodes`)

When a node's element extraction needs detail beyond the digest:

1. Locate the section via its L2 locator.
2. Dispatch one sub-agent to run `pdftotext` and extract that section's original text.
3. The sub-agent returns the excerpt in its message — one-off reads, no file. Only pull when the digest is genuinely insufficient.

## Node count formula

```text
lines  = total pdftotext lines across the subject's sources
target = clamp(round(lines / 1100), 3, 30)
```

The formula produces the **baseline** for the roadmap checkpoint — a soft target, not a gate. The learner confirms or adjusts the final partition. Lint warns when the actual node count deviates more than ±40% from the target.
