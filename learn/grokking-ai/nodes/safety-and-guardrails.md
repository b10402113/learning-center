---
id: safety-and-guardrails
title: "安全與護欄"
subject: grokking-ai
tier: 5
order: 29
status: draft
goal: "解釋 prompt injection 為何關不掉，並用護欄三明治與 action gate 把傷害限制在可承受範圍。"
digests:
  - "46. Safety and Guardrails.en.md"
prerequisites:
  - learn/grokking-ai/nodes/genai-product-designs.md
steps: []
created: 2026-11-19
updated: 2026-11-19
---

# 安全與護欄

## Lesson

根因只有一個：系統指令、使用者訊息與檢索到的文件全部是同一串 token 送到模型，而角色標籤也只是更多 token。SQL injection 有參數化查詢這個解法，這裡沒有對應物，所以 prompt injection 只能降低而不能移除——真正的保護必須長在模型外面。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
