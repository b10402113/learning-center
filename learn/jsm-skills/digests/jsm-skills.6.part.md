---
source: jsm-skills
source_type: codebase
source_lines: 1293
language: markdown
file_count: 11
part: 6
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 6)

## Overview (L1)

- **architect (skill)** — The design-decision skill of the JavaScript-Mastery-Pro engineering workflow. It turns a vague request ("design auth", "pick a stack", "standardise error handling") into a ratified build spec under `docs/specs/`. It runs a staged, one-decision-at-a-time design conversation, weighs options, makes a clear recommendation, and writes the spec itself. Four modes: FEATURE, ARCHITECTURE, ENHANCEMENT, CROSS-CUTTING.
- **Spec as artifact** — The unit of output is a spec file (`NNNN-title.md` or a directory with `index.md` + `rationale.md`). A spec has a lifecycle status (`Proposed` → `In Progress` → `Accepted`, plus `Assumed` and `Superseded`) and a two-audience split: a build spec `/develop` reads (Requirements, Decision, design section, Build plan, Consequences) and a decision record humans read (Context, Options, Rationale, References). It owns nothing else: no code, no `AGENTS.md`.
- **Human-decides / AI-recommends ethos** — Every user-facing choice carries exactly one recommended option with a one-line why; AI-initiated verification (the cross-model spec cross-check) is always offered, never run or skipped on the engineer's behalf, and every load-bearing gap is surfaced for the engineer to decide, never auto-fixed.
- **Progressive-disclosure architecture** — `SKILL.md` is the orchestrator; it defers long content to internal files (`design-conversation.md`, `after-subagent.md`, `tool-discovery.md`) and read-at-write-time files (`agent-prompt.md`, `spec-template.md`, `agent-modes/*.md`), so the interview does not carry the writing guides in context.
- **Subagents are read-only** — The main thread writes the spec; subagents only scan code (`scout`), fetch the web (`researcher`), or cross-check the finished spec. All use the cheapest capable model, never the session model.

## Structure (L2)

### skills/architect/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/SKILL.md]]`
- Purpose: The orchestrator. Declares the four modes and their design behaviour; defines the create/update/supersede/ratify operations; defines spec status model (feature-linked mirroring vs standalone decision status, plus the `/develop`-owned `Assumed` state that only `/architect` clears by ratifying); specifies the subagents; the Asks-vs-acts sort (INFER/ASK/RECOMMEND); artifact ownership (location = repo shape, shape = decision size, `$SPEC_DIR` resolution, umbrella directory rules); portability notes; and the full Execution pipeline: Step 0 topic check, pre-flight (freshness, spec location, numbering, source-file count, `AGENTS.md` read, build-approach resolution, linked-scope-feature detection, related/overlap/assumed-spec detection), then the gated design conversation, then writing the spec, then the after-write flow.
- Key exports: `/architect` command; modes `FEATURE | ARCHITECTURE | ENHANCEMENT | CROSS-CUTTING`; operations `create | update | supersede` + ratify-assumed path; reference-file map.
- Dependencies: `agent-prompt.md`, `spec-template.md`, `agent-modes/{feature,architecture,enhancement,cross-cutting}.md`, `internal/{design-conversation,after-subagent,tool-discovery}.md`; project `AGENTS.md`/`CLAUDE.md` and `docs/scope/` at runtime; sibling workflow skills (`/develop`, `/scope`, `/sync`, `/audit`, `/check`, `/test`, `/document`).
- Learner-relevant: How a single skills entrypoint orchestrates a multi-file workflow via lazy file reads; how spec status discriminates feature-linked vs standalone decisions; the "one decision per spec" and prematurity/failure-pattern framing. Teaches progressive disclosure as a context-budget technique.

### skills/architect/agent-prompt.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/agent-prompt.md]]`
- Purpose: The spec-writing brief the main thread reads at write time. Defines the persona (Staff Engineer / Principal Architect with 15+ years), the "how you think" principles (simple beats clever, boring technology, design for failure, three time horizons), and what not to do. Contains the ALL_CAPS placeholder context block, Step 0 (apply community skill knowledge: specific recommendations, populate `**Implementation skills**`, follow-up placement rules for `AGENTS.md`), Step 0b (challenge the premise; scope-too-large, compliance, unresolved-prerequisite checks; a known-failure-pattern table: premature microservices, NoSQL for relational data, big bang rewrite, premature optimisation, GraphQL default, serverless stateful, reinventing auth, org isolation as afterthought), the "expert rules that apply to all modes" (output style, Summary, initial Status, documentation path, value sourcing, acceptance-criteria spine & build plan, decision-only specs, recommendation quality, technology choices, sourcing/citation gating by `REFERENCES_LEVEL`), and the report format.
- Key exports: The persona and universal spec-writing rules; step 0b premise/failure-pattern challenge; the value-sourcing rule; the report block (`Decided` / `Key tradeoff` / `Heads up`).
- Dependencies: Referenced by `SKILL.md` (*Write the spec*); uses the mode files at `## Instructions by mode`; references project `AGENTS.md`, community skills, and the spec template.
- Learner-relevant: How to encode a persona and reusable "expert rules" for a writing agent; how to challenge a user's premise with a structured failure-pattern catalogue; how value sourcing prevents a builder from inventing inputs. A rich example of prompt engineering for high-stakes output.

### skills/architect/spec-template.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/spec-template.md]]`
- Purpose: The canonical spec structure. The section between `=== SPEC TEMPLATE START ===`/`END` is the template the main thread fills; the trailing meta sections are guidance for the writer. Defines the section order (Summary, Context, Requirements with IDed ACs, Options considered, Decision + Implementation skills, Rationale, mode-specific design section, Build plan, Consequences, Follow-up, References) and includes an explicit "Audience split" explaining which sections are build spec vs decision record. Documents filename conventions, the full status-values table and which status behaviour applies, and umbrella/directory rules (index.md + rationale.md split, no status on children).
- Key exports: The spec template; the status table; the audience-split contract; directory-vs-single-file rules; writing rules (each point once, Context describes only the problem, Options need cons, one decision per spec).
- Dependencies: Read by the main thread per `SKILL.md` (*Write the spec*); its design sections (`## Feature design`, `## Proposed stack`, `## Standard definition`, `## Migration plan`) are selected by mode.
- Learner-relevant: How to design a document template with a machine-readable region and human guidance; how to split one artifact across two audiences (build spec vs decision record); how status semantics can be modeled as a state machine tied to a build lifecycle.

### skills/architect/agent-modes/feature.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/agent-modes/feature.md]]`
- Purpose: The FEATURE-mode writing instructions for designing new functionality. Targeted discovery, then first-principles reasoning across seven ordered dimensions (real user problem, data model/state machine, consistency, minimal API surface, failure modes, security surface, configuration), a set of expert opinions (idempotency from day one, pagination mandatory, soft deletes usually wrong, don't store derived values, audit logs, rate limit public endpoints, never store secrets), 2–4 approaches, and a required `## Feature design` block.
- Key exports: `### FEATURE mode` instructions; the `## Feature design` field block (data model sketch, state transitions, API surface, value sourcing, key invariants, security model, configuration, critical test scenarios).
- Dependencies: A sub-block of `agent-prompt.md` (*Instructions by mode*); reads the resolved `## Feature design` template from `spec-template.md`.
- Learner-relevant: A concrete first-principles design checklist for a feature (problem → model → consistency → API → failure → security → config); the value-sourcing table as a technique to expose undecided inputs. Teaches opinionated design defaults.

### skills/architect/agent-modes/architecture.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/agent-modes/architecture.md]]`
- Purpose: The ARCHITECTURE-mode instructions for choosing a foundational tech stack. Establishes product shape, applies an architecture-pattern table first (monolith vs layered monolith vs a few services vs batch/stream, keyed on scale + team), then chooses the stack layer by layer reasoning in durable categories (relational DB, in-memory cache, proven auth, DB-backed queue, object storage, built-in full-text search, structured logging + error tracking), fresh-picking products at runtime. Lists expert opinions (monolith first, relational default, serverless tradeoffs, defer multi-region, ORM for CRUD + SQL for complexity, orchestration needs a platform team). Emits a decision-only spec with `## Proposed stack` and no `## Build plan`.
- Key exports: `### ARCHITECTURE mode` instructions; the `## Proposed stack` layer table; the architecture-pattern selection table.
- Dependencies: Sub-block of `agent-prompt.md`; template section from `spec-template.md`; may use the `researcher` subagent for landscape checks.
- Learner-relevant: How to reason about architecture from scale + team size rather than fashion; the "pick the durable category, then the current product" pattern that resists stale recommendations; decision-only specs as a way to avoid double-speccing build steps.

### skills/architect/agent-modes/enhancement.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/agent-modes/enhancement.md]]`
- Purpose: The ENHANCEMENT-mode instructions for improving or replacing something in a live system. Read existing code/specs, diagnose honestly (how it actually works, root cause, constraints), and always evaluate fix-in-place vs strangler vs direct replacement. Applies expert opinions: measure before optimising, strangler for production migration, caches need invalidation answers, feature flags for significant changes, safe DB migration sequence. Adds a `## Migration plan` when the migration is non-trivial.
- Key exports: `### ENHANCEMENT mode` instructions; the `## Migration plan` block (Strategy, Phases, Rollback, Risks); the enhancement expert opinions.
- Dependencies: Sub-block of `agent-prompt.md`; `## Migration plan` template from `spec-template.md`; may offload code reading to a `scout` subagent.
- Learner-relevant: Production migration thinking: strangler pattern, feature flags, expand-migrate-contract DB sequence, cache invalidation as a precondition. Teaches "fix in place is underrated" as a counterweight to rewrite instinct.

### skills/architect/agent-modes/cross-cutting.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/agent-modes/cross-cutting.md]]`
- Purpose: The CROSS-CUTTING-mode instructions for defining a standard pattern across the whole codebase. Sample ~50 files and read 4–6 representative ones, characterise the 2–3 competing patterns, define the standard precisely (canonical pattern, what it replaces, enforcement mechanism ranked lint > compile-time type > PR checklist > review convention, exceptions, rollout), and frame options as enforcement level + rollout strategy rather than technology. Emits a `## Standard definition` section.
- Key exports: `### CROSS-CUTTING mode` instructions; the `## Standard definition` block (Canonical pattern, Replaces, Enforcement, Rollout, Exceptions).
- Dependencies: Sub-block of `agent-prompt.md`; `## Standard definition` template from `spec-template.md`.
- Learner-relevant: How to write an enforceable coding standard (prefer automated enforcement) and how to scope its rollout; the "sample, don't audit" reading strategy. Teaches that a standard without a feasible enforcement mechanism is weak.

### skills/architect/agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/architect/agents/openai.yaml]]`
- Purpose: The OpenAI Codex adapter. Supplies only interface metadata (`display_name`, `short_description`, `default_prompt`) that Codex shows in its agent picker; the real instructions remain in `../SKILL.md`.
- Key exports: `interface.display_name: "Architect"`, `short_description`, `default_prompt` (read SKILL.md, run the design conversation, write the build spec to `docs/specs/` before implementation).
- Dependencies: `../SKILL.md` (the skill's actual instructions, installed alongside).
- Learner-relevant: How one skill can ship a thin per-client manifest so a different agent host (Codex) can discover it while keeping a single source of instructions.

### skills/architect/internal/design-conversation.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/internal/design-conversation.md]]`
- Purpose: The main-thread protocol for the interview, read before any design question. Contains Scope validation (Check B "already built" documentation path first, then Check A product-vs-decision scoping), Framing (infer mode/platform/workspace/stack/constraints, don't interrogate), and the staged design conversation: a load-bearing-dimension checklist, the per-question mechanics (real options, exactly one recommended, custom slot last, grill to the smallest decision, batch ≤4), and the ordered stages — (a) Requirements→derive ACs, (b) mandatory data model ASK→assemble→show→confirm→iterate, (c) stack & tool walk with the combined References consent panel and web-research cap/cache, (d) API surface + value-sourcing close, (e) security/authz, (f) edge cases. Includes the UI-page design stage, the ARCHITECTURE-stack special path, the completeness gate before writing, worked examples (`/architect auth`, home page UI), and the ENHANCEMENT-with-no-code guard.
- Key exports: Scope validation checks A/B; Framing; the staged conversation (stages a–f); References consent → `REFERENCES_LEVEL`; the completeness gate; worked examples.
- Dependencies: Read by `SKILL.md` (*Scope validation, framing, and staged design conversation*); calls `internal/tool-discovery.md` when a new tool is chosen; uses `researcher` subagent and `docs/.agent-cache/research/`; reads `docs/scope/` and `AGENTS.md`.
- Learner-relevant: How to structure an adaptive requirements interview that derives acceptance criteria from answers (rather than presenting a finished list); the data-model confirm loop; how to gate an interview on completeness so nothing is silently guessed. The core technique of the skill.

### skills/architect/internal/after-subagent.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/internal/after-subagent.md]]`
- Purpose: The completion flow after the spec is written. Verifies the write landed, self-checks required sections per mode (and flags blanks with a ⚠️ Incomplete note), then always asks the engineer whether to run a read-only cross-check whose primary job is decision completeness (finding values/decisions with unnamed sources), recommending `Another model` strongly at GA/Beta, offering at Alpha, `Skip` at Prototype. Then presents the spec and a confirmation panel, loops edits until accepted, ratifies status per spec kind, derives build tasks and links/updates the scope feature (locating the `(spec)` decision box; milestone rollup not atomic dump; effective-tier closing boxes; enrolling follow-ups), and gives a plain-language spoken summary.
- Key exports: The post-write self-check; the cross-check offer panel (Another model / Same model / I'll review it myself / Skip); the accept/change/rethink confirmation loop; status ratification rules; scope linking/deriving steps; the spoken-summary template.
- Dependencies: Read by `SKILL.md` (*After the spec is written*); uses the report format from `agent-prompt.md`; interacts with `docs/scope/`; references `AGENTS.md` `## Agent skills`; may run a read-only cross-check subagent.
- Learner-relevant: How to design an AI verification step that is offered rather than auto-run, and how to present AI-found gaps for human decision instead of silently fixing them; how to roll atomic build tasks up into scope milestones. The "engineer decides" ethos in executable form.

### skills/architect/internal/tool-discovery.md

- Locator: `[[sources/jsm-skills/20260929/skills/architect/internal/tool-discovery.md]]`
- Purpose: The Agent Skill and MCP discovery flow, read only when the stack walk settles new tools. Enforces a consent gate ("asking is mandatory, searching is not") with a four-option panel, then discovers in batch in a background read-only subagent (`npx skills find` per tool, aliases on weak hits, MCP connector/web fallback), skips known/declined tools (no-nag rule), caches to `docs/.agent-cache/tool-discovery/` (30-day reuse), offers found skills and MCP servers as separate panels, acts on the pick (`npx skills add …`; MCP is a user config step), and records outcomes (Implementation skills field, `AGENTS.md` bullets, `Declined:` line, or a passive Follow-up note).
- Key exports: The consent gate (shared identical block across `/architect`, `/audit`, `/sync`); the discovery subagent spec; offer panels; record/decline rules.
- Dependencies: Called from `internal/design-conversation.md` (Stage c); writes to the spec and flags `AGENTS.md`; uses `researcher`/discovery subagent and the `skills` registry CLI.
- Learner-relevant: How to build a discovery/recommendation flow that always asks before spending tokens or touching the user's environment; the no-nag + decline-recording pattern; running noisy searches in a background subagent to keep the main context clean.
