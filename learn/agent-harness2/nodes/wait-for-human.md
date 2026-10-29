---
id: wait-for-human
title: "要等人三天：human-in-the-loop"
subject: agent-harness2
tier: 5
order: 11
status: draft
goal: "在 harness 層實作 needs-approval 對照表與 `DBOS.recv`／`DBOS.send` 的暫停恢復，並收束自己的最小 stack。"
prerequisites: []
steps: []
created: 2026-10-29
updated: 2026-10-29
---

# 要等人三天：human-in-the-loop

## Lesson

最後一個故障是等人。Approval 必須在 harness 層被偵測，而且 workflow 停三天也不該燒資源——`DBOS.recv` 停住 compute，`DBOS.send` 才讓它繼續。收尾時把這一路的層次收束成你自己的最小 stack。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
