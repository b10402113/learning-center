---
source: 第27节：全流程串联（一）打通 Agent 主流程
source_type: pdf
source_lines: 490
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第27节：全流程串联（一）打通 Agent 主流程

## Overview (L1)

- 本节目标 — an integration lesson, not a new module: make one full chat/REST dialogue truly usable, walking the human-push chain through "想 → 查 → 答 → 记账" (think → look up → answer → record) so the Agent main flow goes from "unit tests green" to "actually works".
- 对表与对账 — first confirm every module's promised capability is still in place, then run one real dialogue ("今天北京天气怎么样，穿什么合适") through eight stations and reconcile every table: "exactly these traces, no more, no less".
- 五条典型缝隙 — integration bugs live at the seams: `Found 0 JPA repositories`, a tool fired twice, `session_id` mismatch across entries, a silently skipped Bootstrap file, and audit gaps on failure paths.
- 验收 — freeze the reconciliation into `HumanTriggerFlowIT` (three pillars + failure paths + three-face-same-source) plus two no-key gate tests (`MockProviderFlowTest`, `MockAgentE2ETest`) driven by a scripted mock provider.
- 本节交付物 — `SessionManager.listRecent`, `GET /api/v1/sessions`, `MockChatModel`, and `oryxos.root` override for hermetic whole-machine tests.

## Sections (L2)

### 一-本节目标-让主流程真能用

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#一-本节目标-让主流程真能用]]`
- Summary: The lesson's one goal: make one complete chat or REST dialogue walk all four steps — think, look up, answer, record — end to end. "Actually usable" is verifiable against a concrete standard: for "今天北京天气怎么样，穿什么合适" the system must (1) answer it by crossing eight stations and triggering two LLM calls plus one tool call; (2) record exactly-correct traces in `sessions`, `llm_calls`, `tool_invocations`; (3) show the same data from CLI, REST, and the admin web ("三面同源", three faces same source). All three must hold simultaneously.
- Key claims: Single-module tests green ≠ the chain connects — gaps hide at the seams between two modules; the method is "对账": run one real dialogue from entry to exit and, at each station, check it left the correct trace where one is due.
- Learner-relevant: Defines "真能用" as a falsifiable standard and introduces reconciliation ("对账") as the integration-verification method.

### 二-1-先对表-确认每个模块都在位

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#二-1-先对表-确认每个模块都在位]]`
- Summary: Before integrating, spend ten minutes checking each module's promised outward capability still exists — a condensed version of all prior lessons' acceptance lists: Provider (explicit mapping routing correct, auto tool execution off, `llm_calls` written on success and failure); ReAct (max-iteration fallback, each round accumulates back into Session); CLI (light/heavy command split, chat in and out); Notify (webhook push, clear error when channel unconfigured); Tool (nine built-ins callable, three sources unified into `OryxTool`); Memory (core memory always present, write-then-read with no cache); Sandbox (three whitelists enforce, violations written to `tool_invocations`); Scheduler (cron fires, local lock prevents overlap); Web Service (10 endpoints, unified error JSON, Vue build under `static/admin/`).
- Key claims: Any unchecked row means go back to that lesson and fix it first — installing a machine with a broken part makes every later failure a false alarm.
- Learner-relevant: A pre-integration readiness checklist that doubles as a cross-lesson capability map.

### 二-2-拉一次对话走一遍-怎么对账

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#二-2-拉一次对话走一遍-怎么对账]]`
- Summary: Ask the representative sentence "今天北京天气怎么样，穿什么合适" in `oryxos chat` (two model calls, one weather lookup), then reconcile table by table: `sessions` = 1 record with the complete history (user question, two model replies, one weather result); `llm_calls` = exactly 2 (decide whether to call the tool, then compose the answer), same session id, both successful, non-zero tokens; `tool_invocations` = exactly 1 (`http_get` weather), success with normal latency; `MEMORY.md` = untouched (this dialogue does not involve memory — if it changed, something writes memory indiscriminately).
- Key claims: "The traces that should be there are there" and "the traces that should not be there are not" are equally important — extra records are as much a bug as missing ones; then re-ask via REST (`POST /sessions` + `POST /sessions/{id}/messages`) and confirm identical reconciliation, proving "two entries share one engine" is an account you can settle, not a slogan.
- Learner-relevant: The concrete table-by-table reconciliation discipline and the "no extra records" rule.

### 二-3-会撞上的几个典型坑-怎么修

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#二-3-会撞上的几个典型坑-怎么修]]`
- Summary: Five seams that explode at integration despite each module's unit tests passing. (1) `Found 0 JPA repositories` — `scanBasePackages` can't drag along `@EnableJpaRepositories`/`@EntityScan`; fix by declaring their `basePackages` explicitly on the startup class; accept when the log shows N > 0. (2) A tool called twice — Spring AI's auto execution wasn't fully turned off (lesson-16 pit), fix by confirming execution authority lives only in `ToolExecutor`. (3) Session id mismatch across entries — the id is "channel + user + Profile", so if CLI and Web each concatenate it, one user splits into two histories; fix by generating the id only in `SessionManager`, with entries passing the three raw ingredients. (4) A missing Bootstrap file silently skipped — if `SOUL.md` is absent and `ContextLoader` skips silently, the Agent's persona quietly disappears; fix by at least WARN on missing files and hard-error when a Profile explicitly references a missing file. (5) Audit missing the failure half — each Provider timeout / Sandbox block / tool exception should leave a `success=false` record; create all three failure modes and reconcile.
- Key claims: Symptoms appear at runtime but root causes live at the hand-offs; the fix for each pit is a specific architectural single-source rule.
- Learner-relevant: A reusable list of integration seams and their single-source fixes.

### 二-4-跑起来给人看-启动-Web-Service-与管理台

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#二-4-跑起来给人看-启动-Web-Service-与管理台]]`
- Summary: Web Service and the admin (web manager) are two faces of one process — `oryxos serve`'s Spring serves both `/api/v1/**` REST and `/admin` pages, no second process. Starting the admin is a build task, not "open a webpage": `npm run build` outputs to `oryxos-web/src/main/resources/static/admin/`, Spring hosts `/admin` and falls back unmatched `/admin/**` to `index.html` (so client routes don't 404; `/api/v1/**` unaffected). Two prerequisites or it idles: `export DEEPSEEK_API_KEY=...` (since `OpenAiAutoConfiguration` is excluded) and the frontend already built into `static/admin/`. Startup: build frontend, `mvn clean package -DskipTests`, `java -jar oryxos-boot/target/oryxos-boot-*.jar serve --port 8080`; then verify `curl .../health` and open `/admin` and `/swagger-ui`.
- Key claims: This step closes "三面同源" — opening "sessions" in the admin shows the same weather/outfit dialogue from CLI/REST (same data, same engine, third view); publishing form is "one jar hosts everything", so the README documents the publish form, not `npm run dev`.
- Learner-relevant: The one-process-two-faces model and the build-chain setup that makes the third view real.

### 二-5-补一个对账要用的查询接口-列出会话

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#二-5-补一个对账要用的查询接口-列出会话]]`
- Summary: For reconciliation and "三面同源" to be automatically verifiable, every trace needs an HTTP query endpoint. Checking the 10 endpoints from lesson 26: session detail, memory, tools, profiles/info all exist; the only gap is "list sessions" (lesson 26 has by-id only, so the admin's session page was left empty). This lesson adds `GET /api/v1/sessions` — list sessions by last-active descending, default 100 summaries (session id, Profile name, channel, user, status, created/last-active, message count), no full dialogue body, optional `?status=active`. Implementation: `SessionManager.listRecent(int)` via `SessionRepository`, a `@GetMapping` without `{id}`, and a session-summary DTO — same extension pattern as lesson 26's `archive()`/`readAll()`.
- Key claims: `MemoryService.recall(keyword)` stays internal to ReAct for now (the harness asserts via full-text `GET /memory`); a future `GET /api/v1/memory/recall?keyword=` can be added when operations needs it.
- Learner-relevant: The principle that each trace must have a queryable endpoint before automated assertion is possible.

### 三-怎么验收-把对账固化成一个测试

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#三-怎么验收-把对账固化成一个测试]]`
- Summary: Freeze the manual reconciliation into one re-playable integration test `HumanTriggerFlowIT` (`@Tag("integration")`, needs a real key, CI-skipped by default). Three pillars + backup: Pillar 1 dialogue answers — create session, post the weather/outfit message, GET the session and assert user message, two model replies, one tool result; GET the list and assert the summary; query the DB and assert `llm_calls` exactly 2, `tool_invocations` exactly 1 (`http_get`), all successful. Pillar 2 memory — send a `save_memory`-triggering message ("记住：我在北京，怕冷"), assert `GET /memory` contains "北京", then a new session asking "我在哪个城市" uses it. Pillar 3 tools — `GET /tools` returns a non-empty list containing `http_get`/`save_memory`, matching the Profile's declared toolset. Backup — failure paths (Provider down, Sandbox block, tool exception) each leave `success=false` and don't crash; and cross-entry consistency.
- Key claims: A good harness doesn't just assert success but asserts "not more, not less" through DB counts, and treats the three failure modes as first-class.
- Learner-relevant: How to turn a manual audit into a deterministic, reusable integration gate.

### 无-key 也能跑-用 mock provider 把全链路搬进 gate

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#无-key-也能跑-用-mock-provider-把全链路搬进-gate]]`
- Summary: `HumanTriggerFlowIT` needs a real key and network, so it can only be run manually. To let "does the whole chain run" be judged automatically in the gate, add an independent mock provider under the explicit mapping's `mock` name (Constitution III), connecting no real model and needing no key. It scripts a deterministic ReAct: round one requests a tool, round two calls `save_memory` (really writing `MEMORY.md`, giving an observable file-write), then returns a final answer. Only the "model" is fake; `ReActLoop`/`ToolExecutor`/Memory/Session/audit all run real paths. Two no-key self-tests enter the gate and run with `mvn verify`: `MockProviderFlowTest` (manually assembled, fast — asserts ReAct two rounds, `save_memory` exactly once, MEMORY.md records the fact, complete session history, audit `llm_calls ×2`/`tool_invocations ×1`) and `MockAgentE2ETest` (`@SpringBootTest` with real HTTP port + SQLite — POST sessions/messages then query everything back). For hermeticity, `OryxOsRuntime`'s workspace root supports the `oryxos.root` system property (default `.oryxos`), so tests point to a temp workspace/library and override provider to mock.
- Key claims: The manual path uses `bin/start.sh 8080` with a `mock-agent` profile (`provider: mock`, `tools: [save_memory]`), then curl create/message/session/list/memory/tools and open `/admin` — CLI/REST/admin show the same data; swapping the profile to `default` runs the real model.
- Learner-relevant: The mock-provider technique for keeping full-chain verification inside CI without keys or network.

### 本节交付物

- Locator: `[[sources/geek-ai-agent/20260922/第27节：全流程串联（一）打通 Agent 主流程.pdf#本节交付物]]`
- Summary: Code — `SessionManager.listRecent(int)` (+ `JpaSessionManager`), the new `GET /api/v1/sessions` with a summary DTO, `MockChatModel` (independent mock provider under the `mock` name), and `OryxOsRuntime` workspace-root override via `oryxos.root`. Tests — `HumanTriggerFlowIT` (integration, real key), `MockProviderFlowTest`, `MockAgentE2ETest`, `MockChatModelTest`. Frontend — the admin session page wired to the new endpoint. Config — `config/application.yml.example` gains a built-in mock provider example. Docs — README endpoint table plus the "manual no-key mock" flow.
- Key claims: The human-push trunk is now connected: every station's trace reconciles, sessions/memory/tools are queryable, and all three entries show one source of truth; the next lesson connects the scheduler chain, restart recovery, and multi-Agent coexistence.
- Learner-relevant: The completion state and the bridge into lesson 28.
