---
id: semantic-memory
title: "Semantic Memory（語意記憶）"
label: "Semantic Memory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "agent 知道的事實與知識，通常以 RAG 從外部文件檢索進 context。"
aliases: []
prerequisites: []
related:
  - episodic-memory
  - retrieval-augmented-generation
  - memory-retrieval
sources:
  - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L64-L139]]"
created: 2026-11-06
updated: 2026-11-06
---

# Semantic Memory（語意記憶）

## 定義

Semantic memory（語意記憶）是 agent 知道的事實與知識，回答的是「這是什麼」。它存放外部世界中最穩定的資訊，例如產品文件、公司規範、退款政策或說明中心文章。

## 為什麼重要

Agent 不可能把所有事實都背進模型權重，也不可能每輪都塞進 context。語意記憶把這些知識放在外部，需要時再取回，讓 agent 能回答訓練資料以外的問題。多數人說「我們用 RAG 讓 agent 有公司知識」時，實際指的就是語意記憶。

## 如何運作

事實資料先被整理、切塊並索引，通常存進向量資料庫或可搜尋的知識庫。使用者提問時，系統用查詢去檢索最相關的片段，把這些片段放進工作記憶的 context 供模型參考。模型本身不記住這些內容；每一次要用，都得重新檢索。

## 例子

客服 agent 的語意記憶包括網站上的說明中心文章與公司的退款規範。當客人問「退款要幾天」，agent 檢索到政策片段，回答「5 到 7 個工作天」，而不是憑空生成。

## 邊界與常見誤解

- **語意記憶不是模型權重**：它存在外部，模型每次都要透過檢索取得。
- **它不記錄經歷**：客戶上次打來發生什麼事，屬於 [[episodic-memory]]。
- **它不是技能**：怎麼退款、怎麼操作工具，屬於程序記憶。
- **檢索進來才算數**：沒被取回的事實，對當下這輪模型等於不存在。

## 進階

語意記憶的實作通常就是 [[retrieval-augmented-generation]] 的索引端。要把它帶回 context，見 [[memory-retrieval]]；它與情節記憶的分工見 [[episodic-memory]]。
