---
id: connect-capture-lint
title: "Connect every agent、capture 與 lint"
subject: ai-agent-engineer
tier: 5
order: 20
status: draft
goal: "把 brain 接到每個 agent，分開 capture 與 triage，並用 lint 修結構漂移、用 superseded 保留決策史。"
digests:
  - agentic-coding-handbook.5.part.md
  - agentic-coding-handbook.6.part.md
  - brain-template.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/centralized-brain.md"
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Connect every agent、capture 與 lint

## Lesson

儲存若超過幾秒你就不會做，手動分類則會積到沒人讀，所以 capture 與 triage 必須分開。Install 腳本把 skills 與指標行接到機器上的每個 agent，sync 腳本負責 commit、pull、push。Lint 只自動修結構問題，衝突與失效 guideline 留給人判斷；決策變更時新增檔案並標 superseded，永不刪除。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
