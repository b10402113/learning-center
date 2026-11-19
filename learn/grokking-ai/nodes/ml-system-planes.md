---
id: ml-system-planes
title: "ML 系統的基本結構"
subject: grokking-ai
tier: 2
order: 6
status: draft
goal: "畫出離線面、線上面與回饋迴路，並說出模型 registry、logs、feature store 三者怎麼把兩面接起來。"
digests:
  - "7. Introduction ML Systems Foundations.en.md"
prerequisites:
  - learn/grokking-ai/nodes/seven-step-framework.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# ML 系統的基本結構

## Lesson

一個 ML 系統不是一個模型檔，而是「產生預測、送出預測、讓預測維持準確」所需的全部東西。它有三個部分：離線面負責訓練，線上面負責推論，回饋迴路把真實結果帶回下一次訓練；而 registry、logs 與 feature store 是唯一跨越這三者的三條線。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
