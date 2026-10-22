# Verification Script Protocol

Shared contract for `scripts/verify.mjs` — the single CLI that runs every **deterministic format check** across a Markdown subject. `/nodes` and `/article` use it as a hard gate; the periodic lint uses it for whole-subject scans.

## Principle

The script checks **format correctness only**. It verifies frontmatter, step/article pairing, heading and list consistency, source locators, digest coverage, code provenance, and link resolution — never prose quality or content semantics. Because it is the sole gate, an agent only fixes what it flags.

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
| `fm-required` | node frontmatter has `id, title, subject, tier, order, status, goal, steps, created, updated` |
| `fm-status` | node `status` is `draft` / `confirmed` / `written` |
| `fm-subject` | node `subject` matches the subject argument |
| `id-filename` | node frontmatter `id` equals the filename |
| `steps-array` | node `steps` is an array; may be empty for a draft node |
| `steps-empty` | a `confirmed` or `written` node has at least one step |
| `step-entry` | every step entry has `id`, `title`, `purpose`, and `sources` |
| `steps-flat` | step entries declare no `deps`, `type`, or `order` |
| `steps-duplicate` | step ids are unique within a node |
| `node-missing` | the requested `--node` exists |
| `node-container-missing` | every step folder has a matching `<node>.md` container |

### Step articles

| id | checks |
|---|---|
| `step-article-missing` | every step entry has `nodes/<node>/<step>.md` |
| `step-orphan` | every article in the node folder has a step entry |
| `step-h1` | the article's first non-empty line is exactly `# <step title>` |
| `node-steps-list` | `## Steps` exists when the node has steps; titles, ids, and order match frontmatter |
| `node-step-link` | every `## Steps` link resolves relative to the node file |

### Sources and digests

| id | checks |
|---|---|
| `src-format` | a step source is `[[sources/<subject>/<file>#Lx-Ly]]` |
| `src-path` | the source subject matches and the file exists |
| `src-pdf` | a citation never points at a PDF |
| `src-locator-format` | the locator is `#Lx` or `#Lx-Ly` (no slugs) |
| `src-range` | `1 ≤ start ≤ end ≤ actual line count` |
| `src-slice-empty` | the cited slice is not blank |
| `src-digest-missing` | the source has a digest |
| `src-digest-range` | the citation is covered by the digest's L2 line map |
| `digest-fm` | digest frontmatter has `source, source_type, source_lines, status` |
| `digest-status` | digest `status` is `pending` / `absorbed` |
| `digest-source` | digest `source` exists under `sources/<subject>/` |
| `digest-source-pdf` | digest `source` is the extracted `.txt`, never a PDF |
| `digest-source-lines` | `source_lines` equals the actual `.txt` line count (single-file digests); directory sources only bound the ranges |
| `digest-range` | every L2 range is `1 ≤ start ≤ end`, and ends within the actual lines or declared `source_lines` |
| `digest-l2-empty` | the digest has an L2 line map (image digests excepted) |
| `digest-locator` | any source link inside a digest uses `#Lx-Ly`, not a slug |

### Code, links, and flags

| id | checks |
|---|---|
| `code-provenance` | every fenced code block (except `quiz`) is preceded by `<!-- source: sources/…#Lx-Ly -->` or `<!-- derived -->`; a source comment must resolve to an existing file and non-empty range |
| `link` | relative Markdown links resolve |
| `sources-empty` | step has at least one source link (flag) |
| `lint-node-count` | node count is within ±40% of the formula baseline (flag) |

Image-existence and orphan-asset checks land with the image ticket; `quiz` JSON validation lands with the reading-experience ticket.

## False-positive policy

The check set stays deterministic so it rarely misfires:

- Line counts use newline characters, matching `wc -l`.
- Digest coverage is the union of L2 ranges, so adjacent ranges may jointly cover a citation.
- Codebase digests may cover citations by directory prefix.
- Fenced code and inline code are stripped before link checking.
- `.DS_Store` and hidden files are ignored.

If a legitimate file trips a check, fix the file rather than relaxing the rule — the script is the contract.
