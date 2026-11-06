---
id: handoff-gate
title: "Handoff Gate（交接閘門）"
label: "Handoff Gate"
subject: ai-agent-workflows
type: procedure
status: draft
summary: "在交接給下一棒之前先驗證輸出，讓壞結果停在原地而不是順流而下。"
aliases: []
prerequisites: []
related:
  - minimal-handoff-object
  - error-compounding
  - code-orchestrator
sources:
  - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L47-L57]]"
  - "[[sources/ai-agent-workflows/20261105/course/20-sequential-agents-workflow-example.txt#L214-L219]]"
created: 2026-11-06
updated: 2026-11-06
---

# Handoff Gate（交接閘門）

## 問題

循序管線裡，下游 agent 往往非常信任上游交來的內容。如果上游給出一個自信但錯誤的結果，下游通常不會質疑，而是照單全收並繼續推導，錯誤就沿著管線放大。需要一個控制點在交接前擋下壞輸出。

## 前置條件

要設閘門，得先知道「什麼才算合格的交接」。這要求上一棒輸出結構化的交接物件，並且有可驗證的條件，例如必要欄位非空、值落在允許範圍、或格式符合契約。

## 步驟

1. 等待上一個 agent 完成並產出交接物件。
2. 在呼叫下一棒之前，用程式碼檢查該物件是否符合契約。
3. 通過才把交接物件交給下一棒。
4. 不通過就停止、重試上一棒，或回傳明確錯誤，不要帶著半成品繼續。

## 例子

職涯管線中，career picker 先選出一個職業，協調器驗證這個職業有效後，才啟動 path advisor。若選出的職業是空的或不在清單內，流程就停在閘門，不會讓 path advisor 為一個不存在的職業規劃學程。

## 失敗模式

- **閘門條件太寬**：只檢查「有輸出」而不檢查內容，等於沒擋。
- **只驗格式不驗語意**：JSON 合法但選錯類別，仍會往下擴散。
- **閘門自己用 LLM 判斷**：驗證者也可能幻覺，重要條件應盡量用確定性程式碼。
- **驗證失敗仍放行**：為了讓流程跑完而忽略紅燈，會把錯誤留給使用者。

## 進階

閘門檢查的對象是 [[minimal-handoff-object]]，因此交接物件設計得越清楚，閘門越好寫。它是對抗 [[error-compounding]] 的第一道防線，通常由 [[code-orchestrator]] 在呼叫下一棒前執行。
