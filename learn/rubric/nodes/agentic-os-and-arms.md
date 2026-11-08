---
id: agentic-os-and-arms
title: "Agentic OS v2 與 ARMS：agent 工作區的四層架構"
subject: rubric
tier: 1
order: 2
status: written
goal: "說出 ARMS 四層與「dashboard 只佔 20–30%」的主張，並解釋為何由 Skills 往上學。"
digests:
  - 02-agentic-os-v2-transcript.md
  - 02-agentic-os-v2.md
  - rubric-agentic-os-v2.md
prerequisites:
  - learn/rubric/nodes/what-is-rubric.md
steps:
  - id: dashboard-is-twenty-percent
    author: "google/gemini-3.8-flash"
    title: "為什麼視覺儀表板只佔 Agentic OS 的三成價值？解構底層的 ARMS 架構"
    purpose: "能說明 dashboard 只佔 20–30% 的價值，並用 ARMS 四層指出其餘價值在哪。"
    sources:
      - "[[sources/rubric/20261108/course/02-agentic-os-v2.txt#L1-L18]]"
      - "[[sources/rubric/20261108/course/02-agentic-os-v2-transcript.txt#L1-L47]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/index.html#L1-L16]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/os.html#L1-L3526]]"
  - id: skills-three-levels
    author: "google/gemini-3.8-flash"
    title: "從重複 SOP 到 Router 架構：Skills 的三級成熟度"
    purpose: "能說出 Skills 的三級成熟度，並把重複的 SOP 整理成可重用的 router 技能。"
    sources:
      - "[[sources/rubric/20261108/course/02-agentic-os-v2-transcript.txt#L48-L98]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/os-config.json#L1-L27]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/skills/agenticos/SKILL.md#L1-L75]]"
  - id: memory-three-levels
    author: "google/gemini-3.8-flash"
    title: "Agent 記憶的三級演進：從混亂檔案堆到視覺化第二大腦"
    purpose: "能解釋 Memory 從檔案堆、router 檔到 Second Brain 的三級演進與各自解的問題。"
    sources:
      - "[[sources/rubric/20261108/course/02-agentic-os-v2-transcript.txt#L99-L135]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/config/workspace.json#L1-L14]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/engine/brain.js#L1-L279]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/BRAIN.md#L1-L114]]"
  - id: routines-three-levels
    author: "google/gemini-3.8-flash"
    title: "AI Agent 的自動化排程：比較本機、常駐雲端與 VPS 三種 Routine 做法"
    purpose: "能比較本機排程、常駐雲端 agent 與 VPS 三種 Routine 做法及取捨。"
    sources:
      - "[[sources/rubric/20261108/course/02-agentic-os-v2-transcript.txt#L136-L174]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/refresh/lib/routines.cjs#L1-L201]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/refresh/sources/claude-code.cjs#L1-L215]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/ROUTINES.md#L1-L57]]"
  - id: applications-three-levels
    author: "google/gemini-3.8-flash"
    title: "串接應用的三個層次：從手動瀏覽、Agent 代尋到自建 Micro App"
    purpose: "能區分 connector 瀏覽、agent 代尋與自建 micro app 三種應用層做法。"
    sources:
      - "[[sources/rubric/20261108/course/02-agentic-os-v2-transcript.txt#L175-L205]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/config/apps.json#L1-L5]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/refresh/lib/apps.cjs#L1-L29]]"
      - "[[sources/rubric/20261108/supplement/rubric-agentic-os-v2/WIRING.md#L1-L84]]"
created: 2026-11-08
updated: 2026-11-08
---

# Agentic OS v2 與 ARMS：agent 工作區的四層架構

## Lesson

Agentic OS v2 把首頁與 Second Brain 合成一頁，但真正決定成敗的是首頁底下的 workspace 組織方式。這個節點拆開 ARMS 四層——Applications、Routines、Memory、Skills——並依原始教材的順序由 Skills 往上學，說明每一層的三個成熟度等級。

## Steps

1. [為什麼視覺儀表板只佔 Agentic OS 的三成價值？解構底層的 ARMS 架構](agentic-os-and-arms/dashboard-is-twenty-percent.md)
2. [從重複 SOP 到 Router 架構：Skills 的三級成熟度](agentic-os-and-arms/skills-three-levels.md)
3. [Agent 記憶的三級演進：從混亂檔案堆到視覺化第二大腦](agentic-os-and-arms/memory-three-levels.md)
4. [AI Agent 的自動化排程：比較本機、常駐雲端與 VPS 三種 Routine 做法](agentic-os-and-arms/routines-three-levels.md)
5. [串接應用的三個層次：從手動瀏覽、Agent 代尋到自建 Micro App](agentic-os-and-arms/applications-three-levels.md)
