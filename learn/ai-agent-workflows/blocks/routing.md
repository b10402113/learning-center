---
id: routing
title: "Routing（路由）"
label: "Routing"
subject: ai-agent-workflows
type: concept
status: draft
summary: "先分類輸入，再由程式碼把它送到一條預先定義好的專屬路徑。"
aliases: []
prerequisites: []
related:
  - classifier
  - route-table
  - fallback-gate
  - routing-criteria
  - sequence-vs-fork
  - monolithic-prompt
sources:
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L4-L31]]"
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L77-L105]]"
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L106-L153]]"
created: 2026-11-06
updated: 2026-11-06
---

# Routing（路由）

## 定義

Routing 是一種 workflow：先對輸入做分類，再依分類結果把它導向一條預先定義的路徑。分類步驟通常很便宜，真正的處理邏輯放在各條專屬路徑裡。

## 為什麼重要

不同型態的請求需要不同的處理方式。全部丟給同一個巨大 prompt，會讓 context 臃腫、焦點分散，還要為用不到的資訊付費。分流之後，每條路徑可以各自最佳化成本與延遲，使用者也只付自己那條路的錢。

## 如何運作

流程只有兩個動作：

1. **分類**：模型（或專門的分類模型）讀輸入，輸出一個標籤，不回答使用者的實際問題。
2. **分流**：程式碼依標籤查表，只執行對應的那一條路徑。

可以導向的目標很彈性：不同的模型（簡單任務走小模型、複雜任務走旗艦模型）、不同設定的 prompt，或純確定性的程式碼。每條路徑都能有自己的 prompt、模型與 lookup 邏輯。

## 例子

一個職涯諮詢服務把請求分成三類：不知道要做什麼、想知道某個職業怎麼進入、想從現職轉換跑道。分類器先輸出 `explore`、`roadmap` 或 `switch`，程式碼再呼叫該類專屬的 prompt。使用者的問題只會走其中一條，不會同時跑完三條。

## 邊界與常見誤解

- **是分岔，不是序列**：一次請求只走一條路徑，不會先跑 A 再跑 B。
- **不是 agent**：模型只負責分類，路徑全由開發者預先定義。
- **分類不等於回答**：若讓分類步驟順便回答問題，它就會失去「只輸出標籤」的單純性。
- **不是所有請求都值得分流**：型態少且相近時，一個 prompt 可能就夠。

## 進階

實作由三個元件組成：[[classifier]] 產生標籤、[[fallback-gate]] 確保標籤合法、[[route-table]] 把標籤對應到處理函式。判斷依據的選擇見 [[routing-criteria]]；與序列的差異見 [[sequence-vs-fork]]，而被取代的反例是 [[monolithic-prompt]]。
