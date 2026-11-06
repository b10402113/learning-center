---
id: agent
title: Agent（代理）
label: Agent
subject: ai-agent-workflows
type: concept
status: draft
summary: Agent 是能感知環境、取得回饋並據此採取行動的實體；現代實作是具備工具、記憶、規劃與反思的 LLM 系統。
aliases: []
prerequisites: []
related:
  - boxes-and-arrows
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L69-L95]]
created: 2026-11-06
updated: 2026-11-06
---

# Agent（代理）

## 定義

Agent 是任何能透過感測器感知環境、並透過致動器對環境採取行動的實體。這個定義來自 Russell 與 Norvig 的《Artificial Intelligence: A Modern Approach》。用白話說，agent 能接觸外部環境、取得回饋，再根據回饋做出調整。

在現代 LLM 系統裡，agent 通常被描述成具備四項能力的 LLM 系統：工具、記憶、規劃與反思。

## 為什麼重要

「agent」很容易被當成「比較厲害的模型」的同義詞，但兩者不是同一件事。分清楚 agent 的定義，才能判斷一個系統是否真的能感知、行動與調整，也才能解釋為什麼同樣的模型放進不同外殼後，行為會差這麼多。

## 如何運作

Agent 的運作可以看成一個循環：先取得環境的輸入或回饋，再決定下一個動作，透過致動器執行，然後把結果當成新的回饋。現代 LLM agent 把這個循環中的決策交給模型，並用四項能力支撐：

- **工具**：呼叫外部 API、執行運算，作為對外行動的手段。
- **記憶**：保留互動與環境狀態。
- **規劃**：把大目標拆成步驟並安排順序。
- **反思**：檢查執行結果，發現錯誤時修正。

## 例子

本課程所談的 agent，就是「LLM + 工具 + 記憶 + 規劃 + 反思」的組合。模型負責推理，外殼負責讓它能接觸環境並採取行動；四項能力缺一不可，否則就只是會產生文字的回應器。

## 邊界與常見誤解

- **Agent 不等於 LLM**：LLM 只能輸出文字，agent 強調的是感知、行動與回饋的循環。
- **Agent 不等於 workflow**：workflow 的箭頭由開發者決定；agent 保留了一部分自行選路的能力。
- **自主性有代價**：能自行調整，也代表行為較難預測，需要額外的界線與停止條件。

## 進階

判斷一個系統是不是 agent，可以問三個問題：它能不能取得環境回饋？能不能據此改變行動？下一個步驟是不是由它自己決定？三個答案都是「是」，才適合用 agent 的框架討論。
