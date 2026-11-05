---
id: setup-three-processes
title: "設定：三個程序與故障注入"
subject: background-agent
tier: 2
order: 6
status: confirmed
goal: "能從乾淨 repo 啟動 checkout、operator、agent 三個程序，並用 fault flags 造出可觀察的事件。"
digests:
  - 2-course-project-setup.md
  - README.md
  - notes-simulator.md
  - notes-lesson-authoring.md
  - scripts.md
  - lessons-index.md
prerequisites:
  - learn/background-agent/nodes/world-is-observed-state.md
steps:
  - id: bootstrap-the-repo
    title: "環境設定"
    purpose: "能從乾淨 repo 完成安裝、環境變數、資料庫推版與 preflight，確認三個程序有可啟動的基礎。"
    sources:
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L1-L105]]"
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L106-L272]]"
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L273-L408]]"
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L409-L470]]"
      - "[[sources/background-agent/20261105/README.md#L17-L38]]"
      - "[[sources/background-agent/20261105/README.md#L39-L45]]"
      - "[[sources/background-agent/20261105/lessons/index.md#L29-L50]]"
      - "[[sources/background-agent/20261105/lessons/index.md#L51-L55]]"
      - "[[sources/background-agent/20261105/scripts/preflight.mjs#L1-L54]]"
  - id: start-the-three-processes
    title: "在三個終端機啟動系統"
    purpose: "能依序啟動 agent、operator 與 checkout，說出每個程序的埠與擁有的狀態，並用 stop 收乾淨。"
    sources:
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L409-L470]]"
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L471-L570]]"
      - "[[sources/background-agent/20261105/README.md#L46-L61]]"
      - "[[sources/background-agent/20261105/README.md#L62-L69]]"
      - "[[sources/background-agent/20261105/lessons/index.md#L56-L65]]"
      - "[[sources/background-agent/20261105/scripts/check-ports.mjs#L1-L71]]"
      - "[[sources/background-agent/20261105/scripts/wait-for.mjs#L1-L18]]"
      - "[[sources/background-agent/20261105/scripts/stop.mjs#L1-L73]]"
  - id: inject-faults
    title: "用啟動旗標建立四種故障情境"
    purpose: "能用 --fault 與觸發參數重現四種故障情境，並說出每次重啟如何換掉世界狀態。"
    sources:
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L571-L630]]"
      - "[[sources/background-agent/20261105/README.md#L70-L84]]"
      - "[[sources/background-agent/20261105/lessons/index.md#L66-L75]]"
      - "[[sources/background-agent/20261105/notes/simulator.md#L1-L3]]"
      - "[[sources/background-agent/20261105/notes/simulator.md#L4-L5]]"
      - "[[sources/background-agent/20261105/notes/simulator.md#L8-L9]]"
  - id: move-between-lessons
    title: "分支如何運作"
    purpose: "能在 lesson 分支間切換、用產生的 notes 追上進度，並在改動後跑 format、lint、typecheck。"
    sources:
      - "[[sources/background-agent/20261105/2-course-project-setup.vtt#L631-L700]]"
      - "[[sources/background-agent/20261105/README.md#L85-L91]]"
      - "[[sources/background-agent/20261105/README.md#L92-L99]]"
      - "[[sources/background-agent/20261105/notes/lesson-authoring.md#L1-L3]]"
      - "[[sources/background-agent/20261105/notes/lesson-authoring.md#L4-L5]]"
      - "[[sources/background-agent/20261105/notes/lesson-authoring.md#L6-L7]]"
      - "[[sources/background-agent/20261105/notes/lesson-authoring.md#L8-L11]]"
      - "[[sources/background-agent/20261105/lessons/index.md#L76-L89]]"
      - "[[sources/background-agent/20261105/scripts/build-notes.mjs#L1-L132]]"
      - "[[sources/background-agent/20261105/scripts/lesson-data.json#L1-L115]]"
created: 2026-11-05
updated: 2026-11-05
---

# 設定：三個程序與故障注入

## Lesson

在改任何一行 agent 程式前，先把世界、操作台與代理跑起來，並學會製造可重現的故障。這個節點涵蓋 Neon、三個終端、分支與 fault flags，讓後面每個機制都有可觀察的實驗場景。

## Steps

1. [環境設定](setup-three-processes/bootstrap-the-repo.md)
2. [在三個終端機啟動系統](setup-three-processes/start-the-three-processes.md)
3. [用啟動旗標建立四種故障情境](setup-three-processes/inject-faults.md)
4. [分支如何運作](setup-three-processes/move-between-lessons.md)
