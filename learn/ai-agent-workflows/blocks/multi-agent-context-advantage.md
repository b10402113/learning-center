---
id: multi-agent-context-advantage
title: "Multi-Agent Context Advantage（多代理上下文優勢）"
label: "Multi-Agent Context Advantage"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把工作拆給多個 agent，讓每個只處理窄 context，輸出更短、模型也更容易替換。"
aliases: []
prerequisites: []
related:
  - worker-context-isolation
  - verification-gap
  - supervisor-cost
sources:
  - "[[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L35-L87]]"
created: 2026-11-06
updated: 2026-11-06
---

# Multi-Agent Context Advantage（多代理上下文優勢）

## 定義

Multi-agent context advantage 指多代理系統最主要的好處：不再由一個 agent 在同一個 context 裡包辦所有推理、蒐集與統整，而是把工作分給多個 agent，每個只處理自己那一小塊。單一 agent 想很多事會產出很長的軌跡；多個小 agent 各自只輸出最終答案，總 context 更短、更聚焦。

## 為什麼重要

Context 是 agent 最稀缺的資源之一。把工作拆開後，可以為每個窄任務配置較小的模型，讓昂貴的大模型只用在真正需要的地方。每個 agent 的推理與檢索因此更短、更精準，整體也比較容易維護。

## 如何運作

1. 把整體任務切成數個職責清楚的區塊。
2. 每個區塊交給一個專門 agent，各自擁有自己的 system prompt、工具與 context。
3. 每個 agent 只做自己那份推理與資訊蒐集，輸出精簡結果。
4. 由協調者或流程把結果接起來。

這種拆法也讓系統比較容易擴充：理論上可以新增、移除 agent，或替換某個節點的模型，而不必整組重寫；風險不會全部押在單一模型上。

## 例子

一個職涯顧問系統把「找適配職涯」、「比較就業市場」、「規劃學歷與證照」分成三個 agent。每個 agent 的 context 只包含自己需要的資料，不必把整份使用者背景、市場數據與學校資訊全塞進同一個視窗。

## 邊界與常見誤解

- **不是自動更準確**：拆開只降低單一 context 的負擔；如果沒有驗證，agent 之間仍會互相盲信。
- **不是免費**：多個 agent 通常仍需至少一個大模型，加上多次呼叫，總成本可能更高。
- **協調本身也要 context**：協調者必須知道誰能做什麼，這部分不會消失。
- **不是所有任務都能拆**：高度相依、需要共享上下文的工作拆開後反而更容易出錯。

## 進階

拆開後的隔離效果，見 [[worker-context-isolation]]。這項優勢最常見的抵銷因素是缺乏查核，見 [[verification-gap]]；成本面見 [[supervisor-cost]]。
