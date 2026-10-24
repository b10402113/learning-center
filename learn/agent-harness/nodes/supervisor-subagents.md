---
id: supervisor-subagents
title: "Supervision：Plan、Fan-out、Fan-in"
subject: agent-harness
tier: 3
order: 9
status: draft
goal: "用 plan 與 Promise.allSettled 平行派工，並讓單一 sub-agent 失敗不拖垮 workflow。"
prerequisites: []
steps: []
created: 2026-10-24
updated: 2026-10-24
---

# Supervision：Plan、Fan-out、Fan-in

## Lesson

Supervision 把工作拆成一份可執行的 plan，再平行派給各自有 context 的 investigator。Fan-in 只收成功的結果，失敗變成資料而不是例外，最後由 supervisor 合成回覆。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
