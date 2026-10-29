---
source: sources/agent-harness2/20261029/10-durable-agent-loop.txt
source_type: text
source_lines: 265
supplements:
  - harness-engineering.1.part.md#L1-L231
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 不在 step 內的程式碼必須 deterministic，每次重跑結果相同才能留在 workflow 主體。
- 把 `streamText` 包進 `DBOS.runStep(modelTurn)`，避免重啟時重複呼叫 LLM 而多花 token。
- 等待 step 完成不等於中斷串流，`modelTurn` 內仍持續 iterate `fullStream`。
- 無 tool call 時的兩個 emit（model done、workflow completed）都要包成 step，否則重跑會重複寫入。
- 有 tool call 時由 harness 自己用 `runStep(toolStep)` 執行，再把 role 為 `tool` 的結果訊息推回 messages。
- workflow 必須以 `DBOS.registerWorkflow` 註冊，否則其中的 step 沒有意義。

# L2 detail

- `#L1-L9` — 這段程式不依賴任何 nondeterministic 的東西，每次結果相同，因此可安全留在 step 外。
- `#L10-L36` — while loop 內不再直接呼叫 `streamText`，改用 `DBOS.runStep(modelTurn)`；否則每次重啟都會重打 LLM，浪費成本。
- `#L37-L62` — 澄清：await step 只是等待該函式完成，`modelTurn` 內部仍在串流，並沒有 await 最終結果。
- `#L63-L78` — 舊的處理邏輯先註解保留；messages 改為直接 push `turn.responseMessages`。
- `#L79-L102` — 進入「沒有 tool call」分支：emit 會寫 DB，不包 step 就不 idempotent，重跑會產生不同結果；條件是 `turn.toolCalls.length === 0`。
- `#L103-L123` — 把 model-done 與 completed 兩個 emit 各自包進 `DBOS.runStep` 並命名，最後回傳 `turn.text`。
- `#L124-L158` — 有新工具呼叫的分支：對每個 call 執行 `DBOS.runStep(toolStep)`，step 名稱用 toolCallId 方便追蹤。
- `#L159-L192` — 把工具結果推回 messages：role 為 `tool`，內容為 `tool-result`，帶 toolCallId、toolName，output 為 `{ type: "json", value }`。
- `#L193-L211` — 遞增 step 計數；最下方 workflow failed 的 emit 也包進名為 failed 的 step，失敗時回傳空字串。
- `#L212-L250` — 將函式改名為 `agentWorkflow`，並用 `DBOS.registerWorkflow` 註冊，讓 step 有歸屬的 workflow。
- `#L251-L265` — 邏輯與行為完全沒變，只是把工作拆進 step；順手清掉未用的 `runTools` 並修正 `toolCalls` 型別拼字。
