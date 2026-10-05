---
source: loop-engineer
source_type: text
source_lines: 33675
part: 5
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — loop-engineer (part 5)

## Overview (L1)

- Evidence-based completion — An agent claiming "done" is not proof; completion must be gated on an inspectable evidence vault (tests, diffs, logs, screenshots, approvals) reviewed against acceptance criteria defined before the run. The loop yields one of three explicit outcomes: complete, retry with a narrower instruction, or escalate to a human.
- Tests, linters, and validators as feedback — Automated checks turn the loop into a measurable propose-apply-check-interpret-repair rhythm. Tests answer "does behavior still work," linters/type checks catch issues before runtime, and validators enforce contracts (schemas, policy, API payloads). Repeated failures and budget overruns should stop the loop and hand off with evidence.
- Separate generation from verification — The generator is optimistic; the verifier must be skeptical and evidence-driven. Freeze the candidate artifact (patch, inputs, context, assumptions), run independent checks, and decide accept/retry/escalate. "Generation proposes, verification disposes"; trust evidence, not intent.
- Evaluator–optimizer and correction loops — Split work into generation, evaluation, and optimization. The evaluator combines tests, linters, validators, rubrics, and runtime evidence into an evaluation packet and returns an actionable diagnosis, not just "try again." Limits (max iterations, one change at a time, fresh evidence after each revision, stop/escalate) keep optimization safe.
- Trace decisions, actions, and state changes — A reliable run is a chain of decisions, actions, observations, and state updates, each emitting trace events. Capture decision rationale, tool action, referenced inputs/outputs, state delta, and validation results; store references rather than full payloads to stay practical. Traces make runs replayable, auditable, and debuggable.
- Diagnose planning, tool, context, and control failures — Treat a failure by domain rather than as one vague bug. Symptoms can surface away from the cause: bad plan → wrong tool; tool error → misleading context; missing context → plan drift; weak control → endless repetition. Diagnose with a trace, compare expected vs. actual at each decision point, patch the smallest proven cause, then verify by rerunning.
- Replay and repair failed runs — Failed runs are test cases, not waste. Capture the full trace, freeze inputs, rehydrate context, rerun in a safe sandbox, and compare outputs/tool calls/state/latency/tokens/errors against the original. Repair from combined evidence to the root cause with the smallest targeted fix, then promote the failed run into a regression test and governance control.
- Lab: Debug a Faulty Agent Loop — Hands-on Python lab building a refund-review agent with three seeded defects (evaluator checks wrong action name, selector/dispatcher name mismatch, reversed refund decision). Learners reproduce failures, add a repetition guardrail, and fix each defect guided by traces, ending with an acceptance check.
- Quiz: Verification and Debugging — Ten-question MCQ assessment covering evidence-based completion, separate generation/verification, replay artifacts, failure classification, evaluator-optimizer stop conditions, self-verification bias, linter-vs-integration-test conclusions, and sensitive-data handling in traces.

## Sections (L2)

### evidence-based-completion

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/27. Evidence-Based Completion.en.srt#evidence-based-completion]]`
- Summary: Defines completion as a controlled gate proven by an evidence vault rather than a confident final message, and walks a completion loop from acceptance criteria through execution, evidence capture, and validation.
- Key claims: The useful question is "what evidence supports the claim," not "did the agent finish"; evidence includes test output, diffs, logs, metrics, screenshots, MCP/LSP/CI signals; the decision record must state which criteria were met, where evidence lives, and what risk remains; outcomes are complete, retry, or escalate; good evidence is linked, timestamped, and reproducible so reviewers can audit without rerunning the conversation.
- Learner-relevant: Anchors the whole chapter's definition of "done" and supports building a completion gate / audit log lesson.

### tests-linters-validators-as-feedback

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/28. Use Tests, Linters, and Validators as Feedback.en.srt#tests-linters-validators-as-feedback]]`
- Summary: Explains how tests, linters/language servers, and validators give machine-readable signals that steer each iteration, and why feedback needs to be actionable and bounded.
- Key claims: Loop rhythm is propose → apply → check → interpret → repair; tests answer whether behavior still works, linters catch style/import/type/structure problems before runtime, validators check schemas/policy/tool outputs/API payloads; feedback must be summarized (failure, likely source, smallest fix) rather than raw terminal dumps; repeated failure, too many turns, or cost-budget overrun should stop and escalate with evidence; low-risk work proceeds automatically while high-risk changes go to human review.
- Learner-relevant: Provides the concrete feedback mechanism and stop conditions for a loop-engineering control layer.

### separate-generation-from-verification

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/29. Separate Generation from Verification.en.srt#separate-generation-from-verification]]`
- Summary: Argues for splitting the agent that produces a candidate from the agent/process that independently verifies it, so completion rests on proof rather than the model's confidence.
- Key claims: Generator is optimistic and self-justifying; verifier must be skeptical, evidence-driven, and grounded in external checks; freeze the artifact (patch, inputs, prompt context, assumptions) before verifying; verification runs unit tests, linting, schema/type/security checks, and produces artifacts like test report.json / lint.log; decisions are accept when evidence passes, retry when actionable, escalate when unclear; a policy boundary prevents bypass and an evidence store enables debugging/replay.
- Learner-relevant: Core mental model for why self-verification is weak; supports a decision/reference lesson on verifier design.

### evaluator-optimizer-correction-loops

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/30. Evaluator–Optimizer and Correction Loops.en.srt#evaluator-optimizer-correction-loops]]`
- Summary: Describes the three-role loop (generate → evaluate → optimize) and the limits that keep it production-safe.
- Key claims: Fix success criteria before generating so the evaluator can judge; the evaluator applies the same criteria every time and must not be just another model opinion; evaluation packet combines tests, linters, validators, rubrics (completeness/clarity/intent alignment), and runtime evidence (logs/traces/metrics); feedback is a compact, actionable diagnosis; four safety rules — limit iterations, change one thing at a time, require fresh evidence after each revision, and stop or escalate on evidence; optimize until proven done, not until it feels done.
- Learner-relevant: Supports procedure/decision lessons on building bounded self-correction loops.

### trace-decisions-actions-state

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/31. Trace Decisions, Actions, and State Changes.en.srt#trace-decisions-actions-state]]`
- Summary: Defines the structure and value of a trace as a turn-by-turn structured record of decisions, actions, observations, and state updates.
- Key claims: Every meaningful change should leave evidence — decision captures intent, action captures what was done, observation captures the result, state update captures what changed; store references to inputs/outputs rather than copying large or sensitive payloads; trace fields include concise decision rationale (distinguishing plan vs. fallback vs. guess), tool action, state delta (silent memory/assumption/file/flag changes), and validation results; a trace is a structured record, not a transcript; traces feed correction loops and make runs replayable and auditable.
- Learner-relevant: Foundational data-model for debugging and observability lessons.

### diagnose-planning-tool-context-control-failures

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/32. Diagnose Planning, Tool, Context, and Control Failures.en.srt#diagnose-planning-tool-context-control-failures]]`
- Summary: Teaches separating a failed run into four failure domains (planning, tool, context, control) and repairing the smallest proven cause rather than rewriting prompts blindly.
- Key claims: Symptoms can appear far from the cause; diagnose from a trace, not a feeling; workflow captures the run, marks decision points, compares expected vs. actual behavior, and isolates the smallest relevant domain; planning failures show as busy work with unclear objective/coarse breakdown/no stop condition/ambiguous success criteria; tool failures come from bad schemas, denied permissions, or MCP/LSP/terminal contract assumptions; context failures from stale/missing/contradictory context; control failures from repeated/oscillating loops consuming tokens with no new evidence; guardrails are turn/time/token budgets, approval gates, escalation rules; fix the smallest proven cause, then rerun and compare traces.
- Learner-relevant: Gives a failure taxonomy that maps directly to a diagnostic decision procedure.

### replay-and-repair-failed-runs

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/33. Replay and Repair Failed Runs.en.srt#replay-and-repair-failed-runs]]`
- Summary: Turns a failed run into a reproducible experiment and then a durable, governed fix.
- Key claims: Failed runs are test cases; capture the full trace (prompt, tool defs/responses, memory reads/writes, env metadata, timestamps), freeze inputs, rehydrate context (parameters, tool versions, memory/config/flags), rerun in an isolated sandbox, then compare output, tool calls, state, latency, tokens, and errors; repair from combined evidence, not a single symptom; identify root cause and apply the smallest targeted repair (code patch, guardrail, validator, tool-boundary, docs); promote the failed run to a regression test and record the learning; production-affecting fixes need human approval before deployment.
- Learner-relevant: Supports a procedure lesson on replay/repair and a governance angle on safe failure handling.

### lab-debug-a-faulty-agent-loop

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/34. Lab Debug a Faulty Agent Loop.html#lab-debug-a-faulty-agent-loop]]`
- Summary: A 45–60 minute Python 3.10 hands-on lab (no cloud/packages/keys) that builds a refund-review agent and walks through reproducing and repairing three seeded defects.
- Key claims: Three faults are seeded — evaluator checks `get_order` instead of `fetch_order` (state never stored; `fetch_order` repeats, status `LIMIT_REACHED`), selector returns `check_delivery` while dispatcher implements `get_delivery_status` (status `FAILED`, "Unknown action"), and reversed refund decision (`DENY_REFUND` for eligible orders, caught by an acceptance check expecting `APPROVE_REFUND`); a repetition guardrail stops after three identical actions (`STALLED`); the acceptance check (`acceptance_check.py`) proves the correct business outcome; failure classification categories are planning, tool-contract, tool-execution, state, context, control, completion, and semantic; includes a troubleshooting cheatsheet and cleanup/restore steps.
- Learner-relevant: Ready-made lab/anchor for practice on traces, guardrails, tool contracts, and acceptance testing.

### quiz-verification-and-debugging

- Locator: `[[sources/loop-engineer/20261003/5 - Verify and Debug Agent Behavior/5. Verification and Debugging.html#quiz-verification-and-debugging]]`
- Summary: An interactive 10-question multiple-choice quiz (with score board, per-option feedback, and overall explanations) assessing the chapter's verification and debugging concepts.
- Key claims: Questions cover strongest completion evidence (acceptance tests pass + required diff present), separate generation from verification, artifacts that make a failed run replayable, classifying a valid tool call that cannot satisfy the goal, when an evaluator–optimizer loop should stop, debugging a tool response missing required fields, practices reducing self-verification bias, explaining a replay difference caused by a changed external API, concluding from linter-pass-but-integration-tests-fail, and handling sensitive tool arguments in a trace.
- Learner-relevant: Provides check questions/anchors for a quiz or `/tackle`-style assessment on the whole chapter.
