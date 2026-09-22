---
source: 第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）
source_type: pdf
source_lines: 355
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）

## Overview (L1)

- Purpose — implement the §39 Sink and DueMessageHandler interfaces with real HTTP and Kafka delivery, plus a unified failure classification and retry policy, replacing §46's test handler/sink.
- Design rationale — delivery is pluggable via Java SPI (META-INF/services → ServiceLoader → type→Sink map) so new sinks need no core changes; HTTP chosen as most universal, Kafka for message-bus users; retry distinguishes retryable vs non-retryable; Kafka Producers are cached by `bootstrap_servers`.
- Loop relation — module task spec for Loop: build HttpSink/KafkaSink + SPI registration + production DefaultDueMessageHandler + unified retry; §44 still depends only on `DueMessageHandler` (no reverse dependency on concrete sinks).
- Dependencies — upstream: §39 public contracts (`Sink`, `DeliveryResult`, `SinkConfig`, `SinkType`, `DueMessageHandler`, `TimeWheelRegistry`), §44 due hook, §45 state machine; downstream: §44 time wheel, when-app, §53 integration.
- Functionality and contracts — SPI load and type→Sink map; atomic PENDING→DELIVERING claim before delivering; success→DELIVERED, retryable failure→PENDING + `nextAttemptAt` + re-enqueue, non-retryable/exhausted→FAILED; HTTP mapping 2xx/5xx/4xx; Kafka send success/exception; `RetryPolicy.shouldRetry`/`nextDelayMs`.
- Fields and acceptance — retry defaults: max 5, exponential backoff 30s→1m→2m→4m→8m capped at 30 min; acceptance includes SPI load, real HTTP/Kafka delivery, classification, backoff, Producer reuse, atomic delivery-claim concurrency.
- Boundaries, Harness, deliverables — no time wheel/storage/cluster work; no gRPC/RocketMQ/NATS yet; no DLQ/custom retry; code in `sink-spi`/`sink-http`/`sink-kafka`; secrets from env vars, never logged.

## Sections (L2)

### 1-这一节做什么

- Locator: `[[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#1-这一节做什么]]`
- Summary: One-line goal — real delivery: due messages go to an HTTP callback or Kafka topic by `sink_type`, with unified retry on failure.
- Key claims: §44 only calls `DueMessageHandler.onDue(messageId)` asynchronously; this section provides the production implementation — acquire the atomic delivery right, pick HTTP/Kafka by `sink_type`, deliver, then update state or re-enqueue.
- Learner-relevant: Anchor for SPI-based pluggability and for closing the test delivery loop with real sinks.

### 2-为什么这么设计

- Locator: `[[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#2-为什么这么设计]]`
- Summary: Justifies SPI pluggability, choosing HTTP + Kafka first, and retry classification.
- Key claims: many downstream types exist (HTTP, Kafka, later gRPC/RocketMQ/NATS), so sinks are SPI-loaded and registered as type→Sink (技术方案 §11.2); HTTP is most universal (curl-testable), Kafka fits MQ users (§11.3/§11.4); HTTP 2xx = success, 5xx/timeout/connection = retryable, 4xx = non-retryable; Kafka send success = success, any exception = retryable; retryable goes exponential backoff (30s→…→8m, max 5, cap 30 min), exhausted → FAILED with Redis retained for diagnosis (§11.5); Kafka Producer cached by `bootstrap_servers` (§11.4).
- Learner-relevant: Distinguishes retryable transient failure from non-retryable business error.

### 3–4-Loop 关系与依赖

- Locator: `[[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#4-依赖与被依赖]]`
- Summary: Loop task framing and dependency edges.
- Key claims: upstream §39 public contracts, §44 due hook, §45 state transitions (DELIVERING→DELIVERED/FAILED); outputs HttpSink/KafkaSink, SPI registration, unified retry policy; consumed by §44 time wheel, when-app (test replacements), §53 integration.
- Learner-relevant: Shows how interface-first design (§39) allows implementation later without touching the core.

### 5–6-功能与接口契约

- Locator: `[[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#6-接口--契约设计]]`
- Summary: SPI loading flow and the interfaces to implement.
- Key claims: `META-INF/services/com.when.core.Sink` → `ServiceLoader.load(Sink.class)` → type→Sink map; `DefaultDueMessageHandler.onDue` reads the message, atomically transitions PENDING→DELIVERING (only the winner delivers); on success DELIVERED, retryable failure → PENDING + `nextAttemptAt` + re-enqueue via `TimeWheelRegistry`, non-retryable/exhausted → FAILED; `Sink` contract (type/validateConfig/deliver/healthCheck), `HttpSink`, `KafkaSink`, `RetryPolicy`, `DefaultDueMessageHandler`.
- Learner-relevant: Atomic delivery-claim as the mechanism preventing duplicate concurrent delivery.

### 7-字段与策略定义

- Locator: `[[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#7-字段--策略定义]]`
- Summary: Default retry policy and HTTP/Kafka result mapping.
- Key claims: max attempts 5; backoff 30s→1m→2m→4m→8m (exponential, cap 30 min); retryability from `DeliveryResult.retryable`; exhaustion → status FAILED with Redis retained; HTTP: 2xx success / 5xx timeout connection retryable / 4xx non-retryable; Kafka: send success / any exception retryable.
- Learner-relevant: A reusable default retry spec.

### 8-验收标准与测试

- Locator: `[[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#8-验收标准--必须有的测试自动化验收]]`
- Summary: Functional acceptance and required tests.
- Key claims: SPI loads both sinks; HTTP posts to a real endpoint with correct classification; Kafka payload reaches the topic and Producer is reused; retryable failures back off up to 5 times then FAILED; atomic DELIVERING claim and DELIVERED transition; `DefaultDueMessageHandler` replaces the test handler in production profile; tests: HTTP mock + Testcontainers Kafka end-to-end, retry N-5xx-then-2xx, 4xx no-retry, Producer reuse, concurrent delivery-claim.
- Learner-relevant: Test patterns for retry/backoff and single-consumer guarantees.

### 9–11-边界、Harness 与交付物

- Locator: `[[sources/geek-ai-agent/20260922/第49节：Sink 投递插件化——HTTP + Kafka（Loop 原料）.pdf#9-边界本节不做什么]]`
- Summary: Scope exclusions, Harness constraints, deliverables.
- Key claims: no time wheel/storage/cluster implementation; no other sinks (SPI left open); no DLQ/per-caller retry; code in `sink-spi`/`sink-http`/`sink-kafka` and delivery orchestration; tokens/credentials from env vars, never hardcoded/logged; delivery logs only message_id, target summary, result code (no payload, no sensitive headers); deliverables are both sinks + SPI declaration, DefaultDueMessageHandler, RetryPolicy, Producer cache, tests.
- Learner-relevant: Security discipline for outbound delivery plugins.
