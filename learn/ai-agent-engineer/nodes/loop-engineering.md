---
id: loop-engineering
title: "Loop engineering"
subject: ai-agent-engineer
tier: 1
order: 6
status: written
goal: "用 trigger、goal check、停止機制把多個 session 串成一個不會提早停的 loop。"
digests:
  - agentic-coding-handbook.1.part.md
  - agentic-coding-handbook.7.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
  - "learn/ai-agent-engineer/nodes/memory-engineering.md"
steps:
  - id: the-loop-runs-the-sessions
    author: "gpt-6-luna"
    title: "這個 loop 跑的是 session"
    purpose: "能區分 agent loop 與跨 session 的 loop，並說出一輪 discover→plan→do→verify→fix 在做什麼。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L570-L586]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.7.part.txt#L23-L36]]"
  - id: when-a-task-fits-a-loop
    author: "gpt-6-luna"
    title: "When a task fits"
    purpose: "能用三個條件判斷任務該不該進 loop，並解釋開放迴圈為何不適合當起點。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.7.part.txt#L37-L60]]"
  - id: the-six-parts
    author: "gpt-6-luna"
    title: "Loop 的六個零件"
    purpose: "說出 loop 六個零件各自的職責，並解釋 checker 為何不能由同一個 agent 兼任。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.7.part.txt#L61-L113]]"
  - id: stops-and-the-gate
    author: "gpt-6-luna"
    title: "The stop has to be a signal it cannot fake"
    purpose: "用 run cap、token budget、no-progress check 與不可爭辯的 gate 讓 loop 停在真的完成。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L587-L596]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.7.part.txt#L114-L119]]"
created: 2026-11-03
updated: 2026-11-04
---

# Loop engineering

## Lesson

沒有 loop 時，你就是 loop：寫 prompt、讀結果、再打下一個 prompt。Loop 把 trigger、目標檢查與停止機制接起來，讓工作不必由你啟動。停止訊號必須是 agent 無法偽造的，否則它會在測試仍紅時回報成功。

## Steps

1. [這個 loop 跑的是 session](loop-engineering/the-loop-runs-the-sessions.md)
2. [When a task fits](loop-engineering/when-a-task-fits-a-loop.md)
3. [Loop 的六個零件](loop-engineering/the-six-parts.md)
4. [The stop has to be a signal it cannot fake](loop-engineering/stops-and-the-gate.md)
