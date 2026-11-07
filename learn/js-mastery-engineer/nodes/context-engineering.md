---
id: context-engineering
title: "上下文工程"
subject: js-mastery-engineer
tier: 2
order: 4
status: draft
goal: "能區分 always-on／on-demand／reference 三種 context，說明視窗、context rot、token 成本與 clear/compact 判準，並寫出小而準的 AGENTS.md。"
digests:
  - 012 - Context Windows and Why They Fill.en.md
  - 013 - Clearing vs Compacting.en.md
  - 014 - Tokens- What Costs What.en.md
  - 018 - What Context Engineering Means.en.md
  - 019 - CLAUDE md AGENTS md- How They Load.en.md
  - 017 - Context Windows and Why They Fill.md
  - 018 - Context Rot- Quality Slips Before The Window Fills.md
  - 019 - Topic Switching- When Unrelated Work Pulls Focus.md
  - 020 - Clearing vs Compacting pdf.md
  - 021 - Clearing vs Compacting.md
  - 022 - Exercise- Clear or Compact.md
  - 023 - Tokens- What Costs What pdf.md
  - 024 - Tokens- What Costs What.md
  - 025 - Challenge- Reading a Session That Went Bad.md
  - 036 - What Context Engineering Means.md
  - 037 - The Three Types of Context.md
  - 038 - CLAUDE md AGENTS md- How They Load pdf.md
  - 039 - CLAUDE md AGENTS md- How They Load.md
  - 040 - Code Structure That Makes Agents Work Better.md
  - 041 - Challenge- Checkpoint - Make the call.md
prerequisites:
  - learn/js-mastery-engineer/nodes/the-agent-loop.md
steps: []
created: 2026-11-07
updated: 2026-11-07
---

# 上下文工程

## Lesson

上下文是 agent 唯一知道的世界，而它會滿、會腐化、會分心，還會按 token 收費。這一節把 always-on、on-demand、reference 三種 context 分開，並給出 clear／compact 的判準與一份小而準的 AGENTS.md。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
