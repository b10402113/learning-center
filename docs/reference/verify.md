# Verification Script Protocol

Shared contract for `scripts/verify.mjs` — the single CLI that runs every **deterministic format check** across a Markdown subject. `/nodes` and `/article` use it as a hard gate; the periodic lint uses it for whole-subject scans.

## Principle

The script checks **format correctness only**. It verifies frontmatter, step/article pairing, heading and list consistency, source locators, digest coverage, code provenance, quiz sidecars, image files, block format and coverage consistency, and link resolution — never prose quality or content semantics. Because it is the sole gate, an agent only fixes what it flags.

Every hard-failure rule has a negative fixture in `scripts/verify.test.mjs`: deliberately breaking the fixture must turn the rule red. Advisory flags are not fixtures.

## Usage

```text
node scripts/verify.mjs --node <subject>/<node-id>    # per-node gate
node scripts/verify.mjs --subject <subject>           # whole-subject lint
node scripts/verify.mjs --subject <subject> --json    # machine-readable report
```

Exit code: `0` = no failures, `1` = at least one failure, `2` = bad invocation. A non-zero exit is a hard gate.

## Output

- **SUMMARY** — one line: counts checked and failures/flags, exit status.
- **FAILURES** — `file:line  check-id  message`, one per failed check.
- **FLAGS** — advisory notes that never block.
- `--json` — `{ subject, counts, failures, flags, pass }` for tooling.

## Check reference

### Repository and node structure

| id | checks |
|---|---|
| `no-mdx` | the `learn/` tree contains no `.mdx` files (whole tree for `--subject`, one subject for `--node`) |
| `fm-parse` | frontmatter parses as YAML; malformed YAML is a failure, not a crash |
| `fm-required` | node frontmatter has `id, title, subject, tier, order, status, goal, digests, steps, created, updated` |
| `fm-status` | node `status` is `draft` / `confirmed` / `written` |
| `fm-subject` | node `subject` matches the subject argument |
| `id-filename` | node frontmatter `id` equals the filename |
| `steps-array` | node `steps` is an array; may be empty for a draft node |
| `steps-empty` | a `confirmed` or `written` node has at least one step |
| `node-digests-array` | node `digests` is a list of digest filenames |
| `node-digests-format` | every entry is a bare `<digest>.md` filename, not a path or line range |
| `node-digests-duplicate` | a digest is declared at most once |
| `node-digest-unknown` | every declared filename exists in `digests/` |
| `node-digest-status` | every declared digest is `absorbed` (a `pending` or `skipped` digest may not be declared) |
| `node-digest-undeclared` | every digest covering a step's `sources` is declared on that node |
| `node-digest-unused` | on a `confirmed`/`written` node, every declared digest is cited by at least one step (draft nodes are exempt) |
| `prerequisites-type` | `prerequisites` is a list when present |
| `prerequisite-path` | every entry is `learn/<subject>/nodes/<node-id>.md` |
| `prerequisite-missing` | every referenced node container exists |
| `prerequisite-subject` | every prerequisite stays inside the subject |
| `prerequisite-self` | a node never requires itself |
| `prerequisite-cycle` | the prerequisite graph is acyclic |
| `prerequisite-tier` | a prerequisite is in the same or an earlier tier |
| `step-entry` | every step entry has `id`, `purpose`, and `sources`; `title` is optional, and non-empty when present |
| `step-author` | `author` is optional; when present it must be a non-empty string |
| `step-purpose` | `purpose` is a single line of one short sentence (≤ 120 characters, no second sentence) |
| `step-blocks-type` | `blocks` is a list of block ids when present |
| `step-block-id` | every `blocks` entry is a non-empty kebab-case id |
| `step-block-duplicate` | a step lists each block at most once |
| `step-block-missing` | every step `blocks` id exists under `learn/<subject>/blocks/` |
| `node-blocks-limit` | a node links at most five distinct blocks across all its steps |
| `steps-flat` | step entries declare no `deps`, `type`, or `order` |
| `steps-duplicate` | step ids are unique within a node |
| `node-missing` | the requested `--node` exists |
| `node-container-missing` | every step folder has a matching `<node>.md` container |
| `roadmap-link` | every relative `nodes/<id>.md` link in `ROADMAP.md` resolves |
| `roadmap-node-orphan` | every node container is linked from `ROADMAP.md` (whole-subject checks only) |

### Step articles

| id | checks |
|---|---|
| `step-article-missing` | every step entry has `nodes/<node>/<step>.md` |
| `step-orphan` | every article in the node folder has a step entry |
| `step-h1` | when the entry has `title`, the article's first non-empty line is exactly `# <title>` |
| `step-title-missing` | an article with a body has its title written back to the step entry |
| `node-steps-list` | `## Steps` exists when the node has steps; each label is the step title when published, otherwise the id; ids and order match frontmatter |
| `node-step-link` | every `## Steps` link resolves relative to the node file |

`<!--image:N-->` is an HTML comment, not an image line. `verify` never requires a marker to have a matching file, so an article that still carries markers and no figures passes. For rendered `![...](./<step>-assets/image-N.webp)` lines it checks that the file exists, is a valid WebP, and lives under the step's asset folder, and it flags unreferenced files under `*-assets/` as orphans.

### Sources and digests

| id | checks |
|---|---|
| `src-format` | a step source parses as `[[sources/<subject>/...<file>#Lx-Ly]]`; new subjects use `<date>/<role>/`, legacy subjects still use the flat path |
| `src-path` | the source subject matches and the file exists |
| `src-pdf` | a citation never points at a PDF |
| `src-raw` | in a course-supplement subject, a citation never points at `raw/` |
| `src-course-missing` | in a course-supplement subject, every step cites at least one `course/` source |
| `src-locator-format` | the locator is `#Lx` or `#Lx-Ly` (no slugs) |
| `src-range` | `1 ≤ start ≤ end ≤ actual line count` |
| `src-slice-empty` | the cited slice is not blank |
| `src-digest-missing` | the source has a digest |
| `src-digest-range` | the citation is covered by the digest's L2 line map |
| `digest-fm` | digest frontmatter has `source, source_type, source_lines, status` |
| `digest-status` | digest `status` is `pending` / `absorbed` / `skipped` |
| `digest-skip-reason` | a `skipped` digest has a non-empty `skip_reason` |
| `digest-unreferenced` | an `absorbed` digest is declared by at least one node, unless it is a supplement (whole-subject checks only) |
| `digest-pending` | no digest is left `pending` (whole-subject checks only) |
| `digest-source` | digest `source` exists under `sources/<subject>/` |
| `digest-source-pdf` | digest `source` is the extracted `.txt`, never a PDF |
| `digest-source-raw` | in a course-supplement subject, a digest never points at `raw/` |
| `digest-source-layout` | in a course-supplement subject, a digest source lives under `course/` or `supplement/` |
| `digest-source-lines` | `source_lines` equals the cited file's actual line count (part digests and single-file text digests); directory sources only bound the ranges |
| `digest-range` | every L2 range is `1 ≤ start ≤ end`, and ends within the actual lines or declared `source_lines` |
| `digest-l2-empty` | the digest has an L2 line map (image digests excepted) |
| `digest-locator` | any source link inside a digest uses `#Lx-Ly`, not a slug |
| `digest-supplements` | `supplements` is a list declared only by a `text` digest, with non-empty non-self `<digest>.md#L1` / `#Lx-Ly` entries |
| `digest-supplement-missing` | every `supplements` entry names a digest in the same folder |
| `digest-supplement-type` | every `supplements` target is a `codebase` or `image` digest; an image only takes `#L1` |
| `digest-supplement-range` | a supplement's `#Lx-Ly` falls inside the target codebase digest's L2 line map |
| `digest-supplement-status` | a supplement of a `skipped` digest is itself `skipped` |
| `source-parts-json` | `<stem>.parts.json` parses as a JSON object |
| `source-parts-text` | the manifest's `text` path is under `sources/<subject>/` |
| `source-parts-total` | `total_lines` is positive and, while the original `.txt` still exists, equals its line count |
| `source-parts-list` | `parts` is a non-empty list of objects |
| `source-parts-order` | `parts[n].part` is `n + 1` in order |
| `source-parts-file` | every part `file` is a bare filename and resolves in its role folder (or beside the manifest in the legacy layout) |
| `source-parts-role` | in a course-supplement subject, every part declares `role: course` or `role: supplement` |
| `source-parts-location` | in a course-supplement subject, a `<stem>.parts.json` manifest lives under `raw/` |
| `source-parts-range` | every part has positive integer `start`/`end` with `start ≤ end` |
| `source-parts-lines` | `lines = end - start + 1` and equals the part file's actual line count |
| `source-parts-coverage` | the ranges start at 1, tile the original with no gap or overlap, and sum to `total_lines` |
| `digest-source-split` | a digest for a split source cites its part file, never the unsplit source |
| `source-parts-digest-missing` | every manifest part is claimed by exactly one digest part |
| `source-parts-digest-duplicate` | no two digests claim the same manifest part |
| `source-parts-digest-part` | a digest's `part` field matches the manifest part number |

### Blocks and coverage

| id | checks |
|---|---|
| `block-fm-parse` | block frontmatter parses as YAML |
| `block-id-filename` | block frontmatter `id` equals the filename |
| `block-subject` | block `subject` matches the subject argument |
| `block-slug` | the block id, and an optional `slug`, is kebab-case |
| `block-type` | `type` is `concept` / `procedure` / `principle` / `contrast` |
| `block-status` | `status` is `draft` / `reviewed` |
| `block-title` | `title` is a non-empty string |
| `block-label` | `label` is non-empty, ≤ 40 characters, one line, at most 4 words, does not start like a sentence, and carries no sentence punctuation |
| `block-summary` | `summary` is non-empty, one line, and ≤ 120 characters |
| `block-alias-type` | `aliases` is a list of kebab-case ids |
| `block-alias-duplicate` | no alias repeats inside a block |
| `block-alias-conflict` | no alias collides with another block id |
| `block-prerequisite-type` / `block-related-type` | relations are lists of block ids |
| `block-prerequisite-subject` / `block-related-subject` | a relation is a bare id in the same subject |
| `block-prerequisite-duplicate` / `block-related-duplicate` | no relation repeats |
| `block-prerequisite-self` / `block-related-self` | a block never relates to itself |
| `block-section` | the block body has every `##` section required by its type |
| `block-sources-type` | `sources` is a list when present |
| `block-sources-empty` | a block has at least one source |
| `block-prerequisite-missing` / `block-related-missing` | every relation target exists |
| `block-prerequisite-cycle` | the prerequisite graph is acyclic |
| `block-inline-link` | every inline `[[block-id]]` resolves in the subject |
| `coverage-missing` | a subject with blocks has `blocks/coverage.json` |
| `coverage-json` | coverage parses as a JSON object |
| `coverage-steps` | coverage has a `steps` object |
| `coverage-subject` | coverage `subject` matches the subject folder |
| `coverage-step` | every coverage key has a matching step entry and article |
| `coverage-step-status` | every coverage key belongs to a `written` node |
| `coverage-concepts` | every coverage step has a `concepts` array |
| `coverage-slug` | every concept `slug` is kebab-case |
| `coverage-slug-duplicate` | no concept slug repeats within a step |
| `coverage-label` | every concept has a non-empty `label` |
| `coverage-sources` | every concept has at least one source |
| `coverage-block-field` | every concept declares `block` (an id or `null`) |
| `coverage-block-missing` | a non-null `block` exists in `blocks/` |
| `coverage-step-blocks` | a covered concept's block also appears in the step entry's `blocks:` |
| `coverage-step-block-uncovered` | every step `blocks:` entry has a coverage concept |

Block `sources` use the same `src-*` rules as step sources, and block code blocks use `code-provenance`. Coverage gaps, short steps, and unused blocks are reported by `scripts/blocks.mjs report|check`, not as hard failures.

### Code, links, and flags

| id | checks |
|---|---|
| `code-provenance` | every fenced code block (except `quiz`) is preceded by `<!-- source: sources/…#Lx-Ly -->` or `<!-- derived -->`; a source comment must resolve to an existing file and non-empty range |
| `quiz-json` | a `quiz` block is a JSON object with a non-empty `question` |
| `quiz-options` | `options` is an array of 2–5 non-empty strings |
| `quiz-answer` | `answer` is a 0-based integer index into `options` |
| `quiz-explain` | `explain` is a non-empty string |
| `quiz-file-json` | a `<step>.quiz.json` sidecar parses as a JSON object |
| `quiz-file-marker` | the sidecar sets `"quiz-generated": true` |
| `quiz-file-count` | `questions` is an array of 3–8 entries, capped lower for short articles by `min(8, max(3, round(CJK字數 / 250)))` |
| `quiz-file-question` | every sidecar question has a non-empty `question` |
| `quiz-file-options` | every sidecar question has 2–5 non-empty `options` |
| `quiz-file-answer` | every sidecar `answer` is a 0-based index into its options |
| `quiz-file-explain` | every sidecar question has a non-empty `explain` |
| `quiz-orphan` | every `<step>.quiz.json` belongs to a real step article and node-plan entry |
| `link` | relative Markdown links resolve |
| `image-missing` | every local Markdown image target exists |
| `image-format` | every referenced image is a `.webp` file with a WebP header |
| `image-location` | every local image lives under `nodes/<node>/<step>-assets/` |
| `image-orphan` | every file in a step's `*-assets/` directory is referenced by its article, and every `*-assets/` directory belongs to a real step |
| `image-plan` | `<step>.plan.json` parses as an array of 1–5 items, each with a non-empty `prompt` |
| `image-plan-orphan` | every `<step>.plan.json` belongs to a real step entry |
| `sources-empty` | step has at least one source link (flag) |
| `source-layout` | in a course-supplement subject, every source file lives under a dated `course/`, `supplement/`, or `raw/` folder |
| `source-layout-marker` | a present `source_layout` value is exactly `course-supplement` |
| `source-layout-no-course` | a course-supplement subject has at least one `.txt` under a dated `course/` folder |
| `lint-node-count` | node count is within ±40% of the formula baseline (course characters for a course-supplement subject, legacy lines otherwise) (flag) |

## False-positive policy

The check set stays deterministic so it rarely misfires:

- Line counts use newline characters, matching `wc -l`. A parts manifest's `total_lines` counts a final line that lacks a trailing newline; every generated part file is newline-terminated.
- A source with `<stem>.parts.json` is split: the parts tile the original, and each part file has exactly one digest whose `source` points at that chunk.
- Digest coverage is the union of L2 ranges, so adjacent ranges may jointly cover a citation.
- Codebase digests may cover citations by directory prefix.
- An absorbed codebase/image supplement needs no node of its own: it rides on its text digest, and is declared only when a step cites its files.
- A `draft` node may declare digests before any step exists, so `node-digest-unused` only applies to `confirmed`/`written` nodes.
- Whole-subject-only rules (`digest-unreferenced`, `digest-pending`) stay out of `--node` so one node's gate never fails on another node's or a new ingest's digests.
- Fenced code and inline code are stripped before link checking.
- `.DS_Store` and hidden files are ignored.
- The layout checks (`source-layout`, `source-layout-marker`, `source-layout-no-course`, `src-raw`, `src-course-missing`, `digest-source-raw`, `digest-source-layout`, `source-parts-role`, `source-parts-location`) apply only when `MEMORY.md` declares `source_layout: course-supplement`; older subjects keep the legacy rules.

If a legitimate file trips a check, fix the file rather than relaxing the rule — the script is the contract.
