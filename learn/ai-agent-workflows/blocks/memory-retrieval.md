---
id: memory-retrieval
title: "Memory Retrieval（記憶檢索）"
label: "Memory Retrieval"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把長期記憶帶回 context 的兩種方式：常駐載入與依需求檢索，各有成本與風險。"
aliases: []
prerequisites: []
related:
  - working-memory
  - episodic-memory
  - semantic-memory
sources:
  - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L219-L262]]"
created: 2026-11-06
updated: 2026-11-06
---

# Memory Retrieval（記憶檢索）

## 定義

Memory retrieval（記憶檢索）是把存放在外部的長期記憶帶回當前 context 的過程。無論存了多少事實、經歷或技能，只要沒有進入這一輪的視窗，它們就無法影響 agent 的行為。

## 為什麼重要

長期記憶的價值取決於能不能被取用。一個記得所有客戶歷史的系統，如果檢索失敗或根本沒有觸發，表現就和沒有記憶一樣。檢索策略同時決定了 context 的固定開銷，以及 agent 能否在正確時機想起正確的事。

## 如何運作

主要有兩種途徑：

- **常駐載入（always loaded）**：資料量很小時，每次開啟對話就把它放進系統 context。例如簡短的使用者偏好，或前幾次對話的最終摘要。實作簡單，但無論相不相關都固定佔用空間。
- **依需求檢索（retrieve on demand）**：平時不主動塞入，直到程式邏輯觸發，或模型主動呼叫「記憶搜尋工具」時才查詢。使用者說「上次我們聊到那件事但沒有下文」，模型可以決定發動工具搜尋歷史。

## 例子

客服聊天機器人在對話開始時，先載入客戶的簡短偏好與最近兩次對話摘要，這是常駐載入。當客戶追問「你上次答應的退款呢」，模型呼叫 search memory tool 去查歷史紀錄，這是依需求檢索。

## 邊界與常見誤解

- **常駐載入不挑相關性**：即使這段記憶與本輪無關，它仍會佔用 context。
- **依需求檢索依賴精準度**：找錯片段或完全找不到，模型就得不到正確資訊。
- **兩種方式可以混用**：小量且關鍵的記憶常駐，其餘按需查詢。
- **檢索不是萬無一失**：LLM 與檢索都有隨機性，失敗時需要監控與測試。

## 進階

檢索的目標是餵養 [[working-memory]]。要決定哪些記憶值得保存，得先分清 [[semantic-memory]] 與 [[episodic-memory]]；而常駐與否，最終仍受 [[context-budget]] 限制。
