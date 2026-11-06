---
id: stopping-condition
title: Stopping Condition（停止條件）
label: Stopping Condition
subject: ai-agent-workflows
type: concept
status: draft
summary: 替 agent 迴圈設定明確的結束規則，例如最大輪數、token、成本、時間或模型的最終答案。
aliases:
  - stop-condition
prerequisites: []
related:
  - agent-loop
  - runaway-agent-cost
  - evaluator-optimizer
  - external-signal
  - workflow
sources:
  - '[[sources/ai-agent-workflows/20261105/course/14-react.txt#L395-L434]]'
  - >-
    [[sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt#L35-L66]]
created: 2026-11-06T00:00:00.000Z
updated: '2026-11-06'
---

# Stopping Condition（停止條件）

## 定義

Stopping condition 是讓 agent 迴圈結束的明確規則。它可以是外部硬性上限，例如最大輪數、最大 token 數、成本上限或最長執行時間；也可以是模型自己輸出的完成訊號，例如 ReAct 的 `Final Answer:` 或特殊的 `finish` action。

## 為什麼重要

一旦把「何時繼續」交給模型，人類就無法預先知道迴圈會跑幾次。停止條件是唯一能讓執行次數有上限的機制，也是避免帳單失控、context 無限膨脹與程式卡死的基本護欄。它看起來很基本，卻是最常被跳過的步驟。

## 如何運作

迴圈每一輪結束時檢查條件：模型是否已給出最終答案？輪數是否達到上限？累積 token 或成本是否超過預算？執行時間是否超時？任何一項成立就跳出迴圈。外部上限由程式碼強制執行，不能只依賴模型自我克制；模型訊號則需要程式能正確解析。

## 例子

一個 ReAct agent 設定 `MAX_LOOPS = 5`。模型若在前兩輪就輸出 `Final Answer:`，迴圈提前結束；若五輪後仍未完成，程式丟出錯誤並停止，而不是繼續第六輪。這樣即使模型陷入重試，成本也有上限。

## 邊界與常見誤解

- **上限太緊會截斷任務**：模型可能還在收斂就被迫停止，答案因此不完整。
- **上限太鬆等於沒有保護**：設了一個永遠不會達到的數字，和沒設差不多。
- **關掉視窗不是停止條件**：背景程序可能繼續跑，必須靠程式碼終止。
- **模型說完成不等於真的完成**：最終答案的品質仍需要驗證，停止條件只管迴圈是否結束。

## 進階

停止條件要和其他護欄一起設計：工具錯誤若會觸發重試，重試次數也該有上限；context 若會壓縮，壓縮後仍要保留結束判斷。失控成本的完整脈絡見 [[runaway-agent-cost]]，迴圈結構見 [[agent-loop]]。
