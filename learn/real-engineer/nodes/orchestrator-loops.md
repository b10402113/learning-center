---
id: orchestrator-loops
title: "orchestrator 的 loop：改善、ratchet、rebase、慢查詢"
subject: real-engineer
tier: 7
order: 16
status: written
goal: "能設計自己排程的 loop，用門檻與 label 控制節奏，讓失敗走回人手上。"
digests:
  - 091 Improve Codebase Architecture.en.md
  - 092 Improve Codebase Architecture Solution.en.md
  - 093 The Ratchet.en.md
  - 094 The Ratchet Solution.en.md
  - 095 The Morning Rebase.en.md
  - 096 The Morning Rebase Solution.en.md
  - 097 The Slow-Query Monitor.en.md
  - 098 The Slow-Query Monitor Solution.en.md
prerequisites:
  - learn/real-engineer/nodes/seams-and-adapters.md
  - learn/real-engineer/nodes/lint-mutation-and-data-sources.md
  - learn/real-engineer/nodes/choosing-infrastructure.md
steps:
  - id: improve-codebase-loop
    author: "google/gemini-3.8-flash"
    title: "設計每日執行的 Codebase 架構改善流程"
    purpose: "能設計每日跑一次、用 label 與張數門檻防重複開票的 codebase 改善 loop，並決定人在哪一步接手。"
    sources:
      - "[[sources/real-engineer/20261116/course/091 Improve Codebase Architecture.en.txt#L1-L27]]"
      - "[[sources/real-engineer/20261116/course/092 Improve Codebase Architecture Solution.en.txt#L1-L71]]"
  - id: ratchet-loop
    author: "google/gemini-3.8-flash"
    title: "用 Ratchet Loop 逐步升級程式碼庫的 Lint 規則"
    purpose: "能設計 ratchet loop，用 merge 事件與兩桶 lint 規則把規則一格格升級到 strict。"
    sources:
      - "[[sources/real-engineer/20261116/course/093 The Ratchet.en.txt#L1-L19]]"
      - "[[sources/real-engineer/20261116/course/094 The Ratchet Solution.en.txt#L1-L55]]"
  - id: morning-rebase
    author: "google/gemini-3.8-flash"
    title: "設計 Auto Rebase 迴圈：用確定性腳本與 Agent 自動化清理落後 PR"
    purpose: "能設計 auto rebase loop：先確定性 rebase，失敗才叫 agent，修不了的 PR 標成 blocked 交回人手。"
    sources:
      - "[[sources/real-engineer/20261116/course/095 The Morning Rebase.en.txt#L1-L19]]"
      - "[[sources/real-engineer/20261116/course/096 The Morning Rebase Solution.en.txt#L1-L95]]"
  - id: slow-query-pull
    author: "google/gemini-3.8-flash"
    title: "從 Push 到 Pull Queue：用分組與嚴重度門檻控制 Alert 處理節奏"
    purpose: "能把高頻 alert 從 push 改成 pull queue，用分組 runner 與 severity 門檻控制節奏。"
    sources:
      - "[[sources/real-engineer/20261116/course/097 The Slow-Query Monitor.en.txt#L1-L25]]"
      - "[[sources/real-engineer/20261116/course/098 The Slow-Query Monitor Solution.en.txt#L1-L71]]"
created: 2026-11-16
updated: 2026-11-19
---

# orchestrator 的 loop：改善、ratchet、rebase、慢查詢

## Lesson

orchestrator 的真正價值是能自己排程：每天起一次 loop、依事件再 spawn 一台 runner，讓工廠從「你按一下它跑一次」變成「它自己找事做」。四個 loop 示範同一組設計肌肉——先做確定性的部分再叫 agent、用 label 與張數門檻避免重複開票、把 push 改成 pull 以奪回節奏，以及沒人接手時把失敗退回人手上。

## Steps

1. [設計每日執行的 Codebase 架構改善流程](orchestrator-loops/improve-codebase-loop.md)
2. [用 Ratchet Loop 逐步升級程式碼庫的 Lint 規則](orchestrator-loops/ratchet-loop.md)
3. [設計 Auto Rebase 迴圈：用確定性腳本與 Agent 自動化清理落後 PR](orchestrator-loops/morning-rebase.md)
4. [從 Push 到 Pull Queue：用分組與嚴重度門檻控制 Alert 處理節奏](orchestrator-loops/slow-query-pull.md)
