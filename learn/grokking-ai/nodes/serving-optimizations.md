---
id: serving-optimizations
title: "服務優化三層架"
subject: grokking-ai
tier: 4
order: 23
status: draft
goal: "依序講出避免呼叫、調引擎、換模型三層優化，以及每一層的代價與量測方式。"
digests:
  - "30. Serving Optimizations.en.md"
prerequisites:
  - learn/grokking-ai/nodes/inference-economics.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 服務優化三層架

## Lesson

省錢與降延遲的技術分三層，必須由上往下試：先讓呼叫根本不發生，再讓每一次呼叫變便宜，最後才換一個模型。從底層開始是最常見的錯誤，因為一趟沒有發生的呼叫不花任何 GPU 時間，而換模型卻要付出品質與工程的代價。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
