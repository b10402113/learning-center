---
id: choosing-infrastructure
title: "選自己的基礎設施，白板你的 task"
subject: real-engineer
tier: 7
order: 15
status: written
goal: "能選出 tracker、git host、runner、orchestrator、observability，並把工廠要跑的 task 畫成一張圖。"
digests:
  - 087 What Infrastructure Do I Need.en.md
  - 088 Choosing Your Infrastructure.en.md
  - 089 Choosing Your Infrastructure Solution.en.md
  - 090 Whiteboard Your Own Tasks.en.md
prerequisites:
  - learn/real-engineer/nodes/chaining-the-factory.md
steps:
  - id: five-parts-of-a-factory
    author: "google/gemini-3.8-flash"
    title: "打造軟體工廠必備的五大基礎設施"
    purpose: "能說出 software factory 五個可替換部件各自的職責，並指出 GitHub 只是其中一種實作。"
    sources:
      - "[[sources/real-engineer/20261116/course/087 What Infrastructure Do I Need.en.txt#L13-L96]]"
  - id: decide-in-priority-order
    author: "google/gemini-3.8-flash"
    title: "軟體工廠基礎設施的決策順序"
    purpose: "能依「已有就沿用、runner 與 orchestrator 先做、observability 後補」排出一條基礎設施決策順序。"
    sources:
      - "[[sources/real-engineer/20261116/course/087 What Infrastructure Do I Need.en.txt#L97-L139]]"
  - id: grill-the-open-choices
    author: "google/gemini-3.8-flash"
    title: "用一次一題的 Grilling 釐清軟體工廠架構與掌控權"
    purpose: "能用一次一題的 grilling session 定出 runner、orchestrator、observability，並分清控制權落在誰手上。"
    sources:
      - "[[sources/real-engineer/20261116/course/088 Choosing Your Infrastructure.en.txt#L1-L47]]"
      - "[[sources/real-engineer/20261116/course/089 Choosing Your Infrastructure Solution.en.txt#L1-L38]]"
  - id: worked-decision-end-to-end
    author: "google/gemini-3.8-flash"
    title: "自架 Worker、Daytona 與 LangFuse：打造 AI 軟體工廠的真實選型與踩坑紀錄"
    purpose: "能用 Inngest 加自架 worker、Daytona、LangFuse 說明一次真實選型的理由、代價與踩到的坑。"
    sources:
      - "[[sources/real-engineer/20261116/course/089 Choosing Your Infrastructure Solution.en.txt#L39-L229]]"
  - id: whiteboard-your-tasks
    author: "google/gemini-3.8-flash"
    title: "在白板上規劃軟體工廠的 Task：同時標出動作與執行位置"
    purpose: "能把工廠的每個 task 畫成同時標示「做什麼」與「在哪個部件上做」的一張圖。"
    sources:
      - "[[sources/real-engineer/20261116/course/090 Whiteboard Your Own Tasks.en.txt#L1-L81]]"
created: 2026-11-16
updated: 2026-11-19
---

# 選自己的基礎設施，白板你的 task

## Lesson

GitHub 是最好的教學工具，不是唯一的生產選擇：一個能運作的 software factory 由五個可替換的部件組成，而且決定的順序就是優先順序。選定之後，離開 terminal 回到白板，把每一個 task 同時標上「做什麼」與「在哪個部件上做」，工廠的形狀才會從抽象變成可施工。

## Steps

1. [打造軟體工廠必備的五大基礎設施](choosing-infrastructure/five-parts-of-a-factory.md)
2. [軟體工廠基礎設施的決策順序](choosing-infrastructure/decide-in-priority-order.md)
3. [用一次一題的 Grilling 釐清軟體工廠架構與掌控權](choosing-infrastructure/grill-the-open-choices.md)
4. [自架 Worker、Daytona 與 LangFuse：打造 AI 軟體工廠的真實選型與踩坑紀錄](choosing-infrastructure/worked-decision-end-to-end.md)
5. [在白板上規劃軟體工廠的 Task：同時標出動作與執行位置](choosing-infrastructure/whiteboard-your-tasks.md)
