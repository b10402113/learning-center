---
id: episodic-memory
title: "Episodic Memory（情節記憶）"
label: "Episodic Memory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "agent 經歷過的事件與互動紀錄，可存逐字稿、摘要、向量庫、執行日誌或筆記檔。"
aliases: []
prerequisites: []
related:
  - semantic-memory
  - working-memory
  - memory-retrieval
sources:
  - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L64-L139]]"
  - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L140-L218]]"
created: 2026-11-06
updated: 2026-11-06
---

# Episodic Memory（情節記憶）

## 定義

Episodic memory（情節記憶）記錄的是經驗與歷程，回答的是「過去發生了什麼」。它包含 agent 與使用者互動的歷史，例如開過的工單、上次通話的紀錄、曾經承諾的補償，也包含 agent 留給自己的經驗筆記。

## 為什麼重要

語意記憶只知道事實，情節記憶才讓 agent 有連續性。使用者重新登入時，助理能說「記得你上次提到退款還沒入帳」，靠的就是情節記憶。對 agent 自己來說，記下「這條搜尋路徑失敗過」也能避免重複走進死胡同。

## 如何運作

業界沒有單一標準，常見的存放方式有五種：

- **完整逐字稿**：把每次對話無損存進一般資料庫，以 session ID 索引。簡單完整，但整段對話通常太大，下次很難全部放回 context。
- **對話摘要**：在互動結束時先摘要再儲存，只留下需求與結果。COALA 論文特別建議這種做法。
- **向量資料庫**：把過去訊息或摘要轉成 embedding，用語意相似度找相關經歷，等於把 RAG 用在自身經驗上。
- **執行日誌**：記錄 agent 處理任務的每個步驟與成敗，讓它辨識並避開曾失敗的路徑。
- **純文字筆記檔**：把 session 摘要與工作狀態寫進本機檔案，下次啟動時讀取。

## 例子

客服 agent 記下「上次對話答應客戶 5 到 7 天內退款，但客戶反映尚未入帳」。文獻研究 agent 在翻過某篇論文後寫下「這份檔案沒有相關內容」，之後就不再重複翻同一篇。

## 邊界與常見誤解

- **情節記憶不是事實知識**：退款政策本身是語意記憶，客戶上次申請退款的經過才是情節記憶。
- **逐字稿不是唯一做法**：完整保存很簡單，但往往大到無法放回 context。
- **摘要會失去細節**：只留重點能減輕檢索負擔，但原始過程不復存在。
- **日誌與筆記也是記憶**：不只對話內容，agent 自己的執行紀錄同樣算經驗。

## 進階

情節記憶要能被取用才有價值，方法見 [[memory-retrieval]]。它和 [[semantic-memory]] 的分工，以及與 [[working-memory]] 的差別，是設計 agent 記憶架構時最先要釐清的三件事。
