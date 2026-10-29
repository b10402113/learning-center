---
source: sources/agent-harness2/20261029/9-durable-tools.txt
source_type: text
source_lines: 546
supplements:
  - harness-engineering.1.part.md#L1-L129
  - harness-engineering.1.part.md#L1-L231
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- DBOS 的本質：把要持久化的工作包進 `step`，該任務的 input/output 就會被寫進資料庫。
- 決定要 durable 的兩件事：每個 tool call 與每次 emit；step 串起來就構成一個 workflow。
- 關鍵動作是移除 tool 上的 `execute`，讓 AI SDK 不再自動執行工具，改由 harness 在 step 內自己呼叫。
- 建立單一 `runTool` 的 switch，把原本各 tool 的執行邏輯集中，之後才能整體包成 step。
- 從 while loop 抽出 `modelTurn` 與 `toolStep`，並新增 `ToolCall`、`Turn` 兩個型別來記錄回合。
- workflow 由 DBOS 註冊；`DBOS.workflowID` 提供關聯 ID，第一個 emit 以 `DBOS.runStep` 包住。

# L2 detail

- `#L1-L49` — DBOS 把要持久化的東西包成 step，input/output 入庫；盤點後決定 tool call 與 emit 這兩類需要 durable，組合起來即是 workflow。
- `#L50-L84` — 目標是把 tools 檔改成單一 `runTool` switch 並包成 step；必須先刪掉各 tool 的 `execute`，否則 AI SDK 會自動執行而不經過 step。
- `#L85-L98` — 若保留 `execute` 再設法傳 step/workflow ID 只是浪費 token；改為奪回控制權，由我們在 step 內執行。
- `#L99-L138` — 說明教材的 diff 檢視：出現 diff 代表修改既有檔案，沒有 diff 代表新檔案；diff 對 LLM 比整份新程式碼更好懂。
- `#L139-L175` — 新增 `export async function runTool(name, args)`，args 為物件、key 為 string，回傳 `Record<string, unknown>` 的 promise。
- `#L176-L229` — 把各 tool 原本的 execute 邏輯搬進 switch 的各 case，default 對未知工具丟錯；邏輯與行為完全不變，仍是 mock 函式。
- `#L230-L261` — 抽象化後 runtime 必須自己處理 tool 執行；刻意不在 tools 檔包 step，讓它不依賴 DBOS，改在 workflow 呼叫處包。
- `#L262-L300` — 開始改 runtime：import DBOS、`ModelMessage`、`JSONValue`，emit 改從 harness 的 bus 取得，並引入 `tools` 與 `runTool`。
- `#L301-L343` — 定義 `ToolCall`（toolCallId、toolName、inputs）與 `Turn`（text、toolCalls、responseMessages），用來追蹤目前回合。
- `#L344-L359` — 把 turn 與 tool call 從 while loop 抽成獨立函式，才能分別包成 step；每次 break 就是一個新 turn。
- `#L360-L435` — `modelTurn(workflowId, messages)`：呼叫 `streamText`、逐段 `fullStream` 發 `modelDelta`，最後 `await result.toolCalls` 並回傳 Turn。
- `#L436-L481` — `toolStep(workflowId, call)`：先發 `toolRequested`，`await runTool` 後再發 `toolCompleted` 帶回結果。
- `#L482-L497` — 把 while loop 重構進 workflow；邏輯相同，差別是加入持久化與 recovery 時的重跑能力。
- `#L498-L539` — 從 `DBOS.workflowID` 取得 workflow ID；用 `DBOS.runStep` 包住第一個 emit 並命名，之後崩潰就不會重複執行。
- `#L540-L546` — DBOS 是作者用過最簡單的 durable engine：保留原程式碼，只要把工作包進 step 即可。
