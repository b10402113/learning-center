---
source: sources/background-agent/20261109/course/10-durable-execution.txt
source_type: text
source_lines: 49
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Why one step is not durable — When the whole loop is a single step, any resume replays everything from the start, so the work must be split into individually memoized steps.
- Deterministic workflow, idempotent steps — Code in the workflow function must be deterministic so replay reaches the same decisions, while each step must tolerate being called twice without repeating its side effect.
- Idempotency in practice — Stripe's idempotency keys illustrate returning the same success without charging twice; steps should behave the same way on replay.
- Retry control — Inngest lets retry policy be configured at the workflow or step level.
- Resume is memoization — Durable execution is not JavaScript stack replay; it records step results and skips steps that already have recorded output, relying on deterministic ordering.

# L2 detail

- `#L1-L6` — Frames the current single-step agent: resuming it means redoing the entire loop, so the work must be broken into separate steps.
- `#L7-L14` — Gives the failure example (inspect logs, call model, disable feature, server dies) and the goal of resuming at the next unfinished step without losing information.
- `#L15-L23` — States that workflow code must be deterministic because replay depends on it; time- or random-based branching breaks replay, and tools may check or error.
- `#L24-L27` — Rules out randomness in the high-level workflow and introduces step idempotency.
- `#L28-L36` — Explains idempotency with Stripe idempotency keys: repeated calls return 200 without repeating the mutation, avoiding double charges.
- `#L37-L40` — Answers the API-failure question: retry policy is configurable per workflow or per step.
- `#L41-L49` — Clarifies that resume is memoization of step results replayed in guaranteed order, not replay of the JavaScript execution stack.
