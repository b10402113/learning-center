---
id: workflow-agent-handoff
title: "Workflow-Agent Handoff（工作流交棒給 Agent）"
label: "Workflow-Agent Handoff"
subject: ai-agent-workflows
type: concept
status: draft
summary: "當分支爆炸到無法手寫時，把決定流程的權力從程式碼交給執行期的模型。"
aliases: []
prerequisites: []
related:
  - workflow-scorecard
  - orchestrator-workers
  - workflow
sources:
  - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L74-L105]]"
  - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L193-L218]]"
created: 2026-11-06
updated: 2026-11-06
---

# Workflow-Agent Handoff（工作流交棒給 Agent）

## 定義

Workflow-agent handoff 是控制權轉移的那一刻：原本由程式碼固定步驟的流程，因為分支無法事先窮舉，改由模型在執行期自行決定下一步。它不是把整個系統重寫，而是把「畫箭頭」的權力從開發者交給模型。

## 為什麼重要

工作流的三欄成績單再漂亮，也救不了分支爆炸。獎學金資格審核就是典型例子：先問居住地、是否第一代大學生、是否軍人家庭、是否運動員；光是「運動員」成立，底下又岔出十几條問題，進了泳隊還要再答三個衍生問題。幾百種獎學金、每種幾十項條件、每年甚至每學期變動，工程師不可能手寫所有 `if/else`。

## 如何運作

判斷是否交棒的訊號不是「任務聽起來很難」，而是「子任務的數量與內容能不能事前預測」：

- 能預測 → 留在 workflow，用 chain、router、parallelization、gate 組合。
- 不能預測 → 讓模型在執行期拆解，例如 orchestrator-workers。
- 介於兩者 → 保留外圍的固定階段，只在內部讓模型動態決策。

交棒可以是局部的。同一個系統裡，有些步驟仍是固定程式碼，只有分支爆炸的那一段換成 agent；不需要整條流程都變成自主代理。

## 例子

程式碼編輯是常見的動態情境：同一個需求，有時只要在某個檔案補一行 `if`，有時要改十三個檔案、新增上千行。開發者無法用靜態流程預測要開幾個步驟，於是交給 orchestrator 動態拆解。

另一個訊號出現在 orchestrator-workers：orchestrator 看完第一輪 worker 的回覆，發現結果不合理（例如求職 worker 同時給了 UX 設計師、警察、攝影師三個毫不相干的職業），於是把任務退回同一個 worker 要求重做。這種重試、反思與重新派發，已經具備 agent 的行為。

## 邊界與常見誤解

- **交棒不是全有全無**：可以只把某一小段換成 agent，其餘仍是固定流程。
- **不是因為 agent 比較潮**：若分支能窮舉，workflow 更可靠、更便宜、更好除錯。
- **orchestrator-workers 只是邊界**：它的 plan、delegate、synthesize 階段仍由程式碼固定，不算完全自主的 agent。
- **交棒後仍要 gate**：模型決定要跑幾個子任務，就等於決定花多少錢，外圍必須設上限與格式檢查。

## 進階

先用量化方式確認 workflow 真的不夠用，再談交棒；三欄的判準見 [[workflow-scorecard]]。交棒後最常見的形態是 [[orchestrator-workers]]，它保留了固定階段，只把子任務的決定權交給模型。
