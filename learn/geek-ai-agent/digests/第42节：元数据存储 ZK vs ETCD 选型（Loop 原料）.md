---
source: 第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）
source_type: pdf
source_lines: 305
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）

## Overview (L1)

- What this section does (这一节做什么) — Handles cluster metadata (node list, Controller, time-wheel replica distribution), compares ZooKeeper / etcd / Consul, selects etcd, and defines the unified etcd key space and data structures used by later cluster modules (§43/47/48).
- Why designed this way (为什么这么设计) — etcd wins as the cloud-native de-facto standard (K8s core) with a simple Put/Get/Watch/Lease API, light clients, built-in Raft strong consistency, and lightest operational burden; metadata is stored separately from message data (small/strong-consistency metadata in etcd, massive short-lived fast data in Redis); Lease + Watch naturally support registration and failover.
- Relation to Loop (它和 Loop 的关系) — A contract + selection-heavy module spec: Loop builds the etcd client wrapper and metadata key-space read/write; §43 then implements registration/leader-election/awareness on top. Inputs §5/§6/§7; acceptance §8; boundary §9.
- Dependencies & dependents (依赖与被依赖) — Upstream: §39 common Harness and etcd as an external deployment-provided dependency. Downstream: §43 and later cluster/HA sections consume the key space, metadata structures, and client wrapper.
- Features & interactions (功能与交互) — Stores four metadata classes: node registration (with Lease), Controller (with Lease), time-wheel metadata (persistent Master/Slave + status), and cluster config (persistent, dynamic). The client wrapper offers putWithLease/keepAlive, get/getPrefix, watch, and txnPutIfAbsent.
- Interface / contract & key space (接口/契约设计) — etcd key space `/when/nodes/{node_id}`, `/when/controller`, `/when/timewheels/{tw_id}`, `/when/config/*` with three design principles (clear hierarchy for prefix Watch, small keys only, distinct lifecycles).
- Field / key definitions & heartbeat convention (字段/key定义) — key/content/lifecycle table; node Lease TTL = 6s, heartbeat renewal = 2s (reserving recovery time within the 10s switch budget), renewal must use an independent thread + connection.
- Acceptance criteria + required tests (验收标准+必须有的测试) — Wrapper Put/Get/GetPrefix/Watch/Lease/Txn work against real etcd; leases auto-expire after renewal stops; keepAlive sustains; watch receives PUT/DELETE; txnPutIfAbsent fails when the key exists; Testcontainers etcd integration + key-space convention tests.
- Boundaries & section-specific Harness (边界+专属Harness) — No registration flow, Controller election, or fault awareness (that is §43); no time-wheel rebalance/replica switch (week 8); no etcd HA (deployment's job, 3 nodes tolerate 1 failure). Harness pins cluster/etcd package, single entry point, `/when/` prefix constants, env-var endpoints/credentials, and jetcd + when-common only.
- Deliverables (交付物清单) — etcd client wrapper, key-space constants/utilities, metadata structure definitions, and Testcontainers etcd integration tests for Lease/Watch/Txn.

## Sections (L2)

### what-this-section-does

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#what-this-section-does]]`
- Summary: States the goal — choose a cluster metadata store and define unified keys and field structures.
- Key claims: delayed messages and indexes live in Redis, while cluster metadata (node list, Controller, time-wheel Master/Slave distribution) is small but demands consistency and change notification; the section compares ZooKeeper, etcd, and Consul, chooses etcd, and defines the fields and keys to store.
- Learner-relevant: Introduces the metadata vs data split (small strongly-consistent vs massive fast) that shapes cluster architecture.

### why-designed-this-way

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#why-designed-this-way]]`
- Summary: Compares the three coordinators and justifies etcd, the metadata/data split, and the need for Lease and Watch.
- Key claims: ZooKeeper is mature with a full ecosystem (Kafka/Pulsar use it) but has a low-level API, complex clients, and heavy operational burden; etcd is the cloud-native de-facto standard (K8s core) with Put/Get/Watch/Lease, light clients, built-in Raft strong consistency, and is already present wherever K8s runs; Consul is strong at service discovery but less direct for distributed-coordination semantics; all three can do coordination, but etcd's primitives fit this project directly; When uses an independent or platform-provided business etcd cluster and does not connect to the Kubernetes control-plane etcd; message data (massive, short-lived, speed-only) goes to Redis while metadata (small, strong-consistency, liveness) goes to etcd; Lease sets a key's validity period and auto-deletes when the node stops renewing, and Watch subscribes to key or prefix changes — §43 uses both for registration, liveness detection, Controller election, and membership change notification.
- Learner-relevant: A worked selection-analysis exercise (capability fit + operational burden) that generalizes to any infrastructure choice.

### relation-to-loop

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#relation-to-loop]]`
- Summary: Describes the Loop spec focus for a contract-and-selection section.
- Key claims: the section is a contract + selection explanation given to Loop; Loop builds the etcd client wrapper and metadata key-space read/write, and §43 implements registration/leader-election/awareness on top; explicit inputs are what metadata to store (§5) and the etcd key space/structures (§6/§7); automated acceptance (§8) covers key-space read/write, lease expiry auto-delete, and Watch events; boundary (§9) limits it to selection + metadata contract + etcd client wrapper and excludes registration/election flows.
- Learner-relevant: Shows a spec whose deliverable is a contract and wrapper rather than an end-user feature.

### dependencies

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#dependencies]]`
- Summary: Maps upstream/downstream dependencies of the metadata contract.
- Key claims: upstream is §39 common Harness (security constraints, layering) and etcd as an external deployment-provided dependency (not self-built); downstream etcd key space (`/when/nodes`, `/when/controller`, `/when/timewheels`, `/when/config`) and metadata structures (node info, time-wheel metadata) are consumed by §43 for registration, leader election, and Watch; the etcd client wrapper (Put/Get/Watch/Lease) is consumed by §43 and the later HA section; §43/47/48 must not redefine the same metadata types; there is a single unified entry point for connecting to etcd.
- Learner-relevant: Reinforces "define the contract once, consume it everywhere" to avoid divergent metadata writes.

### features-and-interactions

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#features-and-interactions]]`
- Summary: Describes the four metadata classes and the etcd client wrapper API.
- Key claims: node registration stores one record per online node with ip/port/load and a Lease so it auto-disappears on crash; Controller stores which node is current, with a Lease; time-wheel metadata stores each wheel's Master/Slave distribution and status, persistent; cluster config stores replica count and wheel count, persistent and dynamically adjustable; the wrapper offers putWithLease(key,value,ttl)/keepAlive(lease) for registration + heartbeat, get/getPrefix for reading, watch(prefix,handler) for PUT/DELETE subscription, and txnPutIfAbsent for atomic creation used by leader election.
- Learner-relevant: Teaches the etcd primitive set (Lease/Watch/Txn) as building blocks for coordination.

### interface-and-key-space

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#interface-and-key-space]]`
- Summary: Presents the etcd key space and three design principles that all cluster modules must follow.
- Key claims: `/when/nodes/{node_id}` holds node registration info with a Lease (diagram shows 10s TTL here) so crashes auto-clear; `/when/controller` holds the current Controller node ID with a Lease used for leader election and fault awareness; `/when/timewheels/{tw_id}` persistently holds Master/Slave distribution and status; `/when/config/*` persistently holds cluster config such as replica count and wheel count; three principles are clear hierarchy per class for prefix Watch, small-key priority (each value within a few hundred bytes, no large objects in etcd), and distinct lifecycles (nodes/controller leased and auto-cleared; timewheels/config persistent and manually updated on demand).
- Learner-relevant: A reusable key-space design methodology (hierarchy + small values + lifecycle separation).

### field-and-key-definitions

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#field-and-key-definitions]]`
- Summary: Tables keys, contents, and lifecycles, and states the heartbeat convention.
- Key claims: `/when/nodes/{node_id}` content is `{ip, port, start_time, load}` with a Lease (TTL 6s) and auto-delete when renewal stops; `/when/controller` holds the current Controller node_id with a Lease that disappears when the Controller dies; `/when/timewheels/{tw_id}` holds `{master, slave, status}` persistently; `/when/config/*` holds replica_count, timewheel_count, etc. persistently and dynamically; the heartbeat convention is node Lease TTL = 6s with renewal interval = 2s (reserving recovery time within the 10s total switch budget, ultimately validated by chaos tests); renewal must use an independent thread and independent etcd connection, not shared with business threads, to avoid GC/busyness causing false liveness judgements.
- Learner-relevant: Concrete TTL/heartbeat numbers plus the "independent thread/connection" lesson for reliable heartbeats.

### acceptance-and-tests

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#acceptance-and-tests]]`
- Summary: Lists automatable acceptance checks and mandatory tests.
- Key claims: wrapper Put/Get/GetPrefix/Watch/Lease/Txn all work against real etcd; a key written via putWithLease disappears within TTL after renewal stops; keepAlive sustains the key; watch(prefix) receives PUT/DELETE events under that prefix; txnPutIfAbsent does not overwrite and returns failure when the key exists (laying groundwork for leader election); mandatory tests are Testcontainers etcd integration tests for lease auto-expiry, watch events, and Txn atomicity, plus key-space convention tests verifying read/write and structure of the four prefix classes.
- Learner-relevant: Shows how to verify lease/watch/txn semantics with real infrastructure rather than mocks.

### boundaries-and-harness

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#boundaries-and-harness]]`
- Summary: Defines non-goals and the incremental Harness constraints.
- Key claims: does not implement node registration flow, Controller election, or fault awareness (§43 only provides the mechanism wrapper and key convention); does not implement time-wheel rebalance or Master/Slave replica switching (week 8); does not handle etcd's own HA (deployment guarantees 3 nodes tolerate 1 failure); only does selection conclusion + metadata key-space contract + etcd client wrapper + tests; stop condition is usable wrapper, landed key convention, and all Lease/Watch/Txn acceptance passing; Harness puts it in the cluster/etcd package as the cluster side's only etcd entry point, centralizes key concatenation with the `/when/` prefix, reads endpoints/credentials from env vars, writes no sensitive credentials into node metadata, and depends only on when-common and the official jetcd client with Testcontainers etcd for tests.
- Learner-relevant: Teaches building a single controlled entry point for an external dependency and enforcing it via Harness.

### deliverables

- Locator: `[[sources/geek-ai-agent/20260922/第42节：元数据存储 ZK vs ETCD 选型（Loop 原料）.pdf#deliverables]]`
- Summary: Lists the artifacts expected at section end.
- Key claims: etcd client wrapper (Put/Get/GetPrefix/Watch/Lease/KeepAlive/Txn); key-space constants/utilities for `/when/nodes`, `/when/controller`, `/when/timewheels`, `/when/config`; metadata structure definitions (node info, time-wheel metadata); Testcontainers etcd integration tests for Lease/Watch/Txn; sections 4–11 are the module's Loop input spec; §43 then implements how nodes join, stay alive, elect a Controller, and detect up/down.
- Learner-relevant: Checklist-style DoD for the metadata-contract milestone.

