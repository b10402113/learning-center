---
source: oryxos
source_type: codebase
source_lines: 145505
language: java
file_count: 410
part: 1
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — oryxos (part 1)

Scope: the agent-engine packages of `oryxos-core`, under
`oryxos-core/src/main/java/io/oryxos/core/` — `agent`, `execution`, `provider`,
`context`, `memory`, `sandbox`, `session`, `profile`, `skill`, `io`, `notify`,
`channel`, `mcp`, plus the root tool contracts (`OryxTool`, `ToolResult`) and
the cross-cutting engine packages (`policy`, `durable`, `cluster`, `metrics`,
`auth`, `fs`, `routing`, `cost`, `workspace`, `secret`, `retrieval`,
`embedding`, `eval`, `flow`, `knowledge`). This is the heart of OryxOS: a Java
21 / Spring Boot agent OS whose contracts live in `oryxos-core` and whose
implementations live in downstream modules (storage, provider, tool, channel
adapters) by dependency inversion.

## Overview (L1)

- `OryxTool` / `ToolResult` (root) — the single tool abstraction (`getName`,
  `getDescription`, `getInputSchema`, `execute(JsonNode)`) and its result
  record (`success`, `content`, `errorMessage`, `retryable`). Everything a
  model can call implements this.
- `agent` — the brain: self-written `ReActLoop`, `PromptBuilder`, `ToolExecutor`,
  `AgentService` (session orchestration + locking + trace + turn leases),
  `AgentExecutionService` (async run history / cancel / approval suspend),
  `AgentLoader`/`AgentStore`/`AgentLifecycleService` (one directory = one
  Agent), `AgentScheduler` (cron), run-event streaming, and thread-context
  holders (`ProfileContext`, `TraceContext`, `ToolExecutionContext`,
  `AgentRunExecutionContext`, `ExecutionContext`).
- `provider` — LLM contract: `ProviderService` (`chat` / `chatStream`),
  `ProviderRequest`/`ProviderResponse`/`ToolCallRequest`/`Usage`, explicit
  runtime registry (`ProviderRegistry` + `ProviderDef`), `LlmCallAuditor`.
- `context` — `ContextLoader`: builds the system prompt from `identity.prompt`,
  persona block, `AGENT.md` body, bound Skill metadata, bound knowledge metadata,
  output directory hint, and bootstrap files; no caching by design.
- `memory` — `MemoryService` facade (core/archival scopes, `remember`,
  `recall`, `readAll`), `MemoryMdGuard` (writes to `MEMORY.md` only via
  `save_memory`), recall-capability tri-state.
- `sandbox` — whitelist contracts only: `SandboxWhitelist` (FILE/SHELL/HTTP/
  SMTP query/add/remove) and `SandboxWhitelistStore` (persistence); checker
  implementation lives in `oryxos-tool`.
- `session` — `Session` (append-only message log, turn windowing), `Message`
  (OpenAI tool-call pairing + multimodal media), `SessionManager` (three-tuple
  id, conditional save, archive/clear/stats), media mime sniffers.
- `profile` — `Profile` (immutable agent config projection), `ProfileLoader`
  (YAML + `${ENV}` + cron/zone validation), `ProfileRegistry` (mutable runtime
  index).
- `skill` — global reusable instruction library: `Skill`/`SkillService`/
  `SkillLoader`/`SkillRegistry`/`SkillStore` with seeded builtins, plus
  `AgentSkillBindingService` (symlink single-source-of-truth bindings).
- `io` — `AtomicFiles`: temp-file + `ATOMIC_MOVE` workspace publish.
- `notify` — global notification outlets: `NotifyChannelRegistry` +
  `NotifyChannelDef`.
- `channel` — inbound IM shared contract and orchestration:
  `InboundChannelAdapter`, `InboundMessage`, `InboundMessageService` (dedup →
  route → P2P/group split → reply → audit), `ChannelAdminService`,
  `ChannelConfig(Loader)`, media download/sniffing, channel lease coordination.
- `mcp` — MCP contracts: `McpServerConfig`, `McpServerAdmin`, `McpServerStatus`,
  `McpCatalog` of well-known community servers.
- Cross-cutting engine packages (L2 below) — `policy` (tool policy + approval +
  authorization gates), `durable` (approval-suspend state machine), `cluster`
  (CAS leases / distributed coordination), `metrics` (recorder + OTel span
  contracts), `auth`, `fs` (real-path boundary), `routing` (cost/sensitivity
  model routing), `cost` (budget ledger), `workspace`, `secret`, and the
  retrieval/embedding/eval/flow/knowledge support packages.

## Structure (L2)

### OryxTool + ToolResult (tool contract, root package)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/OryxTool.java]]`
- Purpose: the one interface every callable capability implements; schema is raw
  JSON text consumed by the Provider's function-calling translation.
- Key exports: `OryxTool.getName/getDescription/getInputSchema/execute`;
  `ToolResult(boolean, String, String, boolean)` + `ok`/`error` factories.
- Dependencies: Jackson `JsonNode` only.
- Learner-relevant: the extension point for built-in tools, MCP tools and
  `@Tool` Spring beans; shows how a tool result is modeled as
  success/content/error/retryable.

### agent/ReActLoop

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/ReActLoop.java]]`
- Purpose: the hand-written ReAct main loop (constitution I) — assemble prompt,
  call model, append assistant turn, execute each tool call, repeat to
  `maxIterations`, with convergence hint and interrupt checks.
- Key exports: `run(Session, userMessage, Profile[, media][, StreamListener])`,
  `MAX_ITERATIONS_REPLY`, `INTERRUPTED_REPLY`; publishes `AgentRunEvent`s.
- Dependencies: `PromptBuilder`, `ProviderService`, `ToolExecutor`,
  `InterruptManager`, `AgentRunEventPublisher`, `AgentRunExecutionContext`.
- Learner-relevant: the canonical "LLM + tools + memory + loop" engine; open it
  to see why tool execution is kept out of the loop and why every turn is
  appended before stopping.

### agent/PromptBuilder

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/PromptBuilder.java]]`
- Purpose: composes the four-part prompt in fixed order — system (ContextLoader
  + datetime + memory), structured history (last N turns), and tool list; also
  prunes historical media and hides policy/approval-denied tools.
- Key exports: `build(Session, Profile)`, `pruneHistoricalMedia`, setters for
  `ToolPolicyService` / `ApprovalPolicyService`.
- Dependencies: `ContextLoader`, `MemoryService`, `ToolPolicyService`,
  `ApprovalPolicyService`, `Profile`.
- Learner-relevant: the concrete answer to "what exactly goes into an Agent's
  context window each turn", including progressive disclosure and
  least-privilege tool visibility.

### agent/ToolExecutor

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/ToolExecutor.java]]`
- Purpose: the only execution path for tools; layers runtime authorization →
  MCP-server whitelist → tool policy (proactive + at-execution) → approval gate
  (with durable suspend) → sandbox hook, then audits every attempt.
- Key exports: `execute(sessionId, agentName, ToolCallRequest)`; `setToolPolicy`,
  `setApprovalPolicy`, `setAuthorizationService`, `setDurableTaskService`,
  `setMetricsRecorder`, `setSpanRecorder`.
- Dependencies: `ToolInvocationAuditor`, `ProfileRegistry`, `ToolPolicyService`,
  `ApprovalPolicyService`, `AuthorizationService`, `DurableTaskService`,
  `MetricsRecorder`, `SpanRecorder`, `ApprovalGrantContext`.
- Learner-relevant: the layered security story of an Agent OS — policy subtracts
  tools, approval gates risky calls, sandbox constrains resources, audit tables
  record everything, all orthogonal.

### agent/AgentService

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentService.java]]`
- Purpose: orchestrates one turn — per-session in-process lock + cross-replica
  turn lease, `ProfileContext`/`TraceContext` lifecycle, re-read session under
  lock, run the loop, save with conditional update, record turn span.
- Key exports: `process(...)` (stateful), `processStateless(...)` (one-shot
  invoke, group chat), `setSpanRecorder`.
- Dependencies: `ProfileRegistry`, `ReActLoop`, `SessionManager`,
  `TurnCoordinator`, `TraceContext`, `ProfileContext`, `RunOutputContext`,
  `SpanRecorder`, `ExecutionContext`.
- Learner-relevant: how stateful conversation, concurrency safety, audit tracing
  and distributed correctness are stitched into one entry point.

### agent/AgentExecutionService + AgentExecution + stores

- Locators:
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentExecutionService.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentExecution.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentExecutionStore.java]]`
- Purpose: asynchronous run triggering + execution history. Persists a record
  and returns an id immediately, runs the work on a virtual thread, then
  finalizes success/failure/cancel/`WAITING_APPROVAL`; reconciles orphaned
  non-terminal runs on startup.
- Key exports: `triggerAsync`, `cancel`, `reconcileOnStartup`,
  `attachScheduledRun`, `completeScheduledRun`, `history`; `AgentExecution`
  status/terminal/cancellable; `AgentExecutionStore.start/finish/tryFinish`.
- Dependencies: `ExecutorService` (virtual threads), `AgentRunEventPublisher`,
  `TraceContext`, `PrincipalContext`, `ApprovalSuspendedException`.
- Learner-relevant: a small, complete durable-execution model — async trigger,
  cancel, approval suspension, restart reconciliation.

### agent/AgentLoader + AgentStore + AgentLifecycleService + AgentMarkdown

- Locators:
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentLoader.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentStore.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentLifecycleService.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentMarkdown.java]]`
- Purpose: "one directory = one Agent". `AgentMarkdown.split` separates YAML
  frontmatter from body; `AgentLoader` derives a validated `Profile` from
  `.oryxos/agents/<name>/AGENT.md`; `AgentStore` writes/archives the directory
  under real-path guards; `AgentLifecycleService` unifies API create /
  watcher event / startup scan, scaffolds files, rolls back failed creates, and
  can ask an LLM to author a draft Agent.
- Key exports: `AgentLoader.loadAll/deriveProfile/parse`, `AgentStore.read/
  writeAll/archive/snapshot/restore`, `AgentLifecycleService.register/create/
  update/delete`, `AgentMarkdown.split/removeLegacySkills/knowledgeSidecar`.
- Dependencies: `ProfileLoader`, `ProfileRegistry`, `AgentSkillBindingService`,
  `McpServerAdmin`, `NotifyChannelRegistry`, `RealPathBoundary`,
  `AtomicFiles`/`RecoverableFiles`.
- Learner-relevant: the filesystem-as-configuration model and how a directory
  becomes a runtime Agent with generated scaffolding and safe rollback.

### agent/AgentScheduler + ScheduledTaskStore

- Locators:
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentScheduler.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/ScheduledTaskStore.java]]`
- Purpose: cron scheduling of Agent runs via the same `AgentService` entry
  point; stable global `scheduleId`, per-schedule overlap locks, generation
  tracking, system principal for authorization, persistent next-run/enabled
  state and execution history.
- Key exports: `AgentScheduler` schedule/reconcile/cancel methods,
  `ScheduledTaskStore.reconcile/recordExecution/setEnabled/executions`.
- Dependencies: Spring `TaskScheduler`/`CronTrigger`, `ProfileRegistry`,
  `AgentService`, `AgentExecutionService`, `PrincipalContext`.
- Learner-relevant: how scheduled autonomous runs stay exactly-once and
  identity-bearing in a multi-replica world.

### agent/run events + context holders

- Locators:
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentRunEvent.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentRunEventHub.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/AgentRunEventPublisher.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/TraceContext.java]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/agent/ToolExecutionContext.java]]`
- Purpose: append-only run event store + in-process pub/sub for SSE (persist
  first, then wake subscribers, fail-open); thread-local carriers for trace id
  (also MDC), current Agent name/backend/container, current run id.
- Key exports: `AgentRunEvent`, `AgentRunEventHub.emit/subscribe`,
  `AgentRunEventPublisher.publish/publishCurrent`, `TraceContext.open/
  openIfAbsent/current`, `ToolExecutionContext.setAgentName/agentName/
  setExecution`, `ProfileContext`, `AgentRunExecutionContext`,
  `ExecutionContext`, `RunOutputContext`.
- Dependencies: `AgentRunEventStore` (JPA), SLF4J MDC, `ConcurrentHashMap`.
- Learner-relevant: the ThreadLocal context pattern (set at entry, clear in
  finally) that carries identity/trace across the whole turn, and why it is safe
  under virtual threads but requires discipline on reused platform threads.

### provider

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/provider]]`
- Purpose: LLM access contract and value objects; a runtime-CRUD provider
  registry keyed by name (explicit mapping, never type-scanning), plus audit and
  pricing hooks.
- Key exports: `ProviderService.chat/chatStream`, `ProviderRequest`,
  `ProviderResponse`, `ToolCallRequest` (id-paired), `Usage`, `ProviderDef`,
  `ProviderRegistry`, `LlmCallAuditor`, `ModelPricing`/`PricingStore`.
- Dependencies: `Profile`, `OryxTool`, `session.Message`; implementation
  (`SpringAiProviderServiceImpl`) lives in `oryxos-provider`.
- Learner-relevant: the provider-abstraction boundary and why streaming is a
  default-method fallback rather than a separate async path.

### context/ContextLoader

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/context]]`
- Purpose: assembles the system prompt every turn with zero caching: identity
  prompt, fixed-template persona block, `AGENT.md` body, bound Skill metadata
  (+ local `SKILL.md` path for `read_file`), bound knowledge metadata (+
  retrieval guidance), absolute output dir, bootstrap files.
- Key exports: `ContextLoader.load(Profile)`, `appendSkills/appendKnowledge/
  appendOutputDir`, `renderPersona`.
- Dependencies: `AgentMarkdown`, `AgentSkillBindingReader`,
  `KnowledgeBindingService`, `Profile`, `RunOutputContext`.
- Learner-relevant: progressive disclosure in practice — metadata in prompt,
  bodies loaded on demand, volatile files re-read each turn.

### memory

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/memory]]`
- Purpose: memory facade and guardrails. `MemoryService` hides whether storage
  is a file, local DB or external service; `MemoryMdGuard` forbids direct writes
  to `MEMORY.md` (lexical + symlink-resolved checks); scopes CORE (always
  present) vs ARCHIVAL (truncated).
- Key exports: `MemoryService.buildContext/remember/recall/readAll`,
  `MemoryScope`, `MemoryRecallCapability` (KEYWORD / HYBRID_BUILTIN /
  DELEGATED), `MemoryEntryView`, `MemoryMdGuard`.
- Dependencies: `Session`, `RealPathBoundary`; implementation in
  `oryxos-memory`.
- Learner-relevant: an interface wall between prompt assembly and memory backend
  choices, and why memory writes must be funneled through one tool.

### sandbox

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/sandbox]]`
- Purpose: the runtime-management and persistence contracts for the four
  allowlists (file path, shell command, HTTP domain, SMTP endpoint); the actual
  checker lives in `oryxos-tool`.
- Key exports: `SandboxWhitelist.list/add/remove` + `Category`,
  `SandboxWhitelistStore.loadAll/add/remove` + `Entry`.
- Dependencies: none beyond JDK; JPA impl in `oryxos-storage`.
- Learner-relevant: the "no SecurityManager, use path/pattern allowlists"
  decision and the warning that dynamically editing allowlists equals editing a
  security rail.

### session

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/session]]`
- Purpose: conversation state and persistence contract. `Session` is an
  append-only `Message` log with turn windowing; `SessionManager` owns the
  `channel+user+profile` id join in exactly one place, conditional saves,
  archive/clear/stats; media sniffers detect image/PDF/audio/video types by
  magic bytes.
- Key exports: `Session.appendUser/appendAssistant/appendToolResult/
  recentTurns/retainRecentTurns`, `Message` + `ToolCall`/`MediaPart`,
  `SessionManager.getOrCreate/saveIfUnchanged/archive/clearHistory/listRecent/
  stats`, `ImageMime`, `InboundMediaExt`, `SessionSummary`, `SessionStats`.
- Dependencies: `ToolResult`, `ProviderResponse`, `ToolCallRequest`.
- Learner-relevant: structured (not flattened) history with OpenAI tool-call
  pairing is what makes multi-step ReAct converge, and conditional saves prevent
  cross-process lost updates.

### profile

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/profile]]`
- Purpose: immutable agent configuration and its validated loading. `Profile`
  holds identity, persona, provider ref (+ ordered fallbacks), tools, MCP
  servers, channels, notify channels, schedules, bootstrap, settings and
  sandbox override; `ProfileLoader` does YAML parsing, `${ENV}` resolution,
  cron/zone validation and strict error messaging; `ProfileRegistry` is a
  mutable concurrent index shared by startup scan and runtime CRUD.
- Key exports: `Profile` (+ nested `Identity`, `Persona`, `ProviderRef`,
  `NotifyChannel`, `ScheduleConfig`, `Settings`, `Sandbox`),
  `ProfileLoader.loadAll/fromMap`, `ProfileRegistry.get/all/register/remove`.
- Dependencies: SnakeYAML, Spring `CronTrigger`.
- Learner-relevant: a fully worked example of fail-loud config validation and
  backward-compatible record evolution via overloaded constructors.

### skill

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/skill]]`
- Purpose: global Skill library (`.oryxos/skills/<name>/SKILL.md`, frontmatter
  name/description + body) with CRUD, builtin seeding, import from markdown or a
  directory, and the symlink binding layer that is the single truth source for
  Agent→Skill binding.
- Key exports: `Skill`, `SkillService.create/update/delete/importMarkdown/
  importFiles/seedBuiltins`, `SkillLoader`, `SkillRegistry`,
  `SkillStore.writeAll/archive`, `AgentSkillBindingService.bind/unbind/
  replaceBindings/inspect/reconcile/references`, `SkillMetadataReader`.
- Dependencies: `AgentMarkdown`, `RealPathBoundary`, `AtomicFiles`,
  `WorkspaceVersionNotifier`, `SkillReferencedException`.
- Learner-relevant: a rigorous, safe binding model — relative fixed-target
  symlinks, real-path validation, dangling/escaped/name-mismatch detection,
  atomic replace with rollback, and refusal to delete referenced skills.

### io/AtomicFiles

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/io]]`
- Purpose: atomic workspace writes — write a same-directory temp file, then
  `ATOMIC_MOVE` into place; fail loudly if the FS lacks atomic move rather than
  silently degrading.
- Key exports: `AtomicFiles.write(Path, byte[])`, `write(Path, ContentWriter)`,
  `writeString(Path, String)`.
- Dependencies: JDK NIO only.
- Learner-relevant: the primitive that makes shared-volume multi-replica
  workspace writes safe (no half-written files, no reliance on file locks).

### notify

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/notify]]`
- Purpose: globally named notification outlets referenced by Agents through the
  `notify` tool; mirrors the tool registry shape.
- Key exports: `NotifyChannelRegistry.list/find/exists/save/delete`,
  `NotifyChannelDef` (name, type webhook/feishu/wecom/dingtalk/email, url,
  description, extra config map).
- Dependencies: none; JPA impl in `oryxos-storage`, adapters in `oryxos-tool`.
- Learner-relevant: the "global registry + by-name reference" pattern reused for
  tools, providers and notification channels.

### channel

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/channel]]`
- Purpose: inbound IM contract + shared orchestration. Adapters only convert
  platform protocol to the normalized `InboundMessage` and manage connection
  lifecycle; all dedup/routing/P2P-vs-group/reply/audit semantics converge in
  `InboundMessageService`. `ChannelAdminService` does validated add/update/
  delete and startup recovery (down old connection before bringing up new);
  `ChannelConfigLoader` maintains raw vs resolved `${ENV}` readings; media
  helpers download/limit/janitor inbound attachments; `ChannelLeaseCoordinator`
  gives exclusive-connection channels (e.g. WeCom) a single owner.
- Key exports: `InboundChannelAdapter` (name/type/boundAgent/start/stop/status/
  sendReply/openProgressStream), `InboundMessage` (+ `InboundAttachment`),
  `InboundMessageService.onMessage/tryClaim/beginSlowWork`, `ChannelAdminService`,
  `ChannelConfig`, `ChannelConfigLoader`, `InboundChannelRegistry`,
  `MessageDeduplicator`/`SharedReceiptDeduplicator`, `DefaultInboundMediaEnricher`,
  `InboundMediaHttp`, `ChannelLeaseCoordinator`, `ActiveRunRegistry`,
  `PlaceholderProgressStream`.
- Dependencies: `AgentService`, `AgentExecutionService`, `SessionManager`,
  `ProfileRegistry`, `InterruptManager`, `InboundAssetGovernanceGate`,
  `CoordinationStore`/`ClusterProperties`, `ImageMime`/`InboundMediaExt`.
- Learner-relevant: how a platform-agnostic inbound pipeline is designed so a
  new IM channel is "implement the adapter + register a factory" with zero core
  changes, plus real constraints (3-second ack, dedup, processing notices).

### mcp

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/mcp]]`
- Purpose: MCP server contracts and a static catalog of well-known community
  servers for one-click enablement; admin operations are persist + hot-apply
  (connect/disconnect and register/unregister tools without restart).
- Key exports: `McpServerConfig` (stdio/http transport, env/headers with
  `${ENV}`, request timeout), `McpServerAdmin.list/add/update/remove/status/
  catalog`, `McpServerStatus`, `McpCatalogEntry`, `McpCatalog`.
- Dependencies: none in core; connection/registry implementation in
  `oryxos-tool`.
- Learner-relevant: MCP as the standard tool-integration protocol, and the
  dependency-inverted split between management UI and process/connection logic.

### policy (cross-cutting engine gate layer)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/policy]]`
- Purpose: three orthogonal decision layers consumed by `PromptBuilder` and
  `ToolExecutor`: `ToolPolicyService` (allow/deny subtraction, AGENT_DENY >
  GLOBAL_DENY−AGENT_EXEMPT > allow), `ApprovalPolicyService` (whether a risky
  call needs human approval, with prompt visibility and hit audit), and
  `AuthorizationService` (the single "who may do what" point shared by API,
  admin and runtime). Also asset governance, high-risk classifiers and inbound
  asset gates.
- Key exports: `ToolPolicyService.check/filterAllowed` (+ `PolicyDecision`),
  `ApprovalPolicyService.evaluate/recordHit/recordHumanDecision`,
  `AuthorizationService.decide` (+ `Decision`), `AssetGovernance`,
  `HighRiskActionClassifier`, `InboundAssetGovernanceGate`, `Action`,
  `ResourceRef`, `Principal`-based role checks.
- Dependencies: `Principal`, storage JPA impls.
- Learner-relevant: how a platform separates "what the Agent author declared",
  "what the platform allows" and "what needs a human", each defaulting to a
  zero-behaviour-change allow-all.

### durable (approval-suspend state machine)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/durable]]`
- Purpose: durable task state machine for human-in-the-loop — `suspendForApproval`
  writes a `WAITING_APPROVAL` checkpoint (idempotency key), `applyDecision`
  transitions to RUNNING/CANCELLED, `completeReplay` finalizes, and
  `ApprovalGrantContext` lets replay skip the gate; checkpoints survive restart.
- Key exports: `DurableTaskService.suspendForApproval/applyDecision/
  completeReplay/pendingCall/listWaitingApproval`, `TaskCheckpoint`,
  `TaskCheckpointStore`, `DurableTaskState`, `ApprovalSuspendedException`,
  `ApprovalGrantContext`, `DurableTaskReplay`.
- Dependencies: `ApprovalPolicyService`, `ToolCallRequest`, `ExecutionContext`.
- Learner-relevant: how a blocking ReAct loop suspends on approval and resumes
  idempotently after a crash — the durable-execution counterpart to `agent`.

### cluster (distributed coordination contracts)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/cluster]]`
- Purpose: one CAS-claim primitive over four carriers (turn leases, schedule
  fire-time claims, event receipts, channel ownership) plus instance heartbeat
  and workspace version bus / knowledge index-build claims. DB time is the
  authority. Single-machine mode injects `TurnCoordinator.NOOP`.
- Key exports: `CoordinationStore.tryAcquireTurn/renewTurn/releaseTurn/
  claimFireTime/markReceipt/tryAcquireChannel/heartbeat/bumpWorkspaceVersion/
  tryAcquireIndexBuild/commitGeneration`, `TurnCoordinator`, `TurnLease`,
  `ClusterProperties`, `DbTurnCoordinator`, `WorkspaceVersionNotifier/Poller`,
  `WorkspaceRefreshService`.
- Dependencies: shared DB (JPA impl), `TaskScheduler`.
- Learner-relevant: a compact, understandable distributed-correctness design —
  exactly-once turn/schedule semantics via CAS, fencing on renew failure, and
  DB-time to avoid clock drift.

### metrics, auth, fs, cost, routing, workspace, secret, retrieval/embedding/eval/flow/knowledge

- Locators:
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/metrics]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/auth]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/fs]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/cost]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/routing]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/workspace]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/secret]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/knowledge]]`
- Purpose: the engine's supporting contracts. `metrics` defines
  `MetricsRecorder` + `SpanRecorder` (all-default NOOP, OTel impl injected);
  `auth` holds `Principal`/`Role` and the `PrincipalContext` thread-local;
  `fs` provides `RealPathBoundary` (symlink-aware path projection) plus
  workspace mutation/admin-config guards; `cost` is a budget ledger with
  enforcement/degrade decisions; `routing` is an explainable
  cost/difficulty/sensitivity/latency-aware model router over the Agent
  allowlist; `workspace` abstracts storage providers (local, shared POSIX,
  versioned assets); `secret` provides `SecretCipher`/master-key resolution for
  encrypted DB credentials; `knowledge`/`retrieval`/`embedding`/`eval`/`flow`
  carry RAG, evaluation harness, flow-engine and knowledge-binding contracts.
- Key exports: `MetricsRecorder`, `SpanRecorder`, `PrincipalContext`,
  `RealPathBoundary`, `CostLedgerService`/`BudgetDecision`, `ModelRoutingService`
  /`RoutingDecision`, `WorkspaceStorage`/`WorkspaceStorageProvider`,
  `SecretCipher`/`MasterKeyResolver`, `KnowledgeService`/`KnowledgeRetriever`,
  `EvalHarness`/`EvalRegressionGate`, `FlowEngine`/`FlowDefinition`.
- Dependencies: JDK + selective storage impls; no upward dependency on engine
  packages other than value objects.
- Learner-relevant: the "contract in core, implementation downstream, default
  NOOP for zero-overhead" convention that lets governance, observability and
  cost controls be added without touching the loop.

## Design patterns found

- **Dependency inversion / ports & adapters** — every cross-module contract
  (`OryxTool`, `ProviderService`, `MemoryService`, `SessionManager`,
  `AgentExecutionStore`, `SandboxWhitelist`, `McpServerAdmin`,
  `NotifyChannelRegistry`) lives in `oryxos-core`; implementations live in
  `oryxos-storage` / `oryxos-provider` / `oryxos-tool` / channel modules.
- **Null Object / zero-breakage defaults** — `StreamListener.NOOP`,
  `ToolPolicyService.ALLOW_ALL`, `ApprovalPolicyService.PASS_THROUGH`,
  `AuthorizationService.ALLOW_ALL`, `TurnCoordinator.NOOP`,
  `MetricsRecorder.NOOP`, `SpanRecorder.NOOP` let every governance feature be
  off by default with byte-identical behavior.
- **Strategy + registry** — `ProviderRegistry`, `SkillRegistry`,
  `ProfileRegistry`, `InboundChannelRegistry`, `NotifyChannelRegistry`, channel
  `type → factory` map; explicit by-name lookup instead of type scanning.
- **Template Method / orchestrator** — `AgentService.process`,
  `InboundMessageService.onMessage`, `AgentExecutionService.runInContext`,
  `AgentScheduler` all fix a sequence (lock → resolve → execute → persist →
  publish) and delegate the variable steps.
- **Facade** — `MemoryService`, `ProviderService` present narrow faces over
  swappable backends.
- **ThreadLocal context propagation** — `ProfileContext`, `TraceContext`,
  `ToolExecutionContext`, `PrincipalContext`, `AgentRunExecutionContext`,
  `ExecutionContext`, `RunOutputContext` carry per-turn identity; set at entry,
  cleared in `finally`.
- **Layered Chain of Responsibility (security gates)** — runtime authz → MCP
  server whitelist → tool policy → approval gate (durable suspend) → sandbox;
  each writes its own `blocked_by` audit marker.
- **Observer / pub-sub** — `AgentRunEventHub` + `StreamListener` for run
  events and streaming, with persist-before-notify and fail-open publishing.
- **State machine** — `AgentExecution` (RUNNING/SUCCESS/FAILED/CANCELLED/
  WAITING_APPROVAL/CANCELLING), `DurableTaskState`, `SkillBindingIssue.Type`,
  channel `ChannelStatus.State`.
- **Progressive disclosure** — `ContextLoader` injects only Skill/knowledge
  metadata and local paths; bodies are fetched with `read_file` on demand.
- **Atomic publish + rollback** — `AtomicFiles` temp+rename;
  `AgentSkillBindingService.replaceBindings` and `AgentStore.snapshot/restore`
  roll back on failure.
- **Immutable records with defensive copies** — `ToolResult`, `Message`,
  `Profile`, `ProviderDef`, `NotifyChannelDef`, `McpServerConfig`, `AgentExecution`.
- **CAS lease / fencing** — `CoordinationStore` + `TurnCoordinator` give
  exactly-once turns, schedule firings and channel ownership across replicas.

## Most learner-relevant module

`agent` — specifically `ReActLoop` + `ToolExecutor` + `AgentService`. This is
the literal Agent engine: the hand-written reasoning-acting loop, the single
chokepoint where every tool call passes through layers of authorization,
policy, approval and audit, and the orchestrator that binds sessions,
concurrency, tracing and distributed leases. Reading these three files after
`OryxTool`/`ProviderService`/`PromptBuilder` yields a complete mental model of
how an enterprise Agent OS runs a turn end to end.

## Sources

- `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core]]`
- `[[sources/geek-ai-agent/20260922/oryxos/CLAUDE.md]]` (project constitution and module map, used for context)
