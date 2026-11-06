---
id: fail-early
title: "Fail Early（及早報錯）"
label: "Fail Early"
subject: ai-agent-workflows
type: principle
status: draft
summary: "重試次數用盡仍未通過時，寧可回傳錯誤，也不要送出半生不熟的答案。"
aliases: []
prerequisites: []
related:
  - wrap-up-and-log
  - fallback-gate
sources:
  - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L106-L132]]"
  - "[[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L151-L174]]"
created: 2026-11-06
updated: 2026-11-06
---

# Fail Early（及早報錯）

## 主張

Fail early 是一條收尾原則：當工作流設有迴圈上限或超時機制，而系統在還沒產出滿意答案前就觸發終止條件時，直接回傳明確的錯誤訊息，而不是把當下不完整的內容硬凑給使用者。

## 為什麼成立

LLM 流程出錯通常只是偶發的軌跡偏差（trajectory went off base），重新執行一次往往就能解決。把模型半生不熟、甚至開始發散的內容包裝成答案，會讓使用者收到一份看似正常卻不可信的結果；錯誤畫面則會被使用者理解為暫時故障，通常願意重試。

換句話說，壞答案傷害的是對產品的信任，錯誤訊息傷害的只是一次操作。

## 適用範圍

- evaluator 在重試上限內始終沒有回傳通過。
- orchestrator 在時限內沒有回應。
- 模型輸出不符合預期的 schema。
- 任何在步驟之間設有 gate、能明確判斷「這次壞了」的固定流程。

在這些情境裡，程式碼都能在呼叫邊界捕捉錯誤，這正是 workflow 相對 agent 的優勢：錯誤點是可預期的。

## 反例

如果任務是探索性的，使用者要的正是「目前為止最好的猜測」，直接報錯反而剝奪了有價值的部分結果。此時應改用倒數收尾，把已知內容整理成摘要，見 [[wrap-up-and-log]]。

另一個反例是錯誤其實可自動降級：例如主要模型逾時但有較小的備援模型，先降級再回錯會比直接失敗更好。

## 進階

Fail early 通常與 gate 一起設計：每一個呼叫邊界都檢查回應是否存在、是否符合格式。這種「每個呼叫都放 gate」的做法，讓錯誤在擴散前被擋下；詳見 [[fallback-gate]]。
