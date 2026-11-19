---
id: embeddings-and-vector-search
title: "語意表徵與向量檢索"
subject: grokking-ai
tier: 2
order: 11
status: draft
goal: "解釋 embedding、ANN 與向量索引的取捨，並判斷什麼時候根本不該用它們。"
digests:
  - "12. Embeddings and Two-Tower Retrieval.en.md"
  - "35. Embeddings and Vector Databases.en.md"
prerequisites:
  - learn/grokking-ai/nodes/ml-system-planes.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 語意表徵與向量檢索

## Lesson

ID 只是一個名字，兩個相鄰的 ID 不代表相似；embedding 則是把「像不像」變成一個可以算的距離。這個 node 是整個課程唯一完整教 embedding 與向量索引的地方——兩塔怎麼訓練、ANN 為什麼快但近似、索引與文件庫誰才是真相——後面的 RAG 都會回來引用它。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
