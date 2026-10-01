---
source: scope
source_type: codebase
source_lines: 566
language: markdown
file_count: 13
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — scope

## Overview (L1)

- `/scope` turns a product idea into an ordered, coarse, living feature plan under `docs/scope/` and keeps it honest as the product ships; it seeds the WHAT, while `/architect` designs and `/develop` builds.
- One command with inferred intent: `plan` (no scope yet, or the next slice), `replan` (scope exists, no argument, the routine post-ship reconcile), or `add` (argument names one feature). SKILL.md routes to exactly one of six mode files; only the chosen plan route among greenfield / brownfield / monorepo is read.
- Reads project signals and the idea; writes only scope files (single `scope.md`, or an epic `index.md` + `<epic>.md` split; monorepo per workspace). It never picks tools (that is `/architect`), never writes specs, code, or `AGENTS.md`.
- Core rules: the engineer decides and the AI recommends; every user-facing question is a 2–4 option panel with exactly one `(recommended)` and never a neutral menu; every fact appears once; features stay coarse with no build-task breakdown.

## Structure (L2)

### SKILL.md — the entry contract and shared rules

- Locator: `[[sources/jsm-skills/20261001/skills/scope/SKILL.md#what-this-skill-does]]`
- Purpose: Defines scope shape, the three behaviors, artifact ownership, status lifecycle, workflow tier, and Step 0 intent inference before any mode file is read.
- Key rules: infer / ask / recommend; scope shape is a slim At-a-glance table plus phase-grouped sections each with intent, one `Done when:` line, and checkbox steps; statuses are `planned` → `in-progress` → `done` plus `existing` and `dropped`; `done` ≠ `existing`; the `#scope` header records build approach and workflow tier defaults, overridable per feature by a tag.
- Learner-relevant: the living scope document, the one-recommendation-per-question discipline, and how coarse scope defers all build tasks to `/architect`.

### SKILL.md — Asks vs acts, decision panels, artifact ownership

- Locator: `[[sources/jsm-skills/20261001/skills/scope/SKILL.md#asks-vs-acts]]`
- Purpose: Separates what `/scope` may infer from what it must ask, and states the option-panel contract and single-writer ownership.
- Key rules: never pick tools (a feature implying a tool choice is exactly `Needs spec: yes`); every choice is an options panel with one `(recommended)` and a one-line why; `docs/scope/` is owned by this skill; all edits are in place (reconcile and append, never dated files); read again immediately before writing for concurrency.
- Learner-relevant: the tool-agnostic scope and why a neutral menu is forbidden.

### approaches/ — the four build personas (Tracer Bullet, Skateboard, Facade, Journey)

- Locator: `[[sources/jsm-skills/20261001/skills/scope/approaches/tracer-bullet.md#build-approach-tracer-bullet-the-integration-proving-engineer]]`
- Purpose: Each file adopts one engineer persona that decides how a project slices and sequences its work, with a worked async-standup example and a contrast against the others.
- Key rules: **Tracer Bullet** — thin real thread through every layer first (serves as the walking skeleton), thicken segments later, nothing faked; **Skateboard** — ship the thinnest genuinely usable product then grow it, pruning structure too; **Facade** — all key screens clickable on mock data first, then wire the backend per screen, explicitly prototype grade; **Journey** — finish one complete user journey incl. all its states before starting the next.
- Learner-relevant: the four decomposition instincts and how each defines "done" for phase 1 differently.

### modes/plan.md — the full planning pass

- Locator: `[[sources/jsm-skills/20261001/skills/scope/modes/plan.md#step-1-locate-the-scope-greenfield-brownfield-monorepo]]`
- Purpose: The main path: classify project shape, run a generated question walk, choose the build approach, apply foundations-first sequencing, decompose into coarse features, pick the workflow depth, write the scope, and report.
- Key rules: Step 2 generates product-specific dimensions and never caps the questions (MVP boundary, audience, monetization, capabilities, plus cross-cutting kinds SEO, performance, analytics, accessibility, i18n, legal); Step 3 presents the four approaches and defaults a production build to Tracer Bullet; Step 5 applies the "invent test" for `Needs spec?` (unsure → yes); one decision per spec, never a lumped "strategy" spec; Step 6b is a single references-consent panel governing both citations and links.
- Learner-relevant: the acceptance-criteria seeds, the per-feature workflow tier override, and the reasoning behind each planning decision.

### modes/plan-greenfield.md — foundations-first sequencing

- Locator: `[[sources/jsm-skills/20261001/skills/scope/modes/plan-greenfield.md#foundations-first-sequencing-a-principle-every-build-approach-obeys]]`
- Purpose: The Step 4 detail for a greenfield project: an ordered list of foundation features before feature slices.
- Key rules: standards preferences → stack and architecture (one feature, spec first then scaffold; install only the skeleton, later features install their own deps) → coding standards and tooling via `/audit` then `/develop tooling` → data model (explicit, never skipped — costliest to redo) → design system → walking skeleton; slices must follow the chosen persona, not just relabel a flat feature list.
- Learner-relevant: why foundations precede features and why the data model is never folded away.

### modes/plan-brownfield.md — plan the next slice on existing code

- Locator: `[[sources/jsm-skills/20261001/skills/scope/modes/plan-brownfield.md#scope-plan-route-brownfield]]`
- Purpose: Read `AGENTS.md` and existing scope to enroll already-built features and plan the next slice without re-planning foundations.
- Key rules: enroll complete features as `existing`, partial ones as `in-progress` (never stamp a half-built feature `existing`); read the union of all files for dedup; extend an existing row rather than duplicate; optionally offload a large scan to a read-only low-cost subagent; no root `AGENTS.md` → tell the engineer to run `/audit` first.
- Learner-relevant: the distinction between `existing` / `done` / `in-progress` and drift reconciliation.

### modes/plan-monorepo.md — plan per workspace

- Locator: `[[sources/jsm-skills/20261001/skills/scope/modes/plan-monorepo.md#scope-plan-route-monorepo]]`
- Purpose: Workspace-aware planning so apps never mix, with a repo-wide `_root` scope and a top-level mapping index.
- Key rules: each workspace gets `docs/scope/<workspace>/`; repo-wide work (shared tooling, `packages/ui`) lives in `_root`; the root `index.md` lists one line per workspace with a status rollup; foundations are per workspace except genuinely shared ones; a cross-workspace feature is planned in `_root` or split into coordinated features.
- Learner-relevant: how scope boundaries map onto code boundaries in a monorepo.

### modes/replan.md — the living reconcile rhythm

- Locator: `[[sources/jsm-skills/20261001/skills/scope/modes/replan.md#replan-the-living-rhythm-run-after-a-feature-or-phase-ships]]`
- Purpose: The default bare-`/scope` cadence after a feature or phase lands, reconciling scope with reality and queueing the next slice.
- Key rules: read the whole scope again and reconcile shipped work to `done` (verify, never stamp); surface features built on an `Assumed` spec as decision debt awaiting `/architect` ratification (never blocking `done`); enroll follow-ups from a spec's `## Consequences` / `## Follow-up`; reorder and re-phase; re-recommend the workflow default only if the risk profile shifted; queue the lowest-`Order` `planned` rows.
- Learner-relevant: reconcile-don't-rewrite editing and the `Assumed` decision-debt concept.

### modes/add.md — enroll one ad hoc feature

- Locator: `[[sources/jsm-skills/20261001/skills/scope/modes/add.md#add-enroll-one-ad-hoc-feature-lightweight]]`
- Purpose: A lightweight enrollment when the argument names a single feature invented partway through; no full planning pass.
- Key rules: read the scope and dedup first; ask only what's needed; offer the per-feature approach with inherit recommended; set `Needs spec?` via the invent test; append one At-a-glance row plus a section with intent, `Done when:`, and exactly one entry checkbox; bump the epic rollup if split.
- Learner-relevant: how a coarse feature row is shaped and why it carries no build-task breakdown.

### scope-template.md — the writing shapes and lifecycle

- Locator: `[[sources/jsm-skills/20261001/skills/scope/scope-template.md#what-keeps-it-readable-the-format-rules]]`
- Purpose: Reference shapes for the scope document (single file, epic split, brownfield enrollment), the legend, the feature lifecycle table, and the completion report block.
- Key rules: build order is just the section order (no separate list); headings carry only real tags; only set facts are shown (no `n/a` / `inherit`); the decision box is located by its `(spec)` suffix and `/architect` never ticks an execution box; on spec capture the feature gains `Design it (ticked)` → `Build it` with 2–5 rolled-up milestones → tier's closing boxes; atomic tasks stay in the spec's `## Build plan`; advise `/clear` between units.
- Learner-relevant: the concrete document skeleton and the rule that a feature's detail is progressively filled by later skills.
