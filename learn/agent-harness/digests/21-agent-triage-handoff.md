---
source: sources/agent-harness/20260915/21-agent-triage-handoff.txt
source_type: text
source_lines: 277
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Handoff 是 harness 層級的確定性機制：偵測到 `handoff` 這個 virtual tool call 就切換 agent，不靠 LLM 自己編排。
- Triage agent 是系統的 point of entry，承接所有請求；能處理就處理，否則轉給更適合的 agent。
- 多 agent 架構下，`buildContext` 要傳入當前 agent 的 system prompt，`modelTurn` 要傳入當前 agent 的 tools。
- Handoff 的 payload 需要 `to`、`reason`、`from`，並以 DBOS step 保存，再 emit `agent_handoff` 事件給 UI 與訂閱者。
- 切換 agent 後必須立刻補上對應 tool call ID 的 tool result message，否則下一次 API 呼叫會中斷。
- 把訊息按 turn 分組，是為了 compaction 與避免訊息歷史進入無法修復的錯位狀態。
- UI 可透過 `to` 欄位變化切換 active agent 的視覺，或在 system prompt 要求接手 agent 先自我介紹。

# L2 detail

- `#L1-L20` — 介紹 handoff 與 triage agent：作為 point of entry，先接單，再決定自己處理或轉交。
- `#L21-L40` — 多 agent 化的第一波改動：`buildContext` 傳入當前 agent 的 system prompt，`modelTurn` 傳入當前 agent 的 tools。
- `#L41-L83` — 在執行 tool 前先攔截 handoff call，使用 virtual tool response，並取出 `to` 與 `reason`。
- `#L84-L110` — 以當前 agent 作為 `from`，用 DBOS step 保存 handoff，並 emit 含 workflow ID 的 `agent_handoff` 事件。
- `#L111-L145` — 將 current agent 切換為 `agents[to]`，找不到就留在原 agent；說明 tool call 後必須緊接對應 result。
- `#L146-L187` — 用 helper 立即 push tool result（同一個 tool call ID），並解釋為何要把訊息切成 turns 以支援 compaction 與避免壞掉的歷史。
- `#L188-L238` — 跑 refund、billing、handoff 範例；重複扣款情境首次未 handoff，原因是 tool 名稱打錯與 agents 被註解掉。
- `#L239-L277` — 成功由 triage handoff 到 billing，事件顯示原因、memory 被 compaction；建議在 UI 標示 active agent 或在 system prompt 要求接手者自我介紹。
