---
id: production-and-observability
title: "Production：可觀測性、託管邊界與 evals"
subject: agent-harness
tier: 4
order: 11
status: confirmed
goal: "從 inspector 事件流讀出系統行為，並列出上 production 還缺什麼。"
prerequisites: []
steps:
  - id: inspector-is-the-event-stream
    title: "Inspector：事件流就是可觀測性"
    purpose: "能從 inspector 的原始事件流讀出 harness 在做什麼，並解釋重播為何讓它沒有第二個資料來源。"
    sources:
      - "[[sources/agent-harness/20260915/0-introduction.txt#L46-L96]]"
      - "[[sources/agent-harness/20260915/harness-engineering/web/src/App.tsx#L1-L54]]"
      - "[[sources/agent-harness/20260915/harness-engineering/web/src/components/InspectorPane.tsx#L1-L67]]"
      - "[[sources/agent-harness/20260915/harness-engineering/web/src/useHarnessSocket.ts#L1-L32]]"
      - "[[sources/agent-harness/20260915/harness-engineering/server/index.ts#L49-L92]]"
      - "[[sources/agent-harness/20260915/harness-engineering/shared/events.ts#L1-L71]]"
      - "[[sources/agent-harness/20260915/6-stream-messages-to-the-ui.txt#L312-L330]]"
  - id: hosted-sandbox-boundary
    title: "託管沙箱：把 node:vm 換成 production 邊界"
    purpose: "能分辨 node:vm 的示範邊界與 production hosted sandbox，並指出 harness 仍只留一個中介點。"
    sources:
      - "[[sources/agent-harness/20260915/26-wrapping-up.txt#L1-L12]]"
      - "[[sources/agent-harness/20260915/harness-engineering/lessons/03-secure-sandboxing/index.md#L31-L74]]"
      - "[[sources/agent-harness/20260915/harness-engineering/lessons/03-secure-sandboxing/index.md#L313-L370]]"
      - "[[sources/agent-harness/20260915/13-code-mode-security.txt#L135-L162]]"
  - id: at-least-once-to-exactly-once
    title: "At-least-once 之後：用 idempotency 補上 exactly-once"
    purpose: "能用 inspect-log 的 DUPLICATED 計數說明 at-least-once，並替副作用補上 idempotency。"
    sources:
      - "[[sources/agent-harness/20260915/harness-engineering/lessons/02-durable-execution/index.md#L584-L663]]"
      - "[[sources/agent-harness/20260915/harness-engineering/scripts/inspect-log.ts#L1-L33]]"
      - "[[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#L68-L94]]"
      - "[[sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt#L178-L203]]"
      - "[[sources/agent-harness/20260915/10-durable-agent-loop.txt#L103-L123]]"
  - id: evals-before-scale
    title: "Evals：demo 過了不代表品質"
    purpose: "能說明 demo 通過不等於品質，並替 harness 行為設計可重複執行的 eval。"
    sources:
      - "[[sources/agent-harness/20260915/26-wrapping-up.txt#L13-L58]]"
      - "[[sources/agent-harness/20260915/26-wrapping-up.txt#L249-L277]]"
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L128-L145]]"
      - "[[sources/agent-harness/20260915/3-agent-tools-setup.txt#L41-L90]]"
      - "[[sources/agent-harness/20260915/3-agent-tools-setup.txt#L91-L132]]"
      - "[[sources/agent-harness/20260915/22-supervision-with-subagents.txt#L47-L73]]"
  - id: background-agents-and-inbox
    title: "背景 agent 與 production 清單"
    purpose: "能描述背景 agent 的 inbox 形狀，並把七個平面收束成上 production 的檢查清單。"
    sources:
      - "[[sources/agent-harness/20260915/26-wrapping-up.txt#L130-L189]]"
      - "[[sources/agent-harness/20260915/26-wrapping-up.txt#L190-L248]]"
      - "[[sources/agent-harness/20260915/0-introduction.txt#L141-L175]]"
      - "[[sources/agent-harness/20260915/harness-engineering/lessons/06-hierarchical-supervision/index.md#L344-L351]]"
      - "[[sources/agent-harness/20260915/harness-engineering/lessons/07-human-in-the-loop/index.md#L206-L245]]"
created: 2026-10-24
updated: 2026-10-27
---

# Production：可觀測性、託管邊界與 evals

## Lesson

Inspector 不是外加的 dashboard，而是同一條事件流的另一種呈現；有了它，才看得見 harness 做了什麼。最後把七個平面收束成 production 清單：託管沙箱、idempotency、evals 與長時間背景執行。

## Steps

1. [Inspector：事件流就是可觀測性](production-and-observability/inspector-is-the-event-stream.md)
2. [託管沙箱：把 node:vm 換成 production 邊界](production-and-observability/hosted-sandbox-boundary.md)
3. [At-least-once 之後：用 idempotency 補上 exactly-once](production-and-observability/at-least-once-to-exactly-once.md)
4. [Evals：demo 過了不代表品質](production-and-observability/evals-before-scale.md)
5. [背景 agent 與 production 清單](production-and-observability/background-agents-and-inbox.md)
