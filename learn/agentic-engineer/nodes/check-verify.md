---
id: check-verify
title: "Demo: Running check verify"
subject: agentic-engineer
tier: 3
order: 17
status: draft
goal: "能讀一份 `verify.md`，把每條 AC 判成 met / missing / not-applied / blocked 並附上證據。"
digests:
  - ch09-prove-it-runs.md
  - code-jsm-skills-system.md
  - code-reel-agentic-skills.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Demo: Running check verify

## Lesson

`/check verify` 不是「build 過了、測試綠了」就算，而是把 app 真的跑起來，對著活的資料庫用請求、SQL 與 MCP 逐條證明 AC。它的產出是一份帶證據的 PASS/FAIL，四種結果裡只有一種叫過，其餘都會指向下一步該退回哪個 skill。收尾的 `/test` 再把一次性的證明變成長期保護。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
