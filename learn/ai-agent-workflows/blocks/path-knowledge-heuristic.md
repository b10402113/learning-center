---
id: path-knowledge-heuristic
title: "Path Knowledge Heuristic（路徑知識啟發式）"
label: "Path Knowledge Heuristic"
subject: ai-agent-workflows
type: principle
status: draft
summary: "用你對執行路徑知道多少來選架構：已知步驟用 workflow，路徑未知但集合已知用 single agent。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L128-L211]]"
  - "[[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L418-L430]]"
created: 2026-11-06
updated: 2026-11-06
---

# Path Knowledge Heuristic（路徑知識啟發式）

## 主張

選架構時，先問自己對「解法路徑」知道多少：

- 每次的步驟都已知，只有中間某一步特別困難：用 LLM-powered workflow。
- 路徑未知，但所有可能走向的集合已知：用 single agent，讓模型在 runtime 選箭頭。
- 問題可拆成獨立子問題，且各自需要大量 context：才考慮 multi-agent。

## 為什麼成立

Workflow 適合把已知步驟固定下來，開發者能控制每個環節；single agent 適合「不知道使用者會走哪條路，但知道所有合法路徑」的情境，例如客服 chatbot：你無法預測使用者問什麼，但能界定它能做與不能做的事。多 agent 的成本最高，只有在單一 agent 的 context 不夠、且子問題真的獨立時才划算。

## 適用範圍

這是設計前的架構初選，特別適合還沒開始寫程式、正在決定系統形狀的階段。它也能用來解釋為什麼某個看似不炫的 dispatcher，可能比 multi-agent 更貼合需求。

## 反例

如果連「可能路徑的集合」都無法界定，single agent 的前提就不成立。這時硬套「路徑未知就用 single agent」會讓模型在無界空間裡亂走。應該先縮小問題、加上 guardrail，或改用更受控的 workflow，而不是直接跳到 multi-agent。

## 進階

這是啟發式，不是定律。實際選擇仍要用三欄成績單與 eval 驗證；若量測顯示更簡單的架構表現一樣好，就應該留在左邊。面試或設計討論時，能把「為什麼選這個位置」講清楚，比記住名詞更重要。
