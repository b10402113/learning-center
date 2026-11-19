---
id: feed-and-search-ranking
title: "設計動態牆與搜尋排序"
subject: grokking-ai
tier: 3
order: 17
status: draft
goal: "說出多目標價值公式怎麼組，以及「多了一個 query」改變了檢索與排序的哪些部分。"
digests:
  - "20. Design Feed Ranking.en.md"
  - "21. Design Search Ranking.en.md"
prerequisites:
  - learn/grokking-ai/nodes/recommendation-and-funnel.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 設計動態牆與搜尋排序

## Lesson

這兩個設計都建立在推薦漏斗上，但各只加一個需求。動態牆加的是「好有很多種」：一次要滿足按讚、留言、不隱藏、值得花時間，所以需要多任務模型加上一個由產品團隊設定的價值公式。搜尋加的是「使用者自己打了查詢」，於是多了查詢理解，也多了字面與語意兩條檢索必須並行。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
