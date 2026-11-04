---
id: connect-capture-lint
title: "Connect every agent、capture 與 lint"
subject: ai-agent-engineer
tier: 5
order: 20
status: written
goal: "把 brain 接到每個 agent，分開 capture 與 triage，並用 lint 修結構漂移、用 superseded 保留決策史。"
digests:
  - agentic-coding-handbook.5.part.md
  - agentic-coding-handbook.6.part.md
  - brain-template.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/centralized-brain.md"
steps:
  - id: connect-every-agent
    author: "gpt-6-luna"
    title: "把每一個 agent 接上"
    purpose: "用 install.mjs 把 skills 與一行指標接到機器上的每個 agent，並知道新增 agent 時要重跑。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L156-L206]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/install.mjs#L1-L616]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/AGENTS.md#L1-L28]]"
  - id: sync-across-machines
    author: "gpt-6-luna"
    title: "每個 agent 都讀最新版本"
    purpose: "用 sync.mjs 的 commit／pull／push 讓每個副本一致，並讓伺服器與 box 各自 clone、排程 pull、用 deploy key push。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L156-L206]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/sync.mjs#L1-L89]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/README.md#L1-L138]]"
  - id: capture-now-triage-later
    author: "gpt-6-luna"
    title: "把知識收進來"
    purpose: "把寫入拆成 capture 與 triage：capture 幾秒內落檔，triage 只替每項選一個家並清空 inbox。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L207-L234]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.6.part.txt#L1-L15]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/capture/SKILL.md#L1-L42]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/capture/scripts/new_item.py#L1-L69]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/triage/SKILL.md#L1-L42]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/inbox/README.md#L1-L4]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/inbox/2026-01-20-example-captured-link.md#L1-L11]]"
  - id: lint-structural-drift
    author: "gpt-6-luna"
    title: "為大腦做 lint"
    purpose: "用 lint 自動修死鏈與漏索引，矛盾與失效 guideline 只加警告、留給人判斷。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.6.part.txt#L16-L34]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/lint/SKILL.md#L1-L44]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/lint/scripts/lint.py#L1-L147]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/test/lint.test.mjs#L1-L73]]"
  - id: superseded-not-deleted
    author: "gpt-6-luna"
    title: "被取代，不刪除"
    purpose: "決策變更時新增檔案並用 superseded／supersedes 互連，永不刪除舊決策。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.6.part.txt#L35-L47]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/decisions/README.md#L1-L10]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/decisions/2026-01-15-postgres-default-database.md#L1-L13]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/AGENTS.md#L1-L28]]"
created: 2026-11-03
updated: 2026-11-04
---

# Connect every agent、capture 與 lint

## Lesson

儲存若超過幾秒你就不會做，手動分類則會積到沒人讀，所以 capture 與 triage 必須分開。Install 腳本把 skills 與指標行接到機器上的每個 agent，sync 腳本負責 commit、pull、push。Lint 只自動修結構問題，衝突與失效 guideline 留給人判斷；決策變更時新增檔案並標 superseded，永不刪除。

## Steps

1. [把每一個 agent 接上](connect-capture-lint/connect-every-agent.md)
2. [每個 agent 都讀最新版本](connect-capture-lint/sync-across-machines.md)
3. [把知識收進來](connect-capture-lint/capture-now-triage-later.md)
4. [為大腦做 lint](connect-capture-lint/lint-structural-drift.md)
5. [被取代，不刪除](connect-capture-lint/superseded-not-deleted.md)
