---
source: sources/agent-harness2/20261029/22-supervision-with-subagents.txt
source_type: text
source_lines: 259
supplements:
  - harness-engineering.1.part.md#L1-L60
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- Subagent 適合有清楚隔離邊界的工作：Git worktree 上的平行 coding、可合併摘要的研究任務。
- 全自動、長期互通有無的 agent 群被視為高風險，容易快速累積 hallucination；本課改採顯式 plan mode。
- Plan 是一等公民產物：先產生、儲存，再由 subagents 執行，並由 supervisor 管理；需由使用者明確開啟。
- Investigator 是唯讀、輕量的 subagent，工具直接帶 execute、inline 執行，不綁 DBOS step。
- 每個 investigator 只有單一工具與專屬 system prompt：billing 拿 charges、technical 與 sales 搜知識庫。
- `runInvestigation` 以 `generateText` 做一次性推論，最多五個 turn 後停止，並可用環境變數觸發失敗測試。

# L2 detail

- `#L1-L46` — subagent 的合理場景（coding worktree、研究彙整）與對全自動 agent 互相對話的疑慮；多數人已在 Claude Code／Cursor 用過。
- `#L47-L73` — 設計 plan mode：plan 成為儲存下來的一等產物，由 supervisor 執行，並由使用者 toggle 開啟，避免靠 evals 判斷何時該用。
- `#L74-L102` — 匯出 charges 與 search KB；新增 investigators 檔案，說明它們是唯讀、輕量、inline 執行，不享 supervisor 級待遇。
- `#L103-L132` — 唯讀所以可安全重跑；加入環境變數模擬失敗以觀察 graceful degradation；匯入 generateText、stepCount、tool 等。
- `#L133-L199` — 建立 getCharges 與 search KB 兩個工具；定義 investigator 型別與 billing／technical／sales 三個角色，各自只有一個工具與專屬 prompt。
- `#L200-L259` — `runInvestigation`：查表取得 investigator、找不到就丟錯；用 generateText 傳 system 與 prompt，最多五 turn 後回傳結果。
