---
id: vector-similarity
title: "Vector Similarity（向量相似度）"
label: "Vector Similarity"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用 query 向量與文件向量的距離衡量語意相關性，決定檢索要取回哪些片段。"
aliases: []
prerequisites: []
related:
  - embedding
  - reranker
  - maximal-marginal-relevance
sources:
  - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L16-L94]]"
  - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L95-L126]]"
created: 2026-11-06
updated: 2026-11-06
---

# Vector Similarity（向量相似度）

## 定義

Vector similarity 是兩個向量在數值空間中的接近程度，用來表示對應文字的語意相關性。在 RAG 裡，它指的是使用者查詢的向量與資料庫中各文件向量的相似度。

## 為什麼重要

向量資料庫裡可能有成千上萬個片段，系統不可能全部送進 context。vector similarity 提供了排序依據：先算出 query 向量與每個文件向量的距離或相似度，再挑出最接近的少數幾個。這個分數直接決定 agent 會看到哪些資料。

## 如何運作

使用者送出查詢後，系統用當初索引文件時的同一個 embedding 模型，把 query 也轉成向量。接著對資料庫中的向量逐一計算相似度，取出分數最高的一批片段，放進 context 與原始查詢一起交給 LLM。相關性就是這樣由「query 向量與文件向量之間的距離」計算出來的。

## 例子

使用者問「如何展覽馬匹」，系統把這句話轉成向量，比對資料庫後取回數個最接近的片段。若資料庫裡有賽馬 Seabiscuit 的生平，它也可能因為同樣談到馬、比賽與獎項而得到高分，被排進候選名單。

## 邊界與常見誤解

- **高分不代表有幫助**：語意接近只說明主題相關，不保證能回答具體問題；Seabiscuit 對「如何展覽馬匹」就沒有實質幫助。
- **相似度依賴 embedding 模型**：換模型就換了整個向量空間，分數不能直接沿用。
- **取回數量是取捨**：取太少可能漏掉關鍵片段，取太多則浪費 context 並引入雜訊。
- **相似度不是事實查核**：它只比較語意表徵，不判斷內容真假。

## 進階

因為相似度會把「相關但沒用」與重複內容一起撈回來，實務上會再加一層 [[reranker]] 判斷可用性，並用 [[maximal-marginal-relevance]] 去除重複。這些機制的共同目標是保護 [[context-budget]]。
