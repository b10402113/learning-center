---
source: 第50节：可观测体系搭建——Metrics 体系（Loop 原料）
source_type: pdf
source_lines: 327
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第50节：可观测体系搭建——Metrics 体系（Loop 原料）

## Overview (L1)

- Purpose — add Prometheus metrics, trace_id-structured logs, and liveness/readiness health checks so traffic, latency, failures, and failovers become observable.
- Design rationale — metrics fall into five classes (flow, inventory, quality, cluster, resource) with the "quality" class most important; no high-cardinality labels like `message_id`; trace_id stitches one message's life across nodes via MDC and gRPC metadata; two health endpoints separate liveness from readiness.
- Loop relation — module task spec cross-cutting modules 40–49; observability is the prerequisite for the run/integration sections (51–53) to "see problems".
- Dependencies — upstream: key paths of modules 40–49, §40 gRPC (metadata carries trace_id), §42/§43 cluster (election/switch metrics); downstream: §51 console, §52 deploy (Prometheus/K8s probes), §53 troubleshooting.
- Functionality and contracts — `Metrics` wrapper (incr/observe/gauge) over Micrometer; endpoints `GET /metrics`, `GET /health`, `GET /ready`, `POST /actuator/loggers/{logger}`; trace propagation submit → MDC → gRPC metadata (`x-trace-id`) → peer MDC.
- Fields and acceptance — metric table (submitted/delivered/in_state/lag/failure_rate/failover/elections/redis-etcd ops); acceptance includes five metric classes scrapeable, trace stitching across nodes, correct readiness semantics, runtime log-level changes.
- Boundaries, Harness, deliverables — no business-logic changes, no alerting/dashboards; centralized Metrics wrapper; logs/metrics must exclude payload, secrets, and sink_config sensitive values.

## Sections (L2)

### 1-这一节做什么

- Locator: `[[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#1-这一节做什么]]`
- Summary: One-line goal — establish metrics, logs, and health checks so runtime state and failures can be queried and verified.
- Key claims: three things — Prometheus metrics on `/metrics` (traffic/inventory/quality/cluster/resource), structured JSON logs (with trace_id tying a message's cross-node life together), health checks (`/health`, `/ready` for K8s probes).
- Learner-relevant: Anchor for the three pillars of observability.

### 2-为什么这么设计

- Locator: `[[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#2-为什么这么设计]]`
- Summary: Justifies five metric classes, trace_id stitching, and two health endpoints.
- Key claims: flow (in/out), inventory (per state/wheel), quality (delivery lag/duration/failure rate — most watched), cluster (elections/switch/join-leave for post-mortems), resource (Redis/ETCD calls); every key-path step has a metric, no high-cardinality labels (would blow up the time-series DB), all failure scenarios counted (技术方案 §13.1); Micrometer is the Java standard (Prometheus/Spring Boot Actuator compatible); a message may enter at node A and be scheduled/delivered at node B, so trace_id is generated at submit, carried via MDC and gRPC metadata (§13.2); `/health` = process alive, `/ready` = initialized and able to serve (§13.3).
- Learner-relevant: Why label cardinality control matters in metrics design.

### 3–4-Loop 关系与依赖

- Locator: `[[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#4-依赖与被依赖]]`
- Summary: Loop task framing and dependency edges.
- Key claims: Loop adds metric collection, structured log context, and health endpoints to each module; upstream is the key paths of 40–49 plus gRPC/cluster; outputs consumed by §51 console, §52 deploy, §53 troubleshooting.
- Learner-relevant: Observability as a cross-cutting concern with consumers downstream.

### 5–6-功能与接口契约

- Locator: `[[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#6-接口--契约设计]]`
- Summary: Behavior and interfaces.
- Key claims: metrics via Micrometer at key paths exposing Prometheus format; structured JSON logs with at least timestamp/level/logger/trace_id/node_id/msg (optional message_id/tw_id/duration_ms), trace_id local via MDC and cross-node via gRPC metadata, runtime-adjustable level via Actuator `/loggers`; `/health` 200 if alive, `/ready` 200 only when ETCD + Redis connected and at least one time wheel scheduling (else 503); `Metrics` interface (incr/observe/gauge), endpoints, trace propagation key `x-trace-id`.
- Learner-relevant: Interface-level patterns for tracing context propagation.

### 7-字段与指标定义

- Locator: `[[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#7-字段--指标定义节选对齐技术方案-131]]`
- Summary: Selected metric names, types, and labels.
- Key claims: `when_messages_submitted_total` (counter, sink_type), `when_messages_delivered_total` (counter, sink_type/status), `when_messages_in_state` (gauge, state), `when_delivery_lag_seconds` (histogram, sink_type), `when_sink_failure_rate` (gauge, sink_type), `when_master_failover_total` (counter, tw_id), `when_controller_elections_total` (counter), `when_redis_operations_total`/`when_etcd_operations_total` (counter, operation/status); hard rule — no high-cardinality labels like message_id.
- Learner-relevant: Concrete naming/labeling scheme for a metrics system.

### 8-验收标准与测试

- Locator: `[[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#8-验收标准--必须有的测试自动化验收]]`
- Summary: Functional acceptance and required tests.
- Key claims: five core metric classes exposed and scrapeable; actions increment counters; a cross-node message stitches via one trace_id; `/ready` 503 when ETCD/Redis down or no wheel scheduling, 200 when ready; runtime log-level change takes effect without restart; no high-cardinality labels; tests: metric-change, trace stitching (two nodes), readiness (disconnect→503, restore→200).
- Learner-relevant: How to test observability rather than assume it.

### 9–11-边界、Harness 与交付物

- Locator: `[[sources/geek-ai-agent/20260922/第50节：可观测体系搭建——Metrics 体系（Loop 原料）.pdf#9-边界本节不做什么]]`
- Summary: Scope exclusions, Harness constraints, deliverables.
- Key claims: no business-logic change, only instrumentation/logging/endpoints; no alert rules/dashboards (ops side, examples only in deploy); centralized `Metrics` wrapper so modules don't depend on Micrometer directly; instrumentation must not affect correctness or slow the key path; logs/metrics exclude payload/keys/sensitive sink_config; deliverables are the Metrics wrapper + five classes of instrumentation, structured logs + trace propagation, and the three endpoints + runtime log-level control.
- Learner-relevant: Security and performance constraints on instrumentation.
