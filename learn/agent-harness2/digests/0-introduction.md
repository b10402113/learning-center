---
source: sources/agent-harness2/20261029/0-introduction.txt
source_type: text
source_lines: 407
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 課程主軸從「怎麼做 agent」轉向「怎麼做讓任何 agent 都能存活的環境」，也就是 harness。
- 示範的 agent 刻意無聊、工具 mock，重點在 harness 提供的可靠性，而不是 agent 本身。
- Harness inspector 左側是聊天窗，右側是 event stream，可回看每次 tool call、handoff 與決策理由。
- 會實作的 harness 能力：sandbox 執行程式、handoff、sub-agents、approvals、planning、durability。
- 企業情境的判斷準則：需要電腦與 repo 的 coding 工作直接用 Claude Code；要產品化就自己寫 programmatic agent。
- Claude Code 的 harness 已固定，skill／MCP／prompt 都只是額外 context，無法控制 harness、也難以寫 eval。

# L2 detail

- `#L1-L20` — 開場說明課程動機：agent 課程已談很多 agent 本身，這次要談讓任何 agent 都能茁壯的環境，即 agent-agnostic 的 harness。
- `#L21-L45` — 預告課程會碰 backend、資料庫、distributed computing，並強調會做得有趣。
- `#L46-L76` — 介紹 harness inspector：左邊是一般聊天介面，右邊是 event stream inspector；agent 本身只是有 mock tools 的無聊 agent。
- `#L77-L117` — 貼上一批客服任務示範：agent 先跑工具做分類，並把任務 handoff 給更適合的另一個 agent。
- `#L118-L151` — 說明 Run Code 工具：agent 自己寫程式、在 sandbox 執行，避免用內建工具反覆燒 token；並點出 durability 可在重啟後接續。
- `#L152-L175` — 在 event stream 回看 handoff 的對象與理由，用來檢查 agent 是否做對；UI 已寫好，課程不碰 React。
- `#L176-L198` — 示範 supervise 模式：先由一群有不同 persona 的 sub-agents 產生計畫，再決定下一步。
- `#L199-L245` — 回答企業導入問題：若工作涉及寫程式、Bash、檔案系統與 repo，直接用 Claude Code／Codex 類 coding agent 更划算。
- `#L246-L293` — 區分 coding agent 與 programmatic agent：Claude Code 的 harness 不可改，只能餵 prompt／skill／MCP；太通用、難以 eval、無法保證 deterministic 流程。
- `#L294-L333` — 說明 repo 取得方式與分支慣例：每課一個 branch，下一課 branch 就是本課解答，main／complete 是最終版。
- `#L334-L363` — 環境需求：Node 20 以上（作者用 24.3）、OpenAI 相容的 LLM provider、免設定的遠端資料庫。
- `#L364-L381` — 操作步驟：clone、npm install、checkout lesson one，再跑 npm run docs 開課堂講義。
- `#L382-L407` — 講義以 markdown 放在 repo 的 lessons 資料夾，內含每步 diff，方便直接丟給 AI 讀；並整理三種追上進度的方法。
