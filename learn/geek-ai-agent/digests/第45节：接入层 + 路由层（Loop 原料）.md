---
source: 第45节：接入层 + 路由层（Loop 原料）
source_type: pdf
source_lines: 290
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第45节：接入层 + 路由层（Loop 原料）

## Overview (L1)

- What this section does (这一节做什么) — Implements the application layer for message operations: parameter validation, message-ID generation, time-wheel selection, cross-node forwarding, persistence, and joining the wheel. It implements §39's `Router` and provides a unified handler to the §40 gRPC server and §51 HTTP API.
- Why designed this way (为什么这么设计) — Snowflake generates globally unique IDs locally without a central service; consistent hashing on message_id → tw_id guarantees a message's submit/query/cancel always land on the same wheel; if the target wheel's Master is on another node, forward via internal gRPC (§40) so business callers are unaware; the order "persist first, then join the wheel, then return" is the first guarantee against message loss.
- Relation to Loop (它和 Loop 的关系) — Executable module spec: Loop implements `Router` + the real Submit/Query/Cancel pipeline + state machine; inputs §5 write path and routing/forwarding rules, §6 interfaces, §5/§7 state machine; acceptance §8; boundary §9 restricts to ingress + routing + orchestration.
- Dependencies & dependents (依赖与被依赖) — Upstream: §40 gRPC contract and internal forwarding channel, §41 `StoragePlugin.create/get/transition`, §44 `TimeWheel.add/remove` and `TimeWheelRegistry`, §43 etcd-driven cluster view, and §39 `Message`, `MessageStatus`, `Router`, `ClusterView`, `NodeEndpoint`. Downstream: §44 wheel + gRPC forwarding use the `Router` (consistent hash); §40 gRPC server delegates to the real pipeline; the console and Sink sections consume the state machine; the cluster consumes internal gRPC forwarding.
- Features & interactions (功能与交互) — Submit seven steps: receive → validate time/payload/sink_config structure → generate message_id → consistent-hash to tw_id → if Master not local forward via gRPC else persist with `storage.create()` → on success `timeWheel.add()` → return message_id + PENDING. Query hashes to the wheel, forwards to Master if needed, reads state. Cancel atomically transitions PENDING → CANCELLED then removes from the wheel (terminal messages remain queryable during retention).
- Interface / contract design (接口/契约设计) — Implements `Router.routeToTimeWheel(messageId)` (consistent hash → tw_id) and §40's `DelayMessageHandler` with real `submit/query/cancel`; `ClusterView` and `TimeWheelRegistry` are injected via constructor; `SubmitCommand` is a transport-agnostic internal command converted from gRPC (§40) or HTTP (§51); the routing layer must not read etcd directly nor silently create defaults when a wheel/Master is missing.
- Field / rule definitions (字段/规则定义) — Snowflake = timestamp | node bits (${WHEN_NODE_ID}) | sequence, generated locally, concurrent-safe, roughly ordered; tw_id = consistentHash(message_id) % wheel ring, constant for a given ID; validation rules mirror §40 (deliver_at/delay_seconds pick one, future time, 1–2592000s, sink_config branch matches sink_type via `Sink.validateConfig`, payload ≤ 64KB decoded, else INVALID_ARGUMENT naming the field); state machine PENDING→DELIVERING→DELIVERED/FAILED/CANCELLED.
- Acceptance criteria + required tests (验收标准+必须有的测试) — Message IDs unique under concurrency and roughly increasing; consistent hash constant; Submit creates before joining the wheel and returns PENDING, with persistence failure returning failure and no memory change; cross-node gRPC forward succeeds; missing Master/local wheel fails explicitly with no silent routing; Query correct and Cancel succeeds on PENDING / fails on delivered; only one of 100 concurrent cancels wins. Unit + single-node E2E + two-node forward + static-view + persistence-failure tests.
- Boundaries & section-specific Harness (边界+专属Harness) — No wheel internals (§44), storage internals (§41), real delivery (§49), or Master/Slave replicas/failover (§47); only ingress + routing + orchestration. Harness: `when-ingress-router` module in `core/ingress` and `core/router`, depends only on module interfaces, injects `ClusterView`/`TimeWheelRegistry`/gRPC client, keeps ID generation and application flow only here, centralizes proto ↔ Message/command conversion, logs no payload/sink_config secrets, injects forwarding credentials via env vars, and uses a mature or simple Snowflake implementation.
- Deliverables (交付物清单) — `Router` + `DelayMessageHandler` implementations; message-ID generator; proto ↔ Message/command conversion with the gRPC server delegating here; cross-node gRPC forwarding logic (locate Master via cluster view); single-node and two-node tests reusing §46 `when-test-support` `StaticClusterView`; state machine + unit/integration/two-node/persistence-failure tests.

## Sections (L2)

### what-this-section-does

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#what-this-section-does]]`
- Summary: States the goal — implement the Submit/Query/Cancel application flow and message-to-wheel routing.
- Key claims: §40 defines the transport contract, §41 the storage, §44 the scheduling; this section composes them into the full application flow: receive Submit → validate → generate message_id → select target wheel → forward to target node if needed → locally persist → add to wheel → return; Query and Cancel also go through this layer.
- Learner-relevant: Introduces the orchestration layer that turns independent modules into a working write path.

### why-designed-this-way

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#why-designed-this-way]]`
- Summary: Justifies Snowflake IDs, consistent-hash wheel selection, gRPC forwarding, persist-then-add-then-return ordering, and who owns which state transition.
- Key claims: every message needs a globally unique ID; Snowflake combines timestamp, node bits (from `${WHEN_NODE_ID}`), and sequence, generated locally without a central ID service; submit/query/cancel must all land on the same wheel or they will be missed/cannot be cancelled, so consistent hashing by message_id guarantees the same ID always maps to the same wheel (matching §39 `Router.routeToTimeWheel`); note the hash is message_id → wheel and is distinct from the replica-set/Master metadata (that is §42/43); a wheel's Master may be on another node, so after computing tw_id the ingress node looks up the cluster view (§43) and, if not local, forwards via internal gRPC (§40), transparently to business callers; the fixed order persist → add to memory wheel → return is the first guarantee against message loss (if Redis write fails, return failure and change no in-memory scheduling state); this section initiates create/cancel transitions while §49 initiates delivery success/failure/retry transitions, and all modules must use §41's atomic `transition`.
- Learner-relevant: Teaches routing-key selection (hash over the entity ID), transparent forwarding, and the persistence-first invariant.

### relation-to-loop

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#relation-to-loop]]`
- Summary: Describes the Loop task spec inputs, acceptance, and boundary.
- Key claims: Loop implements `Router` + the real Submit/Query/Cancel pipeline + state machine; explicit inputs are the seven-step write path (§5), routing/forwarding rules (§5), interfaces (§6), and state machine (§5/§7); automated acceptance (§8) covers unique message IDs, stable routing for the same ID, correct cross-node forwarding, persist-before-return, and atomic state transitions; boundary (§9) excludes wheel internals, storage internals, and delivery — only ingress + routing + orchestration.
- Learner-relevant: Another application of the reusable Loop module-spec template.

### dependencies

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#dependencies]]`
- Summary: Maps upstream/downstream dependencies of the ingress/routing module.
- Key claims: upstream is §40's gRPC contract (Submit/Query/Cancel) and internal forwarding channel; §41's `StoragePlugin.create/get/transition`; §44's `TimeWheel.add/remove` and `TimeWheelRegistry`; §43's etcd-driven cluster view (`listNodes`/where the wheel Master is); and §39's `Message`, `MessageStatus`, `Router`, `ClusterView`, `NodeEndpoint`; downstream the `Router` implementation (consistent hash) is consumed by §44's wheel and gRPC forwarding; the real Submit/Query/Cancel pipeline by the §40 gRPC server; the state machine by the console and Sink sections; and the internal gRPC forwarding logic by the cluster cross-node path.
- Learner-relevant: Shows a hub module whose outputs fan out to routing, transport, console, and Sink.

### features-and-interactions

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#features-and-interactions]]`
- Summary: Details the Submit seven-step write path, Query, Cancel, and state-machine transitions.
- Key claims: Submit: receive → validate time/payload/sink_config structure → generate message_id → consistent-hash to tw_id → check whether Master is local (forward via gRPC if not; if local persist with `storage.create()`) → on success `timeWheel.add()` → return message_id + PENDING; after §49 connects, it also calls the concrete Sink's runtime config validation; the local wheel must be obtained via `TimeWheelRegistry.require(twId)` and the Master via injected `ClusterView.masterOf(twId)`, and the routing layer must not read etcd itself nor silently create defaults when missing; §46's first run has two phases — single-node injects `StaticClusterView` with all tw_ids pointing local, three-node uses a preset static map or §43's etcd cluster view to verify cross-node gRPC forwarding, with dynamic allocation/migration deferred to §48; Query hashes the message_id to the wheel, forwards to Master if needed, and reads state from memory/storage (MVP queries also route via Master for simplicity); Cancel atomically transitions PENDING → CANCELLED then removes from the wheel, with terminal messages still queryable during retention and cancel failing when current state is not PENDING; the state machine uses `StoragePlugin.transition` for all transitions, with retryable failures going DELIVERING → PENDING and writing nextAttemptAt, and non-retryable or exhausted failures becoming FAILED.
- Learner-relevant: A complete worked write/read/cancel path with concrete ordering and failure semantics.

### interface-contract-design

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#interface-contract-design]]`
- Summary: Presents the `Router` and `DelayMessageHandler` interfaces and the internal command type.
- Key claims: implements the public-contract `Router` as `String routeToTimeWheel(String messageId)` (consistent hash → tw_id), whose implementation receives `ClusterView` and `TimeWheelRegistry` via constructor while the interface itself returns only a stable tw_id (locating the node is part of orchestration); implements §40's `DelayMessageHandler` with `submit(SubmitCommand)`, `query(String)`, `cancel(String)`; `SubmitCommand` is a transport-agnostic internal command — §40 converts gRPC requests into it and §51 converts HTTP requests into it — and `submit` constructs the `Message` and completes persistence and scheduling.
- Learner-relevant: Demonstrates separating a pure routing contract from node-locating orchestration and sharing an internal command across transports.

### field-and-rule-definitions

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#field-and-rule-definitions]]`
- Summary: Defines message-ID structure, consistent hashing, validation rules, and state machine.
- Key claims: `message_id` uses Snowflake = timestamp | node bits (${WHEN_NODE_ID}) | sequence, generated locally, non-duplicating under concurrency, roughly ordered; consistent hash gives tw_id = consistentHash(message_id) % wheel ring, mapping the same message_id to the same tw_id permanently; validation mirrors §40 (deliver_at/delay_seconds pick one; deliver_at in the future; delay 1–2592000s; sink_config branch matches sink_type via `Sink.validateConfig`; payload ≤ 64KB decoded; otherwise INVALID_ARGUMENT naming the field); the state machine is PENDING / DELIVERING / DELIVERED / FAILED / CANCELLED per §39 `MessageStatus`.
- Learner-relevant: Ties ID generation, hashing, validation, and state together as the ingress layer's rule set.

### acceptance-and-tests

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#acceptance-and-tests]]`
- Summary: Lists automatable acceptance checks and mandatory tests.
- Key claims: message IDs do not duplicate under single-machine concurrency and are roughly increasing; consistent hash is constant for the same message_id into the same tw_id; a valid Submit creates before joining the wheel and returns PENDING, while persistence failure returns failure with no memory change; when the Master is not local the request is correctly forwarded via gRPC and handled; when `ClusterView` cannot find a Master or `TimeWheelRegistry` cannot find the local wheel it fails explicitly rather than silently routing to an arbitrary node; Query returns the correct state and Cancel succeeds on PENDING / fails on delivered; state transitions follow the machine and only one of 100 concurrent cancels wins; mandatory tests are unit tests (Snowflake concurrent uniqueness, consistent-hash constancy, validation rules one by one), a single-node end-to-end integration test (Submit → storage/wheel stub or real → Query → expiry → state change), a two-node integration test (target wheel on the peer, gRPC forward path), a static-view test (same wheel map yields the same Master on all nodes), and a persistence-failure test (`storage.create` throws → no wheel join, failure returned).
- Learner-relevant: Shows testing determinism/idempotence properties (stable hashing, unique IDs) and failure-path guarantees.

### boundaries-and-harness

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#boundaries-and-harness]]`
- Summary: Defines non-goals and the incremental Harness constraints.
- Key claims: does not implement wheel internals (§44), storage internals (§41), or real delivery (§49) — it only orchestrates them; does not implement Master/Slave replicas or failover (§47) — it only "looks up where the Master is and forwards" on write, without handling switching; only ingress (validation/ID/state machine) + routing (consistent hash + forwarding) + Submit/Query/Cancel orchestration; stop condition is end-to-end write/query/cancel working, forwarding correct, persist-before-return, and all acceptance passing; Harness places code in `core/ingress` and `core/router` of when-ingress-router depending only on module interfaces (not Redis, etcd, or a concrete wheel), requires `ClusterView`/`TimeWheelRegistry`/gRPC client injected by constructor and replaceable with static/fake implementations in tests, keeps transport handling in §40/§51 and ID/application flow only here, centralizes proto ↔ Message/command conversion, logs only message_id/tw_id/state without payload or sink_config secrets, injects forwarding credentials via env vars, and uses a mature or simple Snowflake with no heavy frameworks.
- Learner-relevant: Reinforces the orchestration-only boundary and constructor injection as a testability mechanism.

### deliverables

- Locator: `[[sources/geek-ai-agent/20260922/第45节：接入层 + 路由层（Loop 原料）.pdf#deliverables]]`
- Summary: Lists the artifacts expected at section end.
- Key claims: `Router` implementation (consistent hash) + `DelayMessageHandler` implementation (Submit/Query/Cancel pipeline); message-ID generator (node bits from ${WHEN_NODE_ID}); proto ↔ Message/command conversion with the gRPC server changed to delegate here; cross-node gRPC forwarding (locate Master via cluster view); single-node and two-node tests reusing §46 `when-test-support` `StaticClusterView` (this module must not implement another static view); state machine + unit/integration/two-node/persistence-failure tests; sections 4–11 are the module's Loop input spec; this completes the write path and week 7's module materials, with §46 next integrating 40–45 and actually running Loop.
- Learner-relevant: Checklist-style DoD for the ingress/routing milestone and a pointer to the integration run.

