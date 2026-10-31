---
source: sources/agent-harness2/20261029/4-classify-reply-tools.txt
source_type: text
source_lines: 279
supplements:
  - harness-engineering.1.part.md#L1-L129
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 用 Zod 建立 classify item、draft reply、send reply 三個 mock tools，作為測試 harness 的 fixture。
- Tool 的 description、input schema、execute 都刻意簡化甚至無意義，重點是讓 agent 有東西可呼叫。
- 帶出 input schema 欄位加 `describe` 能提高 agent 理解欄位語意的機率，但效果依模型而異。
- send reply 這種不可逆動作若交給 naive harness 直接執行會非常危險；靠 prompt 寫「先問使用者」不算 guardrail。
- 建立 system prompt 檔案，說明 system prompt 是開發者給 agent 的基礎指令，可能佔掉大量 context window。

# L2 detail

- `#L1-L25` — 從既有的搜尋知識庫 tool 接到新 tool；建立 classify item 的 description 與 input schema，並介紹 Zod 是執行期 schema 檢查器、與 AI SDK 相容。
- `#L26-L45` — schema 用 enum 限定分類只能是 billing、technical、sales、other；execute 收到 itemId 與 category 後只回傳 `ok: true` 並回顯輸入。
- `#L46-L99` — 分類名稱其實是隨機挑的，與知識庫無關；強調 agent 內容可以很爛、沒有任何 eval，因為它只是拿來測試 harness 的 fixture，字串內容不影響實驗。
- `#L100-L107` — 開始建立 draft reply tool，同樣有 description、input schema 與 execute，並提到 autocomplete 的插曲。
- `#L108-L152` — 回答「input schema 欄位是否該加描述」：應該，`describe` 能補足模型對 itemId 這類欄位的誤解，但仍取決於模型與實際資料形狀。
- `#L153-L180` — draft reply 的 schema 有 itemId 與 message 字串；execute 假裝建立了草稿，回傳 `ok: true` 與虛構的 draftId，message 實際上沒被使用。
- `#L181-L219` — 建立 send reply tool；警告 LLM 可能為了完成「回覆所有信件」的目標而直接送出未經審閱的草稿，且在 description 寫「先問使用者」不是有效防護，文字 guardrail 會失敗。
- `#L220-L262` — 在 harness 資料夾建立 system prompt 檔案；解釋 system prompt 是開發者給的背景與基礎指令，可含 persona、使用者脈絡，也談到各家 system prompt 外流的趣聞。
- `#L263-L279` — system prompt 可能長達數千 token、吃掉可觀的 context window；本課程的版本只描述 triage agent 要逐項處理、簡短摘要每個 work item。
