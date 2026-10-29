---
source: sources/agent-harness2/20261029/21-agent-triage-handoff.txt
source_type: text
source_lines: 277
supplements:
  - harness-engineering.1.part.md#L1-L231
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- runtime 需要保存 current agent，預設為 triage 這個 point-of-entry agent。
- 每一次 build context 與 model turn 都要帶入 current agent 的 system prompt 與 tools。
- 執行工具前先偵測 tool name 是否為 handoff；是的話不進一般工具流程，改由 runtime 處理。
- handoff 會把 from、to、reason 包進 DBOS step 並 emit 事件，之後才切換 current agent。
- 切換後必須立刻補一則對應 tool call ID 的 tool result 訊息，否則 LLM API 會直接壞掉。
- 訊息陣列中 tool call 與 tool result 必須緊鄰，這也是先前按 turn 切分 compaction 的原因。

# L2 detail

- `#L1-L20` — 新增 current agent 狀態，預設 triage；triage 是入口 agent，能處理就處理，不能就轉交。
- `#L21-L40` — 修正 buildContext 呼叫，傳入 current agent 的 system prompt；model turn 傳入 current agent 的 tools。
- `#L41-L72` — 在執行任何 tool step 前先檢查 tool name 是否為 handoff，因為 handoff 沒有註冊 execute。
- `#L73-L110` — 取出 input.to 與 input.reason，from 用 current agent name；用 DBOS step 把 handoff 事件寫入 workflow 並 emit 給 UI。
- `#L111-L130` — 真正切換 current agent 為 `agents[to]`；若不存在則維持原 agent。
- `#L131-L183` — tool call 後必須緊接同 ID 的 tool result，否則 API 中斷；說明為何用 helper，以及 turn 邊界對 compaction 的意義。
- `#L184-L240` — 非 handoff 走原本流程；啟動 dev server 測試，第一次失敗是因為 agents 裡的工具被註解掉。
- `#L241-L277` — 重跑成功：事件顯示 triage 移交 billing 與原因，billing 接手回覆；可用 to 欄位在 UI 切換 active agent 樣式。
