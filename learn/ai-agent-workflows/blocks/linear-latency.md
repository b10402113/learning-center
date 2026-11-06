---
id: linear-latency
title: "Linear Latency（線性延遲）"
label: "Linear Latency"
subject: ai-agent-workflows
type: concept
status: draft
summary: "循序流程的總等待時間等於各步驟相加，會隨 agent 數量線性成長。"
aliases: []
prerequisites: []
related:
  - sequential-multi-agent
  - parallelization
sources:
  - "[[sources/ai-agent-workflows/20261105/course/19-sequential-agents.txt#L227-L240]]"
created: 2026-11-06
updated: 2026-11-06
---

# Linear Latency（線性延遲）

## 定義

Linear latency 指循序系統的總延遲等於每一步執行時間的總和。因為下一個 agent 必須等上一個完全結束才能開始，多加一個 agent 就等於在尾端再接上一段等待。

## 為什麼重要

延遲直接影響使用者體驗，也決定某些互動式任務是否可行。循序架構雖然流程單純、成本可控，卻是常見多 agent 型態中延遲最差的一種；每增加一棒，等待時間就往上疊加。

## 如何運作

系統依序執行 agent：第一個完成、交出結果，第二個才能啟動，如此類推。每個 agent 內部可能還包含多輪規劃、工具呼叫與反思，因此單一步驟的實際時間往往比一次 LLM 呼叫長得多。延遲不是固定常數，而是隨步驟數與每步內部迴圈一起增加。

## 例子

一條三步的職涯管線，若每一步各需數十秒，總等待就是三步加總。把同樣的分析改成平行 fan-out，總時間才有機會從「相加」降到「最慢的那一個」。

## 邊界與常見誤解

- **不是所有步驟都等長**：某些 agent 內部迴圈較多，會主導總延遲。
- **不是只有呼叫次數影響延遲**：工具執行、重試與反思都會累加。
- **不是越低越好**：追求低延遲可能得付出更高成本或更複雜的協調。

## 進階

要拆掉這個瓶頸，可評估 [[parallelization]]：只要子任務彼此獨立，就能同時執行。若不能平行，則應減少不必要的 agent 層級，或把簡單轉換交回 [[prompt-chain-vs-sequential]] 的輕量做法。
