---
source: sources/background-agent/20261109/course/6-custom-tool-loop.txt
source_type: text
source_lines: 127
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Why build a custom tool loop — off-the-shelf loops make it hard to intercept a tool call, pause, or escalate to a human.
- Internal loop vs harness loop — `generateText` can loop tools itself, but this design wants the model to only recommend the next step.
- Intercepting special actions — request-for-help and rollback-release are caught and escalated because approvals and pausing are not built yet.
- Default is to execute — any decision that is not one of the guarded actions is allowed to run.
- Action execution via the service — the agent POSTs to the checkout service's operations route instead of holding business logic locally.
- Action record fields — action ID, action name, expected state version, and the result are logged for traceability.
- State must change — every mutating action should update the observed state, since that state is the agent's only feedback channel.
- Loop teardown — returning inside the loop exits the call stack, so the post-loop update only runs when the iteration limit is hit.

# L2 detail

- `#L1-L6` — `request for help` is another special action; ordinary tool loops make interception and human-in-the-loop hard.
- `#L7-L24` — `generateText` supports tools and an internal stop condition, but pausing/escalation requires breaking out into a custom harness.
- `#L25-L30` — Request-for-help marks the run escalated with a reason that pausing is not implemented yet, then returns.
- `#L31-L40` — Rollback release is also intercepted and escalated; approvals have not been built.
- `#L41-L48` — The harness decides rollback needs human approval; every unguarded decision is fine to execute.
- `#L49-L54` — Guarded decisions are checked first, then an action ID is created so actions can be tracked.
- `#L55-L58` — Tracking every action is essential to earn trust when the agent is used by anyone besides its author.
- `#L59-L70` — The harness calls the checkout service's operations route so business logic stays on the service.
- `#L71-L84` — The POST body carries the action ID, the chosen action name, and the expected state version.
- `#L85-L90` — The call performs the action; the harness assumes success and that the action mutates state.
- `#L91-L104` — Without a state update the agent loses feedback, like a merge button whose UI never changes.
- `#L105-L110` — A non-OK response throws a standard error; durable execution and retry policy are deferred to another lesson.
- `#L111-L116` — A non-stale result records the tool action with environment, run, action, expected version, and result.
- `#L117-L127` — After the loop, the run is updated as escalated/decision-limit-reached; a `return` exits the whole call stack, so this only runs on limit exhaustion.
