---
id: agent-vs-workflow
title: Agent vs Workflow（代理與工作流）
label: Agent vs Workflow
subject: ai-agent-workflows
type: contrast
status: draft
summary: Workflow 由程式碼決定每一步，agent 則由 LLM 決定呼叫哪個工具、幾次、何時結束。
aliases:
  - workflow-vs-agent
prerequisites: []
related:
  - workflow
  - react
  - agent-loop
  - boxes-and-arrows
  - agent
sources:
  - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L198-L227]]'
created: 2026-11-06T00:00:00.000Z
updated: '2026-11-06'
---

# Agent vs Workflow（代理與工作流）

## A 是什麼

Agent 把「下一步做什麼」的控制權交給 LLM。模型看著目前的對話紀錄，自行決定要呼叫哪個工具、傳入什麼參數、要呼叫幾次，以及什麼時候算完成。程式碼只負責執行工具、維護迴圈與把結果送回模型。

## B 是什麼

Workflow 由開發者把步驟與分支寫死在程式碼裡。即使其中某一步會呼叫 LLM，模型也只負責把自己那一步的輸入轉成輸出；它不能選擇下一步，也不能自行再觸發一次呼叫。箭頭是開發者畫的。

## 關鍵差異

兩者的分界不是「有沒有用 LLM」，而是**誰決定下一個箭頭**：

- Workflow：程式碼永遠知道下一步是什麼，執行次數可預期。
- Agent：模型決定下一步，執行次數在執行前無法確定。
- Workflow 的模型是流程裡的一個盒子；agent 的模型是迴圈裡的決策者。
- Agent 能重試失敗的工具、臨時多查一次、比較兩個候選答案；workflow 要走這些路徑，必須事先寫好分支。

## 何時用哪個

任務能乾淨拆解、路徑可預測時，先用 workflow。它更便宜、更容易測試，也更容易除錯。只有當你無法事先確定步驟，或必須在執行途中根據結果改變方向時，才讓 agent 接手。判斷的基準可以從 [[workflow]] 與 [[agent-loop]] 兩端往中間看。

## 進階

實務上常見的是混合架構：外層用 workflow 固定高階階段，某一階段內部放一個 agent 處理不確定的探索。這時要特別標記控制權的邊界，否則出了錯會很難判斷是流程寫死的那一段，還是模型自己轉錯彎。
