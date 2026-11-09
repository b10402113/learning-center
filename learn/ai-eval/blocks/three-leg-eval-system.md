---
id: three-leg-eval-system
title: "Three-Leg Eval System（評測三腳架）"
label: "Three-Leg Eval System"
subject: ai-eval
type: concept
status: draft
summary: "任何 eval 都由 task、dataset、scorer 三隻腳組成，缺一隻就無法給出可信分數。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L567-L579]]"
  - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L245-L255]]"
created: 2026-11-09
updated: 2026-11-09
author: google/gemini-3.8-flash
---

# Three-Leg Eval System（評測三腳架）

<!--image:1-->

## 定義

Three-Leg Eval System（評測三腳架）是建構任何人工智慧評測（Eval）時不可或缺的三大核心積木：任務（Task）、資料集（Dataset）與評分器（Scorer）。這三者如同三腳架的三隻腳，缺了任何一隻，就無法得出穩定且可信的評測分數。

## 為什麼重要

許多團隊在評估大型語言模型（LLM）或 AI 系統時，常急著看模型輸出的好壞，卻沒有先釐清系統到底在執行什麼目標、該用哪些情境測試，以及由誰來評判標準。

只要理解並掌握這三個要素，就等於掌握了 AI 評測架構的一半。評測三腳架能幫助團隊在建立第一個評測時建立標準化思維，避免評測邏輯混亂、測試情境涵蓋不足或評分標準隨意變動。

## 如何運作

三腳架系統由以下三個部分依序串接運作：

1. **任務（Task）**：明確定義 AI 系統正在執行的工作與目標是什麼。
2. **資料集（Dataset）**：挑選與設計各種需要驗證的測試情境，包括正向情境（Positive scenarios）、反向情境（Negative scenarios）與對抗性攻擊或資安紅隊情境（Adversarial / Red teaming scenarios）。
3. **評分器（Scorer）**：決定由什麼機制來為模型輸出評分。常見的評分方式包含寫程式規則比對（Code check）、由另一個 LLM 進行裁判（LLM judge），或是交由人工審查（Human review）。

## 例子

以一個常見的「AI 客服處理退款請求」為例：

- **Task**：協助顧客處理並解決退款請求（Resolve a refund request）。
- **Dataset**：收集標準黃金資料集（Golden set）、線上真實流量（Production traffic），以及惡意測試案例（Red-team cases，例如嘗試誘騙系統無條件退款的情境）。
- **Scorer**：透過程式檢查是否符合退款資格規範（Code check）、用 LLM 評判回答語氣與處置邏輯（LLM judge），並抽樣交由客服主管人工檢驗（Human review）。

## 邊界與常見誤解

常見的誤解是把「評測」只當作「收集測試資料」或「找一個 LLM 打分數」。如果只有資料集和評分器，卻沒有清楚定義任務的成功邊界，評分器就無從判斷輸出是否真的解決了問題；反過來說，如果只定義了任務卻沒有涵蓋正反向與紅隊情境的資料集，評測結果也無法反映真實系統的穩健度。三者必須同時具備，才能構成有效的評測閉環。

## 進階

在實務落地時，評分器（Scorer）往往不是單一選擇，而是多種評分技術的組合架構。例如前置先用規則程式（Code check）快速篩除格式錯誤與違規字詞，中段由 LLM Judge 評估語意合理性與解決滿意度，高風險情境或邊緣案例再轉由專家或人工審查（Human review），兼顧評測效率與判斷準確度。
