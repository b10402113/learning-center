---
id: case-studies-systems
title: "系統設計案例：音樂探索、平台級有害內容、視覺搜尋、法律研究"
subject: grokking-ai
tier: 6
order: 36
status: draft
goal: "對每個案例先做辨識動作，再說明它比已知設計多出來的那一個需求。"
digests:
  - "58. System Design of Spotify-Style Music Discovery.en.md"
  - "59. System Design of Harmful Content at Platform Scale.en.md"
  - "60. System Design of Visual Search for a Marketplace.en.md"
  - "61. System Design of a Legal Research Assistant.en.md"
prerequisites:
  - learn/grokking-ai/nodes/how-to-run-a-case-study.md
  - learn/grokking-ai/nodes/recommendation-and-funnel.md
  - learn/grokking-ai/nodes/feed-and-search-ranking.md
  - learn/grokking-ai/nodes/fraud-detection.md
  - learn/grokking-ai/nodes/harmful-content-detection.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 系統設計案例：音樂探索、平台級有害內容、視覺搜尋、法律研究

## Lesson

這四個案例都是既有設計的變形，所以面試的重點在辨識：先說出它像哪一個已知系統，再說出它多出來的那一個需求。音樂探索是同一條推薦漏斗在批次與線上各用一次；平台級有害內容是詐騙的對手加上曝光率；視覺搜尋把查詢換成一張照片；法律研究把企業 RAG 的風險推到最大。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
