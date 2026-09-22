---
source: 第39节：定义 When 的公共模型与模块接口
source_type: pdf
source_lines: 265
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第39节：定义 When 的公共模型与模块接口

## Overview (L1)

- Why unify first — If each module defines its own Message and status, a module can pass its tests alone yet integration still fails; mismatches (access layer calls it taskId, storage calls it messageId; one module deletes immediately while another still reads status) only surface at integration. So lesson 39 unifies the public model and interfaces before separate module implementation.
- Position — Lesson 39 is the shared upstream of all later modules (40–53); every module references the same contracts so the complete system can combine correctly.
- Deliverables — Two classes of public contracts plus one set of rules: (1) public model — Message (identity, time, payload, target, runtime status), MessageStatus (five states + legal transitions), SinkType (delivery target enum), SinkConfig (strongly typed target config); (2) four public interfaces — StoragePlugin, TimeWheel, Sink, Router; (3) common rules — security, layering, dependency direction, acceptance.
- Message model — One Message spans access, routing, scheduling, storage, and delivery: identity/time (messageId/traceId, createdAt/deliverAt, nextAttemptAt), delivery intent (sinkType + sinkConfig, payload ≤ 64KB, businessTag), runtime status (timeWheelId/status, retryCount/deliveredAt, lastError); all modules use this same Message and are forbidden to redefine equivalent message objects.
- State machine — Five states (PENDING waiting, DELIVERING holding delivery right, DELIVERED success) with only five allowed transitions; retryable failure DELIVERING → PENDING with nextAttemptAt rescheduled, non-retryable/exhausted → FAILED, and only PENDING → CANCELLED; all transitions must be atomic and only one executor may hold a message's delivery right.
- Contract relations — The same Message flows through modules via the public interfaces (contract-relations diagram).
- Storage contract — All state changes go through StoragePlugin executed atomically: create/get (create and query), transition (atomic state change), plus recovery of pending messages and cleanup of expired terminal states; Redis holds authoritative state while the timing wheel only holds an in-memory scheduling index rebuildable from Redis.
- Contract map — Who defines/implements/uses each: Message/Status defined by 39 and used by all modules; StoragePlugin implemented by 41 and used by 44/45/47; TimeWheel/Router implemented by 44/45; Sink implemented by 49 (HTTP/Kafka); SinkConfig defined by 39, transported by 40, converted to Message by 45, delivered by 49.
- Common rules — Public Harness constrains all modules: security (no hardcoded credentials), layering (api/core/plugin/cluster), dependency (only on public interfaces), acceptance (tests must not be deleted); each lesson adds its own module rules (e.g. timing wheel threads forbid sync IO, Redis forbids big keys, sensitive config via env vars).
- Completion & closing — Lesson 39's deliverable: compilable Java public types (Message/StatePatch and the four interfaces) and proto (SinkType/MessageStatus, strongly typed SinkConfig), plus the public Harness in the root CLAUDE.md; later lessons only implement module responsibilities and never redefine public objects.

## Sections (L2)

### why-unify-first
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#why-unify-first]]`
- Summary: Asks why not implement modules separately first; if each module defines its own Message and status, modules can pass their own tests but integration fails over field, state, and lifecycle mismatches that only show up during integration.
- Key claims: Hence lesson 39 unifies the public model and interfaces before any module implementation.
- Learner-relevant: The rationale for contract-first development.

### position
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#position]]`
- Summary: Lesson 39 is the shared upstream of the following modules (40–53).
- Key claims: All later modules reference the same public contracts so the final system composes correctly.
- Learner-relevant: Where lesson 39 sits in the When dependency graph.

### deliverables
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#deliverables]]`
- Summary: Two classes of public contract + one set of rules: public model (Message, MessageStatus, SinkType, SinkConfig), four public interfaces (StoragePlugin, TimeWheel, Sink, Router), and common rules (security, layering, dependency, acceptance).
- Key claims: Completion standard: the model and interfaces compile, public rules are written into the root CLAUDE.md, and later lessons reference them directly.
- Learner-relevant: The exact deliverable checklist for this lesson.

### message-model
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#message-model]]`
- Summary: One Message used across access, routing, scheduling, storage, delivery: identity/time, delivery intent, and runtime status grouped into three field families.
- Key claims: All modules use the same Message; redefining an equivalent message object is forbidden.
- Learner-relevant: The single source of truth for what a message is.

### state-machine
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#state-machine]]`
- Summary: Five states with only five legal transitions: PENDING → DELIVERING → DELIVERED; retryable failure DELIVERING → PENDING (with nextAttemptAt) for rescheduling; non-retryable or exhausted → FAILED; only PENDING → CANCELLED.
- Key claims: All transitions must be atomic and only one executor may acquire a message's delivery right.
- Learner-relevant: The lifecycle contract every module must honor.

### contract-relations
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#contract-relations]]`
- Summary: Diagram showing the same Message flowing through each module via the public interfaces.
- Key claims: Interfaces are the seams through which the shared model travels.
- Learner-relevant: A visual anchor for module composition.

### storage-contract
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#storage-contract]]`
- Summary: All state changes execute atomically through StoragePlugin: create/get, transition, recovery of pending messages, and cleanup of expired terminal states.
- Key claims: Required state rules — one message has exactly one executor that acquires delivery right; terminal states remain queryable within the retention period; cleanup only after retention expires; Redis holds authoritative state and the timing wheel holds only an in-memory index rebuildable from Redis.
- Learner-relevant: The persistence/recovery contract critical to no-loss guarantees.

### contract-map
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#contract-map]]`
- Summary: Maps each contract's definer/implementer/user: Message/Status by 39, StoragePlugin by 41 (used 44/45/47), TimeWheel/Router by 44/45, Sink by 49, SinkConfig by 39 (40 transport, 45 convert, 49 deliver).
- Key claims: When interfaces or fields change, edit lesson 39 first and then check all implementers and users.
- Learner-relevant: The ownership map preventing divergent contracts.

### common-rules
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#common-rules]]`
- Summary: Public Harness rules all modules obey: security (no hardcoded credentials), layering (api/core/plugin/cluster), dependency (only on public interfaces), acceptance (tests cannot be deleted); each lesson adds its own module rules.
- Key claims: Public Harness governs global rules while module Harness governs per-module increments; together they constrain implementation and acceptance.
- Learner-relevant: The guardrails shared across all modules.

### completion
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#completion]]`
- Summary: Three deliverables: (1) Java public types Message/StatePatch + four interfaces; (2) public proto SinkType/MessageStatus + strongly typed SinkConfig; (3) public Harness in the root CLAUDE.md.
- Key claims: Completion standard: Java types and proto compile and the contract map stays consistent with later lessons; from lesson 40 onward modules only implement responsibilities, never redefine public objects.
- Learner-relevant: The acceptance/testable definition of done for lesson 39.

### closing
- Locator: `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf#closing]]`
- Summary: Once contracts are unified, modules can be implemented independently and compose correctly; lessons 40 (gRPC contract), 41 (Redis storage), 44 (timing wheel), 45 (access and routing) all reference lesson 39's Message, states, and public interfaces.
- Key claims: When fields/interfaces conflict, revise lesson 39 first then re-check all dependent lessons; lesson 39's value is making later modules face the same set of facts so they combine correctly.
- Learner-relevant: The contract-first payoff and the change procedure.

## Sources

- `[[sources/geek-ai-agent/20260922/第39节：定义 When 的公共模型与模块接口.pdf]]`
