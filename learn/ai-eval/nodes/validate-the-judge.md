---
id: validate-the-judge
title: "用真人標籤驗證 judge"
subject: ai-eval
tier: 2
order: 7
status: draft
goal: "能用 agreement matrix、Cohen's κ 與 false-pass quadrant 判斷一個 judge 能不能上線。"
digests:
  - lesson3.en.md
  - AI_Evals_InPractice_Week2_Deck.md
  - lesson4.en.md
  - Week-2-Assignment-1-Step-by-Step-Walkthrough.md
prerequisites:
  - learn/ai-eval/nodes/binary-judge-rubric.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 用真人標籤驗證 judge

## Lesson

judge 不能假設可用：要拿真人標籤對照，算 agreement 與 Cohen's κ，逐條讀 false pass，才決定能不能上線。這條節點把「我覺得 judge 很準」變成可反駁的數字，也解釋為什麼 94% agreement 可能只有 κ 0.24，以及 TPR/TNR 為什麼要一起看。通過門檻之後，還要到 held-out set 上再驗一次。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
