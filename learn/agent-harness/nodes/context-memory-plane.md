---
id: context-memory-plane
title: "Memory：History、State、Context 三層"
subject: agent-harness
tier: 3
order: 7
status: confirmed
goal: "分辨 history/state/context，並實作以 token 預算觸發的 compaction。"
prerequisites: []
steps:
  - id: history-state-context
    title: "History、State、Context：模型每一輪到底看到什麼"
    purpose: "能分辨 history／state／context，並說出為什麼 UI 上的完整對話不等於模型收到的內容。"
    sources:
      - "[[sources/agent-harness/20260915/16-memory-context-hydration.txt#L1-L49]]"
      - "[[sources/agent-harness/20260915/16-memory-context-hydration.txt#L50-L83]]"
      - "[[sources/agent-harness/20260915/16-memory-context-hydration.txt#L84-L107]]"
  - id: hydrate-context-each-turn
    title: "每次呼叫前重新 hydrate：buildContext 與 token 估算"
    purpose: "能用 system prompt、本次 task、summary 與近期 turns 組出本回合 context，並粗估 token。"
    sources:
      - "[[sources/agent-harness/20260915/16-memory-context-hydration.txt#L108-L149]]"
      - "[[sources/agent-harness/20260915/16-memory-context-hydration.txt#L150-L220]]"
      - "[[sources/agent-harness/20260915/16-memory-context-hydration.txt#L221-L299]]"
      - "[[sources/agent-harness/20260915/17-summarization-compaction.txt#L154-L197]]"
  - id: compact-on-token-budget
    title: "超過預算就壓縮：sliding window 與 rolling summary"
    purpose: "能在呼叫 LLM 前按 turn 滑動視窗，把最舊的 turns 摺進可累積的 summary。"
    sources:
      - "[[sources/agent-harness/20260915/17-summarization-compaction.txt#L1-L57]]"
      - "[[sources/agent-harness/20260915/17-summarization-compaction.txt#L58-L97]]"
      - "[[sources/agent-harness/20260915/17-summarization-compaction.txt#L98-L153]]"
      - "[[sources/agent-harness/20260915/17-summarization-compaction.txt#L233-L277]]"
      - "[[sources/agent-harness/20260915/16-memory-context-hydration.txt#L300-L407]]"
  - id: watch-compaction-happen
    title: "把門檻調到荒謬低，看壓縮真的發生"
    purpose: "能用超低 token 門檻跑一次任務，從 `memory.compacted` 事件驗證壓縮時機與結果。"
    sources:
      - "[[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#L1-L78]]"
      - "[[sources/agent-harness/20260915/18-clearing-durable-event-log.txt#L79-L198]]"
      - "[[sources/agent-harness/20260915/17-summarization-compaction.txt#L278-L321]]"
created: 2026-10-24
updated: 2026-10-27
---

# Memory：History、State、Context 三層

## Lesson

History 是發生過的一切，State 是壓縮後的摘要，Context 是本回合真正送進模型的內容。每次呼叫前重新 hydrate，並在超過 token 預算時把最舊的 turns 摺進 summary，長 session 才不會越跑越笨。

## Steps

1. [History、State、Context：模型每一輪到底看到什麼](context-memory-plane/history-state-context.md)
2. [每次呼叫前重新 hydrate：buildContext 與 token 估算](context-memory-plane/hydrate-context-each-turn.md)
3. [超過預算就壓縮：sliding window 與 rolling summary](context-memory-plane/compact-on-token-budget.md)
4. [把門檻調到荒謬低，看壓縮真的發生](context-memory-plane/watch-compaction-happen.md)
