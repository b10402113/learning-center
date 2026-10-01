---
source: develop
source_type: codebase
source_lines: 997
language: markdown
file_count: 12
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — develop

## Overview (L1)

- `/develop` is the builder skill: it turns an approved spec plus project conventions into working code for a UI track, a logical/backend track, or both, run after `/architect` has recorded the decision.
- It always gates first with a mechanical input coverage test (every value the build must produce or display needs a named source), then offers three options: architect it first, no decision needed, or build now and record an assumed spec.
- After the gate it classifies the track, loads the spec / `AGENTS.md` / `design.md`, explores read only, and builds inline; the backend order is data → core logic → endpoints → integrations → delete old code → safety pass, while UI routes by design source (Figma, pasted image, existing system, or create one).
- Writes: spec status `Proposed → In Progress → Accepted`, scope milestone ticks, and an optional `verify.md`; the engineer decides and the AI recommends, so every later step (`/check verify`, `/test`) is a suggestion, never a gate.

## Structure (L2)

### SKILL.md — what the skill does

- Locator: `[[sources/jsm-skills/20261001/skills/develop/SKILL.md#What this skill does]]`
- Purpose: Defines `/develop` as the builder that converts a spec plus conventions into code, across three track shapes (UI, Logical, Both, e.g. "auth" = pages + session logic runs both).
- Key rules: Step 0 gates on the spec so load bearing choices (auth provider, payment provider) are decided in `/architect`, not invented mid build; asks only what the design left open and otherwise infers from the spec, `AGENTS.md`, and codebase; writes in plain warm language with no dashes or hyphens.
- Learner-relevant: A lesson on why a build step must be downstream of a decision step, and on splitting a request into independent UI vs logic tracks.

### SKILL.md — Step 0 spec gate and its three options

- Locator: `[[sources/jsm-skills/20261001/skills/develop/SKILL.md#Step 0: The spec gate (always first)]]`
- Purpose: The hard first gate. It runs a positive input coverage test: enumerate every value the build must produce/compute/display from the ACs, and for each ask whether the spec names its source (input, DB column, derivation, prior decision); any unnamed source is an owed decision.
- Key rules: A decision is also owed when you'd have to invent a provider/library/data model/cross cutting pattern, a whole UI page or screen, or a feature's behavior; a "local implementation detail" is only a choice among sources the spec already permits (loop style, variable name), so anything determining a value's source is load bearing; on a gap, present three options, `Architect it first` (ends the run with a `/architect` handoff), `No, not needed` (proceed), `Build now, record it as an assumed spec` (write a minimal `Status: Assumed` spec, then build); false negatives are the failure mode, so when unsure treat as owed and ask.
- Learner-relevant: The core concept of distinguishing a load bearing decision from local wiring, and of a spec gate that routes unresolved decisions rather than guessing.

### SKILL.md — artifact ownership and output style

- Locator: `[[sources/jsm-skills/20261001/skills/develop/SKILL.md#Artifact ownership]]`
- Purpose: Draws the ownership boundary: `/develop` writes app code (plus CSS/tokens), while spec content, `AGENTS.md` restructuring, and decision deliberation belong to other skills.
- Key rules: Only touches the `**Status**:` line (`Proposed → In Progress`, then `In Progress → Accepted` once the feature ships) and never an `Assumed` spec's state (ratification is `/architect`'s); may create exactly one spec, an `Assumed` record with the assumption fields; shared scope is re-read immediately before ticking and only the specific checkbox/status/pointer line is edited (flag, never clobber, if unexpected).
- Learner-relevant: A lesson on single-writer ownership of shared artifacts and surgical edits to files other agents also own.

### SKILL.md — freshness and collaboration before building

- Locator: `[[sources/jsm-skills/20261001/skills/develop/SKILL.md#Before you build: freshness & collaboration (don't build on stale state or over a teammate)]]`
- Purpose: Prevents building on stale state or over a teammate; skipped silently when solo, offline, or non git.
- Key rules: `git fetch` quietly, base `main` else `master`; behind by any commits → warn and stop until the branch is pulled; uncommitted work in the touched area → warn to commit or stash (may proceed if insisted); a feature `in-progress` whose code area has recent commits by another author → warn to coordinate before continuing; warnings are surfaced, not hard blocks.
- Learner-relevant: A lesson on the cheap freshness/collision checks a build should run before mutating shared state.

### flow/build.md — classify and load (Steps 1-2)

- Locator: `[[sources/jsm-skills/20261001/skills/develop/flow/build.md#Step 1: Classify the track]]`
- Purpose: Post gate routing and context loading. Step 1 classifies UI (page/component/screen/layout signals) vs Logical (api/endpoint/service/data/webhook) vs Both; Step 2 loads the governing spec, nearest `AGENTS.md`, `design.md` (UI), the build approach, and governing tool skills.
- Key rules: Read only the spec's build sections (`## Requirements`, `## Decision`, design/stack, `## Build plan`, `## Consequences`), skipping rationale/history; precedence on conflict is spec wins for its feature, else `AGENTS.md`, and conflicts are flagged not silently resolved; a spec completeness check runs before any code, first for sections present (logical: data model/API/security/invariants; UI: screens and states), then the same input coverage test, with load bearing gaps offering only `Update the spec first` / `Tell me the answer now` and local details additionally allowing best judgment.
- Learner-relevant: The concept of a pre-code completeness check and of resolving spec-vs-convention conflicts by explicit precedence.

### flow/build.md — explore before building (Steps 2.5-2.6)

- Locator: `[[sources/jsm-skills/20261001/skills/develop/flow/build.md#Step 2.5: Explore before building (isolate the reading)]]`
- Purpose: Isolates code reading into a read only subagent so opened files do not bloat the main context; Step 2.6 offloads current tool-usage lookups to a read only web subagent only when genuinely needed.
- Key rules: Skip exploration for tiny known changes or light contexts, run it for large/monorepo/unfamiliar areas; the scout returns only a compact map (files to create/edit, patterns `file:line`, symbols to reuse, gotchas), never file dumps; both subagents pin a fast, cheap model, not the session model; doc checks are for *how to use* an already decided tool, never to choose or reconsider one.
- Learner-relevant: A lesson on context isolation via subagents and on separating read/explore cost from write/decide cost.

### flow/build.md — resume check and build (Step 3)

- Locator: `[[sources/jsm-skills/20261001/skills/develop/flow/build.md#Step 3: Resume check, then build]]`
- Purpose: Performs the actual write step inline on the main thread, after a resume check.
- Key rules: Main thread writes the code, never a subagent; resume finds the first unchecked `## Build plan` task and does not rebuild `[x]` tasks, setting the feature `in-progress`; a data layer change is not done until its migration is applied and the live schema confirmed (not merely generated); a build replacing existing code must delete the superseded functions/branches/files and prove nothing references them, with a large rollout sequenced primitive first, then site by site, then one gating typecheck; if the spec is proven wrong, stop and route to `/architect` before coding the deviation.
- Learner-relevant: A lesson on resumable, migration-verified builds and on removing superseded code as part of the build rather than a later chore.

### flow/build.md — update scope and report (Step 4)

- Locator: `[[sources/jsm-skills/20261001/skills/develop/flow/build.md#Step 4: Update the scope and report]]`
- Purpose: Marks only what actually landed, then offers the next step; emits verify steps and asks where they go.
- Key rules: Tick atomic tasks in the spec and milestone boxes in the scope (only verified builds), close with an explicit report of what was ticked; `done` is the engineer's call, and no later step is ever required; verify steps are derived one per acceptance criterion plus one per row of the spec's Value sourcing table, and `verify.md` is written only on the engineer choosing `Save` (existing file append, never clobber); an `Assumed` spec does not block `done` but is flagged as owing ratification.
- Learner-relevant: A lesson on honest progress tracking, on `done` as a human decision, and on turning acceptance criteria into concrete verification steps.

### flow/git.md — branch and commit handling

- Locator: `[[sources/jsm-skills/20261001/skills/develop/flow/git.md#Branch (before building, in the freshness & collaboration check)]]`
- Purpose: Active git work, read only when the nearest `AGENTS.md` `## Git` says `integration: on`; absent or `off` means no active git.
- Key rules: Ensure a repo exists (`git init` if needed), never build on the default branch (offer `<prefix><feature-slug>`, default `feat/`, reuse an existing feature branch); commit mode is `per-milestone` (offer a commit when a green milestone lands), `end-of-build`, or `manual`; messages are a one line Conventional Commit subject (no prose body, why lives in spec/PR) plus a required `Co-Authored-By` trailer; never `git push` here (push and PR are `/document`'s, confirmed).
- Learner-relevant: A lesson on branch hygiene and on commit granularity tied to verified milestones.

### logical-guide.md — backend build phases

- Locator: `[[sources/jsm-skills/20261001/skills/develop/logical-guide.md#Phases]]`
- Purpose: The logical/backend track, played as a senior backend engineer who implements the decision `/architect` already made.
- Key rules: Ordered phases — 1 ground in the decision/spec/integration points, 2 data layer (schema/migrations applied and schema confirmed live, invariants enforced at the DB, nullable→backfill→constraint), 3 core logic (explicit state machine rejecting invalid transitions, idempotency for money/messaging/side effects, boundary validation fail closed, project error pattern), 4 interface surface (endpoints exactly per spec table, enforce authorization not just authentication, paginate every list, consistent error shapes, rate limit public endpoints), 5 integration/config (wire the decided provider, secrets from env never hardcoded, verify webhook signatures and make handlers idempotent, structured and audit logging), 6 remove superseded code, 7 correctness and safety pass; a spec proven wrong any time stops the build and routes to `/architect`.
- Learner-relevant: A repeatable backend sequence from data layer to safety pass, and the invariant/idempotency/authorization rules that distinguish a production service.

### ui-guide.md — design-source routes and the “bar”

- Locator: `[[sources/jsm-skills/20261001/skills/develop/ui-guide.md#Design source (route by what you were given)]]`
- Purpose: The UI track, defined by a professional “bar” (a senior product designer shipping a complete surface, never a bare form) and routed by where the design comes from.
- Key rules: Four routes — Figma/design MCP (`ui/mcp.md`, pull real frames/tokens), a pasted image (`ui/image.md`, replicate pixel perfect and tokenize, do not embellish), an existing design system (`ui/existing.md`, build within it at the bar), or nothing (`ui/generate.md`, establish and verify the system first); design first then integrate in two passes, and any disqualifier (lone centered form, dead zones, unstyled/naked elements, default only styling, missing states, orphaned controls) means NOT done; detect the platform’s UI, styling/theme, navigation, light/dark, and icon systems and build in their idioms; before/after the routes check `design.md`, do a brownfield check for existing UI, and decide component vs screen.
- Learner-relevant: A lesson on design-source routing and on a concrete definition of done for UI quality.

### ui/implementation.md — implementation phases

- Locator: `[[sources/jsm-skills/20261001/skills/develop/ui/implementation.md#Implementation phases]]`
- Purpose: The shared UI build procedure once a design source has resolved tokens, assets, and direction; also covers font installation, asset resolution, and placeholder data.
- Key rules: Phase 0 composes the whole product surface in writing before markup (brand, real copy, considered layout, supporting content, functional core); Phase 1 semantic structure (real action vs navigation primitives, list/table/landmark primitives, one primary title); Phase 2 token application (no raw literal duplicating a token, missing token documented as TODO not invented); Phase 3 responsive (44×44 targets, readable body copy, line length); Phase 4 states and motion (default/hover/focus/active/disabled/loading/error/empty, respect reduced motion); Phase 5 accessibility built in Phases 1-4; Phase 6 audit the build against the bar’s disqualifiers and render it if possible.
- Learner-relevant: A workshop-ready sequence from composition to accessibility enforcement, with the concrete thresholds a professional UI must meet.

### checklist.md — UI accessibility and token gate

- Locator: `[[sources/jsm-skills/20261001/skills/develop/checklist.md#Colour contrast (required)]]`
- Purpose: The pass/fail gate loaded on the UI track during Phase 5; sections marked required must pass before the skill is complete.
- Key rules: Contrast requirements — normal text ≥ 4.5:1, large text ≥ 3:1, control boundaries/focus indicators ≥ 3:1, information never by colour alone; also required: keyboard operability in reading order, visible focus indicators distinct at ≥ 3:1, semantic structure (no skipped heading levels, real action/navigation primitives), persistent labels (placeholder is not the only label), name/role/state via the accessibility API only where native semantics fall short, modal focus management, loading/error/empty states; token discipline forbids raw colour literals and raw sizes that duplicate a token, with a missing token documented as `// TODO: missing token: <what's needed>`.
- Learner-relevant: A concrete, testable accessibility and tokenization rubric a lesson can teach and check against.

### ui/generate.md — derive and verify a design system

- Locator: `[[sources/jsm-skills/20261001/skills/develop/ui/generate.md#B2: Derive the tokens, do not recall them]]`
- Purpose: The no-source route: establish a design system, then build to the bar; prefer a proven design skill when available, else derive from B2.
- Key rules: Derive tokens, never recall a palette — one accent hue, a six-step neutral ladder tinted from the accent, then semantic success/error and on-accent colours, all written to the project’s styling/theme system, not `design.md`; verify WCAG contrast before writing CSS — body/ink ≥ 4.5:1, on-accent ≥ 4.5:1 (the one that usually fails), border-as-only-control-marker ≥ 3:1, large text/icons ≥ 3:1, checked in light and dark separately, and a failing pair is fixed, never shipped with a note; type uses a modular scale (base 16px, ratio 1.2/1.25/1.333), three weights at most, spacing on a 4px unit / 8px rhythm, three radius and three motion steps; `design.md` holds art direction and a build mandate only, pointing at the tokens rather than duplicating them.
- Learner-relevant: A lesson on deriving rather than recalling a palette, and on verifying contrast as the step that separates a derived system from a guessed one.
