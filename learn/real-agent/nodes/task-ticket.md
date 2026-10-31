---
id: task-ticket
title: "Task Ticket：只有人能做的步驟"
subject: real-agent
tier: 2
order: 8
status: draft
goal: "判斷哪些步驟該交給人加 wizard，讓 API key 只留在本機 `.env`。"
digests:
  - 020 Task Ticket.en.md
  - 021 Task Ticket Solution.en.md
prerequisites: []
steps: []
created: 2026-10-30
updated: 2026-10-30
---

# Task Ticket：只有人能做的步驟

## Lesson

有些步驟 agent 做不了也不該做：去廠商後台開帳號、選 channel、拷 API key。這個 node 用 Knock 註冊當例子，示範 task ticket 怎麼搭配 wizard skill，把這些步驟隔離在本機終端機，只讓 agent 拿到驗證結果。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
