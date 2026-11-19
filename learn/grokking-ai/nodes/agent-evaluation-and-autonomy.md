---
id: agent-evaluation-and-autonomy
title: "評估與控制代理"
subject: grokking-ai
tier: 5
order: 31
status: draft
goal: "以 trajectory 為評估單位，並用自治階梯與常駐控制讓代理「用證據換自由」。"
digests:
  - "53. Evaluating Agent Trajectories.en.md"
  - "54. Evaluating and Controlling Agents.en.md"
prerequisites:
  - learn/grokking-ai/nodes/agentic-systems.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 評估與控制代理

## Lesson

兩次執行都退款三元，一次四步、一次十九步還重試三次，只看最終答案它們同分，但成本差好幾倍。所以代理的評估單位是 trajectory 而不是輸出，要同時評分目的地與路線。評估完之後還有第二個問題：它能自己做多少、由誰准許——答案是一階一階用證據換來的。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
