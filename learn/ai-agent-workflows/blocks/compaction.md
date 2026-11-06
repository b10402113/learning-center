---
id: compaction
title: Compaction（上下文壓實）
label: Compaction
subject: ai-agent-workflows
type: concept
status: draft
summary: context 快滿時用無損外移或有損摘要縮減 token，換回可用空間。
aliases:
  - context-compaction
prerequisites: []
related:
  - context-budget
  - maximal-marginal-relevance
  - lost-in-the-middle
  - evaluator-optimizer
  - review-criteria
sources:
  - '[[sources/ai-agent-workflows/20261105/course/5-context.txt#L147-L235]]'
created: 2026-11-06T00:00:00.000Z
updated: '2026-11-06'
---

# Compaction（上下文壓實）

## 定義

Compaction 是壓縮（compression）的一種具體形式，目的是縮減 context 內的 token 數量。當 agent 運作一段時間、對話與工具輸出即將把視窗填滿時，就用某種策略把內容變小，換回可用的空間。

## 為什麼重要

Context 視窗有限，而 agent 每輪都往裡面加東西：使用者訊息、自己的推理、工具回傳結果、其他 agent 的發言。若不主動壓縮，系統會撞到上限，超出部分被直接切掉，關鍵資訊也可能一起消失。compaction 讓長任務能繼續跑下去。

## 如何運作

常見做法分成兩類：

- **無損（lossless）**：把完整對話歷史移出當前視窗，存進外部快取或資料庫，需要時再取回。資訊不丟，但要多一層儲存與讀取。
- **有損（lossy）**：當 context 達到某個容量閾值時，呼叫原本的模型或另一個較便宜的 LLM，把先前的對話與執行過程摘要化。摘要會要求保留核心細節，用較少 token 換取大量空間，但細節會流失。

選擇哪一類取決於任務：如果必須完整掌握每一次工具呼叫的原始輸入輸出，就不能貿然依賴有損摘要。

## 例子

一個 AI 伴侶應用把大量累積的對話歷史存在外部資料庫，需要時才調用，屬於無損做法。客服 agent 則可能在對話變長時，請模型把前面幾輪濃縮成「客人上週反映退款未入帳，先前承諾 5 到 7 天內退款」這種摘要，屬於有損做法。

## 邊界與常見誤解

- **有損摘要會失去細節**：被摘要掉的原始內容通常拿不回來。
- **compaction 不等於 RAG**：RAG 是從外部資料庫取資料進來，compaction 是把現有 context 變小。
- **不是只有滿了才做**：也可以在達到預設閾值時主動觸發，避免突然爆掉。
- **壓縮本身有成本**：摘要需要額外一次 LLM 呼叫，也要花錢與時間。

## 進階

壓縮前先去掉重複內容，效果更好，見 [[maximal-marginal-relevance]]。壓縮中段不只是省 token，也能降低 [[lost-in-the-middle]] 的影響。整體配置回到 [[context-budget]]。
