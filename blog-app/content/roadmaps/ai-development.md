---
title: AI Development
subtitle: 從模型呼叫，到可靠的 Agent
description: 從 AI 開發的基本概念出發，逐步理解工具呼叫、記憶與 Agent 執行框架。沿著文章深入，再用知識塊補齊觀念。
level: 入門 → 進階
stages:
  - id: foundations
    title: 建立心智模型
    description: 先理解模型與 Agent 的分工
    items:
      - id: model
        type: article
        ref: beyond-the-model
        requires: []
      - id: agent
        type: block
        ref: agent
        requires:
          - model
  - id: tools
    title: 讓模型採取行動
    description: 從文字輸出，走向工具執行
    items:
      - id: tool
        type: article
        ref: anatomy-of-a-tool
        requires:
          - model
      - id: tool-calling
        type: block
        ref: tool-calling
        requires:
          - tool
      - id: loop
        type: block
        ref: tool-loop
        requires:
          - tool-calling
  - id: context
    title: 管理記憶與 Context
    description: 給模型剛好足夠的資訊
    items:
      - id: history
        type: article
        ref: history-state-context
        requires:
          - tool
      - id: context-growth
        type: article
        ref: when-context-grows
        requires:
          - history
  - id: production
    title: 組合可靠的系統
    description: 把小塊串成真正能工作的 Agent
    items:
      - id: capabilities
        type: article
        ref: seven-harness-capabilities
        requires:
          - context-growth
          - loop
      - id: handoff
        type: article
        ref: handoff-and-subagents
        requires:
          - capabilities
status: published
date: '2026-11-18'
---
每一條路線都由可以獨立閱讀的文章與知識塊組成。依照階段前進，或從你想解決的問題開始。
