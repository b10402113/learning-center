---
id: prompt-injection
title: "Prompt injection"
subject: ai-agent-engineer
tier: 7
order: 23
status: draft
goal: "把 email 當資料而非指令，用 trifecta 與多層防線擋住注入，並用攻擊信驗證。"
digests:
  - agentic-coding-handbook.7.part.md
  - agentic-coding-handbook.8.part.md
  - skills.1.part.md
  - course-kit.md
prerequisites: []
steps: []
created: 2026-11-03
updated: 2026-11-03
---

# Prompt injection

## Lesson

Email 來自任何人，指令與資料在同一個 window 裡，模型無法可靠分辨來源。致命三要素是 private data、untrusted content 與 exfiltration 通道，拿掉任一項就沒有路徑。防線由弱到強：prompt 宣告、專用 inbox、關掉 web fetch、guard hook、網路 allowlist，最後仍由人看 diff。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
