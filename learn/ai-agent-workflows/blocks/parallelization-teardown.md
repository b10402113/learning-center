---
id: parallelization-teardown
title: "Parallelization Teardown（拆除平行化）"
label: "Parallelization Teardown"
subject: ai-agent-workflows
type: principle
status: draft
summary: "當多個 agent 的答案已高度一致，冗餘不再帶來價值，就該拆掉平行架構。"
aliases: []
prerequisites: []
related:
  - parallelization
  - aggregator-step
  - model-diversity
sources:
  - "[[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L199-L229]]"
created: 2026-11-06
updated: 2026-11-06
---

# Parallelization Teardown（拆除平行化）

## 主張

如果平行多 agent 系統長期觀察下來，各 agent 的輸出高度一致、極少出現歧見，就應該拆掉這個模式，退回單一 agent。因為此時冗餘已經沒有帶來新的資訊，繼續執行只是在浪費成本。

## 為什麼成立

平行化的可靠性來自分歧與交叉驗證：多個獨立答案互相檢查，才可能抓出彼此的錯誤。當基礎模型變強，對多數任務的答案趨於一致，重複執行多次只會得到同一個結論。花錢跑多個 agent，卻換不到更好的答案，就不符合成本效益。

## 適用範圍

它適用於靠冗餘提升可靠度的平行系統，例如 voting、多模型 PR 審查、多視角分析。判斷依據是長期的輸出比較紀錄，而不是一次性感覺；系統必須持續監控各 agent 之間的一致程度。

## 反例

若任務本身仍高度不確定、需要多個專業視角，或模型之間仍經常出現有意義的分歧，就不該拆。還有一種情況是分歧被錯誤地壓抑：若聚合步驟忽略少數意見，看起來很一致，其實是系統設計抹掉了有價值的警告。

## 進階

拆除前先確認一致性不是假象：檢查 [[aggregator-step]] 是否真的比較了所有輸出，以及 [[model-diversity]] 是否讓 agent 的知識來源足夠不同。若冗餘確實已無價值，較簡單的 [[parallelization]] 替代方案通常就是單一 agent。
