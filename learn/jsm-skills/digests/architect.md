---
source: architect
source_type: codebase
source_lines: 1293
language: markdown
file_count: 11
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — architect

## Overview (L1)

- `/architect` is the load-bearing decision skill: it runs structured discovery, weighs options with one recommended pick per question, and writes a build spec into `docs/specs/` before implementation starts.
- Four modes select the design behaviour: `FEATURE` (new feature), `ARCHITECTURE` (greenfield stack), `ENHANCEMENT` (change something that exists), `CROSS-CUTTING` (one standard across the whole codebase).
- It sorts every question three ways: `INFER` (derive from prompt/codebase, never ask), `ASK` (only the engineer knows: requirements, preferences, business rules), `RECOMMEND` (expertise settles: provider, library, pattern; state the pick, a one-line why, and the runner up).
- Spec statuses: `Proposed`, `In Progress`, `Accepted`, `Superseded by NNNN`, and `Assumed`; a feature-linked spec mirrors its feature lifecycle while a standalone decision spec is ratified straight to `Accepted`.
- Ownership rule: only `/architect` writes spec content and only `/architect` clears an `Assumed` status; `/develop` may create `Assumed` but never deliberates it.

## Structure (L2)

### SKILL.md — modes and status model

- Locator: `[[sources/jsm-skills/20261001/skills/architect/SKILL.md#What this skill does]]`
- Purpose: Defines the four modes, the create/update/supersede/ratify operations, and the two status behaviours (feature-linked vs standalone decision spec).
- Key rules: (1) Feature-linked spec is born `Proposed`; `/develop` advances it to `In Progress`, then `Accepted` on ship, while `/architect` owns content only. (2) Standalone decision spec (no scope row) is promoted to `Accepted` on ratification. (3) A spec documenting already-shipped work is born `Accepted`. (4) `Assumed` never blocks `done`; only `/architect` clears it.
- Learner-relevant: A lifecycle model where content ownership and status advancement are deliberately split across two skills.

### SKILL.md — Asks vs acts

- Locator: `[[sources/jsm-skills/20261001/skills/architect/SKILL.md#Asks vs acts]]`
- Purpose: The intent rule that keeps the questioning budget on substance, not on what can be inferred.
- Key rules: (1) `INFER`: anything the prompt or codebase reveals (platform, stack, chosen provider), never ask. (2) `ASK`: only what the engineer alone knows. (3) `RECOMMEND`: expertise-settled choices, stated with pick + why + runner up, never a neutral menu or a silent decision. (4) Never bundle a whole data model, stack, or acceptance-criteria set into one accept/change panel.
- Learner-relevant: A reusable taxonomy for deciding what an agent should derive versus ask versus decide.

### SKILL.md — Artifact ownership

- Locator: `[[sources/jsm-skills/20261001/skills/architect/SKILL.md#Artifact ownership]]`
- Purpose: Where a spec lives and what shape it takes; the two independent axes of location and shape.
- Key rules: (1) Location = repo shape: `docs/specs/`, monorepo `docs/specs/<workspace>/`, repo-wide `docs/specs/_root/`; numbering is per location. (2) Shape = decision size: single file `NNNN-title.md` by default, or directory `NNNN-title/` with `index.md` + `rationale.md` (plus child specs for an umbrella). (3) Default to a single file; never double the name. (4) Only `/architect` writes specs; `docs/scope/` is owned by `/scope`.
- Learner-relevant: How a single build spec is split from its decision record so a build never loads the reasoning.

### SKILL.md — Subagents (main thread writes)

- Locator: `[[sources/jsm-skills/20261001/skills/architect/SKILL.md#Subagents (main thread writes; subagents only read, fetch, or cross check)]]`
- Purpose: The main thread runs the conversation and writes; three read-only helpers (codebase scan, web fetch, cross check) never write and never inherit the session model.
- Key rules: (1) `scout` reads a large codebase on the cheapest model and returns a compact map, not dumps. (2) `researcher` fetches current tool landscape and Agent Skill/MCP discovery once, in Stage (c). (3) The cross-check subagent always ASKS whether to run; it never runs or skips on the engineer's behalf. (4) Web is fetched once; its links are human-facing and never re-fetched.
- Learner-relevant: The write/read separation that keeps authorship on the trusted main thread and isolates search noise.

### SKILL.md — Ratify an assumed decision

- Locator: `[[sources/jsm-skills/20261001/skills/architect/SKILL.md#Ratify an assumed decision]]`
- Purpose: How an `Assumed` spec (created by `/develop`'s build-first escape hatch) is deliberated and cleared.
- Key rules: (1) Read the assumed spec's `## Owed decision`, `## Assumption built on`, and `## Code area` first. (2) Run the normal design conversation anchored to what was actually built. (3) If the assumption holds, fill real content and set status to the feature's lifecycle state, clearing `Assumed`. (4) If wrong, write a corrected spec and mark the old one `Superseded by [NNNN]`, telling the engineer to redo the build.
- Learner-relevant: An escape hatch that lets shipping proceed while still forcing a later, documented ratification.

### internal/design-conversation.md — scope validation

- Locator: `[[sources/jsm-skills/20261001/skills/architect/internal/design-conversation.md#Scope validation (before Framing)]]`
- Purpose: The two gates before design: Check B detects an existing decision to document, Check A detects a product-vision topic that must be narrowed to one decision.
- Key rules: (1) Check B runs first and scans for phrases like "we built", "we chose"; if found, offer document-it (recommended) vs full process. (2) The documentation path asks free-text why/alternatives/tradeoffs, skips the staged conversation, and writes status `Accepted`. (3) Check A: a product-scoped topic (names no specific decision, needs 5+ specs) is narrowed by offering 4 foundational first decisions. (4) Mark each already-made decision faithfully; never invent alternatives.
- Learner-relevant: How a skill disambiguates "explore a choice" from "record a choice already made".

### internal/design-conversation.md — staged design conversation

- Locator: `[[sources/jsm-skills/20261001/skills/architect/internal/design-conversation.md#Staged design conversation: gated, acceptance criteria first (main model)]]`
- Purpose: The ordered interview protocol: enumerate load-bearing dimensions, walk stages (a) requirements → (b) data model → (c) stack/tool walk → (d) API surface → (e) security → (f) edge cases, one question per dimension.
- Key rules: (1) Exactly one option is marked `(recommended)` with a one-line why; the last slot is always custom free text. (2) Never bundle a finished artifact for accept/change except the final spec review; the data model gets its own show-and-confirm loop. (3) Stage (b) is mandatory for a data-backed feature: ask entities → fields → relationships → constraints, then SHOW an ERD and iterate until accept. (4) Completeness gate: no dimension silently skipped; a short interview is a red flag.
- Learner-relevant: Turning a vague feature into a fully specified contract via staged, gated questioning.

### internal/tool-discovery.md — the consent gate

- Locator: `[[sources/jsm-skills/20261001/skills/architect/internal/tool-discovery.md#Step 1: Ask first (the consent gate)]]`
- Purpose: The Agent Skill / MCP discovery flow: asking is mandatory, searching is not; nothing is searched, fetched, installed, or spawned before the engineer picks.
- Key rules: (1) Four choices: find them for me (recommended), I'll name them, no/skip, not now; only "find them" may run a search. (2) Discovery runs in a read-only, low-cost subagent in the background while the interview continues. (3) Skip what `skills list` or `AGENTS.md` already shows installed or declined (no-nag). (4) `No` records the decline; `Not now` adds a passive `## Follow-up` note; `/audit` and `/sync` own writing `AGENTS.md`.
- Learner-relevant: A consent-first design for network and install side effects, with an explicit no-nag memory.

### internal/after-subagent.md — after the spec is written

- Locator: `[[sources/jsm-skills/20261001/skills/architect/internal/after-subagent.md#After the spec is written]]`
- Purpose: Self-check the spec for required sections, offer an independent cross check, confirm with the engineer, then ratify status and link the scope.
- Key rules: (1) Verify all required sections exist per mode; flag blank fields as `⚠️ Incomplete`, never fabricate. (2) The cross-model critic always asks; tier sets the recommendation (strong at `GA`/`Beta`, skip at `Prototype`), and its primary job is decision completeness (values an action must produce whose source the spec never names). (3) Gaps are surfaced with a recommended fix, never silently resolved. (4) On accept, derive 2-5 build milestones into the scope row (never the atomic dump) and ratify status per spec kind.
- Learner-relevant: An independent-review pattern where the critic detects missing decisions but the engineer still decides.

### agent-prompt.md — the architect persona

- Locator: `[[sources/jsm-skills/20261001/skills/architect/agent-prompt.md#Who you are]]`
- Purpose: The Staff/Principal persona and the "challenge the premise" step (Step 0b) that runs before any code reading or option forming.
- Key rules: (1) Simple beats clever; boring technology is a feature; design for failure, not the happy path; think in day 1 / day 180 / day 730 horizons. (2) Never present options without a clear recommendation, never say "it depends" without answering on what. (3) Step 0b premise note flags known failure patterns (premature microservices, NoSQL for relational data, big bang rewrite, reinventing auth, org isolation as an afterthought). (4) Value sourcing must trace every value an AC needs to a named source, or it is an undecided input.
- Learner-relevant: A concrete catalogue of architecture failure patterns and the discipline of recommending rather than hedging.

### spec-template.md — status values and audience split

- Locator: `[[sources/jsm-skills/20261001/skills/architect/spec-template.md#Status values]]`
- Purpose: The status table, the feature-mirrored vs standalone behaviour, and the split of a spec into a build spec (`index.md`) and decision record (`rationale.md`).
- Key rules: (1) `Proposed` → `In Progress` → `Accepted` is feature-mirrored; `Assumed` is the exception that stays until ratified. (2) Build spec = Requirements, Decision, design section, Build plan, Consequences; decision record = Context, Options considered, Rationale, References. (3) Umbrella children carry no status line and each is self-sufficient to build from. (4) One decision per spec; split into umbrella + children rather than letting one file sprawl.
- Learner-relevant: How a document serves two audiences by physically separating what to build from why it was chosen.

### agent-modes/ — the four mode playbooks

- Locator: `[[sources/jsm-skills/20261001/skills/architect/agent-modes/feature.md#FEATURE mode]]`
- Purpose: One mode file per mode: `feature.md` (first-principles design + `## Feature design`), `architecture.md` (layer-by-layer stack, `## Proposed stack`), `enhancement.md` (read the live system, strangler instinct, `## Migration plan`), `cross-cutting.md` (sample current state, `## Standard definition`).
- Key rules: (1) FEATURE: idempotency from day one, pagination mandatory, soft deletes usually wrong, audit logs required for money/access/medical. (2) ARCHITECTURE: monolith first, relational DB default, prefer the project's existing stack, pick the product fresh in its durable category. (3) ENHANCEMENT: measure before optimising, strangler over big bang, safe migration sequence (add nullable → dual write → backfill → constrain → drop). (4) CROSS-CUTTING: define one canonical pattern with the strongest feasible enforcement (lint > type > PR checklist) and an explicit rollout.
- Learner-relevant: Four distinct design postures, each with its own failure patterns and required spec section.
