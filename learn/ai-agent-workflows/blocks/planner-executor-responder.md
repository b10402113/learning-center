---
id: planner-executor-responder
title: "Planner-Executor-Responder（規劃者、執行者、回應者）"
label: "Planner-Executor-Responder"
subject: ai-agent-workflows
type: concept
status: draft
summary: "同一個 plan-and-execute agent 依序扮演規劃、執行與回應三種工作，共用一份記憶。"
aliases: []
prerequisites: []
related:
  - plan-and-execute
  - plan-step-cap
sources:
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/single-agents/careerPlanAndExecuteAgent.js#L1-L145]]"
created: 2026-11-06
updated: 2026-11-06
---

# Planner-Executor-Responder（規劃者、執行者、回應者）

## 定義

Planner、executor、responder 是 plan-and-execute agent 內部的三個工作階段，不是三個獨立的 agent。規劃者把目標寫成步驟清單，執行者一次處理一步，回應者在全部步驟完成後把結果整理成最終答案；三者共用同一份記憶。

## 為什麼重要

把「想清楚要做什麼」與「把一件事做完」分開，可以讓每個階段專注在較小的目標上。規劃者只需要產出計畫，執行者只需要處理當前這一步，因此執行者可以用較小、較便宜的模型。這也讓整體流程比一次 huge prompt 更容易測試：每個階段的輸入與輸出都能單獨檢查。

## 如何運作

1. **Planner**：收到使用者目標，呼叫一次 LLM，產出步驟陣列。
2. **Executor**：依序取出每一步，帶著目標與先前步驟的結果呼叫 LLM，決定要呼叫工具或直接給出這一步的結果。
3. **Responder**：所有步驟完成後呼叫一次 LLM，只根據步驟結果寫出最終答案。

共享記憶包含目標、計畫，以及每個已完成步驟的結果。因為是同一份記憶，後面的步驟才能引用前面查到的資訊。

## 例子

職涯顧問 agent 的規劃者先寫出「搜尋職業、選出最適合的一項、查詢該職業的要求」；執行者第一步呼叫搜尋工具，第二步直接從結果中選出野生動物生物學家，第三步再查該職業的學歷與證照；回應者最後把三步結果組成職涯建議。

## 邊界與常見誤解

- **不是三個 agent**：沒有三個獨立的對話或協調者，只有一個 agent 的三種工作。
- **不是三個迴圈**：執行者可以只用一次模型呼叫完成一步，不必像 ReAct 那樣每步都重新規劃。
- **回應者不能改計畫**：它只負責把既有結果寫成答案，沒有重新規劃的權限。
- **共享記憶不是共享給其他 agent**：這是單一 agent 內部的狀態，不是多代理系統的訊息匯流排。

## 進階

這三個階段讓 plan-and-execute 的除錯位置很明確：答案不對時，先看是計畫錯了、某一步執行錯了，還是回應者整合錯了。計畫長度的護欄見 [[plan-step-cap]]，整體架構見 [[plan-and-execute]]。
