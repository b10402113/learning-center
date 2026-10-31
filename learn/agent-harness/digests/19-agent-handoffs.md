---
source: sources/agent-harness/20260915/19-agent-handoffs.txt
source_type: text
source_lines: 285
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- 單一 agent 處理所有任務本身沒有問題，重點是有沒有量測、有沒有明確的 harness 與架構，而不是工具數量一到某個門檻就必須拆分。
- 拆成多個 agent 的常見理由是權限與安全（敏感或破壞性工具不該人人可用）、團隊 ownership，以及避免工具過多造成選錯。
- Agent swarm 不是預設答案；若單一頂尖 LLM 加合格 harness 解不了，靠 swarm 通常只會燒錢。
- Handoff 是控制權的完全轉移：原 agent 不再參與、不監督、不接手，由更適合的 agent 接手。
- Subagent 則是專案經理模式：主 agent 仍是唯一窗口，另外開一批 subcontractor 做事，再彙整結果回報。
- 同一個 agent 可以依情境被當成 handoff 目標或 subagent 使用；差別在控制結構，不在 agent 本身。
- 要做 handoff，先把寫死的 workflow 迴圈重構成可重用的 agent primitive；每個 agent 有自己的 memory、conversation、workflow、tools，互不共享。
- 本課的 Agent 型別只保留 name、system prompt、tools 三個變因，其餘 runtime 行為完全共用。

# L2 detail

- `#L1-L51` — 討論「一個 agent 做全部」何時可行，列出拆分誘因（工具過多、敏感工具、權限、團隊分工），並強調不要為了架構而提前拆。
- `#L52-L91` — 對 multi-agent 與 agent swarm 的炒作降溫，指出多數商業問題不需要 swarm，成本高且未必能解決單一強模型解不了的問題。
- `#L92-L164` — 用理髮店與專案經理／subcontractor 兩個比喻，清楚區分 handoff（完全轉交、原 agent 退場）與 subagent（主 agent 持續對外、負責彙整）。
- `#L165-L199` — 把原本寫死的 agent workflow 迴圈抽象成 agent definition，理解每個 agent 都擁有自己的 loop、memory、conversation、tools，而 handoff 本質上是切換哪個 loop 在跑。
- `#L200-L244` — 建立 agents.ts，引入 tool set 與 Agent 型別；Agent 只由 name、system prompt、tools 組成，runtime、DBOS、工具處理流程全部共用。
- `#L245-L285` — 定義 triage agent，沿用既有工具並預留 handoff tool，並在 system prompt 明確禁止退款，迫使它把退款需求轉給 billing agent。
