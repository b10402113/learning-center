---
id: course-orientation
title: "課程材料與先備"
subject: ai-agent-engineer
tier: 1
order: 1
status: written
goal: "知道四種材料與先備，能用 course kit 把 TicketBay、skills 與 brain 裝到可跑 unit tests。"
digests:
  - course-kit.md
  - agentic-coding-handbook.10.part.md
prerequisites: []
steps:
  - id: four-materials
    author: "gpt-6-luna"
    title: "你的工具箱"
    purpose: "能說出 TicketBay、course kit、skills、brain-template 各是什麼，並用一句話說明每個在課程裡的角色。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.10.part.txt#L5-L30]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.10.part.txt#L31-L95]]"
  - id: find-the-module-files
    author: "gpt-6-luna"
    title: "kit 裡有什麼"
    purpose: "用 kit 的 README 與 CHANGELOG 找到 M0–M8 的檔案，並在重跑前確認最後驗證日期。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.10.part.txt#L96-L160]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/README.md#L1-L32]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/CHANGELOG.md#L1-L88]]"
  - id: cost-path-and-tooling
    author: "gpt-6-luna"
    title: "你的機器、你的帳號、測試全綠"
    purpose: "依 Minimum／Full／Free 選出費用路徑，並把 Git、jq、Node 22、Docker、GitHub CLI 與 Claude 登入備妥。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L36-L46]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L47-L173]]"
  - id: ticketbay-unit-test-baseline
    author: "gpt-6-luna"
    title: "安裝並執行 unit tests（不需 Docker）"
    purpose: "fork 並 clone TicketBay，跑 npm ci 與 unit tests，得到第一個可重現的綠燈 baseline。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L174-L216]]"
  - id: project-scoped-course-skills
    author: "gpt-6-luna"
    title: "課程 skills 的一次性安裝"
    purpose: "把十個課程 skills 裝進專案 .claude/skills、用 git exclude 隱藏，並用 Done when 驗證。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m0/setup-guide.md#L217-L281]]"
created: 2026-11-03
updated: 2026-11-04
---

# 課程材料與先備

## Lesson

這門課用四種材料：TicketBay 練習 app、agent 導向的 course kit、dmoka/skills 與 brain-template。先備是 Claude Pro、一台 24/7 機器與一個非方案登入的模型，加上 Git、Node 22、Docker 與 GitHub CLI。先把環境裝到 unit tests 綠，後面每個模組才有共同起點。

## Steps

1. [你的工具箱](course-orientation/four-materials.md)
2. [kit 裡有什麼](course-orientation/find-the-module-files.md)
3. [你的機器、你的帳號、測試全綠](course-orientation/cost-path-and-tooling.md)
4. [安裝並執行 unit tests（不需 Docker）](course-orientation/ticketbay-unit-test-baseline.md)
5. [課程 skills 的一次性安裝](course-orientation/project-scoped-course-skills.md)
