---
id: rag-pipeline
title: "RAG 管線：從切塊到回答"
subject: grokking-ai
tier: 4
order: 26
status: draft
goal: "講出 ingestion 六階段與請求路徑五階段，並指出品質在哪一步就被決定。"
digests:
  - "34. Introduction RAG & Retrieval.en.md"
  - "36. Chunking and Indexing.en.md"
  - "37. The RAG Pipeline.en.md"
prerequisites:
  - learn/grokking-ai/nodes/embeddings-and-vector-search.md
  - learn/grokking-ai/nodes/llm-at-interview-altitude.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# RAG 管線：從切塊到回答

## Lesson

RAG 存在的理由很具體：模型沒看過你的私有資料、不知道上週改過的事、也分不出誰有權限看哪一份文件。整個設計是兩個串起來的系統——一個在背景把文件變成可以搜尋的索引，一個在使用者等待時把問題變成有引用的答案——而且品質在寫作模型讀到任何東西之前就大半決定了。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
