---
source: loop-engineer
source_type: text
source_lines: 33675
part: 4
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — loop-engineer (part 4)

## Overview (L1)

- How to end an agent loop deliberately — this chapter defines the four terminal outcomes (success, failure, blocked, escalated) and the small record/contract each one must leave behind, so stops are auditable and resumes are safe.
- Bounding a run with budgets — turn, time, token, and cost limits are four guardrails around the same open-ended behavior; each targets a distinct failure mode and should live in runtime policy rather than prompt text.
- Detecting non-progress — repetition, oscillation, and non-progress are measurable engineering conditions, caught with action fingerprints, state deltas, and a short loop window feeding a progress gate.
- Permissions and action boundaries — capability is not permission; a policy engine (not the agent) decides what is auto-allowed, what needs approval, and what is blocked, with every decision audited.
- Input/execution/output guardrails — three protective layers surround the full lifecycle (normalize and validate the request, police each tool call, verify the final answer) rather than one filter at the end.
- Selective human approval for high-risk actions — high-impact, irreversible actions pause the loop and route through a defined approval gate, backed by a risk policy, action boundary, approval payload, and decision record.
- Exercise: stop or continue an agent loop — a Python coding lab implementing `decide_loop()`, which checks verified completion before iteration and no-progress limits and returns a structured decision.
- Quiz: termination and guardrails — a ten-question multiple-choice check covering terminal outcomes, budgets, oscillation, allowlist enforcement, non-progress signals, output redaction, and bounded-stop records.
- Role-play: stop, continue, or escalate an agent run — an HTML activity shell for practicing stop/continue/escalate decisions (content container is empty in the source).

## Sections (L2)

### stop-continue-or-escalate-an-agent-run

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/1. Stop, Continue, or Escalate an Agent Run.html#stop-continue-or-escalate-an-agent-run]]`
- Summary: An HTML role-play page titled "Stop, Continue, or Escalate an Agent Run" that provides a styled exercise shell for making loop-control decisions. The body's content container is empty, so the page supplies no questions or instructions in the source.
- Key claims: It is a role-play activity about choosing stop/continue/escalate; the interactive content is not populated in this file
- Learner-relevant: Can anchor a hands-on role-play where the learner classifies a run into stop, continue, or escalate before the concept lectures

### stop-or-continue-an-agent-loop

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/3. Stop or Continue an Agent Loop.html#stop-or-continue-an-agent-loop]]`
- Summary: A Python coding exercise where the learner completes `decide_loop(state, limits)`. The function must validate that state and limits are dicts, validate all required values, then return `complete` on verified goal completion, `stop` at the iteration limit, `stop` at the no-progress limit, or `continue` otherwise.
- Key claims: Verified completion must be checked before limits; invalid input must return a structured `error` decision instead of raising; the reference solution uses `isinstance` checks that exclude `bool` from integer validation
- Learner-relevant: Provides a concrete, testable implementation of loop termination ordering and structured, non-throwing decisions

### termination-and-guardrails

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/4. Termination and Guardrails.html#termination-and-guardrails]]`
- Summary: A ten-question multiple-choice quiz with score board and per-answer feedback. It tests outcome classification (success vs blocked vs escalated), which budgets bound a run, oscillation recognition, allowlist placement, non-progress signals, output-secret handling, why a turn limit alone is insufficient, and what a bounded-stop record must contain.
- Key claims: Success requires verified evidence against completion criteria; a missing credential makes a run `blocked`; token/cost/turn/elapsed-time budgets are legitimate bounds while unlimited retries and unrestricted permissions are not; a valid-but-unapproved production deletion should escalate
- Learner-relevant: Supplies ready-made assessment items and answer rationale for checking mastery of termination and guardrail concepts

### define-success-failure-blocked-and-escalated-outcomes

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/21. Define Success, Failure, Blocked, and Escalated Outcomes.en.srt#define-success-failure-blocked-and-escalated-outcomes]]`
- Summary: Defines the four terminal outcome states an agent loop must produce and the minimum "contract" each state must record. It then maps the states onto the run lifecycle — request/task, preconditions, tool action, validation, and decision — and explains how outcomes feed observability, recovery, and safe resume.
- Key claims: Success = goal met and result verified; failure = action attempted but output failed validation; blocked = cannot continue safely (missing info, access, or dependency); escalated = next decision belongs to a human owner/reviewer/policy process; unsatisfied preconditions yield blocked, not failure, because the agent never got a fair chance to execute; each state has a required record (success: evidence/artifact/criteria; failure: error class/action/validation; blocked: what is missing or unsafe; escalated: owner/reason/approval needed); precise outcomes create safe resumes and prevent duplicate actions
- Learner-relevant: Establishes the outcome vocabulary and per-state records every later step in the chapter reuses, and grounds resume-safety design

### turn-time-token-and-cost-limits

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/22. Turn, Time, Token, and Cost Limits.en.srt#turn-time-token-and-cost-limits]]`
- Summary: Introduces four budgets that bound an open-ended loop and explains the distinct failure mode each prevents: turn limits stop endless reasoning, time limits stop stalled/slow tools, token limits protect context quality, and cost limits protect the budget. It argues limits should be checked at multiple points and enforced via runtime policy/configuration rather than prompt text.
- Key claims: The reliable loop is "plan, check, act, measure, decide, then repeat" rather than plain plan-act-observe; each budget protects against a different failure (endless reasoning, stalled work, context overflow, budget leaks); limits should live in config/policy (e.g. max turns, timeout seconds, token ceilings, cost caps) because prompts are easy to ignore; mature loops use several safe exits (summarize, checkpoint, request approval, escalate) instead of just stopping; production agents should stop predictably, explain what happened, and preserve the path forward
- Learner-relevant: Gives the concrete budget taxonomy and the multi-checkpoint enforcement pattern needed to design safe, operable limits

### detect-repetition-oscillation-and-non-progress

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/23. Detect Repetition, Oscillation, and Non-Progress.en.srt#detect-repetition-oscillation-and-non-progress]]`
- Summary: Defines repetition (same action/tool/inputs), oscillation (bouncing between two states, e.g. edit then undo), and non-progress (activity without a measurable state change). It presents signals for detecting them — goal, state snapshot, action fingerprint, result delta, decision — and three practical detectors (action fingerprint, state delta, loop window) feeding a progress gate.
- Key claims: Progress only has meaning relative to the defined completion criteria; detectors must look at observable evidence, not style or wording; many bad loops are only obvious across several turns, so a window of recent history matters; the stop rule maps signals to actions — repeated fingerprint: summarize; no state delta: ask for new info; retry limit hit: escalate; approval required: stop and request review; non-progress should be treated as a measurable engineering condition, not mysterious model behavior
- Learner-relevant: Supplies the detection model and concrete guardrail logic for building a progress gate into a runtime

### apply-tool-permissions-and-action-boundaries

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/24. Apply Tool Permissions and Action Boundaries.en.srt#apply-tool-permissions-and-action-boundaries]]`
- Summary: Separates capability from permission and walks through the permission decision flow: intent to plan to tool request to policy (risk level) to allow/approve/block to audit. It lays out the building blocks of a permission model — identity/role, tool scope, action boundary, evidence/audit — and applies them to a real repository workflow.
- Key claims: The policy system, not the agent, decides what is allowed, what requires approval, and what is blocked; low-risk in-scope requests can auto-allow, medium-risk should pause for approval, high-risk that violates boundary/exceeds task should be blocked; every allow/approval/block and result needs an audit event; design safe defaults via least privilege, narrow scopes, confirmation for irreversible actions, deterministic result validation, and decision logging; make unsafe actions impossible by default
- Learner-relevant: Gives the permission-model vocabulary and the enforcement-point (policy engine) design for governing agent actions

### add-input-output-and-execution-guardrails

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/25. Add Input, Output, and Execution Guardrails.en.srt#add-input-output-and-execution-guardrails]]`
- Summary: Frames guardrails as three layers wrapping the full lifecycle. Input guardrails normalize the request and check it against an input contract (safety, scope, schema); execution guardrails sit between the runtime and tools and enforce allowlists, timeouts, rate limits, and approval; output guardrails validate format, grounding, and policy before the answer is returned or triggers downstream action.
- Key claims: Guardrails surround the whole lifecycle, not a single end filter; input guardrails route valid work, reject unsafe work, and pause incomplete work before wasting turns/tokens/trust; the model may propose an action but the runtime decides whether it is permitted; output checks should verify format, factual support, secrets/restricted content, and clear confidence; enterprise guardrails connect repo context, the loop, and governance (audit logs, approvals, evaluations, rollback)
- Learner-relevant: Provides the before/during/after guardrail placement model the learner can use to decide where each control belongs in a loop

### require-approval-for-high-risk-actions

- Locator: `[[sources/loop-engineer/20261003/4 - Control and Terminate the Loop/26. Require Approval for High-Risk Actions.en.srt#require-approval-for-high-risk-actions]]`
- Summary: Explains selective approval: low-risk work continues, while high-impact/irreversible actions (changing production data, spending money, sending messages, deleting content, deploying, exposing secrets) pause the loop and go to a reviewer. It details the approval flow (propose, classify risk, reviewer decides, execute, log/monitor) and the four components behind an approval control.
- Key claims: Do not require humans to approve everything — that causes fatigue; use selective approval at a clearly defined gate that is part of the loop; approval should classify risk via policy rules, show reviewers context/impact/options (approve, reject, request changes, ask more info), and block silent retries; a good policy defines what counts as high risk, who approves, what evidence is shown, and how the decision is recorded; separate risk policy, action boundary, approval payload, and decision record so teams can update policy without rewriting the loop
- Learner-relevant: Supplies the high-risk approval design and checklist (impact vs reversibility) for governing consequential agent actions
