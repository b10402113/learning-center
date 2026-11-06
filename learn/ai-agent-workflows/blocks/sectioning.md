---
id: sectioning
title: Sectioning（區塊拆分）
label: Sectioning
subject: ai-agent-workflows
type: concept
status: draft
summary: 把大任務拆成互不依賴的子任務，同時呼叫多個 LLM，最後再組裝結果。
aliases: []
prerequisites: []
related:
  - voting
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L19-L32]]
  - >-
    [[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerParallelWorkflow.js#L1-L154]]
  - >-
    [[sources/ai-agent-workflows/20261105/course/21-multi-agent-parallelization.txt#L13-L18]]
created: 2026-11-06
updated: 2026-11-06
---

# Sectioning（區塊拆分）

## 定義

Sectioning 是平行化的一種型態：把一個大任務拆成數個彼此不依賴的子任務，讓每個子任務各自呼叫一次 LLM，最後把結果組裝起來。它成立的前提是子任務之間不需要對方的輸出。

## 為什麼重要

循序鏈結必須一步一步排隊，每一步都在等前一步。只要子任務真的獨立，sectioning 就能把總延遲從「所有步驟相加」壓到「最慢的那一步」，同時讓每個 prompt 維持短小、聚焦，不必把整份需求塞進同一個呼叫。

## 如何運作

開發者先確認任務能乾淨拆解，再為每個子任務準備專屬 prompt，然後用 `Promise.all` 之類的機制同時發出所有呼叫，等全部回傳後由程式碼合併。因為子任務互不相依，任何一個先完成都不影響其他呼叫。

合併步驟可以是純程式碼，也可以是另一個 LLM。若各段只是要組裝成結構化資料，程式碼就夠；若要寫成連貫敘事，才需要再呼叫一次模型。

## 例子

職涯諮詢系統在選定職業後，同時發出三個呼叫：一個寫學習路徑、一個寫就業市場前景、一個寫日常工作樣貌。三者都只需要「職業」這個輸入，不需要彼此的結果，因此可以並行，最後組成一份完整報告。

<!-- derived -->
```javascript
const [roadmap, outlook, dayToDay] = await Promise.all([
  callLLM(ROADMAP_PROMPT, `Career: ${career}`),
  callLLM(OUTLOOK_PROMPT, `Career: ${career}`),
  callLLM(DAY_TO_DAY_PROMPT, `Career: ${career}`),
]);
```

## 邊界與常見誤解

- **不是所有任務都能拆**：只要子任務需要另一段的輸出，就必須留在同一條序列裡，硬拆會讓結果互相矛盾。
- **平行不代表免費**：同時發出多個呼叫會增加尖峰成本與速率限制壓力。
- **合併也需要設計**：子任務各自正確，不代表拼起來通順；組裝邏輯仍要驗證。

## 進階

如果任務無法乾淨拆成不同子任務，改用 [[voting]] 對同一任務重複取樣，靠冗餘換準確度。實務上兩者常混用：先用 voting 選出方向，再用 sectioning 平行補齊該方向的多個面向。
