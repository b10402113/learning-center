---
source: oryxos
source_type: codebase
source_lines: 145505
language: java
file_count: 100
part: 3
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — oryxos (part 3)

Scope: `oryxos-web/` (Java REST + admin backend and `src/main/frontend/` Vue app), `oryxos-boot/` (Spring Boot entry module), `oryxos-cli/` (Picocli CLI). Covers how a request flows from CLI/web into the core, the admin platform, and the frontend structure.

## Overview (L1)

- `oryxos-cli/` — Picocli command surface and the *actual* Spring composition root `OryxOsRuntime`; `oryxos chat/serve/gateway` boot the whole engine from here. Light commands (status/init/list) never start Spring; heavy commands do. 15 top-level subcommands.
- `oryxos-boot/` — packaging/launch module: a lean `OryxOsApplication` `@SpringBootApplication` plus `application.yml` (threads/SQLite/Flyway/feature flags/sandbox whitelist), one custom Actuator `WorkspaceHealthIndicator`, and the integration-test suite (`*IT`).
- `oryxos-web/` — the HTTP boundary: ~35 thin `@RestController`s under `/api/v1` + `/api/v2`, a unified `ApiResponse` envelope, `@RestControllerAdvice` error mapping, security filters (Basic Auth, API Key, RBAC), OIDC/SSO, SSE streaming, and the Vue 3 admin SPA hosted at `/admin/**`.
- `oryxos-web/src/main/frontend/` — one large `App.vue` (≈4.5k lines) acting as an imperative admin console (no vue-router), plus small feature modules (`features/*`) with API helpers, views, and `node --test` unit tests.

## Structure (L2)

### oryxos-boot/src/main/java/io/oryxos/boot

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-boot/src/main/java/io/oryxos/boot/OryxOsApplication.java]]`
- Purpose: Minimal Spring Boot launch class—`@SpringBootApplication(scanBasePackages = "io.oryxos")`, 11 lines, no business logic.
- Key exports: `OryxOsApplication#main`.
- Dependencies: none internal (pure Spring Boot).
- Learner-relevant: Demonstrates the "assembly module has no logic" rule; note the CLI's `OryxOsRuntime` is the entry actually used by `serve`/`gateway`/`chat`, so `OryxOsApplication` is a parallel/alternate boot path.

### oryxos-boot/src/main/java/io/oryxos/boot/WorkspaceHealthIndicator

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-boot/src/main/java/io/oryxos/boot/WorkspaceHealthIndicator.java]]`
- Purpose: Cached workspace probe for Actuator health; a stalled NFS call must not block HTTP health checks. Runs a background daemon probing every 5s, stores `Probe(available, checkedAt)`, marks down if stale (>15s), reload failures exist, or the version bus poll failed.
- Key exports: `health()`, `available()`, `probeOnce()`; implements `HealthIndicator`, `WorkspaceAvailability`.
- Dependencies: `io.oryxos.core.workspace.WorkspaceStorage`, `WorkspaceVersionPoller`, `AtomicFiles`.
- Learner-relevant: Good example of dependency-inverted health checks, cached-probe pattern, and not leaking internal paths/error messages through public endpoints.

### oryxos-boot/src/main/resources/application.yml

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-boot/src/main/resources/application.yml]]`
- Purpose: Central runtime config: virtual threads on, SQLite default + Flyway `{vendor}` migrations, graceful shutdown, sandbox whitelist (`file.allowed_paths`, `shell.allowed_commands`, `http.allowed_domains`), Actuator exposure, and feature flags for later subsystems.
- Key exports: `spring.*`, `oryxos.*` (providers/author/approval/flow/cluster/cost/routing/eval/web.auth/oidc), `management.*`, `springdoc.*`.
- Dependencies: consumed by Spring; references `DEEPSEEK_API_KEY`, `ORYXOS_MASTER_KEY` env vars.
- Learner-relevant: Shows fail-closed sandbox defaults ("empty list = deny-all"), Constitution principle II (excludes Spring AI eager auto-config), and the feature-flag-default-off discipline.

### oryxos-cli/src/main/java/io/oryxos/cli/OryxOsCli.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-cli/src/main/java/io/oryxos/cli/OryxOsCli.java]]`
- Purpose: Picocli `main` entry; declares all subcommands and version provider. "CLI is the door, not the worker"—parsing/help/errors delegated to Picocli, agent logic lives in the engine.
- Key exports: `OryxOsCli#main`, `VersionProvider`.
- Dependencies: `io.oryxos.cli.command.*` (Agent, Init, Status, Chat, Serve, Gateway, Profile, ProviderList, ToolList, SessionList, Knowledge, User, Org, Team, ApiKey).
- Learner-relevant: Canonical command-dispatch pattern; subcommands are nested `Command` classes.

### oryxos-cli/src/main/java/io/oryxos/cli/OryxOsRuntime.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-cli/src/main/java/io/oryxos/cli/OryxOsRuntime.java]]`
- Purpose: The real composition root (≈1.9k lines). `@SpringBootApplication(scanBasePackages="io.oryxos")` wiring every collaborator as explicit `@Bean`s: `ReActLoop`, `AgentService`, `SessionManager`, `ProviderRegistry`, CLI/channel factories, run-stream executor, metrics/OTel recorders. Core classes stay POJO/zero-framework (Constitution).
- Key exports: `reActLoop(...)`, `agentService(...)`, `registerEnterpriseChannelFactories`, `registerConsumerChannelFactories`, `liveProviderNames`, numerous `@Bean` methods.
- Dependencies: `io.oryxos.core.agent.*`, channels, storage, provider, tool, web, properties classes.
- Learner-relevant: Central map of how the whole engine is assembled; study this to see the synchronous ReAct runtime and explicit-mapping philosophy.

### oryxos-cli/src/main/java/io/oryxos/cli/command/ServeCommand.java & GatewayCommand.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-cli/src/main/java/io/oryxos/cli/command/ServeCommand.java]]`
- Purpose: Heavy commands that start the full runtime: both call `SpringApplication.run(OryxOsRuntime.class, ...)` then block on a `CountDownLatch`. `serve` sets `server.port` and advertises REST `/api/v1` + admin `/admin/`; `gateway` is the daemon skeleton.
- Key exports: `ServeCommand#run`, `ServeCommand.keepAlive`, `GatewayCommand#run`.
- Dependencies: `OryxOsRuntime`.
- Learner-relevant: Reference implementation of "light vs heavy command split"—only start Spring when the model/engine is needed.

### oryxos-cli/src/main/java/io/oryxos/cli/command/ChatCommand.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-cli/src/main/java/io/oryxos/cli/command/ChatCommand.java]]`
- Purpose: Boots `OryxOsRuntime` with `WebApplicationType.NONE` (no HTTP port), validates the provider registry, then hands control to `CliChannel.run(profileName, currentUser)`—the exact same `AgentService.process` entry as the web layer.
- Key exports: `run`, `validateProviderRegistry`, `currentUser`.
- Dependencies: `io.oryxos.channel.cli.CliChannel`, `ProviderRegistry`, `ProviderRegistryValidator`.
- Learner-relevant: Proves CLI and web share one core orchestration path; a clean example of channel abstraction.

### oryxos-cli/src/main/java/io/oryxos/cli/command (management subcommands)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-cli/src/main/java/io/oryxos/cli/command/ProfileCommand.java]]`
- Purpose: Subcommand families mirroring admin capabilities: `Profile` (list/create/show/delete an agent dir), `Org`/`Team` (create/rename/list/delete/set-parent/set-org/member-*), `User`, `ApiKey` (add/list/revoke), `Agent import`, `Knowledge list`, `Provider/Tool/Session list`. Nested static `@Command` classes with `Runnable#run`.
- Key exports: `ProfileCommand`, `OrgCommand`, `TeamCommand`, `UserCommand`, `ApiKeyCommand`, `AgentCommand`, `KnowledgeCommand`.
- Dependencies: `LightDbConfig`, `Workspace`, storage services.
- Learner-relevant: Shows CRUD parity between CLI and admin console and direct SQLite access via `LightDbConfig`.

### oryxos-cli (support: observability & startup guards)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-cli/src/main/java/io/oryxos/cli/MicrometerMetricsRecorder.java]]`
- Purpose: Runtime adapters and startup checks: `MicrometerMetricsRecorder`, `OtelSpanRecorder`/`OtelProperties` (trace/metrics), `WhisperHttpTranscriber` + `FfmpegAudioConverter` (voice), `ClusterStartupCheck`, `ToolPolicyStartupCheck`, `DockerBackendStartupCheck`, `WorkspaceStorageConfiguration`.
- Key exports: the classes above.
- Dependencies: Micrometer, OTel, StorageConfiguration, core policy/cluster.
- Learner-relevant: Illustrates the "fail fast on misconfiguration" pattern and pluggable metrics/OTel recorders injecting into core contracts.

### oryxos-web/src/main/java/io/oryxos/web/WebModule.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/WebModule.java]]`
- Purpose: 7-line marker class documenting the module: Spring MVC web layer, 10 core REST endpoints under `/api/v1`, no auth in core phase, no SSE in core phase (both later added).
- Key exports: `WebModule`.
- Dependencies: none.
- Learner-relevant: A commented "module thesis" file—useful as a starting anchor before reading controllers.

### oryxos-web (REST controller layer)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/controller/SessionApiController.java]]`
- Purpose: ~35 thin `@RestController`s. `SessionApiController` is the canonical one: create/list/history/archive sessions and `POST /{id}/messages`; when the client sends `Accept: text/event-stream` it delegates to `SseStreamSupport.stream` (SSE), otherwise a single JSON reply. Controllers only validate/wrap/delegate—no business logic; session identity is fixed to channel `web`.
- Key exports: `SessionApiController`, `AgentApiController`, `AgentRunApiController`, `AgentRunStreamController`, `AuthApiController`, `SystemApiController`, `ProviderApiController`, `SkillApiController`, `KnowledgeApiController`, `McpApiController`, `PolicyApiController`, `TeamsApiController`, `PersonaApiController`, `WorkspaceApiController`, `AuditApiController`, `ScheduleApiController`/`ScheduleV2ApiController`, plus 20+ others.
- Dependencies: `io.oryxos.core.*` services (`AgentService`, `SessionManager`, `ProfileRegistry`), `web.common.ApiResponse`, `web.security.*`, `web.sse.*`.
- Learner-relevant: The web-to-core seam; every endpoint routes into the same core services as the CLI. Prefix map (`/api/v1/...`) is a good API-surface index.

### oryxos-web/src/main/java/io/oryxos/web/common/ApiResponse.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/common/ApiResponse.java]]`
- Purpose: The single success/error envelope (`code`, `message`, `data`, `timestamp`) returned by every OryxOS REST endpoint. `code == 0` means success; errors carry an HTTP-status-like code.
- Key exports: `ApiResponse.ok(T)`, `ApiResponse.error(int, String)`.
- Dependencies: none.
- Learner-relevant: Consistency contract the frontend `unwrap()` helper depends on; central to understanding client/server interplay.

### oryxos-web/src/main/java/io/oryxos/web/GlobalExceptionHandler.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/GlobalExceptionHandler.java]]`
- Purpose: `@RestControllerAdvice` translating exceptions into stable status codes: 400 (validation/`ProfileValidationException`/knowledge import), 404, 403 (asset governance), 409 (skill/knowledge referenced, session conflict, schedule ambiguity, knowledge build in progress), 429 (turn wait timeout), 503 (provider/`IllegalStateException`), 504 (`AgentTimeoutException`), 500 catch-all. Sanitizes CR/LF to prevent log forging (CWE-117).
- Key exports: each `@ExceptionHandler`; `sanitize`.
- Dependencies: `web.common.ApiResponse`, `web.error.*`, core exceptions, `AssetGovernanceAccessException`.
- Learner-relevant: One place to learn the error taxonomy and why explicit JSON content-type is forced for SSE pre-stream failures.

### oryxos-web/src/main/java/io/oryxos/web/security

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/security/BasicAuthFilter.java]]`
- Purpose: Authentication/authorization boundary. `BasicAuthFilter` guards only `/admin/*` (SPA); `ApiKeyAuthFilter` guards `/actuator/**` (health subtree exempt); `RbacEnforcer` + `RequestActionResolver` map HTTP method/path to `Action`/`ResourceRef` and enforce RBAC; `RuntimeAgentGuard`/`AssetBindGuard` gate agent runs and skill/knowledge binding; `LoginAttemptService` throttles brute force; `PrincipalHolder` exposes the principal; session caches hold team/org ids. Startup checks (`ApiKeyStartupCheck`, `ProviderStartupCheck`, `RbacStartupCheck`, `AuthStartupCheck`, `RbacEndpointCoverageCheck`) fail fast on misconfiguration.
- Key exports: `BasicAuthFilter`, `ApiKeyAuthFilter`, `RbacEnforcer`, `RuntimeAgentGuard`, `AssetBindGuard`, `RequestActionResolver`, `LoginAttemptService`, `PrincipalHolder`, `*StartupCheck`.
- Dependencies: `oryxos-storage` (`WebUserService`, `WebSessionService`), `oryxos-core` (`AuthorizationService`, `Action`, `ResourceRef`, `TeamOrgLookup`), web config properties.
- Learner-relevant: Dependency-inverted auth—web adapts a core `AuthorizationService` decision rather than owning a permission matrix. Strong example of defense-in-depth filters plus fail-closed startup validation.

### oryxos-web/src/main/java/io/oryxos/web/config

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/config/WebConfig.java]]`
- Purpose: MVC and property configuration. `WebConfig` hosts the Vue SPA: serves `/admin/**` from `classpath:/static/admin/`, redirects `/admin`→`/admin/` and `/`→`/admin/`, and falls back any unmatched `/admin/**` path to `index.html` (SPA history), with immutable caching for hashed assets. Other classes register filters (`AuthFilterConfig`, `ApiKeyFilterConfig`), authorization (`AuthorizationConfig`), OIDC (`OidcConfig`), workspace publication (`WorkspacePublicationConfig`), and typed properties (`WebAuthProperties`, `WebRbacProperties`, `WebOidcProperties`, `WebApiKeyProperties`, `WebSseProperties`, `WebTeamsApiProperties`, `WebAssetGovernanceProperties`, `RoleMappingProperties`).
- Key exports: `WebConfig`, `*Config`, `*Properties`.
- Dependencies: `WebMvcConfigurer`, filters, `ObjectMapper`, storage user/session services.
- Learner-relevant: Shows how a compiled frontend is embedded in the fat JAR and served behind a filter-protected sub-path; the `/admin` vs `/api/v1` split is the key architectural boundary.

### oryxos-web/src/main/java/io/oryxos/web/sse

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/sse/SseStreamSupport.java]]`
- Purpose: Streaming agent replies. `SseStreamSupport` decides event-stream vs JSON, drives `AgentService.process` with an `SseStreamListener`, and `SseWriter` emits typed events; `AgentRunStreamController` separately streams run events via `SseEmitter` with persistent-event replay first (cursor/`Last-Event-ID`), then a bounded live queue + 15s heartbeats + terminal-event completion.
- Key exports: `SseStreamSupport`, `SseStreamListener`, `SseWriter`; `AgentRunStreamController#stream`.
- Dependencies: `core.agent.AgentService`, `AgentRunEventStore`, `AgentRunEventHub`, dedicated `agentRunStreamExecutor`.
- Learner-relevant: Practical SSE-at-scale pattern: replay persisted events, then subscribe live, with backpressure/overflow handling.

### oryxos-web/src/main/java/io/oryxos/web/oidc

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/oidc/OidcAuthService.java]]`
- Purpose: OIDC/SSO login (feature-flagged). `OidcAuthController`/`OidcAuthService`/`OidcPendingStore` implement the auth-code flow with pending-login state; `HttpOidcTokenClient` (behind `OidcTokenClient`) exchanges tokens; `OidcIdTokenClaims`/`OidcGroupClaims`/`OidcGroupRoleSync` map claims to roles and (optionally) JIT-provision users/teams/orgs.
- Key exports: `OidcAuthController`, `OidcAuthService`, `OidcTokenClient`, `OidcGroupRoleSync`, `OidcIdTokenClaims`.
- Dependencies: `oryxos-storage` user/team services, `WebOidcProperties`, Nimbus JOSE JWT.
- Learner-relevant: A complete enterprise SSO integration; shows claim→role→team/org mapping and the group-role sync contract.

### oryxos-web (auxiliary services: audit / provider / knowledge / workspace / skill)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/java/io/oryxos/web/audit/AuditMetricsService.java]]`
- Purpose: Web-side helper services: `audit/AuditMetricsService` + `audit/Redactor` aggregate/redact audit summaries (llm/tool/by-model/by-name/by-agent); `provider/ProviderModelsService` lists a provider's models; `knowledge/KnowledgeMetricsService` computes KB metrics; `workspace/WorkspacePublicationFilter` gates workspace publication; `skill/GithubFolderFetcher` imports skills from GitHub (with SSRF guard tests).
- Key exports: `AuditMetricsService`, `Redactor`, `ProviderModelsService`, `KnowledgeMetricsService`, `WorkspacePublicationFilter`, `GithubFolderFetcher`.
- Dependencies: storage repositories, core workspace/skill/knowledge contracts.
- Learner-relevant: Shows read-model/metrics services kept thin in the web layer while core holds the data contracts.

### oryxos-web/src/main/frontend (Vue 3 admin SPA)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/frontend/src/App.vue]]`
- Purpose: Admin console. `main.js` mounts `App.vue` (≈4.5k lines) which is the whole shell: a `TOP_NAV` (overview/agents/personas/schedules/skills/knowledge/audit) + `RUNTIME_NAV` (runs/sessions/providers/mcp/tools/notify/inbound/teams/identity-mappings/sandbox/tool-policy/approvals/exec-backend) menu, a reactive `active` key as an imperative router (no vue-router), per-page `{loading,error,data}` state, and `fetch` calls against `/api/v1/**` and `/api/v2/**`. Auth guard checks `/api/v1/auth/me` and falls back to `LoginView`. Markdown rendered with `marked` + `DOMPurify`.
- Key exports: `App.vue`, `main.js`, `LoginView.vue`.
- Dependencies: `features/*`, `chat-scroll.js`, `workspace-revision.js`, `mcp-timeout.js`, `skill-filter.js`; libs `vue`, `marked`, `dompurify`.
- Learner-relevant: A pragmatic single-file admin pattern (nav-as-state rather than a router); shows the full API surface the console exercises.

### oryxos-web/src/main/frontend/src/features (runs / teams / identity-mappings / approvals / governance)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/frontend/src/features/runs/run-api.js]]`
- Purpose: Extracted, testable feature slices. Each feature = `*-api.js` (plain fetch wrappers) + `*.vue` view + colocated logic with `node --test` tests. `runs` includes `run-state.js` (reducer-like state), `run-api.js` (EventSource `openRunStream` with reconnect), `RunWorkbenchView`/`RunManagementView`/`RunActivityList`; `teams` includes tree/org algorithms + drag-and-drop; `identity-mappings`, `approvals`, `governance` (revision history/diff) follow the same shape.
- Key exports: `openRunStream`, `createWorkbenchState`, `applyEvents`, `listAllRunEvents`; `tree-dnd.js`, `org-tree.js`, `team-tree.js`; `approvals-api.js`, `identity-mappings-api.js`, `governance-revisions-api.js`.
- Dependencies: `workspace-revision.js` (optimistic-concurrency revision headers), `chat-scroll.js`, `skill-filter.js`.
- Learner-relevant: Refactoring pattern—pull logic out of the monolith `App.vue` into pure functions with unit tests; the SSE reconnect loop and revision-header concurrency are the most reusable lessons.

### oryxos-web (frontend build & delivery)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-web/src/main/frontend/vite.config.js]]`
- Purpose: Vite builds the SPA to `../resources/static/admin` with `base: '/admin/'`; dev proxy forwards `/api` to `localhost:8080`. `oryxos-web/pom.xml` drives `frontend-maven-plugin` (installs Node v20, runs npm) in `generate-resources`, skippable via `-Dfrontend.skip=true`.
- Key exports: `vite.config.js`, `package.json` scripts (`dev`, `test`, `build`), pom plugin config.
- Dependencies: `@vitejs/plugin-vue`, Vue 3.
- Learner-relevant: Full-stack-in-one-JAR build pipeline; explains why `/admin/**` serves the compiled assets.
