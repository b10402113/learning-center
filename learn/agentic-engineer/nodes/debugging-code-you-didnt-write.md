---
id: debugging-code-you-didnt-write
title: "Debugging Code You Didn't Write"
subject: agentic-engineer
tier: 4
order: 20
status: draft
goal: "能從 spec 的 AC、周邊慣例與執行行為三處還原意圖，並認出 session 已經壞掉、知道該 compact 還是 clear。"
digests:
  - ch11-find-the-root-cause.md
  - code-jsm-skills-system.md
  - code-reel-agentic-skills.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Debugging Code You Didn't Write

## Lesson

對自己的 code，你記得每一行為什麼存在，那記得就做完了一半的調查；對 agent 寫的 code，那份記憶不存在，而且看著它被生成也不算——你看到的是輸出，不是推理。所以只能像讀陌生人寫的東西那樣讀，並用 spec 的 AC、周邊慣例、執行行為三處還原意圖。最後一節教你認出「session 已經變成負債」的五個訊號，以及該 compact 還是 clear。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
