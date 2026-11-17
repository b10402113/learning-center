---
id: automated-review-and-retro
title: "automated review 與 retro"
subject: real-engineer
tier: 3
order: 8
status: draft
goal: "能用兩軸 code review 在人工介入前把 PR 拉起來，並用 retro 把每次教訓沉澱成系統規則。"
digests:
  - 040 The _code-review Skill.en.md
  - 041 Testing Out The Code Review Skill.en.md
  - 042 Testing Out The Code Review Skill Solution.en.md
  - 043 Why Retro.en.md
  - 044 Trying Out Retro.en.md
  - 045 Trying Out Retro Solution.en.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/three-kinds-of-review.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# automated review 與 retro

## Lesson

implementer 負責讓它能動，code review 負責讓它變好：清空 context、只讀 diff、同時用 coding standards 與 spec 兩軸審，而且找到問題就自己修掉。最後一層是 retro——不對同一個問題留第二次評論，而是把教訓寫回 standards、AGENTS.md 與自動檢查裡，讓下一次的 agent 一開始就站在更好的環境。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
