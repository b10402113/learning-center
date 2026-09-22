---
source: oryxos
source_type: codebase
source_lines: 145505
language: markdown
file_count: 200
part: 6
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — oryxos (part 6)

> Part 6 covers the **documentation, specification, packaging, and delivery surface** of the
> OryxOS repo: root project docs (README/CLAUDE/CHANGELOG/Makefile/pom), `docs/` design and
> channel-setup docs, the 57-dir `specs/` Spec-Kit feature set, and the infra/ops scaffolding
> (`config/`, `docker/`, `charts/`, `scripts/`, `solutions/`, `website/`, `bin/`, `.specify/`).
> Locators point at `sources/geek-ai-agent/20260922/oryxos/<path>`. Sources are immutable.

## Overview (L1)

- **README.md / CLAUDE.md / CHANGELOG.md** — the three canonical project documents: README is the
  public English pitch (Agent Harness OS, Agent formula, five core capabilities, roadmap); CLAUDE.md
  is the Chinese contributor/AI-agent guide (tech stack, module map, eight non-negotiable
  "Constitution" principles, data model, ReAct loop walkthrough, traps); CHANGELOG tracks releases
  v0.1.0 → 0.1.5 plus an Unreleased section for the governance/Flow/cost epics.
- **Makefile / pom.xml / Dockerfile / docker-compose.yml** — build & delivery surface: a Maven
  multi-module reactor (28 modules incl. many `oryxos-channel-*`), Make targets (`build`, `release`,
  `docker`, `helm-lint`, `eval-gate`), a JRE-only Docker image copying a prebuilt fat jar, and a
  single-service compose stack persisting everything in a `/data` volume.
- **docs/ (design docs)** — the pedagogical core of the repo: IndustryResearch (why a Java Agent OS),
  DemandAnalysis (what / requirements, 4-week core scope), TechnicalSolution (how, module by module),
  AiProgrammingGuide (Spec-Kit + manual-prompt methodology), VisionAndRoadmap (9 future directions,
  north star = one-sentence task → self-organizing agent team).
- **docs/ (ops & channel docs)** — CliGuide, K8sDeployGuide, SharedVolumeGuide,
  ObservabilityModel/ObservabilityRoadmap, ScheduleIdentityMigration, DistributedFoundationPlan.html,
  plus ~16 per-IM-platform `*ChannelSetup.md` files (Feishu, WeCom, DingTalk, Slack, Discord, QQ,
  Weixin ×5, Douyin, Alipay, Telegram, WhatsApp, Teams, GoogleChat, Mattermost, Matrix).
- **docs/prompt/ + docs/superpowers/** — raw AI-coding artifacts: `prompt.md` is a 14-round prompt
  log reconstructing the project's incremental development; `01-01.md` is the consolidated
  one-shot build task; `superpowers/` holds one design+plan pair for a provider-config fix.
- **specs/ (57 dirs)** — the Spec-Kit feature set, one numbered directory per feature, each following
  the specify → plan → tasks → implement workflow (spec.md, plan.md, tasks.md, research.md,
  data-model.md, contracts/, checklists/, quickstart.md, acceptance-report.md). Covers core
  capabilities 001–011, knowledge/memory/audit 014–016, channels 017/026/029–038, security &
  governance 018–024/039–044, and future epics 045–051 (Flow, evals, cost ledger, model routing).
- **config/ + .specify/** — configuration templates & governance: `application.yml.example`,
  `channels.yaml.example`, `mcp_servers.yaml.example`; and the Spec-Kit workspace
  (`.specify/` constitution + templates + bash scripts + workflow registry).
- **docker/ + charts/ + scripts/ + bin/ + solutions/ + my-agent/ + website/** — everything that
  ships or operates OryxOS: entrypoint + self-hosted mem0 compose, Helm chart, CI/acceptance/ops
  scripts, `oryx-server` start/stop binaries, three enterprise "beacon solution" packages, a sample
  `.oryxos/` workspace, and the VitePress bilingual docs site.

## Structure (L2)

### README.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/README.md]]`
- Purpose: Public English project pitch and quick-start. Frames OryxOS as "the self-hosted Agent OS
  for the enterprise", defines an agent harness (运行骨架), gives the Agent formula
  (`natural language (md) + Memory + Tools + MCP + Skills + Knowledge + Notify = a working Agent`),
  the Model → Harness → OS table, feature list, architecture diagram, five core capabilities,
  phased roadmap (Phase 1 shipped; tracks A–I next), module structure, build/run/Docker/Web-Console
  instructions, `AGENT.md` example, and the REST API table.
- Key exports: 28-module list; REST endpoints `/api/v1/agents`, `/sessions`, `/providers`,
  `/notify-channels`, `/schedules`, `/sandbox/whitelist`, `/workspace/*`, `/tools`, `/health`;
  design principles; tech-stack table (Java 21, Spring Boot 3.x, Spring AI, Picocli, SQLite/PostgreSQL).
- Dependencies: references `docs/VisionAndRoadmap.md`, `docs/K8sDeployGuide.md`,
  `docs/SharedVolumeGuide.md`, `website/public/images/*.svg`.
- Learner-relevant: the best single entry point for "what is an Agent OS / agent harness" and how
  the whole system is packaged; anchors the "one directory = one Agent" and "zero-cost agent
  definition" concepts.

### CLAUDE.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/CLAUDE.md]]`
- Purpose: Chinese contributor + AI-coding guide. The most pedagogically dense root doc: tech stack;
  the 14-named-module map (with the many channel modules noted); the **eight non-negotiable
  Constitution principles** (自实现 ReAct; Spring AI used only for protocol translation + `@Tool`
  schema, auto tool-execution disabled; explicit provider→`ChatModel` map; one dir = one Agent with
  symlink-bound Skills + progressive disclosure; audit tables written day one; no SecurityManager,
  real-path whitelisting; synchronous + virtual threads; `oryxos-tool` three-in-one); runtime
  workspace layout; `AGENT.md` schema; SQLite tables (`sessions`, `tool_invocations`, `llm_calls`);
  ReAct loop mechanism; Tool system (9 built-ins, 3 plugin tiers); 10 core REST endpoints; 12/13 CLI
  commands; cluster/file-plane/Helm/secret-encryption notes; 4-week pacing; a traps table.
- Key exports: `ReActLoop`, `PromptBuilder`, `ToolExecutor`, `AgentService`, `ContextLoader`,
  `AgentLoader.deriveProfile`, `SandboxChecker`, `WhitelistSandbox`, `OryxTool`, `ToolResult`,
  `MemoryService`, `LongTermMemoryStore`; engine flow diagram.
- Dependencies: distills `docs/AiProgrammingGuide.md` + `docs/TechnicalSolution.md`.
- Learner-relevant: the single most learner-relevant root doc — it is the executable summary of the
  constitution and the entire runtime model, and directly lists the pitfalls the course teaches.

### CHANGELOG.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/CHANGELOG.md]]`
- Purpose: Keep-a-Changelog release history. **Unreleased** = governance/enterprise epics (#476–480:
  controlled-rdops, process-ticket and knowledge-support beacon solutions; model routing; cost
  ledger; versioned asset source; agent evals; workspace storage plugin). **0.1.5** adds pluggable
  storage + PostgreSQL, container sandbox, provider fallback, secret encryption, audit trace, persona
  library, Docker/GHCR, and the global IM channel wave. Earlier releases add knowledge base, semantic
  recall, REST API key, SSE, tool policy, and the 0.1.0 core kernel.
- Key exports: versioned feature timeline (V0.1.0 → 0.1.5), each with Added / Fixed / Security / Docs.
- Learner-relevant: shows the project's actual build order (core → governance → distributed), which
  mirrors the course's phased progression and demonstrates real incremental delivery discipline.

### Makefile / pom.xml / Dockerfile / docker-compose.yml

- Locators: `[[sources/geek-ai-agent/20260922/oryxos/Makefile]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/pom.xml]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/Dockerfile]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docker-compose.yml]]`
- Purpose: The build & delivery contract. Makefile: `build` (Maven + bundled Vue admin UI),
  `release` (assembles `dist/oryxos-<version>.tar.gz` with `bin/ config/ libs/`), `docker`
  (builds image from the already-built fat jar — no Maven in image), `helm-lint`, `helm-package`,
  `eval-gate`, `sync-upstream`, `hooks`. `pom.xml`: the Maven reactor listing 28 modules (core,
  persona, provider, memory, knowledge, tool, 20 channel modules, web, storage, cli, boot).
  Dockerfile: `eclipse-temurin:21-jre-jammy`, non-root uid 1000, all state in `/data` via
  `ORYXOS_ROOT`, built-in `/api/v1/health` healthcheck. Compose: one service, `oryxos-data` volume,
  `stop_grace_period: 40s` for graceful shutdown.
- Key exports: module names; env vars `ORYXOS_ROOT`, `ORYXOS_PORT`, `JAVA_OPTS`, `TZ`; fat jar
  `oryxos-boot/target/oryxos-boot-<version>.jar`.
- Learner-relevant: teaches the "one binary, zero ceremony" packaging philosophy and the explicit
  decision to keep the runtime out of the build image (multi-arch without QEMU).

### docs/DemandAnalysis.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/DemandAnalysis.md]]`
- Purpose: The **What** document — functional/non-functional requirements. Defines OryxOS as a Java
  enterprise Agent OS, distinguishes Agent OS from agent runtime, states the two-stage delivery
  (core kernel vs. governance). Specifies five core capabilities (LLM Provider abstraction, ReAct
  loop, three-layer Memory, Plugin Tools, Web Service), Channel scope, 12 CLI commands, 10 REST
  endpoints, `AGENT.md` frontmatter schema, SQLite `sessions`/`tool_invocations`/`llm_calls`,
  performance targets, security/compliance, five key flows, 4-week milestones, risks, and two
  end-to-end acceptance demos (daily weather, daily tech digest).
- Key claims: core phase = runtime kernel only, governance is the endgame; audit writes from day one;
  vector search deferred to extension; "one directory = one Agent".
- Learner-relevant: the requirements discipline that a real project follows before any code; the two
  demos are the concrete "definition of done" and good teaching targets.

### docs/TechnicalSolution.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/TechnicalSolution.md]]`
- Purpose: The **How** document, ~880 lines in three parts. Part 1 (底座/base): 7 key decisions
  (self-implemented ReAct, Spring AI boundary, synchronous + virtual threads, `@Tool` + `OryxTool`,
  Spring MVC, `Sandbox` interface + `WhitelistSandbox`, SQLite + `MEMORY.md`); layered architecture
  (access → engine → capability → base); each of the five capabilities in depth; support modules
  (init, profile loading, context loading, Channel, `AgentScheduler` as third trigger, config/secret
  loading); persistence (SQLite tables, filesystem data). Part 2: defining an Agent (directory +
  Web Service, `AgentLifecycleService`, `WorkspaceWatcher`). Part 3: three end-to-end demos, 4-week
  pacing, performance.
- Key exports: `ProviderService`, `ReActLoop`, `PromptBuilder`, `ToolExecutor`, `MemoryService`,
  `LongTermMemoryStore` (markdown/sqlite/mem0 tiers), `Sandbox`/`WhitelistSandbox`,
  `NotifyChannelAdapter`/`WebhookNotifyAdapter`, `NotifyTools`, `AgentScheduler`, `ConfigLoader`.
- Learner-relevant: the single best "how an Agent OS is actually designed" doc — every course module
  (Provider, ReAct, Memory, Tool, Web, Scheduler, Sandbox, Notify) has a dedicated section here.

### docs/IndustryResearch.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/IndustryResearch.md]]`
- Purpose: The "why" research: defines Agent OS (five required things), contrasts it with
  orchestration platforms / frameworks / SaaS; surveys the two leading open-source Agent OS projects
  (OpenClaw/Node.js, Hermes Agent/Python) and the gaps they leave (enterprise governance, IT-system
  integration, **Java ecosystem absence**); argues the durable need is a *private, controllable,
  auditable* Agent base for regulated enterprises; catalogs Java's assets (Spring Boot, Spring AI
  Alibaba, LangChain4j, Nacos/Sentinel/SkyWalking); positions OryxOS and its single-node → distributed
  → cross-node collaboration path; includes glossary + references.
- Key claims: the bottleneck is the harness/base, not the model; Java is a structural gap in the Agent
  OS layer; anchor the project to the need, not the "Agent OS" buzzword.
- Learner-relevant: teaches competitive/positioning analysis and how to scope a project against an
  ecosystem gap — the recurring "选型力/认知力" theme of the course.

### docs/AiProgrammingGuide.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/AiProgrammingGuide.md]]`
- Purpose: The AI-coding methodology doc: main development uses **Spec-Kit** (specify → plan →
  tasks → implement) fed with the existing Demand/Technical docs; incremental work switches to
  manual prompts + Claude Code. Maps the five capabilities to 5 user stories (US-1 → US-2 →
  {US-3 ∥ US-4} → US-5), defines the constitution inputs, task-class breakdowns per story,
  `/speckit.analyze` after each story, and a table of "most-easily-written-wrong" points.
- Key claims: Spec-Kit suits large greenfield + clear requirements + AI-agent collaboration; manual
  prompts suit small increments; always feed the *latest* docs (9 modules, not 11).
- Learner-relevant: the clearest worked example in the repo of spec-driven development and of
  human-in-the-loop AI coding — directly supports the SDD/Harness course strand.

### docs/VisionAndRoadmap.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/VisionAndRoadmap.md]]`
- Purpose: First-stage summary + future plan. States the north-star formula (6/7 elements delivered,
  knowledge base the only gap), then lays out nine parallel workstreams (A distributed base, B vector
  subsystem/knowledge+semantic memory, C Flow + multi-agent + A2A, D self-improving skills, E
  omni-channel/multimodal, F container sandbox, G enterprise governance, H enterprise-only powers
  incl. HITL approval / audit data flywheel / cost governance / smart routing, I task-publishing
  self-organizing agent teams). Ends with the target end-state and Apache Software Foundation goal.
- Key claims: "slow is fast", single-node-first; enterprise-only capabilities (HITL, cost, routing)
  are OryxOS's differentiators vs. personal agents like Hermes.
- Learner-relevant: shows how a project converts a vision into independent, claimable workstreams;
  direction I is the conceptual capstone the course builds toward.

### docs/CliGuide.md

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/CliGuide.md]]`
- Purpose: The CLI manual for the 12+ subcommands (init, status, chat, serve, gateway, profile
  list/create/show/delete, provider list, tool list, session list, apikey add/list/revoke). Explains
  light vs. heavy commands (Spring or not), workspace-root resolution (`-Doryxos.root` → `ORYXOS_ROOT`
  → `.oryxos`), the `channel:user:agent` session identity, master-key (022) and provider-credential
  rules, tool policy (020), audit trace (021), provider fallback + metrics (023), DB selection (025),
  and multi-replica guarantees (026/027).
- Learner-relevant: a concrete, runnable tour of an Agent OS from the operator's seat; good source
  of "definition of done" commands.

### docs/K8sDeployGuide.md / docs/SharedVolumeGuide.md / docs/DistributedFoundationPlan.html

- Locators: `[[sources/geek-ai-agent/20260922/oryxos/docs/K8sDeployGuide.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/SharedVolumeGuide.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/DistributedFoundationPlan.html]]`
- Purpose: The distributed-delivery trio. K8sDeployGuide: one-command Helm install, values table,
  rolling upgrade/rollback, liveness/readiness semantics, kind smoke test. SharedVolumeGuide: the
  shared-volume support matrix (NFS/CephFS/RWX supported; s3fs generally not), what the system relies
  on (close-to-open consistency, atomic rename, relative symlinks) and explicitly does not (cross-
  host file locks, inotify, mtime), the 042 pluggable `WorkspaceStorageProvider` + identity
  (`.workspace-id`) model, management write reservations, crash recovery, output publishing, and the
  real two-host acceptance criteria. DistributedFoundationPlan.html: a styled v0.4 review draft with
  the distributed goals, explicit non-goals, decision questions Q1–Q6, and the K8s two-replica
  acceptance demo.
- Key claims: state is externalized (PostgreSQL CAS leases); the file plane uses a DB version-number
  bus, not filesystem events; "never silently degrade" — misconfigurations refuse to start.
- Learner-relevant: a rare, candid engineering account of distributed-storage trade-offs and of how
  correctness is guaranteed with CAS leases — advanced system-design material.

### docs/ObservabilityModel.md / docs/ObservabilityRoadmap.md / docs/ScheduleIdentityMigration.md

- Locators: `[[sources/geek-ai-agent/20260922/oryxos/docs/ObservabilityModel.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/ObservabilityRoadmap.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/ScheduleIdentityMigration.md]]`
- Purpose: Observability data-model contract (one traceId shared across the audit tables, logs, SSE,
  OTel traces, and metrics; deterministic parent/child span model where the root span id = first 16
  hex of the traceId, recorded post-hoc) plus its roadmap (langfuse-style trace/eval/self-improve,
  now satisfied by 021/039/048). ScheduleIdentityMigration documents the schedule key→stable UUID
  `schedule_id` identity split and the `ScheduleSchemaUpgrade` SQLite migration.
- Key claims: four observability surfaces are "same source, different faces"; low-cardinality span
  attributes only (never prompt/args/results) to prevent leaks; NOOP-by-default `SpanRecorder`.
- Learner-relevant: teaches observability/tracing design and how to keep audit, logs, and traces
  consistent without new context-propagation infrastructure.

### docs/*ChannelSetup.md (per-platform setup guides)

- Locators: `[[sources/geek-ai-agent/20260922/oryxos/docs/FeishuChannelSetup.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/WeComChannelSetup.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/DingTalkChannelSetup.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/SlackChannelSetup.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/DiscordChannelSetup.md]]`, then `Qq`, `Weixin`,
  `WeixinKf`, `WeixinMp`, `WeixinMini`, `Douyin`, `Alipay`, `Telegram`, `WhatsApp`, `Teams`,
  `GoogleChat`, `Mattermost`, `Matrix` (`*ChannelSetup.md`)
- Purpose: Per-IM-platform onboarding: app creation, credentials (`${ENV_VAR}`), the
  `.oryxos/channels.yaml` entry, inbound/outbound behavior, sandbox domain allowances, and gotchas.
- Learner-relevant: demonstrates the "new Channel = new module, core untouched" extension contract in
  practice — a clean example of adapter/plugin design.

### docs/prompt/01-01.md and docs/prompt/prompt.md

- Locators: `[[sources/geek-ai-agent/20260922/oryxos/docs/prompt/01-01.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/docs/prompt/prompt.md]]`
- Purpose: The AI-coding prompt artifacts. `01-01.md` is a consolidated one-shot task ("build OryxOS
  from an empty repo, phase by phase, self-checking") with role, background, and staged
  instructions (docs → visual assets → Maven skeleton → …). `prompt.md` is the raw 14-round prompt
  log documenting the real iterative development (each round = a working session with goals and
  outcomes).
- Learner-relevant: primary-source evidence of how an AI-assisted project is actually driven over
  many sessions — ideal raw material for the "Loop/Harness" and "AI-era software engineering" themes.

### docs/superpowers/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docs/superpowers/plans/2026-08-01-provider-config-source-of-truth.md]]`
- Purpose: A dated design + plan pair for one bug-fix feature ("provider config single source of
  truth"): background, confirmed semantics, goals/non-goals, three compared approaches, component
  responsibilities (`ProviderRegistryBootstrap`, `ProviderRegistryValidator`, `OryxOsRuntime`,
  `ProviderStartupCheck`, `ChatCommand`), data flow, decision table, error handling, test strategy,
  and acceptance.
- Learner-relevant: a compact, high-quality example of writing a design doc and comparing
  alternatives before coding.

### specs/ (57 feature specs, Spec-Kit workflow)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/specs/]]`
- Purpose: The Spec-Kit feature set. Each numbered directory is one feature following the workflow
  **specify → clarify → plan → tasks → implement → analyze**, with the canonical artifacts:
  `spec.md` (user stories + acceptance scenarios + edge cases), `plan.md` (technical context,
  constitution check, project structure), `tasks.md` (phased, `[P]`-parallel, `[USn]`-tagged,
  test-adjacent tasks — e.g. `specs/001-provider-abstraction/tasks.md`), `research.md`,
  `data-model.md`, `contracts/`, `checklists/`, `quickstart.md`, and `acceptance-report.md`/
  `acceptance.md`. Spec status is `Draft` and tasks are checkboxes marked done as implemented.
  IM-channel rollout dirs (026, 029–038) instead carry `plan.md` + `acceptance.md` (+ sometimes
  `research.md`, no `spec.md`).
- Key exports: all 57 feature dirs follow this structure; notable features are the five core
  capability specs 001–011, knowledge/memory/audit 014–015, security & governance 018–024, and the
  future epics 042–051.
- Learner-relevant: the repo's most complete worked example of spec-driven development at scale.

**All 57 spec directories by id + title:**

| # | Directory | Title |
|---|-----------|-------|
| 001 | `001-provider-abstraction` | Provider — unified LLM entry point |
| 002 | `002-react-loop` | ReAct loop — the Agent's brain |
| 003 | `003-cli-entry` | CLI — OryxOS command-line entry |
| 004 | `004-notify-outbound` | Notify — unified outbound delivery |
| 005 | `005-tool-system` | Tool system — the hands that do the work |
| 006 | `006-memory-pluggable` | Memory — pluggable memory layer |
| 007 | `007-sandbox-whitelist` | Sandbox whitelist — pre-execution safety gate |
| 008 | `008-scheduled-tasks` | Scheduled tasks — let the Agent run on time |
| 009 | `009-web-service` | Web Service + first admin console |
| 010 | `010-folder-agent` | Plugin Agent — one directory defines a self-running Agent |
| 011 | `011-agent-lifecycle` | Dynamic Agent management — one-sentence generate, upload-to-go-live |
| 012 | `012-agent-send-shortcut` | Configurable Agent chat send shortcut |
| 012 | `012-agent-skill-links` | Agent Skill symlink binding + progressive loading |
| 012 | `012-web-auth` | Web Service authentication (minimal auth) |
| 013 | `013-overview-dynamic-data` | Admin overview dynamic data |
| 014 | `014-knowledge-base` | Knowledge base |
| 015 | `015-memory-semantic-recall` | Memory semantic recall + backend contract |
| 016 | `016-audit-dashboard` | Audit query + dashboard |
| 017 | `017-feishu-im-channel` | IM inbound abstraction + Feishu bidirectional |
| 018 | `018-rest-api-key` | REST API key authentication |
| 019 | `019-sse-streaming` | SSE streaming responses |
| 020 | `020-tool-policy` | Tool policy |
| 021 | `021-audit-trace` | Audit trace linking + masking |
| 022 | `022-secret-encryption` | Secret encryption storage |
| 023 | `023-provider-fallback` | Provider failover + metrics export |
| 024 | `024-container-sandbox` | Container-level execution isolation |
| 025 | `025-persona-library` | Persona + persona library + agent import |
| 025 | `025-pluggable-storage` | Pluggable storage |
| 026 | `026-im-channel-roadmap` | IM channel roadmap (plan + acceptance) |
| 026 | `026-session-ownership` | Session ownership + multi-replica correctness |
| 027 | `027-file-plane` | File-plane distribution |
| 028 | `028-agent-skill-filter` | Installed-Skill filter when creating Agents |
| 029 | `029-qq-im-channel` | QQ IM channel (plan + acceptance) |
| 030 | `030-cn-c-im-roadmap` | China C-end IM roadmap (plan + acceptance) |
| 031 | `031-douyin-im-channel` | Douyin IM channel (plan + acceptance) |
| 032 | `032-alipay-im-channel` | Alipay IM channel (plan + acceptance) |
| 033 | `033-weixin-kf-channel` | Weixin customer-service channel (plan + acceptance) |
| 034 | `034-taobao-im-channel` | Taobao IM channel (plan + acceptance) |
| 035 | `035-weixin-ilink-channel` | Weixin personal iLink channel (plan + acceptance) |
| 036 | `036-weixin-mp-channel` | Weixin official-account channel (plan + acceptance) |
| 037 | `037-weixin-mini-channel` | Weixin mini-program channel (plan + acceptance) |
| 038 | `038-pdd-im-channel` | Pinduoduo IM channel (plan + acceptance) |
| 039 | `039-identity-authorization` | Enterprise identity & authorization foundation |
| 039 | `039-k8s-delivery` | Container delivery (K8s) |
| 040 | `040-oidc-sso` | OIDC/SSO login + enterprise identity mapping |
| 041 | `041-asset-governance` | Asset governance (first cut) |
| 042 | `042-hitl-approval-policy` | High-risk approval policy contract (HITL) |
| 042 | `042-workspace-storage` | HA shared workspace + pluggable file storage |
| 043 | `043-durable-task-checkpoint` | Durable task state machine + checkpoint resume |
| 044 | `044-approval-interaction` | Admin + IM approval interaction |
| 045 | `045-markdown-flow-dsl` | Markdown Flow DSL + static validation |
| 046 | `046-durable-flow-engine` | Durable Flow execution engine |
| 047 | `047-flow-human-compensate-replay` | Flow human nodes, compensation, and replay |
| 048 | `048-agent-evals` | Agent/Skill/Prompt/Flow evals & regression gate |
| 049 | `049-versioned-asset-source` | Versioned Agent/Skill/Knowledge source |
| 050 | `050-cost-ledger` | Task-level cost ledger, budget & quotas |
| 051 | `051-model-routing` | Explainable model routing & cost strategy |

### .specify/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/.specify/]]`
- Purpose: The Spec-Kit workspace. `memory/constitution.md` is the 8-principle project charter
  (self-implemented ReAct; Spring AI protocol-only; explicit provider mapping; one directory = one
  Agent with symlinked Skills + progressive disclosure; audit day one; security-as-foundation with
  real-path checks, no SecurityManager; synchronous + virtual threads; directory-config-as-Agent,
  stateless instances). Also `templates/` (constitution/spec/plan/tasks/checklist), `scripts/bash/`
  (check-prerequisites, common, create-new-feature, setup-plan, setup-tasks), `integrations/`
  (Claude + Speckit manifests), `workflows/speckit/workflow.yml`, `feature.json`, `init-options.json`.
- Key claims: constitution version history 1.1.0 → 2.0.0 (Skills redefined, symlink binding added);
  the charter is machine-enforced via per-feature Constitution Check gates.
- Learner-relevant: the concrete artifacts that make "SDD as a discipline" real — templates,
  constitution, and scripted workflow any learner can reuse.

### config/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/config/]]`
- Purpose: Deployable configuration templates. `application.yml.example` (~263 lines) is the master
  runtime config: server port, SQLite/PostgreSQL datasource, multi-replica switches, global
  `embedding.*`, knowledge store, `memory.backend` (markdown/sqlite/mem0) + recall weights, sandbox
  whitelists (`file.allowed_paths`, `shell.allowed_commands`, `http.allowed_domains`, `smtp`),
  logging, `oryxos.root`, provider registry, author model, and commented auth/API-key/RBAC/OIDC/
  asset-governance/SSE blocks. `channels.yaml.example` (IM channel entries with env-placeholder
  credentials). `mcp_servers.yaml.example` (community MCP catalog with strict schema). Plus static
  analysis rulesets: `pmd-ruleset.xml`, `spotbugs-exclude.xml`, `dependency-check-suppressions.xml`.
- Learner-relevant: a real, well-commented configuration surface showing how security, memory,
  provider, and governance knobs are exposed to operators.

### docker/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/docker/]]`
- Purpose: Container support. `docker-entrypoint.sh` (the container equivalent of `start.sh` — exec
  foreground as PID 1 for SIGTERM, non-interactive first boot from template, logs to stdout).
  `mem0/compose.yaml` + `mem0/init-db.sql` (optional self-hosted mem0 memory backend).
- Learner-relevant: a clean example of adapting a JVM service to container lifecycle/graceful
  shutdown semantics.

### charts/ (Helm)

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/charts/oryxos/]]`
- Purpose: Official Helm chart `oryxos` (v0.1.0, appVersion 0.1.5-RELEASE). `Chart.yaml`,
  `values.yaml` (database, master key, workspace/RWX PVC, service, probes, shutdown, OTel, resources,
  extraConfig), `templates/` (`deployment.yaml`, `service.yaml`, `configmap.yaml`, `secret.yaml`,
  `pvc.yaml`, `_helpers.tpl`, `NOTES.txt`), `ci/default-values-test.yaml`.
- Key claims: only two required secret references (database + `ORYXOS_MASTER_KEY`); `replicaCount: 2`
  by default; bootstrap-posix workspace identity; `make helm-lint` renders/asserts the chart.
- Learner-relevant: the canonical "package a distributed service for K8s" template — probes, rolling
  update, graceful shutdown, secrets, shared storage.

### scripts/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/scripts/]]`
- Purpose: Ops/CI/acceptance utilities: `helm-verify.sh` (chart lint/template/kubeconform),
  `kind-smoke.sh` (local K8s acceptance), `rolling-probe.sh`, `eval-regression-gate.sh`,
  `jacoco-aggregate-line-gate.py`, `check-security-assumptions.py` + `test-security-assumptions.py`,
  `load-test.sh`, `package.sh` (deploy tarball), `install-git-hooks.sh`, `install-k8s-tools.sh`,
  `install.ps1`, `sync-upstream.sh`, `test-codex-key.sh`, and 042 shared-storage probes
  (`042-shared-storage-probe.py`, `042-nfs-blocked-write.py`, `042-shared-acceptance.md`).
- Learner-relevant: shows the breadth of release-engineering/verification automation behind a project
  beyond just writing features.

### bin/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/bin/]]`
- Purpose: Ready-to-use launch scripts: `oryx-server` (start/stop/restart/status), `start.sh`,
  `stop.sh`, `start-im-test.ps1`, `workspace-recover.py` + `test_workspace_recover.py` (042 crash
  recovery tool referenced by SharedVolumeGuide).
- Learner-relevant: the concrete "install-and-run" developer experience; the recovery script is a
  good example of operational tooling for a distributed file plane.

### solutions/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/solutions/]]`
- Purpose: Three copyable "beacon solution" packages for enterprise scenarios — each a workspace +
  agent(s) + flows + evals + permissions + acceptance script, with the same shape:
  `enterprise-controlled-rdops` (controlled R&D/ops Agent: default no dangerous writes, approval-only
  execution, audit/cost/result trail — tracks #480), `enterprise-process-ticket` (business process &
  ticket Agent: HITL Flow, failure compensation, timeline replay — #479), and
  `enterprise-knowledge-support` (knowledge/support Agent: citation policy, permissions, handoff
  Flow — #478). Each has `README.md`, `ACCEPTANCE.md`, a policy doc, `permissions.sample.yml`,
  `scripts/accept.sh`, and `workspace/` (`agents/`, `flows/`, `evals/`, `knowledge/`).
- Key claims: they do **not** change default runtime behavior (Flow engine and approval remain
  default-off); dangerous execution must pass a human `review` node; `apply` binds only the approved
  params.
- Learner-relevant: end-to-end reference architectures for governed enterprise agents — the practical
  payoff of HITL, Flow, evals, and policy.

### my-agent/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/my-agent/]]`
- Purpose: A minimal sample runtime workspace (`.oryxos/` with `AGENTS.md`, `SOUL.md`, `USER.md`) —
  the bootstrap files created by `oryxos init`. Serves as a tiny worked example of the workspace
  layout.
- Learner-relevant: grounds the "one directory = one Agent" model in an actual on-disk workspace.

### website/

- Locator: `[[sources/geek-ai-agent/20260922/oryxos/website/]]`
- Purpose: The VitePress docs site (bilingual `docs/` + `zh/`), config in `.vitepress/config.mts`,
  home in `index.md`, static assets in `public/`. English guide pages: `what`, `why`, `architecture`,
  `quick-start`, `provider`, `react-loop`, `tool`, `memory`, `profile`, `cli`, `api`, `auth`,
  `roadmap`, `contributing`, `github-workflow`, `maintainer`.
- Learner-relevant: a second, tutorial-oriented view of the same concepts (useful for simpler
  explanations than the 880-line TechnicalSolution).

### root files (CONTRIBUTING, LICENSE, dotfiles)

- Locators: `[[sources/geek-ai-agent/20260922/oryxos/CONTRIBUTING.md]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/LICENSE]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/.pre-commit-config.yaml]]`,
  `[[sources/geek-ai-agent/20260922/oryxos/.gitleaks.toml]]`
- Purpose: Contribution pointer (Apache-2.0 licensed), pre-commit hooks (spotless/format + secret
  scanning via gitleaks), and the `.githooks`/`.github` CI wiring.
- Learner-relevant: the project hygiene layer (license, hooks, secret scanning) that a serious OSS
  project ships from day one.

## Sources

- [[sources/geek-ai-agent/20260922/oryxos/README.md]]
- [[sources/geek-ai-agent/20260922/oryxos/CLAUDE.md]]
- [[sources/geek-ai-agent/20260922/oryxos/CHANGELOG.md]]
- [[sources/geek-ai-agent/20260922/oryxos/Makefile]]
- [[sources/geek-ai-agent/20260922/oryxos/pom.xml]]
- [[sources/geek-ai-agent/20260922/oryxos/Dockerfile]]
- [[sources/geek-ai-agent/20260922/oryxos/docker-compose.yml]]
- [[sources/geek-ai-agent/20260922/oryxos/docs/]]
- [[sources/geek-ai-agent/20260922/oryxos/specs/]]
- [[sources/geek-ai-agent/20260922/oryxos/config/]]
- [[sources/geek-ai-agent/20260922/oryxos/docker/]]
- [[sources/geek-ai-agent/20260922/oryxos/charts/]]
- [[sources/geek-ai-agent/20260922/oryxos/scripts/]]
- [[sources/geek-ai-agent/20260922/oryxos/solutions/]]
- [[sources/geek-ai-agent/20260922/oryxos/my-agent/]]
- [[sources/geek-ai-agent/20260922/oryxos/website/]]
- [[sources/geek-ai-agent/20260922/oryxos/bin/]]
- [[sources/geek-ai-agent/20260922/oryxos/.specify/]]
