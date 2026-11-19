---
id: ad-click-prediction
title: "設計廣告點擊預測"
subject: grokking-ai
tier: 3
order: 18
status: draft
goal: "說明 PCTR 為何必須校準，以及延遲轉換與冷啟動怎麼處理。"
digests:
  - "22. Design Ad Click Prediction.en.md"
prerequisites:
  - learn/grokking-ai/nodes/feed-and-search-ranking.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 設計廣告點擊預測

## Lesson

在動態牆裡，分數錯一點只是排到比較差的貼文；在廣告裡，預測的點擊率直接進入競價，決定贏家與價格，所以每一個預測都變成錢。這使得「排序對」不夠——機率本身必須校準，而且誤差會藏在某一個區隔裡。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
