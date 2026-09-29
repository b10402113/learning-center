---
source: jsm-skills
source_type: codebase
source_lines: 656
language: markdown
file_count: 12
part: 5
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 5)

## Overview (L1)

- `skills/audit` — the context bootstrapper of the engineering workflow. It writes and maintains the tool agnostic `AGENTS.md` files (root plus nested `<area>/AGENTS.md`) that every later skill and AI tool reads, alongside thin `CLAUDE.md` pointer files. It routes to one of four phases by pre-flight signals: greenfield setup (ask coding standards, seed root), whole-repo scan (brownfield, no docs), area scan (one path), and gap-fill (partially documented). It never overwrites curated content, never creates specs or scope docs, and stays in its lane.
- **Architecture-pattern presets** — `patterns/` holds four coding style presets (Clean Architecture, Domain Driven Design, Functional/Immutable, SOLID OOP). In Phase 1 the engineer picks one, and its conventions become the `## Rules` of the new root `AGENTS.md`. This is where the audit skill "audits against" a style: it encodes the chosen style for the AI to follow, and gap-fill mode later flags docs the codebase contradicts.
- **Modes and adapter** — `modes/` are per-phase playbooks read only when routed; `agent-prompt.md` is the writing guide (persona, templates, hard rules) read at write time; `agents/openai.yaml` supplies the Codex picker metadata.

## Structure (L2)

### skills/audit/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/SKILL.md]]`
- Purpose: the skill entry point and router. Defines the plain-words output style, the `AGENTS.md`-is-canonical context convention (`CLAUDE.md` is only an `@AGENTS.md` pointer), artifact ownership, portability notes, and the `Pre-flight` signal gathering (context files, source count, commit history, manifests, monorepo markers, `WORKFLOW_SETUP`) plus the routing table to Phases 0–4.
- Key exports: the `/audit` skill definition; pre-flight signals `ROOT_EXISTS` / `ROOT_LEGACY` / `ROOT_MISSING` / `WORKFLOW_SETUP` / `MONOREPO=yes`; the phase order rationale (workflow-setup signal outranks raw code count).
- Dependencies: `agent-prompt.md`, `modes/greenfield.md`, `modes/whole-repo.md`, `modes/area.md`, `modes/gapfill.md`, `patterns/*.md`.
- Learner-relevant: how to classify a project (greenfield vs brownfield, ambiguous vs established) from concrete signals rather than a single file count, and how a canonical `AGENTS.md` with `CLAUDE.md` pointers keeps many AI tools reading one source.

### skills/audit/agent-prompt.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/agent-prompt.md]]`
- Purpose: the main-thread writing guide with per-phase instructions (GREENFIELD, WHOLE-REPO, AREA, GAP-FILL), the root and nested `AGENTS.md` templates, the mirrored-field contract (`## Stack` mirrors the architecture spec, `## Build approach` mirrors the scope header), the "drafted by" provenance stamp, the proposed-diff format, and the report format.
- Key exports: `ALL_CAPS` placeholder contract (`PHASE`, `AREA`, `SELECTED_PATTERNS`, `ADDITIONAL_STANDARDS`, `MONOREPO_OR_NO`, `INSTALLED_SKILLS`, `DECLINED_TOOLS`, `MCP_SERVERS`); ROOT/NESTED templates; `ROOT_GAPS` / `PROPOSED_ADDITIONS` / `CONTRADICTIONS` outputs; `## Git` block from the git-integration question.
- Dependencies: referenced by `SKILL.md` and every mode file; consumes pattern presets and scope/spec docs.
- Learner-relevant: the hard rules of safe context authoring — never overwrite curated prose, append-only proposals, keep root under ~60 lines, stamp machine-written content so later runs know what is curated, and route contradictions to the human instead of auto-fixing.

### skills/audit/modes/

- Locator: `[[sources/jsm-skills/20260929/skills/audit/modes/whole-repo.md]]`, `[[sources/jsm-skills/20260929/skills/audit/modes/area.md]]`, `[[sources/jsm-skills/20260929/skills/audit/modes/gapfill.md]]`
- Purpose: the per-phase playbooks. `whole-repo.md` (Phase 2) scans an established repo to write root plus judged nested docs, offloading large reads to a read only `scout` subagent. `area.md` (Phase 3) documents one path, checks root for area-relevant gaps, and handles the `Root gaps flagged` choice (add now / show diff / skip). `gapfill.md` (Phase 4) audits the whole codebase against existing docs and separates nested docs created (safe) from gaps and contradictions (need permission).
- Key exports: phase triggers and additional pre-flight steps; the `scout` subagent pattern (cheapest model, compact map); the gap-handling prompt with one recommended option.
- Dependencies: `agent-prompt.md`, `modes/tool-skills.md` (whole-repo only), `SKILL.md`.
- Learner-relevant: incremental, permission-gated documentation — explore freely, write new nested docs directly, but ask before touching any existing root line, and treat contradictions as decisions for the human.

### skills/audit/modes/greenfield.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/modes/greenfield.md]]`
- Purpose: Phase 1 setup. Asks coding-pattern and tooling decision panels (architecture style, type strictness, folder structure, code standards, lint/format, pre-commit checks, testing gate, CI, git integration), resolves the selected pattern to a `patterns/*.md` path, runs the tool-skills sweep, and writes root `AGENTS.md` (plus per-workspace stubs under a monorepo).
- Key exports: the decision-panel question set; `SELECTED_PATTERNS` resolution (named path vs "Other" free text verbatim); `## Git` block capture (integration, branch prefix, commit granularity) with `git init` on `on`; tooling choices handed to `/develop tooling`.
- Dependencies: `patterns/clean-architecture.md`, `patterns/functional.md`, `patterns/domain-driven.md`, `patterns/solid-oop.md`, `modes/tool-skills.md`, `agent-prompt.md`.
- Learner-relevant: how a fresh project establishes conventions once, up front — record choices without installing them yet, and tailor every question to the actual scaffolded stack.

### skills/audit/modes/tool-skills.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/modes/tool-skills.md]]`
- Purpose: the Agent Skills / MCP server discovery and offer sweep shared by greenfield and whole-repo modes. Enforces a consent gate ("asking is mandatory, searching is not"), builds a `TOOL_DISCOVERY_SET` across every stack layer, runs capped discovery in a background `researcher` subagent, offers findings as pick-only panels, installs via `npx skills add`, and records installed/declined/MCP lines.
- Key exports: the `TOOL-CONSENT` block (shared with `/architect` and `/sync`); discovery limits (max 5 searches, 8 pages, 30-day cache); `INSTALLED_SKILLS` / `MCP_SERVERS` / `DECLINED_TOOLS` recording format.
- Dependencies: `agent-prompt.md` (recording format), `npx skills` registry CLI, MCP connector list.
- Learner-relevant: a consent-first, cost-capped agent-resource discovery pattern — never silently install or search, cache across runs, and record declines so later runs do not re-offer.

### skills/audit/patterns/clean-architecture.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/patterns/clean-architecture.md]]`
- Purpose: the Clean Architecture preset (MCQ label and description plus conventions) selected in Phase 1.
- Key exports: four-layer model (`domain`, `application`, `infrastructure`, `presentation`); the dependency rule (outer depends on inner); thin use-case orchestrators; dependency inversion; no framework/ORM in domain or application; DTOs at boundaries.
- Dependencies: read by `modes/greenfield.md` / `agent-prompt.md` at write time.
- Learner-relevant: teaches layer separation and the direction of dependencies, with the rule that domain logic neither touches frameworks nor I/O.

### skills/audit/patterns/domain-driven.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/patterns/domain-driven.md]]`
- Purpose: the Domain Driven Design preset.
- Key exports: bounded contexts owning their model; aggregates as consistency boundary; domain events (immutable, past tense, business named); ubiquitous language in code; value objects; repository interfaces in the domain layer; anti corruption layers; context maps (shared kernel, customer supplier, conformist, anti corruption layer).
- Dependencies: read by `modes/greenfield.md` / `agent-prompt.md` at write time.
- Learner-relevant: how to model complex business domains explicitly and where consistency boundaries, events, and external-system isolation belong.

### skills/audit/patterns/functional.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/patterns/functional.md]]`
- Purpose: the Functional / Immutable preset.
- Key exports: pure functions by default; immutable data (`const`, `Object.freeze`, `readonly`); side effects at the edges; composition over inheritance; no shared mutable state; `map`/`filter`/`reduce`; avoid `null` (use `Option`/`Maybe`); error handling via `Result`/`Either`; trivial tests.
- Dependencies: read by `modes/greenfield.md` / `agent-prompt.md` at write time.
- Learner-relevant: purity, immutability, and explicit effect handling as a style that makes code predictable and testable.

### skills/audit/patterns/solid-oop.md

- Locator: `[[sources/jsm-skills/20260929/skills/audit/patterns/solid-oop.md]]`
- Purpose: the SOLID + OOP preset.
- Key exports: the five SOLID principles spelled out (single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion); constructor injection at a composition root; no service locator/global registry; small classes (under ~200 lines); composition over inheritance; name after behavior; inject fakes in tests.
- Dependencies: read by `modes/greenfield.md` / `agent-prompt.md` at write time.
- Learner-relevant: classic object-oriented design guidance linking each SOLID letter to a concrete constraint on classes, dependencies, and tests.

### skills/audit/agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/audit/agents/openai.yaml]]`
- Purpose: OpenAI Codex adapter supplying the picker interface metadata (display name "Audit", short description, default prompt) while the actual instructions stay in `../SKILL.md`.
- Key exports: `interface.display_name`, `short_description`, `default_prompt`.
- Dependencies: `../SKILL.md`.
- Learner-relevant: a minimal pattern for shipping one skill across multiple agent clients, keeping one source of truth for instructions and a thin per-client adapter.
