---
source: sources/background-agent/20261109/course/18-waiting-loop.txt
source_type: text
source_lines: 95
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Building the wait loop — introduce a `check` counter and a `while (true)` loop that each iteration reads the event sequence and the current run, calling each iteration a "check".
- Re-validating distributed state — before each step, confirm the run is still valid (not completed/failed/canceled/escalated/superseded), since asynchronous distributed work can change state underneath you.
- Waiting on a new event — when the latest event sequence exceeds the stored one, increment `check` and call `step.waitForEvent` for `incident/updated` filtered by matching `runId`, with a 10-second timeout.
- waitForEvent vs. sleep — a `step.sleep` plus querying an event store only checks after the full delay, while `waitForEvent` resumes as soon as the matching event arrives; the difference matters at longer waits like 30 minutes.
- Cleanup — the now-redundant `request help` decision action branch below is removed because it is handled above; TypeScript narrows the types.

# L2 detail

- `#L1-L8` — No single right way; introduce `let check = 0` as the variable tracking whether we can keep going.
- `#L9-L17` — `while (true)` as the first example; each iteration awaits `step.run` to read the event sequence, tracking both the cycle and check cursors.
- `#L18-L23` — Fetch the current run by ID, then copy the earlier guard that ignores runs already completed, failed, canceled, escalated, or superseded.
- `#L24-L31` — Why the guard matters in distributed async execution: state can change under you, so validate before each step or expect bugs.
- `#L32-L38` — If `latest.eventSequence` (events fired by the service) is greater than `state.eventSequence`, stop/exit the wait and increment `check`.
- `#L39-L44` — Rationale for hard-coding a wait in the harness: many events are arriving, so pause to see what happens next; begin `step.waitForEvent`.
- `#L45-L51` — The `waitForEvent` object names the event `incident/updated`; the slash is a recommended naming convention.
- `#L52-L61` — The string filter is interpreted as JavaScript with `async` as the received event handle; match `async.data.runId` to this run ID.
- `#L62-L68` — Set a 10-second timeout; either the matching event arrives or 10 seconds pass, then move on.
- `#L69-L78` — Compare with `step.sleep` plus an event-store query: that only checks after the full delay, so waitForEvent is the better optimization for long waits.
- `#L79-L87` — Continue the outer loop; double-check the code, then remove the now-redundant `request help` branch below.
- `#L88-L95` — TypeScript flags the no-overlap removal, with commentary on appreciating typed code while not wanting to author it.
