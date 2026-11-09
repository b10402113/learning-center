---
source: sources/background-agent/20261109/course/17-add-wait-conditions-steps.txt
source_type: text
source_lines: 107
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Extending the wait branch — the `decision.action === wait` branch now also fires on `request help`, keeping the existing complete-with-goal-condition case.
- Three kinds of wait — a generic intermediate wait, a completed wait, and a request-help wait that needs a message sent to a human; each must be defined.
- Reject completion — when the agent claims complete but a goal condition is configured, the harness runs `reject completion`, logs agent activity, and pauses for a human (optionally looping instead).
- Defer help — `request help` runs a `defer help` step and logs the pending question/detail payload without yet implementing help.
- Wait status update — a `step.run` records the run's waiting status with nested ternaries for request-help, wait reason, and not-yet-implemented recovery.
- Inngest `step.waitForEvent` — waits for a named event with an optional filter (`data.completionId === generatedTopicsId`) or a timeout, then continues only after one occurs; code is frozen up to that limit, which is why workflow control flow must be deterministic. It is equivalent to re-rendering the function on an event or cron.

# L2 detail

- `#L1-L8` — Moving into the code at the `decision.action === wait` branch; decide whether the second complete+goal-condition clause stays.
- `#L9-L16` — Keep the complete clause and add `request help`; the three suspend conditions are wait, request help, and complete-with-goal-condition.
- `#L17-L24` — Different types of wait: generic intermediary wait, complete wait, and request-help wait requiring a message.
- `#L25-L36` — For `complete`, await `step.run` with `reject completion` because the deterministic goal condition says the agent is not done.
- `#L37-L48` — Log agent activity with env/run IDs and phase `human`, message "completion blocked by configured goal condition"; alternative is a continue/loop, but human interjection is preferred.
- `#L49-L58` — For `request help`, await `step.run` with `defer help`, log phase `human`, and include the question/detail payload even though help is not implemented.
- `#L59-L69` — After handling complete and request help, only wait remains: `step.run` sets the run waiting with nested ternaries for request-help, wait reason, and recovery-not-added.
- `#L70-L74` — Updating the run with its waiting activity is just preparation before actually waiting.
- `#L75-L83` — Inngest docs on `step.waitForEvent`: event name, filter condition, timeout, and a conditional checking whether the event arrived or timed out.
- `#L84-L93` — The result variable holds the event or nothing on timeout; code freezes up to the timeout, so workflow control flow must be deterministic (no `Math.random`).
- `#L94-L107` — It does not suspend the server call stack; Inngest stores conditionals and re-invokes on the event or cron, like re-rendering a React function.
