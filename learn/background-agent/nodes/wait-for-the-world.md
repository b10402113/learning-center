---
id: wait-for-the-world
title: "等待世界改變"
subject: background-agent
tier: 2
order: 10
status: written
goal: "能說明事件只負責喚醒、醒來必須重讀狀態，並用 waitForEvent + eventSequence 避免漏接。"
digests:
  - 16-when-to-wait-for-input.md
  - 17-add-wait-conditions-steps.md
  - lessons-03-events-and-waiting.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/make-progress-durable.md
steps:
  - id: waiting-is-a-decision
    author: "google/gemini-3.8-flash"
    title: "門鈴，不是房間"
    purpose: "能說明為何等待與否必須由代理自己判斷，並把事件當成門鈴而不是狀態快照。"
    sources:
      - "[[sources/background-agent/20261105/16-when-to-wait-for-input.vtt#L100-L200]]"
      - "[[sources/background-agent/20261105/16-when-to-wait-for-input.vtt#L200-L305]]"
      - "[[sources/background-agent/20261105/16-when-to-wait-for-input.vtt#L305-L360]]"
      - "[[sources/background-agent/20261105/16-when-to-wait-for-input.vtt#L360-L440]]"
      - "[[sources/background-agent/20261105/16-when-to-wait-for-input.vtt#L440-L472]]"
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L6-L12]]"
  - id: suspend-with-a-reason
    author: "google/gemini-3.8-flash"
    title: "三種暫停：wait、complete、request_help"
    purpose: "能分辨 complete、request_help、wait 的暫停語意，並說明 harness 如何記下等待理由。"
    sources:
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L1-L50]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L50-L100]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L100-L160]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L160-L270]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L270-L330]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L330-L400]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L400-L500]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L500-L580]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L99-L117]]"
      - "[[sources/background-agent/20261105/server/agent-log.ts#L6-L32]]"
  - id: wait-for-event-primitive
    author: "google/gemini-3.8-flash"
    title: "等到事件，或等到逾時"
    purpose: "能說明 step.waitForEvent 的 event、if、timeout 三個參數，以及等待不是掛起呼叫堆疊。"
    sources:
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L580-L660]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L660-L720]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L720-L790]]"
      - "[[sources/background-agent/20261105/17-add-wait-conditions-steps.vtt#L790-L835]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L118-L132]]"
  - id: wake-re-read-reconcile
    author: "google/gemini-3.8-flash"
    title: "醒來之後，重讀世界"
    purpose: "能實作醒來後重讀世界狀態，並用 eventSequence 與逾時重檢避免漏接喚醒。"
    sources:
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L13-L19]]"
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L35-L96]]"
      - "[[sources/background-agent/20261105/lessons/03-events-and-waiting/index.md#L118-L137]]"
      - "[[sources/background-agent/20261105/16-when-to-wait-for-input.vtt#L140-L200]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L118-L133]]"
      - "[[sources/background-agent/20261105/server/incident-data.ts#L99-L111]]"
      - "[[sources/background-agent/20261105/server/incident-data.ts#L143-L154]]"
      - "[[sources/background-agent/20261105/server/observe.ts#L11-L17]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L87-L90]]"
created: 2026-11-05
updated: 2026-11-05
---

# 等待世界改變

## Lesson

事件只是門鈴，通知世界可能變了，並不是一份可信任的快照。這個節點把 waitForEvent、eventSequence、醒來後重新觀察與完成判定串起來，讓代理可以停在原地等世界自己好轉。

## Steps

1. [門鈴，不是房間](wait-for-the-world/waiting-is-a-decision.md)
2. [三種暫停：wait、complete、request_help](wait-for-the-world/suspend-with-a-reason.md)
3. [等到事件，或等到逾時](wait-for-the-world/wait-for-event-primitive.md)
4. [醒來之後，重讀世界](wait-for-the-world/wake-re-read-reconcile.md)
