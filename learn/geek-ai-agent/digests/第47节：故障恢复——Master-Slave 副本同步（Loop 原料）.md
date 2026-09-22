---
source: 第47节：故障恢复——Master-Slave 副本同步（Loop 原料）
source_type: pdf
source_lines: 316
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第47节：故障恢复——Master-Slave 副本同步（Loop 原料）

## Overview (L1)

- Purpose — give every time wheel a Slave on a different node, async-sync add/remove, promote the Slave within 10 seconds after Master failure, and rebuild missed state from Redis.
- Design rationale — the goal is fast failover (快速切换), not strong consistency; use Master/Slave two replicas instead of Raft/Paxos; replication is async and non-blocking; failover is three phases (detect → decide → execute); semantics are at-least-once, so downstream must be idempotent by `message_id`.
- Loop relation — the section is a module task spec fed to Loop: implement the replica synchronizer, failover executor, and out-of-sync rebuild; it also emits new HA contracts (`ReplicaSync`, time-wheel Master/Slave metadata) consumed by section 48.
- Dependencies — upstream: §44 time wheel, §41 `StoragePlugin.loadPendingByTimeWheel`, §42 ETCD wrapper `/when/timewheels`, §43 cluster awareness (Watch DELETE), §40 internal gRPC; downstream: §48 Controller, §53 integration.
- Functionality and contracts — `ReplicaSync.syncAdd/syncRemove/markOutOfSync/rebuildFromRedis`; `FailoverExecutor.promoteSlaveToMaster/assignNewSlave`; time-wheel metadata extended with `master/slave/status/sync_state`.
- Fields and acceptance — hard constraints: Master and Slave on different nodes; detection→new-Master-scheduling ≤ 10s; chaotic tests for no-loss, 10s switch, at-least-once, out-of-sync rebuild.
- Boundaries, Harness, deliverables — does not do Controller decisions (§48) or leader election (§43) or real HTTP/Kafka delivery (§49); code in `cluster/replica`; sync credentials from env vars.

## Sections (L2)

### 1-这一节做什么

- Locator: `[[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#1-这一节做什么]]`
- Summary: Defines the section's one-line goal — configure an off-node Slave per time wheel, take over within 10 seconds of Master failure, and recover unfinished messages from Redis.
- Key claims: §44 time wheel lives only in one node's memory; this section keeps a Slave copy elsewhere; Master async-syncs add/remove; Controller promotes an available Slave and the new Master loads from Redis before scheduling.
- Learner-relevant: Anchor for understanding why in-memory schedulers still need a persistence-backed replica.

### 2-为什么这么设计

- Locator: `[[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#2-为什么这么设计]]`
- Summary: Justifies fast-switch-over-strong-consistency, async replication, the three-phase failover, and at-least-once semantics.
- Key claims: Redis is the authoritative source, so replicas are only an acceleration layer (技术方案 §2.4/§6.2); synchronous replication would block writes and hurt throughput; failover = detect (Lease expiry + Watch DELETE) → decide (Controller updates metadata, promotes Slave, assigns a new Slave) → execute (new Master restores from Redis, starts scheduling) within 10s; if delivery succeeded but DELIVERED state was not yet written, a re-delivery can occur → at-least-once (技术方案 §6.6).
- Learner-relevant: Supports judgment about when to reach for Raft and when a simpler two-replica design suffices.

### 3–4-Loop 关系与依赖

- Locator: `[[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#4-依赖与被依赖]]`
- Summary: Maps the section as a Loop module task and lists upstream/downstream dependencies.
- Key claims: Loop implements the replica synchronizer, switch execution, and out-of-sync rebuild; inputs are sync policy, out-of-sync handling, the three phases, contracts, and metadata structure; boundaries exclude Controller decisions, leader election, and real HTTP/Kafka delivery.
- Learner-relevant: Shows how one module's output contract becomes another module's input (ReplicaSync metadata → Controller).

### 5–6-功能与接口契约

- Locator: `[[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#6-接口--契约设计本节新增-ha-契约]]`
- Summary: Describes replica sync behavior and the new HA contracts.
- Key claims: Master notifies Slave after each add/remove via internal gRPC, non-blocking; sync failure marks the time wheel `out-of-sync` in ETCD and triggers `loadByTimeWheel` full reload from Redis; interfaces `ReplicaSync` (syncAdd/syncRemove/markOutOfSync/rebuildFromRedis) and `FailoverExecutor` (promoteSlaveToMaster/assignNewSlave); metadata extends `/when/timewheels/{tw_id}` with `master/slave/status/sync_state`.
- Learner-relevant: Concrete SPI-style contract design usable as a template for any replica module.

### 7-字段与元数据定义

- Locator: `[[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#7-字段--元数据定义]]`
- Summary: Defines metadata fields and hard constraints.
- Key claims: `master`/`slave` node ids, `status` (running/switching/rebuilding), `sync_state` (in_sync/out_of_sync); Master and Slave must be on different nodes; switch target ≤ 10s from detecting DELETE to new Master scheduling.
- Learner-relevant: Hard constraint "replicas on different nodes" recurs in §48 rebalance.

### 8-验收标准与测试

- Locator: `[[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#8-验收标准--必须有的测试自动化验收]]`
- Summary: Functional acceptance plus required (chaotic) tests.
- Key claims: Slave reflects changes within sync latency; sync failure keeps Master working and marks out-of-sync; out-of-sync rebuilds from Redis; killing Master promotes Slave <10s with zero loss; no-loss test, 10s switch timing test, at-least-once test, out-of-sync rebuild test — run in CI and by humans (Loop cannot modify tests, §38).
- Learner-relevant: Model for writing failure-mode assertions instead of coverage targets.

### 9–11-边界、Harness 与交付物

- Locator: `[[sources/geek-ai-agent/20260922/第47节：故障恢复——Master-Slave 副本同步（Loop 原料）.pdf#9-边界本节不做什么]]`
- Summary: Scope exclusions, module-specific Harness, and deliverable list.
- Key claims: no Controller decision/rebalance, no leader election, no real HTTP/Kafka delivery; code in `cluster/replica`; sync must never block the Master write hot path; must restore from Redis before taking over scheduling; deliverables are ReplicaSync/FailoverExecutor implementations, metadata extension, and chaotic tests.
- Learner-relevant: Brings together boundary discipline + safety constraints for a distributed module.
