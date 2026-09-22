---
source: 第30节：动态管理 Agent 一句话生成、上传即上线
source_type: pdf
source_lines: 741
status: absorbed
absorbed_at: 2026-09-22
created: 2026-09-22
updated: 2026-09-22
---

# Digest — 第30节：动态管理 Agent 一句话生成、上传即上线

## Overview (L1)

- 本节目标 — make Agent directories take effect in real time (drop-in without restart), wrap the mechanism as REST endpoints, add "one sentence generates an Agent", and add a workspace file browser, so operations can create an Agent by speaking a sentence or by dropping a directory — two paths to the same place.
- 两条录入路径 — one truth source `.oryxos/agents/`, two entry paths (API upload + real-time directory watching); a new `WorkspaceWatcher` is the single registration entry, so upload-as-go-live = drop-directory-as-go-live.
- Agent 端点与生命周期 — all orchestration reuses lesson 29; the only new thing is the `AgentLifecycleService` that sequences steps and rolls back on failure; six endpoints on `AgentApiController`.
- 一句话生成与工作区 — generation is one LLM call with a human in the loop (draft → preview/edit → create); a read-only workspace browser with mandatory directory-traversal defense.
- 验收与实现回写 — `InOrder` sequencing and exception-injection rollback tests, plus a substantial "实现回写" section documenting the final implementation divergences and four added capabilities (per-Agent memory, fixed console session, editable files, regenerate-files).

## Sections (L2)

### 一-本节目标-Agent-能动态管-免重启

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#一-本节目标-Agent-能动态管-免重启]]`
- Summary: Lesson 29 established one Agent = one directory (`.oryxos/agents/<name>/` with AGENT.md + optional scripts/skills/REFERENCE.md) plus runtime registration, but the entry was still "log into the server, drop files, and restart to take effect" — unreachable by business systems, view-only in the admin. This lesson completes the last block: make Agent directories effective in real time (drop-in = live, no restart), package them as REST endpoints, add "one sentence generates an Agent" and a workspace file browser, so operations can speak one sentence to create an Agent or drop a directory — both converge. Three verifiable end states: (1) create/upload Agent = live — `POST /api/v1/agents` returns 200, no restart, the Agent appears in the list and self-runs at cron; (2) drop-directory = live — copy a directory via scp/git/editor and within seconds it's registered and usable without the API; (3) one-sentence generation — in the admin say "每天早上九点查北京天气，把穿搭建议发到团队群", the system uses an LLM to produce a valid AGENT.md for preview, edit, then one-click create.
- Key claims: With these endpoints, lesson 26's read-only admin limitation lifts — add "Agent 管理" and "工作区 (file browser)" pages, upgrading the admin from "can view" to "can actually manage"; only one resource is managed outward — the Agent (a directory), no other top-level concept.
- Learner-relevant: The dynamic-management goal and the three end states.

### 二-1-一个目录-两条录入路径-上传-实时扫描

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#二-1-一个目录-两条录入路径-上传-实时扫描]]`
- Summary: One truth source — `.oryxos/agents/`, one subdirectory per Agent. Two entry paths: (1) upload via `POST /api/v1/agents` — essentially validate then write the Agent directory into `.oryxos/agents/<name>/` (at least one AGENT.md, optional scripts/skills); (2) drop a directory by hand via scp/git pull/editor. The key is that the directory is watched in real time, not scanned once at startup — a new `WorkspaceWatcher` (full scan at startup, then JDK `WatchService` on `.oryxos/agents/`) is the single registration entry: add/modify/delete an Agent directory → `deriveProfile` validation → call lesson 29's `ProfileRegistry.register/remove` and `AgentScheduler.registerProfile/unregister`. So upload-as-go-live = drop-directory-as-go-live; one registration code path — API upload calls it after writing the directory, the watcher calls it on events, the same `register(agentDir)`; deletion is symmetric.
- Key claims: This pulls lesson 29's deferred "file-watching hot reload" forward because dynamic management's essence is "change directory = change runtime"; `WorkspaceWatcher` is a background daemon thread (like the scheduler thread — infrastructure, not an async programming model in the request chain, so it doesn't violate Constitution VII).
- Learner-relevant: The single-registration-entry design that guarantees API-created and file-created Agents behave identically.

### 二-2-Agent-端点-编排全复用-29-节

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#二-2-Agent-端点-编排全复用-29-节]]`
- Summary: No new capability — `deriveProfile`, register/unregister/validate are all from lesson 29; the only addition is an orchestrator `AgentLifecycleService` sequencing the steps and rolling back on failure. Endpoints: `POST /api/v1/agents` (validate provider exists/tool registered → write Agent directory → deriveProfile → `ProfileRegistry.register` → schedule if any), `POST /api/v1/agents/generate` (one sentence → LLM-generated AGENT.md draft returned as-is, not persisted, not registered), `GET /api/v1/agents` / `GET /{name}` (query defined Agents), `PUT /api/v1/agents/{name}` (edit body/provider/notify; if schedules change, unregister old handle then register new), `DELETE /api/v1/agents/{name}` (unregister schedule using lesson 29's handle → `ProfileRegistry.remove` → archive directory to `.oryxos/archive/`), and `POST /api/v1/agents/{name}/invoke` (lesson 26's stateless call, unchanged).
- Key claims: The judgment standard is still lesson 29's: API-created and hand-dropped Agents must behave identically — both bottom out in §2.1's `register(agentDir)`, no second implementation.
- Learner-relevant: The endpoint surface and the "orchestrate, don't duplicate" principle.

### 二-3-一句话生成一个-Agent

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#二-3-一句话生成一个-Agent]]`
- Summary: One-sentence generation is the lesson's only new face and is essentially one LLM call: give the model the user's sentence plus "OryxOS AGENT.md format spec" and let it produce a compliant AGENT.md (complete frontmatter + clear body). Crucially two steps with a human in the loop, never one sentence straight to live: (1) `POST /api/v1/agents/generate` takes the sentence → LLM generates the AGENT.md draft → returned as-is for frontend preview, not persisted, not registered; (2) the user reviews and can edit (especially the cron in schedules and tools permissions) → then calls `POST /api/v1/agents` to formally create.
- Key claims: This step is mandatory because the LLM may misread the time in cron or grant too many tools permissions — a human must glance; generation is itself an LLM call and is audited in `llm_calls` (Constitution V).
- Learner-relevant: Human-in-the-loop generation as the safe pattern for LLM-authored Agent definitions.

### 二-4-删除与更新的语义-提前定死

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#二-4-删除与更新的语义-提前定死]]`
- Summary: Delete an Agent: first unregister the schedule (lesson 29's stored handle pays off here) → remove from `ProfileRegistry` → move the whole Agent directory into `.oryxos/archive/` — no physical delete, since what it did lives in the audit tables and its definition should be traceable. Update an Agent: change the body to overwrite AGENT.md (ContextLoader re-reads each time, so it takes effect immediately); if schedules change, unregister the old handle then register the new, otherwise the old cron runs alongside the new. Manual delete is symmetric: delete/move a directory without the API and `WorkspaceWatcher` receives the delete event and unregisters — API delete is just the tidier "delete directory + archive" version of the same underlying unregister code.
- Key claims: Deletion is archive-not-delete for traceability; update-with-schedule-change must not leave an orphan old cron.
- Learner-relevant: The exact delete/update semantics and why they're defined up front.

### 二-5-错误码沿用-26-节口径

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#二-5-错误码沿用-26-节口径]]`
- Summary: Name already exists, illegal AGENT.md field, referencing a non-existent provider — all 400 with distinct codes; query/update/delete a non-existent Agent — 404. If one-sentence generation's LLM output isn't a legal AGENT.md, also 400 with a readable reason. No new status codes invented; all go through lesson 26's `ApiResponse` envelope.
- Key claims: Error semantics are inherited, not reinvented.
- Learner-relevant: Consistency of error handling across the facade.

### 三-代码怎么写

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#三-代码怎么写]]`
- Summary: The Controller stays thin — add methods to lesson 26's `AgentApiController` (it already has `POST /agents/{name}/invoke`): `@PostMapping("/generate")` returns one-sentence AGENT.md draft, `@PostMapping` creates (write directory + derive + register), `@GetMapping("/{name}")`, `@PutMapping("/{name}")`, `@DeleteMapping("/{name}")`. The create request body can be structured fields or a raw AGENT.md body — both end up as `.oryxos/agents/<name>/AGENT.md` (complex Agents with scripts/sub-instructions go via upload-directory / hand-drop). The orchestrator `AgentLifecycleService.create()` sequences four steps all reused from lesson 29: (1) validate (provider/tool exist, name not conflicting), (2) write Agent directory, (3) `register(agentDir)` shared with `WorkspaceWatcher`, (4) register schedule if any — rollback on any failure (delete the written directory, no half-Agent left). `generate()` is one LLM call returning an AGENT.md draft without persisting (audited). `delete()` unregisters schedule → removes index → archives directory. `WorkspaceWatcher.onAgentDirChanged` handles ENTRY_DELETE → unregister, add/modify → same `register(agentDir)`, with a single bad directory not dragging down the watcher (WARN and skip). The workspace browser adds read-only endpoints `GET /api/v1/workspace/tree` and `GET /api/v1/workspace/file?path=...` with mandatory directory-traversal defense (normalize the path and require it to stay under `.oryxos/`, else 400). The admin gains "Agent 管理" (list/view/edit/delete with confirmation + one-sentence create with editable preview) and "工作区" (file browser, read-only) pages.
- Key claims: `unregisterProfile` traverses `profile.schedules()`, cancels each `ScheduledFuture` with `cancel(false)`, then removes the handle — it doesn't touch `taskLocks`; `generate` uses the existing `ProviderService` (system default provider, audited).
- Learner-relevant: The lifecycle orchestration code, the rollback pattern, and the directory-traversal defense.

### 四-怎么验收-把编排与失败路径固化成-harness

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#四-怎么验收-把编排与失败路径固化成-harness]]`
- Summary: The complexity is entirely in orchestration order and failure rollback — unit-test territory: mock `agentStore`/`profileRegistry`/`agentScheduler`/`agentLoader`/`providerService`, use `InOrder` to nail order and exception injection to nail rollback. `AgentLifecycleServiceTest` (create runs in order; name conflict rejected at step one with no directory written; registration failure rolls back the written directory; create and watcher share `register(agentDir)`; delete order "unregister schedule → remove index → archive"; update with schedules change unregisters then registers), `WorkspaceWatcherTest` (hand-dropped directory triggers register without restart; delete unregisters; one bad directory doesn't break the watcher), `WorkspaceApiControllerTest` (tree structure; `file?path=../../etc/passwd` → 400 as the key regression), `GenerateTest` (draft parseable by AgentLoader, only generated, not persisted or registered; illegal LLM output → 400), `AgentApiControllerTest` (thin forwarding; conflict → 400, missing → 404, unified `ApiResponse`).
- Key claims: The two most valuable tests assert (a) registration failure must roll back the written directory and never reach schedule registration, and (b) delete must stop the schedule before touching the index/directory — because the reverse order leaves a window where a cron trigger dereferences a missing Profile (null pointer), a timing bug manual acceptance almost never catches.
- Learner-relevant: How to test orchestration ordering and rollback deterministically.

### 五-实现回写-最终落地与迭代增补

- Locator: `[[sources/geek-ai-agent/20260922/第30节：动态管理 Agent 一句话生成、上传即上线.pdf#五-实现回写-最终落地与迭代增补]]`
- Summary: The final implementation differs from the original design (which is kept as a record of design evolution), with four added capabilities. 5.1 Divergences: the `POST /agents/generate` endpoint was cancelled — creation becomes `POST /agents {name, description}` where the backend scaffolds a complete directory (AGENT.md + scripts/ + skills/ + REFERENCE.md from a template), and "generate with an LLM" sinks down to on-demand regeneration of an existing Agent; generation uses `ProviderService.chat(genSessionId, ProviderRequest.of(prompt)).text()` (there is no `complete`, only `chat`) with the Profile provider; since there's no "default model", new config keys `oryxos.author.provider`/`oryxos.author.model` were added (provider defaults to the first in `oryxos.providers`; an empty model returns a readable 503 instead of sending `model=null` to an OpenAI-compatible endpoint); the workspace browser became editable via `POST /api/v1/workspace/file {path, content}`. 5.2 Four additions: (1) per-Agent memory — global `MEMORY.md` → `.oryxos/agents/<name>/MEMORY.md`; the obstacle was that tools don't know which Agent they run for (`OryxTool.execute(JsonNode)` has no execution context, sessionId stops at ToolExecutor), solved by a new `ToolExecutionContext` (`ThreadLocal<String> agentName`) placed before and cleared after tool execution in the synchronous blocking model; read paths temporarily set the Agent name around `store.load`; the SPI and three backends (Markdown/SQLite/Mem0) are unchanged and backward compatible (no Agent context → Markdown backend falls back to the global path); endpoint `GET /api/v1/agents/{name}/memory`, global `GET /api/v1/memory` removed. (2) One fixed session per Agent — `channel="admin"`, `user="console"`, `profile=<Agent name>`, idempotent `getOrCreate` → a constant `admin:console:<name>`; endpoints `GET /api/v1/agents/{name}/session` and `POST /api/v1/agents/{name}/session/messages`. (3) Files editable — `POST /api/v1/workspace/file` reuses the traversal defense; editing an `AGENT.md` goes through `AgentLifecycleService.update` (write + validate + re-register; schedules change unregisters old handle) because macOS `WatchService` doesn't watch file changes inside subdirectories. (4) "Generate/edit Agent" — `POST /api/v1/agents/{name}/generate-files {description}` (one LLM call via `ProviderService.chat`, audited; `AgentLoader.parse` validates; returns `{relative path → content}` for preview; strips ``` fences) and `POST /api/v1/agents/{name}/files {files}` (validate AGENT.md parseable, then `agentStore.writeAll`, overwrite then re-register).
- Key claims: 5.3 gives the final endpoint table (agents CRUD, invoke, memory, session, session/messages, generate-files, files, workspace tree/file read, workspace file write); 5.4 the final admin form — no separate "workspace" menu, one Agent list with "新建 Agent" (name + description), and a detail page with five tabs (基本信息, 生成, 文件, 会话, 记忆).
- Learner-relevant: The final delivered state and the reasoning behind the template-scaffold vs LLM-generation split, per-Agent memory, and editable workspace.
