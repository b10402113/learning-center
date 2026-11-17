---
id: lint-mutation-and-data-sources
title: "自訂 lint rule、mutation testing 與 data sources"
subject: real-engineer
tier: 5
order: 12
status: draft
goal: "能為 linter 抓不到的問題寫規則、用 mutation 找測試缺口，並把缺的資料源接給 agent。"
digests:
  - 064 Writing A Custom Lint Rule.en.md
  - 065 Writing A Custom Lint Rule Solution.en.md
  - 066 Mutation Testing.en.md
  - 067 Mutation Testing Solution.en.md
  - 068 Data Sources.en.md
  - 069 Diagnosing Bugs.en.md
  - 070 Diagnosing Bugs Solution.en.md
  - 071 Verifying Frontend Apps.en.md
  - 072 Verifying Frontend Apps Solution.en.md
  - cohort-005-project.5.part.md
prerequisites:
  - learn/real-engineer/nodes/automated-checks.md
steps: []
created: 2026-11-16
updated: 2026-11-16
---

# 自訂 lint rule、mutation testing 與 data sources

## Lesson

檢查的極限不是工具清單，而是你想像得到什麼能被機械化：`sql.raw` 這種只有看程式碼才抓得到的漏洞，值得一條高度針對性的自訂規則；測試本身會不會腐化，則交給 mutation testing 誠實打分。但檢查只涵蓋 agent 已知的錯誤形態，所以這個 node 也把「讓 agent 拿到對的資料」講完——browser console、production 日誌、慢查詢，缺了它們，agent 基本上是在盲修。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
