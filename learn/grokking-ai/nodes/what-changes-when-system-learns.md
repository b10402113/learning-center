---
id: what-changes-when-system-learns
title: 系統開始學習後改變了什麼
subject: grokking-ai
tier: 1
order: 3
status: written
goal: 說出四個被打破的經典假設，以及每一個各自需要的新元件。
digests:
  - 3. What Changes When the System Learns.en.md
prerequisites:
  - learn/grokking-ai/nodes/ai-interview-landscape.md
steps:
  - id: classic-parts-four-breaks
    author: google/gemini-3.8-flash
    title: 當系統引入 AI：四個悄悄失效的傳統架構假設
    purpose: 用一段開場說明哪些經典零件沒少，並點出四個會無聲壞掉的假設與各自的新元件。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/3. What Changes When the System
        Learns.en.txt#L1-L21]]
    blocks:
      - feedback-loop
      - quality-measurement-subsystem
      - model-call-cost-controls
      - four-broken-assumptions
      - silent-failure-guardrails
  - id: quality-on-a-spectrum
    author: google/gemini-3.8-flash
    title: 品質是個光譜：為機器學習系統挑選評估指標
    purpose: 用延遲預測差 6 分鐘的例子說明品質是連續的，並為自己設計的系統挑一個品質指標。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/3. What Changes When the System
        Learns.en.txt#L23-L43]]
    blocks:
      - quality-measurement-subsystem
      - four-broken-assumptions
  - id: drift-and-feedback-loop
    author: google/gemini-3.8-flash
    title: 為什麼模型漂移沒有錯誤訊息：回饋迴圈的四個步驟與排查順序
    purpose: 解釋漂移為何沒有錯誤訊息，並講出回饋迴圈四步以及先查資料管線的順序。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/3. What Changes When the System
        Learns.en.txt#L45-L63]]
    blocks:
      - feedback-loop
      - four-broken-assumptions
  - id: cost-is-architecture
    author: google/gemini-3.8-flash
    title: 壓低模型呼叫成本：算清帳單，在託管、自架與微調之間做取捨
    purpose: 用帳單估算與 hosted、自架、微調的取捨，選出把模型呼叫成本壓下來的做法。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/3. What Changes When the System
        Learns.en.txt#L63-L83]]
      - >-
        [[sources/grokking-ai/20261119/course/3. What Changes When the System
        Learns.en.txt#L115-L135]]
    blocks:
      - model-call-cost-controls
      - four-broken-assumptions
  - id: silent-failures-and-blast-radius
    author: google/gemini-3.8-flash
    title: 當 200 OK 也可能是錯的：從爆炸半徑看 AI 系統的安全護欄
    purpose: 說明 200 OK 也可能是錯的，並用 blast radius 決定護欄與核准，最後一段話收束四個改變。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/3. What Changes When the System
        Learns.en.txt#L85-L115]]
      - >-
        [[sources/grokking-ai/20261119/course/3. What Changes When the System
        Learns.en.txt#L137-L147]]
    blocks:
      - feedback-loop
      - quality-measurement-subsystem
      - model-call-cost-controls
      - four-broken-assumptions
      - silent-failure-guardrails
created: 2026-11-19T00:00:00.000Z
updated: 2026-11-25T00:00:00.000Z
---

# 系統開始學習後改變了什麼

## Lesson

AI 系統仍然是分散式系統，快取、資料庫、佇列、負載平衡器一個都沒少。真正改變的是四個平常不用說出口的假設：輸出不是對或錯、行為不會自己變、請求很便宜、失敗會響。每個假設破掉，就對應一個必須補上的元件。

## Steps

1. [當系統引入 AI：四個悄悄失效的傳統架構假設](what-changes-when-system-learns/classic-parts-four-breaks.md)
2. [品質是個光譜：為機器學習系統挑選評估指標](what-changes-when-system-learns/quality-on-a-spectrum.md)
3. [為什麼模型漂移沒有錯誤訊息：回饋迴圈的四個步驟與排查順序](what-changes-when-system-learns/drift-and-feedback-loop.md)
4. [壓低模型呼叫成本：算清帳單，在託管、自架與微調之間做取捨](what-changes-when-system-learns/cost-is-architecture.md)
5. [當 200 OK 也可能是錯的：從爆炸半徑看 AI 系統的安全護欄](what-changes-when-system-learns/silent-failures-and-blast-radius.md)
