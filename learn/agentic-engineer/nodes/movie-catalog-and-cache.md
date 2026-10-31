---
id: movie-catalog-and-cache
title: "Architect the Movie Catalog and Cache"
subject: agentic-engineer
tier: 5
order: 24
status: draft
goal: "能用「miss 幾乎不發生」推出 ingest job 加 Postgres 當 cache，並用 document 收掉一個 feature。"
digests:
  - ch13-idea-to-first-ship.3.part.md
  - code-reel-agentic-src.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Architect the Movie Catalog and Cache

## Lesson

這是全課最直接對照 vibe 版的一段：同一個「抓 TMDB」的問題，答案取決於一個問題——請求多常 miss？幾乎不 miss，所以所有 TMDB 流量都變成 ingest job，Postgres 就是 cache，抓到的紀錄變成永久的一列而不是有期限的條目。接著 `/document` 只從 commit 與 diff 寫出 PR，一條 feature 就結束了。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
