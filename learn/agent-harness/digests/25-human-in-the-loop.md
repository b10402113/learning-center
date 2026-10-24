---
source: sources/agent-harness/20260915/25-human-in-the-loop.txt
source_type: text
source_lines: 94
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Human-in-the-loop 的重點是把 approval 做成 harness 層級的確定性行為，而不是在 prompt 裡拜託 LLM 停下來。
- 觸發點與 handoff 相同：harness 偵測到某個 tool call，查詢該 tool 的設定是否需要核准。
- 核准規則可以是一份 tool 對應表，或使用 SDK 在 tool 層提供的 needs approval 機制。
- DBOS 的 `receive` 能無限期暫停 workflow 的 compute，直到收到對應的事件才繼續。
- 恢復執行靠 `DBOS.send` 送出帶有 workflow ID 與 payload（例如 approved）的事件。
- 進階練習是把審核點移到 plan：先讓人類看過、調整計畫，按下核准後才執行。

# L2 detail

- `#L1-L20` — 說明 human-in-the-loop 練習的目標：以 deterministic 方式在 harness 層攔截 tool call 並要求核准。
- `#L21-L44` — 兩種實作位置：自己維護 tool 與 approval 的對照表，或使用 SDK 的 tool-level 核准設定。
- `#L45-L64` — 用 `DBOS.receive` 暫停 step 的 compute，可能停數年，直到 workflow 收到變更事件才恢復。
- `#L65-L94` — 以 `DBOS.send` 送出 approved payload 與 tag 恢復流程；並提出「先核准 plan 再執行」的延伸練習。
