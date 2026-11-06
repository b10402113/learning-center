---
id: plan-step-cap
title: "Plan Step Cap（計畫步數上限）"
label: "Plan Step Cap"
subject: ai-agent-workflows
type: procedure
status: draft
summary: "用純程式碼過濾空白步驟並截斷計畫長度，避免 LLM 產生的計畫失控。"
aliases: []
prerequisites: []
related:
  - plan-and-execute
  - planner-executor-responder
sources:
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/single-agents/careerPlanAndExecuteAgent.js#L146-L207]]"
created: 2026-11-06
updated: 2026-11-06
---

# Plan Step Cap（計畫步數上限）

## 問題

Plan-and-execute 的計畫由 LLM 產生，而計畫有幾步，就直接決定後面會呼叫幾次 LLM、執行幾次工具。如果完全信任模型輸出，可能拿到空陣列、非字串內容，或長到沒有盡頭的步驟清單，成本與執行時間都會失控。

## 前置條件

規劃者的輸出必須是程式碼可解析的結構，例如 `{"plan": ["step 1", "step 2"]}`。系統需要一個明確的上限常數，決定這個 agent 最多願意執行幾步；這個數字應該由成本與任務性質決定，而不是留給模型自由發揮。

## 步驟

1. 解析規劃者回傳的 JSON，取出 `plan` 陣列。
2. 確認它真的是陣列；不是陣列時視為沒有可用計畫。
3. 過濾掉非字串或只有空白的步驟。
4. 用 `slice(0, MAX_STEPS)` 截斷長度，只保留前幾個步驟。
5. 若過濾後沒有任何步驟，直接拋出錯誤，不要讓空計畫進入執行階段。

## 例子

在職涯顧問 agent 中，`MAX_STEPS` 設為 6。規劃者即使回傳十個步驟，程式碼也只執行前六個；若回傳的內容不是字串陣列，或全部都是空白，`limitPlan` 會拋出「The plan had no usable steps.」，而不是啟動一個沒有目標的執行迴圈。

## 失敗模式

- **截斷掉必要步驟**：上限太小會讓計畫在關鍵步驟前被切斷，最終答案因此不完整。
- **只擋長度不擋品質**：上限能防失控，但不能保證被留下的步驟合理。
- **解析失敗**：模型沒有輸出合法 JSON 時，程式碼要能明確報錯，而不是默默執行空計畫。
- **把上限當成停止條件**：步數上限只管計畫長度，執行階段仍需要自己的停止條件。

## 進階

計畫長度只是第一層護欄。執行者每一步仍可能呼叫多次工具或花掉大量 token，因此還需要為整體迴圈設定 token、時間或成本上限。與 [[plan-and-execute]] 的整體流程搭配，才能同時控制計畫規模與執行預算。
