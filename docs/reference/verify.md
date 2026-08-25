# Verification Script Protocol

Shared contract for `scripts/verify.mjs` — the single CLI that runs all **deterministic format checks** across the learning path. `nodes` uses it as the per-node gate (step 11); the AGENTS.md periodic lint uses it for whole-subject scans.

## Principle

The script checks **format correctness only**. It verifies frontmatter, IDs, DAG consistency, reference resolution, and section presence — never prose quality or content semantics. Prose style, depth calibration, contradictions, and style conformance are deliberately out of scope; the learner is the final judge of those. Because the script is the sole gate, the LLM only fixes what it flags and never re-reads an article body to judge it.

## Usage

```text
node scripts/verify.mjs --node <subject>/<node-id>    # per-node gate (/nodes step 11)
node scripts/verify.mjs --subject <subject>           # whole-subject lint
node scripts/verify.mjs --subject <subject> --json    # machine-readable report
```

Exit code: `0` = no failures, `1` = at least one failure. A non-zero exit is a hard gate.

## Output

- **SUMMARY** — one line: counts checked and failures/flags, exit status.
- **FAILURES** — `file:line  check-id  message`, one per failed check.
- **FLAGS** — advisory notes (e.g. node-count deviation, orphans). Never block.
- `--json` — `{ subject, failures, flags, pass }` for tooling.

## Check reference

### Structure and links (both scopes)

| id | checks |
|---|---|
| `fm-required` | required frontmatter keys present per file type |
| `fm-status` | node `status` is a legal value |
| `fm-nodes-no-elements` | node container carries no flat `elements` list |
| `fm-type` | element `type` is `article`/`video`; `video` has `videoUrl` |
| `id-filename` | frontmatter `id` equals the filename |
| `dag-step-exists` | every step in the node DAG has a step file |
| `dag-orphan-step` | every step file appears in its node's DAG |
| `dag-order-deps` | `deps` reference same-node steps; orders unique |
| `link-element` / `link-step` / `link-node` | wiki links resolve to existing files |
| `teaches-resolves` | step `teaches` elements exist |
| `elem-nodes-ref` | element `nodes` reference existing nodes |
| `src-path` | source link subject matches; source file exists |
| `src-locator` | locator resolves in a digest (containment match) |
| `digest-hash` | digest `source_hash` matches a source file |
| `elem-connections` | Connections section present with ≥2 element links |
| `elem-questions` | Questions section present |

Section-heading checks (`elem-connections`, `elem-questions`) are **localization-aware**: they match either the bare English heading (`## Connections`) or a localized heading carrying the English token in parentheses or full-width parens (e.g. `## 自檢問題 (Questions)`).

### Whole-subject only

| id | checks |
|---|---|
| `lint-node-count` | actual node count within ±40% of the formula baseline (flag) |
| `lint-orphan` | node/step/element files unreferenced by any link (flag) |
| `lint-edge-refs` | edge `from`/`to`/`nodes` resolve |
| `lint-digest-all` | every source file has a matching digest hash |

## False-positive policy

The check set is deliberately limited to determinism so it rarely misfires. Known tolerance points:

- `src-locator` uses containment, not exact equality — a node locator may be a sub-range of a digest locator.
- Localized section headings are matched by their English token, not a language map.
- `.DS_Store` and hidden files are ignored.
- Edges are terminal pages discovered by the graph generator, never by wiki links, so they are not reported as orphans.

If a legitimate file trips a check, fix the file rather than relaxing the rule — the script is the contract.
