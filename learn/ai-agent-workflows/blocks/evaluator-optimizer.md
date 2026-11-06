---
id: evaluator-optimizer
title: Evaluator-Optimizer（評估者與優化者）
label: Evaluator-Optimizer
subject: ai-agent-workflows
type: concept
status: draft
summary: 生成者產出草稿，評估者依標準批評，回饋與軌跡再送回生成者，直到通過或停止。
aliases: []
prerequisites: []
related:
  - stopping-condition
  - external-signal
  - review-criteria
  - compaction
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/24-evaluator-optimizer.txt#L1-L67]]
  - >-
    [[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L130-L163]]
  - >-
    [[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L164-L210]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Evaluator-Optimizer（評估者與優化者）

## 定義

Evaluator-optimizer 是一種多代理迴圈：優化者（optimizer，也稱生成者）負責產出草稿，評估者（evaluator，也稱 critic）依照明確標準檢查並提出批評；批評與上一輪的執行軌跡一起送回優化者，讓它帶著具體問題修改，直到評估者滿意或觸發停止條件。

## 為什麼重要

單次生成不穩定，模型很容易在沒有人檢查的情況下自信交卷。把「批評」獨立成一個角色，可以攔下大部分明顯瑕疵與邏輯漏洞；可靠度通常高於讓同一個 agent 自己說「我寫得不錯」。

## 如何運作

1. **生成**：optimizer 依任務目標產生第一版。
2. **評估**：evaluator 依標準檢視，指出具體缺點與修改方向。
3. **回饋**：把批評、上一版草稿與執行軌跡交回 optimizer，要求它針對問題修改。
4. **終止檢查**：新版本再次送審；通過就輸出，否則進入下一輪，直到停止條件。

在程式碼實作裡，外層通常是一段確定性迴圈：先跑 writer，再跑 reviewer，讀取 reviewer 的判定，決定是否再一輪。

## 例子

使用者想轉職到科技業。第一輪 optimizer 列出三個方向，但課程描述空泛；evaluator 指出「請換成具體培訓課程，並補上預估花費」。第二輪 optimizer 帶著這份批評補齊細節，evaluator 確認方案具體且含費用後判定通過。

## 邊界與常見誤解

- **不是多問幾次同一個模型**：真正的 evaluator-optimizer 有獨立角色、獨立推理與工具，會針對具體標準檢查。
- **最容易無限迴圈**：評估者永遠能挑出毛病，生成者也可能永遠達不到標準；沒有硬性停止條件很危險。
- **沒有外部訊號時可靠度有限**：若評估者只能讀文字、憑感覺批評，效果遠不如能跑測試或查資料的評估者。
- **成本與可靠性直接掛鉤**：跑越多輪、檢查越細，品質可能越好，但 token 花費也線性上升。

## 進階

停止條件怎麼設計，見 [[stopping-condition]]。讓評估有客觀依據的方法，見 [[external-signal]] 與 [[review-criteria]]；迴圈太長時的上下文處理，見 [[compaction]]。
