---
id: workflow
title: "Workflow（工作流）"
label: "Workflow"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用程式碼寫死步驟與分支的系統，模型只是其中一個盒子，不決定下一步。"
aliases: []
prerequisites: []
related:
  - control-ownership-spectrum
  - prompt-chaining
  - routing
sources:
  - "[[sources/ai-agent-workflows/20261105/course/8-prompt-chaining.txt#L1-L51]]"
created: 2026-11-06
updated: 2026-11-06
---

# Workflow（工作流）

## 定義

Workflow 是一組寫在程式碼裡的指令集，也就是開發者熟悉的控制流（control flow）。它可以是腳本、函式、Lambda，或單純幾行 `if-else`。流程裡的每一步、每個分支與連線，都由開發者事先寫死。

## 為什麼重要

多數 LLM 應用不需要模型自行決策。先問「這條路徑我能不能自己寫死」，能寫死就寫死，系統會更可預測、更便宜、更容易除錯。Workflow 是控制權完全留在開發者手上的那一端，也是判斷何時才該讓出控制權的基準點。

## 如何運作

開發者決定執行順序與分支條件，程式碼依序呼叫每個步驟。某些步驟可能因為任務困難或需要自然語言生成而呼叫 LLM，但模型只負責把自己那一步的輸入轉成輸出。模型沒有權力選擇下一步，也不會自行啟動下一次呼叫。

換句話說，箭頭是開發者畫的；模型只是箭頭之間的其中一個盒子。

## 例子

一個職涯諮詢服務可以寫成三個固定步驟：先依使用者的喜好挑出適合的職業，再為該職業排出培訓路徑，最後找資金選項。整個過程由程式碼串起，每一步各自呼叫一次模型，最後組合成一份回應。這條路徑不會因為模型「覺得」該先談學費而改變。

## 邊界與常見誤解

- **Workflow 不等於沒有 LLM**：呼叫模型完全可以是 workflow 的一部分。
- **Workflow 不等於簡單**：真正的難度在把程式碼的控制流程架好，而不是接上 API。
- **加了模型不會變成 agent**：只要下一步仍由程式碼決定，它就還是 workflow。
- **Workflow 不是退而求其次**：對可預測的任務，它往往比 agent 更可靠。

## 進階

下一步是判斷控制權要放在哪裡：完全由程式碼決定、由模型從預先定義的選項中挑，或讓模型決定誰來挑。這個尺度見 [[control-ownership-spectrum]]。若要開始拆解流程，最小的兩種箭頭是 [[prompt-chaining]] 與 [[routing]]。
