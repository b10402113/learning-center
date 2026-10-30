---
id: context-engineering
title: "Context Engineering：always-on、on-demand、reference"
subject: agentic-engineer
tier: 1
order: 6
status: draft
goal: "能把「它應該知道」翻譯成三層 context 的配置，並用 `/context` 驗證 AGENTS.md 是真的被載入。"
digests:
  - ch05-context-engineering.md
  - code-ai-course-demos-agent-context.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Context Engineering：always-on、on-demand、reference

## Lesson

Prompt engineering 拉錯槓桿：一句 prompt 是落在它已經背著的整個環境上面，那個環境比你的措辭更決定輸出。這個 node 把 context 分成 always-on、on-demand、reference 三層，說明為什麼只有第一層要付每次的租金，並用一個五行的 AGENTS.md 示範「檔案存在」與「真的被載入」是兩件事。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
