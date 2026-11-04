---
source: sources/background-agent/20261105/14-handle-special-cases.vtt
source_type: text
source_lines: 941
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L1052-L1066
  - server.md#L692-L811
---

# L1 overview

- Special decision types can't be copy-pasted — the old single-step handling is close but not identical, so `wait` / `complete` / `request_for_help` are rewritten as separate branches on `decision.action` plus a new `run.goal.condition` existence check (a run without a condition is "gaslighting the agent" into finding a problem).
- Unbuilt branches are honest placeholders — the wait branch escalates the run in a step and records a wait event with `wait unavailable / waits not built`, returning so the loop stops; the help branch mirrors it with `help unavailable` / `human help not created yet`.
- Completion is two steps plus a return — `step.run("write report cycle N")` (LLM call, must be memoized), `step.run("complete run cycle N")` writing `completed` + report, then `return report`. Skipping the run update leaves the agent re-solving an already-solved problem.
- Every `step.run` is a checkpoint — the framing is "0 of 1" instead of "all of it", and the mem oization saves real dollars on LLM calls, not just time/space.
- Derived action ID lives outside a step — generating it with `crypto.randomUUID()` is technically nondeterministic, but nothing branches on its value: it is only recorded, so it behaves deterministically. Contrast: `Math.random()` as a loop bound *would* break the workflow.
- Action policy table replaces per-tool branching — an `actionPolicy` map classifies each action as read / write / approval / help / terminal, and the harness writes one branch per *policy* instead of one per action, so adding a tool means tagging it, not editing control flow.
- Read is the fallback policy — everything not explicitly handled falls through to execution, so approval (and later help/terminal) are the only branches you must write.

# L2 detail

- `#L1-L55` — Starts the special-case block, notes the old code cannot simply be pasted over, and opens `if (decision.action === "wait" || decision.action === "complete")` extended with `&& !run.goal.condition`.
- `#L56-L130` — Explains the condition guard (a run created without a goal condition is unfair to the agent), then the wait branch: a step that updates the run to `escalated`, records the `wait/waits not built` event, plus the mandatory `return`.
- `#L131-L200` — The `complete` branch: reminding that it must return at some point, then `step.run("write report cycle N")` wrapping `writeReport({ goal, state })` because the LLM call is nondeterministic.
- `#L201-L280` — `step.run("complete run cycle N")` setting the run to `completed, null` with the report, and the gotcha: without marking the run complete the top-of-loop guard never fires and the agent keeps solving an already-solved incident.
- `#L281-L370` — The `request_for_help` branch, copied from wait with a different message (`help unavailable`, `human help not created yet`) and the same escalate-and-return shape.
- `#L371-L430` — Restates that no new business logic is being introduced, only durability, and that every `step.run` is a checkpoint measuring "0 of 1" — including budget/dollar complexity for LLM calls.
- `#L431-L520` — Generates the action ID inline (`crypto.randomUUID()`) and turns the "is this deterministic?" question into a worked argument about uniqueness-only records.
- `#L521-L600` — The reasoning: we never branch on the action ID, we only persist it, so regenerating it on replay is fine — versus a `Math.random()`-bounded loop where the value drives execution and would genuinely break the workflow.
- `#L601-L680` — Pushes further: if the unique ID came from a network call it would be worth a step purely to cache the request, not for determinism; here it is free, so it stays in the workflow.
- `#L681-L760` — Introduces `actionPolicy[decision.action]` as an authority abstraction and reads the table aloud: `inspect_log` = read, `inspect_changes` = read, `disable_feature` = write, `rollback_release` = approval.
- `#L761-L830` — Justifies the policy indirection: 30 actions would otherwise mean 30 if-branches; with policies the harness only needs a branch per read/write/approval/help/terminal class.
- `#L831-L941` — Writes the `if (policy === "approval")` placeholder (human approval comes later), then closes with read as the unhandled fallback so all real execution flows through the default path.
