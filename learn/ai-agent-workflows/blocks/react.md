---
id: react
title: ReAct（推理與行動）
label: ReAct
subject: ai-agent-workflows
type: concept
status: draft
summary: 讓模型交錯推理、呼叫工具並觀察結果，重複到產生最終答案的單一 agent 模式。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L1-L25]]'
created: 2026-11-06
updated: 2026-11-06
---

# ReAct（推理與行動）

## 定義

ReAct 是 Reasoning and Acting 的縮寫，一種單一 agent 的運作模式。模型在每一輪先推理目前的情況，決定要採取什麼行動，再根據行動的結果重新推理；這個循環持續到它能給出最終答案為止。

## 為什麼重要

它把思維鏈的逐步推理，和實際採取行動、接收環境回饋結合起來。模型不再只靠訓練資料回答，而能在任務途中查資料、比較候選項、從錯誤中重試。這讓 agent 有能力處理一開始無法完整規劃的任務。

## 如何運作

每一輪包含三個環節：模型輸出一個 thought（接下來該做什麼）與一個 action（工具名稱加參數）；背景程式執行該工具；工具結果以 observation 的形式附加回對話紀錄。下一輪模型讀到更長的紀錄，再產生新的 thought 與 action。直到模型輸出最終答案，或達到停止條件，迴圈才結束。

## 例子

使用者說自己喜歡動物與科學、不喜歡久坐。ReAct agent 第一輪推理出應先找符合興趣的職業，呼叫職涯搜尋工具；觀察到野生動物生物學家等選項後，第二輪推理出要查該職業的學歷要求，再呼叫另一個工具；資料足夠後輸出完整建議。

## 邊界與常見誤解

- **不是前端函式庫**：這裡的 ReAct 和 JavaScript 的 React 無關。
- **不是 workflow**：呼叫哪個工具、幾次、何時結束，都由模型決定，不是程式碼寫死。
- **不是無限迴圈**：必須有停止條件，例如最大步數或模型的最終答案。
- **不是多代理系統**：最單純的 ReAct 只有一個 LLM、一份 transcript、一個迴圈。

## 進階

要讓 ReAct 穩定運作，需要把格式教給模型、把錯誤當成觀察回餵，並控制 transcript 的成長。這些機制分別見 Thought-Action-Observation、Tool Error Observation 與 Transcript Memory；與一次規劃的對照見 ReAct vs Plan-and-Execute。
