---
source: sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md
source_type: text
source_lines: 92
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
supplements:
  - server.md#L52-L339
  - server.md#L1072-L1086
  - service.md#L1-L221
---

# L1 overview

- The lost-acknowledgement gap — checkout commits the effect and the HTTP response disappears; a 503 does not mean failure, and retrying with a new identity duplicates charges, emails, or deployments.
- Idempotency at the effect owner — durable steps save results the workflow received, never results it never saw; the checkout service stores each `actionId` with its result, replays it on retry, and rejects a reused ID with different arguments.
- Derived intent key — replace `${runId}:${randomUUID()}` with `${runId}:${cycle}:${decision.action}`, so the checkpointed model choice reconstructs the same key on replay.
- Version fence — a mutating call carries the observed `expectedVersion` and checkout rejects stale writes at the same place it changes state; a harness-only recheck still leaves a race.
- Limits of cancellation and unknown outcome — `cancelOn: [{ event: 'agent/run.cancelled', match: 'data.runId' }]` stops future steps but not committed effects; when a provider has no idempotency key, persist the uncertainty and reconcile rather than guess.

# L2 detail

- `#L1-L5` — Header: start `lesson-5` → solution `lesson-6`; outcome that a stable action ID lets an uncertain tool call retry without repeating its effect.
- `#L6-L13` — The effect/acknowledgement failure window, why durable step results cannot cover a lost response, the service-side ledger keyed by `actionId` (rejects ID reuse with different arguments), deriving the ID from run + cycle + action, and what `--lose-next-action-response` demonstrates.
- `#L14-L20` — Second guard: `expectedVersion` rejected by checkout at the state change; approval narrowing authority plus harness re-observation; cancellation is not compensation; representing an "unknown outcome" state instead of prompting harder.
- `#L21-L30` — "See it in the lab" with `--fault feature --lose-next-action-response` (commit then 503, new ID per attempt on the start branch) and live-coding framing: stable ID derivation plus run-scoped cancellation in `server/agent-workflow.ts`.
- `#L31-L40` — Edit 1 diff: remove the `randomUUID` import from `node:crypto`.
- `#L41-L54` — Edit 2 diff: add `cancelOn: [{ event: 'agent/run.cancelled', match: 'data.runId' }]` to the `incidentAgent` options alongside `retries: 2` and the `concurrency` key.
- `#L55-L70` — Edit 3 diff: replace the attempt-local `${runId}:${randomUUID()}` with `const actionId = \`${runId}:${cycle}:${decision.action}\``.
- `#L71-L81` — Format/lint/typecheck gate; Verify that Activity shows a failed attempt and a retry with the same ID, the service returns the recorded result, Neon records the action, and the run completes; start branch instead gets a stale-version result; then the "break it" comparison of both branches.
- `#L82-L92` — Engineering challenge (design a persisted unknown-outcome state; what must be proven before retry or compensation; what cancellation can stop), catch-up to `lesson-6`, common mistake (the ID identifies one intent, not one HTTP attempt), and the optional payment/deployment idempotency-key mapping.
