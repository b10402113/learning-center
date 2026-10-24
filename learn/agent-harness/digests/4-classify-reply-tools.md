---
source: sources/agent-harness/20260915/4-classify-reply-tools.txt
source_type: text
source_lines: 279
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- `classify item` 工具用 Zod 定義 runtime schema，category 以 enum 限制在 billing、technical、sales、other。
- execute 只回傳 OK 與原輸入，假裝完成分類；agent 的任務只是當 fixture，內容的正確與否刻意不重要。
- 分類選項與知識庫沒有對應關係，是隨機挑的；重點是讓 harness 有東西可測，而不是打造有效 agent。
- 即使是 fixture，仍要讓 prompt 有高機率觸發工具，這樣才能穩定測試 harness 的各個路徑。
- `draft reply` 與 `send reply` 是兩個獨立工具；input schema 的每個欄位都值得加 describe，因為那是影響 agent 的另一個表面。
- `send reply` 揭露 naive harness 的危險：LLM 可能沒等人看過就直接送出草稿。
- 靠 description 寫「請先問使用者」不是 guardrail；把安全機制放在文字裡一定失敗，必須做在 harness 層。
- system prompt 是開發者給 agent 的基礎指令，與使用者訊息不同，可能佔掉大量 context window；本課版本只描述 triage agent 的工作流程。

# L2 detail

- `#L1-L33` — 建立 `classify item` 工具：說明 Zod 是 JavaScript 的 runtime schema 檢查器、與 AI SDK 相容，並用 enum 把分類限制在四個值。
- `#L34-L58` — 刻意空殼的 execute：接收 item ID 與 category 後只回 `OK: true` 並回顯輸入，讓 agent 以為事情完成了。
- `#L59-L99` — 解釋為何分類選項與知識庫不對應、內容為何可以隨便寫：agent 越糟越好，它只是測試 harness 的 fixture；但仍要設計成容易觸發工具以利測試。
- `#L100-L152` — 建立 `draft reply` 工具並討論 input schema 欄位描述：describe 能補足欄位語意，是否必要取決於模型與資料形狀，是影響 agent 的額外施力點。
- `#L153-L182` — 完成 `draft reply` 的 execute：回傳成功與一個捏造的 draft ID，讓 agent 知道草稿已建立，並帶出 `send reply` 工具。
- `#L183-L219` — 用寄信情境說明 `send reply` 的風險：naive harness 會直接送出未經審閱的草稿；在 description 寫「先問使用者」並不是有效護欄。
- `#L220-L279` — system prompt 的定位與成本：它是開發者給的基礎指令，可放 persona 與背景，可能耗掉可觀的 context；本課版本只交代 triage agent 要逐項摘要與處理工作項目。
