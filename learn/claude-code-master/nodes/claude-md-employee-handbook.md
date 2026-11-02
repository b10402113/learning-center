---
id: claude-md-employee-handbook
title: "CLAUDE.md：agent 的員工手冊"
subject: claude-code-master
tier: 3
order: 9
status: written
goal: "寫出 identity／goals／rules／workspace map 四支柱的 CLAUDE.md，並分清 global 與 project 兩份。"
digests:
  - 1-Module_C1_-_How_Memory_Works.md
  - 2-Module_C2_-_Claude_MD_best_practices.md
  - 3-Module_C3_-_The_two_Claude_MDs.md
  - 4-Module_C4_-_Use_-init.md
prerequisites: []
steps:
  - id: context-is-the-workspace
    title: "Context 就是 workspace 裡的那些檔案"
    purpose: "能說明 context 就是 workspace 裡的檔案，並指出它如何累積成 token 成本。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/1-Module C1 - How Memory Works/1-Module_C1_-_How_Memory_Works.en.vtt#L1-L46]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/1-Module C1 - How Memory Works/1-Module_C1_-_How_Memory_Works.en.vtt#L47-L76]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/1-Module C1 - How Memory Works/1-Module_C1_-_How_Memory_Works.en.vtt#L77-L115]]"
  - id: four-pillars-of-claude-md
    title: "好的 CLAUDE.md 的四個支柱"
    purpose: "能為自己的專案寫出 identity、goals、rules、workspace map 四段 CLAUDE.md。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/2-Module C2 - Claude MD best practices/2-Module_C2_-_Claude_MD_best_practices.en.vtt#L1-L46]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/2-Module C2 - Claude MD best practices/2-Module_C2_-_Claude_MD_best_practices.en.vtt#L47-L115]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/2-Module C2 - Claude MD best practices/2-Module_C2_-_Claude_MD_best_practices.en.vtt#L116-L178]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/2-Module C2 - Claude MD best practices/2-Module_C2_-_Claude_MD_best_practices.en.vtt#L179-L262]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/2-Module C2 - Claude MD best practices/2-Module_C2_-_Claude_MD_best_practices.en.vtt#L308-L409]]"
  - id: global-vs-project-claude-md
    title: "你的裝置裡有兩份 CLAUDE.md"
    purpose: "能問出 global 與 project 兩份 CLAUDE.md 的路徑，並判斷該維護哪一份。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/3-Module C3 - The two Claude MDs/3-Module_C3_-_The_two_Claude_MDs.en.vtt#L1-L46]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/3-Module C3 - The two Claude MDs/3-Module_C3_-_The_two_Claude_MDs.en.vtt#L47-L89]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/3-Module C3 - The two Claude MDs/3-Module_C3_-_The_two_Claude_MDs.en.vtt#L90-L123]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/3-Module C3 - The two Claude MDs/3-Module_C3_-_The_two_Claude_MDs.en.vtt#L124-L136]]"
  - id: init-and-self-update
    title: "有了 CLAUDE.md 之後，怎麼讓它自己慢慢變好"
    purpose: "能用 /init 與自評 prompt 讓 CLAUDE.md 自己長，而不是手寫整份。"
    sources:
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/2-Module C2 - Claude MD best practices/2-Module_C2_-_Claude_MD_best_practices.en.vtt#L263-L307]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/4-Module C4 - Use -init/4-Module_C4_-_Use_-init.en.vtt#L1-L46]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/4-Module C4 - Use -init/4-Module_C4_-_Use_-init.en.vtt#L47-L83]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/4-Module C4 - Use -init/4-Module_C4_-_Use_-init.en.vtt#L84-L115]]"
      - "[[sources/claude-code-master/20261031/4-Volume C - Memory/4-Module C4 - Use -init/4-Module_C4_-_Use_-init.en.vtt#L116-L148]]"
created: 2026-10-31
updated: 2026-10-31
---

# CLAUDE.md：agent 的員工手冊

## Lesson

CLAUDE.md 是 agent 每次 session 都會讀的員工手冊，四根柱子是 identity、goals、rules、workspace map。先分清楚 global 與 project 兩份，再決定哪一份值得維護。

## Steps

1. [Context 就是 workspace 裡的那些檔案](claude-md-employee-handbook/context-is-the-workspace.md)
2. [好的 CLAUDE.md 的四個支柱](claude-md-employee-handbook/four-pillars-of-claude-md.md)
3. [你的裝置裡有兩份 CLAUDE.md](claude-md-employee-handbook/global-vs-project-claude-md.md)
4. [有了 CLAUDE.md 之後，怎麼讓它自己慢慢變好](claude-md-employee-handbook/init-and-self-update.md)
