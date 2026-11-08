---
id: the-agent-loop
title: "Agent 迴圈：它怎麼讀你的程式庫"
subject: js-mastery-engineer
tier: 2
order: 3
status: written
goal: "能用 read → decide → act → observe 解釋 agent 行為，並說明它靠 grep/glob/read 現查、沒有索引。"
digests:
  - 010 - The Agent Loop.en.md
  - 011 - How Agents Read Your Codebase.en.md
  - 014 - The Agent Loop.md
  - 015 - What the Agent Sees.md
  - 016 - How Agents Read Your Codebase.md
prerequisites:
  - learn/js-mastery-engineer/nodes/why-ai-coding-falls-apart.md
steps:
  - id: read-decide-act-observe
    author: "google/gemini-3.8-flash"
    title: "拆解 Coding Agent 的運作核心：Read、Decide、Act、Observe 迴圈"
    purpose: "用登入按鈕壞掉的 demo 拆解 read → decide → act → observe，並說明 act 是真的工具呼叫。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/010 - The Agent Loop.en.txt#L1-L44]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/014 - The Agent Loop.txt#L5-L9]]"
  - id: loops-and-drift
    author: "google/gemini-3.8-flash"
    title: "在第 3 輪攔截走偏的 Agent"
    purpose: "說明一個任務要跑八到八十輪、誤差會複利，並用控制 read、釐清 decide、盯緊 observe 說明如何及早修正。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/010 - The Agent Loop.en.txt#L45-L67]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/014 - The Agent Loop.txt#L10-L19]]"
  - id: what-the-agent-sees
    author: "google/gemini-3.8-flash"
    title: "Agent 怎麼讀你的程式碼：沒有索引，沒說沒讀就不知道"
    purpose: "說明 agent 沒有索引、只知道當下 context 裡的東西，並用「沒說沒讀就不知道」檢查每個提示。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/011 - How Agents Read Your Codebase.en.txt#L1-L15]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/015 - What the Agent Sees.txt#L19-L51]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/016 - How Agents Read Your Codebase.txt#L5-L11]]"
  - id: search-then-read
    author: "google/gemini-3.8-flash"
    title: "AI Agent 如何閱讀你的程式碼：從 grep、篩選到檔案讀取的真實成本"
    purpose: "用 auth 搜尋示範 grep → 篩選 → read 的流程與工具成本，並說明命名與結構如何決定搜尋效率。"
    sources:
      - "[[sources/js-mastery-engineer/20261107/course/011 - How Agents Read Your Codebase.en.txt#L16-L57]]"
      - "[[sources/js-mastery-engineer/20261107/supplement/016 - How Agents Read Your Codebase.txt#L12-L31]]"
created: 2026-11-07
updated: 2026-11-07
---

# Agent 迴圈：它怎麼讀你的程式庫

## Lesson

所有 coding agent 都跑同一個 read → decide → act → observe 迴圈，而它對你的程式庫沒有索引，只能靠 grep、glob、read 當場找。理解這件事，才知道為什麼命名、結構與「你有沒有把檔案放到它眼前」會直接決定成敗。

## Steps

1. [拆解 Coding Agent 的運作核心：Read、Decide、Act、Observe 迴圈](the-agent-loop/read-decide-act-observe.md)
2. [在第 3 輪攔截走偏的 Agent](the-agent-loop/loops-and-drift.md)
3. [Agent 怎麼讀你的程式碼：沒有索引，沒說沒讀就不知道](the-agent-loop/what-the-agent-sees.md)
4. [AI Agent 如何閱讀你的程式碼：從 grep、篩選到檔案讀取的真實成本](the-agent-loop/search-then-read.md)
