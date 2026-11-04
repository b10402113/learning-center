---
source: sources/background-agent/20261105/17-add-wait-conditions-steps.vtt
source_type: text
source_lines: 835
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L929-L969
  - server.md#L1052-L1066
---

# L1 overview

- The wait branch is generalised: any of `wait`, `request_help`, or `complete` with a goal condition configured suspends the workflow instead of letting the loop spin.
- Each suspend flavour has its own step: `complete` runs `reject-completion`, `request_help` runs `defer-help`, and a bare `wait` falls through to `wait-status` which stamps the run `waiting` plus a human-readable `waitReason`.
- Harness authority over completion — if a goal condition is configured and the agent claims done, the harness rejects the claim and stops; the goal checker is treated as perfect.
- `step.waitForEvent` replaces `step.run` as the pause primitive: it takes a step name, an event name, an optional `if` filter string over the event data, and a timeout — no code after it evaluates until one of the two fires.
- The wait is a hard block on the stored condition, not a suspended call stack — the function winds down and is re-invoked (like a React re-render) by the event or by a cron.
- Determinism is load-bearing: because the workflow may sit frozen for days, replay must land on the exact same step, so no `Math.random()`, no non-idempotent mutations, no divergent top-level control flow.

# L2 detail

- `#L1-L50` — Opens the previously stubbed wait section of the workflow and rewrites the `if (decision.action === 'wait' ...)` condition, deciding whether to keep the goal-condition half of the guard.
- `#L50-L100` — Enumerating the suspend cases: literally `wait` is free/always valid, and `decision.action === 'request_help'` must also suspend.
- `#L100-L160` — Semantics of "wait" defined: not "stop" but an in-between step, and each action has a different flavour — `complete` means done, `request_help` means compose a message and get help, `wait` means literally wait.
- `#L160-L270` — The `complete` branch: `await step.run('reject-completion', ...)` because the deterministic goal checker says the agent is not done; if the agent reached this line and claims completion, it is wrong.
- `#L270-L330` — Activity logging for that step: phase `human`, message "completion blocked by configured goal condition", on the theory that agent and harness are at a standstill and a person must interject.
- `#L330-L400` — The alternative the instructor explicitly rejects: put a `continue` there so the loop re-reads its own "I thought I was done" response — workable, but a worse spot to lose the human-in-the-loop opportunity.
- `#L400-L500` — The `request_help` branch: `await step.run('defer-help', ...)`, logging phase `human` with "help is not ready yet" and carrying `decision.detail`/question in the payload so the log shows what it *would* have asked.
- `#L500-L580` — Fall-through wait path: after handling complete and request_help, only `wait` remains, so `step.run('wait-status', ...)` calls `setRun(runId, 'waiting', ...)` with a nested ternary picking the `waitReason` (help not added yet / `decision.reason` / recovery not added yet).
- `#L580-L660` — Inngest docs opened cold to explain `step.waitForEvent`: step name, the event name it listens for, a timeout, and the `if` filter expression over event data so unrelated events are ignored.
- `#L660-L720` — The post-wait contract: nothing after the step executes until either the matching event or the timeout (here "three days") occurs; the returned value is either the event or `null` on timeout, and null is the branch where you handle "it never showed up".
- `#L720-L790` — The determinism warning: this JavaScript gets frozen for up to three days, so a re-execution must land in the exact same place — no new step results, no new mutations, and `Math.random()` branching would "completely kill all of this".
- `#L790-L835` — Mental model close: it is not suspending the call stack or keeping a server function alive; Inngest stores a conditional that the incoming event updates, and that event (or a cron) is what re-invokes the function — "just rendering the function again".
