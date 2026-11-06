---
id: route-menu
title: "Route Menu（路徑選單）"
label: "Route Menu"
subject: ai-agent-workflows
type: concept
status: draft
summary: "Dispatcher 能選的有限路徑集合，每一條都是一個有自己工具與角色的完整 agent。"
aliases: []
prerequisites: []
related:
  - dispatcher
  - clarification-lane
  - bad-route-recovery
sources:
  - "[[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L39-L116]]"
created: 2026-11-06
updated: 2026-11-06
---

# Route Menu（路徑選單）

## 定義

Route menu 是 dispatcher 可選的固定路徑清單。每一條 route（lane）對應一個專門 agent，擁有自己的角色設定、ReAct 迴圈與工具。分類器的工作不是發明新路徑，而是從這份已知清單中選出一條。

## 為什麼重要

選單的品質直接決定分類的難度與系統的可靠度。類別若彼此清楚、數量有限，模型很容易選對；類別若重疊、名稱模糊或數量太多，分類就會變成猜測。選單同時也是系統的能力邊界：不在選單上的需求，系統沒有正常路徑可以處理。

## 如何運作

1. 開發者先列出所有要支援的請求型態。
2. 每一型態建立一個專門 agent，並寫清楚它的名稱與描述。
3. 把這份清單放進分類器的提示詞，要求它只回傳其中一個名稱。
4. 程式碼用名稱查表，找到對應 agent 並轉交請求。
5. 若模型回傳不在清單上的名稱，走預設 agent 或觸發澄清。

## 例子

職涯產品的選單只有三條：職涯探索、培訓課程、資金補助。使用者大多只想做其中一件事，三條 lane 的職責邊界清楚，分類器很容易判斷。若實務上發現「我還沒決定方向」這種模糊輸入很多，可以再加第四條澄清 lane。

## 邊界與常見誤解

- **選單不是愈大愈好**：每多一條 lane，分類器要分辨的邊界就更多，錯誤率也跟著上升。
- **選單不是動態計畫**：dispatcher 不會根據輸入產生新路徑；它只在既有集合裡挑。
- **名稱與描述就是介面**：模型只看到這些文字，描述寫得含糊，等於讓它盲選。
- **預設值不是萬解**：有預設 agent 可以避免系統崩潰，但不會讓錯路的路徑變對。

## 進階

整體分流流程見 [[dispatcher]]。用選單處理模糊輸入的方法，見 [[clarification-lane]]；選錯後的補救見 [[bad-route-recovery]]。
