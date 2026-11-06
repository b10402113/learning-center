---
id: trajectory
title: "Trajectory（執行軌跡）"
label: "Trajectory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "agent 完成一次任務的完整行動紀錄，包含每次規劃、工具呼叫與中間觀察，而不只是最終答案。"
aliases: []
prerequisites: []
related:
  - reflexion
  - reflection-memory
  - context-window
sources:
  - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L220-L259]]"
created: 2026-11-06
updated: 2026-11-06
---

# Trajectory（執行軌跡）

## 定義

Trajectory 是 agent 完成一次任務的完整行動紀錄：它走過的每一步、每一次規劃、每一個工具呼叫，以及工具回傳的每一個中間觀察，最後才是最終答案。它是「過程」而不是「結果」。

## 為什麼重要

只看最後答案，無法知道 agent 是在哪一步走錯。錯誤可能發生在中途的某個工具呼叫、某次忽略的 observation，或一個過早的判斷。Evaluator 要給出有依據的評分、reflection 要寫出具體的檢討，都必須看到整條軌跡。

## 如何運作

1. Agent 執行時逐步記錄每個決策、工具呼叫與回傳結果。
2. 任務結束後，把整條軌跡交給 evaluator 審查，而不是只交最終輸出。
3. Evaluator 逐段判斷哪裡合理、哪裡偏離目標，並給出分數。
4. 若失敗，軌跡與分數一起交給 reflection 模型，讓它指出具體的錯誤步驟。

## 例子

職涯顧問 agent 的一次執行軌跡包含：讀取使用者背景、呼叫職業查詢、收到職涯清單、呼叫課程查詢、收到課程資料、呼叫助學金查詢、收到結果、統整答案。若最後推薦了錯誤州別的學校，evaluator 可以從軌跡看出是哪一步漏掉了「想留在南卡」這個條件。

## 邊界與常見誤解

- **不是一般 log**：流水帳記錄所有事件；軌跡要保留與決策相關的步驟與觀察。
- **不是只有工具呼叫**：模型的規劃、放棄的選項與中途判斷也算在內。
- **越長越貴**：完整軌跡會塞進 context，成本隨步數增加，需要摘要或壓縮。
- **只看軌跡仍可能誤判**：若紀錄不完整，evaluator 會在不存在的步驟上找錯。

## 進階

軌跡同時是除錯與學習的單位：短期內用它定位失敗，長期則把其中的教訓寫進 [[reflection-memory]]。設計 agent 時，先想清楚「哪些步驟必須留下來」，再決定記錄粒度，會比事後補 log 有效。
