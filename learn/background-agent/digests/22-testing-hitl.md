---
source: sources/background-agent/20261109/course/22-testing-hitl.txt
source_type: text
source_lines: 111
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- End-to-end demo — starts a release fault, lets the agent choose rollback, and shows the approval request landing in the inbox as a stored proposed action.
- Approving and auditing — approves the rollback, watches the state move from version 1 to version 2, and reads the audit log showing resume, state update, and recovery.
- Why the run can wait forever — durable suspension depends on runtime and platform (serverless freezes at a wait; local Node needs the while-loop trick), not on custom code.
- Resume mechanics — the approval fires an event that replays the workflow; cached steps fast-forward to the wait, then the decision, freshness recheck, stale loop, or action execution branches run.
- Visualizing with Inngest — the Inngest UI is the best way to see numbered loops and each step's output, avoiding hand-built diagrams.

# L2 detail

- `#L1-L10` — Recap that a non-fresh approval loops back; begins verification by starting the dev agent and triggering a release fault.
- `#L11-L26` — A new inbox item appears from the run that chose rollback; the harness blocked it and `proposedAction` wrote a DB row that the inbox picked up, so the run waits until resolved.
- `#L27-L38` — Shows the inbox message text; notes the fake tools have no real arguments, so the only visible input is a state version that means nothing to a person and would need proper inputs in a real app.
- `#L39-L49` — Approves the action, reads the audit log, and confirms the rollback mutated state from version 1 to version 2 before resuming.
- `#L50-L55` — Observes the state again, sees everything healthy, and notes the run would have waited indefinitely if left unapproved.
- `#L56-L70` — Answers whether waiting is framework or custom code: it depends on the durable-execution runtime and deployment; serverless gives compute-zero freezing for free, while local Node uses the while loop to simulate it.
- `#L71-L83` — Traces resume: the inbox button fires `agent/approval.decided`, the workflow replays and cached steps fast-forward to the wait, then `getProposal` reads the decision and a rejection escalates and returns.
- `#L84-L99` — Walks the approval path: re-observe state, `continue` back to the top on a version mismatch, mark the proposal stale so it leaves the inbox, otherwise fall through and execute the action.
- `#L100-L111` — Recommends Inngest as the visualization tool: it shows each numbered loop and every step's output plus metadata, so multi-loop conditional flows don't need hand-drawn sequence diagrams.
