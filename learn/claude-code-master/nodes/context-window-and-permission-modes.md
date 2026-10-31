---
id: context-window-and-permission-modes
title: "Context Window 與權限模式"
subject: claude-code-master
tier: 1
order: 4
status: written
goal: "用 `/context` 讀出預佔的 token，並在五種權限模式之間選出速度與控制的平衡。"
digests:
  - 4-Module_A4_-_The_Context_Window.md
  - 6-Module_A6_-_Permission_Modes.md
prerequisites: []
steps:
  - id: context-window-as-desk
    title: "Context Window：一張會越堆越滿的桌子"
    purpose: "用「桌面」比喻說明 context window 的硬上限，以及每段對話如何吃掉可用空間。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/4-Module A4 - The Context Window/4-Module_A4_-_The_Context_Window.en.vtt#L1-L100]]"
  - id: compaction-and-context-rot
    title: "Context Rot：session 越跑越笨"
    purpose: "判斷 session 變笨時該 `/compact` 還是直接重開，並說出 compaction 的代價。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/4-Module A4 - The Context Window/4-Module_A4_-_The_Context_Window.en.vtt#L101-L175]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/4-Module A4 - The Context Window/4-Module_A4_-_The_Context_Window.en.vtt#L176-L260]]"
  - id: read-the-context-bill
    title: "在你跟 agent 說話之前，已經用掉兩萬多個 token"
    purpose: "用 `/context` 讀出對話與系統預佔的 token，估算 workspace 的固定成本。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/4-Module A4 - The Context Window/4-Module_A4_-_The_Context_Window.en.vtt#L261-L340]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/4-Module A4 - The Context Window/4-Module_A4_-_The_Context_Window.en.vtt#L341-L403]]"
  - id: five-permission-modes
    title: "權限模式：每一次都用 auto mode"
    purpose: "說出五種權限模式各自讓 agent 動到哪一步，並在設定中打開隱藏的兩種。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/6-Module A6 - Permission Modes/6-Module_A6_-_Permission_Modes.en.vtt#L1-L60]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/6-Module A6 - Permission Modes/6-Module_A6_-_Permission_Modes.en.vtt#L61-L170]]"
  - id: choose-speed-versus-control
    title: "速度與控制的平衡"
    purpose: "在 Auto、Plan、Bypass 之間選出符合風險的平衡，並知道破壞性指令何時仍會被攔。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/6-Module A6 - Permission Modes/6-Module_A6_-_Permission_Modes.en.vtt#L171-L250]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/6-Module A6 - Permission Modes/6-Module_A6_-_Permission_Modes.en.vtt#L251-L450]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/6-Module A6 - Permission Modes/6-Module_A6_-_Permission_Modes.en.vtt#L451-L650]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/6-Module A6 - Permission Modes/6-Module_A6_-_Permission_Modes.en.vtt#L651-L727]]"
created: 2026-10-31
updated: 2026-10-31
---

# Context Window 與權限模式

## Lesson

Context window 是 desk 的大小，權限模式是你願意讓 agent 自己動多大的範圍。把 `/context` 與 Auto／Plan／Bypass 放在一起學，是因為兩者都在回答「這個 session 我還剩多少、能放手多少」。

## Steps

1. [Context Window：一張會越堆越滿的桌子](context-window-and-permission-modes/context-window-as-desk.md)
2. [Context Rot：session 越跑越笨](context-window-and-permission-modes/compaction-and-context-rot.md)
3. [在你跟 agent 說話之前，已經用掉兩萬多個 token](context-window-and-permission-modes/read-the-context-bill.md)
4. [權限模式：每一次都用 auto mode](context-window-and-permission-modes/five-permission-modes.md)
5. [速度與控制的平衡](context-window-and-permission-modes/choose-speed-versus-control.md)
