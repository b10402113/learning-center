---
id: review-engineering
title: "Review engineering"
subject: ai-agent-engineer
tier: 4
order: 17
status: written
goal: "用三個問題決定讀多少、先 grill plan、再用 fresh context 的 adversarial tester 審 diff。"
digests:
  - agentic-coding-handbook.4.part.md
  - skills.1.part.md
  - skills.2.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/the-gate.md"
steps:
  - id: review-tax-and-three-questions
    title: "Review Tax：三個問題決定你要讀多少"
    purpose: "用「出錯機率、代價、會不會察覺」三問決定一個 PR 要讀多少，並說出為何審查對象從程式碼變成意圖。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.4.part.txt#L1-L92]]"
  - id: grill-the-plan
    title: "先逼問計畫"
    purpose: "在寫 code 前用 grill-me 逐題逼問計畫、比較 2–3 個方案，並把共識寫成白話驗收準則。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.4.part.txt#L93-L140]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/grill-me/SKILL.md#L1-L23]]"
  - id: adversarial-tester
    title: "對抗式測試者"
    purpose: "用全新 context 的 adversarial-tester 審 diff，給它驗收準則與 AGENTS.md，解讀 PROVED／REASONED 與 merge 判決。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.4.part.txt#L141-L194]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/skills/skills/adversarial-tester/SKILL.md#L1-L120]]"
created: 2026-11-03
updated: 2026-11-04
---

# Review engineering

## Lesson

Agent 寫 code 的速度遠快於人逐行閱讀，所以審查對象要從程式碼改成意圖。三個問題決定閱讀量：做對的事嗎、做對了嗎、你會不會發現。寫 code 前先用 grill-me 逼問決策，寫完再用另一個 context 的 adversarial tester 找捷徑與盲區。

## Steps

1. [Review Tax：三個問題決定你要讀多少](review-engineering/review-tax-and-three-questions.md)
2. [先逼問計畫](review-engineering/grill-the-plan.md)
3. [對抗式測試者](review-engineering/adversarial-tester.md)
