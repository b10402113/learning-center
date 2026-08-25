---
source: design_pattern
part: 2
created: 2026-08-24
updated: 2026-08-24
---

# Part digest 2 — 原型, 单例, 适配器, 桥接

## Overview (L1)

- Covers the last two creational patterns (prototype, singleton), closes the creational group, then opens the structural group with adapter and bridge. Each chapter follows the same arc: a business scenario, a "one class of ifelse" baseline (Maven project `*-01`), a pattern refactor (`*-02`), test output comparison, and a summary of pros/cons. Scenarios are real internet business: online-exam paper generation, marketing/reward systems consuming heterogeneous MQ, and a third-party payment aggregation platform. The recurring philosophy: choose patterns by scenario, never force them; frameworks combine many patterns, not one.

## Sections (L2)

### prototype (原型模式)

- Locator: `[[sources/design-pattern/design_pattern#原型模式]]`
- Summary: Uses online-exam paper generation to show why you clone heavy objects instead of rebuilding them. The bad way is a `QuestionBankController` that hand-builds choice + answer questions and returns an identical, non-shuffled paper for every candidate — procedural, hard to extend with shuffling. The refactor makes `QuestionBank implements Cloneable`, overrides `clone()` to deep-copy both question lists and apply `Collections.shuffle` for question/option shuffling via a `TopicRandomUtil`, so each candidate gets the same questions but individually shuffled questions/options. The controller builds the template once and calls `questionBank.clone()` per candidate.
- Key claims: intent is creating many duplicate complex objects, especially when construction involves slow DB/RPC fetches; everyday analogues are Ctrl+C/Ctrl+V and `Object.clone()`; Java requires implementing `Cloneable`; clone() must copy internal collections too or the clone will corrupt the original (deep copy); the pattern cuts repeated initialization and decouples from other classes; cons are painful handling of circular references and deeply nested objects; prototype usage frequency is low, and over-applying patterns causes over-design.
- Learner-relevant: supports a node on creational patterns — distinguish prototype (clone template) from builder (append assembly, referenced in the append() method) and from factory; and a lesson on shallow vs deep copy in Java.

### singleton (单例模式)

- Locator: `[[sources/design-pattern/design_pattern#单例模式]]`
- Summary: Presents 7 ways to implement a single global instance, contrasted mainly on lazy loading (懒汉) vs eager loading (饿汉) and thread safety. Real-world triggers: DB connection pools, Spring singleton beans, global property holders. Then the chapter walks through each implementation and recommends which to use.
- Key claims: goal is one instance under multithreaded access plus a global access point; the 7 variants are (0) static class/field with a `ConcurrentHashMap` cache (no instance state, simplest for global access), (1) lazy, thread-unsafe (private constructor; racing callers can create multiple instances), (2) lazy, `synchronized` method (safe but every call pays lock cost — not recommended), (3) eager/饿汉 static field (thread-safe but not lazy; wasteful like a game pre-loading all maps at startup), (4) static inner class / holder (JVM guarantees correct concurrent class-loading, so thread-safe + lazy + no lock cost — highly recommended), (5) double-checked locking (`synchronized` block + null checks; optimizes method-level lock, keeps lazy), (6) CAS via `AtomicReference` (lock-free busy-wait, no thread switching/blocking, high concurrency; risk of infinite spin), (7) the Effective Java/Joshua Bloch enum singleton (`INSTANCE`) — free serialization and absolute protection against reflection/serialization instantiation, the best way, but unusable under inheritance.
- Learner-relevant: anchors a practical Java-concurrency lesson (locks vs CAS vs JVM class-loading guarantees, reflection/serialization attacks) and a decision node: use eager/static when lazy loading is unnecessary, lazy loading when resources only appear on user-triggered conditions, and enum for the general best default.

### adapter (适配器模式)

- Locator: `[[sources/design-pattern/design_pattern#适配器模式]]`
- Summary: A marketing/rebate system must ingest heterogeneous MQ messages and query first-order status from two different services. The bad way creates one consumer class per MQ type with hand-rolled field mapping — fine for a few, unmanageable at dozens/hundreds. The refactor defines a unified `RebateInfo` message body, a `MQAdapter.filter()` that maps arbitrary MQ JSON to it via a configurable `Map<String,String> link` and reflection setters, and an `OrderAdapterService.isFirst(String uId)` interface with `InsideOrderService` (order-count ≤ 1) and `POPOrderAdapterServiceImpl` (direct boolean) implementations. The chapter points out Spring itself ships many `*Adapter` classes (e.g. `UserCredentialsDataSourceAdapter`).
- Key claims: adapter's role is making incompatible interfaces uniform for the caller — hardware analogues are universal chargers, converter heads, travel adapters; in business it is central to 中台 (middle-platform) unification of services; it can adapt not just interfaces but data/attributes (the MQ field-name mapping is the twist); the mapping config can live in config files/DB to avoid per-MQ coding, and a proxy class can further avoid hand-writing consumer classes; benefits are clean, maintainable, extensible code with less repeated judgment; the same "different-kinds-adapter" idea also appeared in the factory-method prizes chapter.
- Learner-relevant: supports a node contrasting adapter (make existing interfaces compatible, wraps a foreign interface) vs facade and vs the bridge pattern; and a real pattern-recognition lesson: find `Adapter` names in framework source code.

### bridge (桥接模式)

- Locator: `[[sources/design-pattern/design_pattern#桥接模式]]`
- Summary: A third-party payment aggregation platform must combine multiple payment channels (WeChat, Alipay) with multiple payment modes (password, face, fingerprint). The bad way is a single `PayController.doPay()` with nested ifelse over `channelType` and `modeType` — works, but each new channel × mode explodes the matrix. The refactor splits the two axes: abstract `Pay` (holds `IPayMode payMode` set via constructor — the bridge) with `WxPay`/`ZfbPay` subclasses, and an `IPayMode.security(uId)` interface implemented by `PayCypher`/`PayFaceMode`/`PayFingerprintMode`. Callers compose freely, e.g. `new WxPay(new PayFaceMode())`; the transfer result is `"0000"`/`"0001"` success/intercept.
- Key claims: intent is decoupling abstraction from implementation so multiple matchable axes can be combined; the bridge is literally a field holding the other axis's interface injected through the constructor; real analogues are JDBC drivers, desktop/laptop of one brand, multi-interface filter services; without it, combinations become a Cartesian product of subclasses; satisfies single responsibility and open-closed and stays clean/extensible, but high-cohesion code stays complex — pick the split point deliberately; the caller side can later be config-driven with abstract factory or strategy + map; pay-mode risk-control differences could reuse the adapter pattern.
- Learner-relevant: anchors the "two orthogonal axes" refactoring move — detect when `channelType × modeType` ifelse nests signal a bridge opportunity; and a comparison node: bridge (structuring via composition of axes) vs adapter (unifying incompatible interfaces) vs strategy.

## Source links

- [[sources/design-pattern/design_pattern#原型模式]]
- [[sources/design-pattern/design_pattern#单例模式]]
- [[sources/design-pattern/design_pattern#适配器模式]]
- [[sources/design-pattern/design_pattern#桥接模式]]