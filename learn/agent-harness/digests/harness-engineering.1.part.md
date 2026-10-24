---
source: sources/agent-harness/20260915/harness-engineering
source_type: codebase
source_lines: 830
file_count: 11
language: TypeScript
part: 1
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- `harness/runtime.ts` — 整個 harness 的心臟：同一個 durable while 迴圈，每輪先 hydrate context、跑「當前 agent」的一回合、再把 tool 執行拆成 checkpoint 過的 step。Handoff、approval、compaction 都攔在這個迴圈裡，是控制平面與執行平面的交會點。
- `harness/bus.ts` — 事件總線的雙寫：先落 Postgres 再廣播。事件流不是 log 的附屬品，而是系統本身；inspector 能重播 crash 前的時間軸全靠這裡。
- `harness/tools.ts` — 工具 schema 與 harness 自有 executor 的分離。模型只看得到 schema，實際執行由 harness 決定，這是「拿回執行權」的關鍵一步；`handoff` 故意沒有 executor。
- `harness/sandbox.ts` — 跑模型自寫程式的唯一邊界。只給 `tools` 與 `console`，並誠實標示它擋得住同步無窮迴圈、擋不住 async 逃逸。
- `harness/memory.ts` — History / State / Context 三件事的實作。以 token 預算（不是回合數）觸發摘要，並在每回合重新組裝 context。
- `harness/agents.ts` — agent 只是「名字 + system prompt + 可用工具子集」的資料。特權工具的有無就是 least privilege 的實作。
- `harness/supervisor.ts` — plan → 平行 dispatch → fan-in → synthesize。Plan 是結構化的一等公民，`Promise.allSettled` 讓單一 sub-agent 失敗不會拖垮整個 workflow。
- `harness/investigators.ts` — 唯讀 sub-agent：工具帶 `execute`，AI SDK 在單一 durable step 內跑完工具迴圈，各自擁有 context window。
- `harness/db.ts` — Drizzle + Postgres 的 durable event log（`bigserial` 排序 + `jsonb` payload），同時也是 DBOS checkpoint 的落腳處。

# L2 detail

- `#L1-L22` — `harness/runtime.ts`（前段）— 匯入與三個政策常數：`MAX_STEPS = 30` 防呆上限、`NEEDS_APPROVAL = {issueRefund}` 把「需要人類點頭」寫成資料、`APPROVAL_TIMEOUT_S = 86400` 承認人類等待是無界等待。
- `#L23-L52` — `harness/runtime.ts`（modelTurn）— 一回合的定義：stream 出來的每個 `text-delta` 都變成 `ModelDelta` 事件，最後才把 tool calls 與原始 response messages 收斂成 `Turn`。事件是即時的，狀態是回合結束才成形。
- `#L53-L80` — `harness/runtime.ts`（toolStep）— 單一 tool 的執行被包成 DBOS step：先發 `ToolRequested`、再 `runTool`、再發 `ToolCompleted`。step 的 checkpoint 語意就是「已完成的不重跑」，副作用因此只發生一次。
- `#L81-L130` — `harness/runtime.ts`（迴圈開頭與壓縮）— 迴圈啟動時才重建 `currentAgent` 與 turns；超過 `MAX_CONTEXT_TOKENS` 就把最舊的回合剝進 running summary，直到降到 `KEEP_CONTEXT_TOKENS` 以下。摘要本身也是 step，所以 crash 不會重新摘要。
- `#L131-L148` — `harness/runtime.ts`（模型步與終止）— 模型呼叫是 `model-${step}` 這個 step；沒有 tool call 就代表任務結束，依序發 `ModelCompleted` 與 `WorkflowCompleted` 後回傳文字。
- `#L149-L165` — `harness/runtime.ts`（handoff 攔截）— `handoff` 不被執行，而是被 harness 攔下來換掉 `currentAgent`，並回一則合成的 tool result 要求接手者「真的把事情做完」。控制權橫向轉移，對話則原封不動留著。
- `#L166-L204` — `harness/runtime.ts`（approval 分支）— 特權工具先發 `ApprovalRequested`，再用 `DBOS.recv("approval")` 讓 workflow 暫停；人類同意才跑 tool，不同意則回一則「不要重試、轉人工」的 tool result。暫停期間 process 可以死。
- `#L205-L231` — `harness/runtime.ts`（一般工具與註冊）— 其餘工具一律走 `tool-${toolCallId}` step；撞到步數上限則發 `WorkflowFailed`。最後 `DBOS.registerWorkflow` 讓它成為可被 recovery 的 workflow。
- `#L232-L260` — `harness/bus.ts` — 總線的兩個職責：`emit` 先寫 `event_log` 再通知記憶體 listeners，`history()` 依 `seq` 讀回整條時間軸。順序很重要：先持久化，才不會廣播了卻重播不到。
- `#L261-L269` — `harness/model.ts` — 模型設定只存在一個地方。Provider 在請求當下才讀 `OPENAI_API_KEY`，所以 env 載入時序可以留給 server 處理。
- `#L270-L298` — `harness/tools.ts`（資料層）— 罐頭資料刻意埋了重複扣款 `ch_001`/`ch_002`，知識庫則藏了退款、Safari 匯出、50 人定價三個答案。這是後面 Code Mode、退款、supervisor 三個 demo 的共同素材。
- `#L299-L337` — `harness/tools.ts`（沙箱 API 與 Code Mode schema）— `sandboxApi` 只暴露兩個唯讀函式，所以重跑無害；`runCode` 的 description 等於一份迷你 API 文件，告訴模型在程式裡可以 `await tools.*`。
- `#L338-L398` — `harness/tools.ts`（其餘 schema 與 runTool）— 側效工具（`sendReply`）、特權工具（`issueRefund`）、控制訊號（`handoff`）並列；`runTool` 是唯一的執行入口，`runCode` 轉進沙箱，而 `handoff` 沒有 case——它根本不該被執行。
- `#L399-L458` — `harness/sandbox.ts` — 沙箱邊界的實作：context 只有 `tools` 與 `console`，模型程式被包成 async IIFE 以支援 `await` 與 `return`；`vm` 的 timeout 只管同步段，非同步另用 `Promise.race` 當保底。註解明說這不是真正的安全邊界，強度是部署選擇。
- `#L459-L478` — `harness/memory.ts`（預算與估算）— 壓縮門檻 `3000/1500` token，估法是大約 4 字元 1 token。註解把 HISTORY（事件日誌）、STATE（摘要）、CONTEXT（本回合可見）三者的差異講死。
- `#L479-L532` — `harness/memory.ts`（hydrate 與 summarize）— `buildContext` 的組裝順序是：當前 agent 的 system prompt → 釘住的任務 → 舊工作摘要 → 最近幾回合原文。`summarize` 明確要求保留 item id、金額、已送出的動作，因為摘要掉的正是可稽核的事實。
- `#L533-L597` — `harness/agents.ts` — `Agent = { name, systemPrompt, tools }`，所以新增專才是加資料而非加機械。triage 沒有 `issueRefund`（只能談、不能動錢），billing 有它且 prompt 更嚴；`agents` 只是查表。
- `#L598-L628` — `harness/supervisor.ts`（plan）— `PlanSchema` 把計畫變成可驗證的物件（`id` / `agent` / `objective`），用 `generateObject` 產生。計畫不是模型的碎念，而是會被 emit、被渲染、被 synthesis 讀取、也能撐過 crash 的產物。
- `#L629-L688` — `harness/supervisor.ts`（synthesize 與 dispatch）— 先定義「把所有調查結果寫成一篇回覆」的收斂 prompt，再 `Promise.allSettled` 對每個計畫步驟開一個 `subagent-${id}` durable step。每個 sub-agent 有自己的 context，主線不被工具噪音淹沒。
- `#L689-L725` — `harness/supervisor.ts`（fan-in 與收尾）— fan-in 只收 fulfilled 的結果，rejected 則發 `SubagentFailed` 後繼續；最後合成、發 `ModelCompleted` 與 `WorkflowCompleted`。這就是 graceful degradation：partial failure 是資料，不是例外。
- `#L726-L785` — `harness/investigators.ts` — sub-agent 的形狀：工具自帶 `execute`，所以 AI SDK 在內部跑完工具迴圈，整個 sub-agent 就是「一次有界互動 = 一個 durable step」。`stopWhen: stepCountIs(5)` 是它的界，`CHAOS_FAIL` 是失敗 demo 的開關。
- `#L786-L824` — `harness/db.ts` — `DATABASE_URL` 沒設就早失敗；連線池刻意小（5），因為這是事件日誌不是高流量 app DB。`event_log` 用 `bigserial` 提供全域順序、`jsonb` 存整顆事件；`ensureSchema` 讓 workshop 免 migration，`clearEventLog` 是 inspector 的 Clear。
- `#L825-L830` — `harness/system-prompt.ts` — prompt 已搬到 `agents.ts`，這裡只剩一則退款請求的範例任務：triage 會發現自己不能退款，於是 handoff。
