---
source: loop-engineer
source_type: text
source_lines: 33675
part: 9
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — loop-engineer (part 9)

## Overview (L1)

- Review the Capstone Scenario and Requirements — Reframes the capstone from "make an agent finish a task" to "prove the agent can ship against a real repository." Covers reading requirements like an engineer (outcomes, constraints, interfaces, acceptance tests), assembling the context package (Claude.md, codebase-map.md, Claude settings JSON, source tree, tests), and the four deliverables that demonstrate readiness. Ends with a release-review workflow that resolves to approve / reject / escalate.
- Define Goals and Evidence of Completion — Argues that vague goals ("improve the API") leave completion ambiguous; goals must name intended behavior, constraints, and required evidence. Introduces the task contract as the handoff between human intent and agent execution, and the evidence gate (tests, diff, logs, review notes) as the control point that closes the loop. "No proof, no done."
- Implement the Tool-Calling Loop — Explains the reasoning→acting→observing cycle that turns a user request into controlled action, stressing that the loop needs a stop condition. Breaks execution into stages (send request/message history/tool schema, model proposes a tool call, runtime validates, executes, appends tool result) and names the parts of a reliable loop (tool registry, JSON schemas, message history, argument validator, sandbox, result normalizer, audit log).
- Add State, Context, and Checkpoints — Distinguishes state (live run progress), context (reference knowledge the agent consults), and checkpoints (recoverable snapshots). Shows how they connect to the loop and where to place checkpoints (at moments of risk, not every step), plus the three recovery options: resume, retry, rollback.
- Add Termination and Guardrails — Argues termination is part of agent design, not an afterthought: explicit exit rules evaluated every iteration, leading to complete / escalate / fail-safely. Guardrails define allowed behavior before tool calls, layered by risk (low/medium/high), with more impact meaning stricter control and a guardrail engine sitting between the loop and tools.
- Delegate Verification to a Reviewer Agent — Separates creation from judgment: a builder agent proposes a patch, a reviewer agent independently verifies tests/diffs/logs/requirements and emits an evidence report. Defines the reviewer contract (independence, deterministic checks first, evidence citation, uncertainty, structured report) and the least-privilege reviewer boundary.
- Add a Human Approval Checkpoint — Defines approval as a deliberate pause between proposal and execution. Details the workflow (detect risk → freeze state → build approval package → approve/reject/escalate) and the package contents (goal, scoped action, evidence, risk, rollback plan, expected result), and places the gate between the agent runtime and the tool layer.
- Execute, Trace, and Debug the System — Frames debugging as debugging the path, not just the final answer. Covers the run book (prepare inputs, load context, run through controlled interfaces, capture traces), the trace as a structured record anchored by a trace ID, and a diagnostic matrix (where did the trace first diverge) leading to traceable fixes.
- Submit the Final Agent and Execution Report — Treats submission as an evidence-packed handoff, not a file upload. The repository (implementation) and execution-report.md (what happened) answer two different questions; the report must be evidence, not opinion, showing inputs, decisions, tool calls, and error handling. Acceptance passes through a review gate before moving to the operational owner.
- Capstone Evaluation Rubric — Presents the rubric as the contract between assignment, implementation, and submitted evidence, grading evidence not intention. Covers the four areas (correctness, reliability, safety, operational readiness), the evaluation sequence (repo + report → scenario runs → traces/checkpoints → written evidence → score), measurable rubric parts, and score bands with a fix-and-retest feedback loop.

## Sections (L2)

### review-the-capstone-scenario-and-requirements

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/59. Review the Capstone Scenario and Requirements.en.srt#review-the-capstone-scenario-and-requirements]]`
- Summary: Reads the capstone as a realistic shipping exercise rather than a demo. Teaches reading requirements like an engineer — outcomes first, then constraints, interfaces, and acceptance tests — and assembling an intentional context package so the agent can plan, make a safe scope change, and produce verification evidence.
- Key claims: The capstone must prove operation against a real repository, responsible tool use, preserved context, approval on rising risk, and production-decision evidence; weak requirements lead to unsafe automation; the context package is Claude.md (operating instructions), codebase-map.md (repository mental model), Claude settings JSON (permissions/tool policy), plus source tree and tests; success is a safe change, verified behavior, and a clear approval path, not a clever prompt; the final review ends in approve, reject, or escalate.
- Learner-relevant: Establishes the capstone's overall goal, deliverables, and definition of done — the anchor for every later step in the DAG.

### define-goals-and-evidence-of-completion

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/60. Define Goals and Evidence of Completion.en.srt#define-goals-and-evidence-of-completion]]`
- Summary: Explains how to make "done" visible before letting an agent work, converting business intent into a concrete goal with constraints and required evidence. Introduces the task contract and the evidence gate that stops the loop from declaring success on its own.
- Key claims: Goals should name intended behavior (e.g. "add rate limiting for API endpoints" — prevent abuse, respect limits, log rejections); constraints ("no data loss") are boundaries, not suggestions; the task contract states the outcome, scope, facts, allowed tools, required proof, and stop condition; evidence (issue acceptance criteria, branch/commit diff, tests, logs, review notes) should be collected as work progresses, not written at the end; the loop completes only when evidence matches the goal.
- Learner-relevant: Gives the goal-and-evidence discipline that grounds the task contract referenced throughout the capstone build.

### implement-the-tool-calling-loop

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/61. Implement the Tool-Calling Loop.en.srt#implement-the-tool-calling-loop]]`
- Summary: Describes how an agent turns a request into controlled action through a reasoning/acting/observing loop with a stop condition. Breaks the execution path into concrete stages and catalogs the small parts that make the loop reliable, plus the runtime checks and audit requirements before any tool executes.
- Key claims: The model proposes a tool call but the runtime enforces contracts, permissions, timeouts, and reliability; the execution stages are send request + message history + tool schema, model selects tool/arguments, runtime validates name/args/timeouts, executes in a sandbox, appends the tool result; reliable loop parts are tool registry, JSON schemas, message history, argument validator, execution sandbox, result normalizer; pre-execution questions include permission, schema match, rate limit, risk level, and whether human approval is needed; low-risk read-only tools may run automatically while higher-risk tools need approval/escalation; the audit log (request, tool, status, duration) is mandatory.
- Learner-relevant: The core implementation step — the tool-calling loop machinery that later state, termination, and verification steps build on.

### add-state-context-and-checkpoints

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/62. Add State, Context, and Checkpoints.en.srt#add-state-context-and-checkpoints]]`
- Summary: Separates the three memory layers that turn a fragile loop into an engineering workflow — state (what changes during a run), context (what guides it), and checkpoints (what protects it). Shows where checkpoints belong and the recovery operations they enable.
- Key claims: State tracks task status, decisions, tool outputs, and errors; context is curated reference material (requirements, repo map, policies, examples) that should not be dumped blindly into every prompt; checkpoints are recoverable snapshots (state snapshot, diff, test results, rollback point) taken at moments of risk, not every internal calculation; checkpointing belongs inside the loop, not at the end; recovery options are resume, retry, and rollback; a good checkpoint includes state, context references, tool input/output artifacts, test report, and metadata.
- Learner-relevant: Supplies the memory/recovery design for the capstone agent, and a checkpoint is the mechanism the later human-approval and tracing steps depend on.

### add-termination-and-guardrails

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/63. Add Termination and Guardrails.en.srt#add-termination-and-guardrails]]`
- Summary: Makes the case that a loop must know when to stop and what it is allowed to do. Defines termination rules evaluated each iteration and risk-layered guardrails, with a guardrail engine governing tool access.
- Key claims: Termination rules check goal satisfaction, max step count, time/token budget, accumulating errors, and required approval, yielding complete / escalate / fail-safely; termination is based on current state, not just a hard-coded counter; guardrails come from repo instructions (Claude.md, codebase-map.md), configurations (Claude session JSON), and tool interfaces (MCP, LSP); guardrails are layered by risk — low (observe/summarize: logging + budget limits), medium (draft changes/branch: validation tests + evidence), high (delete/deploy/spend/notify: human approval + rollback readiness); the two mistakes are treating everything as dangerous or everything as safe.
- Learner-relevant: Defines the termination and guardrail layer that keeps the capstone agent bounded, safe, and measurable.

### delegate-verification-to-a-reviewer-agent

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/64. Delegate Verification to a Reviewer Agent.en.srt#delegate-verification-to-a-reviewer-agent]]`
- Summary: Separates creation from judgment via a reviewer agent that independently verifies the builder's patch and produces an evidence report rather than silently rewriting the work. Defines the verification lifecycle, the reviewer contract, and the authority boundary.
- Key claims: The builder plans/edits and proposes a patch; the reviewer checks tests, diffs, logs, and requirements; the loop advances only when the reviewer can cite evidence, else rejects or escalates; the reviewer lifecycle is task+criteria → builder output → deterministic and inspection checks → evidence report → approve/reject/escalate; reviewer contract rules are independence, deterministic checks first, evidence citation, honest uncertainty, and a structured report; reviewer inputs include goal/criteria, Claude.md, codebase-map.md, Claude session agent file, MCP tool results, and LSP diagnostics; the reviewer boundary should be more restricted (read-only, control test execution) than the builder's.
- Learner-relevant: The verification pattern the capstone should implement, and the conceptual basis for the rubric's "verification" criterion.

### add-a-human-approval-checkpoint

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/65. Add a Human Approval Checkpoint.en.srt#add-a-human-approval-checkpoint]]`
- Summary: Establishes approval as a deliberate pause between an agent proposing an action and the system executing it. Details the detection, state-freeze, package-building, and decision workflow, and specifies what a good approval package contains.
- Key claims: Approval sits between proposal and execution, not as an after-the-fact review; the workflow detects risk (policy, risk level, tool type, environment, cost, target sensitivity), freezes state so the human reviews a stable context, builds an approval package, then returns approve/reject/escalate; package contents are goal, scoped action, evidence, risk level (impact + likelihood), rollback plan, and expected result; the gate belongs between the agent runtime and the tool layer; read-only work can run without approval while mutation work (write to main, delete, deploy, email, change permissions) must pass the gate; a denied action stops and returns to planning with feedback; governance runs alongside via audit logs, policy rules, and metrics.
- Learner-relevant: The human-in-the-loop control the capstone requires before high-impact tool calls, tying guardrails to rollout safety.

### execute-trace-and-debug-the-system

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/66. Execute, Trace, and Debug the System.en.srt#execute-trace-and-debug-the-system]]`
- Summary: Moves the agent from architecture to evidence, teaching execution via a repeatable run book and structured tracing so failures can be located at the point of divergence rather than blamed on the model.
- Key claims: Debug the path that produced the answer, not only the answer; the terminal serves during a run and the trace viewer after (timing, retries, tool inputs, observations, final response); a retry is only a problem when it cannot be explained; traces are structured records anchored by a trace ID capturing input snapshot, prompt/retrieved context, tool calls, observations, state changes, and reasoning; the same final answer can come from safe vs. unsafe paths; the diagnostic matrix asks where the trace first diverged, separating model decision from tool invocation and checking weak termination rules when the loop keeps running; fixes (add evidence, retry with fallback, restore checkpoint, tighten stop condition) should themselves be traceable; enterprise debugging is a loop of execution, tracing, review, repair, and regression testing.
- Learner-relevant: Equips the learner to run, observe, and repair the capstone agent — the "execute and trace" stage of the submission workflow.

### submit-the-final-agent-and-execution-report

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/67. Submit the Final Agent and Execution Report.en.srt#submit-the-final-agent-and-execution-report]]`
- Summary: Reframes final submission as an evidence-packed handoff another person can trust, reproduce, and inspect. Separates the repository (what was built) from the execution report (what happened), and specifies the expected package structure and review gate.
- Key claims: Submit a complete engineering package, not just a running agent; the sequence is package code → run scenario from a clean entry point → capture traces/tool calls/logs/errors/retries/outputs → review against requirements → submit; the repository should contain agent code/tools, tests, Claude.md, codebase-map.md, Claude session JSON, and execution-report.md; the report must be evidence not opinion (what was run, inputs, decisions, tool calls, error handling) and expose hidden fragility (risky permissions, ignored diagnostics, skipped failed calls); the before/during/after structure documents inputs, captures decisions/errors, and records the final result; acceptance passes a review gate checking reproduction, documented risks, understood rollback, and attached approvals.
- Learner-relevant: Defines the capstone deliverable and handoff checklist, and the criteria the final review gate checks.

### capstone-evaluation-rubric

- Locator: `[[sources/loop-engineer/20261003/9 - Capstone—Build a Reliable Issue-Resolution Agent/68. Capstone Evaluation Rubric.en.srt#capstone-evaluation-rubric]]`
- Summary: Presents the rubric as the contract between assignment, implementation, and evidence, with the guiding principle "grade evidence, not intention." Defines the four evaluation areas, the evaluation sequence, measurable rubric parts, score bands, and the fix-retest feedback loop.
- Key claims: Evaluate across correctness, reliability, safety, and operational readiness; the process is repo + execution report → scenario runs (happy path + realistic edge cases) → inspect traces/checkpoints → review written evidence (screenshots, logs, outputs, tests) → assign score with feedback; measurable parts are goal completion, tool-loop design, context/memory (Claude.md, codebase-map.md), guardrails (termination, limits, approvals), verification (tests, traces, reviewer agent), and the execution report; the enterprise context adds an evaluation harness (scenarios, MCP, LSP, traces), reviewer workflow, and a governance lane (audit logs, risk notes, feedback backlog); score bands separate exceeds / meets / needs revision / blocked, and improvements count only after retest.
- Learner-relevant: Gives the grading contract and self-assessment lens for the capstone, mapping each build step to an evaluable criterion.
