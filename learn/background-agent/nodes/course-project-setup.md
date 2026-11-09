---
id: course-project-setup
title: "課程專案設定"
subject: background-agent
tier: 1
order: 2
status: written
goal: "能從乾淨 repo 啟動 checkout、operator、agent 三個程序，用 fault flags 造出可觀察的事件，並跑過 preflight/db:seed。"
digests:
  - 2-course-project-setup.md
  - README.md
  - notes-simulator.md
  - service.md
prerequisites:
  - learn/background-agent/nodes/build-agents-that-never-sleep.md
steps:
  - id: prepare-the-lab
    author: "google/gemini-3.8-flash"
    title: "課程環境建置：從分支切換到資料庫初始化"
    purpose: "從 lesson-1 安裝依賴、建立 .env 並跑完 db:push、preflight、db:seed，讓環境可以開課。"
    sources:
      - "[[sources/background-agent/20261109/course/2-course-project-setup.txt#L1-L64]]"
      - "[[sources/background-agent/20261109/supplement/README.md#L17-L44]]"
  - id: start-the-three-processes
    author: "google/gemini-3.8-flash"
    title: "在三個終端啟動 Agent、Operator 與 Checkout"
    purpose: "用三個終端啟動 agent、operator 與 checkout，並說出各自埠號、角色與健康檢查位置。"
    sources:
      - "[[sources/background-agent/20261109/course/2-course-project-setup.txt#L65-L85]]"
      - "[[sources/background-agent/20261109/supplement/README.md#L4-L16]]"
      - "[[sources/background-agent/20261109/supplement/README.md#L46-L69]]"
  - id: inject-checkout-faults
    author: "google/gemini-3.8-flash"
    title: "透過 Checkout 啟動旗標模擬故障事件與服務狀態重置"
    purpose: "用 --fault、--alerts、--recover-after-ms 等旗標造出可觀察的故障事件，並知道每次啟動都會重置狀態。"
    sources:
      - "[[sources/background-agent/20261109/course/2-course-project-setup.txt#L86-L95]]"
      - "[[sources/background-agent/20261109/supplement/README.md#L70-L84]]"
      - "[[sources/background-agent/20261109/supplement/notes/simulator.md#L1-L9]]"
      - "[[sources/background-agent/20261109/supplement/service/checkout.ts#L1-L221]]"
  - id: work-in-lesson-branches
    author: "google/gemini-3.8-flash"
    title: "課程分支的推進策略與程式碼品質把關"
    purpose: "選定自己的分支策略，並用 format、lint、typecheck 在每次改動後把關。"
    sources:
      - "[[sources/background-agent/20261109/course/2-course-project-setup.txt#L96-L107]]"
      - "[[sources/background-agent/20261109/supplement/README.md#L85-L99]]"
created: 2026-11-09
updated: 2026-11-08
---

# 課程專案設定

## Lesson

課程的實驗室由三個程序組成：會故障的 checkout service、operator API／dashboard，以及跑 Inngest 的 agent endpoint。這個節點把環境、資料庫、模型金鑰與 fault flags 一次設定好，之後每個故障情境都能用同一個指令重現。

## Steps

1. [課程環境建置：從分支切換到資料庫初始化](course-project-setup/prepare-the-lab.md)
2. [在三個終端啟動 Agent、Operator 與 Checkout](course-project-setup/start-the-three-processes.md)
3. [透過 Checkout 啟動旗標模擬故障事件與服務狀態重置](course-project-setup/inject-checkout-faults.md)
4. [課程分支的推進策略與程式碼品質把關](course-project-setup/work-in-lesson-branches.md)
