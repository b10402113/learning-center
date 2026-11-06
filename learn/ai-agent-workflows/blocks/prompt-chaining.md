---
id: prompt-chaining
title: Prompt Chaining（提示詞鏈結）
label: Prompt Chaining
subject: ai-agent-workflows
type: concept
status: draft
summary: 把前一次模型呼叫的輸出接成下一次的輸入，步驟順序由程式碼固定。
aliases: []
prerequisites: []
related:
  - workflow
sources:
  - '[[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L1-L51]]'
  - >-
    [[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L144-L178]]
created: 2026-11-06
updated: 2026-11-06
---

# Prompt Chaining（提示詞鏈結）

## 定義

Prompt chaining 是一種 workflow：把任務拆成固定的步驟序列，前一次 LLM 呼叫的輸出直接成為下一次呼叫的輸入。步驟順序、什麼時候停止，全由程式碼決定。

## 為什麼重要

對可乾淨拆解的任務，鏈結通常比一個巨大的 prompt 更準。模型每次只需顧好一個小目標，不必在同一次生成裡同時滿足多個可能衝突的要求；開發者也能在步驟之間插入檢查，及早擋掉壞的中間產物。

## 如何運作

三個要素缺一不可：

1. **固定序列**：步驟與順序寫死在程式碼裡，不能臨時增減。
2. **前後相扣的資料流**：每一次呼叫都把上一次的輸出當成輸入。
3. **步驟之間的關卡**：用純程式碼檢查中間輸出，不合格就中斷。

每個步驟可以有自己的 system prompt，甚至自己的模型；彼此不一定要用同一個模型。

## 例子

職涯諮詢服務可以寫成三次呼叫：第一次依喜好挑出職業並回傳 JSON，第二次依該職業排出培訓路徑，第三次依培訓路徑找資金選項。第二次的輸入就是第一次的輸出，第三次的輸入是第二次的輸出，程式碼只負責依序傳遞與檢查。

## 邊界與常見誤解

- **不是 agent**：模型從頭到尾沒有決定下一步的權力，也不會自行再觸發一次呼叫。
- **不適合低延遲場景**：後一步必須等前一步完成，等待時間會線性疊加。
- **不適合拆不乾淨的任務**：若步驟之間無法獨立驗證，拆開只是把混亂切成好幾段。
- **不是把 prompt 寫長**：鏈結的重點是介面與檢查，不是把同一段文字複製多次。

## 進階

鏈結的兩個主要成本是延遲與失敗傳遞。延遲的取捨見 Latency-Accuracy Tradeoff；把錯誤擋在步驟之間的作法見 Code Gate，而讓 gate 能精確檢查的前提是 Structured JSON Output。任務該怎麼切，則是 Task Decomposition 的問題。
