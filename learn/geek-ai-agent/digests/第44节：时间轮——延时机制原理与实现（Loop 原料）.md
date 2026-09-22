---
source: 第44节：时间轮——延时机制原理与实现（Loop 原料）
source_type: pdf
source_lines: 298
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第44节：时间轮——延时机制原理与实现（Loop 原料）

## Overview (L1)

- What this section does (这一节做什么) — Implements §39's `TimeWheel`: a multi-layer slot structure that schedules delayed messages, fires them within an allowed tolerance after deliverAt, and supports rebuilding from Redis after node restart.
- Why designed this way (为什么这么设计) — Multi-layer timing wheels beat alternatives: DelayQueue is O(log n) per insert/delete and slow at scale, Quartz is cron-oriented with heavy DB/IO, and Redis ZSet has the big-key problem; timing wheels (used by Kafka, Netty; QMQ multi-level wheels as recognized reference) give O(1) insert/trigger, pure memory, and high precision. Four layers (60×1s, 60×1min, 24×1h, 30×1day) cover up to 30 days with a few thousand slots; the scheduler loop only reads and triggers, offloading heavy work to a bounded async executor, and rebuilds from Redis because the wheel is a discardable in-memory index.
- Relation to Loop (它和 Loop 的关系) — Executable module spec: Loop implements `TimeWheel` (multi-layer structure + scheduler loop + add/remove + rebuild); inputs §5 structure and three mandatory loop rules, §6 interfaces, §7 layer params; acceptance §8; boundary §9 excludes real Sink delivery and replicas.
- Dependencies & dependents (依赖与被依赖) — Upstream: §39 `Message`, `TimeWheel`, `TimeWheelRegistry`, `DueMessageHandler`, and §41 storage (`loadPendingByTimeWheel`, `transition`). Downstream: §45 ingress/routing adds messages; §45/46 use `TimeWheelRegistry`; §46/49 consume the due trigger point via `DueMessageHandler`; §47 recover section uses rebuild logic.
- Features & interactions (功能与交互) — Messages are placed by deliver_at into a layer/slot; when an upper-layer pointer reaches a slot it moves ("cascades") messages to the next finer layer and finally fires in layer 0; each wheel runs in its own thread (advance pointer → read current slot → layer-0 messages submit message_id async to `DueMessageHandler`, upper-layer messages cascade → `sleep_until_next_slot`); `add`/`remove` are O(1) linked-list operations; restart rebuild calls `loadPendingByTimeWheel` and re-adds by `nextAttemptAt` with `/ready` returning not-ready until done.
- Interface / contract design (接口/契约设计) — Implements the §39 `TimeWheel` interface (id, add, remove, start, stop); scheduler pseudocode; the `dueExecutor` must be bounded and must not silently drop due messages on a full queue — it must log a monitorable error while preserving the fact that messages can be rebuilt from Redis; triggering does not delete the Redis message fact.
- Field / parameter definitions (字段/参数定义) — Layer table (60×1s, 60×1min, 24×1h, 30×1day), default 4 wheels per node via `${WHEN_TIMEWHEEL_COUNT}` for throughput/parallelism and fault isolation; layer params configurable and tunable after measurement; unique tw_id per wheel with metadata in etcd (§42); a node can run multiple wheels, each with an independent thread.
- Acceptance criteria + required tests (验收标准+必须有的测试) — Fire at N seconds (±tolerance) with assertable trigger times; O(1) add/remove; correct cross-layer cascade; long-run no drift; restart rebuild loses no undelivered messages; exactly one `onDue` call per normal expiry and none for cancelled messages. Unit, precision-distribution, rebuild, and due-handoff tests (controlled clock).
- Boundaries & section-specific Harness (边界+专属Harness) — No acquiring delivery rights, real Sink delivery, or final-state closure (only async `DueMessageHandler`); no Master/Slave replica sync/switch (§47); no routing (§45); only multi-layer structure + scheduler loop + add/remove + rebuild. Harness: when-timewheel module, depend only on when-common interfaces, no sync blocking IO in the loop, no payload in logs, bounded async executor, compensated sleep only, pure JDK concurrency and injectable clock for tests.
- Deliverables (交付物清单) — `MultiLevelTimeWheel implements TimeWheel` (four layers + cascade + loop); `DefaultTimeWheelRegistry implements TimeWheelRegistry`; O(1) add/remove + async `DueMessageHandler`; rebuild from `StoragePlugin.loadPendingByTimeWheel`; unit + precision + rebuild tests with a controlled clock.

## Sections (L2)

### what-this-section-does

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#what-this-section-does]]`
- Summary: States the goal — implement an in-memory multi-layer timing wheel that fires messages after deliverAt within tolerance.
- Key claims: a timing wheel uses a ring of slots; the pointer advances one slot per second and triggers the messages in the current slot; a single layer covers only a limited range, so four layers (seconds, minutes, hours, days) cover up to 30 days; the section also implements recovering PENDING messages from Redis into the wheel after restart.
- Learner-relevant: Introduces the timing-wheel data structure and why layered time ranges are needed for long delays.

### why-designed-this-way

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#why-designed-this-way]]`
- Summary: Compares scheduling approaches, explains multi-layer coverage, the read+trigger-only loop, and restart rebuild.
- Key claims: priority queues (DelayQueue) are O(log n) insert/delete and slow at volume; Quartz is cron-oriented, DB-heavy, and IO-bound; Redis ZSet has the big-key problem; multi-layer timing wheels (Kafka, Netty; QMQ as the recognized reference) give O(1) insert and trigger, pure memory, and high precision, making them the standard answer for delayed scheduling; layer spans grow: layer 1 = 60 slots × 1s, layer 2 = 60 × 1min, layer 3 = 24 × 1h, layer 4 = 30 × 1day; a 5-day message enters layer 4, and as its remaining time falls into smaller ranges it cascades down 3 → 2 → 1 and finally fires in layer 1; the operation of moving from a coarser to a finer layer is called "cascade" (下移); four layers of a few thousand slots cover 30 days with O(1) insert/trigger and typically a few hundred MB per instance; the scheduler loop is the precision-critical path, so it only reads the current slot and submits trigger/cascade tasks, doing no Redis or network IO; pointer advance uses `sleep_until_next_slot` compensated by actual elapsed time to avoid fixed-sleep cumulative drift; the wheel is a discardable in-memory index, so on startup it calls `StoragePlugin.loadPendingByTimeWheel(twId)` and re-adds messages by `nextAttemptAt`.
- Learner-relevant: A worked complexity/architecture trade-off analysis plus the "only read+trigger, offload heavy work" precision design.

### relation-to-loop

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#relation-to-loop]]`
- Summary: Describes the Loop task spec inputs, acceptance, and boundary.
- Key claims: Loop implements `TimeWheel` (multi-layer structure + scheduler loop + add/remove + rebuild); explicit inputs are multi-layer structure and cascade rules (§5), the three mandatory scheduler-loop rules (§5), interfaces (§6), and layer parameters (§7); automated acceptance (§8) is firing precision, O(1) add/remove, correct cascade, and no message loss after restart; boundary (§9) is in-memory scheduling and rebuild only, without real Sink delivery or replicas.
- Learner-relevant: Another instance of the reusable Loop module-spec template, here for an algorithmic core.

### dependencies

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#dependencies]]`
- Summary: Maps upstream/downstream dependencies of the time-wheel module.
- Key claims: upstream is §39's `Message`, `TimeWheel`, `TimeWheelRegistry`, `DueMessageHandler` and §41 storage's `loadPendingByTimeWheel(twId)` (restart rebuild) and `transition` (delivery rights + state update); downstream the `TimeWheel` implementation (multi-layer + loop) is consumed by §45 ingress/routing; `TimeWheelRegistry` by §45/46; add/remove by §45; the due trigger point (`DueMessageHandler`) by §46/49; and rebuild logic by the §47 fault-recovery section.
- Learner-relevant: Shows an algorithmic core plugged into storage, routing, and delivery consumers.

### features-and-interactions

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#features-and-interactions]]`
- Summary: Details the multi-layer cascade, scheduler loop, due handoff, add/remove, and restart rebuild.
- Key claims: messages compute their layer/slot from the difference between deliver_at and now; upper-layer pointer expiry cascades messages to the next layer with recomputed slots until they fire in layer 1; each wheel runs in its own thread with three mandatory rules — the scheduling thread does no synchronous IO, the pointer is time-compensated, and same-slot message order is not guaranteed; the wheel does not acquire delivery rights, call Sink, or update final state — it only calls `DueMessageHandler.onDue(messageId)`; §46 injects a success-type test implementation to close the first run and §49 replaces it with real delivery/retry, so §44 need not know about test or concrete HTTP/Kafka Sinks; `add(Message)` inserts into the layer slot's linked list by deliver_at in O(1) and `remove(messageId)` unlinks in O(1) for cancellation; restart rebuild is load pending → add by nextAttemptAt → `start()`, with `/ready` returning not-ready during rebuild.
- Learner-relevant: Teaches O(1) scheduler data structures and the dependency-inversion handoff to a delivery interface.

### interface-contract-design

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#interface-contract-design]]`
- Summary: Presents the `TimeWheel` interface and the scheduler-loop pseudocode with its mandatory constraints.
- Key claims: implements the public-contract `TimeWheel` (`id`, `add(Message)` puts into the layer/slot in O(1), `remove(String)` unlinks in O(1), `start` runs the scheduling thread, `stop`); the loop is `while running: slot = wheel[pointer]; for msg in slot: if layer==0 submit dueHandler.onDue(messageId) else lowerWheel.add(msg); pointer = (pointer+1) % size; sleep_until_next_slot()`; `dueExecutor` must be bounded and must not silently drop due messages on a full queue — it must record a monitorable error while preserving the fact that messages can be rebuilt from Redis; triggering does not delete the Redis message fact.
- Learner-relevant: A precise pseudocode + invariants example for building a correct, non-lossy scheduler.

### field-and-parameter-definitions

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#field-and-parameter-definitions]]`
- Summary: Tables the default layer parameters and wheel-count configuration with conventions.
- Key claims: layer defaults are 60 slots × 1s (fire within tolerance in 60s), 60 × 1min (within 60min), 24 × 1h (within 24h), 30 × 1day (covering the max delay of 30 days); wheels per node default 4 via `${WHEN_TIMEWHEEL_COUNT}` for parallel throughput and fault isolation; layer parameters are configurable and tuned after measurement with the default covering 30 days; each wheel has a unique tw_id with metadata in etcd (§42); a node can run multiple wheels, each with its own thread.
- Learner-relevant: Concrete tunable parameters and the mapping of max delay to layer coverage.

### acceptance-and-tests

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#acceptance-and-tests]]`
- Summary: Lists automatable acceptance checks and mandatory tests.
- Key claims: a message delayed N seconds fires at second N (±acceptable tolerance) with assertable trigger time; add/remove are O(1) and a removed message never fires; cross-layer cascade is correct — messages exceeding layer 1's range cascade and still fire at the right second; long-run no drift (validating `sleep_until_next_slot`); restart rebuild after stop + `loadByTimeWheel` + add + start loses no undelivered message and still fires on time; a normal expiry calls `DueMessageHandler.onDue(messageId)` exactly once and a cancelled message calls it never; mandatory tests are unit tests (slot computation, cross-layer cascade, O(1) add/remove), precision tests (batch delays with trigger-delay distribution, aligned with §38 "delivery precision" acceptance), rebuild tests (inject messages into Redis, assert all fire on time), and due-handoff tests (a recording fake `DueMessageHandler` asserting call IDs, counts, and thread isolation).
- Learner-relevant: Shows how to test timing correctness deterministically (controlled clock) and how precision becomes a measurable distribution.

### boundaries-and-harness

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#boundaries-and-harness]]`
- Summary: Defines non-goals and the incremental Harness constraints.
- Key claims: does not implement acquiring delivery rights, real Sink delivery, or state closure — layer 1 only async-calls `DueMessageHandler` (test impl from §46, real impl from §49); does not implement Master/Slave replica sync/switch (§47), only the local in-memory wheel; does not implement routing (§45); only multi-layer structure + scheduler loop + add/remove + rebuild from Redis; stop condition is precision, add/remove, cascade, and rebuild acceptance all passing; Harness places code in the when-timewheel module depending only on when-common interfaces (`Message`/`TimeWheel`/`DueMessageHandler`/`StoragePlugin`) and not on when-storage-redis, requires clear thread naming/monitoring and no synchronous blocking IO in the loop, logs only message_id/tw_id/time and no payload, forbids Redis sync IO or synchronous Sink calls in the loop with due events submitted to a bounded async executor, requires compensated sleep not fixed sleep, and uses pure JDK concurrency with an injectable clock for precision tests.
- Learner-relevant: Teaches encoding performance-critical constraints (no IO in loop, compensated sleep) into enforceable rules.

### deliverables

- Locator: `[[sources/geek-ai-agent/20260922/第44节：时间轮——延时机制原理与实现（Loop 原料）.pdf#deliverables]]`
- Summary: Lists the artifacts expected at section end.
- Key claims: `MultiLevelTimeWheel implements TimeWheel` (four layers + cascade + scheduler loop); `DefaultTimeWheelRegistry implements TimeWheelRegistry` (register and look up wheels by ID); O(1) add/remove + async `DueMessageHandler` invocation on expiry; rebuild from `StoragePlugin.loadPendingByTimeWheel`; unit + precision + rebuild tests with a controlled clock; sections 4–11 are the module's Loop input spec; the next section (§45 ingress + routing) adds the entry: validation, ID generation, wheel selection, cross-node forwarding.
- Learner-relevant: Checklist-style DoD for the scheduling-core milestone.

