---
id: error-compounding
title: "Error Compounding（錯誤累積）"
label: "Error Compounding"
subject: ai-agent-workflows
type: concept
status: draft
summary: "前一步的錯誤被當成下一步的輸入，於是被放大成更難收拾的結果。"
aliases: []
prerequisites: []
related:
  - code-gate
  - prompt-chaining
  - structured-json-output
sources:
  - "[[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L258-L356]]"
created: 2026-11-06
updated: 2026-11-06
---

# Error Compounding（錯誤累積）

## 定義

Error compounding 是指在多步驟流程中，某一步產生的錯誤被當成下一步的合法輸入，於是錯誤沿著流程往下傳，並且在每一站被再放大一次。

## 為什麼重要

序列流程的品質不是各步平均，而比較像相乘：只要有一站偏差，後面再好的模型也只能在錯的基礎上補救。這讓「每一步看起來都還好」的系統，端到端結果卻可能明顯不可靠。

## 如何運作

錯誤通常以三種方式進場：

1. **格式錯誤**：輸出不是預期的 JSON，或多包了一層說明文字。
2. **內容殘缺**：必要欄位是空的，或只給了部分答案。
3. **語意偏移**：格式正確，但選了錯的類別或錯的方向。

一旦這種輸出被直接串進下一個提示詞，下一步的模型會把它當成事實，於是生成看似合理、實際上建立在錯誤前提上的內容。

## 例子

第一步被要求挑出一個職業，卻只回傳了空的 `career` 欄位。若沒有檢查就傳給第二步，第二步收到的指令會變成「為這個空白的職業規劃學習路徑」。模型不會停下來抗議，而是會補一個聽起來合理的職業，讓錯誤變得更難追溯。

## 邊界與常見誤解

- **不是只有 prompt chaining 會發生**：agent 的多輪迴圈同樣會把早期錯誤帶進後續回合。
- **不是模型不夠強就會發生**：再強的模型也無法修正它沒有察覺的錯誤前提。
- **不是重試就能解決**：在錯誤的輸入上重試，只會得到另一份錯誤。
- **不是所有錯誤都會被放大**：若後一步能獨立驗證並拒絕壞輸入，累積就會停止。

## 進階

最直接的解法是在步驟之間放 [[code-gate]]，讓壞資料在最早的位置停下。要讓 gate 判斷得了，必須先要求 [[structured-json-output]]；若錯誤已經發生，設計上應選擇快速失敗，而不是讓流程帶著傷繼續跑完。
