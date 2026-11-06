---
id: review-criteria
title: "Review Criteria（審查標準）"
label: "Review Criteria"
subject: ai-agent-workflows
type: concept
status: draft
summary: "評估者用來判斷草稿好壞的明確檢查清單；標準越模糊，回饋就越沒有用。"
aliases: []
prerequisites: []
related:
  - evaluator-optimizer
  - external-signal
  - verification-gap
sources:
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerEvaluatorOptimizerMultiAgent.js#L162-L261]]"
created: 2026-11-06
updated: 2026-11-06
---

# Review Criteria（審查標準）

## 定義

Review criteria 是評估者在檢查產出時依據的明確條件清單。它把「這樣夠好嗎」拆成幾個可逐項判斷的問題，並規定通過與否的輸出格式。標準寫得越具體，回饋越能直接指導下一輪修改。

## 為什麼重要

沒有標準的審查很容易變成「我覺得還不錯」或「再具體一點」這類空泛評語，生成者無法據此修正，迴圈只會耗費成本。明確的標準讓評估有共同依據，也讓通過與否可以被程式碼穩定判讀。

## 如何運作

1. 從使用者需求與任務目標提煉出少數關鍵條件。
2. 把每條條件寫成可回答「是／否」或可查證的句子。
3. 規定評估者必須先給出判定（例如 `PASS` 或 `NEEDS_IMPROVEMENT`），再給理由。
4. 若判定不通過，要求它指出「具體要改什麼」，而不是只說「不夠好」。
5. 能用工具查證的條件，要求評估者實際查證，不要憑印象。

## 例子

職涯建議的審查器有三條標準：

1. 至少符合使用者的一項喜好。
2. 不與使用者的任何不喜歡衝突；這一條要用工具查證，不能猜。
3. 包含可實現的路徑：學校、證照、經驗與時間表。

評估者的 Final Answer 必須以 `PASS` 或 `NEEDS_IMPROVEMENT` 開頭，後接冒號與回饋；若不通過，回饋必須說清楚要修什麼。

## 邊界與常見誤解

- **標準不是越多越好**：太多條件會讓評估變得僵硬，也可能互相衝突。
- **模糊標準會產生模糊回饋**：例如「要有說服力」無法指導修改；要換成可觀察的特徵。
- **標準由人設計**：模型不會自動知道什麼叫好；這一步仍是開發者的責任。
- **有標準仍可能漏看**：清單只涵蓋你想到的問題，沒列進去的缺陷不會被檢查。

## 進階

標準若能用 [[external-signal]] 查證，可靠度會大幅提升。整體迴圈見 [[evaluator-optimizer]]；缺乏查核的結構性風險見 [[verification-gap]]。
