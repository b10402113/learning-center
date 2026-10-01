---
source: audit
source_type: codebase
source_lines: 656
language: markdown
file_count: 12
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — audit

## Overview (L1)

- `/audit` is the context bootstrapper: it writes the tool-agnostic `AGENTS.md` files (root plus nested per-area docs) that every later skill and AI tool reads, and a one-line `CLAUDE.md` pointer beside each that imports the sibling `AGENTS.md`.
- Run greenfield (after `/scope` → `/architect` decides the stack → scaffold), on an undocumented existing codebase, on one area (`/audit src/auth`), or to gap-fill an existing root doc. A pre-flight classifies into Phase 0 (ask), 1 greenfield, 2 whole-repo, 3 area, or 4 gap-fill; it reads exactly one mode file, plus `agent-prompt.md` and (Phase 1) one pattern preset at write time.
- Writes `AGENTS.md` and `CLAUDE.md` pointers only; never specs, plans, or the scope. It creates root when missing, gap-fills without permission but proposes edits to existing content via a diff, and never overwrites curated prose.
- Core rules: `AGENTS.md` is canonical and never duplicated into `CLAUDE.md`; root stays ≤ ~60 lines with area detail in nested docs; the main thread does all writing (a read-only low-cost subagent only ever returns a code map); two root fields (`## Stack`, `## Build approach`) are mirrors of the architecture spec and scope header and may never be invented.

## Structure (L2)

### SKILL.md — what it does and the AGENTS.md convention

- Locator: `[[sources/jsm-skills/20261001/skills/audit/SKILL.md#context-file-convention-agentsmd-is-canonical]]`
- Purpose: States the job (bootstrap/refresh durable AI context), the three run shapes, ownership boundaries, and the canonical-file rule.
- Key rules: durable context lives in tool-agnostic `AGENTS.md`, read by every agent; a `CLAUDE.md` is only a pointer importing the sibling `AGENTS.md` (never duplicated content); create `AGENTS.md` when missing, never overwrite an existing one; a legacy `CLAUDE.md` with content is migrated into `AGENTS.md` with permission, never discarded; nested docs only for areas with genuinely distinct conventions, linked by exactly one root pointer line.
- Learner-relevant: the two-file AGENTS.md/CLAUDE.md pattern and the provenance/migration safety rules.

### SKILL.md — Pre-flight classification and phase routing

- Locator: `[[sources/jsm-skills/20261001/skills/audit/SKILL.md#pre-flight-main-thread-does-this-before-anything-else]]`
- Purpose: Gathers signals (context files, source count, history, manifest, monorepo, workflow-setup) and routes to one phase by an ordered decision table.
- Key rules: a `WORKFLOW_SETUP` signal (scope has a stack/architecture feature and/or a `docs/specs/` architecture spec but no root `AGENTS.md`) outranks the raw code count and routes to greenfield Phase 1, so a just-scaffolded project is never misread as brownfield; truly brownfield means real feature code plus history and no workflow setup; anything ambiguous falls to Phase 0 and asks; monorepo adds a light stub per workspace and asks before relocating a buried doc.
- Learner-relevant: why signal ordering matters and the greenfield-vs-brownfield judgment call.

### agent-prompt.md — writing guide, templates, mirrored fields

- Locator: `[[sources/jsm-skills/20261001/skills/audit/agent-prompt.md#the-mirrored-root-fields]]`
- Purpose: The main thread's write-time guide: persona, per-phase instructions, root and nested templates, the proposed-diff format, and the report format.
- Key rules: `## Stack` mirrors the architecture spec (source of truth) and `## Build approach` mirrors the scope header; fill only when missing/placeholder and flag divergence rather than pick a winner; every created `AGENTS.md` ends with a "drafted by" provenance line, and gap-filling a file without that line means a human took it over (add only, route changes to contradictions); when an existing file is found, output only a `PROPOSED_ADDITIONS` diff and stop; root must stay under ~60 lines.
- Learner-relevant: the template structure, the provenance stamp, and the "propose, never overwrite" editing discipline.

### modes/greenfield.md — Phase 1 setup

- Locator: `[[sources/jsm-skills/20261001/skills/audit/modes/greenfield.md#audit-mode-greenfield-setup-phase-1]]`
- Purpose: The one place conventions and tooling get chosen: ask the standards as decision panels, then write root `AGENTS.md` seeded from the spec/scope.
- Key rules: ask architecture style (one of the four presets), type strictness, folder structure, extra standards, plus tooling questions (lint/format, pre-commit checks, testing gate, CI, git integration); skip a question the stack already settles and list an installed tool first as recommended; `/audit` records but installs nothing (`/develop tooling` installs); if git integration is `on` and the project isn't a repo, run `git init` and offer an initial commit; git `on` is a recorded `## Git` block; resolve pattern choices to a file path (or "Other" free text verbatim) and read only the chosen preset at write time.
- Learner-relevant: how defaults are proposed but every convention remains the engineer's explicit pick.

### modes/whole-repo.md — Phase 2 full scan

- Locator: `[[sources/jsm-skills/20261001/skills/audit/modes/whole-repo.md#audit-mode-whole-repo-scan-phase-2-root-judged-nested]]`
- Purpose: An established, undocumented codebase: scan enough to write an accurate root `AGENTS.md` and judge which areas warrant a nested doc.
- Key rules: run the tool-skills sweep once the stack is known; a large repo offloads just the reading to a read-only low-cost subagent returning a compact map; root stays global and short while area conventions go in nested docs; a monorepo gets a light stub per workspace without a deep scan (deep conventions come later via `/audit <workspace>`); never one doc per folder.
- Learner-relevant: what counts as durable context and the global-vs-local doc split.

### modes/area.md — Phase 3 single-area scan

- Locator: `[[sources/jsm-skills/20261001/skills/audit/modes/area.md#audit-mode-area-scan-phase-3]]`
- Purpose: A path argument triggers a focused scan of one area, checking root coverage and creating/updating that area's nested `AGENTS.md`.
- Key rules: a missing path stops immediately; if root `AGENTS.md` is missing, run the whole-repo scan first (or migrate a legacy root `CLAUDE.md`) before the area scan; the main thread writes the nested doc and adds the root pointer via Edit; root gaps are collected as exact-markdown `ROOT_GAPS` lines and applied only after asking (add now / show the diff / skip).
- Learner-relevant: incremental context capture and how root gaps become proposed edits.

### modes/gapfill.md — Phase 4 conservative fill

- Locator: `[[sources/jsm-skills/20261001/skills/audit/modes/gapfill.md#audit-mode-gap-fill-phase-4-root-agentsmd-already-exists]]`
- Purpose: Audit a whole codebase against existing docs and fill only genuine holes without touching curated content.
- Key rules: four finding kinds — (a) global facts missing from root, (b) undocumented areas (create nested docs), (c) stale nested docs (`PROPOSED_ADDITIONS`, never edit directly), (d) contradictions the code/spec/scope disprove (surface to the engineer, never auto-fix); gaps and additions are applied only after the add/show/skip choice; be conservative and flag only durable, confident findings.
- Learner-relevant: the gap-versus-contradiction distinction and why contradictions are surfaced rather than silently corrected.

### modes/tool-skills.md — Agent Skills and MCP sweep

- Locator: `[[sources/jsm-skills/20261001/skills/audit/modes/tool-skills.md#step-1-ask-first-the-consent-gate]]`
- Purpose: Offers matching Agent Skills and MCP servers for the project's real stack, then records what was installed or declined in `AGENTS.md`.
- Key rules: asking is mandatory, searching is not — nothing is searched, fetched, or installed before the engineer picks one of four options (find them / I'll name them / no and record the decline / not now); discovery builds a `TOOL_DISCOVERY_SET` across every layer and runs in the background on a cheap model with capped searches; never install automatically; record one bullet per installed skill plus compact `Declined:` and `MCP servers:` lines using the project's real skills directory (never a hardcoded Claude-only path).
- Learner-relevant: consent-gated discovery and how declines prevent repeat offers.

### patterns/ — the four coding style presets

- Locator: `[[sources/jsm-skills/20261001/skills/audit/patterns/clean-architecture.md#clean-architecture]]`
- Purpose: The selectable architecture conventions offered in greenfield Phase 1, read into context only when chosen.
- Key rules: **Clean Architecture** — four layers with an inward-only dependency rule, domain has zero external imports, infrastructure implements domain interfaces, DTOs cross boundaries; **Functional / Immutable** — pure functions by default, immutable data, side effects at the edges, composition over inheritance, `Option`/`Result` over `null`/exceptions; **Domain Driven Design** — bounded contexts, aggregates as the consistency boundary, immutable past-tense domain events, ubiquitous language, repositories and anti-corruption layers; **SOLID + OOP** — one reason to change per class, open/closed, Liskov, interface segregation, dependency injection via constructors at a composition root, small classes.
- Learner-relevant: a compact comparative reference for four mainstream architecture styles and the trade-offs each encodes.
