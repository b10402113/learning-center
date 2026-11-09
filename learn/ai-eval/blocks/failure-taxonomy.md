---
id: failure-taxonomy
title: "Failure Taxonomy（失敗分類法）"
label: "Failure Taxonomy"
subject: ai-eval
type: concept
status: draft
summary: "把個別錯誤聚類成命名、二元、具體、可數的 failure codes，讓失敗變成可量測的優先順序。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1501-L1600]]"
  - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L448-L504]]"
  - "[[sources/ai-eval/20261108/course/lesson1.en.txt#L1601-L1603]]"
created: 2026-11-09
updated: 2026-11-09
author: google/gemini-3.8-flash
---

# Failure Taxonomy（失敗分類法）

<!--image:1-->

## 定義

失敗分類法（Failure Taxonomy）是一套結構化的錯誤標籤系統。它的目的是把 AI 執行時零散的個別錯誤，聚類歸納成標準化的失敗代碼（Failure Codes）。

設計良好的失敗代碼具備四個關鍵特質：

- **已命名（Named）**：建立團隊共同的溝通詞彙，不再各說各話。
- **二元判定（Binary）**：只有通過或失敗（Pass 或 Fail），不使用模糊的評分量表。
- **具體明確（Specific）**：定義足夠精準，不同評估者標記同一筆紀錄時能維持一致。
- **可量化計數（Countable）**：能統計發生次數，用頻率決定處理問題的優先級。

## 為什麼重要

AI 系統在測試或上線初期，往往會產生大量失敗紀錄。大型軟體專案常累積成千上萬個待修問題，團隊無法也不需要一次修好所有小毛病。

缺乏分類法時，錯誤只是一堆雜亂的文字紀錄。團隊只能憑直覺救火，容易把時間耗費在無關緊要的細節上。

建立失敗分類法後，失敗紀錄就能轉化為可量測的數據。團隊能依據發生頻率與業務影響範圍，迅速找出必須優先處理的高風險問題。

## 如何運作

建立與使用失敗分類法包含三個核心步驟：

1. **聚類分桶（Clustering）**：檢視系統執行軌跡（Traces）與人工回饋，把特徵相似或成因相同的錯誤歸入同類，並賦予明確的失敗代碼名稱。
2. **統計頻率（Counting）**：在測試樣本或使用者工作階段中，統計各個失敗代碼的出現次數（例如 8 次執行中出現 5 次）。
3. **排定優先順序（Prioritization）**：綜合考量錯誤頻率（Frequency）、嚴重程度（Severity）與業務破壞半徑（Blast Radius）。例如直接導致財務損失的退款邏輯錯誤，處理順位一定高於單純用詞稍嫌囉嗦的回答。

## 例子

評估寫程式代理人（Coding Agent）的表現時，分析 8 個工作階段（Sessions）能歸納出具體的失敗代碼與次數：

- **未驗證即回報狀態（Unverified Status Reporting）**：8 個階段中出現 5 次。
- **預覽測試覆蓋不足（Weak Preview Test Coverage）**：8 個階段中出現 5 次。
- **診斷前即採取行動（Acted Before Diagnosing）**：8 個階段中出現 3 次。
- **使用錯誤機制處理任務（Wrong Mechanism for Job）**：8 個階段中出現 3 次。
- **規格品質問題（Spec Quality Issue）**：8 個階段中出現 3 次。
- **過期領域術語（Stale Domain Terminology）**：8 個階段中出現 3 次。
- **變數或識別碼命名不佳（Poor Identifier Naming）**：8 個階段中出現 3 次。
- **誤解系統內部原理（System Internals Misunderstood）**：8 個階段中出現 2 次。
- **無依據覆寫預設值（Unwarranted Default Override）**：8 個階段中出現 2 次。
- **遺漏現有資產（Missed Existing Asset）**：8 個階段中出現 1 次。

這份統計讓團隊一目了然，「未驗證即回報狀態」與「預覽測試覆蓋不足」發生頻率最高，應排在修復清單的最前端。

## 邊界與常見誤解

- **把主觀評分當成分類代碼**：例如將問題標記為「品質 3 分」或「不太滿意」。這類評分缺乏二元性與具體性，無法指出確切失敗原因，不同人判定時容易產生落差。
- **代碼粒度太粗或太細**：代碼太粗（例如只標記「程式碼錯誤」）無法提供修復方向；代碼太細（為每個案例單獨建立代碼）則無法收斂並統計頻率。
- **只看頻率而忽略破壞半徑**：高頻率不代表最緊急。出現頻率高但影響微弱的語氣問題，優先級通常低於發生次數少卻會引發交易異常的重大缺陷。

## 進階

當失敗分類法穩定後，這些二元代碼能直接轉化為自動化評測指標（Evaluators）。

例如針對「未驗證即回報狀態」，可以撰寫規則檢查程式，或利用大語言模型擔任裁判（LLM-as-a-judge）。系統能在管線中自動標記失敗代碼，持續追蹤新版本模型修復特定錯誤的進度。
