---
id: fixed-workflow
title: Fixed Workflow（固定流程）
label: Fixed Workflow
subject: ai-agent-workflows
type: concept
status: draft
summary: 流程的方塊與箭頭在執行前由程式碼畫好，模型只能在既定步驟內做判斷。
aliases: []
prerequisites: []
related:
  - workflow
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L211-L269]]
created: 2026-11-06
updated: 2026-11-06
---

# Fixed Workflow（固定流程）

## 定義

Fixed workflow 是一種流程結構在執行前就由開發者寫死在程式碼裡的系統。哪些步驟會發生、步驟之間怎麼連、分支有幾條，全部在程式啟動前就決定；模型只是被放進某些方塊裡，負責把輸入轉成輸出。

## 為什麼重要

它劃出了 workflow 與 agent 的根本界線。一個流程就算包含 LLM 判斷、工具呼叫、甚至迴圈，只要模型沒有權力改變步驟本身，它就還是可預測、可測試、成本可控的 workflow。搞混這條線，就會把「在固定結構裡選分支」誤認成「自己決定結構」。

## 如何運作

開發者在程式碼裡排出步驟與箭頭，然後在需要語言的步驟呼叫模型。模型可以決定草稿寫什麼、判斷是否通過、選擇要傳給工具哪些參數，但牠不能跳過某個步驟、不能動用沒被配置的工具、也不能在流程後方自行發明新步驟。

以 evaluator-optimizer 為例：generator 產生草稿、evaluator 回傳 PASS 或 FAIL，程式碼再依這個結果決定停止或重跑。模型確實影響了路徑，但可選的路徑只有開發者事先畫好的那兩條。

## 例子

一個職涯諮詢 workflow 依序執行「投票選職業 → 平行產生學習路徑、就業前景、日常工作」→ 彙整。每一步的模型都能自由生成內容，但沒有任何一步能決定「我要不要改成先查薪資」。整體順序由程式碼固定。

## 邊界與常見誤解

- **有 LLM 不等於 agent**：判斷內容的是模型，決定步驟的是程式碼。
- **有迴圈不等於 agent**：重試次數與停止條件由開發者設定，模型無法自行延長。
- **有工具不等於 agent**：工具是開發者放進特定步驟的，模型不能自行挑選未配置的工具。
- **固定流程不是低階版本**：對可預測的任務，它通常比 agent 更可靠也更便宜。

## 進階

真正需要放手的情況，是分支數量無法事先窮舉，例如資格審核規則每年變動、程式修改規模從一行到上千行。那時才把畫箭頭的權力交給模型，見 Orchestrator-Workers 與 Workflow-Agent Handoff。
