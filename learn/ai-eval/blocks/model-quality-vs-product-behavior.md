---
id: model-quality-vs-product-behavior
title: "Model Quality vs Product Behavior（模型品質與產品行為）"
label: "Model Quality vs Behavior"
subject: ai-eval
type: contrast
status: draft
summary: "模型品質問輸出對不對，產品行為問有沒有解決使用者真正的目標，兩者需要不同的 eval。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L321-L430]]"
  - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L641-L720]]"
created: 2026-11-09
updated: 2026-11-09
author: google/gemini-3.8-flash
---

# Model Quality vs Product Behavior（模型品質與產品行為）

<!--image:1-->

## A 是什麼

模型品質（Model Quality）衡量的是大型語言模型產出的文字內容本身是否正確、合理且有所依據。它回答的核心問題是：「輸出的內容對不對？」

評估模型品質時，團隊關注以下面向：

- **真實性與事實準確度（Faithfulness & Factual Accuracy）**：內容是否符合給定的參考文件或現實世界的事實，有沒有產生幻覺。
- **完整性（Completeness）**：是否遺漏了回答該問題必須包含的關鍵資訊。
- **連貫性（Coherence）**：語法是否通順、邏輯結構是否清楚易讀。

這類評估通常透過大型語言模型作為評判者（LLM Judge）、人工專家審查（Human Review），或是與標準參考答案進行文字比對來完成。

## B 是什麼

產品行為（Product Behavior）衡量的是 AI 系統在實際互動情境中，是否真正達成了使用者的最終目的。它回答的核心問題是：「系統有沒有解決使用者真正的目標？」

評估產品行為時，團隊關注的是整個互動與決策流程：

- **回答正確的問題（Right Question Answered）**：系統是否正確捕捉使用者的核心意圖，而不是把力氣花在表面字義或無關方向。
- **任務順利完成（Task Completed）**：使用者要退貨、預約或查詢帳單，這個端到端流程最後是否真正被落實。
- **使用正確的工具（Right Tool Used）**：在具備工具呼叫（Tool Call）能力的 Agent 中，系統是否選擇了正確的 API、帶入正確的參數，且沒有發起多餘或錯誤的呼叫。

這類評估主要依賴任務完成度測試（Task-Completion Evals）以及針對執行步驟與上下文進行的軌跡分析（Trajectory Analysis）。

## 關鍵差異

兩者最核心的分界在於：「回答正確的事實」不等於「做對了事情」。

| 比較維度 | 模型品質（Model Quality） | 產品行為（Product Behavior） |
| :--- | :--- | :--- |
| **核心問題** | 輸出內容對不對？ | 有沒有解決使用者的目標？ |
| **涵蓋範圍** | 忠實度、事實準確度、完整性、連貫性 | 捕捉真實意圖、任務完成、工具選擇 |
| **評估方法** | LLM Judge、人工比對、基準答案比對 | 任務完成度測試、執行軌跡分析 |
| **典型盲點** | 事實完全正確，但根本答非所問 | 只看流程是否走完，沒發現中間引用的數據有誤 |

在實際的系統追蹤（Trace）審查中，最常見的失敗模式是「錯誤意圖（Wrong Intent）」。例如使用者詢問「我的方案下個月會被收多少錢」，模型給出一段極為詳細、事實完全正確的退貨退款政策說明。就模型品質而言，它引述的政策文字真實無誤，能輕鬆通過每一項準確度檢驗；但就產品行為而言，它完全答錯問題，該次任務徹底失敗。

## 何時用哪個

- **優先使用模型品質評估的時機**：
  - 開發知識檢索系統（RAG）或摘要功能，需要確保模型沒有捏造數據。
  - 更換底層模型（例如從 Claude 換到 GPT-4o）或微調提示詞（Prompt）時，驗證回答語法與專業知識基準是否維持水準。
  - 需要針對產出文本進行即時的安全審查與幻覺過濾。

- **必須導入產品行為評估的時機**：
  - 開發具備自主決策能力的 Agent，系統需要串接資料庫、呼叫外部 API 來替使用者辦事。
  - 使用者回饋「AI 很有禮貌也寫得很長，但每次都沒解決問題」。
  - 系統出現多步驟循環，需要檢查工具呼叫是否精確、流程是否卡在無效的重試迴圈中。

## 進階

模型品質與產品行為並非孤立存在，它們是 AI 產品品質六大維度的前兩項。要完整掌握一個 AI Agent 的表現，必須在同一個追蹤記錄（Trace）中同時檢視六個維度：

1. **模型品質（Model Quality）**：輸出是否準確有據。
2. **產品行為（Product Behavior）**：是否達成使用者目標、工具呼叫是否正確。
3. **安全性（Safety）**：是否能防範提示詞注入（Prompt Injection）、避免個人隱私資料（PII）外洩。
4. **可靠性（Reliability）**：同樣的請求執行多次時是否表現一致，失敗時是否能優雅降級而非無預警中斷。
5. **成本（Cost）**：單次任務消耗的 Token 數量與工具呼叫開銷。
6. **延遲（Latency）**：使用者感受到的首字產出時間（TTFT）以及整個任務的端到端等待時間。

當一個 Agent 表現不佳時，不能只把焦點放在模型寫得好不好。透過端到端的執行軌跡，團隊才能同時看清模型回答的品質瑕疵與產品行為的邏輯偏差。
