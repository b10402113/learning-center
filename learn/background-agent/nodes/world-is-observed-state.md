---
id: world-is-observed-state
title: "世界就是被觀察的服務狀態"
subject: background-agent
tier: 1
order: 3
status: written
goal: "能說明事件 payload 不是快照，並列出 checkout 的四種故障模式與操作契約。"
digests:
  - notes-simulator.md
  - service.md
  - shared.md
  - README.md
prerequisites:
  - learn/background-agent/nodes/build-agents-that-never-sleep.md
steps:
  - id: an-alert-is-a-wake-up
    author: "google/gemini-3.8-flash"
    title: "事件只是喚醒的理由"
    purpose: "能說明事件只是喚醒訊號，並指出代理醒來後必須重讀 /state 才能取得最新證據。"
    sources:
      - "[[sources/background-agent/20261105/README.md#L4-L16]]"
      - "[[sources/background-agent/20261105/notes/simulator.md#L4-L5]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L73-L99]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L116-L121]]"
  - id: read-the-world-as-state
    author: "google/gemini-3.8-flash"
    title: "健康、壞掉的功能上線、故障的版本、依賴中斷"
    purpose: "能從 /state 的 health、release、featureEnabled、upstreamHealthy 辨認四種故障模式。"
    sources:
      - "[[sources/background-agent/20261105/notes/simulator.md#L1-L3]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L5-L12]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L36-L48]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L59-L64]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L110-L112]]"
      - "[[sources/background-agent/20261105/shared/types.ts#L12-L13]]"
      - "[[sources/background-agent/20261105/README.md#L70-L84]]"
  - id: operations-are-fenced-writes
    author: "google/gemini-3.8-flash"
    title: "過期的寫入會拿到 stale"
    purpose: "能用 expectedVersion、actionId 與 stale 回應說明 checkout 如何擋下過期與重複的寫入。"
    sources:
      - "[[sources/background-agent/20261105/notes/simulator.md#L6-L7]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L50-L57]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L123-L181]]"
      - "[[sources/background-agent/20261105/shared/types.ts#L1-L10]]"
      - "[[sources/background-agent/20261105/README.md#L15-L15]]"
  - id: restart-swaps-the-world
    author: "google/gemini-3.8-flash"
    title: "重啟就是把世界重設"
    purpose: "能說明重啟等於換一個世界，並指出 in-memory 狀態與事件 outbox 在生產環境的缺口。"
    sources:
      - "[[sources/background-agent/20261105/notes/simulator.md#L5-L5]]"
      - "[[sources/background-agent/20261105/notes/simulator.md#L8-L9]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L36-L36]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L39-L57]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L73-L99]]"
      - "[[sources/background-agent/20261105/README.md#L13-L13]]"
created: 2026-11-05
updated: 2026-11-04
---

# 世界就是被觀察的服務狀態

## Lesson

代理眼中的世界不是事件 payload，而是每次醒來重新讀取的 service state。這個節點用 checkout 服務的契約、四種故障模式與版本化操作，說明「可觀察的狀態」如何成為整個系統的事實來源。

## Steps

1. [事件只是喚醒的理由](world-is-observed-state/an-alert-is-a-wake-up.md)
2. [健康、壞掉的功能上線、故障的版本、依賴中斷](world-is-observed-state/read-the-world-as-state.md)
3. [過期的寫入會拿到 stale](world-is-observed-state/operations-are-fenced-writes.md)
4. [重啟就是把世界重設](world-is-observed-state/restart-swaps-the-world.md)
