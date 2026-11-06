---
id: latency-accuracy-tradeoff
title: "Latency-Accuracy Tradeoff（延遲與準確度取捨）"
label: "Latency-Accuracy Tradeoff"
subject: ai-agent-workflows
type: concept
status: draft
summary: "序列鏈結用逐步等待換取每一步的推論品質，等待時間會線性疊加。"
aliases: []
prerequisites: []
related:
  - prompt-chaining
  - task-decomposition
sources:
  - "[[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L65-L77]]"
created: 2026-11-06
updated: 2026-11-06
---

# Latency-Accuracy Tradeoff（延遲與準確度取捨）

## 定義

延遲與準確度的取捨是指：為了讓每一步推論更準，系統願意讓使用者多等多久。Prompt chaining 是這個取捨最具體的形態——它拿延遲去換準確度。

## 為什麼重要

這個取捨決定一個任務該不該拆成鏈。同一個設計在批次處理或背景工作是加分，在即時對話卻可能是致命傷。先講清楚要買什麼、付多少，才不會做出「很準但沒人願意等」的系統。

## 如何運作

在序列鏈結裡，後一步的輸入依賴前一步的輸出，因此無法重疊執行。你必須等第一次模型呼叫回傳，才能組出第二個提示詞；等第二次完成，才能交給第三次。總等待時間大致等於各步延遲相加，步驟越多，疊得越高。

## 例子

一個要求即時流暢互動的介面，使用者送出訊息後期待立刻看到回應，把請求拆成三段依序呼叫就不合適。相反地，產生一份完整的職涯規劃報告可以接受數十秒的等待，換來每一步更專注的輸出，這個取捨就划算。

## 邊界與常見誤解

- **不是說 chaining 一定慢**：慢的是序列依賴；互不依賴的工作可以平行，屬於另一種結構。
- **不是步驟越多越準**：超過任務真正需要的切法，只增加等待與失敗點，不會提升品質。
- **不是只有 chaining 有延遲**：任何多次模型呼叫都會累加，單一 agent 的迴圈也一樣。
- **不能只看平均值**：尾端延遲往往才是使用者感受到的等待。

## 進階

若延遲是硬限制，解法有兩個方向：減少序列長度，或把真正獨立的工作改成平行 fan-out。要判斷哪些工作能併、哪些必須排隊，回到 [[task-decomposition]] 的兩個條件；要讓每一步的輸出更穩定，則見 [[prompt-chaining]]。
