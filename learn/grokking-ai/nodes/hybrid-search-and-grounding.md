---
id: hybrid-search-and-grounding
title: "混合檢索、重排與有據可查的回答"
subject: grokking-ai
tier: 4
order: 27
status: draft
goal: "依查詢形狀選 BM25／向量／RRF，並用四層 grounding 把每個 claim 綁回證據。"
digests:
  - "38. Hybrid Search and Reranking.en.md"
  - "39. Keeping Answers Grounded.en.md"
prerequisites:
  - learn/grokking-ai/nodes/rag-pipeline.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 混合檢索、重排與有據可查的回答

## Lesson

語意搜尋擅長處理換句話說，字面搜尋擅長處理錯誤代碼，兩者失敗的地方剛好互補，所以真實流量要兩條都跑再合併。而即使檢索完全正確，模型仍可能與證據相反、加油添醋或摻入記憶中的事實——所以 grounding 必須在系統裡分層證明，而不是靠一句「請依照文件回答」。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
