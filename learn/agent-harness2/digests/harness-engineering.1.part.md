---
source: sources/agent-harness2/20261029/harness-engineering
source_type: codebase
source_lines: 830
language: TypeScript
file_count: 11
part: 1
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- `runtime.ts` — 整個 harness 的主幹：DBOS 註冊的 durable workflow 把「模型回合 → 工具執行 → handoff → 人工核准」串成可重放的迴圈，每一步都是具名 step。
- `agents.ts` — Agent 只是 `{ name, systemPrompt, tools }` 三個欄位的資料；triage 沒有 `issueRefund`，因此只能靠 handoff 把錢的事交給 billing。
- `tools.ts` — 工具註冊表與 harness 端唯一的執行器 `runTool`：schema 給模型看，副作用在這裡發生；`runCode` 一律轉進 sandbox。
- `sandbox.ts` — 沙箱邊界：用 `node:vm` 給模型程式碼一個只有 `tools` 與 `console.log` 的凍結 global，並誠實標示 timeout 只擋得住同步程式。
- `memory.ts` — 區分 history / state / context 三件事，用 token 預算（3000 / 1500）觸發壓縮，並用 LLM 產生滾動摘要。
- `supervisor.ts` — Plan → 平行派發 sub-agent → fan-in → synthesize；與 handoff 相反，supervisor 全程握有控制權。
- `investigators.ts` — 唯讀 sub-agent 定義，工具自帶 `execute` 讓 AI SDK 在單一 durable step 內跑完工具迴圈。
- `db.ts` / `bus.ts` — 持久化事件日誌（Postgres `event_log`，`bigserial seq` 定序）與 emit/subscribe/history 匯流排。
- `model.ts` / `system-prompt.ts` — 單一模型設定點與一則範例任務字串。

# L2 detail

- `#L1-L231` — `harness/runtime.ts` — 匯出 `runAgentWorkflow`（`DBOS.registerWorkflow`，`MAX_STEPS = 30`）。`modelTurn` 串流 `text-delta` 成 `ModelDelta` 事件並回傳 `{ text, toolCalls, responseMessages }`；`toolStep` 先發 `ToolRequested` 再 `runTool` 再發 `ToolCompleted`，整個包在 `DBOS.runStep` 裡保證副作用只執行一次。選學重點：`handoff` 不被執行而是被攔截、切換 `currentAgent` 並塞一則「你現在是 specialist」的 tool result；`NEEDS_APPROVAL`（`issueRefund`）會 `DBOS.recv("approval", 86400)` 讓 workflow 暫停數天，重啟後從同一行續跑。
- `#L1-L65` — `harness/agents.ts` — 定義 `Agent` 型別與 `triageAgent`、`billingAgent`，再以 `agents` 記錄以名稱查找。權限即資料：triage 的工具集刻意缺少 `issueRefund`，billing 則持有它並搭配更嚴格的 prompt。新增 specialist 不需要新機制，只需新增一個常數。
- `#L1-L129` — `harness/tools.ts` — 匯出 `CHARGES`（含刻意植入的重複扣款 ch_001/ch_002）、`searchKB`、`tools`（AI SDK `tool()` 定義的 schema：`runCode`、`classifyItem`、`draftReply`、`sendReply`、`issueRefund`、`handoff`）與 `runTool`。`sandboxApi` 只暴露唯讀的 `getCharges` / `searchKnowledgeBase`，所以重跑無害；Code Mode 讓模型寫一支程式取代十幾次來回工具呼叫。`runTool` 是 harness 擁有的執行器，副作用工具在此以一般 durable step 執行。
- `#L1-L60` — `harness/sandbox.ts` — 匯出 `SandboxResult`、`SandboxApi`、`runInSandbox`。程式碼被包成 `(async () => { ... })()` 丟進 `vm.createContext`，context 只有注入的 `tools` 與會收集 logs 的 `console.log`，沒有 `require`/`process`/`fs`/`fetch`。註解明講 `vm` 不是真沙箱、timeout 殺不掉非同步工作，因此正式環境要換成 e2b、Cloudflare Sandbox、Daytona 之類的隔離層——harness 負責「媒介」邊界，邊界強度是部署選擇。
- `#L1-L74` — `harness/memory.ts` — 匯出 `MAX_CONTEXT_TOKENS`、`KEEP_CONTEXT_TOKENS`、`estimateTokens`、`buildContext`、`summarize`。`buildContext` 依序組出「當前 agent 的 system prompt → 釘住不被摘要的任務 → 舊工作的摘要 → 最近幾輪原文」，示範 context 是每次即時組裝而非累積保存。`summarize` 是一次 LLM 呼叫（在 runtime 裡被包成 DBOS step），把舊回合併進滾動摘要，只壓縮到 6000 字元。
- `#L1-L128` — `harness/supervisor.ts` — 匯出 `runSupervisorWorkflow`。以 `PlanSchema`（zod）用 `generateObject` 產出結構化 plan（`steps[].id/agent/objective`）並發出 `PlanCreated` 事件，plan 本身就是可渲染、可倖存崩潰的一級產物。接著 `Promise.allSettled` 對每個 plan step 各開一個 DBOS step 平行執行，fan-in 時成功者收進 findings、失敗者發 `SubagentFailed` 後繼續（degrade），最後 `synthesize` 合成一封回覆。
- `#L1-L60` — `harness/investigators.ts` — 定義三個唯讀調查員（billing / technical / sales）與匯出 `runInvestigator`。工具帶 `execute`，AI SDK 用 `stopWhen: stepCountIs(5)` 在內部跑完工具迴圈，因此整個 sub-agent 是「一個有界的 durable step」；唯讀特性讓重跑安全。`CHAOS_FAIL=<agent>` 環境變數可重現失敗情境。
- `#L1-L39` — `harness/db.ts` — Drizzle + postgres.js 連線（`max: 5`，缺 `DATABASE_URL` 直接拋錯）。匯出 `db`、`eventLog` 表（`seq bigserial` 當全域順序、`data jsonb` 存整個事件）、`ensureSchema`（開機 `CREATE TABLE IF NOT EXISTS`，免遷移）與 `clearEventLog`。這是「事件日誌是真相來源」的落地處。
- `#L1-L29` — `harness/bus.ts` — 匯出 `subscribe`、`emit`、`history`。`emit` 先補 `id`/`ts`、`await` 寫入 Postgres，才同步廣播給記憶體 listeners，順序即為 durability 先於可見性。`history` 每次連線都從資料庫依 `seq` 重讀整條時間軸，所以崩潰前的工作也看得到。
- `#L1-L9` — `harness/model.ts` — 全專案唯一的模型設定點，匯出 `openai("gpt-5.5")`；註解說明可換 `gpt-5-mini` 省成本，API key 於請求時由環境讀取。
- `#L1-L6` — `harness/system-prompt.ts` — 只剩一個範例任務常數 `SAMPLE_TASK`（cus_88121 被重複扣款要求退款），prompt 已搬到 `agents.ts`。它同時是 demo 腳本：triage 認出自己不能退款，於是 handoff 給 billing。
