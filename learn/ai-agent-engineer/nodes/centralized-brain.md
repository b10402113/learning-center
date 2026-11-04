---
id: centralized-brain
title: "The centralized brain"
subject: ai-agent-engineer
tier: 5
order: 19
status: written
goal: "用 index、inbox、intents、guidelines、decisions、taste、sources 建一個所有 agent 共用的第二大腦。"
digests:
  - agentic-coding-handbook.5.part.md
  - brain-template.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/memory-engineering.md"
  - "learn/ai-agent-engineer/nodes/instruction-file-and-skills.md"
steps:
  - id: why-a-second-brain
    author: "gpt-6-luna"
    title: "沒有共享記憶，你有三個壞選項"
    purpose: "說出沒有共享記憶時的三個壞選項，並用專案層／大腦層解釋為什麼需要跨專案的第二大腦。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L1-L24]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L25-L73]]"
  - id: folder-contract
    author: "gpt-6-luna"
    title: "裡面有什麼"
    purpose: "用 index、inbox、intents、guidelines、taste、decisions、projects、notes、sources 說出每個資料夾的職責。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L74-L131]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/README.md#L1-L138]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/index.md#L1-L19]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/AGENTS.md#L1-L28]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/inbox/README.md#L1-L4]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/intents/README.md#L1-L7]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/guidelines/README.md#L1-L4]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/decisions/README.md#L1-L10]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/projects/README.md#L1-L4]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/notes/README.md#L1-L4]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/sources/README.md#L1-L4]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/taste.md#L1-L14]]"
  - id: index-first-retrieval
    author: "gpt-6-luna"
    title: "檢索就是 index 加 grep"
    purpose: "用一檔一行的 index 加 grep 檢索大腦，並在證據不足時誠實回報，而不是編造答案。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L74-L131]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/index.md#L1-L19]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/AGENTS.md#L1-L28]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/ask-brain/SKILL.md#L1-L42]]"
  - id: judgement-layer
    author: "gpt-6-luna"
    title: "決策不會被刪除，只會標成 superseded"
    purpose: "把 guidelines、taste、decisions 寫成有理由、日期與來源的檔案，並用 superseded 保留決策史。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L132-L155]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/taste.md#L1-L14]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/decisions/README.md#L1-L10]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/decisions/2026-01-15-postgres-default-database.md#L1-L13]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/guidelines/integration-tests-real-database.md#L1-L11]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/guidelines/test-behavior-not-implementation.md#L1-L16]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/notes/why-mocks-hide-database-bugs.md#L1-L11]]"
  - id: daily-loop
    author: "gpt-6-luna"
    title: "擷取、分類、檢查"
    purpose: "跑一次從 inbox 落地到 triage、sync、lint、ask-brain 的日常循環，讓大腦持續可用。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L132-L155]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt#L207-L234]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/capture/SKILL.md#L1-L42]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/triage/SKILL.md#L1-L42]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/skills/lint/SKILL.md#L1-L44]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/brain-template/sync.mjs#L1-L89]]"
created: 2026-11-03
updated: 2026-11-04
---

# The centralized brain

## Lesson

沒有共享記憶時，只能在每次重講、複製規則到每個專案、或只用本機 global 檔之間三選一。第二大腦是一個跨專案的 markdown git repo，所有 agent 讀寫同一份。Index 讓 agent 先讀一行摘要，而不是先掃全庫。

## Steps

1. [沒有共享記憶，你有三個壞選項](centralized-brain/why-a-second-brain.md)
2. [裡面有什麼](centralized-brain/folder-contract.md)
3. [檢索就是 index 加 grep](centralized-brain/index-first-retrieval.md)
4. [決策不會被刪除，只會標成 superseded](centralized-brain/judgement-layer.md)
5. [擷取、分類、檢查](centralized-brain/daily-loop.md)
