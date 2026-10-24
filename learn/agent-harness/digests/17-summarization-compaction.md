---
source: sources/agent-harness/20260915/17-summarization-compaction.txt
source_type: text
source_lines: 321
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 把 memory 模組接進 runtime：匯入 buildContext、summarize、estimateTokens 與兩個 token 門檻，並提高 max steps 讓 agent 有空間跑完長任務。
- 在 workflow 內維護兩個跨迴圈狀態：`turns`（目前保留的完整 turns）與 `summary`（截至目前為止的滾動摘要）。
- 壓縮必須發生在呼叫 LLM 之前；若等到 model turn 才檢查，可能直接撞上 context 上限而失敗。
- 超過 maxContextTokens 時，用 sliding window 從最舊的 turn 開始 shift，直到降到 keepContextTokens 以下。
- 壓縮單位是「turn」而非「message」，因為以 message 為單位可能留下懸空的 tool call，讓 messages 陣列進入壞掉的狀態。
- 被移出的舊 turns 交給 summarize，並用 DBOS.runStep 包成可重播的 workflow step。
- 每次壓縮後重建 context、重新估算 token，並發出 `memory.compacted` 事件讓使用者知道內容已被摘要。
- 真正的 model turn 要收到 buildContext 產出的 context，而不是未經整理的原始 messages，否則 summary 不會生效。

# L2 detail

- `#L1-L30` — 從 memory 匯入所需函式與門檻、調高 max steps，並在 workflow 中初始化 `turns` 空陣列與 `summary` 空字串。
- `#L31-L57` — 確立「先檢查再呼叫」的順序，以 estimateTokens 對攤平後的 turns 估算用量，超過 maxContextTokens 才進入壓縮流程。
- `#L58-L97` — 實作 sliding window：只要 turns 還多於一個且 token 仍超標，就 shift 最舊的 turn 到 old 陣列，保留最近 keepContextTokens 的內容。
- `#L98-L116` — 將 old turns 與既有 summary 交給 summarize，並以 DBOS.runStep 命名包裝，確保壓縮動作在 workflow 中可被追蹤與重播。
- `#L117-L153` — 以 user input、最新 summary、剩餘 turns 重建 context、重新計算 token，並發出 `memory.compacted` 事件攜帶摘要 turn 數、目前 token 數與 summary 內容。
- `#L154-L197` — 完成 hydration：用 buildContext 產生含 summary 的 context，並把它傳給 model turn，取代原本只看得到原始 messages 的寫法。
- `#L198-L232` — 調整 turn 結果的收集方式：從 response 取出 turnMessages、推入本輪訊息，最後把整個 turn 推回 turns，確保每輪都是完整單位。
- `#L233-L277` — 解釋 turn 的結構（text、tool calls、response messages），說明為何按 turn 壓縮能避免半個 tool call cycle 造成的 broken state，也省去大量 role 判斷。
- `#L278-L321` — 更新 system prompt，要求 agent 一次處理一個 item、完成四個步驟後再換下一個並簡短總結，藉此放大 token 用量以觸發 compaction 示範。
