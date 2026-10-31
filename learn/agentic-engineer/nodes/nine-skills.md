---
id: nine-skills
title: "Nine Skills：Finding Your Entry Point"
subject: agentic-engineer
tier: 3
order: 11
status: confirmed
goal: "能背出九個 skill 的順序，並依手上的材料（greenfield / 既有 repo / 小改動）選出正確的入口。"
digests:
  - ch08-workflow-ship-something-real.1.part.md
  - ch08-workflow-ship-something-real.2.part.md
  - code-jsm-skills-system.md
  - code-jsm-skills-tooling.md
prerequisites: []
steps:
  - id: the-workflow-is-the-lifecycle
    title: "Why the Workflow Is Structured This Way：九個階段就是生命週期"
    purpose: "能用需求、設計、實作、驗證四個階段解釋九個 skill 的順序，並說出 agent 不寫下來就會替誰做決定。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/2. Why the Workflow Is Structured This Way.srt#L1-L247]]"
  - id: the-loop-and-what-each-owns
    title: "The Loop：九個 Skill 各管一個階段"
    purpose: "能照順序講出九個 skill 各自擁有的階段，並指出 Prototype 只需要其中五個。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/3. Nine Skills： Finding Your Entry Point (9_11_2026 1：41：29 PM).txt#L1-L44]]"
      - "[[sources/agentic-engineer/20261030/skills/README.md#L1-L121]]"
  - id: where-you-enter
    title: "Where You Enter：三種材料，三條入口"
    purpose: "能依手上的材料選出入口：greenfield 從 `/scope`、既有 repo 從 `/audit`、小改動走 `/debug` 或 `/develop` 加 `/check verify`。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/3. Nine Skills： Finding Your Entry Point (9_11_2026 1：41：29 PM).txt#L45-L62]]"
  - id: why-audit-moves
    title: "Why /audit Moves：證據在哪，它就排在哪"
    purpose: "能用「描述證據、不描述假設」解釋 `/audit` 為什麼在既有 repo 排第一、在新專案排第四。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/3. Nine Skills： Finding Your Entry Point (9_11_2026 1：41：29 PM).txt#L63-L74]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/audit/SKILL.md#L1-L108]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/audit/modes/greenfield.md#L1-L24]]"
  - id: the-day-thirty-question
    title: "Day Thirty：一份沒人再打開的 spec"
    purpose: "能說明寫完就沒人再打開的 spec 為什麼比沒有更糟，並指出 `/architect`、`/develop`、`/sync` 各自的回答。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/3. Nine Skills： Finding Your Entry Point (9_11_2026 1：41：29 PM).txt#L75-L85]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/architect/SKILL.md#L1-L206]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/develop/SKILL.md#L1-L144]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/sync/SKILL.md#L1-L146]]"
created: 2026-10-30
updated: 2026-10-30
---

# Nine Skills：Finding Your Entry Point

## Lesson

安裝只是一行指令，難的是知道什麼時候該叫哪一個。這個 node 先把九個 skill 排成一頁地圖，說明它們其實就是軟體生命週期的分段，然後給出選入口的規則：greenfield 從 `/scope` 開始、既有 codebase 先 `/audit`、小改動走 `/debug` 或 `/develop` 加 `/check verify`。

## Steps

1. [Why the Workflow Is Structured This Way：九個階段就是生命週期](nine-skills/the-workflow-is-the-lifecycle.md)
2. [The Loop：九個 Skill 各管一個階段](nine-skills/the-loop-and-what-each-owns.md)
3. [Where You Enter：三種材料，三條入口](nine-skills/where-you-enter.md)
4. [Why /audit Moves：證據在哪，它就排在哪](nine-skills/why-audit-moves.md)
5. [Day Thirty：一份沒人再打開的 spec](nine-skills/the-day-thirty-question.md)
