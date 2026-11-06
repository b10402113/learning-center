---
id: react-vs-reflexion
title: "ReAct vs Reflexion（單步迭代 vs 跨嘗試反思）"
label: "ReAct vs Reflexion"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "ReAct 在每個動作後調整下一步，Reflexion 在整輪任務結束後檢討並決定是否重跑。"
aliases: []
prerequisites: []
related:
  - react
  - reflexion
  - reflection
sources:
  - "[[sources/ai-agent-workflows/20261105/course/16-reflexion-self-refining.txt#L109-L132]]"
created: 2026-11-06
updated: 2026-11-06
---

# ReAct vs Reflexion（單步迭代 vs 跨嘗試反思）

## A 是什麼

ReAct 是微觀的單步迭代：agent 先思考，採取一個動作，觀察工具回傳的結果，再根據結果調整下一步。它的反思發生在每個動作之後，重點是「這一步的結果有沒有改變我接下來要做什麼」。

## B 是什麼

Reflexion 是宏觀的完整任務反思：agent 先一口氣跑完所有步驟、產出完整答案，接著由 evaluator 批判整份成果；若不合格，才寫下教訓並重新執行整個任務。它的反思發生在一輪任務結束之後。

## 關鍵差異

- **時間尺度**：ReAct 改的是下一步；Reflexion 改的是下一次完整嘗試。
- **反思對象**：ReAct 看單一工具結果；Reflexion 看整條 [[trajectory]] 與最終成果。
- **控制方式**：ReAct 在迴圈中動態調整計畫；Reflexion 在任務邊界決定要不要從頭再來。
- **失敗處理**：ReAct 邊走邊修；Reflexion 先承認整輪失敗，再帶著檢討重跑。

## 何時用哪個

需要根據即時工具結果調整路徑時，用 ReAct，例如查資料過程中發現關鍵字不對就換一個。需要從整輪任務的成敗中學習、且失敗成本可接受時，用 Reflexion，例如寫完程式後跑測試、沒過就整輪重寫。

兩者不是互斥。Production 常見的組合是內層 ReAct 負責靈活呼叫工具，外層 Reflexion 在產出後評估並決定是否重跑。

## 進階

若把 Reflexion 外層的重試次數交給模型自己決定，就會失去對成本的控制；應由程式碼設定 [[bounded-retry-loop]]。反之，若連內層的每步觀察都省略，ReAct 就退化成沒有回饋的單次生成。
