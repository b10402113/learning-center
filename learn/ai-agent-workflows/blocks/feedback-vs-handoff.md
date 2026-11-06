---
id: feedback-vs-handoff
title: "Feedback Loop vs Handoff（回饋迴圈與交接）"
label: "Feedback Loop vs Handoff"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "回饋迴圈讓同一元件修正並提高可靠度，交接把工作傳給下一棒卻容易複合錯誤。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L212-L281]]"
created: 2026-11-06
updated: 2026-11-06
---

# Feedback Loop vs Handoff（回饋迴圈與交接）

## A 是什麼

Feedback loop 是讓同一個元件根據訊號重試或修正的機制。元件產出結果後，取得外部訊號（測試、數字、規則檢查），判斷對錯，再調整並重做。整個修正留在同一個地方。

## B 是什麼

Handoff 是把工作與 context 交給下一個模組或 agent。前一棒完成自己的部分後，把結果傳出去，後一棒接著做。每一棒可能都有自己的 prompt、工具與判斷邏輯。

## 關鍵差異

Feedback 在同一處形成閉環，錯誤有機會被發現並修正，因此通常提高 reliability。Handoff 把結果往外傳，前一棒的錯誤會變成後一棒的輸入，錯誤可能像滾雪球一樣層層放大，因此通常降低 reliability。換句話說，更複雜、更多交接的系統，不一定更可靠。

## 何時用哪個

能在原地檢查與修正時，優先加 feedback loop：例如有測試可跑、有數字可比、有明確規則可檢查的步驟。非必要不要切 handoff；若真的需要交接，要預期錯誤會被放大，並在交接點附近安排可觀測的檢查。

## 進階

這兩個效果是趨勢，不是定律。在你的系統裡，handoff 也許因為切分清楚而提高可靠度，feedback 也可能因為迴圈過長而失控。最終仍要用同一組 eval 量測，把「回饋後可靠度上升多少、交接後下降多少」變成數字，而不是憑架構名稱判斷。
