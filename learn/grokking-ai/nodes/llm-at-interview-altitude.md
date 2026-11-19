---
id: llm-at-interview-altitude
title: "面試高度上的 LLM"
subject: grokking-ai
tier: 4
order: 21
status: draft
goal: "把 LLM 當一個元件，講出 prefill／decode、TTFT／TPOT，以及 context assembly 為何是設計工作。"
digests:
  - "26. Introduction LLM Serving & Inference.en.md"
  - "27. LLMs at Interview Altitude.en.md"
prerequisites:
  - learn/grokking-ai/nodes/seven-step-framework.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 面試高度上的 LLM

## Lesson

從這裡開始，模型變成系統裡最大的那一塊：一個回答要幾秒、要一分錢、跑在 GPU 上。但在面試裡你不需要解釋 transformer 的內部，只需要把 LLM 當成一個有五件事要交代的元件——輸入、輸出、延遲形狀、價格與失敗模式——其餘的深度等對方問。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
