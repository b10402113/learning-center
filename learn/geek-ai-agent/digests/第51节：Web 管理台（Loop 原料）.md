---
source: 第51节：Web 管理台（Loop 原料）
source_type: pdf
source_lines: 276
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第51节：Web 管理台（Loop 原料）

## Overview (L1)

- Purpose — deliver two parts: HTTP APIs (business `/api/v1` and admin `/admin/v1`) and a Vue operations console that only calls the admin APIs.
- Design rationale — this section supplies the previously missing HTTP server so business users can curl directly; the console is an independent static app talking to When over admin HTTP, decoupled from server deployment (CORS or reverse proxy); Vue3 + Element Plus chosen for MVP speed; "create time wheel" is an ops action routed to the §48 Controller so nobody edits ETCD by hand.
- Loop relation — Loop input producing backend HTTP APIs and a Vue console frontend; it is a protocol-conversion layer delegating to §45 (Submit/Query/Cancel), ETCD reads, and the Controller — no reimplementation of business flow.
- Dependencies — upstream: §45 query/cancel, §42 `/when/timewheels` metadata, §48 `Controller.createTimeWheel`, §50 Metrics, §43 cluster node view; downstream: §53 integration, ops routine inspection.
- Functionality and contracts — business API POST/GET/DELETE `/api/v1/messages`; admin API `GET/POST /admin/v1/timewheels`, `GET /admin/v1/messages`, `GET /admin/v1/messages/{id}`, `GET /admin/v1/cluster/nodes`, `GET /metrics`; two core pages (task list, delivery log) plus a time-wheel page.
- Fields and acceptance — list fields (message_id/status/created_at/deliver_at/sink_type/business_tag); times as Unix ms; acceptance includes create-time-wheel end-to-end reaching ETCD, filtering/pagination, and independent static deployment.
- Boundaries, Harness, deliverables — no core business logic, no full auth system (admin API must bind local/trusted network when unauthenticated), no full delivery-history storage; backend in `api/admin`; frontend a separate static project with whitelisted CORS (never `*`).

## Sections (L2)

### 1-这一节做什么

- Locator: `[[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#1-这一节做什么]]`
- Summary: One-line goal — provide business HTTP API + admin HTTP API and a Vue ops console using the admin API.
- Key claims: business API offers Submit/Query/Cancel; admin API offers time-wheel, message, and cluster views; the console is a standalone web app that views/creates time wheels, filters messages, and shows cluster nodes.
- Learner-relevant: Anchor for frontend/backend separation via API contracts.

### 2-为什么这么设计

- Locator: `[[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#2-为什么这么设计]]`
- Summary: Justifies adding the HTTP layer, Vue/Element Plus, create-time-wheel as a console feature, and server decoupling.
- Key claims: §40 gave gRPC transport, §45 gave application handlers, this section maps them to HTTP (business routes call §45; admin routes read ETCD and call Controller), doing only protocol/param/error-code mapping; HTTP is the missing server piece so business users can curl; Vue3 + Element Plus is fast for MVP (React also fine, not the point); create-time-wheel sends a request to the Controller (§48) which assigns M/S and writes ETCD; console compiles to static files for Nginx/CDN/object storage and depends only on API contracts (§12.1).
- Learner-relevant: Clear separation between protocol translation and business logic.

### 3–4-Loop 关系与依赖

- Locator: `[[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#4-依赖与被依赖]]`
- Summary: Loop task framing and dependency edges.
- Key claims: upstream §45 query/cancel, §42 metadata, §48 createTimeWheel, §50 Metrics, §43 cluster view; outputs business HTTP API, admin HTTP API, and a static Vue console; consumed by §53 and business callers.
- Learner-relevant: How a thin API layer composes existing module capabilities.

### 5–6-功能与交互 / 接口与契约

- Locator: `[[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#6-接口--契约设计admin-http-api]]`
- Summary: Feature↔API mapping and the concrete admin endpoints.
- Key claims: view time wheels `GET /admin/v1/timewheels` (tw_id/master/slave/status/sync_state/message_count); create `POST /admin/v1/timewheels` → Controller.createTimeWheel; messages `GET /admin/v1/messages?status=&tag=&from=&to=&page=`; detail `GET /admin/v1/messages/{id}` (status, times, retry info); cluster `GET /admin/v1/cluster/nodes`; business routes delegate to §45 (Submit/Query/Cancel); both business API and gRPC delegate to §45 without calling each other or reimplementing business logic; pagination via page/page_size is an MVP compromise.
- Learner-relevant: Endpoint contract design and delegation discipline.

### 7-字段与页面元素

- Locator: `[[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#7-字段--页面元素]]`
- Summary: Fields for the task-list, delivery-log, and time-wheel pages.
- Key claims: task list columns message_id/status/created_at/deliver_at/sink_type/business_tag/actions; delivery log shows basic info + timeline (attempt time, result, failure reason); time-wheel page shows tw_id/master/slave/status/sync_state/message_count; conventions — Unix ms times converted by the frontend date picker, status enums passed directly, MVP delivery log shows current status + latest error.
- Learner-relevant: Data-model-to-UI field mapping example.

### 8-验收标准与测试

- Locator: `[[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#8-验收标准--必须有的测试自动化验收]]`
- Summary: Functional acceptance and required tests.
- Key claims: time-wheel list returns correct fields; `POST /admin/timewheels` really creates via Controller (ETCD metadata appears and can be queried); message list supports status/tag/time filtering + pagination; detail returns status + (MVP) latest error; console renders/filters/pages; console deploys independently and accesses API via CORS/reverse proxy; tests: API integration, create-time-wheel end-to-end, frontend component tests.
- Learner-relevant: End-to-end test of a UI-triggered control-plane action.

### 9–11-边界、Harness 与交付物

- Locator: `[[sources/geek-ai-agent/20260922/第51节：Web 管理台（Loop 原料）.pdf#9-边界本节不做什么]]`
- Summary: Scope exclusions, Harness constraints, deliverables.
- Key claims: no core business-logic change; no full permission system (unauthenticated admin API must not be exposed publicly); no full delivery-history storage (MVP shows current status + latest error); backend in `api/admin` (mapping only), frontend a separate static project depending only on API contracts; security — admin API must not echo payload or sensitive sink_config, CORS whitelisted not `*`, later auth tokens injected from env/secret management; deliverables are the business API, admin API, Vue console pages, independent deployment config, and tests.
- Learner-relevant: Security posture for an ops console/API.
