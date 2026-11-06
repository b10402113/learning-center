---
id: reflexion-roles
title: "Reflexion Roles（反思三角色）"
label: "Reflexion Roles"
subject: ai-agent-workflows
type: concept
status: draft
summary: "Reflexion 把做事、評分與寫檢討拆成 Actor、Evaluator、Self-reflection LLM 三個角色。"
aliases: []
prerequisites: []
related:
  - reflexion
  - reflection
  - external-signal
sources:
  - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L220-L259]]"
  - "[[sources/ai-agent-workflows/20261105/course/7-planning-reflection.txt#L260-L283]]"
created: 2026-11-06
updated: 2026-11-06
---

# Reflexion Roles（反思三角色）

## 定義

Reflexion 把改進機制拆成三個各自獨立的分工角色：Actor 負責實際執行動作，Evaluator 負責審查與評分，Self-reflection LLM 負責把失敗寫成可讀的檢討。三個角色可以共用同一個模型，但職責必須分開。

## 為什麼重要

如果讓同一個角色既做事又判斷自己好不好，評估就會缺乏獨立性，容易變成自我感覺良好。把「執行」與「判斷」拆開，才能讓失敗訊號真的來自外部；把「判斷」與「寫檢討」拆開，檢討才有明確的依據。

## 如何運作

- **Actor**：接收任務，把目標轉成動作，與環境互動並觀察回傳結果。它就是一般說的 agent。
- **Evaluator**：審查 Actor 的完整 [[trajectory]]，包含每一步、每次工具呼叫與所有中間觀察，然後給分。它不一定要是 LLM；單元測試或其他確定性檢查往往更準。
- **Self-reflection LLM**：讀取軌跡與評分，用白話寫下「我做了 X、搜了 Y，但結果不對，下次應改用 Z」。

## 例子

在程式碼任務中，Actor 是寫程式的 agent，Evaluator 是測試套件，Self-reflection LLM 讀失敗測試與 agent 的步驟後寫下：「我改了 parser 但沒處理空輸入，下次要先補邊界測試。」下一次嘗試便會帶著這段話。

## 邊界與常見誤解

- **Evaluator 不必是 LLM**：確定性的單元測試通常比模型自評更穩定。
- **角色分開不等於必須用三個不同模型**：同一個模型可以扮演多個角色，但評估時最好換一份提示與乾淨的 context，避免它附和先前的產出。
- **Self-reflection 不是萬能**：它只能根據 evaluator 給的訊號檢討，訊號錯就會檢討錯。
- **三個角色缺一不可**：少了獨立 evaluator，就退化成沒有外部訊號的 [[self-refine]]。

## 進階

角色拆分的好處是每個介面都可以替換：evaluator 可以從模型換成測試，reflection 可以從即時生成換成寫入長期記憶。這種可替換性正是 [[reflexion]] 能與其他系統組合的原因。
