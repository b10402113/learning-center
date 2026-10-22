---
source: sources/agent-harness/20260915/1-what-is-an-agent-harness.txt
source_type: text
source_lines: 216
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview

Scott Moss 用一整段訪談定義 agent harness，重點如下：

- Agent = LLM + harness；沒有 harness 只是 transactional inference calls。
- Harness 是基礎設施：memory、tools（含 MCP）、long-running tasks、durability、recovery。
- 以 Claude Code 為例，harness 是 terminal UI、skills、檔案提及、自動壓縮、sub-agent。
- 好的 harness 可以讓較弱的模型贏過較強模型；模型只做 harness 允許的事。
- Harness engineering 與 evals 是他認為現在 AI 最值得投入的兩件事。
- 沒有固定清單，取決於產品體驗；基本盤是 memory、tool calling、durable execution。
- 交易型 agent 的 harness 會多出 guardrail、approval、PII 防護。

# L2 detail

- `#L1-L11` — 定義：harness 讓 agent 成為 agent，agent 是 LLM 加 harness。
- `#L12-L25` — 沒有 harness 就只有一次性 inference；對話、記憶、durable、self-healing 都屬於 harness。
- `#L26-L58` — harness 是基礎設施：memory、tools/MCP、長跑任務、關掉 app 後續跑。
- `#L59-L80` — 沒有 harness 上不了 production，只會有 LLM call。
- `#L81-L108` — 以 Claude Code 舉例：terminal UI、skills、mention files、auto compact、spawn sub-agents。
- `#L109-L127` — 模型不是差異來源；harness 好壞決定成果。
- `#L128-L145` — harness engineering 與 evals 是現在最值得做的兩件事。
- `#L146-L196` — harness 取決於體驗：交易 agent 需要 guardrail、approval、PII、自我評估。
- `#L197-L208` — 基本盤：memory、tool calling、durable execution（非每個 agent 都需要）。
- `#L209-L216` — 總結：模型只能做 harness 允許它做的事。
