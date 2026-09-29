---
source: jsm-skills
source_type: codebase
source_lines: 578
language: markdown
file_count: 5
part: 3
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 3)

## Overview (L1)

- `skills/test` — the `/test` skill writes a focused regression test suite for the code changed in the current branch but not yet committed. It targets the git working tree (no scope question), classifies each changed file (logic, component, page/flow, api/server, cli), and picks a matching strategy: unit for logic, render/interact for components, real-browser flow for pages, handler invocation for API routes. It stores framework choices in a project root `test-preferences.json`, or a deliberate no-runner "gate" shape.
- Core philosophy — "a test that passes but fails to catch real bugs is worse than no test": verify behavior a caller relies on and what would actually break someone, not lines for a coverage number. It never modifies application source to make a test pass, and distinguishes test mistakes (fix the test) from genuine code bugs (leave failing, report under `BUGS_FOUND`).
- Portable across macOS/Linux/Windows and any Agent Skills client: `git` is the only required CLI, heavier file reading may be offloaded to a read-only `scout` subagent, and questions fall back to plain text when no picker exists.

## Structure (L2)

### skills/test/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/test/SKILL.md]]`
- Purpose: the entry point and orchestration for `/test`. Defines output style (plain words, no dashes or hyphens), artifact ownership (test files and `test-preferences.json`), and the pre-flight/write flow: Step 1 scope from git, Step 1b classify each file plus a >15-file large-diff guard, Step 2 load preferences (write path vs `GATE_ONLY` vs `NO_PREFS` vs malformed), Step 3 fallback when no uncommitted changes, Step 5 installation check, Step 7 lightweight pointers (governing spec, `design.md`, `package.json` test script), Step 7.5 always-ask whether to run the suite, Step 8 write. Ends with the after-writing report template and the `done`/scope-tick closing gate.
- Key exports: the `/test` skill and command.
- Dependencies: reads bundled `modes/setup.md` (on `NO_PREFS`), `agent-prompt.md` and `writing-guide.md` (at write time); references repo concepts `AGENTS.md`/`CLAUDE.md`, `docs/specs/`, `docs/scope/`, `design.md`, and sibling skills `/sync`, `/check verify`, `/check review`, `/debug`, `/clear`, `/architect`.
- Learner-relevant: teaches change-scoped, per-class test strategy; how to trace tests to acceptance criteria (`AC-N` tags, `TRACE_TO_CONTRACT`); when to ask versus act; and honoring a deliberate "gate without a runner" convention.

### skills/test/agent-prompt.md

- Locator: `[[sources/jsm-skills/20260929/skills/test/agent-prompt.md]]`
- Purpose: the operating template the main thread reads and fills at write time (Step 8). Carries `ALL_CAPS` placeholders for the gathered inputs (tool, install state, test dir, file pattern, run command, classified scope, project context, spec/design pointers) and the six-step "how to proceed" procedure: read the guide, read source files, check for existing tests, write, run-and-iterate, output the exact report.
- Key exports: the test-writer prompt template.
- Dependencies: instructs reading `writing-guide.md` in full alongside it; consumes the pre-flight values defined in `SKILL.md`.
- Learner-relevant: shows the prompt-template pattern where a skill injects runtime facts into a fixed role prompt, keeping detailed rules in a separate guide.

### skills/test/writing-guide.md

- Locator: `[[sources/jsm-skills/20260929/skills/test/writing-guide.md]]`
- Purpose: the detailed test-writing rulebook: rules of engagement (never modify source; extend existing tests, never duplicate; minimal additive configs; security cases for auth/payments/PII code), a strategy table per file class, coverage priorities (happy path → edges → errors → state transitions → a11y), expert rules (sentence names, one concept per test, arrange-act-assert, boundary-only mocking, determinism), tool-specific rules for Vitest/Jest, Testing Library, Playwright, Cypress, pytest, Go testify, and Rust, accessibility cases, file placement, the run/iterate loop, and the exact report format for `RUN_AFTER` yes/no.
- Key exports: the strategy/rules/report contract for writing tests.
- Dependencies: referenced by both `SKILL.md` and `agent-prompt.md`; assumes the tool and directory conventions chosen in `modes/setup.md`.
- Learner-relevant: a compact but broad reference for writing good tests across languages and tools, and for the test-gap-versus-real-bug distinction.

### skills/test/modes/setup.md

- Locator: `[[sources/jsm-skills/20260929/skills/test/modes/setup.md]]`
- Purpose: the first-run only mode, read when `test-preferences.json` is absent. Step 4 detects package manager (lockfile), language/framework, and installed test tools, then asks Q0 (no test setup: respect a stated no-runner convention or ask), Q1 (unit framework), Q2 (E2E tool, only if pages/flows changed), and Q3 (component addon, JS/TS with components). Step 6 writes `test-preferences.json` in either a framework shape (`tool` set) or a gate shape (`tool: null`, `gate` set), with a conventional directory/pattern table per tool.
- Key exports: the `setup` mode and preference-file contracts.
- Dependencies: read by `SKILL.md` Step 2 on `NO_PREFS`; returns to SKILL Step 5 then Step 6 then Step 7.
- Learner-relevant: teaches stack detection, first-run preference capture, and the deliberate distinction between a project with a test runner and one that gates on typecheck plus `/check verify`.

### skills/test/agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/test/agents/openai.yaml]]`
- Purpose: the OpenAI Codex adapter supplying agent-picker metadata (`display_name`, `short_description`, `default_prompt`) while the real instructions stay in `../SKILL.md`.
- Key exports: Codex interface metadata for the `test` skill.
- Dependencies: points back to `../SKILL.md`.
- Learner-relevant: demonstrates the cross-client packaging pattern where one skill body is surfaced through per-client adapter files.
