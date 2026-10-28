---
id: stop-retyping-prompts
title: "怎麼不再重打同一個 prompt"
subject: claude-code-master
tier: 3
order: 5
status: written
goal: "能寫出第一個 skill，並用「兩次法則」把重複的 prompt 或一整段 session 存成可重用的 skill。"
prerequisites: []
steps:
  - id: skill-is-a-recipe-card
    title: "skill 只是一張食譜卡：為什麼幾乎不佔 context"
    purpose: "能說出 skill 為什麼只是一張 markdown 食譜卡，以及為什麼只預載名字與觸發條件讓它幾乎不佔 context。"
    sources:
      - "[[sources/claude-code-master/20261028/3-Volume B - Skills/1-Module B1 - Skills Explained/index.html#L94-L97]]"
  - id: two-times-rule
    title: "兩次法則：打過兩次就存成 skill"
    purpose: "能用「兩次法則」判斷何時該把重複的 prompt 存成 skill，並說出怎麼用一句話叫出它。"
    sources:
      - "[[sources/claude-code-master/20261028/3-Volume B - Skills/2-Module B2 - Creating Good Skills/index.html#L94-L97]]"
  - id: save-a-session-as-a-skill
    title: "把一整段做完的 session 存成一張食譜"
    purpose: "能把一整段做完的 session 直接存成一張 skill 食譜，並講出它替你省下的重打功夫。"
    sources:
      - "[[sources/claude-code-master/20261028/3-Volume B - Skills/2-Module B2 - Creating Good Skills/index.html#L94-L97]]"
created: 2026-10-28
updated: 2026-10-28
---

# 怎麼不再重打同一個 prompt

## Lesson

skill 本質上只是一張 markdown 食譜卡：上面寫描述、下面寫步驟，平常只預載名字與觸發條件，所以再多也不占多少 context。這一課用「兩次法則」——同一個東西打過兩次就存成 skill——帶你寫出第一個 skill，並教你最自然的做法：把一整段做好的 session 直接存成一張食譜。

## Steps

1. [skill 只是一張食譜卡：為什麼幾乎不佔 context](stop-retyping-prompts/skill-is-a-recipe-card.md)
2. [兩次法則：打過兩次就存成 skill](stop-retyping-prompts/two-times-rule.md)
3. [把一整段做完的 session 存成一張食譜](stop-retyping-prompts/save-a-session-as-a-skill.md)
