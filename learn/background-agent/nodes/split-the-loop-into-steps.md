---
id: split-the-loop-into-steps
title: "把迴圈拆成獨立步驟"
subject: background-agent
tier: 2
order: 9
status: draft
goal: "能替觀察、決策、行動各建 step，並用 cycle 編號讓重播對得上。"
digests:
  - 12-multi-step-loop.md
  - 13-generate-a-decision.md
  - 14-handle-special-cases.md
  - 15-executing-actions.md
  - lessons-02-durable-execution.md
  - server.md
prerequisites:
  - learn/background-agent/nodes/make-progress-durable.md
steps: []
created: 2026-11-05
updated: 2026-11-05
---

# 把迴圈拆成獨立步驟

## Lesson

把觀察、決策、特殊分支與行動各自拆成具名 step，重播才能跳過已完成的工作，並讓每個 cycle 在 Inngest 上可追蹤。這個節點也處理 complete／wait／help 的邊界，以及 expectedVersion 與 activity 記錄。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
