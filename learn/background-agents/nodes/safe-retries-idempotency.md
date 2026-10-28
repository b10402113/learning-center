---
id: safe-retries-idempotency
title: "安全重試與 idempotency"
subject: background-agents
tier: 2
order: 7
status: written
goal: "說出為何拆 step 不夠、還需要 idempotency key 與 derived action ID、expectedVersion 最後柵欄、cancelOn 與 lost-ack。"
prerequisites: []
steps:
  - id: why-steps-are-not-enough
    title: "拆 step 還不夠：checkpoint 擋不住重複的副作用"
    purpose: "能說出拆 step 只保證 checkpoint 不保證 effect 只發生一次，並舉出重複副作用是怎麼跑出來的。"
    sources:
      - "[[sources/background-agents/20261027/10-durable-execution.md#L15-L24]]"
      - "[[sources/background-agents/20261027/23-safe-retries-with-derived-ids.md#L8-L12]]"
      - "[[sources/background-agents/20261027/23-safe-retries-with-derived-ids.md#L13-L21]]"
  - id: idempotency-key
    title: "idempotency key 綁參數：effect owner 記住結果"
    purpose: "能說出 idempotency key 要綁定參數，同 ID 同參數回放、不同參數拒絕。"
    sources:
      - "[[sources/background-agents/20261027/23-safe-retries-with-derived-ids.md#L1-L2]]"
      - "[[sources/background-agents/20261027/service/checkout.ts#L123-L182]]"
      - "[[sources/background-agents/20261027/15-executing-actions.md#L6-L17]]"
  - id: derived-action-id
    title: "derived action ID：從隨機 UUID 改成確定性推導"
    purpose: "能說出 action ID 由 run、cycle、action 推導，讓重播拿到同一個 intent key。"
    sources:
      - "[[sources/background-agents/20261027/23-safe-retries-with-derived-ids.md#L22-L26]]"
      - "[[sources/background-agents/20261027/23-safe-retries-with-derived-ids.md#L34-L38]]"
  - id: expected-version-last-gate
    title: "expectedVersion：效果落地前的最後一道柵欄"
    purpose: "能說出 expectedVersion 如何在執行前比對版本，版本不符就丟棄 stale 結果。"
    sources:
      - "[[sources/background-agents/20261027/15-executing-actions.md#L18-L23]]"
      - "[[sources/background-agents/20261027/15-executing-actions.md#L24-L35]]"
      - "[[sources/background-agents/20261027/service/checkout.ts#L123-L182]]"
  - id: cancel-and-lost-ack
    title: "cancelOn 與 lost-ack：收緊一致性的兩道防線"
    purpose: "能說出 cancelOn 擋同 runId 的 race，lost-ack 證明 effect 與 ack 的落差。"
    sources:
      - "[[sources/background-agents/20261027/23-safe-retries-with-derived-ids.md#L27-L33]]"
      - "[[sources/background-agents/20261027/service/checkout.ts#L13-L48]]"
      - "[[sources/background-agents/20261027/service/checkout.ts#L123-L182]]"
created: 2026-10-27
updated: 2026-10-27
---

# 安全重試與 idempotency

## Lesson

拆 step 只保證 checkpoint，不保證 effect 只發生一次。idempotency key 綁參數、action ID 用 run/cycle/action 推導、expectedVersion 是最後柵欄。lost-ack 與 cancelOn 收緊一致性。

## Steps

1. [拆 step 還不夠：checkpoint 擋不住重複的副作用](safe-retries-idempotency/why-steps-are-not-enough.md)
2. [idempotency key 綁參數：effect owner 記住結果](safe-retries-idempotency/idempotency-key.md)
3. [derived action ID：從隨機 UUID 改成確定性推導](safe-retries-idempotency/derived-action-id.md)
4. [expectedVersion：效果落地前的最後一道柵欄](safe-retries-idempotency/expected-version-last-gate.md)
5. [cancelOn 與 lost-ack：收緊一致性的兩道防線](safe-retries-idempotency/cancel-and-lost-ack.md)
