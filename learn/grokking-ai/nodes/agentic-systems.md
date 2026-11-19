---
id: agentic-systems
title: "代理系統：模型提議、執行環境決定"
subject: grokking-ai
tier: 5
order: 30
status: draft
goal: "分辨 workflow 與 agent，並講清工具契約、記憶分層、預算與 action gate。"
digests:
  - "48. Introduction Agentic Systems.en.md"
  - "49. What an Agent Actually Is.en.md"
  - "50. Tool Use and Function Calling.en.md"
  - "51. Orchestration and Multi-Agent Systems.en.md"
  - "52. Agent Memory and Context.en.md"
prerequisites:
  - learn/grokking-ai/nodes/safety-and-guardrails.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 代理系統：模型提議、執行環境決定

## Lesson

只有一個測試能分辨 workflow 與 agent：誰決定下一步、什麼時候決定。開發者事先寫死順序的是 workflow，模型在執行中自己選的是 agent。一旦模型會選，它就會動手改真實系統，於是設計重心從「答得對不對」變成「它能做什麼、誰檢查、什麼時候停」。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
