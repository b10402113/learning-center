---
id: memory-engineering
title: "Memory engineering"
subject: ai-agent-engineer
tier: 1
order: 5
status: written
goal: "分清 memory 與 context，判斷什麼該進 memory、放哪裡、由誰寫。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/the-map.md"
  - "learn/ai-agent-engineer/nodes/model-prompt-context.md"
steps:
  - id: memory-vs-context
    author: "gpt-6-luna"
    title: "Memory 決定 agent 能知道什麼，context 決定這次呼叫用什麼"
    purpose: "能說出 memory 是 session 開始讀的檔案、context 是這次呼叫用的內容，並解釋沒有 memory 為何會重複已否決的選擇。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L551-L556]]"
  - id: what-goes-in-memory
    author: "gpt-6-luna"
    title: "什麼該放進 memory？"
    purpose: "判斷哪些內容該進 memory（意圖、決策與理由、商業脈絡），並把程序性知識留在 harness 的 script 或 skill。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L557-L560]]"
  - id: where-memory-lives
    author: "gpt-6-luna"
    title: "記憶住在哪裡"
    purpose: "把程式碼看不出的事放進 AGENTS.md，其餘放進獨立 git repo 的第二大腦，並讓所有 agent 共讀共寫。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L561-L565]]"
  - id: who-writes-and-reviews
    author: "gpt-6-luna"
    title: "誰來寫？"
    purpose: "能說明 agent 在學到時寫 memory、你用 git diff 審查，並知道跨 session 的目標要交給 loop。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L566-L569]]"
created: 2026-11-03
updated: 2026-11-04
---

# Memory engineering

## Lesson

Context 管這一次呼叫讀到什麼，memory 管下一個 session 一開始就知道什麼。程式碼只留下做了什麼，理由、否決過的選項與商業脈絡都必須另外存。Memory 的三個問題是 what goes in、where it lives、who writes it。

## Steps

1. [Memory 決定 agent 能知道什麼，context 決定這次呼叫用什麼](memory-engineering/memory-vs-context.md)
2. [什麼該放進 memory？](memory-engineering/what-goes-in-memory.md)
3. [記憶住在哪裡](memory-engineering/where-memory-lives.md)
4. [誰來寫？](memory-engineering/who-writes-and-reviews.md)
