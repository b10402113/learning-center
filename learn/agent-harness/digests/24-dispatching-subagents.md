---
source: 24-dispatching-subagents
source_type: pdf
source_lines: 326
status: absorbed
absorbed_at: 2026-09-15
created: 2026-09-15
updated: 2026-09-15
---

# Digest — 24-dispatching-subagents

## Overview (L1)

- Parallel dispatch in one step — Every sub-agent is dispatched in parallel with its own context window, deliberately wrapped in a single DBOS step so a retry re-runs them together. This is acknowledged as not optimal, but chosen.
- Dispatch implementation — `plan.steps.map` returns `DBOS.startRunStep` per step; each callback emits a sub-agent-started event, gets findings from `runInvestigation`, emits a completion event, and returns the agent plus findings, all under a named step.
- Settled-result handling — `Promise.allSettled` combined with filtering fulfilled results collects findings while silently dropping failed investigations; the instructor notes a more advanced option of feeding failures back to the supervisor and explicitly defers it.
- Synthesis and registration — Synthesis is wrapped in a `DBOS.runStep` and followed by a model-completed emit (which caught a real missing-return bug). The workflow is registered with `DBOS.registerWorkflow` and imported into the server index, where `message.mode === 'supervised'` routes to the supervisor workflow.
- Demo and observations — A live run shows the generated plan, each investigation's findings, and the supervisor's synthesized reply; handoffs are only supported in the agent workflow, not the supervisor workflow, and an extra "investigation completed" step is suggested.

## Sections (L2)

### parallel-dispatch-rationale

- Locator: `[[sources/agent-harness/20260915/24-dispatching-subagents.txt#parallel-dispatch-rationale]]`
- Summary: Explains why all sub-agents are dispatched in parallel and why they share a single step.
- Key claims: Each sub-agent gets its own context window; the AI SDK handles execution; all sub-agents are placed in one step because they must run simultaneously, so a retry retries them all at once; the instructor concedes this is not optimal but is the chosen design.
- Learner-relevant: The key durability trade-off to internalize — one step means all-or-nothing retry, which is simpler and cheaper than per-agent durability here.

### dispatching-subagents

- Locator: `[[sources/agent-harness/20260915/24-dispatching-subagents.txt#dispatching-subagents]]`
- Summary: Implements the parallel dispatch: map each plan step to a `DBOS.startRunStep` that emits events, runs the investigator, and returns findings.
- Key claims: `Promise.allSettled` over `plan.steps.map` issues one `DBOS.startRunStep` per plan step; each callback emits a sub-agent-started event carrying workflow ID, step ID, agent, and objective; findings come from `await runInvestigation(step.agent, step.objective)`; a completion emit reports the agent, step, and findings; the step is named `sub-agents` plus the agent name.
- Learner-relevant: The concrete fan-out implementation — how to start parallel durable sub-agents while keeping the UI informed at each transition.

### handling-settled-results

- Locator: `[[sources/agent-harness/20260915/24-dispatching-subagents.txt#handling-settled-results]]`
- Summary: Cleans up the settled results, keeping fulfilled findings and discarding failures.
- Key claims: The code iterates the settled promises, pushes findings from fulfilled ones, and runs a step to record that one died and why; failures could be surfaced in the UI or fed back to the supervisor for a follow-up decision, but the instructor calls that way more advanced and skips it.
- Learner-relevant: A minimal graceful-degradation pattern for fan-out failures, plus a pointer to the more advanced supervisor-feedback option.

### synthesis-and-registration

- Locator: `[[sources/agent-harness/20260915/24-dispatching-subagents.txt#synthesis-and-registration]]`
- Summary: Runs synthesis as a durable step, emits a model-completed event, returns the reply, and registers the workflow.
- Key claims: Synthesis is wrapped in `DBOS.runStep` because, as a rule of thumb, asynchronous, non-deterministic, or costly work belongs in a step; the follow-up emit is `model completed`; failing to `return` the text was a latent bug caught only because the emit expected a stream type; the workflow is registered with `DBOS.registerWorkflow`.
- Learner-relevant: Reinforces the step-wrapping heuristic and shows a real type-checking catch of a missing return in a durable workflow.

### supervised-mode-routing

- Locator: `[[sources/agent-harness/20260915/24-dispatching-subagents.txt#supervised-mode-routing]]`
- Summary: Wires the supervisor workflow into the server so a message with `mode === 'supervised'` runs it, otherwise the default agent workflow runs.
- Key claims: The server index imports `runSupervisorWorkflow`; the submitted-task handler checks `message.mode === 'supervised'`; if supervised it starts the supervisor workflow with the message inputs, otherwise it defaults to the existing agent workflow.
- Learner-relevant: The switchboard that makes plan mode user-opt-in, tying back to the "plan mode artifact" decision in file 22.

### demo-results

- Locator: `[[sources/agent-harness/20260915/24-dispatching-subagents.txt#demo-results]]`
- Summary: Walks through a live supervised run and the resulting plan, per-investigation findings, and final reply.
- Key claims: Running in supervised mode always invokes the supervisor workflow because that is the explicit trigger; the supervisor workflow has no knowledge of handoffs, which exist only in the agent workflow, so both cannot be combined; the demo shows the generated plan object with steps array (which agent does which objective), the three sub-agent start/complete events, per-investigation findings (billing found duplicates, technical searched the KB, sales handled the 50-seat pricing request), and the synthesized reply; the instructor suggests adding an "investigation completed" step.
- Learner-relevant: End-to-end evidence of the architecture working and a concrete improvement idea, useful as a reference for expected event sequences in the UI.

## Sources

- [[sources/agent-harness/20260915/24-dispatching-subagents.txt]]
