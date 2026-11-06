---
id: verification-gap
title: "Verification Gap（驗證缺口）"
label: "Verification Gap"
subject: ai-agent-workflows
type: concept
status: draft
summary: "多代理最常見的失敗是沒有人查核，後面的 agent 會直接相信前面傳來的內容。"
aliases: []
prerequisites: []
related:
  - external-signal
  - rubber-stamp-tower
  - multi-agent-context-advantage
sources:
  - "[[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L35-L87]]"
created: 2026-11-06
updated: 2026-11-06
---

# Verification Gap（驗證缺口）

## 定義

Verification gap 是多代理系統中「有能力互相檢查」與「實際上有沒有檢查」之間的落差。多代理架構理論上可以放入 reviewer、critic 或第二意見，但若沒有把查核明確建進流程，agent 通常會無條件接受前一個 agent 交來的內容，並把它當成正確前提繼續推理。

## 為什麼重要

這是此類系統最常見的崩潰原因。錯誤不會平均分散，而是沿著交接鏈被放大：前一步的小偏差被後一步當成事實，後面的 agent 再基於它做出更多推論。最後表面上看起來是某個 agent 答錯，實際上是整條鏈都沒有查核。

## 如何運作

1. Agent A 產出一份結果，交給 Agent B。
2. B 的 context 裡只有 A 的文字，沒有 A 的原始資料或信心程度。
3. 若流程沒有要求 B 查證，B 最省力的做法就是相信 A。
4. B 的輸出建立在這份未驗證的前提上，再交給 C。
5. 錯誤一路累積，直到最終輸出明顯不對。

補救方式不是「叫 agent 更小心」，而是在架構裡放入真正的檢查步驟：讓某個角色拿外部資料、測試或明確標準去對照，而不是只讀文字。

## 例子

職涯系統中，市場分析 agent 回報「這份工作需求穩定」，後面的規劃 agent 直接據此推薦學位與證照。若沒有人去查實際就業數據，整份建議就建立在一個從未被驗證的句子之上。

## 邊界與常見誤解

- **「有 reviewer」不等於有驗證**：若 reviewer 只讀文字、沒有可對照的事實，它只能檢查語氣與格式。
- **模型互相認可不等於正確**：多個 agent 都說對，可能只是共享同一個盲點。
- **加驗證會增加成本**：查資料、跑測試、多一次呼叫都要花錢與時間。
- **不是只有多代理才有**：單一 agent 也會盲信自己的輸出，只是多代理把問題放大。

## 進階

要補上缺口，需要 [[external-signal]] 這類可對照的事實。分層 supervisor 若缺乏驗證，會退化成 [[rubber-stamp-tower]]；多代理的 context 優勢見 [[multi-agent-context-advantage]]。
