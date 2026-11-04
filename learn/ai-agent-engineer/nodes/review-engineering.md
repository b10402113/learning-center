---
id: review-engineering
title: "Review engineering"
subject: ai-agent-engineer
tier: 4
order: 17
status: draft
goal: "用三個問題決定讀多少、先 grill plan、再用 fresh context 的 adversarial tester 審 diff。"
digests:
  - agentic-coding-handbook.4.part.md
  - skills.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/the-gate.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Review engineering

## Lesson

Agent 寫 code 的速度遠快於人逐行閱讀，所以審查對象要從程式碼改成意圖。三個問題決定閱讀量：做對的事嗎、做對了嗎、你會不會發現。寫 code 前先用 grill-me 逼問決策，寫完再用另一個 context 的 adversarial tester 找捷徑與盲區。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
