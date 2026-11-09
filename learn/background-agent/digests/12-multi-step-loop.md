---
source: sources/background-agent/20261109/course/12-multi-step-loop.txt
source_type: text
source_lines: 145
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Loop moves into the workflow — The old in-step loop is deleted and rebuilt as a bounded deterministic loop inside the Inngest function, with run validation before each turn.
- Entry and per-turn guards — The run must be valid and not terminal, its instance ID must match the event, and the terminal-status check repeats at the top of every cycle.
- Checkpoint decisions — `getRun` and the goal-satisfaction check stay uncached; `observeState`, `writeReport`, and `completeRun` become memoized steps, with cycle numbers in step names.
- Step design heuristic — Asynchronous work usually belongs in its own single-purpose step, unless repeating the whole batch on retry is harmless.
- Transferable concept — Temporal activities, Vercel workflow steps, and Cloudflare's equivalent share the same workflow/step model and the same determinism/idempotency rules.

# L2 detail

- `#L1-L8` — Deletes the old in-step loop while keeping code at the bottom, planning to migrate then remove it.
- `#L9-L17` — Fetches the run by run ID and introduces the run lifecycle states (completed, failed, canceled, escalated, superseded).
- `#L18-L29` — Requires the run's instance ID to match `event.data` and returns early on terminal status or mismatch.
- `#L30-L41` — Moves the loop into the deterministic workflow with a fixed bound (24 cycles) and explains why random-terminated loops are rejected.
- `#L42-L55` — Frames the checkpoint question, then fetches the current run outside any step so it is never memoized.
- `#L56-L67` — Rechecks run status at the top of every loop so a run completed mid-flight stops before the next turn.
- `#L68-L84` — Checks goal satisfaction, then wraps state observation in `step.run("observe state " + cycle)` so it is memoized.
- `#L85-L104` — Keeps the goal check uncached and gives the heuristic: async work goes in a step, one thing per step unless batch retry is safe.
- `#L105-L114` — Moves report writing into a named step that returns the report value.
- `#L115-L122` — Moves `completeRun` into a step, then returns the report to end the cycle.
- `#L123-L130` — Restates the reasoning process for what deserves a step and warns against several async operations in one step.
- `#L131-L145` — Maps the concepts to Temporal activities, Vercel workflow steps, and Cloudflare, stressing identical rules across durable execution tools.
