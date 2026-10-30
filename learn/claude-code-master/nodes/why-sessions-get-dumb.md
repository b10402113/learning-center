---
id: why-sessions-get-dumb
title: "為什麼聊越久它越笨"
subject: claude-code-master
tier: 2
order: 3
status: draft
goal: "能解釋 context window、context rot 與 compaction，並判斷何時該壓縮或重開一個 session。"
digests:
  - volume-a-setup-and-fundamentals.md
prerequisites: []
steps: []
created: 2026-10-28
updated: 2026-10-28
---

# 為什麼聊越久它越笨

## Lesson

先看那個大家都有的體感——session 聊久了就變笨——再拆開背後的機制：context window 是 agent 的桌面，塞滿就開始 context rot，而 compaction 是把長對話摘要壓縮來騰出空間。學會用用量指令判斷什麼時候該壓縮、什麼時候該直接重開，是最省事的一招。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
