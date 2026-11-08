---
id: context-engineering
title: "上下文工程"
subject: js-mastery-engineer
tier: 2
order: 4
status: written
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
steps:
  - id: context-engineering-and-three-types
    author: "google/gemini-3.8-flash"
    title: "Context Engineering：在寫 Prompt 之前，先設計 Agent 該知道什麼"
    purpose: "能說明 context engineering 是先設計 agent 該知道什麼，並分清 always-on、on-demand、reference 三種 context。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/018 - What Context Engineering Means.en.txt#L10-L61]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/036 - What Context Engineering Means.txt#L1-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/037 - The Three Types of Context.txt#L9-L103]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/025 - Challenge- Reading a Session That Went Bad.txt#L1-L16]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/025 - Challenge- Reading a Session That Went Bad.txt#L101-L148]]"
  - id: windows-fill-and-context-rot
    author: "google/gemini-3.8-flash"
    title: "為什麼 Context Window 總是被探索塞滿？談 Context Rot 與品質提前下滑"
    purpose: "能解釋視窗為何先被探索塞滿，並用 context rot 與話題切換說明品質為何提前下滑。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/012 - Context Windows and Why They Fill.en.txt#L1-L45]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/017 - Context Windows and Why They Fill.txt#L5-L27]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/018 - Context Rot- Quality Slips Before The Window Fills.txt#L13-L69]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/019 - Topic Switching- When Unrelated Work Pulls Focus.txt#L9-L40]]"
  - id: token-costs-and-code-structure
    author: "google/gemini-3.8-flash"
    title: "讀很貴、想很便宜：如何用命名與結構管好 Agent 的 Token 成本"
    purpose: "能用「讀很貴、想很便宜」估算成本，並說明命名與檔案結構如何左右 agent 的讀取量。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/014 - Tokens- What Costs What.en.txt#L1-L77]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/024 - Tokens- What Costs What.txt#L5-L27]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/023 - Tokens- What Costs What pdf.txt#L42-L169]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/040 - Code Structure That Makes Agents Work Better.txt#L1-L108]]"
  - id: clear-or-compact
    author: "google/gemini-3.8-flash"
    title: "重設對話上下文：該選 Clear 還是 Compact？"
    purpose: "能用下一步是否依賴精確細節，判斷該 clear 還是 compact，並說出兩者各自的代價。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/013 - Clearing vs Compacting.en.txt#L1-L47]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/021 - Clearing vs Compacting.txt#L5-L23]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/020 - Clearing vs Compacting pdf.txt#L1-L58]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/022 - Exercise- Clear or Compact.txt#L1-L160]]"
  - id: always-on-rules-and-agents-md
    author: "google/gemini-3.8-flash"
    title: "掌握 AGENTS.md：用 import 與驗證指令打造小而準的常駐規則"
    purpose: "能寫出小而準的 AGENTS.md，並用 import 與 /context、/memory 驗證它確實被載入。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/019 - CLAUDE md AGENTS md- How They Load.en.txt#L1-L87]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/039 - CLAUDE md AGENTS md- How They Load.txt#L1-L24]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/038 - CLAUDE md AGENTS md- How They Load pdf.txt#L1-L70]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/041 - Challenge- Checkpoint - Make the call.txt#L1-L6]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/041 - Challenge- Checkpoint - Make the call.txt#L159-L222]]"
created: 2026-11-07
updated: 2026-11-07
---

# 上下文工程

## Lesson

上下文是 agent 唯一知道的世界，而它會滿、會腐化、會分心，還會按 token 收費。這一節把 always-on、on-demand、reference 三種 context 分開，並給出 clear／compact 的判準與一份小而準的 AGENTS.md。

## Steps

1. [Context Engineering：在寫 Prompt 之前，先設計 Agent 該知道什麼](context-engineering/context-engineering-and-three-types.md)
2. [為什麼 Context Window 總是被探索塞滿？談 Context Rot 與品質提前下滑](context-engineering/windows-fill-and-context-rot.md)
3. [讀很貴、想很便宜：如何用命名與結構管好 Agent 的 Token 成本](context-engineering/token-costs-and-code-structure.md)
4. [重設對話上下文：該選 Clear 還是 Compact？](context-engineering/clear-or-compact.md)
5. [掌握 AGENTS.md：用 import 與驗證指令打造小而準的常駐規則](context-engineering/always-on-rules-and-agents-md.md)
