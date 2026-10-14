---
source: skills
source_type: codebase
source_lines: 601
language: Markdown
file_count: 79
status: absorbed
absorbed_at: 2026-10-14
created: 2026-10-14
updated: 2026-10-14
---

# Digest — skills

## Overview (L1)
- JSM Skills System — the `jsmastery-pro/skills` repo (package `@jsmastery/skills` v2.0.0), a set of Agent Skills encoding a phase based engineering workflow. One skill per phase; state lives in repo files (scope, specs, AGENTS.md, tests), not in a chat, so work survives sessions and teams. Installed via `npx skills add`; the canonical flow is `idea → /scope → /audit → /architect → /develop → /check verify → /test → /check review → /document → /sync`, with `/debug` any time something breaks.
- scope — turns a product idea into a living, coarse plan in `docs/scope/`. One command with inferred intent: `plan` (new product or next slice), `replan` (bare `/scope`, reconcile after shipping and queue next), `add` (`/scope <feature>`, enroll one feature). Recommends workflow tiers and which features need a spec.
- audit — the context bootstrapper: writes the tool agnostic `AGENTS.md` files (plus thin `CLAUDE.md` pointers) every later skill reads. Four phases routed from pre-flight: greenfield setup, whole-repo scan, area scan, gap-fill. Also sweeps for matching Agent Skills / MCP servers behind a consent gate.
- architect — runs a structured design conversation and writes the load bearing decision as a build spec in `docs/specs/`. Modes FEATURE / ARCHITECTURE / ENHANCEMENT / CROSS-CUTTING; operations create / update / supersede / ratify (clears an `Assumed` spec). Owns all spec content.
- develop — the builder: turns a spec plus conventions into working code in a UI, Logical, or both track. Step 0 is a spec gate using a mechanical "input coverage" test; if a value's source is unnamed it routes to `/architect` or records an `Assumed` spec. Advances the scope and emit verify steps.
- check — the pre-merge gate, two modes: `verify` drives the real app to prove behavior against the spec (runtime proof, no durable files); `review` runs a senior code review on a different model than wrote the code, writing ranked findings to `docs/reviews/`. Never edits code.
- test — writes a test suite for the uncommitted change. Targets git working tree, classifies each file (logic / component / page flow / api server / cli), reads and saves the framework to `test-preferences.json`, and traces tests to the spec's acceptance criteria (`AC-N`).
- document — writes human facing prose from the real commits and diff: `pr`, `changelog`, `release-note`, or `postmortem`, each to its right place. Never invents a timeline, cause, or change.
- sync — the last step around merge: reconciles AGENTS.md, the scope, and linked spec `**Status**:` lines to what the repo now shows. Surgical edits only (a Boundaries table is the exact contract); flags stale specs, unratified `Assumed` specs, and context gaps.
- debug — a disciplined root cause loop (reproduce → localize → hypothesize → test the hypothesis → fix → verify), one hypothesis at a time, minimal fix, then hands a regression test to `/test`. No features, no extra refactors, no scope/spec needed.
- docs/ + scripts/ — authoring conventions, a plain-language workflow walkthrough, and two zero-dependency Node guards: a portability/budget checker and a token-usage analyzer.

## Structure (L2)
### README.md
- Locator: `[[sources/agentic-engineer/20261014/skills/README.md]]`
- Purpose: front door. Names the nine skills, the pipeline diagram, install lines, where to start (greenfield / brownfield / single change / monorepo), the feature loop, and the artifacts-and-owner table.
- Key exports: install (`npx skills@latest add jsmastery-pro/skills -a claude-code`, or generic `.agents/skills`), the workflow tier concept (`Prototype`/`Alpha`/`Beta`/`GA`), per-skill "what it does / when" reference.
- Dependencies: points to `docs/workflow-guide.md` for the deep dive; each skill's `SKILL.md` is what clients read, `agents/openai.yaml` is Codex interface metadata only.
- Learner-relevant: the mental model of state-in-files, one-skill-per-phase, and the load bearing decision ("write it down") as the one thing the workflow insists on.

### CLAUDE.md
- Locator: `[[sources/agentic-engineer/20261014/skills/CLAUDE.md]]`
- Purpose: project conventions file (not a skill). Four cross-cutting rules every skill follows.
- Key exports: "the engineer decides; the AI recommends"; "suggestions, never gates" (every step after `/develop` is skippable, `done` is the engineer's to declare); "every user facing question carries exactly one recommended option"; "keep skills lean". Also the layout and `npm run check` before committing skill edits.
- Dependencies: references `docs/conventions.md` and `docs/workflow-guide.md`.
- Learner-relevant: the design philosophy that makes the suite non-coercive and its size discipline.

### package.json
- Locator: `[[sources/agentic-engineer/20261014/skills/package.json]]`
- Purpose: npm package metadata and scripts for the skill suite.
- Key exports: `check` → `node scripts/check-portability.mjs`, `test` → same as check, `tokens` → `node scripts/analyze-token-usage.mjs`; `engines.node >=18`; MIT.
- Dependencies: none runtime; the scripts are zero-dependency stdlib.
- Learner-relevant: how a skills repo gates itself with a lint-style portability check rather than a test framework.

### docs/workflow-guide.md
- Locator: `[[sources/agentic-engineer/20261014/skills/docs/workflow-guide.md]]`
- Purpose: plain-language walkthrough of the whole workflow: the four file kinds (context files, scope, specs, `design.md`), who owns each, the acceptance-criteria thread, a full worked example (sign in + to do app) across ten stages, the debug loop, brownfield/monorepo variants, and what the workflow will not do.
- Key exports: spec lifecycle (`Proposed` → `In Progress` → `Accepted`, plus `Superseded` and `Assumed` ratification); delivery styles (thin thread first, smallest usable thing, look first wire later, one whole journey); the four workflow tiers; team freshness/uncommitted/partial-work warnings.
- Dependencies: mirrors README and each `SKILL.md`; the worked example names `/scope`, `/architect`, `/audit`, `/develop`, `/check`, `/test`, `/document`, `/sync`, `/debug`.
- Learner-relevant: the single clearest source for the end-to-end methodology and the acceptance-criteria contract.

### docs/conventions.md
- Locator: `[[sources/agentic-engineer/20261014/skills/docs/conventions.md]]`
- Purpose: how to author skills. "Write the least that still produces the behavior. Prune before you add."
- Key exports: what earns a line (a line must change behavior; instruct don't justify; name a concept; steps end in a checkable condition; state a rule once); one house voice defined once (the shared output style block); completion summary shape (headline / next / heads up / pointer); when to add a file (rarely needed AND long); commit checklist (`npm run check`).
- Dependencies: the shared output style is the `OUTPUT-STYLE` contract block in every `SKILL.md`; enforced by `scripts/check-portability.mjs`.
- Learner-relevant: prompt/context engineering discipline — lean, behavior-changing, non-duplicated instructions; the economics of a file that loads on every run.

### scripts/check-portability.mjs
- Locator: `[[sources/agentic-engineer/20261014/skills/scripts/check-portability.mjs]]`
- Purpose: portability and convention guard; exits 1 on any violation. Walked over every `.md` under `skills/`.
- Key exports: 11 named rules (allowed-tools present; no hardcoded model-alias spawn; no naming the subagent tool in prose; no PowerShell-breaking shell glue; SKILL/support byte budgets with `WARN_AT = 0.9`; description under 400 chars; every skill ships `agents/openai.yaml` with `interface:` fields; `allowed-tools` names `Agent` not `Task`; duplicated contract blocks byte-identical; no em/en dash; no hyphen in prose). Also aggregate `HOT_PATH_BUDGETS` per real run path and a heaviest-files report.
- Dependencies: reads `skills/`; budgets reference named files (e.g. `architect/SKILL.md`, `develop/ui-guide.md`); run via `npm run check`.
- Learner-relevant: how to enforce cross-tool agent-skill conventions mechanically, and why hot-path byte budgets matter (a skill body loads on every invocation; descriptions load every session).

### scripts/analyze-token-usage.mjs
- Locator: `[[sources/agentic-engineer/20261014/skills/scripts/analyze-token-usage.mjs]]`
- Purpose: read-only token-usage analyzer for a Claude Code transcript. Answers "where did the tokens go?".
- Key exports: CLI `node scripts/analyze-token-usage.mjs [file.jsonl] [--top N] [--project <dir>]`; splits main vs subagent (sidechain) cost, splits fresh input / cache-write / cache-read / output, prints a cost-unit "billed equivalent" using weights input 1.0, cacheWrite 1.25, cacheRead 0.1, output 5.0; shows spawned subagents and heaviest turns by output.
- Dependencies: reads `~/.claude/projects/<encoded-cwd>/*.jsonl`; no writes, zero dependencies.
- Learner-relevant: the economics of agent runs — output dominates, cache reads are cheap; fewer interview rounds cut output, smaller resident files cut cache-read only.

### .github/workflows/check.yml
- Locator: `[[sources/agentic-engineer/20261014/skills/.github/workflows/check.yml]]`
- Purpose: CI. Runs the portability/budget check on push to `main` and on every PR.
- Key exports: `portability` job on ubuntu-latest, Node 20, `npm run check` (no install step: zero dependency).
- Dependencies: `scripts/check-portability.mjs`, `package.json`.
- Learner-relevant: a repo can make its prompt-quality rules a CI gate.

### skills/scope/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/scope/SKILL.md]]`
- Purpose: the WHAT-to-build planner. Turns an idea into an ordered, coarse, living plan in `docs/scope/` and keeps it current. Never picks tools (that is `/architect`'s job per feature).
- Key exports: modes `modes/plan.md`, `modes/replan.md`, `modes/add.md`, plus repo-shape variants `plan-greenfield.md`, `plan-brownfield.md`, `plan-monorepo.md`. Delivery-style approach personas in `approaches/`: `tracer-bullet.md` (thin end to end thread, then thicken), `skateboard.md` (thinnest usable whole first), `facade.md` (UI shell on placeholder data first), `journey.md` (one whole user path at a time). `scope-template.md`; `agents/openai.yaml`. Status lifecycle: `planned` / `existing` / `in-progress` / `done` / `dropped`, plus `assumed decision (spec NNNN)` notes.
- Dependencies: seeds `/architect` (specs) and `/develop`; reads `AGENTS.md`; artifact base `docs/` or `.workflow/` when `docs/` is a published site.
- Learner-relevant: scope decomposition, delivery styles as different build orderings, and workflow tiers as a per-feature rigor dial.

### skills/audit/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/audit/SKILL.md]]`
- Purpose: the context bootstrapper. Writes `AGENTS.md` (root and nested) that every later skill reads; `CLAUDE.md` is only a one-line pointer via the `@` import.
- Key exports: pre-flight signals (`ROOT_EXISTS` / `ROOT_LEGACY` / `ROOT_MISSING`, source count, manifest, monorepo markers, `WORKFLOW_SETUP`) route to phases: `modes/greenfield.md`, `modes/whole-repo.md`, `modes/area.md`, `modes/gapfill.md`, plus `modes/tool-skills.md` (Agent Skill / MCP sweep behind the consent gate). `patterns/` holds four coding-style presets (clean-architecture, domain-driven, functional, solid-oop). `agent-prompt.md` holds templates.
- Dependencies: reads the real scaffolded project; feeds `AGENTS.md` consumed by scope/architect/develop/sync; the `TOOL-CONSENT` contract block is shared byte-identical with `/architect` and `/sync`.
- Learner-relevant: context-file nesting (root vs area), `AGENTS.md` as the tool-agnostic canonical file, and consent-gated tool discovery.

### skills/architect/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/architect/SKILL.md]]`
- Purpose: makes load bearing decisions and writes them as build specs in `docs/specs/`. Main thread writes; only reading/fetching is offloaded to read-only subagents.
- Key exports: modes `agent-modes/feature.md`, `architecture.md`, `enhancement.md`, `cross-cutting.md`; `internal/design-conversation.md` (staged interview, read in full before asking), `internal/tool-discovery.md`, `internal/after-subagent.md`; `agent-prompt.md`, `spec-template.md`. Operations create / update / supersede / ratify. Two spec shapes: single file `NNNN-title.md`, or directory `NNNN-title/` with `index.md` (build spec `/develop` reads) + `rationale.md` (decision history `/develop` skips) + optional `verify.md`. Status `Proposed` / `In Progress` / `Accepted` / `Superseded` / `Assumed`.
- Dependencies: subagents `scout` (code read) and `researcher` (web) on the cheapest model; optional cross-model spec critic (asked, never auto-run); links the matching `docs/scope/` feature; never writes `AGENTS.md`.
- Learner-relevant: spec-driven design, the acceptance-criteria IDing (`AC-1…`), and the `Assumed`-then-ratify escape hatch that keeps decisions durable instead of trapped in chat.

### skills/develop/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/develop/SKILL.md]]`
- Purpose: the builder. Classifies a task into UI / Logical / both and builds it from its spec, advancing the scope.
- Key exports: Step 0 spec gate (the mechanical input-coverage test: every required value must have a named source, else owed) with three options (`Architect it first` / `No, not needed` / `Build now, record it as an assumed spec`). `flow/build.md` (Steps 1-4: classify, load spec+conventions, explore, doc check, resume+build, update scope+report); `flow/git.md`; `ui-guide.md` + `ui/` (`existing.md`, `generate.md`, `image.md`, `implementation.md`, `mcp.md`); `logical-guide.md`; `checklist.md` (accessibility); `design.md` is the project design system. The only spec `/develop` may create is a minimal `Assumed` stub; it may only move one spec's `**Status**:` line.
- Dependencies: reads the governing spec (build-spec sections only) + nearest `AGENTS.md` + `design.md`; subagents `scout` (explore) and `researcher` (doc check); writes the scope feature's status/milestone boxes; emits `verify.md`.
- Learner-relevant: gating undecided work, the UI vs logical split, incremental "thin slice" building, migrations must be applied (not just generated), and removing superseded code so old and new never coexist.

### skills/check/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/check/SKILL.md]]`
- Purpose: the pre-merge gate with two modes, verify first. Neither edits code.
- Key exports: `modes/verify.md` (runtime proof: scope observable behaviors from git, load the spec contract `AC-N` + specced surfaces, run the real app, observe, with an evidence ledger and a strict evidence gate — "no evidence, no ✅"; verdicts met / specced but missing / specced but not applied / blocked; refactor mode uses before/after diff via a git worktree). `modes/review.md` (fresh model code review: detect author model, spawn a contrasting Claude reviewer — opus↔sonnet, fable→opus, haiku→sonnet; never haiku; writes ranked findings to `docs/reviews/<date>-<branch>.md`). `review-agent-prompt.md`, `review-guide.md`.
- Dependencies: `git` only CLI; consumes `/develop`'s `verify.md`; ticks the scope `Verify it` / `Review it` boxes; points failures to `/debug` or `/develop`.
- Learner-relevant: the difference between green tests and a proven feature, the cross-model review guarantee (a model reviewing itself shares its blind spots), and honest BLOCKED verdicts.

### skills/test/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/test/SKILL.md]]`
- Purpose: writes a senior test suite for the code changed in this branch but not yet committed.
- Key exports: pre-flight git scoping (tracked via `git diff --name-only --diff-filter=ACMR HEAD`, untracked via `git ls-files --others --exclude-standard`); file classification table (component / page-flow / api-server / logic / cli) with a strategy each; `modes/setup.md` (first-run stack detection, framework questions, save prefs); `agent-prompt.md` + `writing-guide.md`; `test-preferences.json` (stores `tool`, `additionalTools`, `e2eTool`, `testDir`, `filePattern`, `packageManager`, or `tool: null` + `gate` for a gate-only project). Traces durable criteria to `AC-N`; refuses tests locking in scaffolding.
- Dependencies: reads nearest `AGENTS.md`, recent/`governing` spec paths, `design.md`; may use a `scout` for heavy reading; ticks scope `Test it` and mirrors spec `Accepted`.
- Learner-relevant: test-what-a-caller-relies-on, per-file strategy selection, contract traceability, and a saved framework preference.

### skills/document/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/document/SKILL.md]]`
- Purpose: the technical writer who writes from the record, not imagination. Generates one of four doc types from real change history.
- Key exports: types `pr` (branch commits + diff vs base; optionally `gh pr create`/`edit`), `changelog` (Keep a Changelog entry into `CHANGELOG.md`), `release-note` (`docs/releases/<version>.md` from a tag range), `postmortem` (`docs/postmortems/<date>-<slug>.md` from engineer-supplied incident facts). `agent-prompt.md` + `templates/{pr,changelog,release-note,postmortem}.md`.
- Dependencies: `git` and optionally `gh`; reads specs for the "why"; ticks scope `Document it`; never commits, pushes, or merges.
- Learner-relevant: documentation sourced from diffs and commits; audience-dependent output; never inventing a timeline or cause.

### skills/sync/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/sync/SKILL.md]]`
- Purpose: closes the loop after a change, around merge. Reconciles durable knowledge to what the repo now shows.
- Key exports: a Boundaries table is the exact contract (maintains root/nested `AGENTS.md`, the `## Build approach` line, a `design.md` pointer, creates a nested doc only for a net-new area, reconciles spec `**Status**:` lines, and reconciles only the relevant workspace's scope; flags stale specs, unratified `Assumed` specs, context gaps, and curated-content conflicts). Step 2.5 discovers Agent Skills / MCPs for newly added tools behind the same `TOOL-CONSENT` block. Rules are authoritative in `agent-prompt.md`.
- Dependencies: `git --name-status` for A/M/D; reads root `AGENTS.md`, scope, specs; points to `/audit` and `/architect` rather than doing their work.
- Learner-relevant: file ownership discipline — one skill owns each file type's content, sync only makes surgical edits and flags the rest.

### skills/debug/
- Locator: `[[sources/agentic-engineer/20261014/skills/skills/debug/SKILL.md]]`
- Purpose: structured root cause investigation for anything failing, throwing, or behaving wrong. No scope or spec needed.
- Key exports: Steps 0-6 capture symptom → reproduce reliably → localize (bisect code path, `git bisect` history, read actual values) → one falsifiable hypothesis → test it → fix at the root (minimal, targeted) → verify and protect (regression test, check for sibling occurrences). Optional subagent run with an explicitly set strong model.
- Dependencies: hands a regression test to `/test`; points to `/architect` if the bug reveals a flawed decision; this is an internal loop, not the `/loop` interval skill.
- Learner-relevant: systematic debugging discipline (evidence over intuition, one hypothesis at a time, root cause not symptom) and a fixed success condition.

### .claude/agents/
- Locator: `[[sources/agentic-engineer/20261014/skills/.claude/agents/scout.md]]`, `[[sources/agentic-engineer/20261014/skills/.claude/agents/researcher.md]]`
- Purpose: the two read-only helper subagents the skills reference by name.
- Key exports: `scout` (model `haiku`; tools Read, Grep, Glob; returns a compact ~1-2k token map, never file dumps) used by develop's exploration and scope's brownfield scan. `researcher` (model `haiku`; tools Read, Bash, WebSearch, WebFetch; runs `npx skills find <tool>` / MCP search, current-usage doc-checks, and source verification, returning only a compact summary, never raw pages).
- Dependencies: spawned by architect, develop, audit, test, sync, document per each `SKILL.md`; capabilities degrade to inline where an agent has no subagents.
- Learner-relevant: context isolation as a pattern — offload reading/searching to cheap read-only helpers so the main thread stays lean, with the model set explicitly rather than inherited.
