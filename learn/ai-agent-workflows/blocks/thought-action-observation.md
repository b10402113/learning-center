---
id: thought-action-observation
title: "Thought-Action-Observation（思考、行動、觀察）"
label: "Thought-Action-Observation"
subject: ai-agent-workflows
type: concept
status: draft
summary: "ReAct 每一輪的三個環節：模型推理、呼叫工具、把執行結果寫回對話。"
aliases: []
prerequisites: []
related:
  - react
  - react-system-prompt
sources:
  - "[[sources/ai-agent-workflows/20261105/course/14-react.txt#L26-L45]]"
created: 2026-11-06
updated: 2026-11-06
---

# Thought-Action-Observation（思考、行動、觀察）

## 定義

Thought、action、observation 是 ReAct 迴圈裡一輪的三個環節。Thought 是模型對目前資訊的推理與下一步判斷；action 是模型選擇的工具與輸入；observation 是背景程式執行工具後，附加回對話紀錄的結果。

## 為什麼重要

這三個環節把「推理」和「與環境互動」綁在一起。只有 thought，模型仍只能靠內部知識；只有 action，模型不知道為何要呼叫工具。Observation 讓模型的下一步推理有事實依據，也讓錯誤能在下一輪被看見與修正。

## 如何運作

模型先輸出一個 thought，接著輸出一個 action，格式通常是工具名稱加上參數；輸出後模型停止，等待外部程式。程式解析 action、執行對應工具，把結果包成 observation 附加到 transcript。下一輪模型讀到包含新 observation 的完整紀錄，再產生下一個 thought 與 action。

## 例子

職涯 agent 第一輪的 thought 是「先了解使用者的興趣，再找適合的職業」；action 是呼叫職涯搜尋工具；observation 是工具回傳的候選職業清單。第二輪的 thought 看到清單後，決定查其中一項職業的學歷要求，於是產生新的 action。

## 邊界與常見誤解

- **模型不能自己產生 observation**：observation 必須由程式執行工具後寫入，否則等於模型在編故事。
- **一輪只做一個 action**：模型若一次輸出多個 action，parser 會難以對應執行結果。
- **thought 不是保證正確的推理**：它只是模型的猜測，需要用 observation 驗證。
- **observation 不是越長越好**：冗長的工具輸出會快速撐大 context。

## 進階

這三個環節的格式必須和 system prompt、parser 一起設計。提示詞怎麼教模型輸出，見 [[react-system-prompt]]；工具錯誤如何變成 observation，見 [[tool-error-as-observation]]；整體模式見 [[react]]。
