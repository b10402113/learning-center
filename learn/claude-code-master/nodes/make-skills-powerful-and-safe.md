---
id: make-skills-powerful-and-safe
title: "怎麼讓 skill 又強又安全"
subject: claude-code-master
tier: 3
order: 6
status: written
goal: "能做出帶腳本／素材、會互相呼叫的進階 skill，並在安裝外部 skill 前先檢查惡意碼、判斷何時該整併。"
digests:
  - volume-b-skills.md
prerequisites: []
steps:
  - id: skills-with-scripts-and-nesting
    title: "讓 skill 帶腳本、素材，並互相呼叫"
    purpose: "能讓一個 skill 帶自己的腳本／參考檔／素材，並用一個 skill 呼叫另一個 skill 串起流程。"
    sources:
      - "[[sources/claude-code-master/20261028/3-Volume B - Skills/3-Module B3 - Advanced Skills/index.html#L94-L97]]"
  - id: install-skills-safely
    title: "安裝外部 skill 前先檢查惡意碼"
    purpose: "能在安裝 GitHub／網路 skill 前跑檢查是否乾淨的 prompt，並知道何時該切到最強模型把關。"
    sources:
      - "[[sources/claude-code-master/20261028/3-Volume B - Skills/4-Module B4 - Installing Skills Safely/index.html#L94-L97]]"
  - id: how-many-skills-and-audit
    title: "多少 skill 才太多：用一次 audit 整併"
    purpose: "能判斷 skill 何時算太多，並用一次 audit prompt 合併／刪減 library、用 context 指令看 token 成本。"
    sources:
      - "[[sources/claude-code-master/20261028/3-Volume B - Skills/5-Module B5 - How many Skills is too many-/index.html#L94-L97]]"
created: 2026-10-28
updated: 2026-10-28
---

# 怎麼讓 skill 又強又安全

## Lesson

skill 不只可以是一段 markdown——它能帶自己的腳本、參考檔與素材，甚至一個 skill 呼叫另一個 skill。能力變強也帶來風險：安裝網路上的 skill 前要先跑「檢查是否乾淨」的 prompt，因為有些 skill 夾帶惡意程式碼。最後再處理「多少個才太多」的問題，用一次 audit 把 library 整併收乾淨。

## Steps

1. [讓 skill 帶腳本、素材，並互相呼叫](make-skills-powerful-and-safe/skills-with-scripts-and-nesting.md)
2. [安裝外部 skill 前先檢查惡意碼](make-skills-powerful-and-safe/install-skills-safely.md)
3. [多少 skill 才太多：用一次 audit 整併](make-skills-powerful-and-safe/how-many-skills-and-audit.md)
