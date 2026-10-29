---
source: sources/agent-harness2/20261029/20-billing-agent-handoff-tool.txt
source_type: text
source_lines: 308
supplements:
  - harness-engineering.1.part.md#L1-L129
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- billing agent 與 triage agent 結構相同，只換 name、system prompt 與 tools；draft／send reply 是否獨立成 agent 取決於 prompt 調校成本。
- 新增兩個工具：`issueRefund`（customer ID、charge ID、amount cents，不可逆）與 `handoff`（to、reason）。
- Handoff 刻意不在 tool 層執行，因為工具結果會回到同一個 agent 的 context；必須由 runtime 層切換 active agent。
- 同理，approval 等機制要寫死在 harness 而非交給 LLM 判斷，才能 deterministic。
- `buildContext` 改為接受 system prompt 參數，讓每個 agent 使用自己的 prompt；handoff 事件已存在於 shared events。
- `modelTurn` 改為接受 tool set；新增 `toolResultsMessage` helper，用來組出符合 LLM 格式的 tool result 訊息。

# L2 detail

- `#L1-L42` — 複製出 billing agent：name、system prompt、tools（run code、draft／send reply）；討論把回覆能力獨立成 agent 的取捨，最後匯出兩個 agent。
- `#L43-L80` — 在 tools 物件新增 `issueRefund`：description、z.object input schema（customer ID、charge ID、amount cents），刻意沒有 execute。
- `#L80-L105` — 新增 `handoff` tool 的 input schema：要移交給誰（to）與原因（reason）；只有一個目標 agent 時 to 就是 billing。
- `#L106-L160` — 為何 handoff 不在 tool switch 裡處理：會留在原 agent 的 context；必須在 runtime 換掉整個 agent。並以 approval 為例說明 harness 要 deterministic。
- `#L161-L191` — 修改 memory 的 `buildContext`，第一個參數改收 system prompt；確認 shared events 已有 handoff agent event 供 UI 訂閱。
- `#L192-L235` — 修改 runtime：匯入 tool set 與兩個 agent，移除舊 tools；`modelTurn` 新增 agent tools 參數並傳給 `streamText`。
- `#L236-L287` — 新增 `toolResultsMessage` helper：把 tool call 與任意 value 組成 tool result 訊息（role、type、toolCallId、toolName、output）。
- `#L288-L308` — helper 的用途：手動模擬 handoff 的回傳值；說明不用 SDK 時 tool response 的原始格式長什麼樣。
