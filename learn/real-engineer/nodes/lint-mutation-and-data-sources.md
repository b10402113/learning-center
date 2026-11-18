---
id: lint-mutation-and-data-sources
title: "自訂 lint rule、mutation testing 與 data sources"
subject: real-engineer
tier: 5
order: 12
status: written
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
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/automated-checks.md
steps:
  - id: custom-lint-rule
    author: "google/gemini-3.8-flash"
    title: "為程式碼漏洞撰寫自訂 Lint 規則：精準防堵 sql.raw 動態字串"
    purpose: "能為只有看程式碼才抓得到的漏洞寫一條自訂 lint 規則，只禁止動態字串傳進 sql.raw。"
    sources:
      - "[[sources/real-engineer/20261116/course/064 Writing A Custom Lint Rule.en.txt#L1-L47]]"
      - "[[sources/real-engineer/20261116/course/065 Writing A Custom Lint Rule Solution.en.txt#L1-L29]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/db/index.ts#L1-L57]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/routes/courses.tsx#L29-L88]]"
  - id: mutation-testing
    author: "google/gemini-3.8-flash"
    title: "突變測試：用存活突變檢驗測試有效性"
    purpose: "能用 surviving mutant 判定測試是否真的擋得住 bug，並把 mutation score 當資訊而非閘門。"
    sources:
      - "[[sources/real-engineer/20261116/course/066 Mutation Testing.en.txt#L1-L65]]"
      - "[[sources/real-engineer/20261116/course/067 Mutation Testing Solution.en.txt#L1-L71]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/lib/ppp.test.ts#L1-L214]]"
  - id: data-sources-for-agents
    author: "google/gemini-3.8-flash"
    title: "為什麼只給檔案系統與測試的 Agent 等於盲的"
    purpose: "能列出 agent 需要的環境資料源，並說明只給檔案系統與測試的 agent 為何等於盲的。"
    sources:
      - "[[sources/real-engineer/20261116/course/068 Data Sources.en.txt#L1-L39]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/request-logger/README.md#L1-L393]]"
  - id: diagnosing-bugs-loop
    author: "google/gemini-3.8-flash"
    title: "用 Browser Console 與診斷迴圈排查 Bug 並建立防回歸防護"
    purpose: "能用 browser console 與可重現的迴圈找到 bug 成因，再把修復釘成 regression guard。"
    sources:
      - "[[sources/real-engineer/20261116/course/069 Diagnosing Bugs.en.txt#L1-L35]]"
      - "[[sources/real-engineer/20261116/course/070 Diagnosing Bugs Solution.en.txt#L1-L35]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/request-logger/proxy.ts#L1-L587]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/app/components/dev-ui.tsx#L1-L172]]"
  - id: verify-frontend-with-browser
    author: "google/gemini-3.8-flash"
    title: "用 agent-browser 驗證前端修改並產出 PR 截圖證據"
    purpose: "能用 agent-browser 操作真實瀏覽器驗證前端修正，並用 before／after 截圖當 PR evidence。"
    sources:
      - "[[sources/real-engineer/20261116/course/071 Verifying Frontend Apps.en.txt#L1-L45]]"
      - "[[sources/real-engineer/20261116/course/072 Verifying Frontend Apps Solution.en.txt#L1-L45]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/request-logger/render.ts#L1-L903]]"
created: 2026-11-16
updated: 2026-11-18
---

# 自訂 lint rule、mutation testing 與 data sources

## Lesson

檢查的極限不是工具清單，而是你想像得到什麼能被機械化：`sql.raw` 這種只有看程式碼才抓得到的漏洞，值得一條高度針對性的自訂規則；測試本身會不會腐化，則交給 mutation testing 誠實打分。但檢查只涵蓋 agent 已知的錯誤形態，所以這個 node 也把「讓 agent 拿到對的資料」講完——browser console、production 日誌、慢查詢，缺了它們，agent 基本上是在盲修。

## Steps

1. [為程式碼漏洞撰寫自訂 Lint 規則：精準防堵 sql.raw 動態字串](lint-mutation-and-data-sources/custom-lint-rule.md)
2. [突變測試：用存活突變檢驗測試有效性](lint-mutation-and-data-sources/mutation-testing.md)
3. [為什麼只給檔案系統與測試的 Agent 等於盲的](lint-mutation-and-data-sources/data-sources-for-agents.md)
4. [用 Browser Console 與診斷迴圈排查 Bug 並建立防回歸防護](lint-mutation-and-data-sources/diagnosing-bugs-loop.md)
5. [用 agent-browser 驗證前端修改並產出 PR 截圖證據](lint-mutation-and-data-sources/verify-frontend-with-browser.md)
