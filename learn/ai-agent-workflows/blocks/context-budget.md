---
id: context-budget
title: "Context Budget（上下文預算）"
label: "Context Budget"
subject: ai-agent-workflows
type: concept
status: draft
summary: "context 是有限資源，要先盤點固定開銷，再決定檢索、壓縮與記憶策略。"
aliases: []
prerequisites: []
related:
  - reranker
  - compaction
  - lost-in-the-middle
sources:
  - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L1-L85]]"
created: 2026-11-06
updated: 2026-11-06
---

# Context Budget（上下文預算）

## 定義

Context budget 是把模型的 context window 當成有限資源來規劃：先盤點每一輪固定要佔用多少 token，再決定還剩多少空間能放檢索結果、對話歷史與其他 agent 的訊息。它是一種資源配置的觀點，不是某個特定工具。

## 為什麼重要

Context 是有限的。即使視窗已經有幾十萬甚至上百萬 token，實際運作時仍會被各種內容塞滿。多 agent 系統尤其明顯：agent 之間互相對話會產生大量文字，呼叫次數疊加後成本上升得很快；如果為了控制延遲而改用較小的模型，視窗又更窄。沒有預算概念，系統會先爆容量，再爆成本。

## 如何運作

先列出會佔用 context 的固定項目：

- **System prompt**：任務說明、行為邊界、不能洩露的資訊，以及工具呼叫格式。
- **工具與技能定義**：所有可呼叫函式的介面與參數描述。
- **其他 agent 的資訊**：在多 agent 系統中，彼此的角色、職責與狀態。
- **對話歷史**：使用者與 agent 的往返，以及 agent 之間的對話。

盤點完才知道剩餘空間，進而決定要檢索多少片段、何時壓縮，以及哪些長期記憶值得載入。

## 例子

一個多 agent 的職涯顧問系統，光是 system prompt、工具定義、各 agent 的角色說明就吃掉一大塊預算；每個 agent 又很健談，往返幾輪後中段塞滿內容。若不控制，真正關鍵的使用者條件反而會被擠到看不見的地方。

## 邊界與常見誤解

- **視窗變大不等於不用預算**：容量越大，塞進去的雜訊也越多，成本和注意力問題仍在。
- **context 不是免費的**：每一次呼叫都消耗時間與金錢。
- **不是所有 token 都一樣有用**：關鍵事實可能只有一句，其餘都是可丟棄的過程紀錄。
- **預算不是只看容量**：還要考慮模型注意力與檢索品質。

## 進階

預算規劃通常搭配三種手段：用 [[reranker]] 過濾真正有幫助的片段、用 [[compaction]] 在快滿時壓縮、用 [[maximal-marginal-relevance]] 去除重複。還要留意 [[lost-in-the-middle]]，避免關鍵資訊被埋在中段。
