---
source: 第43节：节点集群——注册、组集群、切换（Loop 原料）
source_type: pdf
source_lines: 319
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第43节：节点集群——注册、组集群、切换（Loop 原料）

## Overview (L1)

- What this section does (这一节做什么) — Builds on §42's etcd metadata contract to implement node registration, Lease renewal, Controller election, and membership-change notification, letting multiple When nodes form a cluster and sense membership changes in real time. Scope stops at "sense + record"; actual time-wheel Master/Slave switching and rebalance belong to §47/48 (week 8).
- Why designed this way (为什么这么设计) — Registration binds to a 6s Lease so a stopped node auto-deletes and is detected as offline; heartbeat uses an independent thread and connection so business load cannot delay renewal and falsely evict a node; election uses an atomic Txn ("if /when/controller absent, put current node_id") so exactly one node wins; awareness uses Watch events instead of active pings — turning probing into event-driven notification.
- Relation to Loop (它和 Loop 的关系) — Executable module spec: Loop implements node lifecycle (register/heartbeat/exit) + Controller election + member Watch; inputs §5 flows and §7 data structures; acceptance §8; boundary §9 stops at "sense + record".
- Dependencies & dependents (依赖与被依赖) — Upstream: §42 etcd client wrapper (Put/Get/Watch/Lease/Txn) and key conventions (`/when/nodes`, `/when/controller`), plus §39 `ClusterView`, `NodeEndpoint`, and common Harness. Downstream: every node startup path uses registration/keepalive; §47/48 consume Controller role and membership up/down events; §45/46 use `EtcdClusterView` for routing and assembly.
- Features & interactions (功能与交互) — Node startup → PutWithLease(/when/nodes/{id}, info, 6s) → independent thread renews every 2s; crash stops renewal → Lease expires → key auto-deletes within the 10s acceptance window. Election via `txnPutIfAbsent`; new Controller loads cluster state first; Controller Watches `/when/nodes/` for PUT (join) / DELETE (leave); all nodes Watch `/when/timewheels/` and cache `{tw_id → master node_id → NodeEndpoint}` in `EtcdClusterView`.
- Interface / contract design (接口/契约设计) — Adds `ClusterMembership` (registerSelf, deregisterSelf, tryBecomeController, watchMembers, listNodes, currentController) and implements §39's `ClusterView`; `masterOf(twId)` returns only a Master that both has time-wheel metadata and is online, else empty (and §45 must error, never pick another node).
- Field / data structure definitions (字段/数据结构定义) — Node info at `/when/nodes/{node_id}` = `{node_id, ip, grpc_port, start_time, load}` (Lease 6s); Controller at `/when/controller` (Lease 6s); time-wheel distribution at `/when/timewheels/{tw_id}` = `{master, status, epoch}` (persistent, may be statically preset on first run); member event = `{type: PUT/DELETE, node_id, nodeInfo?}` (transient, pushed by Watch).
- Acceptance criteria + required tests (验收标准+必须有的测试) — Node appears and stays online; killed node's key disappears within 10s; three nodes elect exactly one Controller; Controller failover re-elects within TTL; Watch receives join/leave events; active exit (DELETE) and crash (Lease expiry) are sensed identically; all nodes agree on `masterOf(twId)` and return empty after Master goes offline. Tests include multi-node integration, concurrent election uniqueness, false-eviction protection, and cluster-view tests.
- Boundaries & section-specific Harness (边界+专属Harness) — No time-wheel switching/rebalance/replica sync (§47/48), no routing/scheduling/storage (44/45/41); only registration + heartbeat + active exit + election + Watch + read-only cluster view, no dynamic allocation decisions. Harness pins `cluster/membership` and `cluster/view` packages, access to etcd only via the §42 wrapper (heartbeat's independent connection also via the wrapper), clear thread naming/structured logs, no credentials in NodeInfo, and no new components.
- Deliverables (交付物清单) — `ClusterMembership` implementation, `EtcdClusterView` implementing `ClusterView`, NodeInfo + member event structures, Controller on-take initialization, and multi-node + etcd integration tests.

## Sections (L2)

### what-this-section-does

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#what-this-section-does]]`
- Summary: States the goal — let multiple When nodes form a cluster via etcd and sense membership changes in real time.
- Key claims: nodes register with etcd on startup and continuously renew a Lease, then participate in Controller election; the Controller receives join/offline events via Watch; the section defines the full flow and its data structures; scope is "register + form cluster + sense members + elect Controller", while actual time-wheel Master/Slave switching/rebalance belongs to §47/48 and this section only senses and records.
- Learner-relevant: Introduces the membership-coordination lifecycle (register → keepalive → elect → watch) central to distributed systems.

### why-designed-this-way

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#why-designed-this-way]]`
- Summary: Justifies Lease-bound registration, independent heartbeat resources, Txn-based election, and Watch-based awareness.
- Key claims: nodes write info to `/when/nodes/{node_id}` bound to a 6s Lease, so stopping renewal auto-deletes the key and other nodes can identify it offline; 6s TTL with 2s renewal aligns with the technical plan and reserves recovery time for the later 10s failover budget; sharing heartbeat threads/connections with business requests lets business congestion delay renewal and trigger false eviction, so independent resources reduce that impact while timeouts/tests still handle GC pauses and network faults; election uses an etcd transaction ("if /when/controller absent then write current node_id") so only one node succeeds at a time, with the key Lease-bound so after it fails other nodes get a Watch event and re-elect; awareness uses Controller Watch on the `/when/nodes/` prefix so any PUT (join) / DELETE (leave) becomes a pushed event — turning active probing into event-driven signaling.
- Learner-relevant: Teaches three canonical distributed-systems patterns: lease-based liveness, CAS/Txn election, and watch-based event notification.

### relation-to-loop

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#relation-to-loop]]`
- Summary: Describes the Loop task spec inputs, acceptance, and boundary.
- Key claims: Loop implements node lifecycle (register/heartbeat/exit) + Controller election + member Watch; explicit inputs are the register/heartbeat/election/awareness flows (§5) and the data structures to store (§7); automated acceptance (§8) is that nodes register, heartbeat keeps them online, killing a node makes its key disappear within 10s, election is unique, and Watch receives up/down events; boundary (§9) is "sense + record", not time-wheel switching/rebalance.
- Learner-relevant: Another concrete application of the reusable Loop module-spec template.

### dependencies

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#dependencies]]`
- Summary: Maps upstream/downstream dependencies of the membership module.
- Key claims: upstream is §42's etcd client wrapper and `/when/nodes`, `/when/controller` key conventions, plus §39's `ClusterView`, `NodeEndpoint`, and common Harness; downstream the node register/heartbeat/exit flow is used by every node's startup path; Controller election + role is consumed by §47/48 HA Controller for rebalance/failover decisions; the member list + up/down events are consumed by §47/48 HA to trigger time-wheel switching (implemented week 8); `EtcdClusterView` (who is online, where each time-wheel Master is) is consumed by §45/46 routing and assembly to provide a unified view for cross-node forwarding.
- Learner-relevant: Shows a membership layer as a shared substrate for routing and HA consumers.

### features-and-interactions

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#features-and-interactions]]`
- Summary: Details registration/heartbeat, Controller election, and up/down awareness flows.
- Key claims: startup does `PutWithLease(/when/nodes/{id}, info, 6s)` then starts an independent thread renewing every 2s; after a crash, renewal stops, Lease expires, the key auto-deletes, and other nodes detect it within the 10s acceptance window; election uses `txnPutIfAbsent(/when/controller, node_id, Lease)` with only one winner, the rest watching; the new Controller first loads current cluster state (node list, time-wheel distribution) and checks for leftovers before the normal loop; awareness is Controller Watch on `/when/nodes/` where PUT = new node joins (incorporated into cluster view) and DELETE = node offline (marked, switch action deferred to §47/48); routing view: all nodes Watch `/when/timewheels/` and cache `{tw_id → master node_id → NodeEndpoint}` in `EtcdClusterView`, while §46 only presets static time-wheel metadata and does not implement dynamic allocation; graceful exit (rolling upgrade) is SIGTERM → active DELETE `/when/nodes/{id}` → Controller senses DELETE, differing from crash only as "active delete" vs "Lease-expiry delete" but sharing the same detection path.
- Learner-relevant: Teaches graceful vs. crash failure detection and the shared observation path between them.

### interface-contract-design

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#interface-contract-design]]`
- Summary: Presents the `ClusterMembership` interface and the `ClusterView` behavior required of this section.
- Key claims: `ClusterMembership` exposes `registerSelf(NodeInfo)` (PutWithLease + start heartbeat thread), `deregisterSelf()` (active-exit unregister), `tryBecomeController()` (atomic Txn preemption returning whether elected), `watchMembers(MemberEventHandler)` (Watch `/when/nodes/` prefix), `listNodes()` (currently online nodes), and `currentController()` (current Controller node_id); the section also implements §39's `ClusterView`; `masterOf(twId)` may only return a Master that both has time-wheel metadata present and whose node is still online, returning empty on missing data or offline node; §45 must explicitly error rather than arbitrarily pick another node; `NodeInfo` and member-event structures are in §7.
- Learner-relevant: Teaches interface design that prevents silent fallbacks ("return empty, let the caller error") in distributed lookups.

### field-and-data-structure-definitions

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#field-and-data-structure-definitions]]`
- Summary: Tables where each piece of data lives, its structure, and lifecycle, plus conventions.
- Key claims: node info at `/when/nodes/{node_id}` = `{node_id, ip, grpc_port, start_time, load}` with a 6s Lease; Controller at `/when/controller` = node_id with a 6s Lease; time-wheel distribution at `/when/timewheels/{tw_id}` = `{master, status, epoch}` (persistent, statically presettable on first run); member events are Watch-pushed, not persisted as keys, `{type: PUT/DELETE, node_id, nodeInfo?}`; `node_id` is cluster-unique from `${WHEN_NODE_ID}` and also used for the Snowflake node bits (§45); Lease TTL 6s and heartbeat 2s follow the technical plan and §42; heartbeat thread is independent with an independent connection and renewal failures must log alerts without sensitive info.
- Learner-relevant: Connects identity (node_id) across Snowflake IDs, etcd keys, and cluster roles.

### acceptance-and-tests

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#acceptance-and-tests]]`
- Summary: Lists automatable acceptance checks and mandatory tests.
- Key claims: after startup `/when/nodes/{id}` appears and stays online via heartbeat; killing a node process makes its key disappear within 10s; three nodes starting together yield exactly one `/when/controller`; after the Controller dies the remaining nodes re-elect a unique Controller within Lease TTL; the Controller receives node join (PUT) and leave (DELETE) events via Watch; active exit (DELETE) and crash (Lease expiry) are both sensed identically; three nodes reading the same `/when/timewheels/*` return identical `masterOf(twId)` and empty after the Master goes offline; mandatory tests are Testcontainers etcd + multi-node integration (register, heartbeat, kill node, election uniqueness, Watch events), a concurrent election test asserting only one wins, a false-eviction protection test simulating busy business threads/GC while the independent heartbeat keeps the key, and a cluster-view test with preset static metadata verifying Watch updates, offline filtering, and empty results for unknown tw_id.
- Learner-relevant: Demonstrates testing distributed liveness and election determinism, including a GC/busyness false-eviction scenario.

### boundaries-and-harness

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#boundaries-and-harness]]`
- Summary: Defines non-goals and the incremental Harness constraints.
- Key claims: does not implement time-wheel Master/Slave switching, rebalance, or replica sync (§47/48); on sensing change it only updates the cluster view and records, without triggering switching; does not implement message routing/scheduling/storage (44/45/41); only does node registration + heartbeat + active exit + Controller election + member/time-wheel Watch + read-only cluster view, producing no dynamic allocation decisions; stop condition is registration/keepalive/election/awareness all usable and acceptance tests passing; Harness places code in `cluster/membership` and `cluster/view` of when-cluster, accesses etcd only through the §42 wrapper (heartbeat's independent connection included) with no separate connection, requires clear thread naming and structured logs, forbids credentials in `NodeInfo`, reads etcd credentials from env vars, and adds no new components.
- Learner-relevant: Reinforces layering discipline (all etcd access through one wrapper) and read-only separation from later HA logic.

### deliverables

- Locator: `[[sources/geek-ai-agent/20260922/第43节：节点集群——注册、组集群、切换（Loop 原料）.pdf#deliverables]]`
- Summary: Lists the artifacts expected at section end.
- Key claims: `ClusterMembership` implementation (register / independent-thread heartbeat / active exit / election / Watch / cluster view); `EtcdClusterView implements ClusterView` joining node and time-wheel metadata to provide `masterOf(twId)`; `NodeInfo` and member-event structures; Controller on-take initialization logic (load cluster state); multi-node + etcd integration tests (register, heartbeat, kill node, election uniqueness, Watch); sections 4–11 are the module's Loop input spec; the next section (§44 time wheel) returns to single-machine core scheduling.
- Learner-relevant: Checklist-style DoD for the cluster-membership milestone.

