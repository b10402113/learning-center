---
id: reranker
title: "Re-ranker（重新排序器）"
label: "Re-ranker"
subject: ai-agent-workflows
type: concept
status: draft
summary: "在向量檢索之後再判斷文件是否真的能回答問題，只放行有幫助的片段。"
aliases: []
prerequisites: []
related:
  - vector-similarity
  - maximal-marginal-relevance
  - context-budget
sources:
  - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L86-L146]]"
  - "[[sources/ai-agent-workflows/20261105/course/5-context.txt#L236-L323]]"
created: 2026-11-06
updated: 2026-11-06
---

# Re-ranker（重新排序器）

## 定義

Re-ranker 是檢索之後的第二道關卡。它接收向量檢索取回的候選文件，重新評估每一份文件「是否真的有助於回答使用者的問題」，再把真正有用的片段放進 context。

## 為什麼重要

標準向量檢索只比較語意相似度，能找出「文字上接近」的內容，卻分不出這份文件對回答問題有沒有幫助。候選文件裡也常混入大量重複資訊。若不經第二層過濾，這些片段會白白佔用 context，甚至誤導模型。re-ranker 讓有限的視窗只留真正能用的資料。

## 如何運作

向量檢索先撈出一批候選文件，re-ranker 再逐一檢視：「這份文件回答了使用者的具體問題嗎？」它和檢索的差別在於，檢索問的是「像不像」，re-ranker 問的是「有沒有用」。通過的片段才進入 context。這兩步通常一起使用：檢索負責廣度，re-ranker 負責精度。

## 例子

使用者問「如何展覽馬匹」，向量檢索可能因為語意相近而取回名馬 Seabiscuit 的生平。Seabiscuit 確實是馬、也得過許多獎，和查詢在向量空間很接近，但牠是純種賽馬，對「如何展覽馬匹」沒有實質幫助。re-ranker 會把這類「相關但無用」的片段擋下。

## 邊界與常見誤解

- **re-ranker 是額外一步**：它不是把額外資料塞進 context，而是對候選文件再做一次排序與篩選。
- **它不取代向量檢索**：沒有第一階段取回候選，re-ranker 沒有東西可排。
- **它也會出錯**：re-ranker 判斷失準時，好片段可能被丟掉，壞片段可能被放行。
- **它增加成本**：多一次模型呼叫，是拿成本換 context 空間與可靠度。

## 進階

re-ranker 處理「有沒有用」，[[maximal-marginal-relevance]] 處理「是否重複」，兩者搭配能把 context 收得更乾淨。整體取捨見 [[context-budget]]；第一階段的相似度計算見 [[vector-similarity]]。
