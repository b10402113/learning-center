---
id: promptfoo-red-team
title: "用 Promptfoo 做 red-team 掃描"
subject: ai-eval
tier: 3
order: 10
status: draft
goal: "能跑一次 baseline scan、讀 failing traces，並用 frequency×severity 排出要修的風險。"
digests:
  - lesson5.en.md
  - AI_Evals_Week3_Deck.md
prerequisites:
  - learn/ai-eval/nodes/attack-surface-and-threats.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 用 Promptfoo 做 red-team 掃描

## Lesson

掃描的順序是 baseline → 讀 failing traces → 自己補領域攻擊 → 部署時重跑，而不是只看 summary 數字。這條節點用 Promptfoo 跑 injection、prompt extraction、PII 等 plugin，再把結果做成 frequency × severity 矩陣，決定先修哪五個風險。掃描器抓不到的、這個 agent 才能做的事，必須自己寫。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
