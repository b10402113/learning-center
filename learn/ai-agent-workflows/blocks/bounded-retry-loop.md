---
id: bounded-retry-loop
title: Bounded Retry Loop（有界重試迴圈）
label: Bounded Retry Loop
subject: ai-agent-workflows
type: procedure
status: draft
summary: 替反思重試設定硬性次數或成本上限，避免迴圈無限執行並在達標時誠實回報失敗。
aliases: []
prerequisites: []
related:
  - reflection
  - self-refine
  - stopping-condition
  - reflexion
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L145-L179]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Bounded Retry Loop（有界重試迴圈）

## 問題

每次反思都是迴圈裡的額外請求，而且每一次都必須帶著 agent 先前累積的完整軌跡。若沒有上限，模型可能反覆「再想一次」而永遠不停，帳單在不知不覺中翻好幾倍。

## 前置條件

需要一個明確的成功判準，例如外部測試、評分函式或 evaluator 的 verdict；也需要一個可執行的上限，例如最大回合數、最大 token 或最大成本。最好再記錄每一輪的結果，方便事後判斷迴圈是否有效。

## 步驟

1. 設定硬性上限，例如最多三到五輪，或明確的成本天花板。
2. 執行一次嘗試並取得評估結果。
3. 若通過判準，立即停止並回傳結果。
4. 若未通過且還有額度，把回饋帶進下一輪重試。
5. 若額度用完仍未通過，回傳目前最好的結果，並明確標記「未通過」，不要假裝成功。

## 例子

一個職涯建議的 evaluator-optimizer 迴圈把 `MAX_ROUNDS` 設為 3，只有 evaluator 回傳 `PASS` 才提早結束；三輪都沒通過就回傳最後一版，並標記 `approved: false`。程式碼而不是模型，負責判斷要不要繼續。

## 失敗模式

- **只靠模型自己喊停**：模型可能過度自信或永遠不滿意。
- **上限設得過高**：名義上有界，實際上仍燒掉大量預算。
- **沒有把失敗誠實回報**：把未通過的草稿當成成功輸出，讓下游誤判。
- **重試不帶回饋**：每輪都從零開始，只是重複同樣的錯誤。

## 進階

上限之外，還要設計「什麼值得重試」。若失敗原因是工具壞掉或輸入缺漏，再多次反思也不會成功，應直接走錯誤處理。把重試與 [[stopping-condition]]、[[reflection]] 的訊號設計一起看，才能讓迴圈既安全又有意義。
