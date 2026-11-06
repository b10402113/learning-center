---
id: single-agent-system
title: Single-Agent System（單一代理系統）
label: Single-Agent System
subject: ai-agent-workflows
type: concept
status: draft
summary: 一個 agent 由 LLM、工具、指令與一個執行迴圈組成，沒有其他代理或協調者。
aliases: []
prerequisites: []
related:
  - agent-loop
  - react
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt#L1-L13]]
created: 2026-11-06
updated: 2026-11-06
---

# Single-Agent System（單一代理系統）

## 定義

Single-agent system 是最單純的代理架構：一個 LLM、一組工具、規範行為的指令，以及一個把這些元件串起來的執行迴圈。它沒有其他 agent 參與，也不需要額外的協調者。

## 為什麼重要

它是理解所有代理系統的基準點。多代理、supervisor、peer-to-peer 等拓撲，都是從這個最小單位長出來的；先把單一 agent 的迴圈、記憶與停止條件想清楚，才不會用更多代理去掩蓋原本的設計問題。對許多任務來說，單一 agent 也已經足夠。

## 如何運作

使用者輸入進入迴圈後，LLM 根據指令與目前記憶推理，決定是否呼叫工具；工具由背景程式執行，結果回到記憶；模型再根據更新後的內容決定下一步。這個過程重複到模型給出最終答案，或外部停止條件生效。整個系統只有一份對話紀錄。

## 例子

一個職涯顧問 agent 收到使用者的興趣與排斥條件，先推理要搜尋哪些職業，再呼叫搜尋工具；看到結果後決定查某個職業的學歷要求；資料齊全後輸出建議。過程中沒有第二個 agent 接手，也沒有人負責協調。

## 邊界與常見誤解

- **不是 workflow**：步驟不是程式碼寫死的，模型有決定下一步的權限。
- **不是多代理系統**：只有一個 LLM、一份 transcript、一個迴圈。
- **模型只是元件**：agent 是外圍的迴圈，不是模型本身。
- **不是越大越好**：單一 agent 的可靠度仍取決於工具設計、context 管理與停止條件。

## 進階

單一 agent 的兩個核心問題是「迴圈怎麼轉」與「迴圈怎麼停」。前者見 [[agent-loop]]，後者見 Stopping Condition；最常見的實作模式則是 [[react]]。
