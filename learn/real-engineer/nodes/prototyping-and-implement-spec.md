---
id: prototyping-and-implement-spec
title: "prototyping、implement spec 與收尾"
subject: real-engineer
tier: 7
order: 17
status: draft
goal: "能把 prototype 接進工廠迭代迴圈、用 orchestrator 跑完整份 spec，並說出每一章如何餵養工廠。"
digests:
  - 099 Prototyping.en.md
  - 100 Prototyping Solution.en.md
  - 101 Implement Spec.en.md
  - 102 Implement Spec Solution.en.md
  - 103 Wrapping Up.en.md
  - Day 1, Morning _ Office Hours.en.md
prerequisites:
  - learn/real-engineer/nodes/spec-to-implement.md
  - learn/real-engineer/nodes/chaining-the-factory.md
  - learn/real-engineer/nodes/choosing-infrastructure.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# prototyping、implement spec 與收尾

## Lesson

工廠出貨功能的最後兩塊：prototype 讓非技術人員用看的就能決定方向，而難的不是生成，是把 ticket 上的留言序列接成迭代迴圈；implement spec 則把整份 spec 的 task graph 攤成 frontier，用一台 runner 一張票的方式平行堆進 integration branch。收尾時回頭看，每一章都在餵養同一條產線——煞車決定你踩油門的勇氣。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
