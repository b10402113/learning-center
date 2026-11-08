---
id: trustworthy-eval-datasets
title: "值得信任的 eval dataset"
subject: ai-eval
tier: 4
order: 12
status: draft
goal: "能建出 representative、diverse、correctly labeled、versioned 的 golden set，並安全地生成與驗證 synthetic cases。"
digests:
  - lesson7.en.md
  - AI_Evals_Week4_Deck.md
prerequisites:
  - learn/ai-eval/nodes/task-dataset-scorer.md
  - learn/ai-eval/nodes/trace-to-failure-taxonomy.md
steps: []
created: 2026-11-08
updated: 2026-11-08
---

# 值得信任的 eval dataset

## Lesson

Week 4 先把資料弄對：一份可信的 golden set 要 representative、diverse、correctly labeled、versioned，而且每筆記錄要帶 criteria 式的 ground truth 與可切片的 metadata。這條節點也講 synthetic data 的正確用法：它可以補量與補風險，但沒有驗證的 synthetic 等於讓模型自己改考卷。最後把 dataset 釘成版本，後面的比較才有意義。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
