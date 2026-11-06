---
id: task-decomposition
title: "Task Decomposition（任務拆解）"
label: "Task Decomposition"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把大任務切成有前後相依、且每一步都能獨立驗證的小步驟。"
aliases: []
prerequisites: []
related:
  - prompt-chaining
  - sequence-vs-fork
sources:
  - "[[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L169-L209]]"
created: 2026-11-06
updated: 2026-11-06
---

# Task Decomposition（任務拆解）

## 定義

Task decomposition 是把一個過大的任務切成較小的步驟，使每一步都有明確輸入、明確輸出，而且能單獨判斷對錯。它是 prompt chaining 能不能成立的前提。

## 為什麼重要

一個 prompt 要塞進越多目標，模型越容易顧此失彼。拆開之後，模型每次只面對一個目標，輸出更穩定；開發者也才有位置插入檢查、單獨重跑失敗的那一步，而不是整個流程重來。

## 如何運作

判斷一個任務能不能乾淨拆解，看兩個條件：

1. **前一步的結果決定下一步的素材**：不先拿到第一步的答案，就不知道第二步該查什麼。
2. **每一步都能獨立驗證**：拿到中間輸出時，能用程式碼或明確標準判斷它合不合格。

兩個條件都成立，就適合寫成序列；只要缺少其中一個，拆解就會變成把問題切碎而沒有解決。

## 例子

在正式環境排查問題是典型例子。系統出錯時，通常先撈第一份資料；必須等資料回來、看清數值，才知道這是不是異常的原因、要不要往別的方向追。有了第一份資料的結論，才會決定該看哪一份第二層資料。在拿到第一步結果之前，根本無法跳去查第二步。

## 邊界與常見誤解

- **拆解不等於切成很多小 prompt**：切完仍要能驗證，否則只是把錯誤分散。
- **可平行的工作不是序列拆解**：若多個子任務互不依賴，應該考慮 fan-out，而不是硬排成先後。
- **切太細會付出延遲**：每一步都要等模型回來，過度拆解會讓總等待時間變長。
- **拆解是設計決定，不是模型決定**：在 workflow 裡，切法由開發者固定。

## 進階

拆解完成後，把步驟串起來就是 [[prompt-chaining]]。若任務其實不是「先後相依」而是「多種請求型態各自獨立」，那要解的其實是分岔問題，見 [[sequence-vs-fork]]。
