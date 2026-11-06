---
id: dynamic-decomposition
title: "Dynamic Decomposition（動態拆解）"
label: "Dynamic Decomposition"
subject: ai-agent-workflows
type: concept
status: draft
summary: "子任務不是事先寫死，而是協調者在 runtime 依當次輸入現場拆出來的。"
aliases: []
prerequisites: []
related:
  - supervisor
  - task-decomposition
  - fork-vs-decomposition
sources:
  - "[[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L42-L110]]"
created: 2026-11-06
updated: 2026-11-06
---

# Dynamic Decomposition（動態拆解）

## 定義

Dynamic decomposition 是指：一個任務該切成哪些子任務，不在開發時固定，而是在每次輸入進來時，由協調者 agent 根據內容現場決定。決定的結果可能每次都不同，後續也可能因為新資訊而追加子任務。

## 為什麼重要

固定 workflow 只能處理開發者預想到的步驟。當需求開放、無法事先列出所有分支時，動態拆解讓系統仍有辦法把問題切小，再逐塊解決。它也是 supervisor 與平行處理最關鍵的差別。

## 如何運作

1. 協調者讀取使用者的完整輸入。
2. 它建立一份當次專用的計畫，列出需要哪些子問題。
3. 每個子問題被派給對應的專門 agent。
4. 結果回來後，協調者檢查是否還缺資訊；缺就再拆新的子任務，不缺就統整回覆。

這裡的「計畫」可能存在於模型的推理裡，也可能是顯式的一段結構化輸出；重點是它由模型當次產生，而不是程式碼裡的固定清單。

## 例子

使用者說自己喜歡動物與科學、不喜歡久坐。協調者可能先拆出「有哪些適合的職涯」，再依結果拆出「這些職涯的就業市場如何」，最後拆出「取得這份工作需要什麼學歷與證照」。這三個子任務不是事先排好的，而是前一題的答案才會引出下一題。

## 邊界與常見誤解

- **不是把任務切得越細越好**：切太細會增加呼叫次數與延遲，也可能讓子任務失去整體脈絡。
- **相依性高的任務難以動態拆解**：如果每一步都必須共享同一份 context，拆出去反而容易出錯。
- **拆解品質取決於協調者模型**：模型不夠強時，會漏掉子任務或重複派工。
- **與平行處理不同**：平行處理的子任務是事先定義好的，只是同時執行；動態拆解連「有哪些子任務」都是 runtime 才決定。

## 進階

動態拆解通常由 [[supervisor]] 執行，實作方式見 [[subagents-as-tools]]。它與一般任務拆解的差異，可對照 [[task-decomposition]]；與 dispatcher 的 fork 相比，見 [[fork-vs-decomposition]]。
