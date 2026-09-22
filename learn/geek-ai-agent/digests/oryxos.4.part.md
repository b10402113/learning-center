---
source: oryxos
source_type: codebase
source_lines: 145505
language: java
file_count: 120
part: 4
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — oryxos (part 4)

## Overview (L1)

- `oryxos-storage` — persistence layer (`持久化层`): Spring Data JPA entities/repositories over SQLite (default) or PostgreSQL, with vendor auto-detection, Flyway dual-track migrations, AES-GCM secret-at-rest, and the shared-DB coordination (CAS) primitives used by the distributed mode. ~190 Java files, largest module in scope.
- `oryxos-tool` — the tool surface (`工具体系`): a single module holding built-in tools (file/shell/http/notify), the MCP client, the `ToolRegistry`, the `Sandbox` allowlist checker, user-interaction ports and the web-search port. Constitution principle VIII keeps built-in + MCP together.
- `oryxos-provider` — LLM provider adapter (`Provider 适配`): explicit `name → ChatModel` factory over Spring AI, schema-only tool translation, ordered fallback, pricing/cost and routing hooks. Small, self-contained.
- `oryxos-memory` — long-term memory (`长期记忆`): a `LongTermMemoryStore` plugin wall with three backends (Markdown / SQLite / Mem0) behind a `MemoryService` facade, plus a three-route (semantic + keyword + recency) RRF recall engine and an async vector index.
- `oryxos-knowledge` — knowledge base (`知识库`): local backend as the first contract plugin, a parse→chunk→embed→index pipeline with generations/double-buffering, pluggable `ChunkStore` + `DocumentParser` SPIs, and dual-route RRF retrieval.
- `oryxos-persona` — persona library (`人格库`): 12 read-only built-in presets on the classpath plus a user CRUD store under `.oryxos/personas/`, merged as a copy-in template catalog (not a shared by-name reference).

## Structure (L2)

### oryxos-storage — persistence module root

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-storage/src/main/java/io/oryxos/storage]]`
- Purpose: default zero-config SQLite persistence (with PostgreSQL as deployment option), one entity + JPA repository per domain table, and `Jpa*Store` adapters that implement `oryxos-core` contracts. Data is the durable half of the "stateless instance, external state" design.
- Key exports: `JpaSessionManager` (implements core `SessionManager`, whole conversation history JSON-serialized in `messages_json`, single canonical `sessionId(channel:user:profile)` join point, optimistic `saveIfUnchanged`), `JpaCoordinationStore` (implements core `CoordinationStore`; CAS triad: INSERT catches unique-constraint → conditional UPDATE claims expired lease → owner-only renew/release; DB `CURRENT_TIMESTAMP` as time base), `JpaProviderRegistry` (encrypts `api_key` on save / decrypts on read, lenient single-row decrypt failure), plus `JpaAgentExecutionStore`, `JpaScheduledTaskStore`, `JpaFlowRunStore`, `JpaTaskCheckpointStore`, `JpaNotifyChannelRegistry`, `JpaSandboxWhitelistStore`, `JpaToolInvocationAuditor`, `JpaLlmCallAuditor`, `JpaPricingStore`, `JpaCostLedgerStore`, `JpaVersionedAssetPointerStore`, `JpaSessionManager`, and service classes (`ApiKeyService`, `WebUserService`, `WebSessionService`, `TeamCatalogService`, `OrganizationCatalogService`, `TeamMembershipService`, `IdentityMappingService`, `ToolPolicyServiceImpl`).
- Dependencies: `oryxos-core` (all interfaces + value objects); Spring Data JPA, sqlite-jdbc, hibernate-community-dialects, flyway-core, postgresql, spring-security-crypto.
- Learner-relevant: how "swap the DB by URL" and "state outlives the process" work; why session IDs have one canonical construction; the encrypted-secret boundary; and the CAS lease primitive that later powers distributed claims.

### oryxos-storage/config — vendor auto-adaptation

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-storage/src/main/java/io/oryxos/storage/config/DataSourceVendorPostProcessor.java]]`
- Purpose: an `EnvironmentPostProcessor` (registered in `META-INF/spring.factories`) that inspects `spring.datasource.url`; when it starts with `jdbc:postgresql:` it blanks out the built-in SQLite-only defaults (driver, dialect, WAL/busy_timeout PRAGMA Hikari properties) at highest property-source priority so Spring Boot re-derives them from the URL.
- Key exports: `DataSourceVendorPostProcessor`.
- Dependencies: Spring Boot `EnvironmentPostProcessor` (no project imports).
- Learner-relevant: a clean pattern for "default-to-SQLite but accept PostgreSQL by editing only the URL" — config layering as a pluggability mechanism with a fail-safe no-op for the default.

### oryxos-storage/migration — Flyway dual-track schema evolution

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-storage/src/main/java/io/oryxos/storage/migration]]`
- Purpose: schema is managed by Flyway, not `hibernate.ddl-auto`. Two vendor directories mirror each change: `src/main/resources/db/migration/sqlite/` and `.../postgresql/` (V1 baseline, then V6–V24). SQLite has both SQL migrations (V7/V8/V23) and Java migrations for idempotent column adds.
- Key exports: `BaseSqliteMigration` (abstract `JavaMigration`; fixed version/description/checksum, `PRAGMA table_info` column probing to make V2–V6 idempotent across historical DB states), `SqliteMigrationsConfiguration` (registers Java migrations only under `@Conditional(OnSqliteDatasource)`), `ScheduleIdentityMigration` (332 lines), plus `AuditColumnsMigration`, `MemoryAgentColumnMigration`, `WebUserRolesMigration`, `OidcIdentityMigration`, `AssetGovernanceEventsMigration`, `AssetGovernanceRevisionsMigration`, `TeamMembershipsMigration`, `TeamsCatalogMigration`, `OrganizationsMigration`, `OrganizationsParentMigration`, `TeamsParentMigration`, `ApprovalEventsMigration`, `ApprovalInteractionMigration`, `DurableTaskCheckpointsMigration`, `FlowRunsMigration`, `FlowStepExpiresMigration`, `CostLedgerMigration`.
- Dependencies: flyway-core, `oryxos-core` (via storage), JDBC `Connection`/`Statement`.
- Learner-relevant: why one repo writes every change twice (two vendors, same version, append-only); Java migrations as the escape hatch for SQLite's limited `ALTER TABLE`; idempotency by introspection rather than by "run once".

### oryxos-tool/ToolRegistry — the single tool abstraction

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/ToolRegistry.java]]`
- Purpose: all tool sources (built-in `@Tool`, business `@Tool`, MCP, direct `OryxTool` implementations) converge into one `ConcurrentHashMap<String, OryxTool>` so the ReAct loop and `ToolExecutor` are source-agnostic. Two registration paths and a duplicate-name rejection (silent overwrite would make two sources fight).
- Key exports: `register(OryxTool)`, `registerAnnotated(Object)` (wraps Spring AI `ToolCallback`s via `AnnotatedToolAdapter`), `registerMcpTool(server, tool)` (also records MCP ownership for runtime `mcp_servers` allowlist checks), `unregister`, `asMap`/`mcpToolOwners` (deliberately live views, not snapshots), `filterByNames`.
- Dependencies: `oryxos-core` (`OryxTool`, `ToolResult`), Spring AI `ToolCallbacks`.
- Learner-relevant: the "registry + adapter" core of the tool system — prompt assembly, execution and the admin API all read the same live map, so a connected MCP server's tools appear immediately.

### oryxos-tool/AnnotatedToolAdapter + ToolModule

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/AnnotatedToolAdapter.java]]`
- Purpose: `AnnotatedToolAdapter` wraps a Spring AI `ToolCallback` (schema auto-generated) as an `OryxTool`; `call()` is the only place Spring AI reflection is used, and exceptions are left to `ToolExecutor` — no framework auto-execution path.
- Key exports: `AnnotatedToolAdapter`; `ToolModule` (a marker class documenting the module boundary: built-in tools + MCP + registry + sandbox, and that `SKILL.md` is not a tool but belongs to core `ContextLoader`).
- Dependencies: `oryxos-core`, `spring-ai-model`.
- Learner-relevant: the concrete enforcement of "Spring AI only generates schemas; our loop executes" — this adapter is where that boundary lives.

### oryxos-tool/builtin — built-in tool implementations

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/builtin]]`
- Purpose: process-internal tools annotated with `@Tool`. Every method's first act is `sandbox.enforce(...)`, so a failed check throws before any side effect.
- Key exports: `FileTools` (read_file/write_file/list_dir/edit_file/grep/glob; routes managed paths through `WorkspaceStorage`, re-checks the sandbox between validation and I/O, applies file guards `MemoryMdGuard`/`AdminConfigFileGuard`/`WorkspaceMutationGuard`), `ShellTools` (argv-passed commands, 30s default timeout, concurrent stdout/stderr drain before `waitFor`, recursive process-tree kill, 64 KB output cap), `HttpTools` (506 lines; GET default-open with SSRF block, POST allowlisted, no redirect following), `NotifyTools` (outbound `notify`), `WebSearchTools` (uses `SearchProvider`), `FormatTools`, `UtilTools`, `InteractionTools`, `PdfTextExtractor`.
- Dependencies: `oryxos-core` (`WorkspaceStorage`, guards), `oryxos-tool/sandbox`, Spring AI `@Tool`.
- Learner-relevant: why every tool is sandbox-first, how argv-not-shell avoids injection, and the operational edge cases (pipe-buffer deadlock, orphan process trees, context-window blowups).

### oryxos-tool/interaction — human-in-the-loop port

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/interaction]]`
- Purpose: abstracts asking the human a question, with a console implementation and an "unsupported/unavailable" fallback so headless runtimes fail readably.
- Key exports: `UserInteraction`, `ConsoleUserInteraction`, `UnsupportedUserInteraction`, `InteractionUnavailableException`.
- Dependencies: `oryxos-core` (interaction contracts).
- Learner-relevant: the port/adapter shape for approval flows — a tool can request confirmation without hardwiring a channel.

### oryxos-tool/mcp — Model Context Protocol client

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/mcp]]`
- Purpose: connects configured MCP servers at startup and on admin CRUD, lists their tools and registers each as an `OryxTool`, so a config file or an admin action adds tools without a rebuild. A failing server only WARNs (external availability is not this process's availability) and its partially-registered tools are unregistered + client closed.
- Key exports: `McpClientService` (connect/disconnect/status; transports `stdio` and `http`/SSE; 60s connect-probe ceiling; injectable client factory), `McpToolAdapter` (schema mapping + protocol forwarding, error → retryable `ToolResult`, 64 KB content cap), `McpConfigLoader` (yaml), `McpServerAdminService` (serialized write path).
- Dependencies: `io.modelcontextprotocol` SDK 0.18.3, SnakeYAML, `oryxos-core` MCP config/status types, `ToolRegistry`.
- Learner-relevant: the "zero-code tool" plug-in path — third-party tools enter through a protocol, not compiled code, and hot-add without restart.

### oryxos-tool/notify — outbound notification adapters

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/notify]]`
- Purpose: the symmetric counterpart to inbound channels — push content to a target. The interface carries no implementation-specific vocabulary, so new vendors are new classes only.
- Key exports: `NotifyChannelAdapter` (interface, `send(NotifyTarget, String)`), `NotifyPoster` (shared HTTP egress: redirects disabled, followed manually hop-by-hop with a sandbox check per hop, then parses vendor business codes `code`/`errcode`/`StatusCode` and fails loud on non-zero), `NotifyTarget`, and adapters `WebhookNotifyAdapter`, `EmailNotifyAdapter`, `FeishuNotifyAdapter`, `WeComNotifyAdapter`, `DingTalkNotifyAdapter`, `SlackNotifyAdapter`, `DiscordNotifyAdapter`, `TelegramNotifyAdapter`, `QqNotifyAdapter`, `GoogleChatNotifyAdapter`, `MatrixNotifyAdapter`, `MattermostNotifyAdapter`, `TeamsNotifyAdapter`, `WhatsAppNotifyAdapter`.
- Dependencies: `oryxos-tool/sandbox` (`Sandbox`, `ActionType.HTTP_REQUEST`), Spring Web, spring-boot-starter-mail.
- Learner-relevant: pluggability by interface-first design, plus why each HTTP redirect hop must re-pass the allowlist (SSRF-via-redirect bypass).

### oryxos-tool/sandbox — allowlist enforcement + isolation backends

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/sandbox]]`
- Purpose: the security foundation (constitution VI). `Sandbox.enforce(SandboxAction)` is the entry; `WhitelistSandbox` is the sole production implementation, routing by `ActionType` to file-path / executable / HTTP-domain / SMTP-endpoint checks; empty allowlists are deny-all. `ProcessStarter` abstracts *where* a command executes (local vs Docker) with a strict `destroy()` contract that must terminate the real body, not just the local handle.
- Key exports: `Sandbox`, `SandboxAction` (record type+target), `ActionType` (FILE_READ/FILE_WRITE/SHELL_COMMAND/HTTP_READ/HTTP_REQUEST/SMTP_SEND), `WhitelistSandbox` (633 lines; runtime-mutable allowlists, persistence-backed so admin edits survive restart, real-path boundary checks, wildcard domain matching, IPv4-mapped/NAT64 handling), `PermissiveSandbox` (demo-only, WARNs on every allow), `ProcessStarter`, `LocalProcessStarter`, `DockerProcessStarter` (composes `DockerRunSpec` + `CidfileProcessWrapper`, `docker kill` on destroy, fail-loud if the CLI is missing), `WorkspacePathMapper`, `ResolvedHttpReadGuard`, `PinnedHttpReadClient`, `SandboxDnsResolver`, `SandboxViolationException`, plus properties records `FileSandboxProperties`/`ShellSandboxProperties`/`HttpSandboxProperties`/`SmtpSandboxProperties`/`ExecutionBackendProperties`.
- Dependencies: `oryxos-core` (`RealPathBoundary`, `SandboxWhitelist`, `SandboxWhitelistStore`, `ToolExecutionContext`), docker CLI.
- Learner-relevant: application-layer (not JVM SecurityManager) sandboxing, read-vs-write HTTP asymmetry, and the ports pattern that lets shell execution move from local to a container without changing `ShellTools`.

### oryxos-tool/web — web search provider port

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-tool/src/main/java/io/oryxos/tool/web]]`
- Purpose: abstracts web search behind a `SearchProvider` port with a DuckDuckGo implementation.
- Key exports: `SearchProvider`, `DuckDuckGoSearchProvider`.
- Dependencies: `oryxos-tool/sandbox` (via `WebSearchTools`), Spring Web, httpclient5.
- Learner-relevant: one more example of "define the port, swap the vendor" — the same plug-in discipline applied to a data source.

### oryxos-provider — LLM provider adapters

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-provider/src/main/java/io/oryxos/provider]]`
- Purpose: implements core `ProviderService` on top of Spring AI while obeying the two hard rules — explicit `name → ChatModel` mapping (principle III) and Spring AI used only for protocol conversion + schema generation (principle II, `internalToolExecutionEnabled=false`). Adds ordered fallback, pricing/budget, metrics and routing.
- Key exports: `SpringAiProviderServiceImpl` (935 lines; per-attempt loop over `Attempt(provider, model)`, budget gate, fallback on switchable failures, audits one `llm_calls` row per attempt, caches `ChatModel` by config fingerprint), `ProviderChatModelFactory` (manual `OpenAiApi` construction for OpenAI-compatible endpoints, `/v1` normalization, forced HTTP/1.1, connect/read timeouts, retry collapsed to a single attempt, `mock` model), `ProviderEmbeddingModelFactory` (same build chain; wraps `OpenAiEmbeddingModel` as a core `TextEmbedder`, dimensions learned from first response), `FallbackClassifier` (switches on 5xx/429/401/403/408/timeouts, not 400-class; unknown → switch), `ProviderRegistryBootstrap` (seeds DB registry from config), `ProviderRegistryValidator`, `ProvidersProperties` (env-placeholder validation, fail-loud), `MockChatModel`, `MockEmbeddingModel`, `ToolSchemaAdapter` (translates `OryxTool` → schema-only `ToolCallback` whose `call()` always throws, a second guard against auto-execution), `ProviderNotFoundException`, `ProviderModule`.
- Dependencies: `oryxos-core` (ProviderService/Registry/Profile/cost/routing contracts), `spring-ai-openai`.
- Learner-relevant: the textbook case of "vendor neutrality" done by adapters + explicit routing, and why tool schemas are translated but never executed by the framework.

### oryxos-memory — long-term memory stack

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-memory/src/main/java/io/oryxos/memory]]`
- Purpose: the "interface wall" between memory semantics and storage. `LongTermMemoryStore` defines four behavioral contracts (no caching; core never truncated; write scope chosen by caller via `scope`; recall only over the archival region, degradable across capabilities); `MemoryService` is the facade; three backends swap behind it.
- Key exports: `LongTermMemoryStore` (port: `append`, `load`, `recallByKeyword`, `capabilities`, `archivalEntries`), `MemoryServiceImpl` (facade; routes recall by `MemoryRecallCapability`, enqueues only archival entries to the vector index after a successful write, scopes reads by Agent), `MemoryRecallEngine` (three-route semantic + keyword + recency fusion via core `RetrievalPipeline.fuseByRank`; degrades to two routes with a notice when the semantic route fails), `MemoryVectorIndex` (bounded 1-worker executor, daemon thread, queue-full discard, idempotent startup reconciliation, `entryHash = sha256(agent|ARCHIVAL|content)`), `MarkdownMemoryStore` (default; `## 核心记忆`/`## 归档记忆` sections, per-file locks, atomic writes, Agent-scoped `MEMORY.md`), `SqliteMemoryStore` (rows in `memory_entries`, SQL `LIKE`, archive `LIMIT`), `Mem0MemoryStore` (DELEGATED backend over a self-hosted mem0 server; `infer:false` for core, `infer:true` for archival, defensive metadata filtering), `InMemoryMemoryStore`, `DeferredTextEmbedder` (lazy embedder resolution so config errors surface at call time, not startup), `builtin/MemoryTools` (`save_memory`/`recall_memory`), `MemoryModule`.
- Dependencies: `oryxos-core` (MemoryService, MemoryScope, TextEmbedder, RetrievalPipeline), `oryxos-storage` (MemoryEntry/MemoryVector repositories), spring-web.
- Learner-relevant: the canonical plug-in example — same facade, three backends; plus hybrid retrieval (semantic+keyword+recency) and the "persist first, index asynchronously" trade-off (zero loss vs knowledge base's reject-on-failure).

### oryxos-knowledge — knowledge base pipeline

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-knowledge/src/main/java/io/oryxos/knowledge]]`
- Purpose: document knowledge base as a contract plugin. Import is two-stage (synchronous parse/validate, asynchronous chunk+embed), status flows PENDING → INDEXING → READY/FAILED; rebuilds use double-buffering (old generation serves while the new one builds, atomic switch, discard on failure). Retrieval is dual-route RRF (vector cosine ∥ keyword) with explicit degradation.
- Key exports: `LocalKnowledgeBackend` (implements `KnowledgeBackend` + `KnowledgeAdmin`; the default zero-dependency backend; per-KB generation reads, cross-KB top-K fusion, vector route disabled on embedder failure or model mismatch), `index/KnowledgeIndexService` (586 lines; pipeline, generations, cluster CAS claims via `knowledge_build_claims`, `MAX_FILE_BYTES=10MB`), `index/DocumentParser` SPI + `MarkdownParser`/`TextParser`/`PdfParser`, `index/Chunker` (heading-boundary-first, 1600-char cap), `store/ChunkStore` port + `SqliteChunkStore`/`InMemoryChunkStore`, `watch/KnowledgeWatcher` (non-recursive `WatchService` with recursive re-registration; GitOps-style reconcile, single-machine only), `builtin/KnowledgeTools` (`retrieve_knowledge`, structured JSON result that doubles as an evaluation hook).
- Dependencies: `oryxos-core` (KnowledgeBackend/Service contracts, RetrievalPipeline, TextEmbedder), `oryxos-storage` (chunk/document entities), pdfbox.
- Learner-relevant: a complete retrieval subsystem — parser SPI, chunking, embedding, dual-route retrieval, generations/double-buffering, and how it differs from memory's index trade-offs.

### oryxos-persona — persona library

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-persona/src/main/java/io/oryxos/persona]]`
- Purpose: two separate stores merged for display — 12 read-only built-in presets shipped on the classpath (auto-updated with the jar) and a user CRUD library under `.oryxos/personas/` (text files). Selecting a preset is a copy-in: the source text is imported as a draft, never referenced by name (explicitly not a "persona marketplace").
- Key exports: `PersonaPresetCatalog` (12 presets + `sourceContent`, metadata projected from frontmatter), `PersonaStore` (safe key regex, real-path boundary, atomic write, physical delete), `PersonaService` (`list`/`get`/`source`/`create`/`update`/`delete`; rejects CRUD on built-ins; bumps the personas workspace version).
- Dependencies: `oryxos-core` (`AgentMarkdown`, `RealPathBoundary`, `AtomicFiles`, `WorkspaceVersionNotifier`).
- Learner-relevant: a simple but complete CRUD plugin with a read-only + writable split, copy-in semantics, and workspace version notification for multi-replica reload.

## Cross-cutting patterns observed

- **Dependency inversion**: interfaces + value objects live in `oryxos-core`; every module here implements them (`SessionManager`, `ProviderService`, `MemoryService`, `KnowledgeBackend`, `CoordinationStore`, `Sandbox`), so upper layers never depend on these modules directly.
- **Ports & adapters (Strategy)**: `LongTermMemoryStore` (Markdown/SQLite/Mem0), `ChunkStore` (SQLite/InMemory/future pgvector), `DocumentParser` (md/txt/pdf), `Sandbox` (permissive/whitelist), `ProcessStarter` (local/docker), `NotifyChannelAdapter` (14 vendors), `SearchProvider`, `TextEmbedder`. Selection is by config key or constructor injection at assembly time.
- **Registry**: `ToolRegistry`, `ProviderRegistry`, `KnowledgeBackendRegistry` — one live map, duplicate registration rejected, consumers read the same view so admin changes take effect immediately.
- **Facade**: `MemoryServiceImpl` and `KnowledgeService` hide backend choice and orchestration from tools and the ReAct loop.
- **Adapter**: `AnnotatedToolAdapter`, `McpToolAdapter`, `ToolSchemaAdapter`, `SpringAiTextEmbedder` normalize foreign types into core abstractions.
- **Fail-closed security**: empty allowlists = deny-all; `PermissiveSandbox` warns on every allow; redirects re-checked per hop; API keys encrypted at rest and validated fail-loud.
- **Idempotent/atomic infrastructure**: Flyway dual-track + Java introspection migrations; `AtomicFiles` rename-on-write; generations and double-buffered index switch; CAS `CoordinationStore` claims; startup reconciliation for both memory vectors and knowledge watcher.
- **Explicit over implicit**: provider mapping is explicit (never bean-type scanning); Spring AI restricted to protocol + schema; write scope for memory is caller-specified.
- **Gradual degradation**: memory and knowledge retrieval drop the semantic route and annotate results when embedding is unavailable, never silently returning wrong ordering.
