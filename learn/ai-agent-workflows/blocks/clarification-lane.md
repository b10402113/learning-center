---
id: clarification-lane
title: "Clarification Lane（澄清路徑）"
label: "Clarification Lane"
subject: ai-agent-workflows
type: concept
status: draft
summary: "在 dispatcher 選單加入「不確定」選項，先向使用者補問，再重新分類。"
aliases: []
prerequisites: []
related:
  - bad-route-recovery
  - route-menu
  - dispatcher
sources:
  - "[[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L117-L157]]"
created: 2026-11-06
updated: 2026-11-06
---

# Clarification Lane（澄清路徑）

## 定義

Clarification lane 是 dispatcher 選單裡的一條特殊路徑，專門處理「無法確定意圖」的輸入。當分類器覺得模糊、難以抉擇時，可以選擇這條 lane，由一個澄清 agent 向使用者提出引導問題，補足關鍵資訊後再重新分類。

## 為什麼重要

分類器遇到模糊輸入時，最糟的做法是勉強猜一個最接近的類別。猜錯之後，被選中的專門 agent 通常無法自行回到正軌。澄清 lane 把「我不確定」變成一個合法的系統狀態，讓系統有機會在做出不可逆的分流之前先問清楚。

## 如何運作

1. 在路徑選單中新增一條 lane，描述為「感到困惑／無法確定」。
2. 分類器的提示詞明確允許它選擇這條 lane，而不是被迫從其他 lane 中硬選。
3. 澄清 agent 針對缺少的資訊提出具體問題，例如「你想找的是職涯方向、課程，還是補助？」。
4. 使用者回答後，把新資訊併入原始請求，重新執行分類。
5. 這一次分類通常就能落到正確 lane。

## 例子

使用者只說「我想轉職」，沒有說想探索方向、找課程或找補助。分類器選擇澄清 lane；澄清 agent 問：「你現在最想先解決哪一件事？」使用者回答「先看看有哪些相關課程」，系統再分流到培訓 agent。

## 邊界與常見誤解

- **澄清不是多問就好**：問題若太空泛，使用者只會更困惑；要問能直接區分 lane 的關鍵資訊。
- **會增加一輪延遲**：使用者必須先回答，才會進入真正的工作流程。
- **不是所有模糊都值得澄清**：若某個預設 lane 已能合理處理，硬加一輪可能反而打擾使用者。
- **澄清 lane 也需要好的描述**：分類器要能判斷什麼時候該用它，否則它永遠不會被選中。

## 進階

它是 [[bad-route-recovery]] 最常用的一招，因為不需要額外的檢查代理。整體分流設計見 [[dispatcher]]，選單安排見 [[route-menu]]。
