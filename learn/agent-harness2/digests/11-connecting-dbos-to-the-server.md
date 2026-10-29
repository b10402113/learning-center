---
source: sources/agent-harness2/20261029/11-connecting-dbos-to-the-server.txt
source_type: text
source_lines: 369
supplements:
  - harness-engineering.3.part.md#L1-L92
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 需要 `env.ts` 在啟動最前面用 dotenv 載入 `.dev.vars`，否則資料庫連線拿不到變數。
- server 啟動收進 `main()`：先 `ensureSchema`，再 `DBOS.setConfig` 與 `DBOS.launch`。
- websocket 的 `subscribe` 改成廣播持久化事件；client 連上時用 `history` 逐筆 replay 漏掉的內容。
- 收到 `submit-task` 就 `DBOS.startWorkflow(runAgentWorkflow)(...)`，回傳的函式立即以輸入呼叫。
- 除錯重點：dotenv 拼字、camelCase 欄位、`turn.text`，以及區域 `emit` 與 import 的 `emit` 變數遮蔽。
- 驗證方式：任務執行到一半殺掉 server 再重啟，瀏覽器刷新後仍接續串流，證明狀態真的持久化。

# L2 detail

- `#L1-L17` — 進 server 設定 DBOS 與 workflow；因為多了資料庫，環境變數必須比 AI SDK 自動載入更早一步。
- `#L18-L55` — 新增 `env.ts` 以 dotenv 載入 `.dev.vars`；server 改為 import DBOS、`ensureSchema`、`subscribe`/`history`、`runAgentWorkflow`、`ClientMessage`。
- `#L56-L96` — 把所有啟動流程包進 `main()`：async 化、先 `ensureSchema`（必要時自動補 migration），再設定 DBOS app 名稱與 `systemDatabaseURL` 並 launch。
- `#L97-L128` — 把 Express 與 websocket 搬進 `main()`；以 `subscribe` 將事件 `JSON.stringify` 後送給所有 `readyState === open` 的 client。
- `#L129-L158` — `on connection` 內註冊 `on message`，用 try/catch 安全解析 `ClientMessage`，解析失敗就直接 return。
- `#L159-L186` — 當 `message.type === "submit-task"` 時呼叫 `DBOS.startWorkflow(runAgentWorkflow)`，立刻以使用者輸入執行回傳的函式。
- `#L187-L211` — 連線後用 `for ... of await history()` 把歷史事件逐筆 replay 給 client；把 `server.listen` 移入 `main()`。
- `#L212-L231` — 檔尾以 `main().catch()` 統一處理錯誤、印出後 `process.exit(1)`；修正 `DATABASE_URL` 大小寫。
- `#L232-L256` — 修正解析變數命名（`raw`）等小錯；作者略過另寫 inspector script。
- `#L257-L306` — 實際跑起來後的除錯：dotenv 拼錯、`toolCallId`/`toolName` 未用 camelCase、`turn.text` 寫錯，以及 local `emit` 遮蔽 import 的 `emit`。
- `#L307-L330` — 提示可直接 checkout lesson three 取得可運作版本，並開始示範實際結果。
- `#L331-L369` — 示範：送出任務、tool call 執行中把 server 殺掉再重啟，刷新瀏覽器後串流自行接續；LLM 看到最後一則是 tool/assistant 訊息就繼續生成。
