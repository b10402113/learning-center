---
id: in-context-learning
title: "In-Context Learning（脈絡內學習）"
label: "In-Context Learning"
subject: ai-agent-workflows
type: concept
status: draft
summary: "模型不更新權重，只靠 context 中的範例與回饋改變當下行為，離開 context 就遺忘。"
aliases: []
prerequisites: []
related:
  - reflexion
  - reflection-memory
  - context-window
sources:
  - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L301-L316]]"
created: 2026-11-06
updated: 2026-11-06
---

# In-Context Learning（脈絡內學習）

## 定義

In-context learning 指模型不改變任何權重，只根據目前 context 裡的範例、指示、回饋或反思文字，調整這一次的行為。學習效果完全寫在 prompt 裡，而不是寫進模型參數。

## 為什麼重要

它是 Reflexion 能快速又便宜的原因：不需要重新微調、不需要更新權重，只要把檢討文字放進 prompt，下一輪行為就可能改變。對需要快速實驗的團隊來說，這種改進方式的迭代成本遠低於訓練。

## 如何運作

1. 把範例、規則或反思文字放進模型的 context。
2. 模型在生成時參考這些內容，調整輸出或行動。
3. 同一輪任務內，context 持續累積，行為也持續受影響。
4. 一旦任務結束、context 被清空，這些影響就消失。

## 例子

第二輪執行時，agent 的 prompt 裡多了第一輪的檢討：「我漏掉資金選項，下次也要找獎學金與補助。」模型讀到後，在這一輪主動擴大搜尋範圍。這不是模型變聰明了，而是它這次看到的 context 不一樣。

## 邊界與常見誤解

- **不是永久學習**：context 清空就遺忘，不能當成資料庫。
- **容量有限**：context 塞得越多，真正重要的資訊越容易被稀釋。
- **不能取代微調或強化學習**：需要長期、穩定的能力改變時，仍要更新權重。
- **品質取決於放進去的內容**：放錯範例或錯誤檢討，模型就會學錯。

## 進階

In-context learning 是 [[reflexion]] 的底層機制，也是 [[reflection-memory]] 為什麼有效的解釋。若要突破「關掉就忘」的限制，就得把 context 裡的教訓外部化成長期記憶，或改用權重更新的方法。
