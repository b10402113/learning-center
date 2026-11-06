---
id: code-gate
title: "Code Gate（程式碼關卡）"
label: "Code Gate"
subject: ai-agent-workflows
type: concept
status: draft
summary: "步驟之間用純程式碼檢查中間輸出，不合格就立刻中斷流程。"
aliases: []
prerequisites: []
related:
  - prompt-chaining
  - structured-json-output
  - error-compounding
  - fallback-gate
sources:
  - "[[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L144-L178]]"
  - "[[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L258-L356]]"
created: 2026-11-06
updated: 2026-11-06
---

# Code Gate（程式碼關卡）

## 定義

Code gate 是放在步驟之間的檢查，由純程式碼執行，不是由 LLM 判斷。它讀取前一步的輸出，確認是否符合預期；不符合就停止或改走安全路徑，不讓壞資料繼續往下傳。

## 為什麼重要

模型輸出本質上不保證格式。一個殘缺的中間結果若直接餵給下一步，後面的模型只會在錯誤的基礎上繼續生成，錯得更多、也花得更多。Gate 讓流程在最早、最便宜的位置失敗。

## 如何運作

常見檢查有三類：

- **有沒有輸入**：使用者什麼都沒提供時，在發出 API 請求前就擋下。
- **形狀對不對**：中間輸出是不是可解析的 JSON、有沒有缺少必要欄位。
- **值合不合法**：例如分類標籤是否落在已知的選項內。

檢查失敗時的行為通常是丟出錯誤並停止鏈，或退回一個預設值。關鍵是：這個判斷不需要模型參與，因此結果是可重現的。

<!-- derived -->

```text
step1 = llm(prompt1, input)
if not step1.career: stop            # code gate
step2 = llm(prompt2, step1.career)
```

## 例子

職涯鏈的第一步被要求只回傳 `{"career": ..., "reason": ...}`。Gate 檢查 `career` 欄位是否存在且非空；若模型把 JSON 包在 Markdown 裡或漏掉欄位，解析就會失敗，流程在此中止，而不是讓第二步去為一個不存在的職業排路徑。同一個位置也能擋下空的初始輸入，避免為沒有內容的請求付費。

## 邊界與常見誤解

- **Gate 不懂語意**：它只能檢查程式碼看得懂的東西，無法判斷答案「好不好」。
- **Gate 不是模型呼叫**：若讓 LLM 當關卡，就失去了確定性，成本也更高。
- **Gate 不能保證後續正確**：它只保證前提成立，不保證推論品質。
- **沒有 gate 的鏈仍然能跑**：只是錯誤會一路傳遞，直到最後才被使用者發現。

## 進階

要讓 gate 好用，先讓模型輸出可被程式解析，見 [[structured-json-output]]。Gate 想解決的失敗模式是 [[error-compounding]]；在 routing 裡對應的版本是 [[fallback-gate]]，負責把不合法的分類標籤導回預設路徑。
