---
source: sources/agent-harness2/20261029/19-agent-handoffs.txt
source_type: text
source_lines: 285
supplements:
  - harness-engineering.1.part.md#L1-L65
  - harness-engineering.1.part.md#L1-L231
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 單一 agent 處理所有任務本身沒有問題，routing 與 handoff 是為了解決權限、guard rail、團隊歸屬等架構問題，不是工具數量門檻。
- Handoff 是控制權的完全轉移：原本的 agent 不再參與、不 supervising，由另一個 agent 接手整個 loop。
- Subagent 相反：主 agent 是唯一窗口，背後開一批 subcontractor 做事並彙整結果。
- 實作上要先把寫死的 workflow loop 抽象成 agent primitive（name、system prompt、tools），才能建立多個 agent。
- 每個 agent 擁有自己的 loop、memory、conversation、tools，彼此不共享；handoff 本質上就是切換哪個 agent 的 loop 在跑。
- 新概念 tool set（工具集合）與 handoff tool：agent 透過呼叫工具來要求移交。

# L2 detail

- `#L1-L51` — 開場：一個 agent 包辦所有任務其實可行，問題在工具太多、工具敏感或具破壞性時不該人人可用。
- `#L52-L91` — 採用 multi-agent 的真實理由（安全、權限切分、團隊 ownership），以及對 agent swarms 的強烈懷疑：多數問題用一個好 LLM 加好 harness 就夠。
- `#L92-L132` — handoff 的定義：像走進理髮店被轉給更適合的人，是控制權完全移交，原 agent 不再介入。
- `#L133-L164` — subagent 的定義：專案經理對外單一窗口，背後叫一批 subcontractor 做事並彙整；同一批 agent 兩種模式都能用。
- `#L165-L199` — 把目前的 workflow function 重構成 agent definition／runtime；每個 agent 有自己的 loop、記憶、tools，handoff 就是切換 loop。
- `#L200-L244` — 建立 `agents.ts`：匯入 tool set 與 agent type；agent 只差 name、system prompt、tools，其餘 runtime 完全相同。
- `#L245-L285` — 定義 triage agent：沿用既有工具再加 handoff tool，system prompt 明說不能退款、必須轉給 billing。
