---
id: capstone-own-harness
title: "Capstone：把模式換成自己的場景"
subject: background-agents
tier: 3
order: 8
status: written
goal: "沿一個 run 的完整生命週期做整合驗證，並能把 durable runtime 選型與權限邊界套到自己的背景工作流程。"
prerequisites: []
steps:
  - id: run-lifecycle-recap
    title: "把一個 run 的一生連成一張圖：從事件到驗證完成"
    purpose: "能沿 event→observe→decide→wait→approve→retry→verify 說出一個 run 的完整生命週期與每步的狀態去處。"
    sources:
      - "[[sources/background-agents/20261027/lessons/index.md#L3-L13]]"
      - "[[sources/background-agents/20261027/lessons/index.md#L91-L95]]"
      - "[[sources/background-agents/20261027/notes/course-plan.md#L3-L9]]"
  - id: capstone-trials
    title: "Capstone 四個 trial：先預測，再跑，再對照"
    purpose: "能為四個 trial 各預測可接受的終局與每個 effect 的權限擁有者，再實跑驗證。"
    sources:
      - "[[sources/background-agents/20261027/lessons/advanced-lab/index.md#L3-L14]]"
      - "[[sources/background-agents/20261027/lessons/index.md#L65-L74]]"
  - id: score-three-dimensions
    title: "評分：world outcome、action trajectory、human boundary"
    purpose: "能用 world outcome、action trajectory、human boundary 三維度為一個 run 評分並指出對應證據。"
    sources:
      - "[[sources/background-agents/20261027/lessons/advanced-lab/index.md#L16-L22]]"
  - id: diagnose-the-layer
    title: "弄壞它：run 失敗時該修哪一層，與多 region 設計"
    purpose: "能診斷一個失敗的 run 該改哪一層，並設計多 region 的 incident key 與 outbox。"
    sources:
      - "[[sources/background-agents/20261027/lessons/advanced-lab/index.md#L24-L28]]"
      - "[[sources/background-agents/20261027/notes/course-plan.md#L11-L11]]"
      - "[[sources/background-agents/20261027/notes/simulator.md#L9-L9]]"
  - id: build-your-own-harness
    title: "換成自己的場景：durable runtime 選型與權限邊界"
    purpose: "能為自己的背景工作流程挑 durable runtime、畫出權限邊界，並決定哪些交給 harness、哪些交給 agent。"
    sources:
      - "[[sources/background-agents/20261027/25-wrapping-up.md#L6-L17]]"
      - "[[sources/background-agents/20261027/25-wrapping-up.md#L44-L51]]"
      - "[[sources/background-agents/20261027/notes/course-plan.md#L9-L9]]"
created: 2026-10-27
updated: 2026-10-28
---

# Capstone：把模式換成自己的場景

## Lesson

沿一個 run 的完整生命週期（事件 → 觀察 → 決策 → 等待 → 核准 → 重試 → 驗證完成）把七節機制連成一張圖。然後選 durable runtime、畫權限邊界，把同一套模式換成自己的背景工作流程。

## Steps

1. [把一個 run 的一生連成一張圖：從事件到驗證完成](capstone-own-harness/run-lifecycle-recap.md)
2. [Capstone 四個 trial：先預測，再跑，再對照](capstone-own-harness/capstone-trials.md)
3. [評分：world outcome、action trajectory、human boundary](capstone-own-harness/score-three-dimensions.md)
4. [弄壞它：run 失敗時該修哪一層，與多 region 設計](capstone-own-harness/diagnose-the-layer.md)
5. [換成自己的場景：durable runtime 選型與權限邊界](capstone-own-harness/build-your-own-harness.md)
