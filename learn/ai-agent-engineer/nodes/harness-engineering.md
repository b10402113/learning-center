---
id: harness-engineering
title: "Harness engineering"
subject: ai-agent-engineer
tier: 1
order: 4
status: written
goal: "用 tools、permissions、verification、routing 補上模型外的機器，讓一次 run 可靠。"
digests:
  - agentic-coding-handbook.1.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/the-map.md"
  - "learn/ai-agent-engineer/nodes/model-prompt-context.md"
steps:
  - id: harness-and-the-agent-loop
    author: "gpt-6-luna"
    title: "Agent loop"
    purpose: "能說明 agent loop 是 harness 送 window、執行 tool call 再把結果回灌，直到模型只回文字。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L516-L527]]"
  - id: default-harness-gaps
    author: "gpt-6-luna"
    title: "預設的 harness 不認識你的專案"
    purpose: "能從猜 API、分類器核准與無人驗證三種失敗，指出預設 harness 不知道你專案的三個缺口。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L528-L531]]"
  - id: tools-and-permissions
    author: "gpt-6-luna"
    title: "Harness 用 tools 與 permissions 補上的缺口"
    purpose: "能用 tools／sub-agents 與 permissions 補上「不會做」與「做過頭」兩種缺口。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L532-L539]]"
  - id: verification-routing-and-the-rule
    author: "gpt-6-luna"
    title: "每犯一次錯，就加一條規則或一道檢查"
    purpose: "能用 verification 與 routing 讓 run 自己證明完成，並以「每犯一次錯加一條規則」補 harness。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L540-L547]]"
created: 2026-11-03
updated: 2026-11-04
---

# Harness engineering

## Lesson

模型只會回文字或 tool call，真正執行的是模型外的 harness。預設 harness 不認識你的專案，所以會猜 API、漏掉風險操作、讓 agent 自認完成。Harness engineering 的原則是：agent 每犯一次錯，就替它加一條規則或檢查。

## Steps

1. [Agent loop](harness-engineering/harness-and-the-agent-loop.md)
2. [預設的 harness 不認識你的專案](harness-engineering/default-harness-gaps.md)
3. [Harness 用 tools 與 permissions 補上的缺口](harness-engineering/tools-and-permissions.md)
4. [每犯一次錯，就加一條規則或一道檢查](harness-engineering/verification-routing-and-the-rule.md)
