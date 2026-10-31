---
id: pruning-glossary-and-adrs
title: "Pruning is an art：修剪 glossary 與 ADR"
subject: real-agent
tier: 1
order: 3
status: draft
goal: "用同一套判準剪掉 glossary 的實作細節與 ADR 的過期決策，並分辨 delete 與 deprecate。"
digests:
  - 007 Pruning the Glossary.en.md
  - 008 Pruning the Glossary Solution.en.md
  - 009 Pruning ADRs.en.md
  - 010 Pruning ADRs Solution.en.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Pruning is an art：修剪 glossary 與 ADR

## Lesson

兩份記錄都會腐化：glossary 長出實作細節與太通用的詞，ADR 累積沒人回頭看的決策。這個 node 用同一個動作——grill 一輪——分別修剪兩份檔案：先從 113 行的膨脹版 glossary 剪回領域詞，再從 11 份 ADR 篩到 8 份。重點是判準，以及什麼時候該刪、什麼時候該用新 ADR 記錄反轉。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
