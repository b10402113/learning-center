---
id: transcript-memory
title: "Transcript Memory（對話紀錄記憶）"
label: "Transcript Memory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "LLM 是無狀態的，agent 靠完整對話紀錄記住每一輪的思考、行動與觀察。"
aliases: []
prerequisites: []
related:
  - context-window-bloat
  - react
sources:
  - "[[sources/ai-agent-workflows/20261105/course/14-react.txt#L355-L394]]"
created: 2026-11-06
updated: 2026-11-06
---

# Transcript Memory（對話紀錄記憶）

## 定義

Transcript memory 是把整段對話紀錄當成 agent 的記憶：包含 system prompt、使用者問題，以及每一輪模型產生的 thought、action 與程式附加的 observation。因為 LLM 本身不保存狀態，這份紀錄就是它唯一能跨輪記得先前發生什麼的地方。

## 為什麼重要

沒有 transcript，模型每一輪都像第一次看到任務，無法根據先前的工具結果調整下一步。Transcript 讓模型能引用前面查到的資料、避免重複呼叫同一個工具，也讓開發者能事後檢視 agent 走過的路徑。它同時是除錯與評估的基礎材料。

## 如何運作

迴圈開始時，messages 陣列放入 system prompt 與使用者輸入。每一輪把模型的輸出以 assistant 訊息附加進去；若模型選擇行動，程式執行工具後再把結果以 observation 附加進去。下一輪呼叫 LLM 時，傳入的就是這個不斷變長的完整陣列。

## 例子

一個執行兩輪的職涯 agent，第一輪的 transcript 只有 system prompt 與使用者問題；模型輸出 thought 與 action 後，程式附加該輸出與工具回傳的職業清單；第二輪模型讀到完整紀錄，知道自己已經搜尋過職業，於是直接查該職業的學歷要求。

## 邊界與常見誤解

- **不是模型內建記憶**：模型本身無狀態，記憶完全來自每次傳入的訊息陣列。
- **不是永久儲存**：transcript 通常只存在於這一次執行，程式結束後就消失。
- **不是越多越好**：完整保留會讓 context 快速膨脹，需要壓縮或截斷策略。
- **不是只有使用者輸入**：thought、action 與 observation 全都要留下，否則模型會失去推理脈絡。

## 進階

Transcript 的成長正是 context window bloat 的來源：每一輪都重送整份紀錄，成本與延遲會隨輪數上升。如何在不遺失關鍵資訊的前提下壓縮，見 [[context-window-bloat]]；這個機制在迴圈中的位置見 [[react]]。
