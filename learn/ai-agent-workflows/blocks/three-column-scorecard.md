---
id: three-column-scorecard
title: Three-Column Scorecard（三欄成績單）
label: Three-Column Scorecard
subject: ai-agent-workflows
type: concept
status: draft
summary: 用 context、reliability、cost 三欄加總評估系統，而不是只看 benchmark 的單一分數。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/27-evaluations.txt#L16-L73]]'
  - '[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L212-L281]]'
created: 2026-11-06
updated: 2026-11-06
---

# Three-Column Scorecard（三欄成績單）

## 定義

三欄成績單是一套比較 AI 系統的框架，固定看三個維度：context（模型每次要處理的資訊量）、reliability（行為是否穩定正確）與 cost（每次執行的花費）。它把「哪個系統比較好」從直覺變成可以逐欄加總的表格。

## 為什麼重要

排行榜與單一 benchmark 分數通常只呈現 reliability 這一欄，成本與 context 幾乎完全消失。只看這一欄，很容易用五倍成本換來 1% 的正確率，卻誤以為自己選了更好的系統。

## 如何運作

三個維度各自有方向：

- **Context**：每一個交給模型的工具，輸入與輸出都在消耗 context。RAG 能買回一些空間，但要付額外成本；sub-agent 能替主要系統換回大量 context，代價是成本翻倍。
- **Reliability**：加入 feedback loop 通常會提高可靠度；一旦加入 handoff，錯誤可能層層複合，可靠度反而下降。更複雜的架構不等於更可靠。
- **Cost**：越往架構光譜的右端，花費幾乎只會上升，只有少數規劃良好的 multi-agent 系統例外。

## 例子

兩個模型的答對率分別是 98% 與 97%，但前者成本是後者的五倍。單看排行榜會選 98% 的那個；把三欄一起看，答案取決於你的預算與 context 需求。反過來說，一個只做意圖分類加 dispatcher 的系統，外觀不炫，卻可能同時保住小 context 與低成本。

## 邊界與常見誤解

三欄的趨勢不是定律。「handoff 降低可靠度、feedback 提高可靠度」是一般觀察，在你自己的使用者與情境裡可能完全相反。成績單也不是填一次就結束，模型與 prompt 一改就要重填。

## 進階

實務做法是同時跑一個無聊的 workflow 與一個精巧的 multi-agent 系統，各跑多次，取平均可靠度與平均花費，再把數字填進三欄。自動化 eval、手動測試、請朋友點一百次都算量測；重點是讓每一欄都有數字，而不是只有一句「我覺得這個比較好」。
