---
id: monolithic-prompt
title: "Monolithic Prompt（單一大提示詞）"
label: "Monolithic Prompt"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把多種請求與規則塞進同一個巨大 prompt，讓一個模型處理所有狀況。"
aliases: []
prerequisites: []
related:
  - routing
  - prompt-chaining
sources:
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L77-L105]]"
  - "[[sources/ai-agent-workflows/20261105/course/10-routing.txt#L106-L153]]"
created: 2026-11-06
updated: 2026-11-06
---

# Monolithic Prompt（單一大提示詞）

## 定義

Monolithic prompt 是把所有請求型態、所有業務規則、所有背景資料都放進同一個 prompt，讓同一個模型一次處理所有狀況的作法。它是 routing 與 chaining 之前的直覺解，也是用來理解分流的反例。

## 為什麼重要

它確實能跑，所以很容易被當成預設做法。但在真實服務裡，請求型態越多，這個 prompt 就越臃腫：context 變長、焦點分散、模型為了「什麼都顧到」而給出模糊的答案。認清它的代價，才知道為什麼要拆。

## 如何運作

單一大 prompt 的運作方式是「什麼都放進去」：

- 把所有可能的任務說明塞進 system prompt。
- 為了保險，預先拉進各種資料來源，即使這次請求用不到。
- 期待模型自己判斷該用哪一段資訊、該給哪一種答案。

結果是每次請求都付出整份 context 的成本，而且模型必須在大量無關規則中找出相關的那幾條。

## 例子

一個職涯服務若用單一大 prompt，就得同時包含職涯分析、學校與培訓清單、學費補助政策，甚至可能先呼叫一堆無關的 API 把資料拉進 context。但使用者可能只想知道「我適合做什麼」——他完全不在意培訓管道或補助方案。這種情況下，昂貴的 context 與檢索全都被浪費了。

## 邊界與常見誤解

- **不是永遠錯**：請求型態很少、彼此相近時，一個 prompt 可能真的夠用。
- **不是模型不夠大**：換更大的模型不會讓無關資訊消失，只會讓成本更高。
- **不是只要 prompt 寫好就行**：規則越多，衝突越難靠文字排列解決。
- **拆開不是萬靈丹**：拆完仍需要分類或步驟介面，否則只是把同一個問題切成幾份。

## 進階

Route table 與 [[routing]] 是它的直接替代：先分類，再只載入該類需要的 prompt 與資料。若問題不是「多種型態」而是「單一任務太長」，則改用 [[prompt-chaining]]，把任務拆成依序的步驟。
