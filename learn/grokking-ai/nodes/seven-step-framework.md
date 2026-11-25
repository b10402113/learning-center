---
id: seven-step-framework
title: 回答 AI 設計題的七步框架
subject: grokking-ai
tier: 1
order: 4
status: written
goal: 講出七步的順序、每一步的產出，以及 45 分鐘如何分配到這七步。
digests:
  - 5. A Framework for AI Design Answers.en.md
prerequisites:
  - learn/grokking-ai/nodes/ai-interview-landscape.md
  - learn/grokking-ai/nodes/three-question-families.md
steps:
  - id: two-breaks-and-seven-steps
    author: google/gemini-3.8-flash
    title: AI 系統設計的七步框架
    purpose: 說出經典骨架在哪兩個地方斷掉，並按順序唸出七步。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/5. A Framework for AI Design
        Answers.en.txt#L1-L35]]
    blocks:
      - seven-step-framework
      - classic-skeleton-two-breaks
  - id: frame-and-define-success
    author: google/gemini-3.8-flash
    title: 做好 AI 系統設計的開場：從系統家族、界定範圍到四個成功數字
    purpose: 用家族與已知系統開場、明確講出範圍，並用四個數字把成功定義清楚。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/5. A Framework for AI Design
        Answers.en.txt#L37-L55]]
    blocks:
      - four-success-numbers
  - id: map-the-data-and-pick-the-model
    author: google/gemini-3.8-flash
    title: 從資料特性到模型升級：AI 系統設計的關鍵步驟
    purpose: 依標籤延遲與新鮮度描述資料，並從 baseline 出發給三個家族各一個有條件的升級。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/5. A Framework for AI Design
        Answers.en.txt#L57-L91]]
    blocks:
      - baseline-and-upgrade-triggers
  - id: design-the-serving-path
    author: google/gemini-3.8-flash
    title: 用三個問題規劃 AI 系統的服務路徑
    purpose: 用三個問題畫出服務路徑：什麼先算、誰走便宜路、模型逾時或掛掉怎麼辦。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/5. A Framework for AI Design
        Answers.en.txt#L93-L101]]
    blocks:
      - serving-path-three-questions
  - id: close-the-loop-and-count-costs
    author: google/gemini-3.8-flash
    title: AI 系統設計的面試節奏：三階段上線、兩本帳與 45 分鐘配比
    purpose: 講出三階段上線、兩本帳，並把 45 分鐘分配到七步。
    sources:
      - >-
        [[sources/grokking-ai/20261119/course/5. A Framework for AI Design
        Answers.en.txt#L103-L145]]
    blocks:
      - seven-step-framework
      - baseline-and-upgrade-triggers
      - serving-path-three-questions
      - classic-skeleton-two-breaks
created: 2026-11-19T00:00:00.000Z
updated: 2026-11-25T00:00:00.000Z
---

# 回答 AI 設計題的七步框架

## Lesson

經典的系統設計骨架在兩個地方失效：模型的品質是一個數字而不是事實，而且真正的結果在回應之後才出現，所以答案必須以一個迴圈收尾。七步框架就是修好這兩點的思考順序——界定問題、定義成功、對資料、選模型、設計服務路徑、讓它持續運作、算成本。

## Steps

1. [AI 系統設計的七步框架](seven-step-framework/two-breaks-and-seven-steps.md)
2. [做好 AI 系統設計的開場：從系統家族、界定範圍到四個成功數字](seven-step-framework/frame-and-define-success.md)
3. [從資料特性到模型升級：AI 系統設計的關鍵步驟](seven-step-framework/map-the-data-and-pick-the-model.md)
4. [用三個問題規劃 AI 系統的服務路徑](seven-step-framework/design-the-serving-path.md)
5. [AI 系統設計的面試節奏：三階段上線、兩本帳與 45 分鐘配比](seven-step-framework/close-the-loop-and-count-costs.md)
