---
id: supervisor-cost
title: "Supervisor Cost（監督者成本）"
label: "Supervisor Cost"
subject: ai-agent-workflows
type: concept
status: draft
summary: "多代理系統約耗一般對話 15 倍 token，選 supervisor 前要先問任務值不值得。"
aliases: []
prerequisites: []
related:
  - supervisor
  - workload-fit
  - simplicity-first
sources:
  - "[[sources/ai-agent-workflows/20261105/course/22-supervisor.txt#L172-L232]]"
created: 2026-11-06
updated: 2026-11-06
---

# Supervisor Cost（監督者成本）

## 定義

Supervisor cost 指採用 supervisor 架構時，因為需要一個能力足夠的模型來拆解任務、管理子 agent，再加上多個子 agent 反覆呼叫，而產生的 token 與金錢成本。Anthropic 的觀察是：一般單一 agent 約用掉普通對話 4 倍的 token，多代理系統則約 15 倍。

## 為什麼重要

這是採用 supervisor 最實際的阻礙。決策問題通常不是「supervisor 有沒有比較厲害」，而是「這個任務值不值得花上 15 倍對話的 token」。同一筆預算若花在錯的任務型態上，只會換來更慢、更貴、卻沒有更好的結果。

## 如何運作

成本主要來自三處：

1. **Supervisor 本身**：必須用足以理解全局、拆解任務、判斷子 agent 輸出對不對的模型。
2. **子 agent 的呼叫次數**：每個子任務都是一次（或多次）完整模型呼叫。
3. **層級疊加**：若有多層 supervisor，每層都需要能力足夠的模型，成本會再放大。

估算時要把「呼叫次數 × 每次帶的 context 長度」一起算，而不是只看單次模型單價。

## 例子

廣度優先的研究任務，需要從大量互不相關的文件蒐集資料，且正確性要求高，這時 15 倍成本可能值得。反之，一個只回答常見問答的 FAQ bot，邏輯簡單、路徑固定，用 supervisor 只是白白多花錢。

## 邊界與常見誤解

- **成本高不等於不能用**：若任務價值夠高、錯誤代價夠大，多代理的成本可能划算。
- **不是只有模型單價**：反覆呼叫、長 context、多輪重試都會讓帳單快速上升。
- **多代理不一定比單代理差**：設計良好時，小模型分擔窄任務可能反而省錢；設計不良時才會失控。
- **省錢不能犧牲正確性**：把需要強推理的工作硬塞給小模型，重試次數可能抵銷省下的成本。

## 進階

判斷工作型態是否適合多代理，見 [[workload-fit]]。若只是意圖有限的分流，通常用更便宜的 [[dispatcher]] 就夠；選型的整體原則見 [[simplicity-first]]。
