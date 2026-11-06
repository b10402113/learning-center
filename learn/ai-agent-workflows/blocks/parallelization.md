---
id: parallelization
title: "Parallelization（平行化）"
label: "Parallelization"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把同一個請求同時分給多個 agent，完成後再合併結果。"
aliases: []
prerequisites: []
related:
  - sectioning
  - voting
  - aggregator-step
  - linear-latency
sources:
  - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L7-L18]]"
created: 2026-11-06
updated: 2026-11-06
---

# Parallelization（平行化）

## 定義

Parallelization 是把同一個請求拆給多個 agent 同時處理，等它們完成後再合併成一份結果的多 agent 架構。在多 agent 的語境裡，它也常被稱為 aggregator 或 ensemble。主要子型有兩種：sectioning 與 voting。

## 為什麼重要

它是循序架構的鏡像。循序每一步都要排隊等待，延遲高但成本依序發生；平行化同時派出多個 agent、快速收回，延遲大幅下降，但因為同時執行多次，成本也明顯上升。它用金錢換時間，並用冗餘換可靠性。

## 如何運作

由程式碼作為協調者，同時啟動多個 agent。每個 agent 在自己的分支裡工作，擁有獨立的 context 與輸出欄位，執行期間看不到彼此的結果。全部完成後，再由一個合併步驟讀取所有輸出，產生單一回應。

## 例子

審查一個大型 PR 時，同時派三個 agent 各自找問題，最後彙整成一份清單。求職系統則可讓多個 agent 各自推薦職業，再由聚合步驟選出共識最高的答案，而不是先假設某個職業才能往下查學校。

## 邊界與常見誤解

- **不是所有任務都能平行**：若後一步必須先知道前一步的答案，就只能留在序列裡。
- **不是免費的加速**：多個 agent 同時跑，尖峰成本會成倍增加。
- **不是可靠度的保證**：合併步驟本身仍是單點故障，仍可能誤解或幻覺。

## 進階

依任務形狀選擇子型：獨立子任務用 [[sectioning]]，同一題重複求解用 [[voting]]。兩者都依賴一個好的 [[aggregator-step]]，而平行化的延遲優勢正好補上 [[linear-latency]] 的缺點。
