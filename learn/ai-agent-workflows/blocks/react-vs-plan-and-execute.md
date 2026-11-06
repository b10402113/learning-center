---
id: react-vs-plan-and-execute
title: "ReAct vs Plan-and-Execute（邊走邊看與先規劃）"
label: "ReAct vs Plan-and-Execute"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "ReAct 每步重新決策、能改方向；plan-and-execute 一次規劃、固定執行、較便宜。"
aliases: []
prerequisites: []
related:
  - react
  - plan-and-execute
  - plan-adaptability-tradeoff
sources:
  - "[[sources/ai-agent-workflows/20261105/course/15-plan-execute.txt#L25-L58]]"
created: 2026-11-06
updated: 2026-11-06
---

# ReAct vs Plan-and-Execute（邊走邊看與先規劃）

## A 是什麼

ReAct 讓模型一步一步走：每一輪根據目前的觀察決定下一個 action，收到結果後再重新推理。它不要求一開始就想清楚全部步驟，因此能在中途改變方向、重試失敗的工具，或臨時多查一個來源。

## B 是什麼

Plan-and-execute 要求模型在開始時寫出完整計畫，之後照著計畫逐步執行。執行過程中會思考、會呼叫工具，但不會根據觀察結果回頭修改計畫。它的目標是減少模型呼叫次數，讓流程更便宜、更容易測試。

## 關鍵差異

兩者的分水嶺是**有沒有能力在事情不如預期時喊停並修正**：

- ReAct：每一步都重新決策，適應力高，但呼叫次數多、成本較高。
- Plan-and-execute：計畫只寫一次，成本較低、行為可預期，但無法中途轉向。
- ReAct 的計畫是逐步浮現的；plan-and-execute 的計畫在第一步之前就固定。
- 同樣的任務，plan-and-execute 通常比較容易測試，因為每次執行的步驟順序一致。

## 何時用哪個

如果任務能在開始前乾淨拆解、步驟之間不太會出現意外，選 plan-and-execute。如果某一步的答案可能錯誤、研究資料可能不足，或任務像寫程式一樣必須邊做邊修，就選 ReAct。判斷時問自己：執行途中若發現原本的假設錯了，我需要改變計畫嗎？需要，就用 ReAct。

## 進階

這個選擇不是二選一的口味問題，而是成本與適應力的交換，詳見 [[plan-adaptability-tradeoff]]。實務上也可以混合：外層用固定流程，遇到真正不確定的子任務時，才在該步驟內啟動一個 ReAct 迴圈。
