---
id: inference-economics
title: "推論經濟學與信封背面估算"
subject: grokking-ai
tier: 4
order: 22
status: draft
goal: "用「單價一個單位 × 量」算出帳單，並判斷自架與 API 的損益兩平點。"
digests:
  - "28. Inference Economics.en.md"
  - "29. Back of the Envelope Math for AI Systems.en.md"
prerequisites:
  - learn/grokking-ai/nodes/llm-at-interview-altitude.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 推論經濟學與信封背面估算

## Lesson

LLM 的請求上有兩個表：延遲表與成本表。成本不是按請求算，而是按 token 算，所以一段十輪對話比十次獨立問答貴得多。這個 node 給你一組可以記住的錨點，以及一個習慣——先替一個單位定價，再乘上量。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
