---
source: sources/agent-harness/20260915/20-billing-agent-handoff-tool.txt
source_type: text
source_lines: 308
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Billing agent 與 triage agent 結構相同，差別只在 name、system prompt 與 tools；它擁有 run code、draft reply、send reply 等能力。
- 是否把「草擬與寄送回覆」獨立成專門 agent，是 prompt tuning 與專注度的取捨，沒有絕對答案。
- `issueRefund` 工具用 input schema 約束 customerId、chargeId、amountCents，且刻意不附 execute，改由 runtime 的 switch 統一處理。
- 破壞性工具的描述要寫清楚「不可逆、會動到真實金錢」，但光靠 prompt 仍無法保證模型不犯錯。
- Agent 要能交接，就必須有 `handoff` 工具；schema 至少包含目標 agent 與交接原因。
- Handoff 不能在 tool handler 裡完成，因為那只會把結果塞回原 agent 的 context；必須拉高到 runtime 層，整個替換正在跑的 agent。
- 權限審批等決策也應由 harness 決定，而不是讓 LLM 自己選 approval tool，否則結果不穩定。
- 多 agent 上線後，buildContext 必須接受 agent 自己的 system prompt；model turn 也必須接受該 agent 的 tool set。
- 需要一個 helper 把 tool call 與任意回傳值格式化成標準 tool result message，才能回應 handoff tool 的呼叫。

# L2 detail

- `#L1-L42` — 建立 billing agent：沿用三項屬性與 run code、draft reply、send reply 工具，並討論把回覆流程拆成專屬 agent 的利弊。
- `#L43-L65` — 定義 issueRefund 的 description 與 input schema（customer ID、charge ID、amount cents），刻意省略 execute，保留給 runtime 的 switch 執行。
- `#L66-L92` — 說明 agent 若沒有 handoff 工具就無法主動交接，只會退化成需要另一個 micromanager agent 來監督；同時定義 handoff 的目標 agent 與原因欄位。
- `#L93-L158` — 在 switch 處理 issueRefund；解釋 handoff 為何必須在 runtime 層處理——agent 無法把自己從 context 中換掉，且 approval 這類判斷應由 harness 決定以保持 deterministic。
- `#L159-L190` — 讓 buildContext 接受 system prompt 參數，避免所有 agent 共用同一段 prompt，並確認 shared events 已有 handoff agent event 可供 UI 顯示。
- `#L191-L235` — 調整 runtime：以 tool set 取代單一 tools、匯入 triage 與 billing agent，讓 model turn 接受 agent tools，並把 tool set 傳給 streamText。
- `#L236-L308` — 實作 toolResultsMessage helper，把 tool call ID、tool name、role、type 與 JSON output 組成標準 tool result message，用來回覆 handoff tool 的呼叫。
