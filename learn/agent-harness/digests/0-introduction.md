---
source: sources/agent-harness/20260915/0-introduction.txt
source_type: text
source_lines: 407
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 這門課從「怎麼做 agent」推進到「怎麼做讓任何 agent 都能存活的環境」，也就是 harness，而且 harness 與 agent 本身無關。
- 課程會碰到 backend、資料庫、distributed computing，因為 harness 本質上是基礎設施。
- 示範工具是 harness inspector：左邊是一般聊天介面，右邊是逐筆事件流，用來觀察 agent 到底做了什麼。
- 範例 agent 會分類客服工單、呼叫工具、handoff 給 billing sub-agent、在沙箱裡寫並執行 code，最後彙整答案。
- Harness 提供 sandbox、handoff、sub-agents、approvals、planning、durability；伺服器重啟後可以從斷點續跑。
- supervise 模式用一組不同 persona 的 sub-agents 先產生計畫，再決定下一步。
- Claude Code 適合寫程式、資料分析與 prototyping，但 harness 不可改、只能用 prompt 影響、無法做 deterministic 流程，上 production 通常要自己寫 programmatic agent。
- 課程 repo 以 branch 分課，下一課的 branch 就是上一課的解答，main／complete 是最終版本。

# L2 detail

- `#L1-L45` — 課程定位：從 agent 內部構造轉向 agent 之外的生態環境，說明 harness 是 agent-agnostic，並預告會接觸 backend、資料庫與分散式運算。
- `#L46-L96` — 展示 harness inspector 的兩個 pane：可對話的 agent 介面與右側事件流；agent 的任務是接手一串客服相關工作並自動完成。
- `#L97-L140` — 看 agent 處理工單清單：先呼叫工具做分類，遇到不擅長的任務 handoff 給 billing agent，並用 Run Code 在沙箱寫程式算數，最後合併 context 回答。
- `#L141-L175` — 盤點 harness 要負責的能力：sandboxing、handoff、sub-agents、approvals、planning、durability，以及可用事件流稽核 agent 的每個決定與理由。
- `#L176-L198` — supervise 模式：先由一群帶不同 persona 的 sub-agents 組成 swarm 產生計畫，再據此決定下一步，類似 Claude Code 的 plan-first 流程。
- `#L199-L245` — 回答「企業內該自建 harness 還是用 Claude Code」：需要電腦、Bash、檔案系統的程式任務直接用 coding agent；其 harness 已固定，只能靠 prompt、skill、MCP 施加影響。
- `#L246-L293` — 為何 production 仍需 programmatic agent：Claude Code 太通用、只能量測自己給的 prompt、無法保證 deterministic 流程；它適合寫程式、資料分析與 prototype，不適合當產品核心。
- `#L294-L333` — 取得 repo 與 branch 慣例：每課一個 branch，該課的解答放在下一個 branch，main 或 complete 是最終完成版，整門課共七課。
- `#L334-L375` — 環境需求：Node 20 以上（講者用 24.3）、任何 OpenAI API 相容的 LLM provider，以及一個免設定的遠端資料庫。
- `#L376-L407` — 用 `npm run docs` 開本機課程筆記；lesson 以 Markdown 存放並附上 diff，方便直接餵給 AI，也提供三種跟上進度的方式。
