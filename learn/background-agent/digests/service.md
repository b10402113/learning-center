---
source: sources/background-agent/20261109/supplement/service
source_type: codebase
source_lines: 221
language: ts
file_count: 1
status: absorbed
absorbed_at: 2026-11-09
created: 2026-11-09
updated: 2026-11-09
---

# L1 overview

- `checkout.ts` — Express simulator of a checkout microservice for the durable background agent course. Models four fault modes (`none`, `feature`, `release`, `dependency`), exposing `/health`, `/state`, `/logs`, `/changes`, and an idempotent `/operations` endpoint (`inspect_logs`, `inspect_changes`, `disable_feature`, `rollback_release`) guarded by `actionId` replay cache, argument fingerprint, and `expectedVersion` optimistic concurrency. Emits durable events (`service.started`, `health.alert`, `health.recovered`) to the operator API with retry and a `--lose-next-action-response` flag to simulate lost acknowledgements.

# L2 detail

- `#L1-L221` — `sources/background-agent/20261109/supplement/service/checkout.ts` — Checkout fault-injection service. Key exports/concepts: `Fault` union, `ServiceState` (health/errorRate, release, featureEnabled, upstreamHealthy), `--fault`/`--alerts`/`--interval-ms`/`--recover-after-ms`/`--lose-next-action-response` flags validated with zod; `deliverEvents`/`emit` pending-event retry loop to `http://127.0.0.1:3001/api/service/events` keeping the same event ID; `/operations` idempotency (replay returns prior result, mismatched args → 409, stale `expectedVersion` → `{ stale: true }`), operation commit followed by an optional simulated 503 lost acknowledgement; `recover()` bumps `version` and emits `health.recovered`; dependency faults auto-recover after `recoverAfterMs`. Learner-relevant: idempotent actions, durable event delivery, optimistic concurrency, and exactly-once-vs-at-least-once acknowledgement failure handling.
