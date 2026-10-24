---
source: sources/agent-harness/20260915/harness-engineering
source_type: codebase
source_lines: 2512
file_count: 7
language: Markdown
part: 4
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- `lessons/index.md` — VitePress 首頁，一句話定位整門課：「不是造 agent，是造能 durable 跑任何 agent 的東西」。
- `lessons/02-durable-execution/index.md` — 全課的情感中心。把「in-memory 狀態 + 不可撤回的副作用」換成 event log 加 checkpoint，並誠實說明 in-flight step 仍是 at-least-once。
- `lessons/03-secure-sandboxing/index.md` — Code Mode 才是沙箱存在的理由：讓模型寫一支程式取代十幾次 tool round-trip，然後把執行關進 harness 中介的邊界。
- `lessons/04-advanced-memory/index.md` — 把 History / State / Context 拆開；按 token 預算壓縮，context 每回合重組，長 session 的 token 才會持平。
- `lessons/05-orchestration-routing-handoffs/index.md` — 先承認「你多半不需要 handoff」，再說什麼時候需要：least privilege、不同護欄、不同團隊擁有。Handoff 是橫向轉移控制。
- `lessons/06-hierarchical-supervision/index.md` — plan 是一等公民產物；`Promise.allSettled` 讓 partial failure 變成可處理的 rejected，而不是整個 workflow 掛掉。
- `lessons/07-human-in-the-loop/index.md` — 人類等待是 durable workflow state：`recv` 暫停、`send` 喚醒，重啟後仍能續行；最後收束七課。

# L2 detail

- `#L1-L11` — `lessons/index.md` — 首頁只做定位：hero 的 tagline 把七個能力一次列出（event log、checkpointing、sandboxed tools、context hydration、routing、supervision、approval），並把入口指向第一課。
- `#L12-L51` — `lessons/02`（失敗模式）— 三個動作就能複現：提交任務、`Ctrl-C`、重啟。壞掉的不是訊息不見，而是「哪些副作用已經發生」無人記得；所以 retry 不等於 durability，durability 是知道哪些事不能再做。
- `#L52-L250` — `lessons/02`（兩個 durable store）— 用 DBOS 把每個 model/tool 呼叫變成 checkpoint 過的 step，用 Drizzle 把 in-memory 事件緩衝換成 Postgres 表。關鍵手法是**從 AI SDK 手上拿回 tool 執行權**（移除 `execute`、改寫 `runTool`），否則無法把副作用包進 step。
- `#L251-L479` — `lessons/02`（durable 迴圈的代價）— workflow body 在 recovery 時會整段重跑，所以 body 必須 deterministic：非確定性（模型、工具、時鐘）全部關進 step。`server/env.ts` 的存在則是「import 早於 top-level」的副產品。
- `#L480-L594` — `lessons/02`（DBOS 生命週期與重播）— `launch()` 同時是 recovery；WebSocket 連上時重播的是資料庫時間軸，不是記憶體。message handler 必須先註冊再 `await history()`，這是 async 化後最容易漏的順序問題。
- `#L595-L674` — `lessons/02`（驗證與誠實的邊界）— `inspect-log.ts` 用量化方式證明「零重複副作用」；課文也自己補上 fine print：完成的 step 不重跑，但 crash 當下 in-flight 的 step 會重跑，所以嚴格說是 at-least-once，production 要靠 idempotency key 補到 exactly-once。DBOS 另一個坑是 per-code-version recovery。
- `#L675-L704` — `lessons/03`（Code Mode 的動機）— 逐一呼叫工具時，每個中間結果都要繞回模型一次，既慢又貴，而且正好打在 LLM 最弱的多步算術上。讓模型寫一支程式，只讀最終結果，才有 30% 步驟縮減的那種效益；而一旦跑模型寫的程式，沙箱就不再是選配。
- `#L705-L748` — `lessons/03`（邊界的形狀）— 沙箱只給 `tools` API 與 `console`，模型程式被包成 async 函式；同步無窮迴圈由 `vm` timeout 處理，async 掛住則另用 race 當保底。課文直接承認 `node:vm` 不是真隔離，強度是部署選擇。
- `#L749-L908` — `lessons/03`（工具面與唯讀約定）— 進沙箱的 API 刻意只有唯讀（`getCharges`、`searchKnowledgeBase`），所以 `runCode` 整個 step 重跑也無害；會產生副作用的 `sendReply` 留在外面當一般 durable step。`runCode` 只是又一個 tool，所以 Lesson 2 的迴圈完全不用改。
- `#L909-L986` — `lessons/03`（prompt 與護欄示範）— prompt 明確要求「需要算術就寫程式，不要在腦裡算」；`test-sandbox.ts` 則在 agent 之外直接展示三條護欄。失敗的 `runCode` 會變成模型讀得到的 tool result，自我修正因此是免費的。
- `#L987-L1044` — `lessons/03`（結果與 production）— demo 是一次 `runCode` 完成 fetch/group/dedupe/compute，回傳 $49.00；runtime 一行都不用動。真實系統把同一條邊界換成 e2b、Cloudflare Sandbox、Fly、Vercel、Daytona，但 harness 的責任不變：所有危險能力只經過一個中介點。
- `#L1045-L1071` — `lessons/04`（三個概念）— History 是發生過的一切（Lesson 2 的 event log）、State 是舊回合的滾動摘要、Context 是本回合模型真正看到的東西。重點句：context 是 runtime 的決策，不是聊天紀錄。
- `#L1072-L1160` — `lessons/04`（hydrate 與 summarize）— `buildContext` 的順序（system → 釘住的任務 → 摘要 → 最近回合）就是「什麼絕對不能摘掉」的宣告；`summarize` 的 prompt 要求保住 id、金額、已送出的動作，因為那些是可稽核的事實。壓縮門檻用 token 而非回合數，因為模型會把多個 tool call 塞進同一回合。
- `#L1161-L1324` — `lessons/04`（改迴圈）— 迴圈改成存「回合陣列」， compaction 發生在 hydrate 之前，摘要與 `memory.compacted` 事件都是 DBOS step，所以 crash 不會重新摘要。歷史仍然完整躺在 Postgres，只是不再全部送給模型。
- `#L1325-L1458` — `lessons/04`（讓記憶可被清除）— 先讓任務變長（五個 work item）才看得到壓縮；再補上 `clearEventLog()` 與 `POST /api/clear`，連帶需要 CORS 與 reload。這是 operator ergonomics，不是 agent 能力，但沒有它就很難反覆 demo。
- `#L1459-L1489` — `lessons/04`（量測與 production）— 實測 context 穩定在 500–730 token，跨 11 次 tool call 仍持平，靠的是摘要保住了事實。production 會再疊 sliding window、結構化 state store 與 retrieval；但不變的是「memory 不是一件事」。
- `#L1490-L1518` — `lessons/05`（先說不需要）— 單一 agent 其實已能處理三種領域，agent swarm 多半是過度設計。Handoff 只在對造是「真正不同的東西」時才划算：最小權限、不同護欄／模型、不同團隊擁有。課文也把 handoff（橫向轉移控制）與 sub-agent（父層呼叫、保留控制）分清楚。
- `#L1519-L1601` — `lessons/05`（agent 即資料）— 把迴圈重構成吃 `Agent` 定義而非硬寫的 prompt + tools，harness 就變成通用 runtime。triage 沒有 `issueRefund`，這不是 prompt 的禮貌請求，而是工具清單裡真的不存在；billing 有它，且 prompt 更嚴。
- `#L1602-L1727` — `lessons/05`（工具與 context 的調整）— 新增特權工具與 `handoff` schema；`runTool` 刻意沒有 `handoff` case，因為它由 runtime 攔截。`buildContext` 改成接受 `systemPrompt` 參數，這樣同一個 hydrate 函式能服務「當前 agent」。
- `#L1728-L1889` — `lessons/05`（攔截 handoff）— 迴圈帶著 `currentAgent` 跑，遇到 `handoff` 就發 `AgentHandoff`、換掉 agent、回一則合成 tool result。因為 handoff 是「快取模型決定的結果」，recovery 時重建 `currentAgent` 仍是 deterministic，durability 免費成立。
- `#L1890-L1916` — `lessons/05`（demo 與 production）— trace 顯示 triage 先自己查一次，交棒後 billing 再獨立驗一次才退款；兩邊都不越界。跨組織時才需要 A2A 或 MCP 這類協定，但概念不變：routing 是控制平面決策，handoff 是帶型別的 control transfer。
- `#L1917-L1951` — `lessons/06`（什麼時候值得）— 一樣先說「你通常不需要」。Supervision 的三個正當理由：context 隔離（sub-agent 各自吸收工具噪音）、平行化、以及能容許部分失敗的合成。並再次對照：handoff 轉移控制，supervision 保留控制。
- `#L1952-L2052` — `lessons/06`（investigator 的形狀）— sub-agent 是唯讀的：工具自帶 `execute`，AI SDK 在內部跑完工具迴圈，因此「一個 sub-agent = 一個有界的 durable step」。`stopWhen: stepCountIs(5)` 界定成本，`CHAOS_FAIL` 則讓「壞一個 sub-agent」可重現。
- `#L2053-L2193` — `lessons/06`（四個階段）— plan 用 `generateObject` 產出結構化物件並 emit；dispatch 用 `Promise.allSettled` 對每個步驟開 durable step；fan-in 只收成功、把失敗記成事件；synthesize 把存活結果寫成一篇回覆。`allSettled` 是整個 pattern 的關鍵：throw 只會變成 rejected，不會帶走 supervisor。
- `#L2194-L2259` — `lessons/06`（opt-in 與 demo）— server 只加一行：依 `message.mode` 選 runtime。demo 先看三個 investigator 同時開跑，再用 `CHAOS_FAIL=technical` 看 workflow 仍然 completed、回覆少一角但承認該領域待跟進；最後切回單 agent 做誠實比較。
- `#L2260-L2267` — `lessons/06`（production）— 這是 orchestrator-worker pattern；真正規模化時 sub-agent 應該變成佇列上的 durable child workflow（有界併發、獨立重試），而不是平行 step。但形狀一樣：plan、fan out、fan in、synthesize、撐過 partial failure。
- `#L2268-L2293` — `lessons/07`（問題）— naive 解是 `await askUser()`：把 server 掛住、重啟就消失、也不可能等三天。人類暫停必須是 first-class 的 durable workflow state；而這正好是 Lesson 2 已有的 primitive：`recv` 暫停、`send` 喚醒。
- `#L2294-L2377` — `lessons/07`（攔截特權工具）— 工具迴圈多了第三個分支：`NEEDS_APPROVAL` 的工具先發 `approval.requested`，再 `DBOS.recv("approval", 86400)` 讓 workflow 停住，醒來後發 `approval.resolved`，同意才跑 tool、不同意則回「不要重試」。`recv` 是 workflow primitive 而非 step，收到的訊息會被 checkpoint。
- `#L2378-L2426` — `lessons/07`（prompt 與預算的微調）— billing 的 prompt 改成「一定要真的呼叫 `issueRefund`，不要只描述」——這是行動與描述之間的落差，只有 demo 才會暴露。同時把 compaction 門檻調高，避免短任務一開場就被壓縮。
- `#L2427-L2472` — `lessons/07`（把決定送進去）— server 加 `express.json()`、preflight 與 `POST /api/approve/:workflowId`，用 `DBOS.send` 喚醒暫停中的 workflow；訊息寫進 Postgres，所以跨 process 也能送達。UI 的審批卡是課程預先提供的，學員不寫。
- `#L2473-L2512` — `lessons/07`（收束）— demo 在等待審批時 `Ctrl-C`，重啟後 DBOS 印出 recovery，按 Approve 才真的退款。production 對應 Temporal signals、Inngest `waitForEvent`、HumanLayer，同一個 primitive 也能拿來「先審計畫再執行」。最後一節把七課收成一句：你有的不是一個 agent，而是能跑任何 agent 的 runtime。
