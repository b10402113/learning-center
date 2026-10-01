---
source: sync
source_type: codebase
source_lines: 364
language: markdown
file_count: 3
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — sync

## Overview (L1)

- `/sync` runs as the last step after a change is complete, around merge, to keep durable knowledge current: it reconciles root and nested `AGENTS.md`, the feature scope, and linked specs' `**Status**:` lines to what the repo now shows, and flags what it must not edit (stale specs, curated prose).
- It is surgical: it adds lines and rewrites only single lines it owns, never a whole section and never curated prose. `AGENTS.md` is the canonical tool agnostic file and `CLAUDE.md` is only a pointer to it.
- It reads `git` state and the diff, filters to source files (dropping docs, tests, and lock files as change sources), and does the whole maintenance inline on the main thread following `agent-prompt.md`, the single source of truth for the rules. A `NOTHING_TO_SYNC` run is a normal, good outcome.

## Structure (L2)

### What this skill does (role and canonical file)

- Locator: `[[sources/jsm-skills/20261001/skills/sync/SKILL.md#What this skill does]]`
- Purpose: States that /sync closes the loop on a completed change by syncing context files, scope, and spec status lines.
- Key rules: `agent-prompt.md` is the single source of truth for maintenance rules, SKILL.md covers only orchestration; the main thread reads it and does the work itself; durable context lives in tool agnostic `AGENTS.md`, and `CLAUDE.md` is a pointer, never edited as content.
- Learner-relevant: separating orchestration (skill) from the authoritative rulebook (agent-prompt) keeps behavior testable and lean.

### Boundaries (the exact ownership contract)

- Locator: `[[sources/jsm-skills/20261001/skills/sync/SKILL.md#Boundaries]]`
- Purpose: A table drawing precisely what /sync may edit versus what belongs to other skills or a human.
- Key rules: may edit existing root/nested AGENTS.md, reconcile the root `## Build approach` line, add a `design.md` pointer, create a nested AGENTS.md only for an area net new in this change, and reconcile spec `**Status**:` lines and the relevant workspace scope; must not create/restructure root, edit spec content, or rewrite curated prose (flags instead).
- Learner-relevant: the dividing line for creating a doc is **context, not policy** — create only when the change shows the whole area, else flag for `/audit`; an `Assumed` spec is left `Assumed` and surfaced, cleared only by `/architect`.

### Scope the change set

- Locator: `[[sources/jsm-skills/20261001/skills/sync/SKILL.md#1. Scope the change set (cheap, with per file status)]]`
- Purpose: Determines the exact files that changed, with added/modified/deleted status, before any writing.
- Key rules: check freshness first (`git fetch`, warn if behind `origin/<base>`); base is `main` if it exists else `master`; use `--name-status` (the net new area and orphan logic need A/M/D); mode `uncommitted` if the branch is the base, else `branch` via `git merge-base`; add untracked files with an `A` status; filter to source files (drop docs/config, tests, and lock files; keep `D` entries for orphan cleanup and dependency manifests for tool discovery).
- Learner-relevant: if only docs/tests/lock/generated files changed, stop with nothing to sync; tests and docs are never a change source for conventions.

### Discover Agent Skills and optional MCPs for newly added tools

- Locator: `[[sources/jsm-skills/20261001/skills/sync/SKILL.md#2.5 Discover Agent Skills and optional MCPs for newly added tools]]`
- Purpose: Offers to find Agent Skills and MCP servers for significant tools the change added.
- Key rules: run only when manifests changed or a significant external tool was added; **asking is mandatory, searching is not** (offer find-for-me, I'll-name, skip-and-record, or not-now before any search); after `Yes`, isolate the search in a read only subagent on a fast low cost model; offer matches in a grouped multi select and never install or connect automatically.
- Learner-relevant: consent before search/fetch/install, and offloading discovery to keep the main context bounded.

### Sync maintenance guide (agent-prompt.md)

- Locator: `[[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#Sync Maintenance Guide (main thread)]]`
- Purpose: The authoritative rulebook the main thread follows at write time.
- Key rules: be conservative — when in doubt, flag rather than write; default to doing nothing (code that doesn't alter a command, convention, constraint, dependency, or structure is churn, not maintenance); never write content into CLAUDE.md and never overwrite an existing AGENTS.md; creating a nested AGENTS.md also creates its sibling CLAUDE.md pointer.
- Learner-relevant: durable knowledge is defined by durability, not by narrating what a change did.

### Update existing AGENTS.md files

- Locator: `[[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#1. Update existing AGENTS.md files (only where the change made them inaccurate)]]`
- Purpose: The rules for surgically correcting root/nested context files.
- Key rules: edit only for a changed command, convention, constraint, dependency, broken file pointer, or a new durable rule; edits must be surgical (specific lines), additive or corrective, and durable; be idempotent (a second run on the same change makes zero new edits); never overwrite curated prose (record under `CONFLICTS`); Agent Skill/MCP records go in the right `## Agent skills` section as individual bullets, and a `design.md` pointer is one line, never a copy.
- Learner-relevant: idempotency and surgical edits are what keep a living doc trustworthy across repeated runs.

### The mirrored root fields

- Locator: `[[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#The mirrored root fields]]`
- Purpose: The contract for root AGENTS.md's two mirrored fields.
- Key rules: `## Stack` mirrors the architecture spec (the one under `docs/specs/` with a `## Proposed stack` section) and `## Build approach` mirrors the scope header's line; each has exactly one source of truth and no skill may invent a value; if missing, add the one line; if they disagree or the file carries elaborated curated prose, flag the divergence naming the source file rather than picking a winner.
- Learner-relevant: single source of truth plus flag-don't-overwrite prevents silent drift between duplicated facts.

### Reconcile linked specs' Status line

- Locator: `[[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#4. Reconcile linked specs' Status line (edit ONLY the `**Status**:` line, never spec content)]]`
- Purpose: Keeps a spec's status in step with its feature's lifecycle.
- Key rules: mapping is scope `planned`→`Proposed`, `in-progress`→`In Progress`, `done`→`Accepted`; `Superseded` is never set from scope status and is flagged instead; an `Assumed` spec is the exception and stays `Assumed`; applies only to specs linking a buildable scope feature (a standalone decision spec is left as is); read the spec again just before writing and edit only that one line.
- Learner-relevant: status mirrors are only safe when the link to exactly one feature is unambiguous; otherwise flag, never guess.

### Reconcile the feature scope

- Locator: `[[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#6. Reconcile the feature scope (only if SCOPE_PATH_OR_NONE is a path)]]`
- Purpose: Ticks completed sub tasks and advances feature status in the relevant workspace scope, from repo evidence.
- Key rules: only the scope file(s) handed in, never all of `docs/scope/`; /sync is the universal sub task reconciler for the `/test`, `/audit`, and `/sync` sub tasks no one else ticks; evidence per type (verify.md, test files, `docs/reviews/`, a PR body/CHANGELOG/release note, linter config, etc.); strictly status only (never add/remove/reorder features or checkboxes); tick only on unambiguous file→feature mapping, never downgrade an engineer's `done`, and never act on malformed scope.
- Learner-relevant: repo state decides which sub tasks are done; the diff only picks which features to re-check.

### Report

- Locator: `[[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#7. Report]]`
- Purpose: The fixed, verbatim output block listing everything /sync did or refused to do.
- Key rules: sections are `AGENTS_UPDATED`, `AGENTS_CREATED`, `ORPHANS_CLEANED`, `SCOPE_RECONCILED`, `SPEC_STATUS_RECONCILED`, `STALE_SPECS`, `CONTEXT_GAPS`, `CONFLICTS` (omit empty ones); if nothing changed or was stale, output `SCOPE: <N> changed files` plus `NOTHING_TO_SYNC`; a failed or empty run is reported as a failure, never fabricated as a result.
- Learner-relevant: a machine-parseable summary that distinguishes real success from a crash is what makes the skill safe to automate.
