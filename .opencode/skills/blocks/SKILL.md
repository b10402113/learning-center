---
name: blocks
description: 把 written step 文章萃取成獨立 block 知識點：先 audit、一次確認 subject 級表格，再建立 draft block、更新 step blocks:、重算 coverage；也支援 report、check、merge、refresh 與 rewrite。當使用者要把課程知識點抽成 block、維護知識圖或檢查 coverage/drift 時使用。
disable-model-invocation: true
argument-hint: "<subject> [--node <id> | --step <node>/<step>] [--audit] [--write] [--report] [--check] [--refresh <block-id>] [--rewrite <block-id>] [--force] [--yes]"
---

Invoke as `/blocks <subject> [--node <id> | --step <node>/<step>] [--audit] [--write] [--report] [--check] [--refresh <block-id>] [--rewrite <block-id>] [--force] [--yes]`.

This skill turns a subject's published steps into standalone blocks under `learn/<subject>/blocks/`. A block is one named knowledge point a stranger can read without any step. Steps stay the teaching narrative; they link to blocks through `steps[].blocks` and the coverage report measures how much of the course is covered.

No mode flag means audit → confirm → write → apply → report. `--audit` stops after the table; `--write` reuses existing audits; `--report` and `--check` are read-only.

Only process `written` nodes and steps that have an article body. The CLI owns file discovery, coverage math, drift, and merge rewriting; the block-agent owns the concept judgment and the block prose. Never hand-write `coverage.json`, a node's `blocks:` array, or a block file the CLI can produce.

## 1. Resolve and inspect

Run from the repo root. `--node` limits the run to one node; `--step <node>/<step>` limits it to one step.

```bash
node scripts/blocks.mjs audit --subject <subject> [--node <id>] [--step <node>/<step>] --json
```

The manifest has:

- `nodes[]` — every eligible node, with its `audit` path and each step's `id`, `article`, `title`, `purpose`, `sources`, and current `blocks`.
- `blocks[]` — the subject's existing blocks, so candidates can reuse or merge instead of duplicating.
- `skipped[]` — written nodes or steps with no article body and the reason.

Report the eligible node/step count and every skipped item before dispatching. Do not infer the subject from a node id or the conversation.

## 2. Audit: one block-agent per node

Dispatch one `block-agent` per eligible node, in batches sized by the session's subagent budget (default 5). In a single message use one `task` call per node with `subagent_type: block-agent`. Never give an agent another node's steps.

Each task message contains only:

- The subject, node id, and mode `audit`.
- That node's `steps[]` from the manifest (id, article, title, purpose, sources, current blocks).
- The subject's `blocks[]` summary, so it can decide new / reuse / merge / fuzzy.
- Its exact audit path: `learn/<subject>/output/blocks/<node>.audit.json`.
- One line: initial audit 3–6 concepts per step; a short step may have 1–2 only with a `note`; more than 6 is capped, never split. The main agent trims the audit to the confirmed five-block selection later.
- One line: labels are nouns (`Tool Calling`, `Bubble Sort`), sentences go in the block summary.
- One line: sources are a subset of that step's sources and keep the `[[sources/...#Lx-Ly]]` form.
- One line: dedupe against existing ids, aliases, and normalized labels; ambiguous overlaps are `fuzzy` and need a human.
- One line: write only the audit file, then run `node scripts/blocks.mjs audit --subject <subject> --node <node> --check` until there is no `[fail ...]`; this is the only command it may run.
- One line: do not edit a step, node, block, source, or digest in audit mode.

Then validate all audits:

```bash
node scripts/blocks.mjs audit --subject <subject> --check --json
```

Exit 1 means at least one audit is unusable. Re-dispatch the same node's agent with the exact failures and rewrite the audit. Warnings:

- `audit-concept-short` — require a `note` explaining why the step supports fewer than 3 concepts.
- `audit-concept-overflow` — keep the six strongest; do not split the step.
- `audit-new-existing` — change the candidate to `reuse` against that block.

## 3. Confirm once, at subject level

Read the audit files and build one table, grouped by node:

| node / step | concept (label) | match | block |
| --- | --- | --- | --- |
| tools-are-the-runbook / classify-item-and-draft-reply | Tool Calling | reuse | tool-calling |
| tools-are-the-runbook / classify-item-and-draft-reply | Grounded Generation | new | (new) |
| tools-are-the-runbook / classify-item-and-draft-reply | Classification | fuzzy | (needs decision) |

Above the table, print counts: eligible steps, concepts, `new` / `reuse` / `merge` / `fuzzy`, uncovered candidates, short steps, overflow steps. Below it, list every merge candidate and every fuzzy overlap with a one-line recommendation.

A node may link **at most five blocks across all its steps**. When a node's table has more than five `new`/`reuse` concepts, keep the five that carry the node's goal. Show the selected five and the deferred remainder in the confirmation table. After confirmation, rewrite that node's audit to only the selected concepts (with a step `note` when a step keeps fewer than three) so coverage measures the agreed plan, not the raw concept inventory.

Ask the learner to confirm the whole table once. `--yes` skips the question. If `--audit` was passed, stop here. If the learner rejects or edits rows, adjust the audit files or the match kinds and re-present; do not start writing.

Deduplication rules the table must already obey:

- Same id, alias, or normalized label → `reuse`, never a second block.
- Two existing blocks that are the same idea → propose `merge` with the canonical id unchanged.
- A fuzzy candidate never becomes a merge automatically; the learner names the target or keeps it as a separate block.
- The same concept used by several steps is one block linked from each step.

## 4. Write: create drafts and link steps

First resolve every confirmed merge with the CLI. Merging is draft-only; a `reviewed` block must be changed through `--rewrite` instead. v1 keeps the canonical id and puts the old id in `aliases`, with no URL redirect.

```bash
node scripts/blocks.mjs merge --subject <subject> --from <old-id> --into <canonical-id> --dry-run --json
node scripts/blocks.mjs merge --subject <subject> --from <old-id> --into <canonical-id> --json
```

The dry run prints every file the merge will touch; show it before applying. The applied merge rewrites all step `blocks:` entries and all block `prerequisites` / `related`, removes the old block file, and recomputes coverage. Do not perform this rewrite by hand.

Select at most five blocks per node from the confirmed table. Assign each selected `new` concept to exactly one owning node (the first node that needs it), and rewrite the node's audit to the selected concepts before `apply`; deferred concepts are outside this pilot's coverage. Dispatch one `block-agent` per node again, in batches sized by the session's subagent budget (default 5), with mode `write`:

- The node's steps and the confirmed concept list for that node.
- For `reuse` / `merge`: the target block id to link, and no block file to create.
- For `new` concepts owned by another node: only the block id to link; do not create a second copy.
- The existing `reviewed` block ids, with one line: never overwrite or edit a `reviewed` block.
- One line: update only the node's `steps[].blocks` and create only its assigned draft blocks; do not edit prose, sources, digests, or another node.

After every node returns:

```bash
node scripts/blocks.mjs apply --subject <subject>
node scripts/verify.mjs --subject <subject>
node scripts/blocks.mjs report --subject <subject>
```

`apply` rebuilds `blocks/coverage.json` from the confirmed audits and the step `blocks:` entries. `verify` is the format gate; if it reports `coverage-step-blocks` or `coverage-step-block-uncovered`, the step and audit disagree — fix the audit or the node entry, then rerun `apply` and `verify`. Never silence verify by editing `coverage.json` by hand. Then show the report: Step coverage, Course coverage, current blocks, projected blocks, reuse factor, and the uncovered concept list.

## 5. Refresh, rewrite, and force

- `--refresh <block-id>` — one block drifted. Run `check`, read the block, the steps that use it, and its sources, then write the proposed body to `learn/<subject>/output/blocks/<id>.proposed.md` (same frontmatter) and run `diff -u learn/<subject>/blocks/<id>.md learn/<subject>/output/blocks/<id>.proposed.md`. Show that diff, confirm, then replace the official file. A `draft` may be written after confirmation; a `reviewed` block requires `--rewrite` instead.
- `--rewrite <block-id>` — same proposed-file and `diff -u` step, but for a `reviewed` block. Always show the diff first and require an explicit confirmation; then write it, rerun `apply` and `verify`.
- `--force` — with a default or `--write` run, regenerate existing `draft` blocks from the confirmed audit. It never overwrites a `reviewed` block. It does not change a node's step plan or create concepts that are not in the audit.

A refresh or rewrite must keep the block's `id`, `subject`, `aliases`, `prerequisites`, `related`, and `status`; only the prose and, when the source changed, `updated` move.

## 6. Check (read-only)

```bash
node scripts/blocks.mjs check --subject <subject>
```

Report the drift as printed, grouped by kind: a step newer than its block, a block source the step no longer cites, an uncovered concept, an orphan block, and a broken or cyclic prerequisite. Recommend `--refresh <id>` for one drifted draft, `--rewrite <id>` for a reviewed block, `/blocks <subject>` for uncovered concepts, and a manual relation fix for a broken prerequisite. Do not rewrite anything in this mode.

## Completion

- Every eligible written step has an audit matching the confirmed selection; a node links at most five blocks, and a step that keeps fewer than three concepts carries a `note`.
- The subject-level table was confirmed once, or `--yes` was passed.
- Confirmed `new` concepts have draft blocks; reused concepts link an existing block; every step `blocks:` matches its audit.
- Merged ids live in the canonical block's `aliases`, and no file references the old id.
- `node scripts/blocks.mjs apply` has run, `node scripts/blocks.mjs report` answers current blocks / projected blocks / Step coverage / Course coverage, and `node scripts/verify.mjs --subject <subject>` exits 0.
- No `reviewed` block was silently overwritten.
