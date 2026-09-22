---
source: 第40节：gRPC Server 与对外接口设计（Loop 原料）
source_type: pdf
source_lines: 566
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第40节：gRPC Server 与对外接口设计（Loop 原料）

## Overview (L1)

- What this section does (这一节做什么) — Defines the proto contract for the three When message operations (Submit / Query / Cancel) and builds a gRPC server skeleton that only does protocol conversion, basic validation, and delegation. First Loop material module; business logic (ID generation, persistence, routing, scheduling, delivery) belongs to later sections.
- Why designed this way (为什么这么设计) — proto is the language-neutral, single authoritative service contract; gRPC is chosen for internal node-to-node high-frequency calls (binary + strong typing), while HTTP is reserved for the management console/business callers. Contract first so downstream modules have stable interfaces.
- Relation to Loop (它和 Loop 的关系) — Sections 1–3 teach the problem; sections 4–11 form the executable Loop spec (inputs, decidable acceptance, boundaries, section-specific Harness). This is one of ten sections sharing an 11-part fixed skeleton that always cites §39 public contract.
- Dependencies & dependents (依赖与被依赖) — Upstream: §39 domain model `Message`, `MessageStatus`, `SinkType`, `SinkConfig` (imported from `when-common.proto`), and the §45 application handler. Downstream: §45 app layer, §51 HTTP API, and the Sink delivery section consume the contract.
- Features & interactions (功能与交互) — Three synchronous RPCs: Submit (message + delay/deliver time + Sink → global `message_id`, status PENDING), Query (by id → status + timestamps), Cancel (by id; already-delivered cannot be cancelled).
- Interface / contract design (接口/契约设计) — One `when-api.proto` imports `when-common.proto`; `DelayMessageService` with three RPCs and request/response messages; enums SinkType (HTTP/KAFKA) and MessageStatus (PENDING/DELIVERING/DELIVERED/FAILED/CANCELLED). Server depends on the injected `DelayMessageHandler` interface.
- Field definitions & validation (参数字段定义) — SubmitRequest field table and required Server-side validation rules (exactly one of deliver_at/delay_seconds, future time, 1s–30d range, sink_config branch matching sink_type, payload ≤ 64KB after decode); violations map to INVALID_ARGUMENT.
- Acceptance criteria + required tests (验收标准+必须有的测试) — Automated acceptance: proto compiles to Java stubs, server starts and reports SERVING, correct delegation/response mapping, INVALID_ARGUMENT / NOT_FOUND / FAILED_PRECONDITION error mapping; unit + integration tests listed.
- Boundaries & section-specific Harness (边界+专属Harness) — Does NOT implement ID generation, storage, time wheel, Sink delivery, routing, or HTTP API. Harness adds proto placement/package rules, generated-stub-do-not-edit, delegate-only impl, env-var secrets/ports, minimal dependencies.
- Deliverables (交付物清单) — `when-api.proto`, protobuf build config, `DelayMessageHandler` + test impl, `DelayMessageServiceImpl` skeleton, gRPC server bootstrap class, unit + integration tests.

## Sections (L2)

### what-this-section-does

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#what-this-section-does]]`
- Summary: Introduces the module scope — define the Submit/Query/Cancel proto contract and a gRPC server skeleton that only handles protocol processing and delegation.
- Key claims: When offers three message operations: submit a delayed message, query status, cancel an undelivered message; proto defines requests/responses and generates client + server code; the gRPC service only does protocol conversion, basic parameter validation, and delegation; message ID generation, persistence, routing, scheduling, delivery are implemented by later modules; node-to-node calls (routing forward, replica sync) also go over gRPC.
- Learner-relevant: Anchors the learner in the contract-first mindset and the transport-vs-application separation that the whole message-service module set builds on.

### why-designed-this-way

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#why-designed-this-way]]`
- Summary: Justifies proto as the authoritative contract and gRPC for internal node communication, explaining who uses gRPC vs HTTP and why the contract comes first.
- Key claims: proto is language-independent and generates client/server stubs; Submit/Query/Cancel fields are authoritative in proto, and the server, clients, and the §51 HTTP API all map to this operation semantics; When is a multi-node cluster with frequent node-to-node calls where gRPC's binary protocol and strongly-typed contract beat raw HTTP; the technical plan decision is "HTTP outside, gRPC inside"; gRPC is for node calls and internal clients while §51 provides HTTP for the console and business callers, sharing operation semantics but separate transport contracts; the transport contract is a shared dependency of client, gRPC service, and later application layer.
- Learner-relevant: Teaches protocol-selection reasoning (external vs internal) and why freezing a contract unblocks parallel module development.

### relation-to-loop

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#relation-to-loop]]`
- Summary: Explains the 11-part structure and how sections 4–11 form the executable Loop input spec.
- Key claims: the section contains both learner explanation and a directly executable module task spec; explicit inputs are function (§5), interaction/timing (§5), interfaces/proto (§6), and field params (§7); decidable acceptance is §8's criteria and mandatory tests that Loop uses each round to decide "done or not"; §9 boundaries keep Loop from modifying other modules; §10 is the section-specific Harness layered on the common Harness; §4 dependencies must also be given to Loop.
- Learner-relevant: Shows the anatomy of a Loop-ready module spec — the reusable spec template for later sections.

### dependencies

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#dependencies]]`
- Summary: Maps upstream and downstream dependencies of the section within the material chain.
- Key claims: upstream is §39's `Message`, `MessageStatus`, `SinkType`, strongly-typed `SinkConfig` (when-common.proto, imported not redefined), and the §45 application interface invoked by dependency injection; downstream `when-api.proto` (Submit/Query/Cancel + request/response messages) is consumed by §45 app layer and §51 HTTP API; payload/sink_type/sink_config semantics feed the Sink delivery section; the gRPC delegation boundary feeds §45; MessageStatus return semantics feed the management console; §40 defines transport format of sink_config/payload/sink_type, §45 converts requests to `Message`, §49 implements Sink, all joined via §39 public types.
- Learner-relevant: Demonstrates tracing a change's blast radius through a contract — a concrete dependency-graph reasoning exercise.

### features-and-interactions

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#features-and-interactions]]`
- Summary: Describes the three synchronous RPC operations and the server skeleton behavior of parse → validate → delegate → map response.
- Key claims: Submit takes a message + delay/deliver time + Sink and returns a globally unique `message_id` with status PENDING; Query takes `message_id` and returns current status and timing; Cancel cancels an as-yet-undelivered message while already-delivered ones cannot be cancelled; the server skeleton only does "parse request → basic validation → call injected application handler → map response"; tests use a test handler to verify gRPC calls, and §45 provides the real implementation.
- Learner-relevant: Gives the learner the request/response mental model (submit/query/cancel lifecycle) that later routing and state-machine sections elaborate.

### interface-contract-design

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#interface-contract-design]]`
- Summary: Presents the full `when-api.proto` structure and the `DelayMessageHandler` application interface.
- Key claims: one `when-api.proto` defines the service with three methods plus request/response messages; `SinkType`, `SinkConfig`, `MessageStatus` are imported from §39 `when-common.proto` and never redefined; submit and query fields include sink_config/payload/business_tag and status/timestamps/retry_count/last_error; `sink_config` is strongly typed (`oneof http / kafka`) so Sink impls get typed objects (url/headers/timeout_ms or bootstrap_servers/topic) instead of guessing map keys; `DelayMessageHandler` exposes `submit(SubmitCommand)`, `query(String)`, `cancel(String)`.
- Learner-relevant: Teaches proto organization (import vs redefine), strongly-typed oneof config, and the port/adapter boundary between transport and application layers.

### field-definitions-and-validation

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#field-definitions-and-validation]]`
- Summary: Enumerates SubmitRequest and Query/CancelResponse fields with constraints, and lists the mandatory server-side validation rules.
- Key claims: deliver_at (int64, Unix ms, must be in future) and delay_seconds (int32, 1s–2592000s) are mutually exclusive "pick one"; sink_type must be HTTP or KAFKA (not UNSPECIFIED); sink_config oneof branch must match sink_type (HTTP requires url, Kafka requires bootstrap_servers/topic; secrets injected via env); payload ≤ 64KB decoded; business_tag optional; message_id is global unique (Snowflake); status is one of five states; validation failures return INVALID_ARGUMENT naming the offending field; §40 checks only proto-expressible structural constraints while §49 checks runtime config such as URLs and Kafka addresses.
- Learner-relevant: A concrete worked example of contract-level vs runtime validation layering and error-code mapping.

### acceptance-and-tests

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#acceptance-and-tests]]`
- Summary: Lists decidable, automatable acceptance checks and mandatory tests that Loop uses to decide completion.
- Key claims: functional acceptance includes proto importing when-common and compiling to Java stubs, gRPC server starting on `${WHEN_GRPC_PORT}` and returning SERVING via gRPC Health Checking, Submit delegating and mapping correctly, invalid requests returning INVALID_ARGUMENT, "message not found" mapping to NOT_FOUND, and "not cancellable" mapping to FAILED_PRECONDITION; mandatory tests are unit tests for validation boundaries and delegation/exception mapping plus an integration test starting a real server+client and calling all three RPCs; acceptance only accepts "decidable assertions", not "coverage ≥ X%"; assertions go into the section-specific Harness and Loop may not modify them (§38).
- Learner-relevant: Models "judge by assertions" Loop acceptance design, distinct from coverage targets.

### boundaries-and-harness

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#boundaries-and-harness]]`
- Summary: Defines what the section must not do and the incremental Harness constraints layered on the common Harness.
- Key claims: does not implement message ID generation, state storage, time wheel scheduling, real Sink delivery, or cross-node routing (§41/§44/§45/§49); does not define `Message`, `SinkConfig`, or SPIs (§39); no HTTP API (§51) or auth/rate limiting; only proto, generated-code config, gRPC server, basic validation, handler delegation, and status-code mapping; stop condition is stable contract + stub generated + server starts + acceptance tests pass; Harness pins proto to `when-api/src/main/proto/`, package `when.v1`, Java package `com.when.api.grpc`, Maven dependency on when-common (no copying public proto), impl does only validate+delegate, secrets/ports via env vars, only gRPC-Java and protobuf official libs.
- Learner-relevant: Teaches scoping discipline (explicit non-goals + stop condition) that prevents Loop from overreaching across module boundaries.

### deliverables

- Locator: `[[sources/geek-ai-agent/20260922/第40节：gRPC Server 与对外接口设计（Loop 原料）.pdf#deliverables]]`
- Summary: Lists the artifacts expected at the end of the section.
- Key claims: `when-api/src/main/proto/when-api.proto` importing the public contract; build config (protobuf plugin) generating Java stubs together with when-common.proto; `DelayMessageHandler` interface plus a test-only implementation; `DelayMessageServiceImpl` skeleton (three methods, validation, delegation, error mapping); gRPC server bootstrap reading `${WHEN_GRPC_PORT}` and registering the service and health check; unit and integration tests; sections 4–11 are the module's Loop input spec.
- Learner-relevant: Provides a concrete deliverable checklist the learner can map to a Definition of Done.

