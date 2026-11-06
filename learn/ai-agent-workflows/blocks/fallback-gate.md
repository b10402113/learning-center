---
id: fallback-gate
title: "Fallback Gate（退回關卡）"
label: "Fallback Gate"
subject: ai-agent-workflows
type: concept
status: draft
summary: "檢查分類標籤是否合法，不合法就退回安全預設路徑的純程式碼關卡。"
aliases: []
prerequisites: []
related:
  - routing
  - classifier
  - route-table
  - code-gate
sources:
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L1-L150]]"
created: 2026-11-06
updated: 2026-11-06
---

# Fallback Gate（退回關卡）

## 定義

Fallback gate 是 routing 流程中的一道純程式碼檢查。它讀取分類器輸出的標籤，確認該標籤是否對應到一個已知路徑；若不是，就退回事先指定的預設路徑，而不是讓流程崩潰或走進不存在的分支。

## 為什麼重要

分類器的輸出不是保證合法的。模型可能吐出拼錯的標籤、意料之外的字串，或一個你根本沒定義的類別。沒有這道關卡，程式在查表時會拿到 `undefined`，接著就是在錯誤的地方失敗；有了它，系統至少能給出一個安全、可預期的回應。

## 如何運作

檢查只有一個判斷：標籤在不在路由表裡。

- **在**：正規化標籤後放行，流程照原意走該條路徑。
- **不在**：記錄一則警告，改成預設路徑，並在結果裡註明這次是退回處理。

預設路徑應該是一條「最泛用、最不容易出錯」的路徑，而不是最熱門的那條。

<!-- source: sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/workflows/careerRoutingWorkflow.js#L114-L130 -->

```javascript
const DEFAULT_ROUTE = "explore";
function gate(routerOutput) {
  const route = routerOutput?.route?.trim();
  if (route in ROUTES) return { ...routerOutput, route };
  return { route: DEFAULT_ROUTE, reason: "Router output was invalid; used default route." };
}
```

## 例子

職涯服務的三條路徑是 `explore`、`roadmap`、`switch`，預設為 `explore`。若分類器回傳 `"career-change"` 這個未定義的標籤，gate 不會嘗試猜測，而是把請求送進 `explore`，讓使用者至少得到一份通用的職涯建議，同時系統留下警告供後續調整 prompt。

## 邊界與常見誤解

- **只保證標籤合法**：標籤在清單內不代表分類正確，選錯路徑仍會發生。
- **不是重試機制**：它不退回去重新分類，只換一條安全的路走。
- **預設路徑不是萬用解**：若大量請求都落到預設，代表分類器或選項設計有問題。
- **不是 LLM 判斷**：讓模型來決定「這個標籤對不對」會失去確定性，也增加成本。

## 進階

Fallback gate 是 [[code-gate]] 在 routing 場景的版本，只是檢查對象從中間輸出換成分類標籤。它與 [[classifier]] 和 [[route-table]] 必須一起設計：選項清單、預設路徑與 handler 三者的鍵值要完全對齊，否則合法的標籤也會被誤判。整體結構見 [[routing]]。
