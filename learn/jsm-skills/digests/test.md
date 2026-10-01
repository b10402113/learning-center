---
source: test
source_type: codebase
source_lines: 578
language: markdown
file_count: 5
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — test

## Overview (L1)

- `/test` writes focused regression tests for code just built or changed, automatically targeting uncommitted changes in the git working tree.
- It classifies each changed file (logic / component / page-flow / api-server / cli) and picks the right strategy per file, tracing tests to a governing spec's acceptance criteria when one exists.
- Reads `test-preferences.json` for the framework (asking and saving it on first run) and always asks one per-run question: run the suite after writing (Step 7.5), never persisted.
- Writes test files and `test-preferences.json`; never modifies application source, and never weakens an assertion to make a test pass.

## Structure (L2)

### SKILL.md — overview and always-ask

- Locator: `[[sources/jsm-skills/20261001/skills/test/SKILL.md#What this skill does]]`
- Purpose: Defines the senior-test-engineer role, the uncommitted-changes target, and the "one thing asked every run" rule.
- Key rules: (1) Test what a caller relies on, not lines for coverage. (2) Main thread writes the tests itself (a read only `scout` may read files for large sets). (3) Does not write application code or context files. (4) Always asks whether to run the suite after writing, even when prefs exist; otherwise asks only for missing prefs/installs/empty scope/>15 files.
- Learner-relevant: How a skill establishes what it owns vs what it delegates and when it must ask.

### SKILL.md — scope, classification, prefs branches

- Locator: `[[sources/jsm-skills/20261001/skills/test/SKILL.md#1b. Classify each scoped file]]`
- Purpose: Git-based scope gathering, per-file class assignment, monorepo resolution, and the `test-preferences.json` branch logic.
- Key rules: (1) Combine `git diff --name-only --diff-filter=ACMR HEAD` + untracked, then filter out tests/config/locks/styling/docs. (2) Classify from path/filename cheaply (`logic` default when ambiguous); `E2E_RELEVANT=yes` if any page/flow. (3) >15 source files triggers a focus question (logic & API first recommended). (4) Prefs: `tool` set → write; `tool: null` + `gate` set (`GATE_ONLY`) → run typecheck and stop, don't install or ask again; no file (`NO_PREFS`) → read `modes/setup.md`; malformed → treat as `NO_PREFS`.
- Learner-relevant: The deliberate no-test-runner "gate" concept and filtering test-irrelevant files from scope.

### SKILL.md — write step and scope update

- Locator: `[[sources/jsm-skills/20261001/skills/test/SKILL.md#8. Write the suite (main thread)]]`
- Purpose: At write time the main thread reads `agent-prompt.md` + `writing-guide.md`, applies gathered inputs, and writes the suite; afterward ticks the scope `Test it` box and offers `done`.
- Key rules: (1) Build approach calibrates which behaviors are durably real vs deliberate scaffolding (don't assert unbuilt real implementations). (2) `TRACE_TO_CONTRACT=yes` → each automatable `AC-N` becomes a tagged stable assertion; non-automatable criteria go to `NOT_COVERED` deferring to `/check verify`. (3) Report format matches `RUN_AFTER`. (4) On pass, offer `done` (never gate it) and mirror spec `**Status**:` → `Accepted` on the engineer's go.
- Learner-relevant: Calibrating tests to a slice's build approach so scaffolding isn't locked in as real.

### modes/setup.md

- Locator: `[[sources/jsm-skills/20261001/skills/test/modes/setup.md#Step 4: Stack detection and first run questions]]`
- Purpose: First-run-only steps (read only when `NO_PREFS`): stack detection, Q0 gate-vs-framework decision, Q1–Q3 framework/E2E/component questions, and saving preferences.
- Key rules: (1) Detect package manager by lockfile and language/framework/tools from manifests; reuse an already-used runner instead of installing. (2) Q0: no setup → check for a deliberate no-runner convention, else ask; don't assume a framework is wanted. (3) Write `test-preferences.json` in one of two shapes: framework shape (`tool` set) or gate shape (`tool: null` + `gate`, both keys required). (4) Per-package in a monorepo: a no-tests-by-design package still gates on typecheck/`/check verify`.
- Learner-relevant: Two-shape config design so `/test` and `/check review` can distinguish "no runner by choice" from "never set up".

### writing-guide.md — rules of engagement

- Locator: `[[sources/jsm-skills/20261001/skills/test/writing-guide.md#Rules of engagement]]`
- Purpose: The inviolable rules: never modify application source; extend existing tests rather than duplicate/clobber; minimal additive config only; security cases by default.
- Key rules: (1) Find an existing test for the source and extend it with `Edit`; never create a parallel test file or overwrite hand-written tests. (2) Write a config only when the runner cannot execute without one; never edit an existing config, adapt instead. (3) Auth/session/payment/PII files get unauthorized, expired/tampered-credential, and no-leak cases by default. (4) `INSTALL=deferred` → still write complete, correct tests.
- Learner-relevant: Why tests must not be weakened to pass, and additive-only config hygiene.

### writing-guide.md — strategy and coverage priorities

- Locator: `[[sources/jsm-skills/20261001/skills/test/writing-guide.md#Strategy per file class]]`
- Purpose: Per-class writing strategy (logic/component/page-flow/api-server/cli) and the ordered coverage priorities.
- Key rules: (1) logic → pure unit tests, mock only true boundaries. (2) component → render + user events, assert what the user sees, never internal state/class names. (3) page/flow → real browser flow if E2E tool set, else component level. (4) api/server → invoke handler, assert status/shape/errors, mock DB at boundary; coverage order: happy path → edges → errors → state transitions → accessibility.
- Learner-relevant: Matching test technique to the kind of code under test.

### writing-guide.md — expert rules and tool specifics

- Locator: `[[sources/jsm-skills/20261001/skills/test/writing-guide.md#Expert rules (all tools)]]`
- Purpose: Universal test-quality rules plus per-tool specifics for Vitest/Jest, Testing Library, Playwright, Cypress, pytest, Go testify, Rust.
- Key rules: (1) Test names are sentences; one concept per test; Arrange-Act-Assert; test public interface; mock only at the system boundary; deterministic (freeze clocks); await every async call. (2) Testing Library query priority `getByRole → getByLabelText → getByText → getByTestId`; use `userEvent`, never `fireEvent`. (3) Playwright: role/label locators, wait on assertions not timeouts, test 375px + 1280px. (4) Accessibility: keyboard order, accessible names, labelled inputs, focus trap, `aria-expanded`, icon-button screen-reader text; do not test colour contrast.
- Learner-relevant: Concrete idiomatic rules per framework and the accessibility checklist a lesson could teach.

### writing-guide.md — run/iterate loop and report

- Locator: `[[sources/jsm-skills/20261001/skills/test/writing-guide.md#Running and iterating (only when RUN_AFTER = yes)]]`
- Purpose: How to run tersely, distinguish a wrong test from a real bug, stop conditions, and the exact report blocks.
- Key rules: (1) Terse reporter first run; on retries run only the failing files. (2) A failing test may be a wrong test (fix the test) or genuinely wrong app code (leave it failing, record under `BUGS_FOUND`, never change source or weaken the assertion). (3) Stop when only real-bug failures remain or all is green; summarize counts, don't paste raw output. (4) Output the guide's report block verbatim matching `RUN_AFTER`; `RUN_AFTER=no` produces `MANUAL_INSTRUCTIONS` instead.
- Learner-relevant: The test-vs-bug triage discipline and why a correctly failing test is a finding.

### agent-prompt.md

- Locator: `[[sources/jsm-skills/20261001/skills/test/agent-prompt.md#Configuration]]`
- Purpose: The main-thread operating template read at write time, filled with the gathered ALL_CAPS inputs (TOOL, E2E_TOOL, ADDITIONAL_TOOLS, RUN_COMMAND, SCOPE_CLASSIFIED, PROJECT_CONTEXT, SPEC_PATHS, DESIGN_PATH, etc.).
- Key rules: (1) Read `writing-guide.md` alongside it in full before writing. (2) Scope is fixed: test exactly the listed classified files. (3) Extend existing tests, read spec/design pointers only when relevant. (4) Never modify application source to make a test pass; output the guide's report block verbatim.
- Learner-relevant: Separation of a routing skill from a templated operating prompt with labeled inputs.

### agents/openai.yaml

- Locator: `[[sources/jsm-skills/20261001/skills/test/agents/openai.yaml#interface:]]`
- Purpose: OpenAI Codex adapter metadata (display name, short description, default prompt); no workflow logic.
- Key rules: (1) Metadata only; instructions remain in `../SKILL.md`. (2) Points Codex to read `SKILL.md` then write tests for the current uncommitted change.
- Learner-relevant: Cross-client packaging of a single skill definition.
