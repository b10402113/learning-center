---
source: jsm-skills
source_type: codebase
source_lines: 381
language: markdown
file_count: 7
part: 4
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 4)

## Overview (L1)

- **document skill** — A phase-based engineering workflow skill that writes the human facing prose about a change: a PR description, a `CHANGELOG.md` entry, end user release notes, or a blameless postmortem. It drafts from the real commits and diff (never from imagination), choosing one of four document types, each with its own audience and output target. The main thread writes the document itself; only reading a very large diff may be offloaded to a cheap read only `scout` subagent.
- **Writing guide + four templates** — `agent-prompt.md` is the writing guide the main thread follows at write time, paired with one template per document type. Together they encode the honesty rules: ground every claim in the diff, invent nothing (postmortem timelines and causes especially), never leak secrets, and keep the changelog idempotent.
- **Place in the workflow** — `/document` is one of the freely skippable steps after `/develop` and `/check`; it produces prose only, committing/pushing nothing (except optionally ticking the `Document it` scope box).

## Structure (L2)

### skills/document/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/document/SKILL.md]]`
- Purpose: Defines the `/document` skill. It picks a document type (argument, or inferred and confirmed with one interactive question), gathers source material from git (`git log`, `git diff`, tags, `gh` availability/remote/PR existence checks), resolves per-type edge cases, then writes the document on the main thread.
- Key exports: Skill `document`; commands `/document pr | changelog | release-note | postmortem`; `allowed-tools: Bash, Read, Grep, Glob, Write, Edit, Agent, AskUserQuestion`.
- Dependencies: `agent-prompt.md` and `templates/<type>.md` (read at write time); optional `docs/specs/` for the "why"; `AGENTS.md`/`CLAUDE.md` for project context; `docs/conventions.md` and `docs/releases/`, `docs/postmortems/`; a read only `scout` subagent and `git`/`gh` CLIs; cross-platform guidance for any Agent Skills client.
- Learner-relevant: Teaches how to write from the record rather than imagination, map each document type to its audience and target, and gate outward actions (PR create/edit and pushes) behind explicit confirmation. Also demonstrates a portable skill contract (OS-independent commands, bundled files resolved relative to the skill folder) and the `NO_TAGS`/`GH_INSTALLED`/`HAS_REMOTE`/`PR_EXISTS` edge-handling pattern.

### skills/document/agent-prompt.md

- Locator: `[[sources/jsm-skills/20260929/skills/document/agent-prompt.md]]`
- Purpose: The main thread's writing guide, read at Step 3 with the chosen template. Supplies the ALL_CAPS input slots (TYPE, TEMPLATE_CONTENT, COMMITS, DIFF_COMMAND, LARGE_DIFF_NOTE, INCIDENT_FACTS, VERSION_RANGE, PROJECT_CONTEXT, SPEC_PATHS, DATE, OUTPUT_TARGET, GH_ACTION, CHANGELOG_FORMAT_NOTE) and the procedure for writing strictly to the template.
- Key exports: The "Document Writing Guide (main thread)" and its Honesty & safety rules.
- Dependencies: Read alongside `templates/<type>.md`; consumes inputs gathered in SKILL.md steps 1–2; references `AGENTS.md`, spec paths, and the diff.
- Learner-relevant: Teaches grounding every claim in the diff (diff beats commit messages), no invention for postmortems ("Unknown, to investigate"), translating real changes into user benefit for release notes, never reproducing leaked secrets (refer generically and flag it), and changelog idempotency.

### skills/document/templates/pr.md

- Locator: `[[sources/jsm-skills/20260929/skills/document/templates/pr.md]]`
- Purpose: Structure for a PR title plus body, returned as text and optionally applied to `gh` per GH_ACTION.
- Key exports: PR template (Title; body sections: What, Why, Changes, How to test / verify, Risk & rollout, Notes for reviewers).
- Dependencies: `gh` only via GH_ACTION; may link a governing spec or issue under Why.
- Learner-relevant: Teaches imperatively titled, one line titles (≤ 72 chars, matching project commit convention), grouping changes by intent rather than raw commits/files, skimmable "What", and honest risk/rollout notes.

### skills/document/templates/changelog.md

- Locator: `[[sources/jsm-skills/20260929/skills/document/templates/changelog.md]]`
- Purpose: Structure for appending an entry to `CHANGELOG.md` under the unreleased/top section.
- Key exports: Changelog template (Keep a Changelog header; categories Added, Changed, Deprecated, Removed, Fixed, Security).
- Dependencies: The existing `CHANGELOG.md` (matched, not overwritten); CHANGELOG_FORMAT_NOTE.
- Learner-relevant: Teaches matching an existing file's style before imposing a convention, one bullet per user-relevant change, reader-perspective phrasing (not function names), correct category mapping, omitting empty headings, and idempotent re-runs that avoid duplicate entries.

### skills/document/templates/release-note.md

- Locator: `[[sources/jsm-skills/20260929/skills/document/templates/release-note.md]]`
- Purpose: Structure for end user release notes written to `docs/releases/<version>.md` for a VERSION_RANGE.
- Key exports: Release notes template (summary; Highlights, Improvements, Fixes, Breaking changes, Upgrade notes).
- Dependencies: The tag range resolved in SKILL.md; commits/diff in the range.
- Learner-relevant: Teaches the most polished, least technical document type: lead with user value over implementation, group by importance, never bury breaking changes, and avoid internal jargon/ticket numbers/file names.

### skills/document/templates/postmortem.md

- Locator: `[[sources/jsm-skills/20260929/skills/document/templates/postmortem.md]]`
- Purpose: Structure for a blameless incident postmortem written to `docs/postmortems/<DATE>-<slug>.md` from INCIDENT_FACTS plus any `/debug` record.
- Key exports: Postmortem template (metadata table: Severity, Duration, User impact, Status; Summary, Timeline, Root cause, Contributing factors, What went well, Action items, Lessons).
- Dependencies: INCIDENT_FACTS from the engineer; optional `/debug` output and diff.
- Learner-relevant: Teaches blameless retrospection (systems, not individuals), keeping the timeline to timestamped facts while analysis stays in Root cause/Contributing factors, separating trigger from underlying weakness, tagging every action item Prevent/Detect/Mitigate, and marking unknowns honestly rather than guessing.

### skills/document/agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/document/agents/openai.yaml]]`
- Purpose: OpenAI Codex adapter supplying the interface metadata Codex shows in its agent picker; the actual instructions remain in `../SKILL.md`.
- Key exports: Interface metadata: `display_name: "Document"`, `short_description: "Draft PRs and release notes"`, and a `default_prompt` that tells the agent to read SKILL.md and draft the human facing writeup from the real commits and diff.
- Dependencies: `../SKILL.md` (installed alongside and loaded when the skill runs).
- Learner-relevant: Shows the minimal cross-client packaging pattern for a skill (a small per-vendor adapter file beside the shared SKILL.md) and how platform-specific pickers are wired without duplicating instructions.
