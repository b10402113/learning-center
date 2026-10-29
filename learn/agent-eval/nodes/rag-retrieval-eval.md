---
id: rag-retrieval-eval
title: "RAG retrieval eval: metrics, chunking, reranking"
subject: agent-eval
tier: 4
order: 10
status: draft
goal: "Measure stage-1 recall (Recall@k) and stage-2 ranking (NDCG), and tune chunk size/overlap by grid search."
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# RAG retrieval eval: metrics, chunking, reranking

## Lesson

RAG fails stage by stage, so this node takes the retrieval half deep: two-stage retrieval where stage 1 optimizes recall and reranking optimizes precision, measured with the right metric at each stage. You also treat chunking as a tunable variable and tune it by grid search rather than guesswork.

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
