---
title: Agent Engineering
subtitle: 理解 Harness，掌握執行控制權
description: 圍繞 Agent 的工具、控制權與系統邊界，建立能用於實作的工程心智模型。
level: 中階
stages:
  - id: model
    title: 模型與框架
    items:
      - id: intro
        type: article
        ref: beyond-the-model
        requires: []
      - id: concept
        type: block
        ref: agent
        requires:
          - intro
  - id: runtime
    title: 工具與執行
    items:
      - id: tools
        type: article
        ref: anatomy-of-a-tool
        requires:
          - intro
      - id: loop
        type: block
        ref: tool-loop
        requires:
          - tools
  - id: systems
    title: 控制權與協作
    items:
      - id: capabilities
        type: article
        ref: seven-harness-capabilities
        requires:
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
