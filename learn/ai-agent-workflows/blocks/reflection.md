---
id: reflection
title: Reflection（反思）
label: Reflection
subject: ai-agent-workflows
type: concept
status: draft
summary: agent 根據模型外部的失敗訊號，回頭檢視產出並修正下一次嘗試的機制。
aliases: []
prerequisites: []
related:
  - self-refine
  - reflexion
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L91-L113]]
  - >-
    [[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L1-L7]]
created: 2026-11-06
updated: 2026-11-06
---

# Reflection（反思）

## 定義

Reflection 是 agent 在產出或行動之後，根據「事情不對」的訊號回頭檢視，並把檢討帶進下一次嘗試的機制。可靠的 reflection 必須有模型之外的失敗來源：編譯器報錯、測試失敗、API 錯誤碼、空的檢索結果，或人類確認。

## 為什麼重要

Agent 開始執行計畫後，事情通常不會完全照劇本走。沒有反思能力，它遇到非預期變動就會卡死，無法根據環境回饋調整。但反思的價值取決於訊號品質：若只是叫模型「檢查自己的答案」，模型往往在沒有新資訊的情況下把正確答案改錯。

## 如何運作

1. Agent 嘗試一個解法並產生結果或軌跡。
2. 外部檢查判斷是否通過：測試、編譯器、API 狀態、評分函式或使用者條件。
3. 若失敗，agent 用白話寫下「哪裡錯、下次怎麼做」。
4. 這段文字被帶進下一次嘗試，agent 依此調整行為。
5. 重複直到通過或觸發停止條件。

## 例子

Coding agent 寫完程式後跑測試，測試失敗並回傳錯誤訊息。Agent 讀到錯誤，修改程式碼，再跑一次測試；失敗訊號就是它反思的依據。若改成只問模型「你覺得這段程式對嗎」，模型可能沒有足夠資訊發現真正的 bug。

## 邊界與常見誤解

- **不是「加一句請自我檢查」**：沒有外部訊號的自我檢查經常無效，甚至讓表現倒退。
- **模型自己寫的測試也可用，但較不可靠**：反思品質受限於那份測試的品質。
- **反思會花錢**：每次反思都是額外呼叫，且會帶著完整 Trajectory。
- **反思不等於永久學習**：改進只存在當次 context，除非另行保存。

## 進階

把反思拆成「取得訊號」與「寫下檢討」兩件事，會比讓同一個模型包辦更可靠。前者交給 External Signal，後者才是 [[self-refine]] 或 [[reflexion]] 的舞臺。
