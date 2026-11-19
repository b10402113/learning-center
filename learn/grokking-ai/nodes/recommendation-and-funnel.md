---
id: recommendation-and-funnel
title: "設計推薦系統"
subject: grokking-ai
tier: 3
order: 16
status: draft
goal: "用檢索→排序→規則的漏斗回答推薦題，並講清召回、位置偏差與延遲預算。"
digests:
  - "18. Introduction Classic ML Design Questions.en.md"
  - "19. Design a Recommendation System.en.md"
prerequisites:
  - learn/grokking-ai/nodes/embeddings-and-vector-search.md
  - learn/grokking-ai/nodes/model-serving-and-rollout.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 設計推薦系統

## Lesson

五千萬支影片配兩百毫秒，答案不是更強的模型，而是漏斗：每一層只看更少的東西，因此能對每一件花更多力氣。這個 node 同時建立「排名題」的骨架——候選產生、排序、規則層——以及它帶來的兩個新麻煩：冷啟動與位置偏差。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
