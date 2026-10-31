---
id: the-code-review-skill
title: "The /code-review Skill：在人的前面先審一次"
subject: real-agent
tier: 5
order: 15
status: draft
goal: "用 CODING_STANDARDS.md 與 spec 跑 sub-agent review，並判斷哪些 finding 要修、哪些是判斷題。"
digests:
  - 033 The _code-review Skill.en.md
  - 034 Testing Out The Code Review Skill.en.md
  - 035 Testing Out The Code Review Skill Solution.en.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# The /code-review Skill：在人的前面先審一次

## Lesson

人的注意力應該花在自動 review 判不了的地方。這個 node 把 review 放進一個全新 context 的 sub-agent，餵它 CODING_STANDARDS.md 與寫在 issue 裡的 spec，看它怎麼同時報 standards 違規與 spec 缺口，以及哪些 finding 該直接修、哪些要留給人判斷。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
