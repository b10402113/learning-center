---
id: harness-runtime
title: "Harness runtime：把 loop 攤開"
subject: agent-harness2
tier: 1
order: 3
status: written
goal: "用 `streamText` + `maxSteps` 寫出回合迴圈、把串流 chunk 變成事件，並指出 demo 的重複送信與未經核准呼叫。"
digests:
  - 4-classify-reply-tools.md
  - 5-harness-runtime.md
  - 6-stream-messages-to-the-ui.md
  - harness-engineering.1.part.md
  - harness-engineering.2.part.md
  - harness-engineering.3.part.md
prerequisites: []
steps:
  - id: stream-text-and-max-steps
    title: "streamText 與 maxSteps：一輪就是一個 step"
    purpose: "能寫出 streamText + maxSteps 的回合迴圈，並解釋 messages 為什麼每輪都要重新送上。"
    sources:
      - "[[sources/agent-harness2/20261029/5-harness-runtime.txt#L10-L53]]"
      - "[[sources/agent-harness2/20261029/5-harness-runtime.txt#L54-L149]]"
      - "[[sources/agent-harness2/20261029/6-stream-messages-to-the-ui.txt#L1-L81]]"
      - "[[sources/agent-harness2/20261029/6-stream-messages-to-the-ui.txt#L224-L256]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L28-L51]]"
  - id: chunks-become-events
    title: "把串流的 chunk 變成事件"
    purpose: "能把 text delta、tool request、tool result、error 各自 emit 成事件，並用同一個 toolCallId 對回結果。"
    sources:
      - "[[sources/agent-harness2/20261029/5-harness-runtime.txt#L150-L185]]"
      - "[[sources/agent-harness2/20261029/5-harness-runtime.txt#L186-L265]]"
      - "[[sources/agent-harness2/20261029/5-harness-runtime.txt#L266-L344]]"
      - "[[sources/agent-harness2/20261029/5-harness-runtime.txt#L345-L431]]"
      - "[[sources/agent-harness2/20261029/5-harness-runtime.txt#L432-L458]]"
      - "[[sources/agent-harness2/20261029/6-stream-messages-to-the-ui.txt#L312-L330]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L53-L70]]"
  - id: duplicate-send-without-approval
    title: "Demo 裡重複送出的信與沒人批准的呼叫"
    purpose: "能從 demo 指出重複送信與未經核准的 send reply，並說明 prompt 寫「先問」為何擋不住。"
    sources:
      - "[[sources/agent-harness2/20261029/6-stream-messages-to-the-ui.txt#L109-L178]]"
      - "[[sources/agent-harness2/20261029/6-stream-messages-to-the-ui.txt#L257-L311]]"
      - "[[sources/agent-harness2/20261029/4-classify-reply-tools.txt#L181-L219]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L74-L77]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L115-L118]]"
created: 2026-10-29
updated: 2026-10-29
---

# Harness runtime：把 loop 攤開

## Lesson

把 while-loop 拆成看得見的回合：`streamText`、`maxSteps`、串流 chunk 與事件。跑一次 demo，讓重複送信與未經核准的呼叫自己現形，這些就是後面幾個節點要修的故障。

## Steps

1. [streamText 與 maxSteps：一輪就是一個 step](harness-runtime/stream-text-and-max-steps.md)
2. [把串流的 chunk 變成事件](harness-runtime/chunks-become-events.md)
3. [Demo 裡重複送出的信與沒人批准的呼叫](harness-runtime/duplicate-send-without-approval.md)
