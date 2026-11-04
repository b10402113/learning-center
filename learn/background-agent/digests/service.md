---
source: sources/background-agent/20261105/service
source_type: codebase
source_lines: 221
language: typescript
file_count: 1
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- service/checkout.ts — A deliberately breakable Express "checkout" service on 127.0.0.1:3004 that stands in for the changing world the agent observes and acts on. It boots in one of four fault modes (`none`, `feature`, `release`, `dependency`), emits alerts to the operator API over HTTP, and holds all state in process memory (arrays, Maps, a version counter) so each restart is a new service instance. It is the counterparty that makes the workshop's durable-execution lessons real: version-fenced writes, idempotent action IDs, and a switch to simulate a lost acknowledgement.

# L2 detail

- `#L1-L221` — service/checkout.ts — no exports; the module is a script that configures CLI flags and starts a server. (a) **State creation:** the single `ServiceState` object `state` is created at module load on L39-L48 (health/release/featureEnabled/upstreamHealthy, seeded from the fault flag), alongside the mutable in-memory collections `logs` (L50), `changes` (L51), `outcomes` (L52) and `pendingEvents` (L53-L56); nothing is persisted, so all of it dies with the process. (b) **Instance identity:** `const instanceId = randomUUID()` is minted once at L36 and surfaced by `/health` (L117) and `/state` (L119) — a restart yields a new `instanceId`, which is why a stale incident must not be silently reused. (c) **Four fault modes:** the `Fault` type is `'none' | 'feature' | 'release' | 'dependency'` (L5), parsed from `--fault` with zod at L19-L21, described in `faultLog` at L59-L64, and folded into the initial state at L42-L47 (`release` ⇒ `v2-bad`, `feature` ⇒ `featureEnabled: true`, `dependency` ⇒ `upstreamHealthy: false`). (d) **Alerts and the stable event ID:** `emit()` at L95-L99 mints the event's own `id: randomUUID()` and stores the whole event in `pendingEvents` keyed by that ID; `deliverEvents()` (L73-L93) POSTs to the operator API at `http://127.0.0.1:3001/api/service/events` and deletes the entry only on `response.ok` (L84-L85), keeping the same ID for every retry — this is the stable event ID the agent keys incidents on. `health.alert` events are emitted from inside the `app.listen` callback at L200-L214 (`alertNumber` 1..n spaced by `--interval-ms`), `service.started` at L199, and `health.recovered` from `recover()` at L101-L108. (e) **Where `POST /operations` mutates state:** the handler at L123-L181 is the only write path — `disable_feature` sets `state.featureEnabled = false` (L153-L159) and `rollback_release` sets `state.release = 'v1-stable'` (L161-L167), each recording a change and either triggering `recover()` + `version++` when it matches the active fault, or just `version++` otherwise; the `expectedVersion` precondition returns `{ stale: true, currentVersion }` at L138-L143 (the version fence). (f) **Where action IDs are remembered:** `outcomes` (L52) is written at L170 with a fingerprint of `{name, expectedVersion}` (L131), and a retried `actionId` is answered from that map at L132-L137 — same ID + same fingerprint replays the recorded result, same ID + different arguments gets a 409. Together with `--lose-next-action-response` (L34, L171-L179, which commits the effect then returns 503) this is the exact mechanism that lets learners make Inngest retries safe by deriving a stable ID. Read-only surfaces for the model: `GET /health` (L116), `GET /state` (L119), `GET /logs` (L120), `GET /changes` (L121), all trimmed to the last 20/12 entries.
