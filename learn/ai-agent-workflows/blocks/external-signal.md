---
id: external-signal
title: "External Signal（外部訊號）"
label: "External Signal"
subject: ai-agent-workflows
type: concept
status: draft
summary: "來自模型之外的客觀回饋，例如測試結果或資料查詢，用來判斷產出是否正確。"
aliases: []
prerequisites: []
related:
  - evaluator-optimizer
  - review-criteria
  - verification-gap
sources:
  - "[[sources/ai-agent-workflows/20261105/course/24-evaluator-optimizer.txt#L121-L168]]"
  - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L317-L351]]"
  - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L1-L7]]"
created: 2026-11-06
updated: 2026-11-06
---

# External Signal（外部訊號）

## 定義

External signal 是模型輸出之外、可被獨立檢查的客觀事實，用來判斷某個產出對不對。典型例子是單元測試通過或失敗、編譯器報錯、資料庫查到的實際數值，或某個 API 回傳的結果。它和「模型自己覺得好不好」相反：訊號不由被評估的模型產生。

## 為什麼重要

Coding agent 之所以可靠，不是因為模型特別會自省，而是因為它依賴測試這個外部訊號：寫程式、跑測試、看到失敗、讀錯誤訊息、修改、再跑。若只讓模型看著自己的文字並問「這樣好不好」，可靠度會低很多，因為模型沒有新的資訊可以修正自己。

## 如何運作

1. 先找出這個任務有沒有可執行的檢查，例如測試、驗證器、查詢。
2. 把這個檢查包成 evaluator 可呼叫的工具。
3. Evaluator 在批評前先跑檢查，用結果決定通過或要求修改。
4. 失敗時把具體錯誤訊息放進回饋，讓 optimizer 知道要修什麼。
5. 重複直到檢查通過或停止條件觸發。

重點是「先找能對照的事實」，而不是把力氣花在寫更華麗的批評提示詞。

## 例子

在職涯審查器裡，reviewer 的其中一條標準是「不能與使用者的不喜歡衝突」。它不憑文字猜測，而是呼叫 `get_work_environment` 查該職涯實際的工作型態，例如野生動物生物學家約有三成時間在桌前寫報告，再拿這個事實對照使用者的偏好。

## 邊界與常見誤解

- **不是所有任務都有現成訊號**：主觀寫作或策略建議很難有單一客觀答案，這時只能退而求其次使用評分標準。
- **訊號本身也可能錯**：測試寫錯、資料過時，會讓 agent 朝著錯誤方向修正。
- **有訊號不等於自動變好**：還要確保 evaluator 真的使用它，而不是讀了卻仍憑感覺。
- **外部訊號通常有成本**：跑測試、查資料、呼叫外部服務都要時間與錢。

## 進階

它是 [[evaluator-optimizer]] 可靠度的來源，也是 [[review-criteria]] 能否落實的關鍵。沒有外部訊號時，多代理容易退化成 [[verification-gap]]。
