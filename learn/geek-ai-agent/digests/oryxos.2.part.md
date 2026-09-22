---
source: oryxos
source_type: codebase
source_lines: 145505
language: java
file_count: 200
part: 2
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — oryxos (part 2)

Scope: the platform/infrastructure packages under `oryxos-core/src/main/java/io/oryxos/core/` not covered by part 1 — `cluster`, `routing`, `secret`, `auth`, `policy`, `workspace`, `fs`, `flow`, `durable`, `eval`, `cost`, `metrics`, `knowledge`, `retrieval`, `embedding` — plus the `src/test` tree. These are the enterprise-surround (分布式、治理、耐久、可观测、检索基建) that turns a working Agent loop into a multi-tenant platform. Each package is a set of contracts + value records, with implementations deliberately pushed down (storage/assembly) per the dependency-inversion rule.

## Overview (L1)

- `cluster` — multi-replica coordination (026/027): a single CAS primitive (`CoordinationStore`) multiplexed into turn leases, schedule fire-time claims, event-dedupe receipts, channel ownership, instance heartbeat, workspace version bus, and knowledge-build generation claims. `DbTurnCoordinator` implements the lease with TTL renewal + fencing.
- `routing` — explainable cost/difficulty/sensitivity/latency-aware model routing (#477) over an Agent's declared provider+fallback allowlist; default-off; only ever filters/reorders the allowlist, never expands it.
- `secret` — credentials at rest (022): `SecretCipher` port with an AES-256-GCM `LocalMasterKeyCipher`, `MasterKeyResolver` (env or auto-generated `master.key`), and the sensitive-key name list shared with the audit redactor.
- `auth` — the unified request subject (039): `Principal` (USER / API_KEY / ANONYMOUS, with roles + team/org claims), its thread context, and the 3-tier `Role` enum.
- `policy` — the governance layers: `ToolPolicyService` (subtractive tool allow/deny, 020), `ApprovalPolicyService` (HITL approval, 042), the single `AuthorizationService` decision point (039), and asset governance decorators (OFFLINE/PRIVATE/WORKSPACE team+org).
- `workspace` — pluggable, guarded workspace storage (042): a NIO provider abstraction (`WorkspaceStorage`), a fail-closed registry, a path-wrapping `FileSystem` that keeps every IO on the selected provider, a durable write-reservation protocol, and versioned asset snapshots (#473, 049).
- `fs` — symlink-aware path guards and reserved-file guards shared by every tool/workspace boundary.
- `flow` — a durable Markdown Flow engine (045/046/047): parse + static validate a Git-friendly `oryxos.flow/v1` document, persist steps, execute/resume, wait on HUMAN/APPROVAL with timeouts, and compensate on failure.
- `durable` — the suspend/resume state machine for human approvals (043/044): idempotency-keyed checkpoints, replay-after-restart, and a unified admin/IM interaction facade with callback dedupe.
- `eval` — offline evaluation harness + regression gate (#472): score Agent/Skill/Prompt/Flow fixtures into success/tool/citation/latency/cost metrics and block release on absolute or baseline regression.
- `cost` — task-level cost ledger, attribution query, budget enforcement (block/degrade) and audit reconciliation (#476).
- `metrics` — the observability ports: `MetricsRecorder` (business counters) and `SpanRecorder` (OTel spans), both NOOP-default and dependency-inverted.
- `knowledge` — knowledge-base contracts (014): `KnowledgeService/Backend/Retriever/Admin` SPIs, explicit backend registry, `KNOWLEDGE.md` manifest, symlink-based Agent↔KB binding with delete protection, and the hard "citation is a first-class field" model.
- `retrieval` — the pure, shared retrieval-fusion infra: weighted/equal RRF rank fusion and cosine similarity.
- `embedding` — the cross-module `TextEmbedder` port and the shared float32↔BLOB `VectorCodec`.
- `src/test` — contract, golden-eval, and integration tests proving each of the above (turn fencing, crypto tamper detection, workspace plugin dispatch, flow resume, approval interception, eval packs).

## Structure (L2)

### oryxos-core/src/main/java/io/oryxos/core/cluster

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/cluster/CoordinationStore.java]]`
- Purpose: one CAS ("compare-and-claim") store contract powering all distributed correctness. Four carriers (turn lease, schedule fire-time, event receipt, channel owner) plus heartbeat, workspace-version bus, and knowledge index-build claim — all built from INSERT-catches-unique / conditional-UPDATE-steals-expired / owner-only renew-or-release. Time is always DB time (`SELECT CURRENT_TIMESTAMP`), never local clocks.
- Key exports: `CoordinationStore` (`tryAcquireTurn`/`renewTurn`/`releaseTurn`/`attachExecution`/`lastReclaimedExecutionId`, `claimFireTime`, `markReceipt`, `tryAcquireChannel`, `heartbeat`, `listInstances`, `activeTurnLeases`, `purgeExpired`, `bumpWorkspaceVersion`/`workspaceVersions`, `tryAcquireIndexBuild`/`renewIndexBuild`/`commitGeneration`), `WorkspaceVersionNotifier` (bump bus, `NOOP` standalone), `WorkspaceRefreshService` (ops escape hatch), `WorkspaceVersionPoller` (poll bus every `workspace-poll-interval`, per-domain reload callbacks + periodic full reconcile), `ClusterProperties`, `TurnCoordinator`.
- Dependencies: `io.oryxos.core.metrics.MetricsRecorder`; implementations live in `oryxos-storage` (`JpaCoordinationStore`).
- Learner-relevant: the textbook "no leader election, just CAS + leases" design. `TurnCoordinator.NOOP` is the standalone anchor and `DbTurnCoordinator` (acquire with poll-wait + wait-timeout, renew at TTL/3, fencing by interrupting the holder *and* a `stillHeld()` hard gate before any write) shows how a synchronous + virtual-thread runtime does distributed mutual exclusion without async.

### oryxos-core/src/main/java/io/oryxos/core/cluster/DbTurnCoordinator.java

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/cluster/DbTurnCoordinator.java]]`
- Purpose: the cluster-mode `TurnCoordinator`. `acquire` blocks, polling the store until it wins the session turn lease (throws `TurnWaitTimeoutException` on `wait-timeout`); a `TaskScheduler` renews at `heartbeatInterval` (default `leaseTtl/3`); renewal failure invalidates the lease, interrupts the executing thread (fencing "stop fast") and records a conflict metric; reclaimed leases invoke an optional dangling-execution handler (mark failed, never replay).
- Key exports: `DbTurnCoordinator`, inner `DbTurnLease` (`stillHeld()`, `attachExecution()`), `TurnLease`, `TurnFencedException`, `TurnWaitTimeoutException`.
- Dependencies: `CoordinationStore`, `ClusterProperties`, `MetricsRecorder`, Spring `TaskScheduler`.
- Learner-relevant: concrete fencing pattern — a lease is only a hint; the writer must re-verify ownership (`stillHeld`) before committing output, so a stale holder can never write.

### oryxos-core/src/main/java/io/oryxos/core/routing

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/routing/ModelRoutingService.java]]`
- Purpose: when `oryxos.routing.enabled=false` it returns the profile's provider+fallbacks unchanged and records nothing (rollback anchor). When on, it applies an ordered strategy over the Agent's declared candidates: (1) data-residency/sensitivity filter (SENSITIVE keeps only allowlisted providers, else fail-closed `ResidencyConstraintException`); (2) difficulty preference; (3) latency preference; (4) budget-degrade signal from the cost ledger; (5) cost-aware prefer-cheapest / estimated ceiling. Every step appends an explainable `RoutingReason` and per-candidate `CandidateDisposition`.
- Key exports: `ModelRoutingService` (`route(Profile)`, `recordFallback`, `findByRunId`, `recent`), `RoutingDecision`, `RoutingReason`, `RoutingReasonCode` (DEFAULT/DIFFICULTY/SENSITIVITY_RESIDENCY/BUDGET/LATENCY/COST_PREFER_CHEAP/FALLBACK/FILTERED), `CandidateDisposition` (SELECTED/ORDERED/FILTERED), `RoutingCandidate`, `RoutingContext` (ThreadLocal scope), `RoutingProperties`, `ProviderModelRef`, `DataSensitivity`, `TaskDifficulty`, `RoutingDecisionStore` + `InMemoryRoutingDecisionStore`.
- Dependencies: `core.cost` (`BudgetDecision`, `CostContext`, `CostLedgerService`), `core.provider` (`ModelPricing`, `PricingStore`), `core.profile.Profile`, `core.agent.TraceContext`.
- Learner-relevant: a concrete chain-of-responsibility with explainability and a hard "never expand privileges" invariant — the same discipline as the Provider explicit mapping (principle III) and the "no privilege expansion" security rule.

### oryxos-core/src/main/java/io/oryxos/core/secret

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/secret/MasterKeyResolver.java]]`
- Purpose: credential encryption at rest (022). `MasterKeyResolver` resolves a 32-byte master key: `ORYXOS_MASTER_KEY` env (Base64) wins; otherwise `.oryxos/master.key`, auto-generated on first boot with POSIX 0600 — no silent fallback between the two (mismatch = startup refusal). `LocalMasterKeyCipher` is AES-256-GCM with a fresh random 12-byte IV per encryption and a 128-bit auth tag; ciphertext form `enc:v1:<Base64(IV‖ct‖tag)>` makes plaintext/ciphertext detection idempotent and versionable.
- Key exports: `SecretCipher` (`encrypt`/`decrypt`/`isEncrypted`, `PREFIX`), `LocalMasterKeyCipher`, `MasterKeyResolver`, `SensitiveConfigKeys`, `SecretDecryptException`.
- Dependencies: JDK `javax.crypto` only (zero new deps); consumed by `oryxos-storage` (provider API keys, notify secrets) and `oryxos-web` masking.
- Learner-relevant: a clean crypto port with security-by-construction (random IV defeats static-IV warnings; GCM makes tamper/truncation detectable; errors never echo plaintext or keys). The versioned prefix is a reusable "format migration" pattern.

### oryxos-core/src/main/java/io/oryxos/core/auth

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/auth/Principal.java]]`
- Purpose: the unified subject that makes "API, admin console, and runtime share one authorization decision" possible. Three kinds — USER (admin Basic/session), API_KEY (a key's granted roles), ANONYMOUS (still a first-class subject, not null) — plus role set and request-time team/org claims. Immutable record, defensively-copied views; empty roles ⇒ `isAuthorizable()==false` (empty-roles-is-deny system-wide).
- Key exports: `Principal` (factories `user`/`apiKey`/`anonymous`, `hasRole`/`hasTeam`/`hasOrg`/`isAuthorizable`/`describe`), `PrincipalContext` (ThreadLocal `set`/`current`/`clear`), `Role` (VIEWER / EDITOR / ADMIN).
- Dependencies: none internal (consumed by `policy`).
- Learner-relevant: why a 3-role matrix (resource granularity lives in `Action`/`ResourceRef`, not in more roles) and why the subject is not a global static but a request-scoped ThreadLocal whose `clear()` is mandatory.

### oryxos-core/src/main/java/io/oryxos/core/policy

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/policy/AuthorizationService.java]]`
- Purpose: three orthogonal governance surfaces. `ToolPolicyService` is a subtractive layer (`AGENT_DENY > (GLOBAL_DENY − AGENT_EXEMPT) > allow`; effective tools ⊆ declared). `ApprovalPolicyService` decides "does this call need a human?" (ALLOW / REQUIRE_APPROVAL / DENY), classifying tools via `HighRiskActionClassifier` into SHELL / EXTERNAL_SEND / FILE_MUTATION / MCP. `AuthorizationService` is the single "can this principal do this action on this resource" decision point. `AssetAwareAuthorizationServiceImpl` is a decorator over it adding OFFLINE / PRIVATE / WORKSPACE team+org gates (with ancestor lookups), never a second channel.
- Key exports: `AuthorizationService` (+ `Decision`, `ALLOW_ALL`), `RoleBasedAuthorizationServiceImpl`, `ToolPolicyService` (+ `PolicyDecision`), `ApprovalPolicyService`, `ApprovalPolicyDecision/Outcome/Properties/Config/`…, `HighRiskActionClassifier`/`HighRiskActionType`, `Action` enum, `ResourceRef`, `AssetGovernance` (+ `Visibility`/`Health`), `AssetGovernanceStore`, `AssetAwareAuthorizationServiceImpl`, `InboundAssetGovernanceGate`, `ApprovalAudit*`, `OrgParentLookup`/`TeamParentLookup`/`TeamOrgLookup`.
- Dependencies: `core.auth.Principal`; `ToolPolicyService` consumed by `PromptBuilder` (pre-filter) and `ToolExecutor` (in-flight), implementations in `oryxos-storage`.
- Learner-relevant: the layering discipline — sandbox ("what can the tool touch"), tool policy ("may this Agent use this tool"), approval ("must a human sign off"), authorization ("may this principal act") are independent and non-exempting; every disabled layer has a `NOOP`/`ALLOW_ALL`/`PASS_THROUGH` anchor so default-off is byte-identical.

### oryxos-core/src/main/java/io/oryxos/core/workspace

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/workspace/WorkspaceStorage.java]]`
- Purpose: pluggable, guarded workspace storage. `WorkspaceStorage` exposes a selected NIO `root()` and a `nativePath()` execution bridge; `WorkspaceStorageProvider` is an explicitly registered plugin (no implicit discovery/fallback); `WorkspaceStorageRegistry.open` validates identity + required capabilities (`STREAM_IO`, `ATOMIC_MOVE`, `SYMBOLIC_LINKS`, `NATIVE_EXECUTION_VIEW`) fail-closed. `WorkspaceFileSystem`/`WorkspacePath` wrap the delegate so pure path ops stay wrapped and every IO re-enters the guarded provider (`toUri`/`toFile` throw; `checked()` enforces `RealPathBoundary`). `LocalWorkspaceStorageProvider` is the default; `SharedPosixWorkspaceStorageProvider` requires a pre-provisioned `.workspace-id` and never falls back to local. `WorkspacePublication` is a durable, non-expiring write reservation with `If-Match` revisions; `versioned/` adds immutable `.asset-versions/` snapshots with an active/previous pointer and atomic activate/rollback.
- Key exports: `WorkspaceStorage`, `WorkspaceStorageProvider`, `WorkspaceStorageRegistry`, `WorkspaceFileSystem`, `WorkspacePath`, `NioWorkspaceStorage`, `LocalWorkspaceStorageProvider`, `SharedPosixWorkspaceStorageProvider`, `WorkspaceCapability`, `WorkspaceCapabilityProbe`, `WorkspaceAvailability`, `WorkspacePublication` (+ `Reservation`, `ConflictException`), `RecoverableFiles`, `versioned/VersionedAssetSource`, `VersionedAssetPointerStore` (+ `InMemory…`), `VersionedAssetKind`, `AssetVersion`.
- Dependencies: `core.fs.RealPathBoundary`, `core.io.AtomicFiles`, `core.cluster.ClusterProperties`/`WorkspaceVersionNotifier`.
- Learner-relevant: how to make "swap the storage backend / go shared-volume" safe — capability probing, no implicit fallback, guarded NIO wrappers so a leaked native `Path` can't bypass policy, optimistic-concurrency revision headers, and atomic rename-based publication (explicitly not a multi-file atomic snapshot).

### oryxos-core/src/main/java/io/oryxos/core/fs

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/fs/RealPathBoundary.java]]`
- Purpose: the shared path-guard toolkit. `RealPathBoundary.project` resolves the nearest existing ancestor to its real path and appends the non-existent suffix (dangling links/cycles/unresolvable ancestors fail closed); `requireWithin`/`isWithin` enforce "projected real path is inside the root". `WorkspaceMutationGuard` blocks file-tool writes to shared Skill/Knowledge trees, Agent bind slots, and direct `AGENT.md` writes (lexical segments + symlink-leaf + real-path projection). `AdminConfigFileGuard` blocks both read and write of reserved files (`channels.yaml`, `mcp_servers.yaml`, the `oryxos.db*` family, `.workspace-*`, `.staging`) so credentials/full data never leak through generic file tools.
- Key exports: `RealPathBoundary` (+ `Projection`), `WorkspaceMutationGuard` (rejectSkillKnowledgeContentWrite / rejectAgentMdDirectWrite / rejectBindSlotCreate / rejectBindLinkDetach), `AdminConfigFileGuard` (rejectMutation / rejectRead / isReservedRead).
- Dependencies: none (JDK NIO only); consumed by `workspace`, `oryxos-tool`, `oryxos-storage`.
- Learner-relevant: TOCTOU-aware, symlink-aware path security in application code (not `SecurityManager`) — validate lexically *and* against the resolved real path, and handle "new path" by projecting the nearest existing ancestor.

### oryxos-core/src/main/java/io/oryxos/core/flow

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/flow/FlowEngine.java]]`
- Purpose: a durable Markdown-defined workflow engine. `FlowDefinition` is the immutable parsed `oryxos.flow/v1` document (nodes, edges, budget, permissions); `FlowMarkdown`/`FlowDocuments` parse it; `FlowValidator` statically checks apiVersion, entry, edge/wire refs, type consistency, cycles, compensate targets (CI-safe, no execution). `FlowEngine` does validate → persist run/step → execute → resume: each node step carries an idempotency key so a resumed run skips succeeded nodes; HUMAN/APPROVAL enter WAITING with optional timeout (expired waits auto-cancel); failures optionally run a declared compensation node; `timeline()` replays ordered events. Node kinds are AGENT / TOOL / NOTIFY / HUMAN / APPROVAL.
- Key exports: `FlowEngine` (`start`/`resume`/`completeWaiting`/`cancelWaiting`/`expireWaiting`/`timeline`), `FlowDefinition`, `FlowMarkdown`, `FlowDocuments`, `FlowValidator`, `FlowNode`/`FlowNodeType`, `FlowNodeHandler`/`DefaultFlowNodeHandler`, `FlowNodeOutcome`, `FlowPort`/`FlowPortType`/`FlowEdge`/`FlowBranchPredicates`, `FlowBudget`/`FlowPermissions`, `FlowRun`/`FlowStep`/`FlowRunState`/`FlowStepState`/`FlowTimelineEvent`, `FlowRunStore`/`InMemoryFlowRunStore`, `FlowDiagnostic`, `FlowEngineProperties`, `FlowJson`.
- Dependencies: none on other core packages except `io`/JSON helpers; persisted by a `FlowRunStore` (JPA impl in storage).
- Learner-relevant: a compact saga/durable-workflow implementation — deterministic step idempotency, a WAITING state for human input, timeout/cancel, and compensation as the failure path; the Markdown source model keeps workflows Git-reviewable.

### oryxos-core/src/main/java/io/oryxos/core/durable

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/durable/DurableTaskService.java]]`
- Purpose: durable suspend/resume for tool-call approvals (043), plus the interaction facade (044). `suspendForApproval` writes a `WAITING_APPROVAL` checkpoint and throws `ApprovalSuspendedException`; the idempotency key is `exec:<id>|session:<id>|toolCall:<id>|attempt:<n>` so a retry reuses the checkpoint. `applyDecision` transitions to RUNNING (approved) / CANCELLED (denied) and records the human decision; `completeReplay` converges RUNNING → SUCCEEDED/FAILED. `ApprovalInteractionService` is the shared admin/IM entry: list waiting, decide (optional argument edits, expiry), and `handleCallback` dedupes repeated channel callbacks via `ApprovalCallbackReceiptStore`.
- Key exports: `DurableTaskService`, `TaskCheckpoint` (+ `KIND_PRE_TOOL_APPROVAL`), `DurableTaskState`, `TaskCheckpointStore`/`InMemoryTaskCheckpointStore`, `DurableTaskReplay`, `ApprovalInteractionService` (+ `DecisionRequest`, `PendingApprovalView`, `ApprovalDetailView`, `DecisionOutcome`), `ApprovalCallbackReceiptStore`/`InMemoryApprovalCallbackReceiptStore`, `ApprovalGrantContext`, `ApprovalSuspendedException`.
- Dependencies: `core.policy.ApprovalPolicyService`/`ApprovalHumanDecision`, `core.agent.ExecutionContext`, `core.provider.ToolCallRequest`.
- Learner-relevant: the canonical "suspend a synchronous runtime without threads parked in memory" pattern — persist a checkpoint, return, then replay deterministically; the idempotency key is what makes retries and duplicate callbacks safe.

### oryxos-core/src/main/java/io/oryxos/core/eval

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/eval/EvalRegressionGate.java]]`
- Purpose: pure, LLM-free evaluation plumbing. `EvalHarness.score` reduces a case list to success rate, tool-selection overlap, citation-quality overlap, average latency, total cost; `compare` produces deltas vs baseline. `EvalRegressionGate.evaluate` fails when an absolute threshold is missed or a metric regresses beyond allowed deltas. `EvalFixtureLoader` reads JSON suites (with baselines) from classpath. Default-off via `EvalProperties`; CI invokes it.
- Key exports: `EvalHarness`, `EvalRegressionGate`, `EvalProperties`, `EvalCase`, `EvalMetrics`, `EvalMetricsDelta`, `EvalBaseline`, `EvalSuiteResult`, `EvalThresholds`, `EvalGateDecision`, `EvalFixtureLoader`, `EvalTargetKind`.
- Dependencies: none internal (consumed by tests/CI).
- Learner-relevant: turning "did the Agent get better?" into deterministically checkable numbers, including "no fake citations" (empty expected citations must stay empty) — the basis for a Loop/Harness acceptance system.

### oryxos-core/src/main/java/io/oryxos/core/cost

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/cost/CostLedgerService.java]]`
- Purpose: task-level cost accounting and budget enforcement (#476). Records LLM cost (from token usage + pricing version) and flat tool cost into a ledger keyed by run/task/agent/team; `query` aggregates attribution; `checkBudget` matches scoped rules (RUN/AGENT/TEAM/MODEL) against spend and returns allow / block / degrade; `reconcile` cross-checks the ledger's LLM total against the audit `llm_calls` sum (traceability). `CostContext` carries per-turn attribution overrides (ThreadLocal, mirrors `TraceContext`).
- Key exports: `CostLedgerService`, `CostLedgerEntry`, `CostLedgerStore`/`InMemoryCostLedgerStore`, `CostContext`, `CostProperties` (+ `BudgetRule`), `BudgetDecision` (+ `allow`/`block`/`degrade`), `OverBudgetAction`, `CostSourceKind`, `CostAttributionQuery`/`CostAttributionSummary`, `CostReconcileResult`, `AuditLlmCostSource`, `CostAwareLlmCallAuditor`, `CostAwareToolInvocationAuditor`.
- Dependencies: `core.provider.Usage`, `core.agent.TraceContext`; routing consumes `BudgetDecision`.
- Learner-relevant: "audit table is truth, ledger is an index" — reconcile makes cost data verifiable, and the block/degrade action ties FinOps policy back into model routing.

### oryxos-core/src/main/java/io/oryxos/core/metrics

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/metrics/MetricsRecorder.java]]`
- Purpose: two all-default-method ports so core code can emit telemetry without depending on Micrometer/OTel. `MetricsRecorder` counts LLM calls/tokens, tool invocations, policy blocks, fallback switches, lease acquire/reclaim/fence conflicts, duplicate drops, workspace reloads, LLM cost, and inbound ASR/media outcomes. `SpanRecorder` records turn/LLM/tool/approval spans post-hoc with explicit start+duration (same timing source as the audit tables). Both are NOOP by default; implementations must swallow their own errors so telemetry never breaks the main path.
- Key exports: `MetricsRecorder` (+ `NOOP`), `SpanRecorder` (+ `NOOP`).
- Dependencies: none; implementations live in assembly (`oryxos-cli`).
- Learner-relevant: the "metrics and audit are orthogonal" rule — metrics aggregate, audit replays — and the NOOP-default dependency-inversion idiom used throughout core.

### oryxos-core/src/main/java/io/oryxos/core/knowledge

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/knowledge/KnowledgeService.java]]`
- Purpose: knowledge-base contracts (014). `KnowledgeService.retrieveForAgent` scopes retrieval to the calling Agent's bound KBs (never lets a plugin widen scope), routes each KB to its declared backend, and globally top-K fuses across backends. `KnowledgeBackend` = mandatory `KnowledgeRetriever` + capability declaration + optional `KnowledgeAdmin`; `KnowledgeBackendRegistry` is an explicit by-name registry (reserved `local` backend always present). `KnowledgeManifest` (`KNOWLEDGE.md` frontmatter: name/description/backend/connection) never stores plaintext credentials — `${ENV_VAR}` placeholders are resolved by the backend. `KnowledgeBindingService` treats `agents/<agent>/knowledge/<kb> → ../../../knowledge/<kb>` relative symlinks as the single source of truth for bindings, with inspect/reconcile/references and delete protection.
- Key exports: `KnowledgeService`/`KnowledgeServiceImpl`, `KnowledgeBackend`, `KnowledgeRetriever`, `KnowledgeAdmin`, `KnowledgeBackendRegistry`, `KnowledgeCapabilities`, `KnowledgeManifest`, `KnowledgeBindingService`, `BoundKnowledgeDescriptor`, `KnowledgeBindingInspection`, `KnowledgeBindingIssue` (DANGLING/ESCAPED/INVALID_TARGET/NAME_MISMATCH), `KnowledgeReference`, `KnowledgeReferencedException`, `KnowledgeBuildInProgressException`, `KnowledgeImportException`, `model/Citation` (hard contract; `display()` renders `[kb] path #pos` or an explicit "出处不可用"), `model/KnowledgeHit` (citation must be non-null; `degraded` flag; `payload` escape hatch), `model/KnowledgeQuery` (DEFAULT_TOP_K=5), `model/DocumentStatus`/`DocumentState`, `model/KnowledgeBaseInfo`.
- Dependencies: `core.fs.RealPathBoundary`; implementations (`LocalKnowledgeBackend`) live in `oryxos-knowledge`.
- Learner-relevant: SPI + explicit registry + symlink-as-binding + "citation is a first-class, non-nullable field" — the anti-pattern being corrected is burying provenance in an untyped payload.

### oryxos-core/src/main/java/io/oryxos/core/retrieval

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/retrieval/RetrievalPipeline.java]]`
- Purpose: the shared fusion primitive for both knowledge (014) and memory (015). `fuseByRank(topK, weights, routes...)` computes weighted Reciprocal Rank Fusion `score(id)=Σ w_r/(K+rank)` with `K=60`; rank-based because raw scores across routes are not comparable. `cosine` compares equal-dimension vectors and rejects mismatches.
- Key exports: `RetrievalPipeline.fuseByRank` (equal + weighted overloads), `cosine`, records `Candidate`/`Fused`.
- Dependencies: none (pure functions).
- Learner-relevant: why RRF is the pragmatic hybrid-retrieval merge, and how keeping it a pure function makes it independently testable and reusable.

### oryxos-core/src/main/java/io/oryxos/core/embedding

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/main/java/io/oryxos/core/embedding/TextEmbedder.java]]`
- Purpose: the cross-module vectorization port — deliberately not knowledge-specific so memory can reuse it. `modelId()` and `dimensions()` travel with the vector for consistency checks. `VectorCodec` is the shared float32[] ↔ little-endian BLOB storage format used by both knowledge and memory indexes.
- Key exports: `TextEmbedder` (`embed`, `modelId`, `dimensions`, `embedAll`), `VectorCodec` (`encode`/`decode`).
- Dependencies: none; implemented in `oryxos-provider`.
- Learner-relevant: a small, honest port plus a storage-format utility — the seam that lets semantic features be added or degraded without touching consumers.

### oryxos-core/src/test (contract, integration, golden-eval)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/oryxos-core/src/test/java/io/oryxos/core/channel/InboundMessageServiceContractTestBase.java]]`
- Purpose: the test tree proves behavior rather than restating code. Highlights: `channel/InboundMessageServiceContractTestBase` (abstract contract test pinning rules B1–B10 — dedupe, p2p persistent vs group stateless session, audit via `triggerAsync`, readable failure replies, non-text notice — with `StubInboundContractTest` and a Feishu subclass, proving a second channel joins with zero core changes); `cluster/DbTurnCoordinatorTest` (wait-timeout, renewal-failure fences+interrupts, `stillHeld` owner-conditional renew, NOOP zero-store); `secret/LocalMasterKeyCipherTest` (roundtrip, random-IV inequality, tamper/truncation/illegal-Base64 detection, no secret/plaintext in messages); `workspace/WorkspaceBusinessPluginTest` (a selected non-local plugin receives all Agent/Skill IO), `WorkspaceStorageTest` (351 lines), `WorkspacePublicationTest`, `versioned/VersionedAssetSourceTest`; `fs/*` (RealPathBoundary, AdminConfigFileGuard, WorkspaceMutationGuard); `flow/FlowEngineTest` (disabled rejects start, linear persists, resume skips succeeded, human-compensate replay) with fixtures under `test/resources/flows/*.flow.md`; `durable/*` (ApprovalInteractionService, DurableTaskService, DurableSuspendIntercept); `eval/Enterprise{ControlledRdops,KnowledgeSupport,ProcessTicket}PackTest` + `EvalFixtureLoaderTest`/`EvalHarnessTest`/`EvalRegressionGateTest` with golden suites under `test/resources/evals/*.json` (and `sample-suite.json`); `policy/ApprovalInterceptTest` (prompt visibility **and** execution share one policy; REQUIRE blocks with `blocked_by=approval`; PASS_THROUGH zero-change), `RoleBasedAuthorizationServiceImplTest` (615 lines), `AssetAware…`, `AssetGovernanceStoreTest`; `auth/Principal*Test`; `routing/ModelRoutingServiceTest`; `cost/CostLedgerServiceTest`; `knowledge/KnowledgeBindingServiceTest`, `KnowledgeManifestTest`; `retrieval/RetrievalPipelineTest`; `cluster/WorkspaceVersionPollerTest`.
- Key exports: test doubles reused across modules — `testing/SymlinkAssumptions` (JUnit assumption probes so Windows without symlink/POSIX privileges is *skipped*, not red; shipped via the core test-jar), `channel/StubChannelAdapter`/`StubInboundContractTest`, `workspace/RecordingWorkspaceProvider`, `knowledge/KnowledgeWorkspaceFixture`, `skill/SkillWorkspaceFixture`.
- Dependencies: JUnit 5, AssertJ, Mockito; `oryxos-core` main + the golden fixtures.
- Learner-relevant: the verification vocabulary of the project — contract-inheritance tests for channel symmetry, golden eval packs for "did quality regress", fixed-clock deterministic tests for durable/flow, and environment-assumption probes so cross-platform CI doesn't lie.

## Cross-cutting patterns observed

- **Dependency inversion everywhere**: contracts + value records live in `oryxos-core` (the packages above), implementations in `oryxos-storage`/`oryxos-knowledge`/`oryxos-cli`. In particular `AuthorizationService`, `ToolPolicyService`, `CoordinationStore`, `SecretCipher`, `TextEmbedder`, `MetricsRecorder`, `SpanRecorder`, `WorkspaceStorageProvider` are ports whose implementations never leak upward.
- **NOOP / ALLOW_ALL / PASS_THROUGH default anchors**: `TurnCoordinator.NOOP`, `ToolPolicyService.ALLOW_ALL`, `ApprovalPolicyService.PASS_THROUGH`, `AuthorizationService.ALLOW_ALL`, `MetricsRecorder.NOOP`, `SpanRecorder.NOOP`, `WorkspaceVersionNotifier.NOOP`, `InboundAssetGovernanceGate.NOOP`. Feature-off must be behaviorally identical, so the anchor implementation *is* the disabled layer.
- **Fail-closed security**: empty allowlists = deny-all, sensitive-data routing with no matching provider throws, shared-workspace without a valid identity refuses to initialize, unknown version/duplicate registrations throw, real-path boundary violations reject.
- **CAS + leases + fencing** (cluster): one DB primitive (`CoordinationStore`) yields exactly-once turn/schedule/receipt/channel/index-claim semantics; renewal failure both interrupts the holder and blocks its write via `stillHeld()`.
- **Idempotency keys + durable checkpoints** (durable/flow): retries, resumed runs, and duplicate IM callbacks all resolve through persisted keys so side effects happen once.
- **Explainability records**: `RoutingDecision`/`RoutingReason`/`CandidateDisposition` and the audit-backed metrics make "why did the system do this" queryable.
- **Optimistic concurrency + atomic publication** (workspace): `If-Match` revision, durable write reservation, `AtomicFiles` rename-on-write, immutable asset snapshots with active/previous pointers and atomic rollback.
- **Symlink-as-source-of-truth** (knowledge, skills, workspace): binding is a controlled relative symlink; every inspection checks lexical target, real path, name match, and dangling/escaped/cycle conditions (`RealPathBoundary`, `WorkspaceMutationGuard`, `AdminConfigFileGuard`).
- **Pure shared infrastructure** (retrieval/embedding/eval): RRF fusion, vector codec, and the eval harness are side-effect-free and independently testable.
