---
id: agent-loop
title: Agent Loop（代理迴圈）
label: Agent Loop
subject: ai-agent-workflows
type: concept
status: draft
summary: Agent 是一個反覆行動、觀察、再行動的控制迴圈，直到觸發停止條件為止。
aliases:
  - agent-as-loop
prerequisites: []
related:
  - tool
  - single-agent-system
  - react
  - stopping-condition
sources:
  - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L29-L50]]'
created: 2026-11-06T00:00:00.000Z
updated: '2026-11-06'
---

# Agent Loop（代理迴圈）

## 定義

Agent loop 是 agent 反覆執行的控制迴圈：做一件事、思考並觀察結果、根據結果決定下一步，再重複，直到任務完成或觸發停止條件。

## 為什麼重要

單獨呼叫一次 LLM 只會產生一段文字。真正讓 agent 能完成多步任務的，是它能在同一任務裡一次次行動、取得回饋、修正方向。沒有這個迴圈，就沒有「代理人」可言。

## 如何運作

迴圈的骨架和帶 break 的 `for` 迴圈相同：先做某件事，再思考並觀察結果，然後依結果採取下一步行動，最後重複上述步驟，直到滿足終止條件或任務宣告完成。驅動迴圈、代替模型接觸環境的，就是工具與外面的 harness。

## 例子

agent 想查天氣時先呼叫天氣工具，讀到 observation 後判斷資料夠不夠；不夠就再查另一個來源，夠了就生成回答並結束迴圈。

## 邊界與常見誤解

迴圈不是魔法，也不會無限進行；它需要明確的停止條件，例如最大回合數、token 上限或成本上限。把 agent 說成「很聰明的模型」是誤解，它本質上只是一個有終止條件的迴圈。

## 進階

把停止條件、預算與可觀測性設計好，才能讓迴圈在失敗時安全收斂，而不是持續消耗資源。
