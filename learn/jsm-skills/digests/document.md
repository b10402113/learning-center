---
source: document
source_type: codebase
source_lines: 381
language: markdown
file_count: 7
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — document

## Overview (L1)

- `/document pr | changelog | release-note | postmortem` writes human facing prose about a change from the recorded change history, never from imagination: every sentence traces to a real commit, diff, or engineer supplied incident fact, and every document is pitched at the reader who has to act on it.
- It picks one of four document types, reads the matching template plus `agent-prompt.md` at write time, and writes to that type's owned target: PR title/body, `CHANGELOG.md`, `docs/releases/<version>.md`, or `docs/postmortems/<date>-<slug>.md`. It never writes code, tests, or specs, and never commits, pushes, or merges.
- It acts, asking at most one question (which type) when it cannot infer it, plus the incident facts a postmortem needs from git. The core rule is grounding: what changed comes from the diff, and `pr` only touches `gh` per the resolved `GH_ACTION` (chat only, create, or edit).

## Structure (L2)

### What this skill does (role and the four type table)

- Locator: `[[sources/jsm-skills/20261001/skills/document/SKILL.md#What this skill does]]`
- Purpose: States the writer role and maps each type to its source, audience, and output.
- Key rules: `pr` = branch commits + diff vs base, for reviewers, a title + body shown in chat; `changelog` = merged change, for developers, appended to `CHANGELOG.md`; `release-note` = a tag/version range, for end users, `docs/releases/<version>.md`; `postmortem` = engineer described incident + any `/debug` record, for the team, `docs/postmortems/<date>-<slug>.md`.
- Learner-relevant: choosing the right document form for the audience is itself a skill; each form has one primary reader.

### Determine the document type

- Locator: `[[sources/jsm-skills/20261001/skills/document/SKILL.md#1. Determine the document type]]`
- Purpose: Resolves which of the four documents to write.
- Key rules: use the passed argument if given; otherwise infer from context (feature branch ahead of base → `pr`, just tagged → `release-note`), then confirm or ask one question; mark the inferred type `(recommended)` and keep the free text custom slot last.
- Learner-relevant: infer when obvious, confirm with exactly one recommendation, never a cold neutral menu.

### Gather the source material

- Locator: `[[sources/jsm-skills/20261001/skills/document/SKILL.md#2. Gather the source material]]`
- Purpose: Collects the lightweight git history and the per type edge facts before writing.
- Key rules: use `git log --oneline BASE..HEAD` and `git diff --name-only BASE...HEAD` (BASE = `main` if it exists else `master`); for `release-note` list tags and handle `NO_TAGS` by asking for a version and range rather than guessing; `pr` records `GH_INSTALLED`, `HAS_REMOTE`, `PR_EXISTS`; a postmortem asks the engineer for what broke, when (with timezone), impact, detection, and root cause.
- Learner-relevant: the diff is the source of truth, commits are hints; range/tag resolution is part of documenting a release.

### Write the document (the write-time inputs)

- Locator: `[[sources/jsm-skills/20261001/skills/document/SKILL.md#3. Write the document (main thread)]]`
- Purpose: Tells the main thread to write the doc itself from a fixed list of inputs.
- Key rules: read `agent-prompt.md` and the one chosen template only now, at write time; for `pr` the gh action is `none` (chat only), `gh pr create`, or `gh pr edit`, and `gh` may only be run after confirming; for `changelog` match the existing file's format if it exists; a very large diff may be offloaded to a read only `scout` subagent.
- Learner-relevant: the main thread owns the synthesis (especially a postmortem's root cause); offloading is limited to reading.

### Document writing guide (agent-prompt.md)

- Locator: `[[sources/jsm-skills/20261001/skills/document/agent-prompt.md#Document Writing Guide (main thread)]]`
- Purpose: The authoritative writing instructions the main thread follows at write time.
- Key rules: write strictly to the template's sections and order, fill every section (write "None" instead of padding); use spec rationale for the "why" and do not speculate; ground every claim in the diff, diff beats commit messages; never leak secrets (refer generically and flag); be idempotent for changelog (read first, no duplicates).
- Learner-relevant: the difference between documentation grounded in evidence and marketing copy.

### Honesty and safety rules

- Locator: `[[sources/jsm-skills/20261001/skills/document/agent-prompt.md#Honesty & safety rules (do not break)]]`
- Purpose: The non-negotiable integrity constraints on every document.
- Key rules: describe only what the change actually does, never claim an unproven performance or security win; never invent timeline entries, timestamps, or causes (write "Unknown, to investigate"); translate real changes into user benefit without overstating; never reproduce credentials/tokens/keys from a diff.
- Learner-relevant: honesty and secret handling are first class rules of technical writing.

### PR template

- Locator: `[[sources/jsm-skills/20261001/skills/document/templates/pr.md#PR Template]]`
- Purpose: Structure for the PR title and body reviewers read first.
- Key rules: title is one line, imperative, ≤72 chars, matching the project's commit convention; body sections are What, Why, Changes, How to test / verify, Risk & rollout, Notes for reviewers; group changes by intent, not by file or commit; never invent test steps, derive them from real tests or behavior.
- Learner-relevant: a reviewer wants the story of the change, not a `git log` dump.

### Changelog template

- Locator: `[[sources/jsm-skills/20261001/skills/document/templates/changelog.md#Changelog Template]]`
- Purpose: Structure for one appended entry in `CHANGELOG.md` (Keep a Changelog by default).
- Key rules: match the existing file first if present, only use the Keep a Changelog header when creating fresh; categories in order Added, Changed, Deprecated, Removed, Fixed, Security under `[Unreleased]`; write from the reader's perspective ("Added pagination to the orders endpoint") and only include categories that have entries; skip internal refactors and de-duplicate on re-run.
- Learner-relevant: mapping a change to the correct category and phrasing it for users/integrators.

### Release notes template

- Locator: `[[sources/jsm-skills/20261001/skills/document/templates/release-note.md#Release Notes Template]]`
- Purpose: Structure for end user release notes in `docs/releases/<version>.md`.
- Key rules: sections are Summary, Highlights, Improvements, Fixes, Breaking changes, Upgrade notes; lead with user value not implementation; group by importance; never bury breaking changes (own labelled section); no internal jargon, ticket numbers, or file names and derive everything from the actual range.
- Learner-relevant: translating technical work into user benefit is the most polished, least technical document form.

### Postmortem template

- Locator: `[[sources/jsm-skills/20261001/skills/document/templates/postmortem.md#Postmortem Template]]`
- Purpose: Structure for a blameless incident postmortem in `docs/postmortems/<date>-<slug>.md`.
- Key rules: build from the engineer's incident facts plus any `/debug` root cause, never invent entries; blameless throughout (credit or blame systems, not people); timeline is timestamped facts with analysis kept in Root cause / Contributing factors; every action item is specific, assignable, and tagged Prevent, Detect, or Mitigate (no "be more careful"); mark genuine unknowns "Unknown, to investigate".
- Learner-relevant: how to separate trigger from underlying weakness and turn an incident into durable preventive action.
