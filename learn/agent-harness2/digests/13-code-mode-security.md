---
source: sources/agent-harness2/20261029/13-code-mode-security.txt
source_type: text
source_lines: 168
supplements:
  - harness-engineering.1.part.md#L1-L60
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- sandboxing 與 code mode 是選配能力，不是每個 agent 都必須具備；Claude Code 用單一 agent 也能運作。
- 核心風險：模型要求執行的程式碼（Bash、SQL、算術）不該直接跑在本機或 production。
- code mode 讓 LLM 寫一段程式把多個工具串起來，用一次 tool call 取代十幾輪來回。
- 程式碼是 deterministic 的，算術與資料處理比模型自行推理更準、更快。
- 本課用 Node `vm` 做離線示範，正式環境應改用真正的 sandbox 產品；接著要新增 `run code` tool。

# L2 detail

- `#L1-L39` — 開場免責聲明：課程展示的 sandboxing、handoff 等機制都是「需要時可放進工具箱」的選項，不是 agent 好壞的標準；Claude Code 只靠單一 agent 也運作良好，不需要為了 showcase 全部照抄。
- `#L40-L61` — 問題定義：當 coding agent 想跑 Bash，或分析型 agent 要跑 SQL／算術時，如何信任模型產生的程式碼；答案是不要讓它直接跑在使用者機器或伺服器上，而是先建立 sandbox 邊界。
- `#L62-L104` — code mode 的動機：示範中 12 次工具呼叫等於 12 個 turn、12 次等待與推理；若讓 LLM 寫一段程式把工具串成一個函式，就能用一次執行拿到最終結果，並提及 Claude 創造此詞、Hugging Face 的 CodeActs 也有類似說法。
- `#L105-L134` — 為何有效：agent 很擅長寫程式，尤其算術；與其提供一堆 calculator 工具讓模型逐步推理，不如讓它寫一支 Python/JS 腳本一次算完，結果 deterministic、更快也更準。
- `#L135-L162` — 邊界要求：agent 必須活在無法逃脫的 sandbox，理由和「不讓陌生人碰 production」相同；市面上有很多 sandbox 產品，但本課為了離線教學改用 Node `vm`，並坦承曾有逃脫漏洞、可能已修補。
- `#L163-L168` — 本課實作預告：建立 sandbox、新增 `run code` tool，讓模型撰寫程式並執行，再透過 API 暴露給 agent 使用。
