---
source: jsm-skills
source_type: codebase
source_lines: 997
language: markdown
file_count: 12
part: 2
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 2)

## Overview (L1)

- `develop` — the workflow's builder stage. It turns an already approved spec plus project conventions into working code, and it is the counterpart to `/architect` (which decides) and `/check`, `/test` (which verify). It gates on a spec first, routes any load bearing undecided choice back to `/architect`, then implements a UI track, a logical/backend track, or both. Teaches: implementing against a written spec (not re-litigating decisions), input-coverage gating, design-first UI construction with real tokens and accessibility, backend phases from data model to integration, and the discipline of deleting superseded code rather than leaving old and new side by side.
- `flow/` — the post-gate build flow (classify track, load spec + conventions, explore, doc check, build, update scope and report) and the optional git integration policy (branch before building, commit per milestone).
- `ui/` — four mutually exclusive design-source routes (Figma MCP, pasted image, existing design system, generated from nothing) plus the shared implementation phases and the accessibility/token checklist.

## Structure (L2)

### skills/develop/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/SKILL.md]]`
- Purpose: Entry point for the `develop` skill. Establishes the output style (plain words, no dashes/hyphens), the "gates then acts" posture, and artifact ownership rules (writes app code; touches `docs/scope/` only surgically; owns exactly one spec write, the `Assumed` spec). Defines the Step 0 spec gate using a mechanical **input coverage test** (enumerate every value the build must produce; if the spec does not name its source, a decision is owed), the scaffold-task exception, the freshness/collaboration checks (`git fetch`, behind count, uncommitted work, teammate mid-build), and routes to `flow/build.md`.
- Key exports: skill `develop`; Step 0 gate; the `Assumed` spec template (`Owed decision`, `Assumption built on`, `Code area`, `Requirements`, `Ratify`); the three-option panel (`Architect it first` / `No, not needed` / `Build now, record it as an assumed spec`).
- Dependencies: `flow/build.md`, `flow/git.md`, `ui-guide.md`, `logical-guide.md`, `checklist.md`, `./design.md`; references `/architect`, `/check verify`, `/test`, `/audit`, `/sync`; reads nearest `AGENTS.md` `## Git`.
- Learner-relevant: how to gate AI code generation so it never silently invents a load bearing decision; distinction between "local implementation detail" and a value whose source an acceptance criterion constrains; the assumed-spec escape hatch that keeps a decision durable in the repo rather than in chat.

### skills/develop/flow/build.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/flow/build.md]]`
- Purpose: The Steps 1–4 build flow read after the gate clears. Step 1 classifies the track (UI / Logical / Both) by signal words; Step 2 loads the governing spec's build sections, nearest `AGENTS.md`, `design.md`, the build approach, and tool skills, with a spec-completeness check (sections present + input coverage) and a precedence rule (spec beats project convention, conflicts flagged for `/sync`); Step 2.5 offloads code exploration to a read-only `scout` subagent returning a compact map; Step 2.6 offloads current API lookups to a read-only `researcher`; Step 3 resumes at the first unchecked build-plan task and builds inline (never a code-writing subagent); Step 4 updates scope and spec status and emits verify steps.
- Key exports: track classification table; spec-gap ask panel; the seven build-approach strategies (vertical end-to-end slice, thinnest usable whole, UI shell first / Facade, full journey per phase); big-rollout sequencing (primitive first, site by site, gate once, never half-migrate); verify-step emission and `verify.md` format.
- Dependencies: `ui-guide.md`, `logical-guide.md`, `checklist.md`, `logical-guide.md` phases; `docs/scope/`, `docs/specs/`; subagent types `scout`/`researcher`; `/architect`, `/check verify`, `/test`, `/sync`, `/clear`, `/compact`; `docs/conventions.md`.
- Learner-relevant: resumability from a durable task list; isolating reads from writes (explore in a cheap subagent, build on the main thread); "spec wrong partway through → update spec before patching"; treating "generated but unapplied migration" as not done.

### skills/develop/flow/git.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/flow/git.md]]`
- Purpose: Git policy read only when `AGENTS.md` `## Git` says `integration: on`. Covers ensuring a repo exists, branching before building (`<prefix><feature-slug>`, default `feat/`), and committing per the configured setting (`per-milestone` default, `end-of-build`, or `manual`) with a one-line Conventional Commit subject plus required `Co-Authored-By` trailer; push and PR always confirm and are `/document`'s job.
- Key exports: branch/commit rules; commit message convention.
- Dependencies: nearest `AGENTS.md` `## Git` block; `/audit` (normally initialises git), `/document` (PR).
- Learner-relevant: baking version-control hygiene into an agent workflow (branch per feature, milestone commits, never push/publish outward without confirmation).

### skills/develop/logical-guide.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/logical-guide.md]]`
- Purpose: The backend/logic build track. Casts the agent as a senior backend engineer implementing `/architect`'s decision without re-litigating it; ground rules (build to spec, match codebase, infer/ask/recommend). Seven phases: ground in the decision, data layer, core logic and services, interface surface (API/actions), integration and configuration, remove superseded code, correctness/safety pass. Ends with a headline-first report template.
- Key exports: phase sequence; data-layer "applied and schema confirmed live" rule; idempotency for money/messaging/side effects; authorization-not-just-authentication; paginate every list; rate-limit public endpoints; webhook signature verification and idempotent handlers; superseded-code deletion proof.
- Dependencies: governing spec (`## Feature design`, `## Requirements` ACs, `## Consequences`, `## Build plan`); Step 2.5 exploration map; nearest `AGENTS.md`; `/architect` when the spec proves wrong; `/check verify`, `/test`; a connected database MCP; `docs/conventions.md`.
- Learner-relevant: practical backend correctness techniques (constraints in the DB, explicit state machines, idempotency, fail-closed validation, structured/audit logging) and refactor discipline (old and new must not coexist; prove no references remain).

### skills/develop/ui-guide.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/ui-guide.md]]`
- Purpose: The UI build track. Defines the "bar" that IS the definition of done for any UI page (a complete professional product surface, never a lone form or unstyled stub), with an explicit disqualifier list, and mandates a two-pass method: design the surface first (bold, complete), then integrate it into the codebase (tokens, semantics, accessibility, responsiveness). Routes the design source by what the spec recorded (Figma MCP / pasted image / existing design system / generate from nothing), handles greenfield vs brownfield detection (`design.md` presence, existing UI), decides component vs screen, and detects the platform's framework, styling, navigation, light/dark and icon systems.
- Key exports: the bar + disqualifiers; design-source routing table; Steps 0–0.5 (source, `design.md` check, brownfield check, capture direction from code, component/screen); platform detection checklist; Step 1 loads exactly one `ui/*.md` source file.
- Dependencies: `ui/mcp.md`, `ui/image.md`, `ui/existing.md`, `ui/generate.md`, `ui/implementation.md`, `checklist.md`, `./design.md`, `frontend-design` skill; `SKILL.md` Step 2 build approach; `/develop` spec.
- Learner-relevant: what "done" means for AI-generated UI; separating design (composition, brand, copy, states) from integration (tokens, semantics); detecting and respecting a platform's existing conventions instead of imposing a framework.

### skills/develop/ui/implementation.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/ui/implementation.md]]`
- Purpose: The shared implementation phases all UI source routes converge on. Includes font installation (proprietary-font substitution table and loading), asset resolution (find project assets or ask; placeholder service vs local gradient placeholders, centralised and swappable), placeholder data for Facade/UI-shell builds, then Phase 0 compose the full product surface (per screen type: auth, dashboard, list, detail, landing, settings, etc.), Phase 1 semantic structure, Phase 2 token application (no raw literals duplicating a token), Phase 3 responsive layout, Phase 4 states and motion, Phase 5 accessibility (platform-native), Phase 6 audit-your-own-work before reporting.
- Key exports: font substitution table; asset-resolution ask panel; placeholder-data pattern; Phases 0–6; UI report template.
- Dependencies: `checklist.md` (thresholds and pass/fail gate), `design.md`, the project styling/theme system as token source of truth; `AGENTS.md`/spec for product copy; `/test`, `/check verify`.
- Learner-relevant: accessibility built into every phase rather than bolted on; the design-first/integrate-second split; treating tokens as the only source of visual values; self-audit against render (actually look at the page) before declaring done.

### skills/develop/ui/existing.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/ui/existing.md]]`
- Purpose: UI source route case 3 — a design system already exists. Distinguishes the two sources of truth: `design.md` holds art direction (character, build mandate, composition/component rules) while the styling/theme system holds the token VALUES. Steps DS1 read direction and tokens, DS2 confirm token coverage (derive missing tokens from nearest, never hardcode, never silently overwrite), DS3 implement via `ui/implementation.md`.
- Key exports: DS1–DS3; `colors.primary`/`colors.accent` synonym note.
- Dependencies: `design.md`, project styling/theme system, `ui/implementation.md`.
- Learner-relevant: keeping art direction and token values in separate files so values are never duplicated; extending a design system for a new page while matching what is shipped.

### skills/develop/ui/generate.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/ui/generate.md]]`
- Purpose: UI source route case 4 — nothing provided, so derive a design system then build. Prefers a proven design skill (`frontend-design`) when available. B1 finds a direction (ask for a reference: site/brand URL, `design.md` URL, described style, or nothing; then pick a mood — dark & focused, light & professional, bold & editorial, custom). B2 derives tokens rather than recalling them: one accent, a six-step neutral ladder, verify WCAG contrast (light AND dark separately) before writing CSS, a modular type scale, 4px/8px spacing, three radius and three motion steps; then writes `design.md` as art direction only. B3 writes the actual token file into the platform's styling/theme system.
- Key exports: direction/mood prompts; the neutral-ladder token table (`--color-canvas/surface/border/muted/body/ink` + success/error/on-accent); contrast thresholds; type/space/radius/motion rules; the aesthetic guide (cyberpunk, brutalist, glassmorphism, Notion, Apple consumer, named brand); `design.md` schema; B3 token list.
- Dependencies: `frontend-design` skill or a design MCP; `ui/image.md` and `ui/mcp.md` (if a real reference appears, route back); `ui/implementation.md`; the project styling/theme system.
- Learner-relevant: deriving and *verifying* a design system (compute contrast, don't guess); modular typographic scales; separating direction (`design.md`) from values (CSS); mood as a small set of levers (canvas polarity, accent saturation, type personality, density).

### skills/develop/ui/image.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/ui/image.md]]`
- Purpose: UI source route case 2 — a pasted screenshot/image is the source. Path A replicates the image faithfully (fidelity governs, no embellishment) while tokenizing what is visible; Path B is when no image is actually attached (routes to generate). A0 disambiguates multiple images (widths → responsive breakpoints, states → state diffs, light+dark → both token sets). A1 extracts exact tokens (colors, typography, spacing, geometry, motion, mode). A2 writes values to the styling/theme system (`accent` as canonical name) and character to `design.md`. A3 stops on token-file conflicts and offers update/extend/skip.
- Key exports: Path A/B selection; A0–A3; token extraction fields.
- Dependencies: the pasted image in conversation; project styling/theme system; `design.md`; `ui/generate.md` B2 schema; `ui/implementation.md` Phases 3 and 5.
- Learner-relevant: pixel-faithful replication as a distinct mode from generation; extracting a token set from a bitmap and re-deriving the responsive/accessible behavior a single screenshot cannot show; conflict handling when new values clash with existing tokens.

### skills/develop/ui/mcp.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/ui/mcp.md]]`
- Purpose: UI source route case 1 — Figma or another connected design MCP is the source. Pull the real design (tokens, spacing, components, named frames, assets) into `./design.md`, use real values, record file/frames in the report, and confirm before continuing. If no MCP is connected, say so and ask the engineer to connect it or pick another source; never silently fall back to generated design.
- Key exports: MCP route procedure.
- Dependencies: a design MCP; `./design.md`; `ui/implementation.md`.
- Learner-relevant: treating a connected design tool as the source of truth and refusing to silently substitute invented values when it is unavailable.

### skills/develop/checklist.md

- Locator: `[[sources/jsm-skills/20260929/skills/develop/checklist.md]]`
- Purpose: The pass/fail accessibility and token gate for the UI track (Phase 5), explicitly distinct from `implementation.md` (which explains HOW to build, this owns the thresholds). Sections: operable without a pointer, focus visibility, semantic structure, labels/accessible names, name/role/state, colour contrast, modal/dialog, token discipline, responsive (best effort), loading/error/empty states. **required** items must pass before the skill is complete.
- Key exports: the checklist itself; concrete thresholds (4.5:1 normal text, 3:1 large text and control boundaries, 44×44 touch targets, 3:1 focus indicator).
- Dependencies: loaded by `ui-guide.md`/`ui/implementation.md` Phase 5; project tokens.
- Learner-relevant: a concrete, testable accessibility bar (WCAG-derived) and token hygiene rules (no raw literals; missing token documented as `// TODO: missing token: …` rather than invented).

### skills/develop/agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/develop/agents/openai.yaml]]`
- Purpose: OpenAI Codex adapter supplying the display metadata Codex shows in its agent picker; the skill's real instructions remain in `../SKILL.md`.
- Key exports: `interface.display_name` ("Develop"), `short_description`, `default_prompt`.
- Dependencies: `../SKILL.md`.
- Learner-relevant: how one skill definition is surfaced across multiple agent clients via a thin per-client metadata file.
