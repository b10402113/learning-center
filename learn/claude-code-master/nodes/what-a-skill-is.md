---
id: what-a-skill-is
title: "Skill 是什麼"
subject: claude-code-master
tier: 2
order: 6
status: written
goal: "解釋 SKILL.md 的 name／description 預載與 body lazy-load，並知道什麼時候該用 `/` 觸發。"
digests:
  - 1-Module_B1_-_Skills_Explained.md
  - robo-skill.md
prerequisites: []
steps:
  - id: skill-is-a-recipe-card
    title: "Skill 是 agent 替你保管的食譜卡"
    purpose: "說出 skill 是一份 Markdown recipe card、放在 workspace 的 .claude，而且 agent 自己就能寫一份。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/1-Module_B1_-_Skills_Explained.en.vtt#L1-L33]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/1-Module_B1_-_Skills_Explained.en.vtt#L34-L87]]"
  - id: preload-description-lazy-load-body
    title: "description 會加進每一次請求，body 等你叫它才載入"
    purpose: "用一份 SKILL.md 解釋 name／description 每次預載、body 只在被叫到才載入，以及這對 token 成本的意思。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/1-Module_B1_-_Skills_Explained.en.vtt#L88-L152]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/1-Module_B1_-_Skills_Explained.en.vtt#L153-L252]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/resources/robo-style/robo-SKILL.md#L1-L11]]"
  - id: three-ways-to-invoke
    title: "其實有好幾種觸發方式"
    purpose: "在直接講名字、打 `/`、讓 Claude 自己選之間挑一種觸發方式，並說出 slash 選單混了什麼。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/1-Module_B1_-_Skills_Explained.en.vtt#L253-L307]]"
  - id: robo-walkthrough-and-break-the-trigger
    title: "/robo：ROBO 視覺風格"
    purpose: "跟著 /robo 看 body 如何被注入，再把 description 拿掉，體驗 skill 不再被觸發。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/1-Module_B1_-_Skills_Explained.en.vtt#L308-L379]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/resources/robo-style/robo-SKILL.md#L1-L11]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/resources/robo-style/robo-SKILL.md#L12-L84]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/1-Module B1 - Skills Explained/resources/robo-style/robo-SKILL.md#L117-L136]]"
created: 2026-10-31
updated: 2026-10-31
---

# Skill 是什麼

## Lesson

Skill 是一張 recipe card：只有 name／description 會預載，body 等被叫到才載入。理解這個成本結構，才知道為什麼 skill 可以很多，但 description 要短。

## Steps

1. [Skill 是 agent 替你保管的食譜卡](what-a-skill-is/skill-is-a-recipe-card.md)
2. [description 會加進每一次請求，body 等你叫它才載入](what-a-skill-is/preload-description-lazy-load-body.md)
3. [其實有好幾種觸發方式](what-a-skill-is/three-ways-to-invoke.md)
4. [/robo：ROBO 視覺風格](what-a-skill-is/robo-walkthrough-and-break-the-trigger.md)
