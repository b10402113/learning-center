---
source: sources/agent-harness2/20261029/1-what-is-an-agent-harness.txt
source_type: text
source_lines: 216
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- Harness 的定義：agent = LLM + harness；沒有 harness 只剩單次 transactional inference call。
- Harness 就是讓 agent 能對話、記憶、耐用、自我修復、採用不同架構的基礎設施。
- 具體包含 memory（short-term／long-term／scratch pad／facts）、tools 與 MCP server 管理、long-running task 的續跑與通知。
- Claude Code 的 harness 是 TUI、skills、檔案提及 UX、auto-compact、自動 spawn sub-agents 等；OpenCode、OpenClaw、Hermes、Pi 都是 harness 實作。
- 模型不是差異來源，最好的 harness 會贏；harness engineering 與 evals 是 AI 工作約九成的重點。
- Harness 取決於想交付的體驗：自駕交易 agent 需要 self-heal、guardrails、approvals、PII 安全與 eval 迴圈；memory、tool calling 是基本盤。

# L2 detail

- `#L1-L25` — 定義 harness：agent 是 LLM 加 harness；若只有 LLM，就只是單次、transactional 的 inference。
- `#L26-L40` — 把 harness 拆成基礎設施：memory 的種類、tools 如何引入（標準 tool call 或 MCP）、server 如何管理。
- `#L41-L63` — 以 deep research 跑十分鐘、使用者關掉 app 為例說明 long-running task；結論是沒有 harness 不可能上 production。
- `#L64-L80` — 其他對 harness 的說法都只是這個高層定義的衍生；沒有 harness 就沒有 agent，只有 LLM call。
- `#L81-L108` — 以 Claude Code 舉例：剝掉模型選擇後，TUI、skills、檔案提及、auto-compact、自發 sub-agents 全是 harness；並點名其他 harness 實作。
- `#L109-L141` — 主張模型不再決定勝負，較差模型配較好 harness 也能勝出；harness engineering 與 evals 是最值得投入的兩個方向。
- `#L142-L196` — 回答「harness 最該專注什麼」：取決於體驗；自駕交易 agent 需要處理 failure states、self-heal、金錢相關 guardrails／approvals、PII 安全與自我評估迴圈。
- `#L197-L216` — 整理基本要求：memory、tool calling 必備，durable execution 則視情境；結尾引用「模型只能做 harness 允許它做的事」。
