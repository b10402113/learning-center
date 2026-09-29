---
source: jsm-skills
source_type: codebase
source_lines: 568
language: markdown
file_count: 6
part: 8
status: absorbed
absorbed_at: 2026-09-29
created: 2026-09-29
updated: 2026-09-29
---

# Digest — jsm-skills (part 8)

## Overview (L1)

- `skills/check` — the pre-merge gate skill for the AI-coding workflow. It has two non-overlapping modes: `verify` (drive the real running app and prove behavior matches the spec, the runtime counterpart to `/test`) and `review` (a senior code review of the diff run on a *different* model than wrote the code, because a model reviewing its own output shares its blind spots). Neither mode edits code: verify points failures at `/debug` or `/develop`, review writes severity-ranked findings to `docs/reviews/`. Both are read-only on code and are suggested steps the engineer may skip, never gates.

## Structure (L2)

### skills/check/SKILL.md

- Locator: `[[sources/jsm-skills/20260929/skills/check/SKILL.md]]`
- Purpose: Entry skill. Defines the two modes (verify = runtime proof, review = fresh-model diff review), the mandatory routing step that refuses to guess when no mode word is given (it prints a plain-text panel offering `verify` / `review` / `both` and waits), and the portability contract (any OS/agent, `git` the only required CLI, bundled mode files resolved to absolute paths). Includes an output-style rule forbidding dashes/hyphens as punctuation.
- Key exports: skill `check`, argument hint `[verify | review]`
- Dependencies: routes to `modes/verify.md`, `modes/review.md`; references `review-agent-prompt.md` and `review-guide.md`
- Learner-relevant: how a single skill can hold two distinct jobs behind an explicit routing gate, and why refusing to default (asking instead of assuming) prevents running the wrong check silently.

### skills/check/modes/verify.md

- Locator: `[[sources/jsm-skills/20260929/skills/check/modes/verify.md]]`
- Purpose: The runtime-proof mode in full. Steps: choose feature vs refactor/regression mode; for refactors spawn a subagent that captures before/after outputs in a git worktree and diffs them; load the spec contract (`AC-N` acceptance criteria, specced surfaces); calibrate "working" to the slice's build approach; scope observable behaviors; find the project's run command; launch and exercise; record an evidence ledger; produce a per-AC/per-surface conformance verdict.
- Key exports: mode `verify` (aliases `run`)
- Dependencies: reads `docs/specs/NNNN-<feature>/verify.md`, `docs/scope/`, `AGENTS.md`, project run scripts; defers fixes to `/debug`, `/develop`, `/test`
- Learner-relevant: the "evidence gate": no evidence means no ✅, never started means no PASS, an unusable tool is a block not a pass. Teaches distinguishing "specced but missing" (never built) from "specced but not applied" (built but not live, e.g. an unrun migration) and that a green test suite does not prove a feature exists.

### skills/check/modes/review.md

- Locator: `[[sources/jsm-skills/20260929/skills/check/modes/review.md]]`
- Purpose: The fresh-model code-review mode in full. Detects the author model from durable config, confirms it with one MCQ (since a wrong guess silently breaks the cross-model guarantee), maps it to a contrasting reviewer (`opus↔sonnet`, `fable/haiku→opus/sonnet`, never `haiku` as reviewer), scopes the diff (branch vs uncommitted), gathers cheap pointers, then spawns a review subagent (Read/Bash/Grep/Glob/Write, no Edit) that reads the rubric and writes findings under `docs/reviews/`. Ends with relaying the verdict and ticking the scope's `Review it` box.
- Key exports: mode `review`
- Dependencies: spawns subagent using `review-agent-prompt.md` + `review-guide.md`; reads `ANTHROPIC_MODEL`, `.claude/settings*.json`, `test-preferences.json`, `docs/specs/`, `AGENTS.md`
- Learner-relevant: the cross-model review invariant and its fallbacks (org model restrictions, clients whose subagents inherit the parent model), and how the main context is kept lean by passing file paths rather than file contents to the subagent.

### skills/check/review-guide.md

- Locator: `[[sources/jsm-skills/20260929/skills/check/review-guide.md]]`
- Purpose: The reviewer's rubric, read by the review subagent. Staff-engineer mindset (specific, justified, actionable; distinguish wrong from preference), inspection priority order (correctness → security → error handling → performance → API design → maintainability → convention adherence → test adequacy), the four-level severity scale (🔴 Blocker / 🟠 Major / 🟡 Minor / ⚪ Nit), the four verdicts (Approve / Approve with nits / Changes requested / Blocked), the exact findings markdown format, and the compact summary block returned to the main model.
- Key exports: rubric for the review subagent
- Dependencies: adapted by `review-agent-prompt.md`; consumed by `modes/review.md`
- Learner-relevant: how to judge test adequacy against the three-state test signal (`configured` vs `none-by-design` vs `none-yet`) without nagging a project that deliberately has no suite, and honest severity calibration.

### skills/check/review-agent-prompt.md

- Locator: `[[sources/jsm-skills/20260929/skills/check/review-agent-prompt.md]]`
- Purpose: Lean spawn template for the review subagent. Declares the reviewer role (Staff Engineer, did not write the code, no Edit tool), injects the scope mode/base/merge-base/changed files, the diff command to run, inlined project conventions, recent spec paths, the test signal, and the output path; then lists the 7-step procedure ending in returning the compact summary verbatim.
- Key exports: subagent prompt template (ALL_CAPS placeholders)
- Dependencies: references `review-guide.md` via the `REVIEW_GUIDE` placeholder
- Learner-relevant: the template/placeholder pattern for delegating a review to a subagent and keeping the main context lean.

### skills/check/agents/openai.yaml

- Locator: `[[sources/jsm-skills/20260929/skills/check/agents/openai.yaml]]`
- Purpose: OpenAI Codex adapter supplying picker metadata for the skill (`display_name: "Check"`, a short description, and a default prompt that tells the agent to read SKILL.md and pick a mode).
- Key exports: Codex interface metadata for `check`
- Dependencies: points at `../SKILL.md`
- Learner-relevant: how one skill is surfaced across different agent clients via thin per-provider adapter files.
