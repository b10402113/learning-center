---
id: advanced-and-safe-skills
title: "進階 skill 與安全安裝"
subject: claude-code-master
tier: 2
order: 8
status: written
goal: "判斷 skill 何時該長出 scripts／references、如何審查社群 skill、以及用 `/context` 抓數量上限。"
digests:
  - 3-Module_B3_-_Advanced_Skills.md
  - 4-Module_B4_-_Installing_Skills_Safely.md
  - 5-Module_B5_-_How_many_Skills_is_too_many-.md
prerequisites: []
steps:
  - id: skills-grow-beyond-one-file
    title: "Skill 其實不只是一份 markdown 檔"
    purpose: "判斷一個 skill 什麼時候該從單一 SKILL.md 長出 scripts、references 或 HTML 範本。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt#L1-L33]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt#L34-L87]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt#L88-L149]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt#L150-L199]]"
  - id: skills-call-other-skills
    title: "Step Zero：讓 skill 先叫用另一個 skill"
    purpose: "在 SKILL.md 裡加一段 step zero，讓一個 skill 每次先叫用另一個 skill。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt#L200-L240]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt#L241-L301]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/3-Module B3 - Advanced Skills/3-Module_B3_-_Advanced_Skills.en.vtt#L302-L334]]"
  - id: vet-before-install
    title: "確認這個 repo 乾不乾淨，再告訴我怎麼裝最合適"
    purpose: "用審查型 prompt 讓 Claude 先判斷 GitHub 上的 skill 乾不乾淨，再決定怎麼裝。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/4-Module B4 - Installing Skills Safely/4-Module_B4_-_Installing_Skills_Safely.en.vtt#L1-L37]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/4-Module B4 - Installing Skills Safely/4-Module_B4_-_Installing_Skills_Safely.en.vtt#L38-L85]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/4-Module B4 - Installing Skills Safely/4-Module_B4_-_Installing_Skills_Safely.en.vtt#L86-L133]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/4-Module B4 - Installing Skills Safely/4-Module_B4_-_Installing_Skills_Safely.en.vtt#L134-L175]]"
  - id: measure-skill-ceiling
    title: "多少 skill 才算太多？"
    purpose: "用 `/context` 與 `/usage` 量出 skill 預載成本，判斷該合併、砍掉還是留著。"
    sources:
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/5-Module_B5_-_How_many_Skills_is_too_many-.en.vtt#L1-L51]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/5-Module_B5_-_How_many_Skills_is_too_many-.en.vtt#L52-L85]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/5-Module_B5_-_How_many_Skills_is_too_many-.en.vtt#L86-L129]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/5-Module_B5_-_How_many_Skills_is_too_many-.en.vtt#L130-L164]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/5-Module_B5_-_How_many_Skills_is_too_many-.en.vtt#L165-L263]]"
      - "[[sources/claude-code-master/20261031/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/5-Module_B5_-_How_many_Skills_is_too_many-.en.vtt#L264-L289]]"
created: 2026-10-31
updated: 2026-10-31
---

# 進階 skill 與安全安裝

## Lesson

Skill 會從一個 Markdown 檔長出 scripts、references 與 HTML 範本；也會從 GitHub 進來，所以安裝前的審查與數量控管同樣重要。

## Steps

1. [Skill 其實不只是一份 markdown 檔](advanced-and-safe-skills/skills-grow-beyond-one-file.md)
2. [Step Zero：讓 skill 先叫用另一個 skill](advanced-and-safe-skills/skills-call-other-skills.md)
3. [確認這個 repo 乾不乾淨，再告訴我怎麼裝最合適](advanced-and-safe-skills/vet-before-install.md)
4. [多少 skill 才算太多？](advanced-and-safe-skills/measure-skill-ceiling.md)
