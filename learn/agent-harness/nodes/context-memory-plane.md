---
id: context-memory-plane
title: "Memory：History、State、Context 三層"
subject: agent-harness
tier: 3
order: 7
status: draft
goal: "分辨 history/state/context，並實作以 token 預算觸發的 compaction。"
prerequisites: []
steps: []
created: 2026-10-24
updated: 2026-10-24
---

# Memory：History、State、Context 三層

## Lesson

History 是發生過的一切，State 是壓縮後的摘要，Context 是本回合真正送進模型的內容。每次呼叫前重新 hydrate，並在超過 token 預算時把最舊的 turns 摺進 summary，長 session 才不會越跑越笨。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
