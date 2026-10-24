---
source: sources/agent-harness/20260915/9-durable-tools.txt
source_type: text
source_lines: 546
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 有了 DBOS 後，判斷標準很單純：runtime 裡哪些動作需要耐用，就把那段包成 step，多個 step 組成 workflow。
- 需要 durable 的兩類東西：每個 tool call，以及每一次 emit 事件（避免重複寫入、且能撐過 server crash）。
- 先移除所有 tool 上的 `execute`，因為 AI SDK 看到 execute 就會自動執行，harness 就沒有機會把它放進 DBOS step。
- 把各 tool 的執行邏輯集中到單一 `runTool(name, args)` 的 switch case，default 丟錯，工具本身仍是 mock。
- 刻意不在 tools 檔裡包 step，而是回到 workflow 呼叫端才包，讓 tools 模組不依賴 DBOS，也讓所有 step 集中在同一處。
- 新增 `ToolCall` 與 `Turn` 兩個型別：turn 記錄這次的文字串流、tool calls 與 response messages，讓事件與進度可追溯。
- `modelTurn` 抽象化一次 LLM 呼叫：邊串流邊 emit delta，結束後回傳 tool calls 與 response messages。
- `toolStep` 抽象化單次工具執行：先 emit `tool requested`、執行 `runTool`、再 emit `tool completed`。
- Runtime 改成以 `DBOS.workflowID` 識別工作流，第一個 emit 就用 `DBOS.runStep` 包住，示範「包起來就耐用」的最小做法。
- 作者認為 DBOS 是同類引擎中最簡單的：不必改寫程式，只需把既有邏輯包進 step。

# L2 detail

- `#L1-L49` — 建立判準：DBOS 的 step 會持久化輸入輸出，因此逐一盤點 runtime，決定把 tool call 與 emit 事件包成 step，再由 step 組成 workflow。
- `#L50-L98` — 移除 tool 上的 `execute` 函式，解釋 AI SDK 會自動執行而繞過 step；把控制權拿回來，才能自己決定在哪裡、以何種方式執行。
- `#L99-L139` — 說明教材中的 diff 呈現方式：diff 代表已存在的檔案、沒有 diff 就是新檔案，並解釋為何 diff 對 LLM 讀者更精確。
- `#L140-L172` — 定義 `runTool(name, args)` 的簽章與回傳型別，強調 TypeScript 只在編輯期提供提示、runtime 會被剝除。
- `#L173-L229` — 用 switch case 集中各工具的執行邏輯，未知工具丟錯；邏輯與原本相同，工具仍是無意義的 mock，重點在 harness 結構。
- `#L230-L261` — 說明包 step 的位置：留在 workflow 呼叫端而非 tools 檔，讓 tools 不綁 DBOS，也避免 step 散落各檔的反模式。
- `#L262-L343` — 改寫 runtime 的匯入（DBOS、`ModelMessage`、`JSONValue`、bus 的 emit、runTool），並定義 `ToolCall`（id/name/inputs）與 `Turn`（文字、tool calls、response messages）兩個型別。
- `#L344-L435` — 抽出 `modelTurn(workflowID, messages)`：`streamText` 後逐個 part 迭代、遇 text delta 就 emit，結束後彙整 tool calls 與 response messages 成一個 turn。
- `#L436-L497` — 抽出 `toolStep(workflowID, call)`：執行前 emit `tool requested`（含 toolCallID、名稱、參數），執行後 emit `tool completed` 帶回結果。
- `#L498-L546` — 從 `DBOS.workflowID` 取得工作流身分，把 workflow started 的 emit 包進 `DBOS.runStep` 並命名，說明這就是讓既有程式碼變耐用的全部代價。
