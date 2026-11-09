---
id: agent-trace
title: "Agent Trace（Agent 執行軌跡）"
label: "Agent Trace"
subject: ai-eval
type: concept
status: draft
summary: "一條 trace 記錄一次 run 從使用者輸入、LLM 推理、工具呼叫到最終輸出的完整路徑。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1317-L1323]]"
  - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L531-L566]]"
created: 2026-11-09
updated: 2026-11-09
author: google/gemini-3.8-flash
---

# Agent Trace（Agent 執行軌跡）

<!--image:1-->

## 定義

Agent Trace（執行軌跡）是記錄 AI Agent 在單次任務執行（run）中的完整歷程。

它忠實記錄了從接收使用者輸入、內部思考、呼叫工具、檢索資料，一直到產出最終回覆的整個過程。

## 為什麼重要

當 Agent 產生錯誤回覆時，光看最後輸出的文字，往往找不出根本原因。

問題可能出在理解意圖有偏差、知識庫檢索拿到無關資料、LLM 邏輯推理錯誤，或是呼叫了錯誤的工具與參數。

Trace 提供了完整的白箱檢視路徑。

工程團隊能藉此精準定位哪一個步驟出錯，快速排查並修復系統問題。

## 如何運作

一條完整的 Trace 通常會依序記錄以下核心節點：

1. **使用者輸入（User Input）**：使用者原始發送的提問或任務指令。
2. **LLM 推理呼叫（LLM Reasoning Calls）**：模型在各階段的 Prompt、思維鏈或內部決策。
3. **工具與檢索呼叫（Tool Calls & Retrievals）**：執行的外部工具名稱、帶入的參數與回傳結果，也包含向資料庫或知識庫檢索到的上下文。
4. **最終輸出（Final Output）**：Agent 整合所有資訊後，最後呈現給使用者的回覆內容。

## 例子

以生鮮電商 Pronto 的客服 Agent 為例。

顧客提問：「我的草莓送來時爛掉了，可以退款嗎？訂單編號 PRN-84213」。

系統會留下這條 Trace：

- **使用者輸入**：詢問草莓壞掉能否退款，並提供訂單編號 PRN-84213。
- **內部推理與工具呼叫 1**：Agent 呼叫 `lookup_policy("refunds_perishables")`，取得規定「生鮮破損可在到貨 24 小時內全額退款，但需提供照片」。
- **內部推理與工具呼叫 2**：呼叫 `get_order_status("PRN-84213")`，確認訂單在 2 小時前送達，金額為 18 美元，未超過 50 美元的人工審核上限。
- **內部推理**：判斷符合時限與金額條件，但顧客尚未提供損壞照片。
- **最終輸出**：「很抱歉收到品質不佳的草莓！生鮮商品到貨 24 小時內可辦理全額退款，請您直接回傳草莓受損的照片，我會立即為您處理退款。」

## 邊界與常見誤解

最常見的誤解，是把 Trace 當成「客服對話紀錄（Chat Transcript）」。

對話紀錄只呈現使用者與客服之間一來一往的表面文字，本質上是黑箱紀錄。

Trace 則包含背後所有肉眼看不見的中間歷程。

這包括呼叫了哪些 API、代入什麼參數、檢索回傳了哪些內容，以及模型在中間做的所有判斷。

## 進階

在大型語言模型應用的評估（Eval）體系中，Trace 是進行錯誤分析（Failure Analysis）的基本單元。

團隊能將大量 Trace 進行自動化比對，或交由評鑑模型審查。

這樣能快速統計出各種失敗模式的比例，例如工具呼叫錯誤、違反政策或檢索未命中。

團隊也能藉由這些數據，明確決定優化 Prompt 或微調工具的優先順序。
