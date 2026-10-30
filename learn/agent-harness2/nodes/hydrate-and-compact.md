---
id: hydrate-and-compact
title: "聊越久它越笨：hydration 與 compaction"
subject: agent-harness2
tier: 3
order: 8
status: written
goal: "分開 history／state／context，用 token 預算做以 turn 為單位的壓縮，並在 log 看到 `MemoryCompacted`。"
digests:
  - 16-memory-context-hydration.md
  - 17-summarization-compaction.md
  - 18-clearing-durable-event-log.md
  - harness-engineering.1.part.md
  - harness-engineering.2.part.md
  - harness-engineering.3.part.md
prerequisites: []
steps:
  - id: context-grows-forever
    title: "Context 一直長大，模型就越笨"
    purpose: "能說明無限堆疊的 context 為何讓模型變笨、變慢、變貴，並分清歷史紀錄與模型實際看到的內容。"
    sources:
      - "[[sources/agent-harness2/20261029/16-memory-context-hydration.txt#L1-L107]]"
  - id: history-state-context
    title: "History、State、Context：三個不同的東西"
    purpose: "能把 history、state、context 分成三件事，並用 token 預算寫出即時組裝的 `buildContext`。"
    sources:
      - "[[sources/agent-harness2/20261029/16-memory-context-hydration.txt#L108-L299]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/memory.ts#L1-L44]]"
  - id: compact-per-turn
    title: "用 token 預算，以 turn 為單位壓縮"
    purpose: "能在每次 model turn 前檢查 token、以 turn 為單位滑動視窗壓縮，並把摘要包成 DBOS step 發出 `MemoryCompacted`。"
    sources:
      - "[[sources/agent-harness2/20261029/16-memory-context-hydration.txt#L300-L407]]"
      - "[[sources/agent-harness2/20261029/17-summarization-compaction.txt#L1-L277]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/memory.ts#L46-L74]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L97-L135]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L213-L214]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/shared/events.ts#L24-L25]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/shared/events.ts#L49-L49]]"
  - id: clear-log-and-observe
    title: "清空 event log，看 `MemoryCompacted` 真的出現"
    purpose: "能加上清空 durable log 的路由與 CORS，重跑任務並從 log 讀出壓縮次數與 context token 數。"
    sources:
      - "[[sources/agent-harness2/20261029/18-clearing-durable-event-log.txt#L1-L198]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/db.ts#L35-L39]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/server/index.ts#L27-L40]]"
created: 2026-10-29
updated: 2026-10-29
---

# 聊越久它越笨：hydration 與 compaction

## Lesson

context 不是歷史紀錄，而是每次即時組裝的一小段。這裡把 history、state、context 分開，用 token 預算在每次 model turn 前觸發 compaction，並清空 event log 來觀察 `MemoryCompacted` 真的在動。

## Steps

1. [Context 一直長大，模型就越笨](hydrate-and-compact/context-grows-forever.md)
2. [History、State、Context：三個不同的東西](hydrate-and-compact/history-state-context.md)
3. [用 token 預算，以 turn 為單位壓縮](hydrate-and-compact/compact-per-turn.md)
4. [清空 event log，看 `MemoryCompacted` 真的出現](hydrate-and-compact/clear-log-and-observe.md)
