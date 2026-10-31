---
id: where-model-code-runs
title: "模型寫的程式，跑在哪裡"
subject: agent-harness2
tier: 3
order: 7
status: written
goal: "寫出 `runInSandbox`、說出 `vm` 不是真沙箱，並用 code mode 算對退款金額。"
digests:
  - 13-code-mode-security.md
  - 14-sandbox-boundary-runcode-tool.md
  - 15-updating-the-system-prompt.md
  - harness-engineering.1.part.md
  - harness-engineering.2.part.md
  - harness-engineering.3.part.md
prerequisites: []
steps:
  - id: draw-the-execution-boundary
    title: "先畫執行邊界：別讓模型程式碰 production"
    purpose: "能說明為什麼模型產生的程式必須在隔離環境執行，以及 code mode 如何減少工具往返。"
    sources:
      - "[[sources/agent-harness2/20261029/13-code-mode-security.txt#L40-L60]]"
      - "[[sources/agent-harness2/20261029/13-code-mode-security.txt#L135-L167]]"
  - id: build-the-vm-sandbox
    title: "用 `node:vm` 包出 `runInSandbox`"
    purpose: "能實作受限的 sandbox API、非同步包裝與 timeout，並指出 `vm` 的安全限制。"
    sources:
      - "[[sources/agent-harness2/20261029/14-sandbox-boundary-runcode-tool.txt#L1-L167]]"
      - "[[sources/agent-harness2/20261029/14-sandbox-boundary-runcode-tool.txt#L168-L302]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/sandbox.ts#L1-L60]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L1-L61]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L98-L129]]"
  - id: calculate-the-refund-with-code-mode
    title: "讓模型寫程式算出退款金額"
    purpose: "能讓模型用 `runCode` 查重複扣款並以程式算出精確退款金額。"
    sources:
      - "[[sources/agent-harness2/20261029/15-updating-the-system-prompt.txt#L1-L177]]"
      - "[[sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L1-L61]]"
created: 2026-10-29
updated: 2026-10-29
---

# 模型寫的程式，跑在哪裡

## Lesson

模型要求執行的程式碼不能直接跑在本機或 production。用 Node 的 `vm` 做出邊界——只注入 `tools` 與 `console.log`、包成 async IIFE、用 timeout 擋失控——再把 code mode 寫進 system prompt，讓退款金額由程式算，而不是模型心算。

## Steps

1. [先畫執行邊界：別讓模型程式碰 production](where-model-code-runs/draw-the-execution-boundary.md)
2. [用 `node:vm` 包出 `runInSandbox`](where-model-code-runs/build-the-vm-sandbox.md)
3. [讓模型寫程式算出退款金額](where-model-code-runs/calculate-the-refund-with-code-mode.md)
