---
source: jsm-skills
source_type: codebase
source_lines: 471
language: markdown
file_count: 5
part: 7
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 7)

## Overview (L1)

- **skills/sync** — The closing step of the workflow: after a change is complete and around merge, it reconciles durable project knowledge to what the repo now shows. It surgically updates root and nested `AGENTS.md`, ticks completed sub tasks in the relevant feature scope, and reconciles linked spec `**Status**:` lines, while flagging stale specs and curated-prose conflicts instead of editing them. It is tightly bounded (a Boundaries table defines exactly what it owns) and idempotent, so a second run on the same change edits nothing.
- **skills/debug** — A structured root-cause investigation skill invoked when a test fails for unclear reasons, `/check verify` finds a failure, or behavior is wrong. It runs an explicit reproduce → localize → hypothesize → test → fix → verify loop, testing one falsifiable hypothesis at a time and applying the minimal fix, then protects the fix with a regression test and checks for sibling occurrences of the same cause. It explicitly refuses feature work, opportunistic refactors, and symptom patching.

## Structure (L2)

### skills/sync/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/sync/SKILL.md]]`
- Purpose: Orchestration spec for the `/sync` skill. Defines the output style, the exact ownership contract via a **Boundaries** table (what `/sync` maintains vs. what it defers to `/audit`, `/architect`, `/scope`, or a human), the canonical-file rule (durable context lives in tool-agnostic `AGENTS.md`; `CLAUDE.md` is only a pointer), artifact ownership, and the 4-step execution flow: scope the change set from git, locate context files/specs/scope paths, optionally discover Agent Skills and MCP servers for newly added tools (with mandatory ask-first consent), perform the maintenance on the main thread, then relay a compact summary.
- Key exports: skill frontmatter (`name: sync`, `allowed-tools: Bash, Read, Grep, Glob, Write, Edit, Agent`); "Boundaries" table; Steps 1–4; the record relay template; the `TOOL-CONSENT` block reused across `/architect`, `/audit`, `/sync`.
- Dependencies: references `agent-prompt.md` (authoritative maintenance rules), `docs/conventions.md`, sibling skills `/audit`, `/architect`, `/scope`, `/test`, `/develop`, and the repo's `AGENTS.md` / `CLAUDE.md` / `docs/specs` / `docs/scope` layout.
- Learner-relevant: how an AI workflow keeps documentation and planning artifacts in sync with code using git diffs; the surgical/idempotent/flag-don't-overwrite editing discipline; using diff status codes (A/M/D) to decide creation vs. deferral ("context, not policy"); scoping work to only the relevant workspace's scope file; ask-before-search consent for tool discovery.

### skills/sync/agent-prompt.md

- Locator: `[[sources/jsm-skills/20260929/skills/sync/agent-prompt.md]]`
- Purpose: The single source of truth for `/sync`'s maintenance rules, read by the main thread at write time (Step 3). It defines the placeholder contract (MODE, CHANGED_FILES, DELETED_PATHS, ROOT_AGENTS_MD, SPEC_PATHS, SCOPE_PATH_OR_NONE, tool-discovery results), the "default to doing nothing" stance, and seven numbered maintenance procedures: update existing `AGENTS.md`, create a nested doc only for a net-new area, clean up orphans from deletions, reconcile spec `**Status**:` lines, flag stale specs, reconcile the feature scope as the universal sub-task reconciler, and emit a fixed report block.
- Key exports: `ROOT-FIELD-CONTRACT` block (root `## Stack` mirrors the architecture spec, `## Build approach` mirrors the scope header); the nested-area creation rule; the status mapping (`planned`→`Proposed`, `in-progress`→`In Progress`, `done`→`Accepted`, `Superseded` never auto-set); per-sub-task-type evidence table; the verbatim report template.
- Dependencies: consumed by `SKILL.md` Step 3; references `docs/specs/`, `docs/scope/`, `docs/reviews/`, `docs/conventions.md`, `AGENTS.md` and sibling `CLAUDE.md` pointers.
- Learner-relevant: the detailed reconciliation algorithm behind a sync step; how specs and a feature scope encode lifecycle status; evidence-based completion (ticking checkboxes only on clear repo evidence); ambiguous attribution handling in monorepos; conservative "flag rather than edit" conflict handling.

### skills/sync/agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/sync/agents/openai.yaml]]`
- Purpose: OpenAI Codex adapter supplying the agent-picker metadata for the sync skill (display name "Sync", short description "Refresh durable project knowledge", default prompt). The actual instructions still live in `../SKILL.md`.
- Key exports: `interface.display_name`, `interface.short_description`, `interface.default_prompt`.
- Dependencies: points back to `../SKILL.md` as the instruction source.
- Learner-relevant: how one skill definition is ported across different agent clients through a thin per-client adapter file rather than duplicating instructions.

### skills/debug/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/debug/SKILL.md]]`
- Purpose: Full spec for the `/debug` skill. Establishes the investigator role (trust evidence over intuition), the six-step loop (capture symptom → reproduce reliably → localize → hypothesize one at a time → test the hypothesis → fix at root → verify and protect), the minimal-fix artifact-ownership rule, and the optional subagent delegation for non-trivial hunts. Explicitly distinguishes its internal loop from `/loop` (time-interval reruns).
- Key exports: skill frontmatter (`name: debug`, `allowed-tools: Bash, Read, Grep, Glob, Write, Edit, Agent`); Steps 0–6; the subagent config (`model` set explicitly, tool list, prompt requirements); the report template.
- Dependencies: references `AGENTS.md` for project conventions, `docs/conventions.md`, and sibling skills `/check verify`, `/test`, `/architect`, `/loop`.
- Learner-relevant: disciplined debugging methodology — deterministic reproduction, code-path and `git bisect` localization, single falsifiable hypotheses, experiment-driven confirmation, fixing cause not symptom, regression tests, and grepping for sibling bugs with the same root cause.
