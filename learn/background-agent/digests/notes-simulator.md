---
source: sources/background-agent/20261105/notes/simulator.md
source_type: text
source_lines: 9
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - service.md#L1-L221
---

# L1 overview

- Supplied process — the checkout service is synthetic and outside the agent harness; it owns in-memory state, starts with a fresh instance ID, and exposes `GET /state`, `GET /logs`, `GET /changes`, `POST /operations` on port 3004.
- Fault selection — startup flags create healthy, broken feature rollout, faulty release, or dependency outage, and the harness never learns which flag produced the state.
- Event contract — bodies carry a stable event ID, `serviceId`, `instanceId`, type, and data; the operator API persists them and assigns them to the one active incident, duplicate IDs create no second incident, and a restart supersedes old runs and pending approvals.
- Operation contract — `disable_feature` and `rollback_release` mutate state under `expectedVersion` (stale writes rejected); every call carries an `actionId` whose result is stored and replayed on retry, while a reused ID with different arguments is rejected.
- Deliberate non-durability — `--lose-next-action-response` commits once then returns 503, and the in-memory outbox means a crash after a state change can lose the alert; production needs a transactional outbox and authenticated calls.

# L2 detail

- `#L1-L3` — Ownership and surface: synthetic in-memory service, new instance ID per start, four startup fault modes, alert emission to the operator API, and the four HTTP endpoints on port 3004.
- `#L4-L5` — Event body fields, operator API persistence and single-active-incident assignment, wake-then-read-`/state` behavior, duplicate-ID handling, and supersession of old runs/approvals on restart.
- `#L6-L7` — Operations API semantics: read-only log/change inspection, state-changing `disable_feature`/`rollback_release` with `expectedVersion` fences, per-`actionId` result ledger with replay and argument-mismatch rejection, and the `--lose-next-action-response` 503 demonstration.
- `#L8-L9` — Delivery retries only while the process lives, in-memory state/outbox limitations, the production outbox plus authentication note, and the pointer to the README for commands and flags.
