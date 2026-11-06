---
id: embedding
title: "Embedding（向量嵌入）"
label: "Embedding"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用 embedding 模型把文字轉成數值向量，讓語意相近的內容在向量空間彼此靠近。"
aliases: []
prerequisites: []
related:
  - chunking
  - vector-similarity
  - retrieval-augmented-generation
sources:
  - "[[sources/ai-agent-workflows/20261105/course/4-rag.txt#L16-L94]]"
created: 2026-11-06
updated: 2026-11-06
---

# Embedding（向量嵌入）

## 定義

Embedding 是用 embedding 模型把一段文字轉換成一組數值向量。這個向量的用途不是生成文字，而是表示語意位置：意思相近的文字，其向量在數值空間中會彼此靠近。

## 為什麼重要

如果只把文字原封不動存進資料庫，檢索就只能靠關鍵字。關鍵字搜尋很難處理「意思相關但用詞不同」的情況，例如查 couch 時還得自己想出 sofa、chair、upholstery 等一長串同義詞。embedding 讓系統改用語意關聯性找資料，不必窮舉字面變化。

## 如何運作

embedding 模型常採用和 LLM 類似的 Transformer 架構，但訓練目標不同：它最佳化的是向量表示，不是文字生成。訓練完成後，語意相近的詞或句子會被放在向量空間中相近的位置；語意無關的內容則相距很遠。使用時，文件和查詢都用同一個 embedding 模型轉成向量，才能在同一空間中比較。

## 例子

在向量空間裡，couch 與 sofa 的數值表示會很接近；horse 或 pizza 則會離得很遠，除非訓練資料裡剛好有大量「披薩沙發」這種組合。因此檢索「沙發」時，系統有機會連用詞不同但意思相近的段落一起找出來。

## 邊界與常見誤解

- **embedding 模型不一定是 LLM**：它可能共用 Transformer 架構，但目標是產生向量而非生成文字。
- **embedding 不是關鍵字比對**：它處理的是語意相似度，不是字面是否相同。
- **語意相近不等於正確**：向量只表示「讀起來像」，不保證內容真的能回答問題。
- **查詢和文件要用同一個模型**：不同模型產生的向量空間不能直接互相比較。

## 進階

文件端要先把長文切成適合 embed 的單位，見 [[chunking]]。查詢端如何用向量距離挑出片段，見 [[vector-similarity]]；整體用途則是 [[retrieval-augmented-generation]]。
