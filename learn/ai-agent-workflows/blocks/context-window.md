---
id: context-window
title: "Context Window（脈絡視窗）"
label: "Context Window"
subject: ai-agent-workflows
type: concept
status: draft
summary: "模型一次能讀取的 token 上限，所有指令、對話、工具結果與反思都必須塞進這個範圍。"
aliases: []
prerequisites: []
related:
  - lost-in-the-middle
  - context-budget
  - compaction
  - single-agent-scorecard
sources:
  - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L8-L26]]"
  - "[[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L27-L52]]"
created: 2026-11-06
updated: 2026-11-06
---

# Context Window（脈絡視窗）

## 定義

Context window 是模型一次生成時能讀取的 token 上限。它裝的不只是使用者問題，還包含 system prompt、整段對話、工具回傳的資料、agent 的推理紀錄與反思文字；所有內容都在同一個視窗裡競爭空間。

## 為什麼重要

單一 agent 的設計把所有負擔壓在同一個模型上，因此 context window 會直接決定它能記住多少事。視窗被塞滿時，最早或最不顯眼的資訊可能被截斷；即使沒有超出上限，關鍵句也可能因為位置而在生成時被忽略。使用者看到的不是「context 滿了」，而是 agent 推薦了錯的學校、忘了先前的限制。

## 如何運作

1. 每次呼叫模型時，把 system prompt、對話歷史、工具結果與其他上下文一起送入。
2. 模型只能看到視窗內的內容；超出的部分必須截斷、摘要或改用檢索。
3. 隨著任務進行，工具回傳的資料不斷累積，可用空間越來越少。
4. 開發者需決定哪些內容優先保留、哪些壓縮、哪些丟棄。

## 例子

職涯顧問 agent 的視窗要裝下學生的興趣、GPA、居住州、家庭狀況與「不想離父母太遠」的要求，接著又抓回數萬 token 的學校與獎學金資料。那句「想留在南卡羅來納州」可能被擠到中段甚至被截斷，最後系統推薦了奧勒岡州的學校。

## 邊界與常見誤解

- **視窗大不等於記得住**：內容有放進去，不代表模型會有效使用，還有 [[lost-in-the-middle]] 的問題。
- **不是資料庫**：視窗只存在於當次呼叫，不能當成長期儲存。
- **成本隨內容增加**：每個 token 都要付費，塞滿視窗同時代表更貴與更慢。
- **截斷不是唯一解法**：真正有效的做法是控制總量與排序，屬於 [[context-budget]] 的工作。

## 進階

把 context window 想成一個有預算的工作台，而不是無限倉庫。實務上會用 [[compaction]] 摘要舊內容、用檢索只取相關片段，並把重要限制放在開頭或結尾，降低被忽略的機率。
