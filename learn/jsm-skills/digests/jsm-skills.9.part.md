---
source: jsm-skills
source_type: codebase
source_lines: 1110
language: markdown
file_count: 10
part: 9
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 9)

## Overview (L1)

- `README.md` — the front door: defines the project as a set of Agent Skills covering a nine-phase engineering workflow (`scope → audit → architect → develop → check → test → document → sync`, plus `debug`), explains the install via `npx skills`, the artifact/ownership table, and the per-skill reference.
- `CLAUDE.md` — the repo's own instruction file; encodes the four conventions every skill follows (engineer decides, suggestions never gates, one recommended option per question, keep skills lean) and the layout.
- `docs/conventions.md` — the skill-authoring standard: what a line must earn, instruct-don't-justify, name concepts, steps as checkable instructions, one house voice, completion-summary shape, when to split a file, size/prune policy.
- `docs/workflow-guide.md` — the long plain-language walkthrough: the files that carry the work (AGENTS.md, scope, specs, design.md), the spec lifecycle (`Proposed → In Progress → Accepted`, plus `Assumed`/`Superseded`), ownership table, acceptance-criteria thread, tier depths (`Prototype/Alpha/Beta/GA`), and a worked sign-in/to-do example across ten stages.
- `scripts/check-portability.mjs` — the enforcement guard: a zero-dependency stdlib checker (`npm run check`) enforcing 11 cross-tool conventions and byte budgets across all `skills/**/*.md`.
- `scripts/analyze-token-usage.mjs` — a read-only Claude Code transcript analyzer showing where tokens went (main vs subagent, fresh/cache-read/cache-write/output) as cost-units.
- `.claude/agents/researcher.md` / `.claude/agents/scout.md` — two read-only helper subagents (web/registry research; codebase scanning) that return compact summaries.
- `.github/workflows/check.yml` — CI that runs the portability/budget check on push to main and on every PR.

## Structure (L2)

### README.md

- Locator: `[[sources/jsm-skills/20260929/README.md]]`
- Purpose: Project front page. States the thesis — one skill per phase, run only what a change needs, in any order — and that all state lives in files (scope, specs, AGENTS.md, tests) so work survives sessions and is team-shareable. Maps the flow `idea → /scope → /audit → /architect → /develop → /check verify → /test → /check review → /document → /sync`, with `/debug` on call.
- Key exports: the nine-skill table (`scope`, `audit`, `architect`, `develop`, `check`, `test`, `document`, `sync`, `debug`); four install/start recipes (greenfield, brownfield, any-single-change, monorepo); the artifact/owner table (scope→`docs/scope/`, specs→`docs/specs/`, context→AGENTS.md, design→`design.md`, reviews→`docs/reviews/`, docs→PR/CHANGELOG); the four workflow depths (Prototype/Alpha/Beta/GA).
- Dependencies: links to `docs/workflow-guide.md`; installs via the external `npx skills` tool; references `agents/openai.yaml` as Codex interface metadata with no logic.
- Learner-relevant: The clearest one-page statement of the whole system — what "a skill" is here, the phase DAG, and how artifacts and ownership are split. The workflow-depth concept (Prototype→GA) is the key framing device for how much verification a change warrants.

### CLAUDE.md

- Locator: `[[sources/jsm-skills/20260929/CLAUDE.md]]`
- Purpose: Repo-level agent instructions. Defines the phase-based workflow and, more importantly, the four rules every skill obeys.
- Key exports: four conventions — (1) "The engineer decides; the AI recommends" (AI-initiated checks are offered, never auto-run/auto-resolved); (2) "Suggestions, never gates" (post-`/develop` steps freely skippable, `done` is the engineer's to declare, only a load-bearing decision must be written down, and even that is flagged not enforced); (3) every user-facing question carries exactly one recommended option with a one-line why; (4) keep skills lean (every line is recurring load cost). Layout: `skills/<name>/SKILL.md`, `docs/workflow-guide.md`, `docs/conventions.md`.
- Dependencies: points to `docs/conventions.md` and `docs/workflow-guide.md`; names `npm run check`.
- Learner-relevant: This is the design philosophy in miniature — human authority, optional verification, no silent decisions, and token-cost awareness. It is the rubric against which every skill file was written.

### package.json

- Locator: `[[sources/jsm-skills/20260929/package.json]]`
- Purpose: NPM manifest for `@jsmastery/skills` v2.0.0, ESM (`"type": "module"`), Node `>=18`, MIT, no runtime dependencies.
- Key exports: scripts `check` (`node scripts/check-portability.mjs`), `test` (aliases `check`), and `tokens` (`node scripts/analyze-token-usage.mjs`).
- Dependencies: the two local scripts only; no packages.
- Learner-relevant: Shows the project is a distributable package of markdown skills whose "tests" are a convention/lint check rather than unit tests — the checker *is* the test suite.

### docs/conventions.md

- Locator: `[[sources/jsm-skills/20260929/docs/conventions.md]]`
- Purpose: The skill-authoring standard. Opens from the premise that a skill file loads in full on every run, so every line is recurring cost — "write the least that still produces the behavior; prune before you add."
- Key exports: what earns a line (must change agent behavior; instruct don't justify; name known concepts instead of explaining them; steps are 1–3 lines ending in a checkable condition `if X → do Y` or a `[ ]` gate; state a rule once, except the shared output-style block intentionally repeated for standalone distribution); "one house voice" defined once in the output-style block and rendered by the agent at write time; the completion-summary shape (Headline · Next · Heads up only when there is one · a pointer, no field dump); when to add a file (only when content is rarely needed *and* long, with an explicit trigger); pre-commit checklist (`npm run check`, re-read the diff, a prune must not change behavior).
- Dependencies: references `npm run check`; the shared output-style block lives in each `SKILL.md`.
- Learner-relevant: The single best source for how to write an agent skill economically — the anti-bloat rules, the "name concepts, don't explain" heuristic, and the deliberately-one-place house voice are transferable prompt/skill-design techniques.

### docs/workflow-guide.md

- Locator: `[[sources/jsm-skills/20260929/docs/workflow-guide.md]]`
- Purpose: Long-form narrative companion to the README — explains the workflow to a human end to end, with mechanisms and a worked example.
- Key exports: the four work-carrying file types (nested `AGENTS.md` + thin `CLAUDE.md` pointer; scope in `docs/scope/`; specs in `docs/specs/`; `design.md` + CSS values); full spec lifecycle — created `Proposed` by `architect` (or `Accepted` if documenting shipped code), loaded by `develop` for build-relevant parts only, status advanced only by `develop` (`Proposed → In Progress → Accepted`), replaced as `Superseded` by `architect`, flagged stale by `sync`, and the `Assumed` stub `develop` may create when overridden (owed *ratification* by `architect`); the created-by/read-by/changed-by ownership table; the acceptance-criteria thread tying requirement → code → verify → test; workflow depth tiers (Prototype = `/develop` only + self-check; Alpha = + `/check verify`; Beta = + `/test`; GA = + fresh-model `/check review` and `/document`); the ten-stage worked to-do app example; the debug root-cause loop; greenfield/brownfield/monorepo variants; what the workflow will not do; and FAQs.
- Dependencies: mirrors the skills under `skills/`; references `docs/scope/`, `docs/specs/`, `docs/reviews/`, `design.md`, `verify.md`, `AGENTS.md`, and the `.workflow/` fallback when `docs/` is a published site.
- Learner-relevant: The richest conceptual material in this scope — file-borne state as a substitute for session memory, strict single-owner file lifecycles, the `Assumed`/ratification pattern for honest overrides, and how verification rigor is tiered rather than forced.

### scripts/check-portability.mjs

- Locator: `[[sources/jsm-skills/20260929/scripts/check-portability.mjs]]`
- Purpose: Zero-dependency, stdlib-only guard that enforces the suite's cross-tool conventions and size budgets by walking every `.md` under `skills/`; exits 1 on any violation, and otherwise prints heaviest-file and hot-path utilization reports.
- Key exports: functions `walk`, `frontmatter`, `proseOnly`, `isExemptTerm`, `check`; data constants `WARN_AT` (0.9), `SKILL_BYTE_BUDGET` (32 KB), `SUPPORT_MD_BYTE_BUDGET` (24 KB) with `SUPPORT_MD_OVERRIDES`, `DESCRIPTION_CHAR_CAP` (400), `HOT_PATH_BUDGETS`, `PARSED_LITERALS`. Eleven rules: (1) `allowed-tools` present in every SKILL frontmatter; (2) no hardcoded model alias (`model: "haiku|sonnet|opus|fable"`) — use role words; (3) don't name the subagent tool in prose (`Agent`/`Task` tool); (4) no PowerShell-breaking shell glue (`>/dev/null`, `&& BASE=`); (5) per-file byte budgets (`SKILL_BYTE_BUDGET` / support budgets, plus grandfathered overrides); (5b) aggregate `HOT_PATH_BUDGETS` modeling the largest real read for architect/scope/develop/audit/test; (6) `description` under 400 chars; (7) every skill ships `agents/openai.yaml` with `interface:`/`display_name:`/`short_description:`/`default_prompt:`; (8) `allowed-tools` names `Agent`, not the legacy `Task`; (9) marked `<!-- NAME:START -->` contract blocks stay byte-identical across skills; (10) no em/en dash anywhere; (11) no hyphens in prose (masking code spans, link targets, URLs, comments) with `PARSED_LITERALS` exceptions.
- Dependencies: reads `skills/**` only; invoked by `package.json` (`check`/`test`) and `.github/workflows/check.yml`.
- Learner-relevant: A concrete model of "lint rules for prompts" — encoding style, portability, and token-budget constraints as executable checks with a warn-before-fail band; the prose-masking technique for applying no-dash/no-hyphen rules without flagging code is a reusable idea.

### scripts/analyze-token-usage.mjs

- Locator: `[[sources/jsm-skills/20260929/scripts/analyze-token-usage.mjs]]`
- Purpose: Read-only analyzer for a Claude Code session transcript that shows where tokens were spent, separating main-thread from subagent (sidechain) cost and splitting raw tokens into fresh input / cache-write / cache-read / output, plus an approximate billed-equivalent cost-unit total.
- Key exports: cost weights `W = { input: 1.0, cacheWrite: 1.25, cacheRead: 0.1, output: 5.0 }`; helpers `flag`, `encodedCwd`, `resolveTranscript`, `blank`, `addUsage`, `costUnits`, `rawTotal`, `k`; flags `--top`, `--project`. Reads `~/.claude/projects/<encoded-cwd>/<session>.jsonl`, dedupes streamed rows by `requestId`/`uuid`, lists spawned subagents, and prints the heaviest turns by output tokens. Explains that raw totals overstate cost because cache reads bill ~10% and output dominates, ranking levers as "cut output and fresh input first."
- Dependencies: Node stdlib only (`fs`, `path`, `os`); consumes Claude Code transcript format; exposed as `npm run tokens`.
- Learner-relevant: Turns "where did my tokens go?" into a concrete accounting model — the cache-read vs output distinction and the cost-unit weighting are the transferable insight, and it names the levers (fewer interview rounds cut output; smaller resident files cut only cache-read).

### .claude/agents/researcher.md

- Locator: `[[sources/jsm-skills/20260929/.claude/agents/researcher.md]]`
- Purpose: Defines the read-only `researcher` subagent for web and registry lookup, scoped to Agent Skill / MCP discovery (`npx skills find`, connector search), current-usage doc-checks, and source verification.
- Key exports: subagent frontmatter (`model: haiku`, `tools: Read, Bash, WebSearch, WebFetch`); four behaviors — discovery returns candidates grouped by technology minus installed/declined, doc-check returns current call/config/setup plus version notes, source verification returns only verified links (never invent a URL), and it stays capped/prefers official docs and returns a compact summary.
- Dependencies: none in-repo; used by skills that need discovery or doc checks (e.g. `architect`, `audit`).
- Learner-relevant: Shows the pattern of a tightly-scoped, cheap, read-only research subagent that returns distilled output rather than raw pages — protecting the caller's context and cost.

### .claude/agents/scout.md

- Locator: `[[sources/jsm-skills/20260929/.claude/agents/scout.md]]`
- Purpose: Defines the read-only `scout` subagent for codebase exploration and repo scanning; used by `develop`'s exploration step, `scope`'s brownfield scan, or any many-file read that must return a compact map.
- Key exports: subagent frontmatter (`model: haiku`, `tools: Read, Grep, Glob`); behaviors — read only what the brief asks, return a short structured result (files to create/edit, patterns with `file:line`, symbols/types/helpers to reuse, gotchas), keep the map ~1–2k tokens, never edit/write.
- Dependencies: none in-repo; called by `develop` and `scope`.
- Learner-relevant: The companion pattern to `researcher` — a cheap read-only mapper whose explicit token ceiling (`~1 to 2k tokens`) is how the main thread avoids context bloat.

### .github/workflows/check.yml

- Locator: `[[sources/jsm-skills/20260929/.github/workflows/check.yml]]`
- Purpose: CI workflow named `check` that runs on push to `main` and on every pull request. A single `portability` job on `ubuntu-latest` checks out the repo, sets up Node 20, and runs `npm run check` with no dependency install step (the checker is stdlib-only).
- Key exports: the `portability` job ("Portability and budgets"), steps `actions/checkout@v4`, `actions/setup-node@v4` (node 20), and `npm run check`.
- Dependencies: `scripts/check-portability.mjs` via the `check` npm script; GitHub Actions `checkout`/`setup-node`.
- Learner-relevant: Demonstrates the enforcement loop closing in CI — the same zero-dependency convention/budget check gates every PR, so skill files cannot drift from the standard unnoticed.
