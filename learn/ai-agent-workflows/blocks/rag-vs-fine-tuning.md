---
id: rag-vs-fine-tuning
title: "RAG vs Fine-tuning（檢索增強生成與微調）"
label: "RAG vs Fine-tuning"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "RAG 在查詢當下掛載資料，fine-tuning 在查詢前改模型權重，兩者常一起使用。"
aliases: []
prerequisites: []
related:
  - retrieval-augmented-generation
sources:
  - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L256-L389]]"
created: 2026-11-06
updated: 2026-11-06
---

# RAG vs Fine-tuning（檢索增強生成與微調）

## A 是什麼

RAG（Retrieval-Augmented Generation，檢索增強生成）是在查詢當下運作的機制。系統把外部文件切塊、embed 後存進資料庫；使用者提問時，才檢索相關片段並和問題一起放進 prompt。知識留在外部資料庫，模型權重不變，所以能隨時掛載最新事實。

## B 是什麼

Fine-tuning（微調）是在模型訓練或預訓練之後進行的參數調整。它用特定資料重新訓練模型，改變的是權重本身，適合調整特定風格、專業格式或特殊領域行為。這個修改發生在「查詢之前」，屬於靜態調整。

## 關鍵差異

- **發生時機**：RAG 在 query time 才檢索；fine-tuning 在查詢之前就已完成。
- **改動對象**：RAG 改的是送進 context 的資料；fine-tuning 改的是模型參數。
- **更新成本**：RAG 只要更新資料庫；fine-tuning 需要重新訓練。
- **擅長的事**：RAG 擅長即時、可引用的外部事實；fine-tuning 擅長風格與格式。

## 何時用哪個

需要最新事實、公司內部文件或可追溯來源時，用 RAG。需要模型穩定遵循某種風格、輸出格式或專業慣例時，考慮 fine-tuning。兩者並不衝突：可以先微調出想要的風格與格式，再用 RAG 補上隨時變動的事實，很多團隊就是這樣搭配。

## 進階

多數 agent 開發情境不會天天微調模型，但 RAG 可以隨時掛載新資料，因此是更常用的起點。實作細節見 [[retrieval-augmented-generation]]；控制檢索品質則要一起看 [[reranker]] 與 [[context-budget]]。
