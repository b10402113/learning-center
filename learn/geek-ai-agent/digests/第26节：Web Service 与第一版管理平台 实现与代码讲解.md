---
source: 第26节：Web Service 与第一版管理平台 实现与代码讲解
source_type: pdf
source_lines: 482
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第26节：Web Service 与第一版管理平台 实现与代码讲解

## Overview (L1)

- Web Service 是什么 — the fifth base capability: `oryxos serve` starts Spring MVC on 8080 exposing 10 endpoints under `/api/v1` across six controllers, turning the internal engine into a REST surface any business system can call; the admin platform at `/admin` is a static Vue frontend over those same endpoints.
- 动手前先想清楚 — Controllers must stay thin and share `AgentService.process` with CLI; a single global exception exit with fixed status codes; core-phase non-goals (auth, SSE, WebSocket, rate limit, RBAC); `serve` must start from one provider key; the v1 admin platform is read-only.
- 代码怎么写 — enable virtual threads, write a thin `SessionApiController`, add `GlobalExceptionHandler` (400/404/500/503/504) reusing `ApiResponse`, generate OpenAPI via springdoc, and generate a Vue 3 read-only admin with a locked design-token prompt, distilled into the project skill `oryxos-admin-ui`.
- 验收 harness — `@WebMvcTest` slices (`SessionApiControllerTest`, `GlobalExceptionHandlerTest`) plus `WebSmokeIT`, with the key regression that internal exception details never leak into a 500 body.
- 怎么用，做完怎么验 — curl every endpoint, open `/admin` and `/swagger-ui`, then human checks: shared storage across entries, 503/504 fault injection, 200-concurrency, and no write entry points in the UI.

## Sections (L2)

### 一-Web-Service-是什么-干嘛用的

- Locator: `[[sources/geek-ai-agent/20260922/第26节：Web Service 与第一版管理平台 实现与代码讲解.pdf#一-Web-Service-是什么-干嘛用的]]`
- Summary: Web Service is OryxOS's outward facade — without it OryxOS is only a CLI tool. `oryxos serve` brings up Spring MVC on 8080 with 10 endpoints under `/api/v1` across six controllers: SessionApi (create / post message / get / delete), AgentApi (`invoke`, stateless full ReAct), ProfileApi (`/profiles`), MemoryApi (`/memory`, MEMORY.md), ToolApi (`/tools`), SystemApi (`/health`, `/info`). Business systems use two paths: create a Session for continuous dialogue, or `POST /agents/{name}/invoke` for one-shot. The admin platform is a static `/admin` frontend that only calls these 10 endpoints, which itself proves the API is a complete outward channel.
- Key claims: The 10 endpoints cover four jobs — session management, agent invocation, info queries, system status; every controller only validates parameters / wraps responses / handles errors and delegates all real logic to the core layer.
- Learner-relevant: Frames the "engine stable, add entries without touching it" theme and demonstrates API completeness by making the UI a pure consumer.

### 二-动手前先想清楚几件事

- Locator: `[[sources/geek-ai-agent/20260922/第26节：Web Service 与第一版管理平台 实现与代码讲解.pdf#二-动手前先想清楚几件事]]`
- Summary: Five decisions. (1) Controllers must be thin and share the same engine — `POST /sessions/{id}/messages` calls the same `AgentService.process` as `oryxos chat`; the temptation to "just add a bit of logic in the controller" is what breaks the architecture. (2) One exception exit — all six controllers hand errors to `GlobalExceptionHandler`, producing standard JSON (`errorCode`, `message`, `timestamp`): 400 params, 404 missing, 500 internal, 503 Provider failure, 504 on the 60s agent-call timeout. (3) Core-phase non-goals listed explicitly: auth (intranet assumption), SSE streaming, WebSocket, rate limiting, RBAC; only request-size guardrails (32KB message, last 100 history) are kept. (4) `serve` must start with a single provider key — Spring AI's `OpenAiAutoConfiguration` eagerly demands `spring.ai.openai.api-key`, so exclude it (same trick as excluding `DashScopeAutoConfiguration`), leaving `serve` to honor only `DEEPSEEK_API_KEY`. (5) Admin v1 is read-only — it can view sessions/Profile/Tool/memory/status but cannot create or edit Agents (that needs the 29/30 endpoints); no fake buttons.
- Key claims: Thin controller + shared engine; single exception exit with fixed error codes; no auth/streaming/rate-limit in core phase; admin platform read-only; excluding eager Spring AI autoconfiguration keeps startup to one key.
- Learner-relevant: The "think before you build" checklist and the principle that adding a facade must not fork the engine.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第26节：Web Service 与第一版管理平台 实现与代码讲解.pdf#三-代码怎么写]]`
- Summary: Step 1 enables `spring.threads.virtual.enabled: true` so each request runs on a virtual thread, and adds both `DashScopeAutoConfiguration` and `OpenAiAutoConfiguration` to `spring.autoconfigure.exclude`. Step 2 shows the typical controller (`SessionApiController.send`): validate `content` non-null and ≤32KB, load the session or throw 404, then call `agentService.process(session, req.content())`. Step 3 defines `GlobalExceptionHandler` on top of the existing `ApiResponse` envelope — `SessionNotFound/ResourceNotFound → 404`, `IllegalState/ProviderUnavailable → 503`, `AgentTimeout → 504`, `Exception → 500` with a generic message and no leaked internals. Step 4: the other endpoints are straight — `invoke` builds a one-off session, `/profiles`, `/tools`, `/memory`, `/health`, `/info`; OpenAPI auto-generated at `/swagger-ui`. Step 5 generates the admin platform from a prompt (Vue 3 + Vite, five left-nav pages over five GET endpoints, read-only, `base: '/admin/'`, build output to `static/admin/`, SPA fallback `/admin/** → index.html`).
- Key claims: The visual style is pinned to the website design tokens (`website/.vitepress/theme/custom.css`: dark bg `#000000`, orange `#f97316`, Inter/JetBrains Mono) and distilled into the project-internal skill `oryxos-admin-ui` rather than an external skill, because consistency comes from project-owned tokens; deliberately deferred: Profile CRUD, Memory writes, Webhook triggers, Prometheus metrics, and the `/api/v1/agents` CRUD (29/30's topic).
- Learner-relevant: Concrete facade code, the `GlobalExceptionHandler` response-hygiene pattern, and "prompt-to-frontend with a pinned token source" as a repeatable technique.

### 四-验收-harness

- Locator: `[[sources/geek-ai-agent/20260922/第26节：Web Service 与第一版管理平台 实现与代码讲解.pdf#四-验收-harness]]`
- Summary: The web layer uses `@WebMvcTest` slices that start only MVC and mock `AgentService` (fast, no model or DB). `SessionApiControllerTest` covers >32KB → 400, missing session → 404, and that `agentService.process` is called exactly once (controller adds no logic). `GlobalExceptionHandlerTest` (`@SpringBootTest` with real context, no model) checks each exception maps to the agreed status and a unified `ApiResponse` body, and that a 500 does not expose the internal exception message. `WebSmokeIT` hits `/health`, `/info`, `/profiles`, `/tools` on the real path to verify bean assembly and scanning.
- Key claims: The most valuable test asserts that internal details (e.g. a JDBC connection string) never appear in a 500 response; `WebSmokeIT` also catches a recurrence of the lesson-18 "Found 0 repositories" JPA scan bug at the web layer.
- Learner-relevant: A test-design pattern for response hygiene, controller thinness, and assembly smoke checks.

### 五-怎么用-做完怎么验

- Locator: `[[sources/geek-ai-agent/20260922/第26节：Web Service 与第一版管理平台 实现与代码讲解.pdf#五-怎么用-做完怎么验]]`
- Summary: After harness green, run human checks: `oryxos serve` then curl all 10 endpoints (including a real-model `POST /sessions/{id}/messages`) with audit records; confirm a CLI-created session is visible via `GET /sessions/{id}` (two push entries share storage); confirm 503 with Provider down and 504 on a >60s call (real fault injection the slice tests can't cover); run 200 concurrent invokes under virtual threads; confirm the admin's five pages render real data with no write entries and `/swagger-ui` is complete.
- Key claims: With this, all five core base capabilities have an outward exit, but the Agent is still "scattered parts" — the next two lessons pull the whole chain together (串联).
- Learner-relevant: The final human verification and the setup for the integration lessons.
