---
id: code-orchestrator
title: Code Orchestrator（程式碼協調器）
label: Code Orchestrator
subject: ai-agent-workflows
type: concept
status: draft
summary: 用普通程式碼固定順序呼叫多個 agent，決定流程的是程式而非 LLM。
aliases: []
prerequisites: []
related:
  - sequential-multi-agent
  - specialist-agent
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L199-L219]]
created: 2026-11-06
updated: 2026-11-06
---

# Code Orchestrator（程式碼協調器）

## 定義

Code orchestrator 是一段普通程式碼，負責按寫死的順序啟動多個 agent、等待結果、保存狀態，再把結果交給下一棒。它通常只是一個迴圈或幾行循序呼叫，不含任何 LLM 判斷。

## 為什麼重要

它把「誰是下一棒」的控制權留在開發者手上。Agent 只專注自己的子任務，不能自行改順序或跳過步驟，因此流程保有多 agent 的專業分工，同時保留 workflow 的確定性與可預測性。它也提供插入驗證閘門的位置。

## 如何運作

協調器持有一個共享 state，依序對每個 agent 呼叫 `run`，把回傳值存進該 agent 的 `outputKey`，下一個 agent 再從 state 讀取所需欄位。呼叫下一棒之前，程式可以插入驗證；任何一步失敗時，也由程式決定要停止、重試或回傳錯誤。

## 例子

一個 `runSequential` 函式依序執行 career matcher 與 roadmap advisor：前者把選定的職業寫進 `state.career`，後者只讀這個欄位。整個流程沒有任何 LLM 決定下一步，只有固定的程式迴圈。

## 邊界與常見誤解

- **不是 LLM planner**：它不會依任務內容動態改變順序。
- **不是 workflow 引擎的專利**：幾行 JavaScript 就能做到，不需要額外框架。
- **不等於沒有彈性**：每個 agent 內部仍是自主迴圈，彈性留在節點內，順序留在程式碼。

## 進階

在呼叫下一棒前加入 Handoff Gate，能阻止壞輸出擴散。若要讓每個節點更專注，可搭配 [[specialist-agent]]，把工具與提示詞縮到單一職責。
