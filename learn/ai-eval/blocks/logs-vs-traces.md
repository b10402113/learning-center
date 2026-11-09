---
id: logs-vs-traces
title: "Logs vs Traces（日誌與軌跡）"
label: "Logs vs Traces"
subject: ai-eval
type: contrast
status: draft
summary: "logs 只給你事件序列，trace 才保留檢索內容、推理與語意層，能解釋失敗為什麼發生。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L568-L638]]"
  - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1305-L1310]]"
created: 2026-11-09
updated: 2026-11-09
author: google/gemini-3.8-flash
---

# Logs vs Traces（日誌與軌跡）

<!--image:1-->

## A 是什麼

Logs（日誌）是系統在運行時按時間順序輸出的事件紀錄。在傳統軟體架構中，日誌通常記錄「在某個時間點發生了什麼事」，包含時間戳記、嚴重層級（如 INFO 或 WARN）以及簡單的狀態訊息。

以客服 AI Agent 為例，一般的日誌內容可能長成這樣：

- 10:32:01 INFO：收到使用者訊息
- 10:32:03 INFO：呼叫工具 order_lookup
- 10:32:04 INFO：工具 order_lookup 回傳成功
- 10:32:07 INFO：回應傳送完成（耗時 6 秒）
- 10:32:55 WARN：policy version mismatch (soft)
- 10:33:01 INFO：退款回應傳送完成

日誌能告訴你呼叫了哪些工具、各步驟花了幾秒，以及是否有出現警告訊息。

## B 是什麼

Traces（軌跡）是記錄單次請求在整個系統或模型呼叫鏈中完整執行脈絡的結構化紀錄。它不只記錄時間與事件順序，還完整捕捉了語意層（semantic layer）的資訊。

在 LLM 與 Agent 系統中，Trace 會保存：

- 輸入給模型的完整 Prompt（提示詞）與對話上下文。
- 檢索增強生成（RAG）過程中，系統到底檢索出了哪一段具體的政策文件（policy chunk）。
- 模型在做出動作前的思維鏈（CoT）與內部推理（reasoning）。
- 工具呼叫時帶入的精準參數與回傳的原始文字。

## 關鍵差異

兩者最核心的分別在於「是否保留語意脈絡」：

- **能否解釋失敗原因**：日誌只能記錄「發生了錯誤退款」，並附帶一行沒人會被警報叫醒的輕微警告（soft warning）；Trace 則會清楚顯示模型實際看到了哪段已廢棄的舊政策（RETIRED policy），以及模型如何基於錯誤資訊推論出退款金額，直接還原顧客被多收錢的根本原因。
- **觀察的維度不同**：日誌提供的是基礎設施層級的時間序列與系統狀態；Trace 提供的是模型認知的語意層，讓開發者看到模型「眼裡看到的世界」。
- **除錯能力**：光看日誌，開發者就像瞎子摸象（flying blind），只能看見元件正常呼叫；Trace 才能重現決策路徑，解釋為什麼 Agent 會給出錯誤答案。

## 何時用哪個

- **使用 Logs 的情境**：
  - 監控伺服器基本健康度與基礎設施指標。
  - 統計 API 的呼叫次數、整體延遲（latency）與吞吐量。
  - 追蹤網路連線中斷、伺服器重啟或記憶體不足等系統級錯誤。

- **使用 Traces 的情境**：
  - 調查 AI Agent 或 LLM 應用的邏輯錯誤、幻覺與離題回答。
  - 評估 RAG 系統檢索到的文件內容是否精準切題。
  - 分析 Agent 為什麼選擇呼叫特定工具，或為什麼傳入錯誤的參數。

日常維運依靠日誌掌握系統是否活著；但只要涉及模型輸出品質與正確性除錯，就必須依賴軌跡。

## 進階

日常開發中，「今天你看 Traces 了嗎？」是評估 AI 產品非常核心的自省問題。如果團隊只盯著日誌上的 200 OK 或成功率，很可能會忽略大量悄悄發生的邏輯錯誤與政策違規。

隨著系統流量擴大，人工逐筆檢查 Traces 會變得不可行。進階的做法是在 Traces 基礎設施之上再架設評估專用的 Agent（Evaluator Agents），自動讀取每一筆軌跡中的推理鏈與檢索內容，針對語意正確性、有害內容或政策遵循度進行自動化審查與評分。
