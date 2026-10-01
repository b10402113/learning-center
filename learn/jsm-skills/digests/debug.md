---
source: debug
source_type: codebase
source_lines: 107
language: markdown
file_count: 2
status: absorbed
created: 2026-10-01
updated: 2026-10-01
absorbed_at: 2026-09-30
---

# Digest — debug

## Overview (L1)

- `/debug` finds and fixes a bug's root cause: a test failing for an unclear reason, `/check verify` reporting a failure, or behavior simply being wrong. It treats a bug as a case to be proven, trusting evidence over intuition.
- It runs a disciplined internal investigation loop — reproduce → localize → hypothesize → test the hypothesis → fix the root cause → verify — one hypothesis at a time, each confirmed or rejected by evidence, until the cause is proven, then it applies the smallest fix.
- It acts (it does not ask permission to investigate), asking only when it cannot reproduce the bug from what it is given. It writes only the minimal code fix, recommends `/test` for the regression test, and points to `/architect` if the bug reveals a flawed decision rather than a coding mistake. This is a loop within a single run, not the `/loop` skill.

## Structure (L2)

### What this skill does (role and the loop)

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#What this skill does]]`
- Purpose: Defines the investigator role and names the six stage root cause loop.
- Key rules: reproduce on demand, narrow to the smallest failing surface, change one thing at a time; resist patching what you see (the null, the crash) before understanding why it is there; a fix you can't explain is a bug you haven't caught; an unverified fix patches the symptom while the bug survives.
- Learner-relevant: the core discipline that separates root cause debugging from guess and check.

### Asks vs acts

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Asks vs acts]]`
- Purpose: Clarifies that /debug proceeds on its own initiative.
- Key rules: it reproduces, investigates, and fixes without asking permission; it asks only when it cannot reproduce the bug, then requests exact steps, inputs, environment, and observed vs expected behavior.
- Learner-relevant: you cannot debug what you cannot reproduce, so the only legitimate question is about the repro.

### Artifact ownership

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Artifact ownership]]`
- Purpose: Bounds what /debug is allowed to change.
- Key rules: writes only the minimal code fix for the root cause; recommends `/test` for the regression test (or writes a failing then passing test inline as the fastest proof); does not add features, refactor unrelated code, or rewrite the spec; if the bug reveals a flawed decision it says so and points to `/architect`.
- Learner-relevant: scope discipline keeps a fix reviewable and prevents opportunistic changes.

### Step 0: Capture the symptom

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 0: Capture the symptom]]`
- Purpose: Pins down the problem precisely before touching code.
- Key rules: record the observed behavior (exact error, stack trace, wrong output, screenshot), the expected behavior, and the repro (steps, inputs, environment); if any is unclear and cannot be derived, ask.
- Learner-relevant: writing a precise symptom statement is the first test of whether the bug is understood.

### Step 1: Reproduce reliably

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 1: Reproduce reliably]]`
- Purpose: Gets a deterministic reproduction that triggers the bug on demand.
- Key rules: use a failing test, command, or request; if intermittent, find what makes it deterministic (timing, ordering, data, concurrency); if you truly cannot reproduce it, add instrumentation to catch it and say so, never "fix" blind.
- Learner-relevant: a bug you can't reproduce on command, you can't prove you've fixed.

### Step 2: Localize

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 2: Localize]]`
- Purpose: Narrows the failure to the smallest possible surface before theorizing.
- Key rules: bisect the code path (binary search where good input becomes bad output with logs, breakpoints, or commenting out); bisect history with `git bisect` (or `git log -p`) for a regression; read the actual values at the boundary instead of assuming them.
- Learner-relevant: localization shrinks the search space so hypotheses can be specific and falsifiable.

### Step 3: Hypothesize (one at a time)

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 3: Hypothesize (one at a time)]]`
- Purpose: States a single specific root cause to test.
- Key rules: write one falsifiable hypothesis (e.g. "the date is parsed as local time, so the cutoff is off by the timezone offset"); aim at root cause not symptom ("the value is null here" is a symptom, why it is null is the cause); resist shotgun changing several things at once.
- Learner-relevant: falsifiability is what makes the next experiment meaningful.

### Step 4: Test the hypothesis

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 4: Test the hypothesis]]`
- Purpose: Runs the smallest experiment that confirms or refutes the hypothesis.
- Key rules: design a targeted log, assertion, one line change, or unit test and run it; refuted → discard it and return to localize/hypothesize with what you learned, keeping no change that didn't help; confirmed → you've found the root cause and proceed; loop Steps 3 to 4 until confirmed, never skip to a fix on a hunch.
- Learner-relevant: treating each result as evidence that updates the hypothesis is the heart of the loop.

### Step 5: Fix at the root

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 5: Fix at the root]]`
- Purpose: Applies the smallest change that addresses the proven cause.
- Key rules: fix the cause (why it's null), not the symptom (clamping the null); make the minimal targeted change; resist scope creep and opportunistic refactors; follow project conventions (`AGENTS.md`, neighbouring code).
- Learner-relevant: distinguishing cause from symptom is the payoff of the whole loop.

### Step 6: Verify and protect (the regression-test handoff to /test)

- Locator: `[[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 6: Verify and protect]]`
- Purpose: Proves the fix and prevents silent recurrence.
- Key rules: re-run the Step 1 reproduction to confirm it passes; run the surrounding suite to confirm no regression; add a regression test that fails without the fix and passes with it, written inline or handed to `/test`; check for siblings — grep for the same root cause/pattern elsewhere and note or fix them.
- Learner-relevant: the regression test is how a proven fix becomes a permanent guard, not a one-time patch.
