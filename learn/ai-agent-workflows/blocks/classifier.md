---
id: classifier
title: "Classifier（分類器）"
label: "Classifier"
subject: ai-agent-workflows
type: concept
status: draft
summary: "只負責把輸入歸類成預先給定選項之一的模型或 prompt，輸出單一標籤。"
aliases: []
prerequisites: []
related:
  - routing
  - route-table
  - fallback-gate
  - structured-json-output
sources:
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L4-L31]]"
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L32-L76]]"
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L1-L150]]"
created: 2026-11-06
updated: 2026-11-06
---

# Classifier（分類器）

## 定義

Classifier 是一個只做分類的元件：它讀取輸入，從預先給定的選項中挑出一個，並輸出對應的標籤。它不回答使用者的問題，也不產生長篇說明。

## 為什麼重要

路由的難點原本是「判斷該走哪條路」。分類器把它轉換成一張選擇題：你給定選項，模型只負責選一個。相較於要求一個全能的模型即時思考路徑，這種任務更窄、更穩定，也更容易用便宜的方式完成。

## 如何運作

一個可用的分類器需要兩件事：

1. **選項清單**：列出每個標籤，並寫清楚它代表什麼，以及什麼情況不屬於它。
2. **輸出格式**：要求只回傳標籤（通常加上一句理由），最好用固定 schema 的 JSON。

呼叫端拿到標籤後才決定路徑。分類器本身不知道每條路徑長什麼樣，也不需要知道。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L39-L43 -->

```text
Classify the user's message into exactly ONE category:
- "explore": ...
- "roadmap": ...
- "switch": ...
Respond ONLY with JSON: {"route": "explore" | "roadmap" | "switch", "reason": "..."}
```

## 例子

職涯服務的分類器有三個標籤：`explore`（還沒決定方向）、`roadmap`（已指定職業，想知道怎麼進入）、`switch`（已有工作，想轉職）。它只輸出其中一個與一句理由，程式碼再依標籤查表，呼叫該類專屬的 prompt。

## 邊界與常見誤解

- **只會選你給的選項**：沒定義的輸入，它仍會硬選一個最接近的標籤，不會主動說「以上皆非」。
- **不是回答者**：若讓它順便產生答案，輸出會變長，分類也會失焦。
- **不是一定要用 LLM**：專門的分類模型或簡單規則也能勝任，成本可能更低。
- **標籤命名影響準確度**：選項名稱模糊或互相重疊，分類就會不穩。

## 進階

分類器的輸出必須被驗證，這就是 [[fallback-gate]] 的工作；被選中的標籤如何對應到處理函式，見 [[route-table]]。要讓標籤可被程式精確解析，先套用 [[structured-json-output]]；整體流程見 [[routing]]。
