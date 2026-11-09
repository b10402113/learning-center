---
id: accuracy-trap
title: "Accuracy Trap（準確率盲點）"
label: "Accuracy Trap"
subject: ai-eval
type: concept
status: draft
summary: "只看 accuracy 會漏掉行為與可靠度；儀表板全綠時，客訴與轉真人可能同時上升。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-eval/20261108/course/code/ByteByteGo_AI_Evals_Week1_SlideDeck.txt#L721-L852]]"
created: 2026-11-09
updated: 2026-11-09
author: google/gemini-3.8-flash
---

# Accuracy Trap（準確率盲點）

<!--image:1-->

## 定義

Accuracy Trap（準確率盲點）是指評估 AI 系統（如客服 Agent）時，只看單一的「準確率」（accuracy，即模型回答的事實是否正確）。

這會導致監控儀表板顯示高分綠燈，但線上實際的轉真人客服率（escalation）或客訴量卻不減反增。

## 為什麼重要

模型回答「事實正確」，不代表「使用者的問題被順利解決」。

只盯著準確率，容易誤判系統表現良好，忽略真實的使用者體驗正在惡化。

這會增加真人客服的負擔與營運成本，團隊也會錯過及早發現產品核心缺陷的機會。

## 如何運作

準確率通常只能衡量單次回合（turn）的「模型輸出品質」（quality），例如退款政策條文是否正確無誤。

使用者會不會要求轉真人，通常是整場對話（session-level）累積下來的感受。

這牽涉到產品的「行為」（behavior）與「可靠度」（reliability）：

- **意圖理解偏離**：Agent 每句話說的都是事實，卻完全搞錯使用者的核心目標（如 Wrong Intent）。
- **重複陷入死循環**：Agent 沒有給出錯誤資訊，但多次來回都無法推進下一步，造成使用者挫折。
- **單次回合無法反映全貌**：轉真人通常發生在連續兩三輪的失敗互動之後。只看單次回合評估，抓不到這類系統性問題。

## 例子

某線上商城的客服 Agent 評估時，事實準確率達到 92%，監控儀表板全亮綠燈。

同一週的營運數據卻顯示，使用者要求轉真人客服的比例暴增了兩倍（2x）。

調閱完整的對話紀錄（trace）才發現，Agent 雖然能背出正確的退款規定，但面對包裹延遲加上生鮮腐壞的複合問題時，無法做出合適的政策判斷。

使用者卡在對話流程中動彈不得，最後只能要求轉接真人。

## 邊界與常見誤解

常見的誤解是：只要準確率夠高，用戶滿意度就一定會提升。

準確率只涵蓋了模型品質的一小部分。

高準確率與高轉真人率完全可以同時出現。

評估如果只停留在單句輸入輸出的正確性，就會漏看使用者的流失與抱怨。

## 進階

避開 Accuracy Trap 的方式，是將評估維度從單一品質擴展到六個層面：品質、行為、安全、可靠度、成本與延遲（quality, behavior, safety, reliability, cost, latency）。

實務上，可以優先調出上一週被轉真人的完整對話紀錄。

由人工進行端到端標註（annotate），記錄 Agent 放棄處理或使用者要求轉真的真正原因。

接著建立錯誤分類法（failure taxonomy，如意圖錯誤、工具調用失敗）。

最後依據發生頻率與嚴重度，設計對應的自動化評估機制。
