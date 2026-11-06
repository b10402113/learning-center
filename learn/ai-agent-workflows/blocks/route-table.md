---
id: route-table
title: "Route Table（路由表）"
label: "Route Table"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用物件或字典把每個分類標籤對應到專屬處理函式，查表即可分流。"
aliases: []
prerequisites: []
related:
  - routing
  - classifier
  - fallback-gate
sources:
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L1-L150]]"
created: 2026-11-06
updated: 2026-11-06
---

# Route Table（路由表）

## 定義

Route table 是一個查表結構，把每個分類標籤對應到該走的路徑或處理函式。分類器只產生標籤，程式碼用這個表把標籤翻譯成實際要執行的邏輯。

## 為什麼重要

它把「有哪些路徑」集中成一個地方。新增一種請求型態時，只需要在表裡加一個項目，再在分類 prompt 補一條說明，其他路徑的程式碼完全不用動。這讓 routing 系統可以逐步長大，而不是每次擴充都重寫入口邏輯。

## 如何運作

表以標籤為鍵、處理函式為值。流程拿到標籤後，用一次查表就得到對應的 handler，再把它呼叫起來。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L106-L114 -->

```javascript
const ROUTES = {
  explore: (input) => callLLM(EXPLORE_PROMPT, input),
  roadmap: (input) => callLLM(ROADMAP_PROMPT, input),
  switch: (input) => callLLM(SWITCH_PROMPT, input),
};
const DEFAULT_ROUTE = "explore";
```

每條路徑可以各自接不同的 prompt、模型，或甚至是純程式碼的 lookup，彼此互不影響。

## 例子

職涯服務的 route table 有三個鍵，分別指向三個不同的 prompt。使用者問「我喜歡動物跟科學，討厭坐辦公室」時，分類器給出 `explore`，查表後只會執行 `EXPLORE_PROMPT` 那條路；`ROADMAP_PROMPT` 與 `SWITCH_PROMPT` 從頭到尾不會被組進 context。

## 邊界與常見誤解

- **表要與分類器同步**：分類 prompt 新增標籤、表忘了加，該請求就會落到 fallback。
- **不是動態學習**：route table 是開發者寫死的對應，不會自己長出新路徑。
- **查表不是分類**：表不判斷請求屬於哪類，它只負責「標籤 → 行為」的翻譯。
- **鍵值要正規化**：模型輸出可能帶空白或大小寫差異，進表前要先清理。

## 進階

Route table 與 [[classifier]]、[[fallback-gate]] 是一組：分類器產生鍵，fallback gate 保證鍵合法，表負責把鍵變成行為。要新增路徑時，三處都要同步更新。整體設計見 [[routing]]。
