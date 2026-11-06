---
id: chunking
title: Chunking（文件切塊）
label: Chunking
subject: ai-agent-workflows
type: concept
status: draft
summary: 把長文件切成短語或幾句話的片段，讓檢索能快速精準命中關鍵內容。
aliases: []
prerequisites: []
related:
  - retrieval-augmented-generation
sources:
  - '[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L16-L94]]'
created: 2026-11-06
updated: 2026-11-06
---

# Chunking（文件切塊）

## 定義

Chunking 是 RAG 索引前的預處理步驟：把一份長文件拆成較小的文本片段，通常是一個短語到幾句話。切出來的每個 chunk 之後會各自被 embed 成一個向量，成為檢索的最小單位。

## 為什麼重要

檢索的精度取決於片段大小。如果把整份文件當成一個單位，向量會混雜太多主題，查詢時很難快速命中真正相關的段落；切成小塊後，每個向量只代表一個相對集中的意思，比對起來更精準。chunk 也是決定「檢索回來的是什麼」的邊界。

## 如何運作

文件先被 ingest，再依內容切成句子或短語層級的片段。實務上切塊大小視需求而定，但通常不會太長：一旦片段過大，檢索時就難以快速且精準地找到關鍵內容。切好的文字接著交給 embedding 模型轉成向量，存進資料庫。

## 例子

一份獎學金資格文件包含申請資格、截止日期、所需文件與金額。與其整份 embed，不如拆成「戶籍條件」「成績門檻」「截止日」等幾個短片段。當使用者描述自己的背景時，系統才能只取回資格條件那一段，而不是把整份文件塞進 context。

## 邊界與常見誤解

- **chunk 不是愈小愈好**：切得太碎會讓單一片段缺乏足夠上下文，檢索到也難以理解。
- **chunk 大小沒有單一標準**：來源明確說這高度取決於使用情境，需要針對自己的資料研究。
- **chunking 不等於摘要**：它只是把原文切成較小單位，並不改寫或壓縮內容。
- **chunk 不是文件結構**：chunk 是檢索單位，不一定和原本的章節或段落一一對應。

## 進階

切塊之後要決定用什麼向量表示，見 Embedding；要理解檢索如何用這些向量挑片段，見 Vector Similarity。整個流程的上層概念是 [[retrieval-augmented-generation]]。
