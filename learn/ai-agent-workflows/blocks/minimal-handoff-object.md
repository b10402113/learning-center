---
id: minimal-handoff-object
title: "Minimal Handoff Object（最小交接物件）"
label: "Minimal Handoff Object"
subject: ai-agent-workflows
type: concept
status: draft
summary: "只帶下一棒真正需要的欄位，通常是上一棒的最終答案加上原始輸入。"
aliases: []
prerequisites: []
related:
  - context-isolation
  - handoff-gate
sources:
  - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L91]]"
  - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L223-L234]]"
created: 2026-11-06
updated: 2026-11-06
---

# Minimal Handoff Object（最小交接物件）

## 定義

Minimal handoff object 是 agent 之間傳遞的最小資料契約：通常只有上一棒的最終答案，加上必要的使用者原始輸入。它刻意不包含完整的對話紀錄、工具呼叫過程或推理軌跡。

## 為什麼重要

下游只需要知道「結論」就能工作時，把整條 trajectory 一起傳過去只會稀釋注意力。只傳最小物件能讓下一棒的 context 維持極小且專注，也讓交接邊界清楚可驗證，錯誤與雜訊不會被整包複製。

## 如何運作

每個 agent 執行完後，把最終答案存進共享 state 中屬於自己的欄位，例如 `state.career`。下一個 agent 的輸入函式只讀取這個欄位與必要的原始輸入，而不是讀取上一個 agent 的 messages。要不要多傳欄位，取決於下游是否真的需要。

## 例子

在 sequential 職涯管線中，path advisor 只收到「選定的職業」與「使用者原始輸入」。它看不到 career picker 查了哪些資料庫、試過哪些關鍵字、為什麼淘汰其他職業。交接物件小，下一棒就更容易聚焦。

## 邊界與常見誤解

- **不是什麼都不傳**：太少會讓下一棒缺少必要背景，契約要明確。
- **不是自動等於正確**：物件小不代表內容對，仍需要 [[handoff-gate]] 驗證。
- **不是固定欄位**：不同管線的交接契約不同，應依下游需求設計。

## 進階

這個做法是 [[context-isolation]] 的具體實作。把交接物件定義成可檢查的 schema，能讓閘門用程式碼判斷，也讓後續新增 agent 時不必複製整段歷史。
