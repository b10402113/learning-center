---
source: sources/background-agents/20261027/server
source_type: codebase
source_lines: 1086
language: TypeScript
file_count: 14
status: skipped
skip_reason: "Repository scaffolding, not part of the course material."
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 入口與主迴圈（`agent.ts`、`agent-workflow.ts`）— Express 掛載 Inngest serve，durable function `incidentAgent` 以最多 24 個 cycle 執行 observe → goal check → choose → policy → act。每個副作用都包在 `step.run`，等待用 `step.waitForEvent` / `step.sleep`，因此流程可重放、可暫停、可恢復。
- 決策與工具政策（`agent-brain.ts`、`tool-policy.ts`）— LLM 只提出「下一個動作」，不直接執行。`chooseAction` 用 structured output 回傳 `action` / `reason` / `detail`；`actionPolicy` 把每個 `ActionName` 對應到 read、write、approval、help、terminal、wait，由 harness 決定是否放行。
- 持久化執行與 wait/resume（`agent-workflow.ts`、`agent-data.ts`）— run 狀態存 Postgres，`eventSequence` 是喚醒訊號；`wait` 或等待人工時，迴圈以 `step.waitForEvent` 加 timeout 反覆對帳，恢復後重新 `agentState` 讀最新世界狀態，不信任舊 payload。
- HITL 核准（`agent-data.ts`、`operator.ts`）— `proposeAction` 建立 `approvals` 記錄並把 run 設為 `needs_approval` / `needs_help`；`decideProposal` 寫入人工決定並送出 `agent/approval.decided`，核准後再用 `expectedVersion` 重驗狀態，過期或狀態已變就標成 `stale`。
- 資料層（`schema.ts`、`db.ts`）— Drizzle + Postgres，核心表為 `environments`（實體表名 `labs`）、`runs`、`events`、`actions`、`approvals`、`timeline`；保留舊欄位以相容既有 Neon 資料，但 agent 只以 environment 為契約。
- 事件入口與觀察（`incident-data.ts`、`observe.ts`）— `ingestServiceEvent` 以穩定的 event id 做幂等，必要時建立新 run 或遞增 `eventSequence`，服務重啟則把舊 run 標為 `superseded`；`getLatestState` 直接向 checkout 服務的 `/state` 取得 snapshot，事件本身不當作狀態快照。
- 可觀測性（`agent-log.ts`）— 每個階段寫入 `timeline`，kind 為 `agent:<phase>`，phase 涵蓋 start、observe、resume、loop、predict、act、pause、human、terminal，營運端可用單一時間軸重建 agent 行為。
- 控制面與環境設定（`operator.ts`、`environment.ts`、`inngest.ts`、`seed.ts`）— operator API 提供 dashboard、事件注入、取消、activity 查詢與核准；`environment.ts` 定義預設 goal 與 `GoalCondition`，`seed.ts` 初始化環境，`inngest.ts` 共用同一個 client。

# L2 detail

- `#L1-L28` — server/agent.ts — agent process 的入口：檢查 `OPENAI_API_KEY` / `OPENAI_MODEL`，建立 Express，將 body limit 提高到 10mb 以容納 Inngest 重放，掛載 `/api/inngest` 的 `serve({ client: inngest, functions: [incidentAgent] })`，並提供 `/api/health`；展示「agent 服務只是 durable function 的宿主」。
- `#L29-L244` — server/agent-workflow.ts — 整個背景 agent 的核心：`executeAction` 呼叫 checkout `/operations` 並記錄結果；`incidentAgent` 是 Inngest function，trigger 為 `incident/opened`，具備 retries、`cancelOn`、以 `environmentId` 為 key 的 concurrency 與 `onFailure`。迴圈最多 24 次，每輪 observe、檢查 `goalSatisfied`、`chooseAction`、套用 `actionPolicy`，處理 wait/complete、人工核准、stale 重驗、`step.sleep` settle 與決策上限；是 durability、wait/resume、HITL 三件事交會的地方。
- `#L245-L295` — server/agent-brain.ts — LLM 介面：`decisionSchema` 限定 `action` 必須是 `ACTIONS` 之一，`chooseAction` 以 `generateText` + `Output.object` 產生結構化決策，system prompt 明講「harness 驗證並控制執行」、alert 不是證據、help 回覆不等於恢復；`writeReport` 產生最終事件報告。展示模型負責判斷、程式負責治理的分工。
- `#L296-L310` — server/tool-policy.ts — `actionPolicy` 是 `Record<ActionName, 'read' | 'write' | 'approval' | 'help' | 'terminal' | 'wait'>`，逐一映射 `inspect_logs`、`inspect_changes`、`disable_feature`、`rollback_release`、`request_help`、`complete`、`wait`；註解說明 harness 讀政策中繼資料，不依 checkout 的 fault flag 分支。
- `#L311-L598` — server/agent-data.ts — run 與人工決策的資料操作層：`getRun` / `setRun`（terminal 狀態不可覆寫，並依狀態記 `terminal` / `pause` / `human` / `resume` phase）、`setIteration`、`cancelRun`、`agentState`（併行讀取 world、run、最近 events/actions/approvals，檢查 environment 與 instance 一致，回傳 LLM 用的狀態並記錄 observe/resume）、`goalSatisfied`（以 dot path 取值比對 `condition.equals`）、`recordDecision`、`recordToolAction`、`proposeAction`（建立 pending approval、10 分鐘到期、轉 `needs_approval`/`needs_help`）、`getProposal`（自動標記 expired）、`decideProposal`（終止中的 run 轉 stale、help 必須附答案、送出喚醒事件）、`staleProposal`。這是核准狀態機與 idempotent 工具紀錄的所在。
- `#L599-L639` — server/agent-log.ts — 可觀測性寫入：`AgentActivityPhase` 型別列出九個 phase；`logAgentActivity` 寫 `timeline`（kind = `agent:${phase}`），`activityForRun` 依時間倒序取最近 200 筆供 operator 顯示。示範把 agent 內部迴圈、等待與人工介入統一成同一種事件。
- `#L640-L656` — server/observe.ts — 觀察邊界：`checkoutServiceUrl` 可由 `CHECKOUT_SERVICE_URL` 覆寫；`snapshotSchema` 驗證 `instanceId`、`version`、`state`；`getLatestState` 以 HTTP 讀 `/state`，註解強調不共享服務記憶體、不把 event payload 當狀態快照。
- `#L657-L843` — server/incident-data.ts — 事件 ingestion 與營運視圖：`ingestServiceEvent` 驗證 instance、以 transaction + `for('update')` 鎖住 environment，對重複 event id 回傳原 dispatch，將不同 instance 的 active run 標為 `superseded` 並把 pending approval 標 stale，健康時不開新 run，事件到來時遞增 `eventSequence`、寫 `events` 與 timeline，最後送出 `incident/opened` 或 `incident/updated`；`dashboard` 彙整 service snapshot、events、runs、approvals，並在 checkout 掛掉時仍保留 operator inbox。展示 idempotency、run 生命週期與 trigger 設計。
- `#L844-L880` — server/environment.ts — 目標設定：`DEFAULT_GOAL` 描述調查、恢復、求助、驗證與記錄；`DEFAULT_CONDITION` 是 `{ path: 'health.status', equals: 'healthy' }`；`configuredGoal` 讀 `AGENT_GOAL`；`ensureEnvironment` 取最新 environment，沒有就建立一筆 legacy 相容的初始資料。說明「goal 是可設定的完成條件，而非 prompt 裡的一句話」。
- `#L881-L946` — server/operator.ts — operator 控制面：Express API 提供 `/api/health`、`/api/dashboard`、`/api/service/events`（以 Zod 驗證 stable event id 與 `serviceId: 'checkout'`）、`/api/runs/cancel`、`/api/runs/:runId/activity`、`/api/approvals/decide`，並有 ZodError → 400、其餘 → 500 的錯誤中介層；啟動前先 `ensureEnvironment`，監聽 3001。展示人機介面如何只透過既有資料層操作 run。
- `#L947-L1066` — server/schema.ts — Drizzle schema：`environments` 實體表名為 `labs`，保留舊欄位但 agent 只讀 `state`、`version`、`goal`、`goalCondition` 等；另有 `events`、`actions`、`runs`、`approvals`、`timeline` 與未使用的 `eventPlans`、`observations`。`runs` 帶 `instanceId`、`eventSequence`、`iteration`、`waitReason`、`report`，`approvals` 帶 `expiresAt` 與 `status`，是整體狀態機的持久化契約。
- `#L1067-L1076` — server/db.ts — 連線層：從 `DATABASE_URL` 建立 `postgres` client（`max: 5`、`connect_timeout: 10`），再包成 `drizzle(client, { schema })`；缺少連線字串即啟動失敗。
- `#L1077-L1080` — server/inngest.ts — 共用 Inngest client：`new Inngest({ id: 'background-agents-workshop' })`，讓 workflow 與 API 使用同一個 app id。
- `#L1081-L1086` — server/seed.ts — 初始化腳本：呼叫 `ensureEnvironment` 印出 environment id，然後 `client.end()` 關閉連線；是資料庫與環境可用的最小健康檢查。
