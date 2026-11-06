---
id: aggregator-step
title: "Aggregator Step（聚合步驟）"
label: "Aggregator Step"
subject: ai-agent-workflows
type: concept
status: draft
summary: "平行 fan-out 之後，把多個 agent 的輸出合成單一回應的合併步驟。"
aliases: []
prerequisites: []
related:
  - parallelization
  - voting
  - model-diversity
sources:
  - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L52-L84]]"
  - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L172-L198]]"
created: 2026-11-06
updated: 2026-11-06
---

# Aggregator Step（聚合步驟）

## 定義

Aggregator step 是平行架構最後的合併步驟：它讀取多個平行 agent 的輸出，比較、投票或統整成一份最終答案。它可能是一個 agent、一次 LLM 呼叫，也可能只是一段確定性程式碼。

## 為什麼重要

沒有它，平行 agent 只會留下一堆彼此獨立、甚至互相矛盾的答案。聚合步驟負責把冗餘轉成共識，讓可靠性真的上升。但它同時是整個系統的單點故障：前面派再多 agent，最後一步判斷錯，結果仍然錯。

## 如何運作

平行分支完成後，所有結果被寫進共享 state 的不同欄位。聚合步驟一次讀取全部輸出，再依任務性質處理：若是投票，就比對答案並計票；若是多面向分析，就權衡各份報告後產生結論。實作上可選能力較強的模型，或改用程式碼比對以避開 LLM 幻覺。

## 例子

職涯系統同時產生興趣、工作型態、就業市場三份報告，聚合 agent 讀完三者後選出一個職業並說明理由。若只是要在多個候選答案中計票，直接用程式碼統計出現次數，比再呼叫一次 LLM 更可靠。

## 邊界與常見誤解

- **不一定非用 LLM**：能寫成確定性程式碼的比較與計票，就不必交給模型。
- **不是被動彙整**：它必須能處理衝突、缺漏與格式不一致的輸入。
- **不是可靠度的保證**：它自己就是單點故障，出錯會抵銷前面的冗餘。

## 進階

聚合的品質取決於輸入多樣性；若所有 agent 都用同一家族模型，可考慮 [[model-diversity]]。它也是 [[parallelization]] 與 [[voting]] 能夠成立的關鍵收尾步驟。
