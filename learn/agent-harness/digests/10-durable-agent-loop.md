---
source: sources/agent-harness/20260915/10-durable-agent-loop.txt
source_type: text
source_lines: 265
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Workflow 內不碰副作用、結果固定的程式碼可以留在 step 之外，判斷標準是有沒有 nondeterminism。
- `streamText` 必須移進 step，否則工作流重啟就會重跑 LLM，白付一次推論成本。
- 用 `DBOS.runStep` 包住 `modelTurn`；await step 不等於 await 結果，串流照樣持續進行。
- 取得 turn 之後，messages 直接用 `turn.responseMessages`，取代原本手動 await 串流再 spread 的寫法。
- 沒有 tool call 的收尾路徑也要包 step：`model completed` 與 `workflow completed` 兩個 emit 都不可重複執行。
- 有 tool call 時，改由 harness 自己跑：對每個 call 執行 `toolStep`，並以 tool call ID 命名 step 便於追蹤。
- 工具結果要用 role 為 `tool` 的訊息回填 messages，內含 `tool-result` part（toolCallID、toolName、JSON output），模型才看得到答案。
- `workflow failed` 的 emit 同樣包進 step，避免重試時重複通知。
- 最後改名為 `agentWorkflow` 並以 `registerWorkflow` 註冊——step 唯有掛在已註冊的 workflow 上才有意義，而邏輯本身完全不變。

# L2 detail

- `#L1-L9` — 說明為何部分程式碼可以留在 step 外：只要不依賴任何 nondeterministic 的東西，每次執行結果一致就安全。
- `#L10-L36` — 把 while loop 裡的 `streamText` 換成 `DBOS.runStep(modelTurn)`，理由是不想在工作流重啟時重跑已完成的 LLM 推論。
- `#L37-L62` — 釐清 await step 與 await 結果的差別：等待 step 完成並不會中斷函式內部的串流，delta 仍持續 emit。
- `#L63-L102` — 用 `turn.responseMessages` 取代原本的 await 與 spread，把舊程式碼註解掉，並定位「沒有 tool call 就收尾」的分支。
- `#L103-L123` — 把 model completed 與 workflow completed 兩個 emit 各自包進 `runStep`，因為 emit 會寫資料庫、不具 idempotency。
- `#L124-L160` — 進入有 tool call 的分支：逐一 `runStep` 執行 `toolStep`，step 名稱採用 tool call ID 以便辨識。
- `#L161-L192` — 把工具輸出以 role `tool` 的訊息 push 回 messages，包含 `tool-result` 型別的 part 與 JSON output，補上 AI SDK 先前自動完成的一步。
- `#L193-L211` — 把 workflow failed 的 emit 包進 step，並讓分支回傳空字串，確保失敗通知只發生一次。
- `#L212-L265` — 將函式改名為 `agentWorkflow`、以 `registerWorkflow` 註冊，強調 step 必須依附在已註冊的 workflow 才有意義，其餘邏輯一律不變。
