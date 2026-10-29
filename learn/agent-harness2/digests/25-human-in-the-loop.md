---
source: sources/agent-harness2/20261029/25-human-in-the-loop.txt
source_type: text
source_lines: 94
supplements:
  - harness-engineering.1.part.md#L1-L231
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- Human-in-the-loop 的核心是把 approval 做成 harness 的 deterministic 機制，而不是請 LLM 自己決定要不要停。
- 做法是維護「哪些 tool call 需要核准」的對照表，或在 tool 設定上標記 needs approval，於 harness 偵測。
- DBOS 可讓 workflow 無限期暫停：`DBOS.recv` 停住 compute，直到收到事件才繼續。
- 恢復方式是 `DBOS.send` 帶 payload 給指定 workflow ID，例如 approved 與對應 tag。
- 練習未能在課堂完成，但建議自行實作；進階版是先讓使用者審核 plan，再執行。

# L2 detail

- `#L1-L20` — 說明 human-in-the-loop 練習的定位：核准必須 deterministic，像 handoff 一樣屬於 harness，不是求 LLM 配合。
- `#L21-L45` — 在 harness 維護 tool call 需核准的 map，或讀 tool 設定中的 needs approval 旗標來判斷是否暫停。
- `#L45-L64` — 用 `DBOS.recv` 暫停執行，compute 完全停止，可停數年，直到變數被事件改變才繼續。
- `#L65-L94` — 以 `DBOS.send` 送 approved payload 恢復 workflow；建議延伸為先審核 plan、允許來回調整，按下核准才執行。
