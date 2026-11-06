---
id: model-diversity
title: "Model Diversity（模型多樣性）"
label: "Model Diversity"
subject: ai-agent-workflows
type: concept
status: draft
summary: "在冗餘系統中刻意混用不同模型家族與供應商，換取真正不同的視角。"
aliases: []
prerequisites: []
related:
  - parallelization
  - voting
  - aggregator-step
  - specialist-agent
sources:
  - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L147-L171]]"
created: 2026-11-06
updated: 2026-11-06
---

# Model Diversity（模型多樣性）

## 定義

Model diversity 是在同一個多 agent 系統中，刻意讓不同 agent 使用不同模型家族或供應商的模型，例如一個 OpenAI 模型、一個 Anthropic 模型、一個開源權重模型，必要時再搭配不同的推論深度。

## 為什麼重要

平行的價值來自分歧：如果多個 agent 的錯誤高度相關，投票與多視角審查就只是重複同一個盲點。同一家族模型的預訓練資料高度重疊，容易一起漏掉同一類問題；跨家族、跨供應商則能帶來互補的檢查角度。

## 如何運作

系統在建立 agent 時，除了指派角色與工具，也指派不同的模型。各 agent 獨立執行後，結果交給聚合步驟比較。這裡的重點不是模型越多越好，而是讓每個 agent 的知識來源與推理傾向盡量不重疊，使冗餘真的產生新資訊。

## 例子

審查同一個 PR 時，同時派出三個 agent：一個用 OpenAI 模型、一個用 Anthropic 模型、一個用開源權重模型，各自挑出潛在問題。三者回報的差異，正是工程師最需要的第二意見。

## 邊界與常見誤解

- **不是同一模型跑三次**：那只會得到高度相關的答案，稱不上多樣性。
- **不是模型越多越準**：成本會上升，且仍需一個能處理衝突的聚合步驟。
- **不是所有任務都需要**：若任務有明確規則可驗證，模型多樣性帶來的效益有限。

## 進階

Model diversity 最常搭配 [[voting]] 與 [[parallelization]] 使用，並由 [[aggregator-step]] 收斂結果。它與 [[specialist-agent]] 互補：一個處理角色分工，一個處理知識來源的分歧。
