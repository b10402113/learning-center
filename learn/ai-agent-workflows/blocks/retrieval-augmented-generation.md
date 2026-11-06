---
id: retrieval-augmented-generation
title: "Retrieval-Augmented Generation（檢索增強生成）"
label: "Retrieval-Augmented Generation"
subject: ai-agent-workflows
type: concept
status: draft
summary: "在查詢當下從外部資料庫取出相關片段塞進 context，讓模型不必把全部知識放進權重或視窗。"
aliases: []
prerequisites: []
related:
  - chunking
  - embedding
  - vector-similarity
  - reranker
sources:
  - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L1-L15]]"
  - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L16-L94]]"
created: 2026-11-06
updated: 2026-11-06
---

# Retrieval-Augmented Generation（檢索增強生成）

## 定義

Retrieval-Augmented Generation（RAG，檢索增強生成）是一種在查詢當下才把外部資料帶進模型的模式。系統先蒐集文件、切成小塊、轉成向量存進資料庫；使用者提問時，再用同一個 embedding 模型把問題轉成向量，取回最相關的少數片段，連同問題一起放進 prompt。它不是把知識寫進模型權重，而是給 agent 一套不會佔滿 context 的外部記憶。

## 為什麼重要

把大量內部文件或論文全部塞進 context，容量會先爆掉；勉強塞得下也會帶進大量無關雜訊，讓模型更容易幻覺，而且每次呼叫都在燒錢。RAG 只取和當前問題相關的片段，所以能用遠大於 context window 的資料量，同時提高答案的事實依據。當人們說「agent 會查自己的資料」時，通常指的就是 RAG。

## 如何運作

整個流程有六步：

1. ingest：蒐集所有可能相關的文件。
2. chunk：把長文件切成短語或幾句話的片段。
3. embed：用 embedding 模型把每個片段轉成數值向量。
4. store：把向量與對應文本存進向量資料庫。
5. retrieve：把使用者的 query 轉成向量，和資料庫中的向量比對，取出最相關的少數片段。
6. augment：把取回的片段與原始 query 一起包進 prompt，交給 LLM 生成回答。

前四步是事前準備，後兩步在使用者提問時才發生。

## 例子

一個推薦獎學金與就學貸款的職涯產品，不可能把上百所學校、所有獎學金與資格條款都放進 context。改用 RAG 後，系統先將資格文件切塊並 embed 存庫；當使用者說「我是住在德州的第一代軟體工程系學生」，只取回真正吻合條件的 20 個片段。送到模型的 context 只有問題加這 20 段，成本是一次 embedding 呼叫加一次向量查詢。

## 邊界與常見誤解

- **RAG 不是微調**：RAG 在查詢當下掛載資料，不改變模型權重。
- **檢索到的片段不是「模型記得」**：模型只看到被放進 prompt 的文字，檢索系統沒送進去的內容它一無所知。
- **語意相似不等於有幫助**：向量檢索只找文字上接近的片段，不保證能回答問題，所以常需要 [[reranker]]。
- **檢索錯了會更糟**：把錯誤片段當成事實送進 context，模型往往會更自信地答錯，因此仍需評估檢索品質。

## 進階

要讓 RAG 穩定，先把索引端做好：[[chunking]] 決定片段大小，[[embedding]] 決定向量品質，[[vector-similarity]] 決定檢索排序。檢索端則用 re-ranker 與 [[maximal-marginal-relevance]] 控制進入 context 的內容，再回到 [[context-budget]] 一起規劃。
