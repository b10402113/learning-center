---
id: case-studies-products
title: "系統設計案例：會議助理、大規模生圖、自主編碼代理"
subject: grokking-ai
tier: 6
order: 37
status: draft
goal: "用不同的延遲體制與成本結構，拆解三個產品型系統的設計。"
digests:
  - "62. System Design of an AI Meeting Assistant.en.md"
  - "63. System Design of a Text-to-Image Product at Scale.en.md"
  - "64. System Design of an Autonomous Coding Agent.en.md"
prerequisites:
  - learn/grokking-ai/nodes/how-to-run-a-case-study.md
  - learn/grokking-ai/nodes/genai-product-designs.md
  - learn/grokking-ai/nodes/agentic-systems.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 系統設計案例：會議助理、大規模生圖、自主編碼代理

## Lesson

這三個產品型案例的共同點是：限制來自延遲體制與成本結構，而不是模型能力。會議助理是三條時間尺度完全不同的通道共用一份資料；大規模生圖把 GPU 利用率變成整個設計的主軸；自主編碼代理則靠沙箱把「代理安不安全」轉換成「這份 diff 好不好」。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
