---
source: sources/background-agents/20261027/4-setting-up-the-workflow.md
source_type: text
source_lines: 155
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 製造故障 — `npm run checkout` 帶 `fault`（feature fault）產生第一個 alert 與 incident，先讓事件存在。
- Agent 與 Harness — agent = LLM + harness；同一個模型在 Cursor 與 Claude Code 表現不同，差別全在 harness。
- Inngest 與事件 — durable workflow 引擎把程式拆成 memoized 的 step，支援暫停、恢復；background agent 是 fire-and-forget，用 `incident/opened` 事件觸發（`createFunction`）而非 request/response。
- 第一個 step 內容 — 用 `getRun` 避免重複 investigation、寫死最多 8 次迴圈、每輪先取得 agent state、用 `goalsSatisfied` 決定性檢查是否達標並 `writeReport` 收尾。
- 核心主張 — 還沒碰到 LLM 也能完成一大半；模型不是 moat，harness 才是。

# L2 detail

- `#L1-L12` — 用 `npm run checkout` 加 `fault`（feature fault）製造一個 alert；目前還沒有 harness 可以處理它。
- `#L13-L28` — Agent 與 Harness 的差別：harness 是模型外面的所有程式碼（上下文、工具、workflow），同模型不同 harness 行為差很多。
- `#L29-L48` — Inngest 簡介：durable workflows、step memoization、暫停恢復、分散式運算與銀行轉帳舉例，以及選用理由（DX）。
- `#L49-L75` — 開始改 code：移除 `setRun`、加入 `randomUUID` 與 agent data imports（`AgentStates`、`getRun`、`goalsSatisfied`、`recordDecision`、`recordToolAction`、`setIteration`、`setRun`）、agent brain 的 `chooseAction`／`writeReport`、observe 的 `checkoutServiceUrl`。
- `#L76-L89` — `createFunction` 設定 function ID、名稱與 trigger；以 `incident/opened` 事件驅動，說明 fire-and-forget 與事件的角色。
- `#L90-L101` — step 如同 checkpoint 會被 memoized；從 `event.data.identifiers` 取得 `environmentId`、`runId`；先只用一個名為 whole agent loop 的 `step.run`。
- `#L102-L111` — 用 `getRun(runId)` 判斷是否已有 run，避免開出重複的 investigation。
- `#L112-L117` — 護欄：`for` 迴圈上限 8 次，避免無限執行。
- `#L118-L144` — 每輪先 `await` 取得 agent state 並用 `goalsSatisfied` 對照 `run.goalCondition`；達標時 `writeReport`、把 run 更新為 completed、清掉 state 並 `return`。
- `#L145-L155` — 收束：harness 才是差異化與 moat，強調 deterministic 的受控迴圈。
