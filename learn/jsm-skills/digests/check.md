---
source: check
source_type: codebase
source_lines: 568
language: markdown
file_count: 6
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — check

## Overview (L1)

- `/check` is the pre-merge gate skill with two mutually exclusive modes: `verify` (drive the real app to prove behavior against spec) and `review` (a senior code review run on a different model than wrote the code).
- Invoked as `/check verify` after `/develop` or `/check review` before a PR; a bare `/check` must show a plain-text mode panel and stop, never guessing.
- Verify owns no durable files (chat + scratch screenshots/logs only) and reports failures to `/debug` or `/develop`; review writes severity-ranked findings to `docs/reviews/<date>-<branch>.md`, read only, never edits code.
- Crux rules: the evidence gate forbids PASS/✅ without a cited observation, and review must run on a contrasting model family to avoid shared blind spots.

## Structure (L2)

### SKILL.md

- Locator: `[[sources/jsm-skills/20261001/skills/check/SKILL.md#What this skill does]]`
- Purpose: Entry point; defines the two modes and routes the invocation before reading any mode file.
- Key rules: (1) Route first on the word after `/check`; `verify`/`run` → `modes/verify.md`, `review` → `modes/review.md`. (2) No mode word or ambiguous → print the exact three-option plain-text panel (`verify`, `review`, `both`) and stop and wait. (3) Never mix modes in one run; on `both`, verify first then offer review. (4) A feature name passed with no mode (`/check auth`) is carried as the target but the mode is still asked.
- Learner-relevant: A lesson on skill routing/argument dispatch and why a portable inline text panel beats an agent-specific modal.

### modes/verify.md — runtime proof

- Locator: `[[sources/jsm-skills/20261001/skills/check/modes/verify.md#What this skill does]]`
- Purpose: The acceptance-engineer role: scope observable behaviors from git, launch the app the project's way, exercise flows, observe, and report pass/fail per behavior and per acceptance criterion.
- Key rules: (1) Feature mode vs refactor/regression mode (refactor = byte-identical before/after diff, run in a subagent via a throwaway git worktree). (2) Acts on scoping/launching/observing; asks only when it cannot determine startup command or which flow to exercise. (3) Never modifies application code. (4) Keeps a per-behavior evidence ledger (URL/screenshot, request/status/body, command/exit code, query/result).
- Learner-relevant: The distinction between green tests and proven runtime behavior, and the refactor before/after worktree technique.

### modes/verify.md — spec contract

- Locator: `[[sources/jsm-skills/20261001/skills/check/modes/verify.md#Step 0b: Load the spec contract (if a governing spec exists)]]`
- Purpose: Finds the governing spec (`docs/specs/NNNN-<feature>/`) and loads its IDed acceptance criteria (`AC-1…`) and specced surfaces as the verification checklist.
- Key rules: (1) Prefer the feature's `verify.md` beside the spec (already-resolved steps tagged with the `AC-N` each exercises); else turn the spec's `## Requirements` into observable checks. (2) Don't narrow scope to changed files only — a specced but unimplemented surface is exactly the miss to catch. (3) No spec → skip and verify against observed behavior only.
- Learner-relevant: How a written contract drives verification scope, and why specs carry acceptance criteria as IDs.

### modes/verify.md — evidence gate & conformance

- Locator: `[[sources/jsm-skills/20261001/skills/check/modes/verify.md#Step 4c: The evidence gate (a verdict you cannot fabricate)]]`
- Purpose: The non-fabricable verdict rules plus the per-criterion/per-surface conformance verdict (Step 4b).
- Key rules: (1) No evidence, no ✅ — a behavior is met only with a cited ledger entry, else `blocked`. (2) Never started, never PASS; if the app was not launched, report `blocked` for everything and stop. (3) A tool you could not use (no browser/DB MCP, missing creds) is a block, not a pass. (4) Distinguish specced-but-missing 🚫 (never built) from specced-but-not-applied ⚠️ (built but not live, e.g. unapplied migration); one missing/not-applied item makes the overall verdict FAIL.
- Learner-relevant: Why observation is the only proof, and the missing-vs-not-applied taxonomy for conformance failures.

### modes/verify.md — report and scope update

- Locator: `[[sources/jsm-skills/20261001/skills/check/modes/verify.md#Step 5: Report]]`
- Purpose: The report template and closing gate: tick the feature's `Verify it` box and each passing `verify.md` step, then offer `done` (never gate it).
- Key rules: (1) On PASS offer `done` rather than forcing it; set spec `**Status**: In Progress` → `Accepted` only on the engineer's go. (2) Confirm exactly what was ticked in each file as a closing gate. (3) On FAIL/BLOCKED tick nothing and report gaps, pointing to `/debug`/`/develop`. (4) Lead with the verdict; list only what failed or is owed.
- Learner-relevant: How a skill records honest completion state without withholding `done` from the engineer.

### modes/review.md — fresh-model requirement

- Locator: `[[sources/jsm-skills/20261001/skills/check/modes/review.md#1. Determine the author model, then pick a DIFFERENT reviewer]]`
- Purpose: Detects the author model, confirms it with one MCQ, and maps it to a contrasting Claude reviewer to preserve the cross-model guarantee.
- Key rules: (1) Never rely on self-introspection or the stale "You are powered by…" line; detect from `ANTHROPIC_MODEL`/settings, confirm, pre-select detected. (2) Contrast map: opus↔sonnet, fable→opus, haiku→sonnet; reviewer must differ in family and never be haiku. (3) A `with <model>` override is honored only if it differs from the author; naming the author's own model is refused. (4) If no differing strong model exists, fall back to the strongest differing model, or run inline and say the review shares the author's blind spots.
- Learner-relevant: Why a same-model review shares blind spots, and how model-family contrast is enforced.

### modes/review.md — scoping, spawn, relay

- Locator: `[[sources/jsm-skills/20261001/skills/check/modes/review.md#4. Spawn the review subagent: on the contrasting Claude model]]`
- Purpose: Scopes the change set cheaply (names only), gathers light pointers, spawns the contrasting-model subagent with the two bundled reference files by absolute path, then relays the summary.
- Key rules: (1) Branch mode = diff from merge-base + untracked; uncommitted mode = working tree; forced by `uncommitted` arg. (2) Empty change set → stop, do not spawn. (3) Pass `review-agent-prompt.md` and `review-guide.md` absolute paths without reading them into main context; subagent tools exclude `Edit`. (4) Relay a compact verdict (Approve / Approve with nits / Changes requested / Blocked) and tick the scope `Review it` box as a closing gate.
- Learner-relevant: Context-lean subagent orchestration and separating review from fix.

### review-guide.md — rubric and severity

- Locator: `[[sources/jsm-skills/20261001/skills/check/review-guide.md#Severity scale]]`
- Purpose: The subagent's rubric: inspection priority order, severity scale, verdict definitions, findings-file format, and the compact summary block.
- Key rules: (1) Inspect in priority order: correctness → security → error handling/resilience → performance → API/contract → maintainability → convention adherence → test adequacy. (2) Severity: 🔴 Blocker (must fix), 🟠 Major (should fix), 🟡 Minor, ⚪ Nit; verdict follows the highest severity. (3) Every finding specific (file:line), justified, actionable; call out genuine strengths. (4) Omit empty severity sections; return only the `REVIEWED_BY/SCOPE/FINDINGS_FILE/VERDICT` summary block.
- Learner-relevant: A concrete code-review severity taxonomy and the "wrong vs I'd prefer" distinction.

### review-guide.md — test adequacy signal

- Locator: `[[sources/jsm-skills/20261001/skills/check/review-guide.md#Judging test adequacy]]`
- Purpose: Defines how the reviewer weights missing coverage against the project's declared test signal (`configured` / `none-by-design` / `none-yet`).
- Key rules: (1) `configured`: uncovered new logic is Minor, Major if branching/error/security. (2) `none-by-design`: do NOT raise missing-test findings; treat typecheck + `/check verify` as the safety net. (3) `none-yet`: note the gap once at verdict level and weigh correctness more heavily. (4) Never write tests (that is `/test`'s job).
- Learner-relevant: Why "you should have tests" is context-dependent, and how a project declares its own gate.

### review-agent-prompt.md

- Locator: `[[sources/jsm-skills/20261001/skills/check/review-agent-prompt.md#The change under review]]`
- Purpose: The lean spawn template filled with ALL_CAPS placeholders (REVIEW_GUIDE, MODE, BASE, MERGE_BASE, CHANGED_FILES, DIFF_COMMAND, PROJECT_CONTEXT, SPEC_PATHS, TEST_SIGNAL, OUTPUT_PATH); the subagent reads it by path and follows it.
- Key rules: (1) Subagent is a Staff Engineer who did not write the code; has no `Edit` tool, only writes the findings file. (2) Run the diff and read each changed file in full (a hunk hides context). (3) Read a spec only if it governs the changed code; honor TEST_SIGNAL. (4) Output the guide's report block verbatim, no full diff echoed back.
- Learner-relevant: Prompt templating with labeled placeholders and passing paths rather than inlining content.

### agents/openai.yaml

- Locator: `[[sources/jsm-skills/20261001/skills/check/agents/openai.yaml#interface:]]`
- Purpose: OpenAI Codex adapter metadata only; supplies the agent-picker display name, short description, and default prompt. Instructions still live in `../SKILL.md`.
- Key rules: (1) Interface metadata only, no workflow logic. (2) Points Codex at `SKILL.md` as the source of truth.
- Learner-relevant: How one skill ships cross-client adapters while keeping a single instructions file.
