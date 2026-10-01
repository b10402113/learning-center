---
source: workflow-overview
source_type: text
source_lines: 432
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — workflow-overview

Covers the repo's human-facing orientation files: `README.md`, `CLAUDE.md`, `docs/workflow-guide.md`, and `docs/conventions.md`.

## Overview (L1)

- **README** — One-line pitch plus the nine-skill index and the canonical pipeline `idea → /scope → /audit → /architect → /develop → /check verify → /test → /check review → /document → /sync`, with `/debug` any time. Defines the artifact/owner table (scope, specs, AGENTS.md, design.md, reviews, tests, app code, human docs) and the four workflow depths (Prototype/Alpha/Beta/GA).
- **CLAUDE.md** — The four conventions every skill follows: engineer decides / AI recommends; suggestions never gates; every user-facing question carries exactly one recommendation with a one-line why; keep skills lean (every line is a recurring per-run cost). Names the skill layout `skills/<name>/SKILL.md` and the `docs/` versus `.workflow/` split.
- **Workflow Guide** — The plain-language deep dive: the four kinds of state file and how they live; fixed ownership (only `architect` writes spec content, only `develop` moves status); the acceptance-criteria thread from spec → code → verify → test; a 10-stage worked example (a sign-in + to-do app); the debug loop; brownfield and monorepo variants; what the workflow will not do.
- **Conventions** — How to author a skill: every line must change agent behavior, instruct don't justify, name concepts instead of explaining them, state a rule once, one house voice defined once, completion summaries lead with headline/next/heads-up/pointer, add a file only when content is rarely-needed AND long, run `npm run check` before committing.

## Sections (L2)

### README — the workflow and its skills

- Locator: `[[sources/jsm-skills/20261001/README.md#the-skills]]`
- Summary: Introduces the skill set as Agent Skills that carry a change from vague idea to shipped, verified, documented code; state lives in files, not chat.
- Key claims: one skill per phase; run only the skills a change needs, in any order; state (scope, specs, AGENTS.md, tests) survives across sessions and teams; hardening is temporarily removed.
- Learner-relevant: the canonical end-to-end pipeline and the one-line purpose of each of the nine skills.

### README — where to start / the feature loop

- Locator: `[[sources/jsm-skills/20261001/README.md#the-feature-loop]]`
- Summary: Entry points per project type (greenfield, brownfield, single change, monorepo) and the feature loop.
- Key claims: greenfield = scope → architect → scaffold → audit; brownfield = audit first; depth (Prototype/Alpha/Beta/GA) is a *suggested* checking tail after develop, never a locked track; `done` is always the engineer's to declare; a load-bearing decision must be written down.
- Learner-relevant: how the pieces order differently by context, and the anti-gate philosophy.

### README — what gets written, and where

- Locator: `[[sources/jsm-skills/20261001/README.md#what-gets-written-and-where]]`
- Summary: Artifact-to-path-to-owner table.
- Key claims: scope → `docs/scope/` (scope); specs → `docs/specs/` (architect); context files → AGENTS.md + thin CLAUDE.md pointer (audit, kept current by sync); design system → `design.md` + CSS (develop); review findings → `docs/reviews/` (check); human docs → PR body, CHANGELOG, `docs/releases/`, `docs/postmortems/`.
- Learner-relevant: the durable file map every skill reads and writes.

### CLAUDE.md — conventions every skill follows

- Locator: `[[sources/jsm-skills/20261001/CLAUDE.md#conventions-every-skill-follows]]`
- Summary: Four non-negotiable behavioral rules shared by all skills.
- Key claims: the engineer decides, the AI recommends (checks are offered, findings surfaced never auto-applied); suggestions never gates (skipped steps recorded honestly; only a written spec is asked); every user-facing question carries exactly one recommended option with a why; keep skills lean (every line is a recurring cost; `npm run check` before commit).
- Learner-relevant: the philosophy that shapes every skill's voice and behavior.

### Workflow Guide — the workflows and how it works

- Locator: `[[sources/jsm-skills/20261001/docs/workflow-guide.md#the-workflows]]`
- Summary: Table of the nine workflows and the four kinds of state file.
- Key claims: nine runnable workflows; four file kinds — the nested `AGENTS.md` context files (+ CLAUDE.md pointer), the scope in `docs/scope/`, specs in `docs/specs/`, the `design.md` art direction + CSS values.
- Learner-relevant: what "state lives in files" concretely means.

### Workflow Guide — who owns which file

- Locator: `[[sources/jsm-skills/20261001/docs/workflow-guide.md#who-owns-which-file]]`
- Summary: Fixed create/read/change ownership per file.
- Key claims: audit creates context files, every skill reads them, sync keeps them current; scope creates the plan, develop advances it; architect owns all spec content and clears `Assumed`; develop is the only writer of the spec status line along `Proposed → In Progress → Accepted` and may create one `Assumed` stub; sync flags stale specs.
- Learner-relevant: single ownership is why files stay trustworthy; the `Assumed` and `Superseded` states.

### Workflow Guide — the acceptance-criteria thread

- Locator: `[[sources/jsm-skills/20261001/docs/workflow-guide.md#the-one-thread-that-ties-the-stages-together]]`
- Summary: One thread ties spec requirements to build tasks, verify steps, and tests.
- Key claims: architect turns each requirement into a numbered "what done means"; every build-plan task names the rule it serves; develop's check steps trace to the same numbers; check verify runs them; test locks the lasting ones in.
- Learner-relevant: traceability is the workflow's core quality mechanism.

### Workflow Guide — worked example (stages 1–10)

- Locator: `[[sources/jsm-skills/20261001/docs/workflow-guide.md#a-worked-example-from-idea-to-shipped]]`
- Summary: One sign-in + to-do app carried from `/scope` through `/sync` in ten stages.
- Key claims: scope picks a delivery style (thin thread / smallest usable / look-first / one-journey) and a depth; architect describes an unmade decision; audit reads the real scaffolded project; develop runs a gate then branch-order phases (backend phases with senior rules, UI routes incl. design-system creation and accessibility); check verify proves behavior; test writes the suite; check review runs on a different model; document writes prose; sync reconciles.
- Learner-relevant: ties every abstract rule to a concrete stage-by-stage narrative.

### Workflow Guide — debug loop / brownfield / monorepo

- Locator: `[[sources/jsm-skills/20261001/docs/workflow-guide.md#when-something-breaks-the-debug-loop]]`
- Summary: The debug discipline, then the same flow on an existing codebase and in a monorepo.
- Key claims: debug reproduces first, narrows, forms one falsifiable hypothesis at a time, smallest fix, regression test handed to test; brownfield runs audit first; monorepo scopes everything to one workspace with its own nested AGENTS.md, scope, specs, and commands.
- Learner-relevant: how the loop adapts without changing shape.

### Workflow Guide — what it will not do

- Locator: `[[sources/jsm-skills/20261001/docs/workflow-guide.md#what-the-workflow-will-not-do]]`
- Summary: Explicit limits.
- Key claims: never quietly decides done nor withholds done; works hard not to invent and hide a decision (strong gate, not a guarantee); never reaches the internet without consent; review reads, never edits; no skill rewrites prose or reaches into another skill's files.
- Learner-relevant: the boundaries that make the workflow safe to adopt.

### Conventions — authoring skills

- Locator: `[[sources/jsm-skills/20261001/docs/conventions.md#what-earns-a-line]]`
- Summary: The rules for writing skill files that load in full every run.
- Key claims: a line must change behavior; instruct don't justify; name a concept instead of explaining it; steps are checkable instructions not narrative; state a rule once (except the intentionally repeated shared output-style block); one house voice (warm `you`, recommendation not order) defined once; completion summaries lead with headline/next/heads-up/pointer; split a file only when content is rarely-needed and long; run `npm run check` (portability + hot-path size budgets) before committing.
- Learner-relevant: the authoring standard if the learner wants to write or extend a skill.
