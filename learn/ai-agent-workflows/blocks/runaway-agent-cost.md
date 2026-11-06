---
id: runaway-agent-cost
title: Runaway Agent Cost（失控的代理成本）
label: Runaway Agent Cost
subject: ai-agent-workflows
type: concept
status: draft
summary: 沒有停止條件時，agent 會在背景持續呼叫模型，帳單可能累積到數萬美元。
aliases: []
prerequisites: []
related:
  - stopping-condition
  - agent-loop
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/13-what-is-a-single-agent-system.txt#L67-L77]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Runaway Agent Cost（失控的代理成本）

## 定義

Runaway agent cost 指 agent 的迴圈沒有被正確終止，導致程式在背景持續發出 API 請求、不斷累積 token 與費用。使用者以為關掉視窗就結束了，實際上跑迴圈的程序還活著。

## 為什麼重要

在傳統 workflow 裡，執行次數通常是固定且可預期的；一旦把「何時繼續」的控制權交給模型，執行前就無法回答「這個程式到底會跑幾次」。這個不確定性直接變成財務風險：每一輪都是一次模型呼叫，而使用者可能完全沒有察覺。

## 如何運作

Agent 的迴圈由程式在伺服器或本機背景執行。關閉瀏覽器分頁、蓋上筆電或關掉終端機視窗，都不保證殺掉背後發出請求的程序。只要停止條件沒有觸發，模型就會繼續產生下一步，工具也會繼續被呼叫。成本隨輪數與 context 長度一起上升。

## 例子

實際案例中，有人讓模型在背景持續跑了數週，直到收到數萬美元的帳單才發現。他們以為自己早就關掉了，但只是關掉介面，背後產生 API 請求的迴圈從未真正終止。

## 邊界與常見誤解

- **關掉 UI 不等於停止程式**：背景程序可能繼續跑，必須確認 process 真的結束。
- **這不只是錢的問題**：還會消耗 token 額度、拖慢其他服務，並產生大量無用的軌跡。
- **不是模型太笨**：多數失控來自缺少停止條件，而不是模型判斷錯誤。
- **不是只有長時間任務才會發生**：短任務若卡在重試迴圈，也可能快速累積費用。

## 進階

根本解法是替迴圈加上明確的停止條件：最大輪數、最大 token、成本上限或執行時間。這些條件應該由程式碼強制執行，而不是只寫在提示詞裡。設計方式見 [[stopping-condition]]，迴圈本身見 [[agent-loop]]。
