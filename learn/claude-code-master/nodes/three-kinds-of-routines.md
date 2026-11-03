---
id: three-kinds-of-routines
title: "排程的三種做法"
subject: claude-code-master
tier: 4
order: 11
status: written
goal: "分辨 local／cloud／24-7 routine，並把一條 routine 從 draft 跑到排程。"
digests:
  - 1-Module_D1_-_Intro_to_Routines.md
  - 2-Module_D2_-_Local_Routines.md
  - 3-Module_D3_-_Cloud_Routines.md
  - 4-Tip_-_Model_use_to_save_tokens.md
  - 7-The_Hermes_Agent_Masterclass.md
prerequisites: []
steps:
  - id: routine-is-a-prompt-to-itself
    title: "Routines：Claude Code 在你不在的時候也自己跑"
    purpose: "能說明 routine 是 Claude 對自己發的排程 prompt，並講出它為什麼排在 skills 與 memory 之後。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/1-Module D1 - Intro to Routines/1-Module_D1_-_Intro_to_Routines.en.vtt#L1-L46]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/1-Module D1 - Intro to Routines/1-Module_D1_-_Intro_to_Routines.en.vtt#L47-L94]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/1-Module D1 - Intro to Routines/1-Module_D1_-_Intro_to_Routines.en.vtt#L95-L157]]"
  - id: local-routine-end-to-end
    title: "local routine 就是它傳給自己的一段 prompt"
    purpose: "能把一條 local routine 從 prompt、試跑、排程一路建起來，並知道它只在你電腦醒著時跑。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/2-Module D2 - Local Routines/2-Module_D2_-_Local_Routines.en.vtt#L1-L100]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/2-Module D2 - Local Routines/2-Module_D2_-_Local_Routines.en.vtt#L101-L250]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/2-Module D2 - Local Routines/2-Module_D2_-_Local_Routines.en.vtt#L251-L385]]"
  - id: cloud-routine-and-github-skills
    title: "Cloud routine：電腦關了也照跑，但你的 skill 不在那台機器上"
    purpose: "能分辨 cloud 與 local routine 的差別，並用 GitHub repo 與 connector 讓雲端跑得到本機 skill。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/3-Module D3 - Cloud Routines/3-Module_D3_-_Cloud_Routines.en.vtt#L1-L100]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/3-Module D3 - Cloud Routines/3-Module_D3_-_Cloud_Routines.en.vtt#L101-L200]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/3-Module D3 - Cloud Routines/3-Module_D3_-_Cloud_Routines.en.vtt#L201-L325]]"
  - id: cheaper-model-per-routine
    title: "把排程任務的模型從 Opus 換成 Haiku"
    purpose: "能把 routine 的模型從預設的 Opus 改成 Haiku，讓重複排程不要提早燒完額度。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/4-Tip - Model use to save tokens/4-Tip_-_Model_use_to_save_tokens.en.vtt#L1-L27]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/4-Tip - Model use to save tokens/4-Tip_-_Model_use_to_save_tokens.en.vtt#L28-L53]]"
  - id: hermes-agent-for-24-7
    title: "Hermes Agent 大師課"
    purpose: "能說明 Hermes 為什麼能 24/7 跑 routine，並講出 VPS、Telegram 與同步 skill 三個條件。"
    sources:
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/7-🎁 The Hermes Agent Masterclass/7-🎁_The_Hermes_Agent_Masterclass.en.vtt#L1-L42]]"
      - "[[sources/claude-code-master/20261031/5-Volume D - Routines/7-🎁 The Hermes Agent Masterclass/7-🎁_The_Hermes_Agent_Masterclass.en.vtt#L43-L85]]"
created: 2026-10-31
updated: 2026-11-02
---

# 排程的三種做法

## Lesson

Routine 就是 Claude 對自己發的排程 prompt；local 靠開機、cloud 靠 Anthropic 的容器、Hermes 靠一台 VPS。先跑通一條，再談優化。

## Steps

1. [Routines：Claude Code 在你不在的時候也自己跑](three-kinds-of-routines/routine-is-a-prompt-to-itself.md)
2. [local routine 就是它傳給自己的一段 prompt](three-kinds-of-routines/local-routine-end-to-end.md)
3. [Cloud routine：電腦關了也照跑，但你的 skill 不在那台機器上](three-kinds-of-routines/cloud-routine-and-github-skills.md)
4. [把排程任務的模型從 Opus 換成 Haiku](three-kinds-of-routines/cheaper-model-per-routine.md)
5. [Hermes Agent 大師課](three-kinds-of-routines/hermes-agent-for-24-7.md)
