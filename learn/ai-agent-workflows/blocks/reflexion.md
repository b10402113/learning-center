---
id: reflexion
title: "Reflexion（跨嘗試反思）"
label: "Reflexion"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用自然語言把每次失敗的檢討寫進記憶，讓 agent 在重跑同一任務時累積教訓、不再重複犯錯。"
aliases: []
prerequisites: []
related:
  - reflection
  - reflection-memory
  - reflexion-roles
  - react-vs-reflexion
  - in-context-learning
sources:
  - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L220-L259]]"
  - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L90-L108]]"
created: 2026-11-06
updated: 2026-11-06
---

# Reflexion（跨嘗試反思）

## 定義

Reflexion 是 2023 年提出的提示架構，讓 agent 在多次嘗試同一個任務時，用自然語言反思內部與外部回饋，並把失敗教訓累積下來。它的目標不是優化單一答案，而是讓 agent 在重跑整個任務時，自動避開前幾輪踩過的坑。名稱中的 X 是刻意保留的拼法。

## 為什麼重要

Agent 最常見的挫折，是在同一個任務上反覆犯一模一樣的錯。重新執行若沒有帶著任何新資訊，通常會走回原本的死胡同。Reflexion 讓改進發生在文字與 context 裡，不需要改程式碼、改提示詞或重新微調模型，就能看到跨嘗試的進步。

## 如何運作

1. Actor 執行任務，產生完整行動軌跡與最終成果。
2. Evaluator 審查整條軌跡並評分，而不只看最後答案。
3. 若未通過，Self-reflection LLM 根據軌跡與評分寫下一段白話檢討。
4. 這段檢討被放回 context，成為 Actor 下一次嘗試的前情提要。
5. 重複直到通過或達到停止條件。

到第三次嘗試時，agent 看到的不只是上一輪結果，而是前兩輪累積的失敗筆記。

## 例子

職涯規劃 agent 第一次嘗試後寫下：「我漏掉一些資金選項，下次除就學貸款外，也要搜尋獎學金與補助金。」這段文字進入第二輪 context 後，agent 便會主動擴大搜尋範圍。

## 邊界與常見誤解

- **學習只存在 context**：一旦任務結束、context 清空，這些心得就消失，除非寫進長期記憶。
- **不是微調**：Reflexion 不更新權重，速度快、成本低，但也不會變成永久能力。
- **仍需要好 evaluator**：若評分不準，反思會累積錯誤教訓。
- **不是無限重跑**：仍然需要 [[bounded-retry-loop]] 守住成本。

## 進階

Reflexion 常與 [[react]] 組合：內層用 ReAct 靈活呼叫工具，外層用 Reflexion 在任務結束後評估並決定是否重跑。若要跨 session 保留教訓，需把反思接到 [[reflection-memory]] 或長期記憶。
