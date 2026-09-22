---
source: 第34节：OryxOS 的分布式 vs When 的分布式
source_type: pdf
source_lines: 256
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第34节：OryxOS 的分布式 vs When 的分布式

## Overview (L1)

- Framing — Clustering is always multi-node coordination, but "how timely it must be" decides the route: OryxOS is offline/scheduling-type (tens of seconds of takeover latency is fine → DB-table coordination), while When is real-time online (deliver on time, no loss, takeover within 10s → brings in etcd leases/election/Watch).
- OryxOS recap — OryxOS is an Agent OS running a fleet of business Agents, many with scheduled tasks (daily reports, inspections, reconciliation); the cluster is essentially a distributed scheduler (like xxl-job) that must not miss tasks and must reassign them when a node dies.
- OryxOS implementation — Coordination via DB tables: nodes register with heartbeat timestamps, tasks carry next-trigger times, and dispatch uses row locks/CAS so a task runs exactly once cluster-wide; a stale heartbeat marks a node down and its tasks get claimed next cycle.
- Why DB, not etcd — Three engineering reasons: no need for timely switchover (offline scheduling tolerates re-runs), avoid a complex component (etcd needs a dedicated 3/5-node cluster to operate), and enterprises already have MySQL/PG to reuse.
- xxl-job lineage — A mature pattern: schedule center → database (task defs, next trigger, history) → executors; dispatch is "grab lock at time → execute → write back record", with DB transactions and row locks guaranteeing no misses or duplicates.
- When revisited — etcd coordination + sharded replicas + Redis fallback: request to any node → look up route/shard/Master → gRPC forward; each time wheel has Master/Slave, Master failure promotes Slave; etcd gives second-level discovery/election/Watch; Redis is the source of truth for zero-loss recovery.
- Comparison & selection — A dimension table (service nature, switchover timeliness, coordination style, dependencies, complexity/ops) and a three-question decision order: does failure need timely takeover, how strong must consistency be, and what is the ops budget/existing stack.
- Closing — There is no best architecture, only a matching one; OryxOS is simple-but-sufficient, When is heavy-but-reliable, and each matches its scenario.

## Sections (L2)

### framing
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#framing]]`
- Summary: States that clustering = multi-node coordination, and that the required timeliness determines the route; contrasts OryxOS (offline/scheduling, DB table coordination, simple) with When (real-time online, etcd leases/election/Watch, heavier).
- Key claims: Coordination mechanism has no best, only a match — whether the scenario needs "timeliness" directly decides DB vs etcd.
- Learner-relevant: The one-line thesis of the whole comparison.

### oryxos-recap
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#oryxos-recap]]`
- Summary: Positions OryxOS as an Agent OS running many business Agents, many with scheduled tasks; multi-node must spread Agents/tasks across nodes and reassign when a node dies.
- Key claims: This is offline/scheduling work — a task being taken over or re-run after tens of seconds is business-invisible; OryxOS cluster ≈ a distributed scheduler wanting "no missed tasks and someone takes over", not millisecond real-time.
- Learner-relevant: The scenario classification that justifies OryxOS's light design.

### oryxos-impl
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#oryxos-impl]]`
- Summary: DB-table coordination (xxl-job style, no etcd): node registration + heartbeat table, task table + next trigger time, scheduling lock via row lock/CAS over MySQL/PostgreSQL.
- Key claims: Dispatch relies on DB locking — nodes grab the same row lock at trigger time, only the winner executes, so a task runs once cluster-wide; a dead node's stale heartbeat marks it down and its tasks are claimed by another node next cycle.
- Learner-relevant: A concrete "storage layer as coordinator" design.

### why-db-not-etcd
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#why-db-not-etcd]]`
- Summary: Three reasons — no timely switchover needed, avoid a complex component (etcd requires a separate 3/5-node cluster and ops), and enterprises already have MySQL/PG.
- Key claims: This echoes lesson 33's selection judgment: choose by timeliness / consistency / ops cost, and for OryxOS's scenario the DB table is the "sufficient and cheapest" answer.
- Learner-relevant: Applies the lesson-33 heuristics to a concrete case.

### xxl-job-lineage
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#xxl-job-lineage]]`
- Summary: The mature "use the storage layer for coordination" pattern: schedule center → database (task definitions, next trigger, execution history) → executors.
- Key claims: All state lives in the DB — visible, queryable, recoverable; dispatch is "grab lock at time → winner executes → write back record" with transaction/row-lock guarantees; OryxOS borrows this, pursuing simple/reliable/visible over second-level real-time.
- Learner-relevant: Names the reference implementation behind the design.

### when-recap
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#when-recap]]`
- Summary: When's cluster thought: access + routing layer (any node → look up route/shard/Master → gRPC forward), shards each a time-wheel instance with Master/Slave on separate machines, etcd leases (second-level discovery) / Controller election / Watch, and Redis as the fallback source of truth.
- Key claims: It is deliberately heavy because When needs delivery-on-time, no loss, no duplication, and takeover within 10s; Redis lets a new Master backfill and lose nothing — a "timeliness" DB polling cannot deliver.
- Learner-relevant: Why When's distributed design is more complex.

### comparison-table
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#comparison-table]]`
- Summary: Same job (multi-node coordination), two lifestyles across dimensions: service nature (Agent scheduling/timed tasks vs delay-message real-time delivery), switchover timeliness (minute-level/re-run OK vs takeover within 10s, zero loss), coordination style (DB table + locking vs etcd lease/election/Watch), component dependency (reuse existing DB vs extra etcd cluster), complexity/ops (low vs high, trading for real-time reliability).
- Key claims: The table makes the trade-off explicit across every dimension.
- Learner-relevant: A reusable comparison scaffold for architecture decisions.

### how-to-choose
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#how-to-choose]]`
- Summary: One decision line: does it need timeliness and how high is the consistency requirement; asks three questions in order — timely takeover, consistency level, ops budget/existing components.
- Key claims: Don't adopt etcd "to look advanced"; the choice follows from the answers.
- Learner-relevant: The decision procedure to reuse on future systems.

### closing
- Locator: `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf#closing]]`
- Summary: Wraps up: the essence of clustering never changes (multi-node coordination), only the timeliness/consistency requirement changes; OryxOS first part ends and the course moves into implementing When's cluster piece by piece with Loop programming.
- Key claims: No best architecture, only one matching the scenario — that is the craft of distributed selection.
- Learner-relevant: Closes the OryxOS arc and opens the When implementation arc.

## Sources

- `[[sources/geek-ai-agent/20260922/第34节：OryxOS 的分布式 vs When 的分布式.pdf]]`
