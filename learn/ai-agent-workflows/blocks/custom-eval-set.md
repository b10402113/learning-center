---
id: custom-eval-set
title: "Custom Eval Set（自建評測集）"
label: "Custom Eval Set"
subject: ai-agent-workflows
type: concept
status: draft
summary: "從手動測試與真實錯誤長出的 20–50 題評測集，每題都能明確判定通過或失敗。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L360-L463]]"
  - "[[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L407-L417]]"
created: 2026-11-06
updated: 2026-11-06
---

# Custom Eval Set（自建評測集）

## 定義

Custom eval set 是一組為自己的產品設計的小型評測題目，通常從 20 到 50 個簡單任務開始。每一題都要能明確判定通過或失敗，而不是靠模糊的整體印象打分。

## 為什麼重要

公開 benchmark 的變因太多，很難對應到你的使用者、工具與流程。真正能幫你選型與除錯的，是從自己手動測試、bug、使用者回饋與 QA 驗收項目長出來的那一組題目。

## 如何運作

建立方式很直接：

1. 收集你平常手動測試的項目、系統出現過的 bug、使用者回報的問題，以及上線前的驗收項目。
2. 把每一題寫成非黑即白的 pass/fail 規準，避免模糊 rubric。
3. 同時測「該發生的行為」與「不該發生的行為」。
4. 讓評測環境盡量貼近正式生產環境，但少加額外設定。

早期開發時，系統每次改動的影響都很明顯，正是累積題目的好時機。先求有，再逐步補齊。

## 例子

一個具備工具呼叫能力的 agent，不只要測「該用工具時有沒有呼叫」，也要測「不該用工具時會不會亂呼叫」。前者測正向行為，後者測反向行為；兩者都過關，才代表工具使用是受控的。

## 邊界與常見誤解

自建 eval 不是把題目丟給模型就好。它需要自己的 harness 與乾淨的環境；模糊的評分規準會產生不穩定的結果。題目也不是訂完就固定，產品一改、模型一換，就要重新檢查。

## 進階

把 eval 當成持續循環：規劃、實驗、驗證，發現盲點就勇敢打掉重來。題目數量不必一開始就很大，重點是每一題都能回答「這次改動到底有沒有讓系統變好」。
