---
id: maximal-marginal-relevance
title: "Maximal Marginal Relevance（最大邊際相關性）"
label: "Maximal Marginal Relevance"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用「與查詢的相關性減去與已選文件的相似度」挑出多樣且不重複的片段。"
aliases: []
prerequisites: []
related:
  - reranker
  - compaction
  - context-budget
sources:
  - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L147-L235]]"
  - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L236-L323]]"
created: 2026-11-06
updated: 2026-11-06
---

# Maximal Marginal Relevance（最大邊際相關性）

## 定義

Maximal Marginal Relevance（MMR，最大邊際相關性）是一個 1990 年代就存在的演算法，用來從候選文件中挑出一組「既相關又不彼此重複」的結果。它在評分時同時考慮文件與查詢的相關性，以及文件與已入選內容的相似度。

## 為什麼重要

向量檢索取回的前幾名常常高度重複。例如資料庫裡存了大量互相引用的論文與書籍，檢索 10 份文件時，可能有 5 份在講同一個論點。把這些副本全塞進 context 只是浪費空間，還會排擠其他有用資訊。MMR 用很低的成本移除重複，讓有限視窗容納更多不同觀點。

## 如何運作

MMR 為每個候選文件算一個分數：

- 先看它和查詢有多相關。
- 再減去它和「已經選進來的文件」有多相似。

如果一份文件雖然和問題很相關，但和已選內容太像，整體分數就會被扣低，於是被排除。這個過程重複進行，直到選滿足夠數量或達到 context 上限。

## 例子

研究型 agent 從向量資料庫取回 10 篇論文，其中 5 篇實質內容雷同、彼此引用。MMR 會先留下最相關的一篇，之後每當遇到和它太相似的其他副本就扣分，最後只把真正互補的幾篇放進 context。

## 邊界與常見誤解

- **MMR 不判斷內容對錯**：它只處理相關性與重複度，不檢查片段是否真的能回答問題。
- **權重怎麼調沒有定論**：來源明確說「相關性與多樣性」之間如何平衡至今仍有不同觀點，取決於場景。
- **保留重複不一定是錯**：有時候重複資訊能提供確認冗餘；context 吃緊時才更該清乾淨。
- **它不是新的檢索模型**：MMR 是套用在候選結果上的選擇準則，通常接在檢索之後。

## 進階

MMR 和 [[reranker]] 解決不同問題：re-ranker 問「有沒有用」，MMR 問「是否重複」。兩者都服務於 [[context-budget]]，也常和 [[compaction]] 一起用來對抗 [[lost-in-the-middle]]。
