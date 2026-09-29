---
source: jsm-skills
source_type: codebase
source_lines: 566
language: markdown
file_count: 13
part: 1
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 1)

## Overview (L1)

- `skills/scope` (SKILL.md) — the workflow entry point that turns a product idea into an ordered, coarse, living plan under `docs/scope/`. It answers WHAT to build, in what order, how much rigor, and which pieces need a decision first; it deliberately never chooses tools, leaving `/architect` to design and `/develop` to build. One command with inferred intent (`plan` / `replan` / `add`) so a bare `/scope` doubles as "where was I, what's next."
- approaches/{tracer-bullet,skateboard,facade,journey} — four named decomposition personas that decide how a product is sliced and sequenced. Each is read only when chosen, and the chosen persona's role is adopted for all slicing: Tracer Bullet (thin real vertical thread through every layer), Skateboard (smallest genuinely usable whole, ship then grow), Facade (broad clickable UI on mock data, wire backend later, prototype grade), Journey (one fully polished user path end to end per phase).
- modes/{plan,plan-greenfield,plan-brownfield,plan-monorepo,replan,add} — the behavior files, one read per run. `plan` orchestrates the multi-step planning pass (detect greenfield/brownfield/monorepo, ask in batched panels, choose approach, sequence foundations first, decompose, recommend workflow depth, write); the three `plan-*` routes specialize for repo shape; `replan` reconciles a shipped scope; `add` enrolls a single ad hoc feature.
- scope-template.md — the format reference: At a glance table, per-feature section shape, feature lifecycle table, brownfield enrollment and epic split shapes, and the `## /scope complete` report block.
- agents/openai.yaml — the OpenAI Codex adapter supplying picker metadata for the skill.

## Structure (L2)

### SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/SKILL.md]]`
- Purpose: Defines the `/scope` skill: output style (plain words, no dashes/hyphens), what the scope artifact is, its smoke shape, feature lifecycle, the three inferred behaviors, asks-vs-acts discipline, decision panels, artifact ownership and file shapes, status lifecycle, workflow tiers, concurrency rules, and the Step 0/Step 1 dispatch into exactly one mode file.
- Key exports: skill `scope` (command `/scope [what]`); behaviors plan / replan / add; workflow tiers `Prototype · Alpha · Beta · GA`; artifact base `docs/` (or `.workflow/` on a docs site).
- Dependencies: `modes/plan.md`, `modes/replan.md`, `modes/add.md`, `scope-template.md`; downstream `/architect`, `/develop`, `/check verify`, `/test`, `/sync`, `/audit`.
- Learner-relevant: The pattern of designing an AI command that infers intent from context instead of subcommands, writes a living durable artifact rather than chat state, and keeps planning tool-agnostic so it does not rot. Also the "single recommended option" decision-panel discipline and the "suggestions, never gates" philosophy.

### approaches/tracer-bullet.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/approaches/tracer-bullet.md]]`
- Purpose: Decomposition persona whose instinct is to prove the whole pipe works before building any layer fully; keeps real auth, schema, and UI while cutting only breadth.
- Key exports: approach `Tracer Bullet` (thin real vertical thread; first slice is the walking skeleton, merged not separate).
- Dependencies: referenced by `modes/plan.md` Step 3 and `modes/plan-greenfield.md`.
- Learner-relevant: Vertical slicing, the walking skeleton, and integrating early to retire the "layers might not connect" risk. Includes a worked async-standup example.

### approaches/skateboard.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/approaches/skateboard.md]]`
- Purpose: Persona that ships the smallest complete product a real person would use, then grows it release by release; willing to cut structure (teams, roles) to reach usability sooner.
- Key exports: approach `Skateboard` (thinnest usable whole; skateboard → bike → car).
- Dependencies: referenced by `modes/plan.md` Step 3; contrasted with Tracer Bullet and Journey.
- Learner-relevant: MVP thinking that still leaves a shippable product at every release, and the distinction between cutting breadth versus cutting structure.

### approaches/facade.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/approaches/facade.md]]`
- Purpose: Prototype-first persona: build all key screens on mock data, navigable and believable, then wire the real backend screen by screen behind the reviewed interface.
- Key exports: approach `Facade` (UI first, backend deliberately faked, prototype grade).
- Dependencies: referenced by `modes/plan.md` Step 3; per-feature override option.
- Learner-relevant: Buying feedback and validating the experience before backend investment, plus openly labelling prototype-vs-production transition as its own work.

### approaches/journey.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/approaches/journey.md]]`
- Purpose: Depth-first persona: finish one complete user journey (all steps, states, polish) before opening the next; the experience and funnel are the product.
- Key exports: approach `Journey` (one complete experience per phase, all states included).
- Dependencies: referenced by `modes/plan.md` Step 3 and per-feature overrides.
- Learner-relevant: Depth-first sequencing per journey, treating empty/error/confirmation states as part of "done," and how it contrasts with Tracer Bullet's thin loop first.

### modes/plan.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/modes/plan.md]]`
- Purpose: The plan-behavior orchestration: Step 1 detect repo shape and read one route file; Step 2 ask a generated question walk as batched panels (product/business, capabilities, cross-cutting & go-to-market); Step 3 choose build approach and adopt its persona; Step 4 foundations-first sequencing; Step 5 decompose into coarse feature sections (intent, `Done when:`, tier, approach override, `Needs spec?` via the invent test); Step 5b recommend workflow depth; Step 6 write scope; Step 6b references consent; Step 7 report.
- Key exports: mode `plan` (greenfield/brownfield/monorepo planning); the "invent test" for `Needs spec?`; Step 5b workflow panel.
- Dependencies: `modes/plan-greenfield.md`, `modes/plan-brownfield.md`, `modes/plan-monorepo.md`, `approaches/*`, `scope-template.md`.
- Learner-relevant: A complete, reusable playbook for scoping software: infer vs ask discipline, picking a slicing strategy, foundations before features, keeping specs coarse, and a consent gate before adding citations.

### modes/plan-greenfield.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/modes/plan-greenfield.md]]`
- Purpose: Greenfield route that decomposes a whole MVP from scratch, defining the "foundations first" ordered foundation features (standards, stack & architecture, coding standards & tooling, data model, design system, walking skeleton) and how the chosen approach shapes later slices.
- Key exports: route `plan greenfield`; foundations-first sequencing principle.
- Dependencies: `modes/plan.md` Step 4; `approaches/<name>.md`; `/architect`, `/develop`, `/audit`.
- Learner-relevant: Why foundations (especially the data model) are explicit features rather than buried tasks, the distinction between deciding the full stack and installing only the runnable skeleton, and avoiding the "double spec bug."

### modes/plan-brownfield.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/modes/plan-brownfield.md]]`
- Purpose: Brownfield route: read root `AGENTS.md` plus a light or subagent code scan, enroll already-built features as `existing` or `in-progress` with code pointers, plan the next slice as `planned`, and on re-run reconcile drift and dedup.
- Key exports: route `plan brownfield`; enrollment statuses `existing` / `in-progress`.
- Dependencies: root `AGENTS.md`, existing scope files, read-only `scout` subagent (Claude Code).
- Learner-relevant: How to honestly assess and onboard an existing codebase into a plan, distinguishing `existing` (pre-workflow) from `done` (pipeline-built), and reconciling plan-vs-reality drift.

### modes/plan-monorepo.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/modes/plan-monorepo.md]]`
- Purpose: Monorepo route: detect workspace configs, plan per workspace under `docs/scope/<workspace>/`, use `docs/scope/_root/` for repo-wide work, keep a top-level `index.md` mapping workspaces with rollups, and never bury cross-app work in one app's scope.
- Key exports: route `plan monorepo`; `_root` scope; workspace-aware `/scope <workspace> <idea>`.
- Dependencies: workspace manifests (`pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `lerna.json`), nested `AGENTS.md`; delegates to greenfield/brownfield per workspace.
- Learner-relevant: Adapting a single-product planning workflow to multi-workspace repos and handling cross-cutting shared foundations.

### modes/replan.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/modes/replan.md]]`
- Purpose: The living rhythm run after a feature or phase ships: read scope + code/specs, mark shipped features `done` (never stamp), surface `Assumed` decision debt, enroll follow-ups from spec Consequences/Follow-up sections, reorder/rephase, and queue the next slice.
- Key exports: mode `replan` (bare `/scope` when a scope exists).
- Dependencies: scope files, shipped specs' `## Consequences` / `## Follow-up`, `/architect`, `/develop`, `/sync`, `docs/conventions.md`.
- Learner-relevant: Keeping a plan honest as reality changes, growing scope from real build feedback, and treating unratified decisions as visible debt rather than blockers.

### modes/add.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/modes/add.md]]`
- Purpose: Lightweight mode to enroll one ad hoc feature that surfaced mid-build: dedup against the scope, ask only what's needed, offer the approach panel (default inherit), set `Needs spec?` via the invent test, then append one row and section and report briefly.
- Key exports: mode `add` (`/scope <a feature>`).
- Dependencies: `scope-template.md` shapes; `approaches/*` for overrides.
- Learner-relevant: A minimal, low-ceremony path to extend a plan without re-running the full planning pass, and applying the same `Needs spec?` judgement consistently.

### scope-template.md

- Locator: `[[sources/jsm-skills/20260929/skills/scope/scope-template.md]]`
- Purpose: The format reference for the scope artifact and report: readability rules (two parts, clean headings, each fact once, only what is set), the single-file template with At a glance table and feature sections, the feature lifecycle table, brownfield enrollment snippet, epic-split guidance, legend, and the `## /scope complete` report block.
- Key exports: scope format (single file, epic split, monorepo), feature-shape lifecycle (planned → designed → building → verified → done), workflow-tier consequences, completion report template.
- Dependencies: rules stated in `SKILL.md`; produced by all modes.
- Learner-relevant: A concrete, opinionated documentation format for a living scope, and how a doc's shape encodes state transitions and next actions so any skill can locate the next step.

### agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/scope/agents/openai.yaml]]`
- Purpose: OpenAI Codex adapter supplying the agent-picker interface metadata (display name, short description, default prompt) for the scope skill.
- Key exports: interface metadata for `Scope` (`display_name`, `short_description`, `default_prompt`).
- Dependencies: `../SKILL.md` holds the actual instructions; the client loads them alongside this file.
- Learner-relevant: How one skill ships cross-client by pairing portable instructions with thin per-agent adapters.
