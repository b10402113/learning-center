---
id: automated-review-and-retro
title: "automated review 與 retro"
subject: real-engineer
tier: 3
order: 8
status: written
goal: "能用兩軸 code review 在人工介入前把 PR 拉起來，並用 retro 把每次教訓沉澱成系統規則。"
digests:
  - 040 The _code-review Skill.en.md
  - 041 Testing Out The Code Review Skill.en.md
  - 042 Testing Out The Code Review Skill Solution.en.md
  - 043 Why Retro.en.md
  - 044 Trying Out Retro.en.md
  - 045 Trying Out Retro Solution.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/three-kinds-of-review.md
steps:
  - id: review-in-a-fresh-context
    author: "google/gemini-3.8-flash"
    title: "讓實作與審查分工：為什麼程式碼品質該交給獨立的 Code Review 補齊"
    purpose: "能說明為何要在新 context 只審 diff 的 code review 補品質，而不是要求 implement 一次做對。"
    sources:
      - "[[sources/real-engineer/20261116/course/040 The _code-review Skill.en.txt#L1-L39]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/CODING_STANDARDS.md#L1-L25]]"
  - id: two-axis-review-and-fix
    author: "google/gemini-3.8-flash"
    title: "雙軸審查：讓 Agent 比對規範與規格並直接修復 PR"
    purpose: "能用 standards 與 spec 兩軸並行審查一個 PR，並把抓到的問題直接修掉再交回人類。"
    sources:
      - "[[sources/real-engineer/20261116/course/041 Testing Out The Code Review Skill.en.txt#L1-L33]]"
      - "[[sources/real-engineer/20261116/course/042 Testing Out The Code Review Skill Solution.en.txt#L1-L89]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/CODING_STANDARDS.md#L1-L25]]"
  - id: retro-and-the-system
    author: "google/gemini-3.8-flash"
    title: "為什麼需要 Retro：把人類審查變成 Agent 環境的升級機制"
    purpose: "能說明 retro 為何存在，並用 cherry-pick 裝好 skill、知道它會掃 standards、AGENTS.md 與 tool economy。"
    sources:
      - "[[sources/real-engineer/20261116/course/043 Why Retro.en.txt#L1-L53]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/AGENTS.md#L1-L19]]"
  - id: run-retro-and-sediment-rules
    author: "google/gemini-3.8-flash"
    title: "用 Retro 將人工審查沉澱為編碼規範"
    purpose: "能對一組 session 跑 retro、讀懂報告裡的判斷題，並只採納要沉澱成規則的那幾條。"
    sources:
      - "[[sources/real-engineer/20261116/course/044 Trying Out Retro.en.txt#L1-L27]]"
      - "[[sources/real-engineer/20261116/course/045 Trying Out Retro Solution.en.txt#L1-L113]]"
created: 2026-11-16
updated: 2026-11-17
---

# automated review 與 retro

## Lesson

implementer 負責讓它能動，code review 負責讓它變好：清空 context、只讀 diff、同時用 coding standards 與 spec 兩軸審，而且找到問題就自己修掉。最後一層是 retro——不對同一個問題留第二次評論，而是把教訓寫回 standards、AGENTS.md 與自動檢查裡，讓下一次的 agent 一開始就站在更好的環境。

## Steps

1. [讓實作與審查分工：為什麼程式碼品質該交給獨立的 Code Review 補齊](automated-review-and-retro/review-in-a-fresh-context.md)
2. [雙軸審查：讓 Agent 比對規範與規格並直接修復 PR](automated-review-and-retro/two-axis-review-and-fix.md)
3. [為什麼需要 Retro：把人類審查變成 Agent 環境的升級機制](automated-review-and-retro/retro-and-the-system.md)
4. [用 Retro 將人工審查沉澱為編碼規範](automated-review-and-retro/run-retro-and-sediment-rules.md)
