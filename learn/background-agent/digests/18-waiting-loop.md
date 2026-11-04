---
source: sources/background-agent/20261105/18-waiting-loop.vtt
source_type: text
source_lines: 644
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L505-L691
  - server.md#L1035-L1051
---

# L1 overview

- The waiting loop is a `while (true)` nested inside the existing cycle loop: each pass reads the run's `eventSequence`, stops if the run went terminal, and otherwise breaks out to wait.
- A `check` counter (with the outer cycle cursor) becomes the step-name suffix, so every poll and every wait gets a distinct, replayable checkpoint id.
- The poll is a guard, not the mechanism: `latest.eventSequence > state.eventSequence` means new signal already arrived, so break immediately instead of waiting.
- Terminal re-check is mandatory every iteration — in a distributed, non-request/response system the run can complete, fail, cancel, escalate or be superseded underneath you; skipping this check produces "a lot of bugs".
- The wait itself is `step.waitForEvent('wait-for-service-N-M', { event: 'incident/updated', if: 'async.data.runId == "<runId>"', timeout: '10s' })` — effectively a `setTimeout` that also listens for a matching event.
- `step.sleep` + querying an event store is the alternative and is worse: it can only observe state after the full interval, which is fine at 10s and actively harmful at 30 minutes.

# L2 detail

- `#L1-L40` — Framing: several valid designs, no single right answer; introduces `let check = 0` as the variable tracking whether the loop may keep going.
- `#L40-L88` — Chooses `while (true)` deliberately as the first example because everyone already understands it, even though it is not strictly required.
- `#L88-L112` — Inside the loop: `latest = await step.run('read-event-sequence-...')` with the cycle cursor appended to the step id.
- `#L112-L145` — Naming convention explained: the inner loop's cursor is the `check`, so the code is literally "checking" for events on every pass.
- `#L145-L175` — The step also fetches the current run by id (`getRun(runId)`) to make sure the in-memory view is up to date.
- `#L175-L230` — Guard clause copied from the main loop: if `latest.status` is completed, failed, cancelled, escalated or superseded, do nothing and stop.
- `#L230-L290` — Why that guard exists at all: this is asynchronous and distributed, another instance may have driven the same run id to completion, so state can change underneath your feet.
- `#L290-L340` — The break condition: `latest.eventSequence > state.eventSequence` — the service fired new events, so exit the `while` and let the outer cycle continue.
- `#L340-L400` — Increments `check`, then introduces `await step.waitForEvent('wait-for-service-<cycle>-<check>')` as the pause point.
- `#L400-L450` — Event naming: `incident/updated` is an arbitrary name created by the harness, and the slash is the naming convention Inngest recommends.
- `#L450-L510` — The `if` filter: `async` is the handle to the received event's data, and the string is interpolated to `async.data.runId == "<this runId>"` so only this run's incident updates wake it.
- `#L510-L560` — Timeout semantics: `10s`, then move on regardless — "a setTimeout with a conditional of listening for an event", which is why plain `setTimeout` is unavailable here.
- `#L560-L630` — Compares with `step.sleep('10s')` then querying an event store: it can only look after the full sleep, so you lose the wake-up-in-2-seconds case; at 30 minutes that lag becomes a real problem.
- `#L630-L644` — Closes the inner loop with a `continue` on the outer cycle loop, then deletes the now-redundant `decision.action === 'request_help'` branch because it is handled above.
