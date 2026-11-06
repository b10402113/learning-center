---
id: subagents-as-tools
title: "Subagents as Tools（子 agent 即工具）"
label: "Subagents as Tools"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把每個子 agent 包成 supervisor 的一個工具，呼叫它就把任務交給該 agent 並取回答案。"
aliases: []
prerequisites: []
related:
  - supervisor
  - worker-context-isolation
  - tool-calling
sources:
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerSupervisorMultiAgent.js#L1-L154]]"
created: 2026-11-06
updated: 2026-11-06
---

# Subagents as Tools（子 agent 即工具）

## 定義

Subagents as tools 是一種實作 supervisor 的方式：每個子 agent 被註冊成 supervisor 的一個工具，名稱像 `delegate_to_roadmap_advisor`。Supervisor 呼叫這個工具時，系統會用 supervisor 寫的任務文字執行該子 agent，並把子 agent 的最終答案當成工具結果（observation）回傳。

## 為什麼重要

它讓 supervisor 不需要特殊的编排程式碼。Supervisor 本身就是一個 ReAct agent，它的工具箱裡裝的是「委派給某個 worker」；決定叫誰、叫幾次、何時結束，全都回到一般 agent 的 Thought-Action-Observation 迴圈。

## 如何運作

1. 先建立 worker agent：每個都有自己的 system prompt、工具與記憶。
2. 替每個 worker 建立一個 delegation tool，描述寫清楚這個 worker 擅長什麼。
3. 把這些工具交給 supervisor；supervisor 自己沒有領域工具。
4. Supervisor 輸出 `Action: delegate_to_<worker>` 與任務內容，系統執行對應 worker。
5. Worker 的 Final Answer 變成 supervisor 的 Observation，supervisor 再決定下一步。

## 例子

職涯系統裡有三個 worker：Career Matcher、Job Market Analyst、Roadmap Advisor。Supervisor 的可用動作就是 `delegate_to_career_matcher`、`delegate_to_job_market_analyst`、`delegate_to_roadmap_advisor`。它先派給 matcher 找候選職涯，再派給 analyst 比較市場，最後派給 advisor 寫出取得路徑。

## 邊界與常見誤解

- **不是一般工具呼叫**：工具回傳的是另一個完整 agent 的答案，成本與延遲都比普通函式高。
- **Worker 不會主動回報**：它只在被呼叫時執行一次，答案回給 supervisor 後就結束。
- **Supervisor 必須把任務寫完整**：worker 看不到原始對話，也不會看到其他 worker 的結果，所以 supervisor 要自己把必要背景塞進任務。
- **Worker 之間不互相溝通**：所有資訊都經由 supervisor 中轉。

## 進階

Worker 每次被呼叫都從乾淨的 context 開始，這個性質見 [[worker-context-isolation]]。整個模式的角色分工見 [[supervisor]]；若 worker 需要呼叫外部能力，底層仍是 [[tool-calling]]。
