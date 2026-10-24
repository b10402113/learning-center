---
source: sources/agent-harness/20260915/22-supervision-with-subagents.txt
source_type: text
source_lines: 259
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Sub-agent 適合有清楚界線的工作：Git worktree 上的平行 coding、可合併結果的平行 research，以及單一 context window 裝不下的任務。
- 完全不受監督、彼此私下溝通的大量 sub-agent 被明確警告會迅速累積 hallucination。
- 這裡採用 plan mode：plan 是 first-class artifact，先被建立與儲存，再由 supervisor 監督一群 sub-agent 執行。
- 由使用者明確開啟 supervised 模式，避免 harness 需要自行判斷何時該拆 sub-agent（那需要 evals）。
- Investigator 是唯讀、輕量的 sub-agent，擁有 `execute` 函式並 inline 執行，不各自成為 DBOS step。
- 每個 investigator 只拿到完成自身職責所需的工具與一段強化角色的 system prompt。
- `runInvestigation` 是一次性 `generateText`：只帶 system 與 objective，沒有多輪對話，最多跑五個 turn。

# L2 detail

- `#L1-L46` — 說明 sub-agent 的合理場景（worktree coding、平行 research、context 分工），以及無監督 agent 群體的風險。
- `#L47-L73` — 定義 plan mode：plan 被建立、儲存、執行，supervisor 管理；必須由使用者 opt-in，而非讓 LLM 自行決定。
- `#L74-L93` — 重整 tools：匯出 charges 與 search KB，準備建立唯讀的 investigators 模組。
- `#L94-L122` — Investigator 的定位：輕量、唯讀、inline、有 execute 函式，不是第一級 DBOS step；加入環境變數以測試失敗與降級。
- `#L123-L155` — 匯入 `generateText`、step count、`tool`、Zod、model，並定義 `getCharges` 與 `searchKB` 兩個 tool。
- `#L156-L195` — 建立 investigator registry：billing 只有 charges、technical 只有 KB，sales 也用 KB 但 prompt 聚焦 pricing。
- `#L196-L238` — 實作 `runInvestigation(agent, objective)`：查表取得 investigator，找不到就丟錯，然後呼叫 `generateText`。
- `#L239-L259` — 以 system 欄位傳入角色提示、以 prompt 傳入 objective，單次推論最多五個 turn，回傳 findings。
