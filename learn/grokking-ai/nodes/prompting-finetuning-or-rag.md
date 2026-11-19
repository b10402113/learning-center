---
id: prompting-finetuning-or-rag
title: "提示、微調，還是 RAG"
subject: grokking-ai
tier: 4
order: 24
status: draft
goal: "用「缺事實還是缺行為」診斷，說出三者的分工、上線時機與不可跨越的紅線。"
digests:
  - "31. Prompting, Fine-Tuning, or RAG.en.md"
prerequisites:
  - learn/grokking-ai/nodes/llm-at-interview-altitude.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 提示、微調，還是 RAG

## Lesson

這三個工具不是一個階梯。RAG 改變模型知道什麼，微調改變模型怎麼表現，而提示同時做一點點這兩件事，而且永遠是起點。真正的技術是從提示的基線出發，把每一個失敗分類到「缺事實」或「缺行為」，然後才知道該動哪一個。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
