---
id: sequence-vs-fork
title: "Sequence vs Fork（序列與分岔）"
label: "Sequence vs Fork"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "序列讓每一步接續前一步，分岔則在起點選一條路走完，兩者控制流不同。"
aliases: []
prerequisites: []
related:
  - routing
  - prompt-chaining
  - task-decomposition
sources:
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L4-L31]]"
created: 2026-11-06
updated: 2026-11-06
---

# Sequence vs Fork（序列與分岔）

## A 是什麼

Sequence（序列）是前後相依的流程：先完成第一步，再把它的輸出交給第二步，依此類推。每一步都需要前一步的結果才能開始，整條路徑一定會被走完。Prompt chaining 是典型的序列。

## B 是什麼

Fork（分岔，也就是 routing）是在起點先做一次分類，然後只挑選其中一條控制流走完。它不會先執行路徑 A，再接著執行路徑 B；一次請求只走一條路。

## 關鍵差異

- **執行幾條路徑**：序列會依序跑完所有步驟；分岔只跑被選中的那一條。
- **相依性**：序列的後步依賴前步的輸出；分岔的各條路徑彼此獨立，不需要等別條路完成。
- **失敗的影響範圍**：序列中任一錯誤會往下傳；分岔中一條路徑出錯，不影響其他路徑。
- **分類的位置**：序列通常不需要入口分類；分岔的第一個動作就是分類。

## 何時用哪個

當任務可以乾淨拆解、且後一步真的需要前一步的結果時，用序列。當請求有幾種互斥的型態、每種需要不同處理時，用分岔。

兩者可以組合：先分岔到一條專屬路徑，該路徑內部再跑一小段序列；或在產出最終回應後，讓流程回到起點展開下一輪互動。但就 routing 本身而言，它仍然是一次性的單選分流。

## 進階

分岔的實作需要 [[routing]] 的三個元件：分類器、fallback gate 與 route table。要判斷手上的任務該不該拆成序列，回到 [[task-decomposition]] 的兩個條件；拆好之後的串接方式見 [[prompt-chaining]]。
