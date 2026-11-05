---
id: make-retries-safe
title: "讓重試安全"
subject: background-agent
tier: 2
order: 13
status: confirmed
goal: "能用 derived action ID 與 expectedVersion，讓「效果已落地但回應遺失」的重試不重複執行。"
digests:
  - 23-safe-retries-with-derived-ids.md
  - lessons-05-safe-retries.md
  - server.md
  - service.md
prerequisites:
  - learn/background-agent/nodes/split-the-loop-into-steps.md
steps:
  - id: why-retries-duplicate
    purpose: "能解釋「效果已落地、回應遺失」為何讓天真重試重複副作用，並把每個副作用拆成獨立 step。"
    sources:
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L1-L65]]"
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L66-L131]]"
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L132-L231]]"
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L232-L297]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L5-L13]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L21-L30]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L171-L179]]"
  - id: idempotency-at-the-effect-owner
    purpose: "能說明服務端如何用 actionId 帳本重播已記錄結果，並拒絕同 ID 搭配不同參數的重用。"
    sources:
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L298-L325]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L11-L13]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L74-L80]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L123-L143]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L145-L180]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L156-L173]]"
      - "[[sources/background-agent/20261105/server/schema.ts#L63-L72]]"
  - id: derive-a-stable-action-id
    purpose: "能用 runId + cycle + action 推導穩定 action ID，讓重播重建同一個意圖鍵。"
    sources:
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L471-L520]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L56-L70]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L90-L92]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L141-L157]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L187-L207]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L73-L78]]"
      - "[[sources/background-agent/20261105/server/schema.ts#L63-L72]]"
  - id: fence-writes-with-expected-version
    purpose: "能用 expectedVersion 讓服務在改狀態處拒絕過期寫入，並在批准後重讀版本再行動。"
    sources:
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L15-L15]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L21-L30]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L76-L80]]"
      - "[[sources/background-agent/20261105/server/observe.ts#L5-L9]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L141-L147]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L178-L185]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L187-L207]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L275-L288]]"
      - "[[sources/background-agent/20261105/server/tool-policy.ts#L3-L15]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L138-L143]]"
      - "[[sources/background-agent/20261105/service/checkout.ts#L153-L168]]"
  - id: cancel-duplicate-runs-and-unknown-outcomes
    purpose: "能用 cancelOn 阻止同一個 run 被重複執行，並把無法確認的外部結果保存成待核對狀態。"
    sources:
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L326-L420]]"
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L421-L470]]"
      - "[[sources/background-agent/20261105/23-safe-retries-with-derived-ids.vtt#L521-L556]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L17-L19]]"
      - "[[sources/background-agent/20261105/lessons/05-safe-retries/index.md#L82-L84]]"
      - "[[sources/background-agent/20261105/server/agent-workflow.ts#L58-L71]]"
      - "[[sources/background-agent/20261105/server/agent-data.ts#L57-L61]]"
created: 2026-11-05
updated: 2026-11-05
---

# 讓重試安全

## Lesson

「效果已落地，但回應在半路消失」是分散式系統的常態，重試不能靠猜。這個節點用 derived action ID 當幂等鍵、用 expectedVersion 當版本圍籬，讓同一個決策重播時只產生一次效果。

## Steps

1. [why-retries-duplicate](make-retries-safe/why-retries-duplicate.md)
2. [idempotency-at-the-effect-owner](make-retries-safe/idempotency-at-the-effect-owner.md)
3. [derive-a-stable-action-id](make-retries-safe/derive-a-stable-action-id.md)
4. [fence-writes-with-expected-version](make-retries-safe/fence-writes-with-expected-version.md)
5. [cancel-duplicate-runs-and-unknown-outcomes](make-retries-safe/cancel-duplicate-runs-and-unknown-outcomes.md)
