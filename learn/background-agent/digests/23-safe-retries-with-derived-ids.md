---
source: sources/background-agent/20261109/course/23-safe-retries-with-derived-ids.txt
source_type: text
source_lines: 79
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- Safe retries need idempotency — an uncertain tool call may only retry safely if repeating it cannot repeat its effect, so every action carries a stable idempotency key.
- Split side effects across steps — each async side effect gets its own step so retries are scoped, and each step's code must tolerate being run again after a partial failure.
- Deterministic action IDs — replace the random UUID with an ID derived from run ID plus cycle plus the chosen action, and add a cancel rule so two runs can never share one run ID.

# L2 detail

- `#L1-L12` — announces the idempotency outcome (a stable action ID lets an uncertain tool call retry without repeating its effect) and points to AWS and Inngest idempotency guides.
- `#L13-L16` — do not pack multiple async side effects into one step, because then you must build a transaction inside it; separate steps get separate retries for free.
- `#L17-L32` — a step with several effects reruns all of them after one fails, so the step's code must skip work already done instead of erroring on "already exists".
- `#L33-L48` — Stripe-style idempotency keys are the same idea as action IDs; the random UUID approach is abandoned in favour of Inngest's built-in handling.
- `#L49-L64` — pass `cancelOn` for the `agent run canceled` event matched on `data.runId`, so a second run with the same ID never starts, avoiding shared state and race conditions.
- `#L65-L79` — make the action ID deterministic by deriving it from run ID + cycle + action, so the same combination always yields the same ID and duplicate work can be detected.
