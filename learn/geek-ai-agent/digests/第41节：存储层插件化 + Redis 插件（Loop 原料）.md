---
source: 第41节：存储层插件化 + Redis 插件（Loop 原料）
source_type: pdf
source_lines: 304
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第41节：存储层插件化 + Redis 插件（Loop 原料）

## Overview (L1)

- What this section does (这一节做什么) — Defines what data When must store, designs a pluggable storage mechanism via the §39 `StoragePlugin` interface, and implements the first plugin, `RedisStoragePlugin`. Delayed messages must be persisted before delivery so node restart can recover them.
- Why designed this way (为什么这么设计) — Plugin architecture keeps callers dependent only on the interface, so swapping Redis for RocksDB means adding one implementation. Redis is chosen as the first plugin (fast writes, fast key access, TTL, ubiquity); big-key risk is avoided by one small key per message instead of a shared ZSet; persistence must precede memory insertion and returning to the caller.
- Relation to Loop (它和 Loop 的关系) — An executable module spec: Loop references `Message` and `StoragePlugin` from the public contract and produces `RedisStoragePlugin` + key design + tests; §8 gives automated acceptance, §9 boundaries, §10 Harness.
- Dependencies & dependents (依赖与被依赖) — Upstream: §39 `Message`, `StoragePlugin`, `MessageStatus`, and common Harness. Downstream: §45 ingress calls `create` before returning; §45/47/49 use `transition` for atomic state changes; §44/47 use `loadPendingByTimeWheel` for recovery; a cleanup job uses `deleteExpired`.
- Features & interactions (功能与交互) — Implements five methods (create/get/transition/loadPendingByTimeWheel/deleteExpired) with a strict write order (serialize → SET body → SET index via Pipeline → success → memory → return) and async Redis IO off the scheduler thread.
- Interface / contract & key structure (接口/契约设计) — The interface is the §39 `StoragePlugin`; the Redis key structure (`when:msg:{id}`, `when:tw:{tw_id}:idx:{id}`, `when:tw:{tw_id}:slot:{slot_key}`) forbids ZSet/big Hash and requires TTL on every key.
- Field / key definitions & validation (字段/key定义) — key/type/content/TTL table; every key sets TTL no earlier than max(deliverAt, nextAttemptAt, deliveredAt) + retention, extending TTL when planned time slips.
- Acceptance criteria + required tests (验收标准+必须有的测试) — Automated acceptance: type returns "redis"; create/get round-trip; only one of 100 concurrent PENDING→DELIVERING wins; loadPendingByTimeWheel correctness; terminal-state query then deleteExpired; every key has TTL; Pipeline writes; Testcontainers integration tests including a big-key anti-regression test and a write-failure test.
- Boundaries & section-specific Harness (边界+专属Harness) — Only the storage plugin: no scheduling, delivery, cluster coordination, or failover; no Redis HA (deployment's job). Harness pins package, key-prefix constants, Lettuce/Jedis, env-var credentials, no payload logging, and the no-ZSet/no-big-Hash mandatory constraint.
- Deliverables (交付物清单) — `StoragePlugin` five-method implementation, key constants/utilities, write Pipeline + atomic transition + terminal cleanup, integration/big-key/write-failure tests.

## Sections (L2)

### what-this-section-does

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#what-this-section-does]]`
- Summary: States the goal — define what data to store and design a pluggable storage mechanism, then implement the Redis plugin.
- Key claims: delayed messages must be persisted before delivery so node exit/restart can recover them; the section first clarifies the data and indexes to store, then implements the Redis version of the pluggable storage interface; pluginization means callers depend only on `StoragePlugin`, not directly on a Redis client; when Redis is briefly unavailable, writes fail and the API errors, so business callers retry (fail-down runtime behavior aligned with requirements).
- Learner-relevant: Introduces the port/adapter pattern for storage and the persistence-before-delivery invariant that recurs in later sections.

### why-designed-this-way

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#why-designed-this-way]]`
- Summary: Justifies pluginization, the choice of Redis first, the mandate to avoid big keys, and the persist-before-return ordering.
- Key claims: enterprises differ in infrastructure, so abstract storage into `StoragePlugin`; delayed messages have three hard storage requirements — fast writes, fast key read/write, TTL for cleanup — all met by Redis, which is ubiquitous; RocksDB needs separate deployment and MySQL is worse at massive random small-key IO; many SDK delayed-queue solutions (Redisson, Curator) put all delayed messages in one ZSet scored by expiry, which becomes a big key that blocks Redis's single thread; When instead gives each message an independent small key and splits indexes by time wheel, never using ZSet/big Hash, at the cost of many keys (hundreds of thousands to millions) which Redis handles well; fixed order is Redis write success → add to memory time wheel → return to caller.
- Learner-relevant: Teaches a real Redis anti-pattern (big key) and how data-structure choice is driven by the single-threaded execution model.

### relation-to-loop

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#relation-to-loop]]`
- Summary: Describes the Loop task spec inputs, acceptance, boundaries, and Harness for this module.
- Key claims: Loop directly references `Message` and `StoragePlugin` from the public contract and produces `RedisStoragePlugin` + key design + tests; explicit inputs are function (§5), interface (§6, from public contract), and key/fields (§7); automated acceptance (§8) validates create/query, atomic state transition, pending-message recovery, terminal cleanup, and big-key constraint; boundaries (§9) restrict it to the storage plugin; Harness (§10) enforces big-key and env-var-secret constraints.
- Learner-relevant: Another instance of the reusable 11-part Loop module spec template.

### dependencies

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#dependencies]]`
- Summary: Maps upstream/downstream dependencies for the storage plugin.
- Key claims: upstream is §39's `Message`, `StoragePlugin`, `MessageStatus`, and the common Harness; downstream outputs are `RedisStoragePlugin` (implements `StoragePlugin`), `transition`, `loadPendingByTimeWheel(twId)`, `deleteExpired`, and the Redis key convention; §45 ingress calls `create(Message)` before returning; §45/47/49 use atomic `transition` so only one executor gains delivery rights; §44/47 load only still-to-process messages after restart/failover; a cleanup task deletes terminal messages after retention.
- Learner-relevant: Shows how a storage contract serves routing, recovery, and cleanup consumers — useful for dependency-graph reasoning.

### features-and-interactions

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#features-and-interactions]]`
- Summary: Details the five-method behavior and the non-negotiable write ordering.
- Key claims: `create(Message)` saves a message before it joins the memory time wheel / is returned; `get(messageId)` reads it back; `transition(messageId, expected, target, patch)` updates only if current state equals expected and patches retry count/error/next-attempt atomically via Lua or equivalent transaction; `loadPendingByTimeWheel(twId)` reads still-to-schedule PENDING messages; `deleteExpired(messageId)` deletes message and index only after retention; write order is serialize → SET body → SET index (both via Pipeline to cut round trips) → Redis success → enter memory + return, and any failure returns failure without touching memory, guaranteeing "anything in memory is also in Redis"; the scheduler thread never performs synchronous Redis IO — on trigger it hands the task to an async executor that uses `transition` to gain delivery rights and update results.
- Learner-relevant: Teaches atomic compare-and-set state transition and the "cache/db consistency by write ordering" pattern.

### interface-and-key-structure

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#interface-and-key-structure]]`
- Summary: Presents the `StoragePlugin` interface and the Redis key structure that all later modules must follow.
- Key claims: the interface is exactly the public contract's `StoragePlugin` (`type`, `create`, `get`, `transition`, `loadPendingByTimeWheel`, `deleteExpired`) and is implemented, not redefined; `when:msg:{message_id}` is a STRING holding the JSON-serialized `Message`, one key per message with TTL = deliver_at + 7 days; `when:tw:{tw_id}:idx:{message_id}` is a STRING holding the due timestamp, split by time-wheel dimension, still an independent small key; `when:tw:{tw_id}:slot:{slot_key}` is an optional SET of message ids used only for node-restart recovery, not daily scheduling; the mandatory constraint is no ZSet or big Hash — every message is its own small key because Redis single-threaded execution is extremely sensitive to big keys.
- Learner-relevant: A concrete, reusable key-namespacing and TTL design that avoids the big-key trap.

### field-and-key-definitions

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#field-and-key-definitions]]`
- Summary: Tables the key, type, content, and TTL rules and the key-convention points.
- Key claims: message body is split by `message_id` (single message ≤ 64KB, tens of KB with metadata); the index is split by `tw_id` prefix so 100k messages in one time wheel are 100k independent small keys, not a big key; every key sets a TTL no earlier than max(deliverAt, nextAttemptAt, deliveredAt) + retention, and when state changes postpone the planned time the TTL must be extended accordingly.
- Learner-relevant: Reinforces TTL design as a correctness requirement, not just cleanup hygiene.

### acceptance-and-tests

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#acceptance-and-tests]]`
- Summary: Lists the automatable functional acceptance checks and mandatory tests.
- Key claims: `type()` returns "redis" and is loaded by the public contract's plugin registry; create-then-get returns an identical `Message`; 100 concurrent PENDING→DELIVERING calls allow exactly one success; loadPendingByTimeWheel returns only still-to-schedule messages; terminal messages are queryable during retention and both body and index are deleted after `deleteExpired`; every written key has TTL (deliver_at + 7 days); writes use Pipeline for body + index and deletes use Pipeline; mandatory tests are full-chain Testcontainers Redis integration tests, a big-key anti-regression test asserting key count grows linearly with no single big collection, and a write-failure test where Redis unavailability makes `create` throw and the caller fail without joining the memory time wheel; assertions go into the Harness and Loop may not modify them (§38).
- Learner-relevant: Shows how to turn performance constraints (big keys, batching) into asserting tests.

### boundaries-and-harness

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#boundaries-and-harness]]`
- Summary: Defines non-goals and the incremental Harness constraints.
- Key claims: does not implement time-wheel scheduling, Sink delivery, cluster coordination, or failover; does not define `Message`/`StoragePlugin` (§39); does not handle Redis HA (Cluster/Sentinel/AOF/cross-DC) which the deployment operator ensures, only single-instance or primary-replica; only implements `RedisStoragePlugin` + key structure + atomic transition + recovery/cleanup + tests; stop condition is five methods implemented, key convention landed, atomic transition verified, no big key; Harness requires package `plugin/storage/redis`, key prefix `when:` centralized in constants, official Lettuce/Jedis clients, env-var Redis host/port/password, no full-payload logging, and the no-ZSet/no-big-Hash / every-key-has-TTL storage constraints.
- Learner-relevant: Demonstrates encoding non-functional requirements (big-key avoidance, TTL) into enforceable Harness rules.

### deliverables

- Locator: `[[sources/geek-ai-agent/20260922/第41节：存储层插件化 + Redis 插件（Loop 原料）.pdf#deliverables]]`
- Summary: Lists the artifacts expected at section end.
- Key claims: five-method `StoragePlugin` implementation; key constants/utilities for `when:msg:*` and `when:tw:*:idx:*`; write Pipeline, atomic state transition, and terminal cleanup wrappers per §5; integration (Testcontainers Redis) + big-key anti-regression + write-failure tests; sections 4–11 are the module's Loop input spec; the next section moves to cluster metadata storage.
- Learner-relevant: Checklist-style DoD for the storage milestone.

