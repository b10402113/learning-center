---
id: hooks
title: "Hooks"
subject: ai-agent-engineer
tier: 2
order: 11
status: written
goal: "用五個 hook 把危險指令、secret、紅燈測試與 session context 變成每次都會執行的 gate。"
digests:
  - agentic-coding-handbook.3.part.md
  - course-kit.md
  - ticket-bay.1.part.md
  - ticket-bay.2.part.md
  - ticket-bay.3.part.md
  - ticket-bay.4.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps:
  - id: rules-are-not-gates
    author: "gpt-6-luna"
    title: "規則，還是 hook？"
    purpose: "分辨文字規則與 hook，用事件、判斷、刪除三分法審 AGENTS.md，指出哪一行該變成 gate。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L56-L65]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L66-L103]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L205-L237]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/README.md#L1-L100]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/AGENTS.md#L1-L13]]"
  - id: gate-dangerous-commands
    author: "gpt-6-luna"
    title: "擋下危險指令"
    purpose: "寫出第一個阻擋型 hook：在 PreToolUse 擋下危險指令，用 exit 2 加理由讓 agent 改走別條路。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L66-L103]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L104-L164]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/README.md#L1-L100]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m8/config-pack/hooks/guard-network.sh#L1-L42]]"
  - id: stop-secrets-at-read-time
    author: "gpt-6-luna"
    title: "把 secret 擋在外面"
    purpose: "在讀取層擋住 secret 與測試設定，只放行 .env.example，並說明為何讀進來等於送給 model provider。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L66-L103]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L104-L164]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/README.md#L1-L100]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m8/config-pack/hooks/guard-network.sh#L1-L42]]"
  - id: test-gate-and-fast-feedback
    author: "gpt-6-luna"
    title: "Test gate 與 fast feedback"
    purpose: "用 Stop 與 PostToolUse hook 讓紅燈測試和型別錯誤自動回到 agent，並設好三輪逃脫閥。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L104-L164]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L165-L204]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/README.md#L1-L100]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m8/config-pack/hooks/verify-tests.sh#L1-L41]]"
  - id: session-context-and-honest-limits
    author: "gpt-6-luna"
    title: "每次 session 開始，就知道現在的位置"
    purpose: "讓 session 開場自動載入 git 現況與決策檔，並在換 harness 時改對事件名、說出 pattern guard 的極限。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L104-L164]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/README.md#L1-L100]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m2/five-hooks/hermes/config-hooks.yaml#L1-L29]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m8/config-pack/hooks/notify-picked-up.py#L1-L49]]"
created: 2026-11-03
updated: 2026-11-04
---

# Hooks

## Lesson

寫在 AGENTS.md 的規則只是文字，模型沒有義務遵守；hook 是在固定時點自動執行的腳本。阻擋型 hook 不讓 agent 崩潰，而是回傳原因，讓它改走別條路。五個必備 hook 分別管危險指令、secret、測試 gate、編輯後回饋與 session 開場。

## Steps

1. [規則，還是 hook？](hooks/rules-are-not-gates.md)
2. [擋下危險指令](hooks/gate-dangerous-commands.md)
3. [把 secret 擋在外面](hooks/stop-secrets-at-read-time.md)
4. [Test gate 與 fast feedback](hooks/test-gate-and-fast-feedback.md)
5. [每次 session 開始，就知道現在的位置](hooks/session-context-and-honest-limits.md)
