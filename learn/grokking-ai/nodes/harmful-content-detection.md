---
id: harmful-content-detection
title: "設計有害內容偵測"
subject: grokking-ai
tier: 3
order: 20
status: draft
goal: "畫出風險漏斗，並解釋為何用曝光率而不是上傳數衡量成效。"
digests:
  - "24. Design Harmful Content Detection.en.md"
prerequisites:
  - learn/grokking-ai/nodes/fraud-detection.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 設計有害內容偵測

## Lesson

有害內容沿用詐騙的判斷形狀與對手，但多出三個新問題：輸入是多模態的、兩種錯誤的代價無法用錢比較、而且正常內容的量是違規內容的幾百倍。這三點合起來把設計推成一條風險漏斗，並且把衡量單位從「上傳數」換成「曝光數」。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
