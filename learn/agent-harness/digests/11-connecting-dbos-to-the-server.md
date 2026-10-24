---
source: sources/agent-harness/20260915/11-connecting-dbos-to-the-server.txt
source_type: text
source_lines: 369
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 在 server 端接上 DBOS：先建立 `env.ts` 用 dotenv 依序載入環境變數，因為資料庫初始化必須早於 AI SDK 的自動載入。
- 把整個 server 啟動流程收進 `main()`，依序 `ensureSchema`、`DBOS.setConfig`、`DBOS.launch`，再掛上 Express 與 WebSocket。
- WebSocket 訂閱 bus 事件並廣播給所有已連線 client；`submit task` 訊息則以 `DBOS.startWorkflow(runAgentWorkflow)` 啟動 durable workflow。
- 新 client 連上時先 replay 歷史事件，補上斷線期間錯過的內容，再讓 client 送出的訊息觸發（或續接）workflow。
- `startWorkflow` 回傳的是一個函式，必須立刻以參數呼叫；這是 DBOS API 容易看錯的地方。
- 除錯重點：camelCase 命名、`turn.text`、以及 `emit` 的變數遮蔽（本地宣告覆蓋了 import 進來的版本）。
- 驗證 durable 的方式：模型思考中直接殺掉 server 再重啟，前端重新整理後自動續傳，因為訊息陣列最後一則仍是待回覆的 tool/assistant 訊息。
- 這是從「有狀態但只在記憶體」跨越到「重啟後仍能續跑」的關鍵一步。

# L2 detail

- `#L1-L30` — 進入 server 端：先補一個 `env.ts`，用 dotenv 的 `config()` 指定 `.env` 路徑，讓環境變數在資料庫初始化前就載入完成。
- `#L31-L97` — 整理 server 匯入（DBOS、schema、bus 的 subscribe/history、`runAgentWorkflow`），把啟動邏輯包進 `main()`，依序 `ensureSchema`、`DBOS.setConfig`（app 名稱與 `DATABASE_URL`）、`DBOS.launch`。
- `#L98-L160` — 把 WebSocket 設定搬進 `main()`：用 bus 的 `subscribe` 註冊 listener，序列化事件後送給所有 `readyState` 為 open 的 client；`on connection` 時掛上 `on message`，安全地解析 `clientMessage`。
- `#L161-L205` — 處理 `submit task`：呼叫 `DBOS.startWorkflow(runAgentWorkflow)`，並解釋「回傳函式後立刻呼叫」的寫法；連線時另外用 `history()` 逐筆 replay 斷線期間的事件。
- `#L206-L263` — 收尾：刪掉舊的事件與 bus 邏輯，把 `server.listen` 放進 `main()`，檔尾以 `main().catch(...)` 統一錯誤並 `exit(1)`；過程中也修掉拼字與 `raw` 參數問題。
- `#L264-L306` — 執行後的除錯清單：DBOS 有啟動但 server 掛掉，原因是沒用 camelCase（`toolCallId`、`toolName`）、誤用 `text` 而非 `turn.text`，以及本地 `emit` 宣告遮蔽了 import 的 `emit`。
- `#L307-L369` — 示範 durable 行為：送出任務後在模型思考中殺掉 server，重啟並重新整理瀏覽器，串流自動續接；解釋這是因為 LLM 看到最後一則是 tool/assistant 訊息就繼續生成，與 client 無關。
