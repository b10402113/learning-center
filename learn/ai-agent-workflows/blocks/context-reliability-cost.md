---
id: context-reliability-cost
title: Context Reliability Cost（脈絡、可靠度、成本）
label: Context Reliability Cost
subject: ai-agent-workflows
type: concept
status: draft
summary: 用 context、reliability、cost 三個維度評估每個 LLM 系統，因為每交出一份控制權，都會在這張成績單上交換代價。
aliases: []
prerequisites: []
related:
  - agent-vs-workflow
  - guardrails
sources:
  - '[[sources/ai-agent-workflows/20261105/course/0-introduction.txt#L161-L201]]'
  - >-
    [[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L58-L68]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Context Reliability Cost（脈絡、可靠度、成本）

## 定義

Context、reliability、cost 是評估 LLM 系統的三維成績單：

- **Context（脈絡）**：系統需要帶入多少資訊、能理解多複雜的背景。
- **Reliability（可靠度）**：輸出有多穩定、多可預期，會不會失控走偏。
- **Cost（成本）**：包含 API 呼叫次數、運算花費與延遲。

## 為什麼重要

系統架構的選擇本質上是權衡。就像分散式系統用 CAP 定理提醒你無法同時把一致性、可用性與分區容忍度做到極致，LLM 系統也很難三個維度全拿。沒有這張成績單，很容易只看到 agent 的彈性，卻忽略它在可靠度與成本上留下的帳單。

## 如何運作

每次從手寫 workflow 往 single-agent、再往 multi-agent 前進，你都在交出一部分對箭頭的控制權。控制權一鬆手，成績單上的數字就跟著變動：可能換到處理複雜情境的彈性，但可靠度下降，或成本以倍數增加。

評估時不要只問「哪個架構比較強」，而要問「這個任務愿意用多少可靠度與成本，換多少彈性」。

## 例子

CAP 定理常被說成「三個只能拿兩個」，實際上比較像是取捨與平衡，有時多付一點成本就能多拿一點。LLM 系統也一樣：不是精確的二選一，而是每個系統都得決定要放棄什麼、加碼什麼。

## 邊界與常見誤解

- **不是固定公式**：三個維度沒有統一分數，必須放回具體任務與產品需求判斷。
- **彈性也是收益**：交出的控制權不是純損失，它換來的是原本寫死流程做不到的能力。
- **只看模型會誤判**：成績單衡量的是整個系統，不是單一模型的好壞。

## 進階

把成績單當成每次架構決策後的檢查點：這個系統拿到了什麼、放棄了什麼、為什麼值得。久而久之，你會累積出屬於自己專案與團隊的取捨基準，而不是盲目追新。
