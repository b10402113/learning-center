---
id: durable-execution-steps
title: "Durable execution：把 loop 拆成 step"
subject: background-agents
tier: 2
order: 3
status: written
goal: "解釋為什麼要把 loop 拆成 step、replay 的真相（memoize 而非重播 stack），以及 deterministic workflow + idempotent step 兩條規則。"
digests:
  - 10-durable-execution.md
  - 12-multi-step-loop.md
prerequisites: []
steps:
  - id: why-split-into-steps
    title: "為什麼要把 loop 拆成 step：一個失敗不能整段重做"
    purpose: "能說出單一 step 內失敗會整段重跑，拆成多個 step 才能從上次完成處 resume 且不丟資訊。"
    sources:
      - "[[sources/background-agents/20261027/10-durable-execution.md#L1-L13]]"
  - id: replay-is-memoization-not-stack
    title: "resume 的真相：memoize 結果，不是重播 JS stack"
    purpose: "能說出 resume 是把 step 結果 memoize 後依序重讀，而非重播 JavaScript 執行 stack。"
    sources:
      - "[[sources/background-agents/20261027/10-durable-execution.md#L31-L41]]"
  - id: two-rules-deterministic-idempotent
    title: "兩條規則：workflow deterministic、step idempotent"
    purpose: "能說出 workflow 程式碼必須 deterministic、step 必須 idempotent，並用 Stripe idempotency key 舉例。"
    sources:
      - "[[sources/background-agents/20261027/10-durable-execution.md#L15-L23]]"
      - "[[sources/background-agents/20261027/12-multi-step-loop.md#L83-L87]]"
  - id: which-work-goes-in-a-step
    title: "哪些該進 step、哪些留在 workflow：單一職責"
    purpose: "能判斷非同步操作該進 step、即時檢查留在 workflow，並遵守一個 step 只做一件事。"
    sources:
      - "[[sources/background-agents/20261027/12-multi-step-loop.md#L33-L65]]"
created: 2026-10-27
updated: 2026-10-31
---

# Durable execution：把 loop 拆成 step

## Lesson

單一 step 內的失敗會讓整段重做，所以要把 loop 拆成 checkpoint。replay 不是重播 JS stack，而是重讀 memoized 的 step 結果；這要求 workflow deterministic、step idempotent。這兩條規則決定後面所有寫法。

## Steps

1. [為什麼要把 loop 拆成 step：一個失敗不能整段重做](durable-execution-steps/why-split-into-steps.md)
2. [resume 的真相：memoize 結果，不是重播 JS stack](durable-execution-steps/replay-is-memoization-not-stack.md)
3. [兩條規則：workflow deterministic、step idempotent](durable-execution-steps/two-rules-deterministic-idempotent.md)
4. [哪些該進 step、哪些留在 workflow：單一職責](durable-execution-steps/which-work-goes-in-a-step.md)
