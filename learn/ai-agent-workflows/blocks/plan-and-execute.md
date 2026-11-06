---
id: plan-and-execute
title: "Plan-and-Execute（先規劃再執行）"
label: "Plan-and-Execute"
subject: ai-agent-workflows
type: concept
status: draft
summary: "模型先在開頭寫出完整計畫，之後依序執行，不在中途修改計畫。"
aliases: []
prerequisites: []
related:
  - planner-executor-responder
  - react-vs-plan-and-execute
  - plan-step-cap
sources:
  - "[[sources/ai-agent-workflows/20261105/course/15-plan-execute.txt#L1-L24]]"
created: 2026-11-06
updated: 2026-11-06
---

# Plan-and-Execute（先規劃再執行）

## 定義

Plan-and-execute 是一種單一 agent 架構：模型在任務開始時先寫出完整的多步驟計畫，接著嚴格依照這個計畫逐步執行。計畫只建立一次，執行過程中不會因為觀察到新結果而回頭修改。

## 為什麼重要

它用較少的模型呼叫換取較低的成本與較好的可測試性。對步驟事先就能看清的任務，固定順序讓行為可預期，測試時也比較容易重現；執行者甚至可以是較小、較便宜的模型，因為每一步都小而聚焦。

## 如何運作

流程通常分成三個階段：規劃者呼叫一次 LLM，產出步驟陣列；執行者依序處理每一步，需要時呼叫工具，並把結果存進共享記憶；回應者在所有步驟完成後，根據累積結果寫出最終答案。整個過程沒有「重新規劃」的呼叫。

## 例子

職涯顧問 agent 先產生三步計畫：搜尋符合興趣的職業、查詢這些職業的進修管道、查詢獎學金與貸款。接著它依序執行這三步，最後整合結果，推薦職業、培訓選項與資金方案。中途即使某一步回傳不理想的資料，它也不會改變順序。

## 邊界與常見誤解

- **它仍是 agent，不是 workflow**：步驟不是程式碼寫死的，而是 LLM 自己產生的。
- **它不是多代理系統**：規劃、執行與回應是同一個 agent 的三種工作，共用一份記憶。
- **它不擅長應變**：計畫一旦寫下就不會修改，這是設計上的取捨，不是 bug。
- **它需要長度上限**：計畫步驟數會直接決定模型呼叫次數，必須由程式碼設限。

## 進階

三個工作階段的職責與共享記憶見 [[planner-executor-responder]]；如何用程式碼限制計畫長度見 [[plan-step-cap]]；何時該改用 ReAct 見 [[react-vs-plan-and-execute]]。
