---
source: sources/background-agent/20261109/supplement/lessons/06-incident-drill/index.md
source_type: text
source_lines: 136
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
supplements:
  - server.md#L52-L339
  - server.md#L340-L380
  - web.md#L14-L726
---

# L1 overview

- Asking for help — the dependency outage is the incident local tools cannot fix, so `request_help` is a legitimate next action: the harness persists a question, waits for a correlated answer, and resumes the **same** run.
- Answer is context, not evidence — the human reply enters the bounded context view, never certifies recovery; if checkout is still degraded the agent chooses `wait` until `health.recovered` and a fresh observation satisfies the goal condition.
- Reuse of the approval machinery — proposals and `waitForEvent` on `agent/approval.decided` serve both authorization (`policy === 'approval'`) and information (`policy === 'help'`), distinguished only by input shape and a `continue` instead of an effect.
- Evaluate the work, not its report — score **world state**, **action sequence**, and **human boundary** separately, because a polished summary can hide an unrelated disable, a late approval, or a completion claimed from stale evidence.
- Context policy for long runs — `agentState` returns a bounded slice of events, actions, and human decisions; keep goal snapshot, unresolved commitments, approval scopes, action IDs, and evidence links durable outside the prompt.

# L2 detail

- `#L1-L5` — Header: start `lesson-6` → solution `main`; outcome that the agent can ask a person a question, resume the same incident, and wait for independent recovery evidence.
- `#L6-L13` — Why an upstream gateway is unfixable locally, `request_help` as a model-selected action routed through the harness, the answer entering the next bounded context view, and reading the Activity trace as the story alert → evidence → question → pause → answer → wait → recovery → report.
- `#L14-L21` — "Evaluate the work, not just its final sentence": trajectory vs environment outcome, three separate scores, `agentState` slice and the context-selection policy, and why a policy/tool-contract change beats a prompt edit when the effect owner still permits the unsafe call.
- `#L22-L32` — "See it in the lab" with `--fault dependency --recover-after-ms 30000` and live-coding framing: remove the temporary help fallback so `request_help` reaches the inbox path without ending the incident.
- `#L33-L50` — Edit 1 diff: drop `request_help` from the service-event wait condition so it falls through to `if (decision.action === 'wait' || (decision.action === 'complete' && run.goalCondition))`.
- `#L51-L80` — Edit 2 diff: delete the `defer-help-{cycle}` "Help is not available yet" `logAgentActivity` block and collapse the `wait-status-{cycle}` reason to `decision.action === 'wait' ? decision.reason : 'Recovery is not verified'`.
- `#L81-L100` — Edit 3 diff: widen the gate to `if (policy === 'approval' || policy === 'help')` with `input = policy === 'help' ? { question: decision.detail } : { expectedVersion: state.world.version }` before `propose-action-{cycle}` calls `proposeAction`.
- `#L101-L121` — Edit 4 diff: `if (policy === 'help') continue` after the approved branch so a help answer leads to a fresh observation instead of `recheck-approved-state-{cycle}` and a checkout operation; format/lint/typecheck gate; Verify that answering resumes the same run and only a fresh healthy observation completes it.
- `#L122-L128` — "Break it on purpose" (`--recover-after-ms 0`: an answer must not mark checkout healthy; a healthy restart supersedes the old incident) and the challenge to continue into the capstone lab and decide which failure needs a policy change rather than a prompt change.
- `#L129-L136` — Catch up to `main` via `git status --short` and `git stash push -u -m "lesson 6 progress"`; common mistake (a human answer is new context, not evidence of recovery; the harness owns the inbox request and resumption) and the optional unresolved-status UI extension.
