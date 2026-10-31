---
id: the-agent-loop
title: "The Agent Loop：它看得到什麼、怎麼讀你的 codebase"
subject: agentic-engineer
tier: 1
order: 3
status: draft
goal: "能用 read → decide → act → observe 解釋一次任務，並指出允許它讀什麼、講清楚決定、檢查觀察結果這三個槓桿。"
digests:
  - ch03-how-coding-agents-work.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# The Agent Loop：它看得到什麼、怎麼讀你的 codebase

## Lesson

所有 coding agent 都跑同一個四拍迴圈，差別只在跑了八圈還是八十圈；而每一圈的錯誤都不會被隔離，會往下複合。這個 node 把迴圈、它實際看到什麼、以及它怎麼用 grep / glob / read 摸你的 repo 拆開來看，讓「它應該知道」變成一個可修的 context 缺口。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
