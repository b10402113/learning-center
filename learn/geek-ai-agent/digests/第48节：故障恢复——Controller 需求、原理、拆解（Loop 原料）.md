---
source: 第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）
source_type: pdf
source_lines: 335
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）

## Overview (L1)

- Purpose — implement the Controller: an event-driven cluster role that decides when to fail over, which Slave to promote, and how to redistribute time-wheel replicas (rebalance).
- Design rationale — a single decision-maker prevents conflicting assignments; Controller is a role held by an ordinary node (not a dedicated process); event-driven (node join/leave, Master failure, out-of-sync, periodic 5-min load check); rebalance prefers moving Slaves, migrates gradually, and does not chase perfect balance (±1 is fine).
- Loop relation — module task spec for Loop: implement the Controller event loop + rebalance algorithm + failover decisions; emits a Controller decision interface consumed by §47 executor, §45 routing, §53 integration, and §51 admin console.
- Dependencies — upstream: §43 Controller election/membership Watch, §47 `FailoverExecutor` and time-wheel metadata, §42 ETCD wrapper; downstream: §47 executor (executes decisions), §45 routing (tw→node map), §53.
- Functionality and contracts — `Controller` interface (onControllerElected/onNodeJoin/onNodeLeave/onOutOfSync/periodicRebalanceCheck/createTimeWheel) and pure `RebalancePlanner.plan(state)` emitting `MoveAction`s.
- Fields and acceptance — data stored in `/when/timewheels/{tw_id}` and `/when/config/*`; every decision is an idempotent, replayable ETCD metadata update; acceptance covers rebalance, failover decision, Controller-switch continuity.
- Boundaries, Harness, deliverables — does not execute (delegates to §47), does not elect itself (§43), does not route messages (§45); code in `cluster/controller`, decisions are pure computation.

## Sections (L2)

### 1-这一节做什么

- Locator: `[[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#1-这一节做什么]]`
- Summary: One-line goal — implement Controller event handling, failover decisions, and time-wheel replica assignment.
- Key claims: Controller is a cluster role taken by a normal When node, elected via §43; it only produces switch/assignment decisions while restoration, scheduling, and rebuild are executed by §47.
- Learner-relevant: Anchor for separating "decide" from "execute" in distributed control planes.

### 2-为什么这么设计

- Locator: `[[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#2-为什么这么设计]]`
- Summary: Justifies a single decision-maker, event-driven I/O, and the rebalance algorithm.
- Key claims: replica distribution must be computed by one decision-maker to avoid conflicting writes (技术方案 §3.1); inputs are events (node join, node leave, Master failure, out-of-sync, periodic load check), outputs are decisions (promote Slave, reassign replicas, update ETCD); rebalance rules — exactly 1 Master + 1 Slave per wheel on different nodes, prefer migrating Slave, gradual migration, ±1 tolerance (技术方案 §7.3); assigning which Slave to promote is a decision, ownership of "how to promote" is §47's execution.
- Learner-relevant: Distinguishes decision plane vs execution plane and motivates event-driven control.

### 3–4-Loop 关系与依赖

- Locator: `[[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#4-依赖与被依赖]]`
- Summary: Maps the section as a Loop task spec and its dependency edges.
- Key claims: Loop implements the Controller event loop, rebalance algorithm, and failover decisions; upstream §43 (election + membership Watch), §47 (executor + metadata), §42 (ETCD); downstream §47 executor, §45 routing, §53 integration, §51 admin "create time wheel".
- Learner-relevant: Shows decision outputs becoming authoritative metadata consumed cluster-wide.

### 5–6-功能与接口契约

- Locator: `[[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#5-功能与交互]]`
- Summary: Event loop behavior and the new decision interfaces.
- Key claims: after election, load cluster state then Watch and handle events — node join (rebalance), node leave/Master failure (promote Slave + assign new Slave), out-of-sync (trigger rebuild), periodic check (default 5 min), create-time-wheel request; `Controller` interface and `RebalancePlanner.plan` with pseudocode (target = total_replicas / node_count; migrate from overloaded to underloaded, prefer Slave).
- Learner-relevant: Concrete event-driven Controller contract and rebalance pseudocode.

### 7-字段与要存的数据

- Locator: `[[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#7-字段--要存的数据]]`
- Summary: Where Controller state lives and the replayability convention.
- Key claims: time-wheel distribution in `/when/timewheels/{tw_id}` (authoritative), cluster config in `/when/config/*` (replica count, wheel count, rebalance threshold), in-memory cluster state view; every decision lands as an ETCD metadata update so decisions are idempotent and replayable; Master/Slave异节点 is a hard constraint for rebalance/create/switch.
- Learner-relevant: Idempotent, replayable decisions as a pattern for controller failover.

### 8-验收标准与测试

- Locator: `[[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#8-验收标准--必须有的测试自动化验收]]`
- Summary: Functional acceptance and required tests.
- Key claims: node join triggers rebalance toward ±1; node leave promotes Slave and adds a new Slave (end-to-end <10s with §47); rebalance prefers Slave; all wheels keep 1M+1S on different nodes; Controller crash → new Controller resumes without duplicate/missed decisions; admin create-time-wheel assigns M/S; tests cover rebalance unit, failover decision, Controller-switch continuity (idempotent replay).
- Learner-relevant: Controller handover continuity as a testable, replay-based property.

### 9–11-边界、Harness 与交付物

- Locator: `[[sources/geek-ai-agent/20260922/第48节：故障恢复——Controller 需求、原理、拆解（Loop 原料）.pdf#9-边界本节不做什么]]`
- Summary: Scope exclusions, Harness constraints, and deliverables.
- Key claims: no execution (call §47), no self-election (§43), no message routing itself (§45); code in `cluster/controller`, decisions pure (`RebalancePlanner` side-effect-free), only the elected node runs Controller logic; hard constraint — every decision must be an idempotent ETCD update honoring 1M+1S/异节点; deliverables are the event loop, RebalancePlanner, failover + create-wheel logic, and unit/continuity tests.
- Learner-relevant: Reinforces purity + idempotency as controller design discipline.
