---
source: sources/background-agent/20261109/course/13-generate-a-decision.txt
source_type: text
source_lines: 117
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Decision must be a step — the LLM call that picks the next action depends on current state and is nondeterministic, so it belongs inside `step.run` rather than the top-level workflow.
- Determinism model — a step is like `useMemo`: on replay the recorded result is hydrated instead of recomputed, while all non-step code re-executes every time.
- Iteration and decision recording — set the iteration count and record the decision as separate memoized steps, and understand when two writes could be batched.
- Inngest vs. database — Inngest only memoizes a step's return value; the application still needs its own persisted state for the decision to function.

# L2 detail

- `#L1-L6` — Poses the question of whether the decision needs a step; Scott concludes no, because the decision depends on live state.
- `#L7-L12` — Crash before the decision point: replay simply re-runs the workflow and reaches the same spot, which is the desired outcome.
- `#L13-L28` — Crash after the decision point: replay re-runs all non-step code and re-initializes the loop, then hydrates previously recorded step values.
- `#L29-L46` — If the LLM call is not in a step it fires on every replay; argues that costs money, adds latency, and breaks determinism.
- `#L47-L53` — Non-deterministic LLM output would feed different inputs into later cached steps, so replay may no longer reproduce the original run.
- `#L54-L65` — Explains a step as a `useMemo`: memoized values persist across re-executions while everything outside gets re-evaluated with no custom dependency logic.
- `#L66-L70` — Wraps the decision in `step.run('choose-action', ...)` passing the run goal and state.
- `#L71-L76` — Adds a memoized `set-iteration` step so the iteration number stays stable across replays.
- `#L77-L97` — Discusses recording the decision as its own step and when iteration + decision could be batched into one step given the same-value retry cost.
- `#L98-L111` — Separates Inngest memoization (only the step's return value, like a Redis cache) from application state that must still live in the database.
- `#L112-L117` — Implements the `record-decision` step with environment ID, run ID, cycle, action, and reason.
