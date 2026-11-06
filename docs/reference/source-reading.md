# Source Reading Protocol

Shared contract for how `learn-init`, `ingest`, `absorb`, `roadmap`, `nodes`, `article`, and `edges` read source material. The goal: raw text never enters the main context wholesale. Sources are read once, condensed into **digests**, and the digests are reused across stages; `article` records only the line ranges a step cites, and its publisher reads each cited source file in full.

## Source roles and layout

A subject written by the current `/learn-init` uses `source_layout: course-supplement` in `MEMORY.md`. Every dated folder then has three children:

```text
sources/<subject>/<YYYYMMDD>/
├── course/       course text: transcript .txt, book body, lecture notes
├── supplement/   supporting material: code, images, slides, extra articles
└── raw/          originals: .srt/.vtt, original PDFs, parts manifests
```

- **course** — the article's spine. A step must cite at least one `course` source, and the article must cover the cited course range completely.
- **supplement** — supports the course text; it never replaces it.
- **raw** — archived originals. It is never digested, never counted toward the node baseline, and never cited. `verify` rejects a citation into `raw/`.
- One file has exactly one role. Code embedded in course prose stays in `course/`.
- `classify-sources.mjs` proposes the roles, the learner confirms, and the script moves the files. A book's PDF and parts manifest go to `raw/`; its parts go to `course/` or `supplement/` by role.

Older subjects without the marker keep the pre-role layout and are not checked against these rules.

## When to use a sub-agent

A source is **large** when it exceeds either bound:

| Source   | Metric            | Threshold | Action                                                        |
| -------- | ----------------- | --------- | ------------------------------------------------------------- |
| PDF      | `pdftotext` lines | > 3,000   | split the `.txt` first, then the sub-agent path per part      |
| PDF      | `pdftotext` size  | > ~250 KB | split the `.txt` first, then the sub-agent path per part      |
| Codebase | `wc -l` lines     | > 3,000   | sub-agent path                                                |
| else     | lines or size     | ≤ bounds  | main context reads directly, writes the digest itself         |
| else     | lines or size     | > bounds  | split into part files first, then digest each part            |

## Split long text sources first

A long `.txt` is the unit of citation only after it is split. Before any digest or article cites it, turn it into part files so every line number is local to a file a reader can actually open.

```bash
node scripts/split-sources.mjs --subject <subject> --dry-run
node scripts/split-sources.mjs --subject <subject> --dry-run --chapters
node scripts/split-sources.mjs --subject <subject> --apply
node scripts/split-sources.mjs --subject <subject> --apply --chapters
```

The dry run prints one row per chunk (original line range, target filename, line count, first line) and writes nothing. Show that table to the learner and wait for explicit confirmation before running `--apply`. If the learner declines, stop; do not fall back to digesting the unsplit file. Short sources never enter the size-based flow. `--chapters` forces one part per level-1 chapter heading even when the source is short, so a book's body and appendices can be classified separately.

`--apply` writes `<stem>.<n>.part.txt` next to the source, plus `<stem>.parts.json`. The manifest records the original path, `total_lines`, and each part's `start`/`end`/`lines`; the ranges tile the original with no gap and no overlap. After a successful apply the original `.txt` is deleted and the PDF stays in place. `pdf-backfill` sees `<stem>.*.part.txt` and skips that PDF, so a later run cannot recreate the long file. Rerunning `--apply` never overwrites an existing part.

After classification, each part file moves to `course/` or `supplement/`, and `classify-sources.mjs` adds a `role` to the manifest's part entry. The manifest itself lives in `raw/`. The part file becomes the citation unit: cite `[[sources/<subject>/<date>/<role>/<stem>.<n>.part.txt#Lx-Ly]]` with part-local line numbers. A range that would cross a chunk boundary is written as two citations; the digest's L2 entry is split the same way. Each chunk has exactly one part digest, whose `source` points at the chunk and whose `source_lines` equals that chunk's real line count. `verify` fails a manifest with a gap, overlap, wrong line count, a part without a digest, a part without a role in a course-supplement subject, or a digest that still points at the unsplit source.

## Digest files

- Location: `learn/<subject>/digests/<source-stem>.md` — one file per source (the stem is the original filename without extension for files, or the directory name for codebases). Large sources are split into one **part file per chunk**, named `<source-stem>.<n>.part.md`; each part is a self-contained digest whose `source` points at the matching `<source-stem>.<n>.part.txt`. Digests are two-level:
  - **L1 — overview**: a few lines per chapter (PDF) or per module (codebase). Enough for `learn-init` grilling and `roadmap` partitioning without loading detail.
  - **L2 — line map**: one entry per section (PDF/text) or per module (codebase), each naming the exact `#Lstart-Lend` range and a one-line description. This is the discovery map `nodes` and `article` use to pick the lines worth reading. There are no slug locators.
- Every citable source gets a digest, large or small (parts included). `raw/` originals never get one. `nodes` reads digests only — never raw sources.
- Frontmatter records `source` (a file under `course/` or `supplement/`), `source_type`, `source_lines` (the actual `.txt` line count, matching `wc -l`), and `status` (`pending` | `absorbed`). A `text` digest may also carry `supplements` — sibling `codebase` or `image` digests that supply the code or figures this text refers to (see below).

### Subtitle conversion

A `.srt` / `.vtt` is converted once, at ingest time, into a sibling `.txt` with plain paragraphs and no timestamps:

```bash
node scripts/transcript-backfill.mjs --subject <subject>
```

The command is idempotent: an existing `.txt` is never overwritten, and the original subtitle stays in `raw/`. Every citation points at the `.txt`; a subtitle is never cited.

### PDF text extraction

A PDF is extracted once, at ingest time, into a sibling `.txt`:

```bash
node scripts/pdf-backfill.mjs --subject <subject>
```

The command is idempotent: an existing `.txt` is never overwritten, so line numbers stay stable. Every citation points at the `.txt`; citing a PDF is a verification failure. A PDF in `raw/` is skipped when its text already lives under `course/` or `supplement/`. Re-extracting a source means treating it as a new source, because the line numbers may move.

### Text digest format

```markdown
---
source: sources/<subject>/<YYYYMMDD>/<course|supplement>/<file>.txt # or <file>.<n>.part.txt
source_type: text
source_lines: <wc -l of the cited file>
part: <n> # optional; manifest part number when the source is split
status: pending | absorbed | skipped
absorbed_at: YYYY-MM-DD # set when consumed by /roadmap or /absorb
skip_reason: "<why it is not taught>" # required when status is skipped
supplements: # optional; a supplement digest plus the L1 or L2 entry to use
  - <dir-stem>.md#Lx-Ly
  - <image-stem>.md#L1
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# L1 overview

- <chapter/part> — <2–4 line summary>

# L2 detail

- `#L1-L11` — <what these lines explain>
- `#L12-L25` — <what these lines explain>
- `#L26-L58` — <what these lines explain>
```

`source_lines` must equal the actual `.txt` line count. Every line of the source should be covered by an L2 range, so a step citation can always be traced back to a digest entry.

### Codebase digest format

Large codebases are split into one **part file per top-level directory**, named `<dir-stem>.<n>.part.md`; each part is a self-contained digest. Single-file digests are used only when the codebase is small enough to read in the main context.

```markdown
---
source: sources/<subject>/<YYYYMMDD>/<supplement|course>/<dir-stem>
source_type: codebase
source_lines: <wc -l for this directory>
language: <primary language by file count>
file_count: <code files in this directory>
part: <n> # parts only; omit for single-file digests
status: pending | absorbed | skipped
absorbed_at: YYYY-MM-DD
skip_reason: "<why it is not taught>" # required when status is skipped
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# L1 overview

- <module/directory> — <2–4 line summary of what it does>

# L2 detail

- `#L1-L40` — <module path> — <purpose, key exports, learner-relevant concept>
- `#L41-L88` — <module path> — <purpose, key exports, learner-relevant concept>
```

### Supplementing text with code and images

A book chapter or article rarely stands alone: the same batch often ships a codebase or a set of screenshots that the prose names. A `text` digest links those siblings through its `supplements` list:

- Each entry names a digest in the same `digests/` folder plus the entry to use: `<digest>.md#L1` for the digest's L1 overview, or `<digest>.md#Lx-Ly` for one of its L2 entries. A bare filename is invalid — the pointer must say which part of the supplement matters.
- Only a `codebase` digest has L2 ranges, so an L2 entry must match one of the target's L2 ranges (`server.md#L41-L88`). An `image` digest has no line ranges and is referenced by `#L1`.
- Only `text` digests declare `supplements`; the target must be a `codebase` or `image` digest, and a digest cannot supplement itself.
- A text digest without related code or figures omits the field — the list is additive, never a requirement.
- Build order: every `codebase` and `image` digest is written before the text digests that name it. A text digest never points at a supplement that does not exist yet.

Downstream, `nodes` and `article` treat a supplement as part of the text source's material: the text's L2 map still locates the prose, and the named supplement entry locates the code or figures. Because a codebase digest's `source` is a directory, a citation can point at any file inside it (`[[sources/<subject>/<YYYYMMDD>/<dir>/<file>#Lx-Ly]]`) and resolves against the directory digest's line map.

## Sub-agent workflow (large sources)

### PDF

1. Run `node scripts/pdf-backfill.mjs --subject <subject>` so every PDF has a stable `.txt`.
2. Run `node scripts/split-sources.mjs --subject <subject> --dry-run`, show the table, get confirmation, then `--apply`. Each chunk is already < 2000 lines and has part-local line numbers.
3. Dispatch sub-agents **in parallel**, one per `<source-stem>.<n>.part.txt`. Each sub-agent reads only its part, writes a self-contained part digest to `learn/<subject>/digests/<source-stem>.<n>.part.md` with `source_lines` and `status: pending` in its frontmatter, and returns only a compact TOC line for its chunk (chapter ids + `#Lx-Ly` ranges).

There is no merge step: the part files together are the digest.

### Codebase

1. Compute `wc -l` line count across all code files in the main context; split on top-level directory boundaries.
2. Dispatch sub-agents **in parallel**, one per top-level directory. Each sub-agent reads only its directory, writes a self-contained part digest to `learn/<subject>/digests/<dir-stem>.<n>.part.md` with `source_lines` (that directory's `wc -l`) and `status: pending` in its frontmatter, and returns only a compact TOC line for its directory (directory name + `#Lx-Ly` line map).

There is no merge step: the part files together are the digest.

Sub-agents never write anywhere outside `learn/<subject>/digests/`. Their returned message must stay small — the file carries the content, not the message.

## Batch-aware digest grouping

### Scope
This protocol extends the one-file-per-digest rule to accommodate the `ingest` skill’s new batch-aware behavior. When `ingest` processes a set of files archived in the same dated subfolder, it groups them into **clusters** based on topic relevance before creating digests. The goal is to produce one digest per meaningful learning unit that downstream `/absorb` can treat as a single concept block.

### Grouping principles

1. **The batch is the input.** `ingest` reads all files that were just moved into `sources/<subject>/YYYYMMDD/course/` or `.../supplement/`. It does not consider earlier archived files or anything in `raw/`.
2. **Clustering.** Files are clustered by semantic similarity. Two files belong in the same cluster if their combined content forms a coherent learning unit that `absorb` can reasonably consider as a single node goal. Standalone files that do not match any other file’s topic form single-file clusters.
3. **Digest name.** The cluster name is a prefix for discovery, not a merge: every citable source file gets its own digest (`<cluster-name>-<file-stem>.md`), because an L2 line map points into exactly one text file. A single-file cluster may use the original file stem. A digest never points at a `raw/` original.
4. **Large-source handling.** The size check and sub-agent path from the large-source sections still apply within a cluster. Part digests are named `<cluster-name>-<file-stem>.<n>.part.md`, so two large files in one cluster never collide.
5. **Locator preservation.** Each L2 entry records the source path and exact line range, e.g. `#L120-L168`. Image L2 entries keep the image path and a one-line description; they carry no line range.

### Image-only digests

Images without text counterparts are treated as a separate class: they form their own minimal digest(s) (one per related batch of images) with `source_type: image`. Their L1/L2 structure is lighter (no section summaries, just locator + one-line description).

### Backward compatibility

Existing per-file digests remain untouched. This batch-aware grouping applies only to files archived by future runs of `/ingest`. If a batch contains a single file, or if the learner explicitly opts out of clustering, the system falls back to the original one-file-per-digest behavior.

### Design rationale

- **Why not merge all files into one digest?** A single digest would obscure the semantic boundaries that `/absorb` needs to decide what goes into existing nodes vs. new nodes.
- **Why not keep strict one-file-per-digest?** Without clustering, the learning graph would become unnecessarily fragmented, leading to many single-file nodes that are trivial to teach.
- **Why not re-ingest existing digests?** Sources are immutable, and existing digests already have `status: absorbed`. Re-processing would duplicate work and risk breaking existing pipelines.

### Lint considerations

When validating digests, the linter checks frontmatter, that `source` exists and is not a PDF, that `source_lines` matches the `.txt`, that every L2 entry uses `#Lx-Ly`, and that every `supplements` entry names a sibling `codebase` or `image` digest. It also enforces the course/supplement/raw layout for subjects that declare `source_layout: course-supplement`, including a course source on every step and a role on every split part. It does not enforce the batch-aware clustering constraints.

## Digest lifecycle

Each digest has a `status` field in its frontmatter:

- `pending` — newly created, not yet consumed. Set by `/learn-init`, `/roadmap` (when building missing digests), and `/ingest`.
- `absorbed` — consumed and integrated. Set by `/roadmap` (after partitioning into nodes) or `/absorb` (after integrating into the learning graph).
- `skipped` — read and deliberately left untaught; needs a non-empty `skip_reason`.

Sources are immutable, so a digest is stable once written. A `pending` digest is ready for consumption; an `absorbed` digest has already been processed.

## Lazy detail pulls (`nodes`)

When a node's step planning needs detail beyond the digest:

1. Locate the `#Lx-Ly` entry in the digest's L2 map.
2. Read that slice of the `.txt` directly (or dispatch one sub-agent when the slice is large).
3. Only pull when the digest is genuinely insufficient; the digest remains the navigation layer.

## Source-grounded articles (`article`)

`article` is the stage that reads raw source, because an article that shows code must show the real code. `nodes` stays digest-only (above); `article` pulls the located slice on demand. A sub-agent does the read, so the raw text stays in its own context and never enters the main one.

A step's `sources` entries are the entry points. In a `course-supplement` subject, at least one must resolve to a `course/` file; `supplement/` and `raw/` do not satisfy that rule, and `raw/` is never citable. For a step with a source:

1. Resolve every `[[sources/<subject>/<role>/<file>#Lx-Ly]]` from the node's step entry.
2. Read only that slice — never the whole source. When a locator is absent or stale, fall back to the digest and mark the gap (below).
3. Write the article with code provenance, covering the full course range; the supplement supplies explanation and code, not a replacement for the course text.

### Code provenance

Read the source before writing code. When the source carries code, quote a short excerpt — around 10–25 lines — keeping the head and tail and replacing the omitted middle with a single `...` line. Every remaining line stays verbatim; never rewrite a line. When the source carries no code, write it from the prose, faithful to what the source says. Either way, every fenced code block carries an HTML comment above it (blank lines between the comment and the fence are ignored):

- quoted from source: `<!-- source: sources/<subject>/<file>#Lx-Ly -->`
- written from the prose: `<!-- derived -->`

`quiz` blocks are data, not code, and carry no provenance comment. `scripts/verify.mjs` fails any other fenced block without one.

Surfacing code applies to every step: whenever the prose names a file, function, API, or command — or the step's `sources` include a code file — surface the real code. A pure-theory article that involves no code surfaces none; never manufacture derived code to fill space.

### Missing source

A step whose source cannot be read — no `sources`, a stale locator, a moved code file, a digest without its raw — is still written. Mark the gap `[needs source]` at the claim and list it in the run's report; never invent a citation to cover it.

## Node count formula

For a `source_layout: course-supplement` subject, count only course text:

```text
characters = non-whitespace characters in every text file under a dated course/
target     = clamp(round(characters / 30000), 3, 30)
```

`supplement/` and `raw/` do not count. For an older subject without the layout marker, use the legacy formula:

```text
lines  = total .txt lines (PDFs) + total wc -l lines (codebases)
target = clamp(round(lines / 1100), 3, 30)
```

The formula produces the **baseline** for the roadmap checkpoint — a soft target, not a gate. The learner confirms or adjusts the final partition. Lint warns when the actual node count deviates more than ±40% from the target.
