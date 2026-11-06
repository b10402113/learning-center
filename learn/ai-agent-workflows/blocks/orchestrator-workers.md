---
id: orchestrator-workers
title: "Orchestrator-Workers（編排者與工作者）"
label: "Orchestrator-Workers"
subject: ai-agent-workflows
type: concept
status: draft
summary: "中央 LLM 在執行期動態拆解任務、分派給 worker，再彙整所有結果。"
aliases: []
prerequisites: []
related:
  - fixed-workflow
  - workflow-agent-handoff
sources:
  - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L270-L302]]"
  - "[[sources/ai-agent-workflows/20261105/course/11-parallelization-other-workflows.txt#L303-L342]]"
created: 2026-11-06
updated: 2026-11-06
---

# Orchestrator-Workers（編排者與工作者）

## 定義

Orchestrator-workers 是一種流程模式：中央有一個 orchestrator LLM，負責把使用者的總體任務動態分解成多個子任務，分派給個別的 worker LLM 處理，最後再把所有 worker 的成果融成單一最終回覆。

## 為什麼重要

它與 prompt chaining 的差別在於「誰決定子任務」。prompt chaining 的步驟與順序由工程師寫死；orchestrator-workers 則由模型在執行期決定需要哪些子任務、要幾個 worker、是否還要再派一輪。這讓它成為唯一踩在 workflow 與 agent 邊界上的常見模式。

## 如何運作

執行分成三個階段，但階段的先後由程式碼固定：

1. **Plan**：orchestrator 讀取使用者輸入，輸出 JSON 形式的子任務清單。
2. **Delegate**：程式碼驗證清單（過濾格式錯誤、限制數量上限），再把每個子任務平行交給 worker。每個 worker 只看到原始輸入與自己那一份子任務。
3. **Synthesize**：orchestrator 或另一個 synthesizer LLM 把 worker 結果合併成最終答案。

雖然子任務內容是動態的，程式碼仍可在 plan 與 delegate 之間插入 gate，避免模型一次要求過多呼叫而讓成本失控。

## 例子

職涯諮詢的 orchestrator 先決定派一個 worker 找適合的職業；看到結果後發現還缺就學資訊，再派一個學校調查 worker；接著又發現需要資金方案，再派第三個。等資訊齊全，orchestrator 才組裝完整建議。整個過程沒有預先寫死「先職業、再學校、再資金」。

## 邊界與常見誤解

- **不是 prompt chaining**：chaining 的步驟是靜態的，orchestrator-workers 的子任務是執行期才決定。
- **不是完全自主的 agent**：plan、delegate、synthesize 這三個階段仍由程式碼固定，模型只是在階段內決定內容。
- **worker 可以是固定角色**：實務上 worker 常是一組固定的專業角色，orchestrator 只是決定何時呼叫哪一個，必要時可以退回重做。
- **沒有 gate 會失控**：模型決定子任務數量，就等於決定呼叫次數，外圍程式碼必須設上限。

## 進階

當 orchestrator 能重試、反思並重新派發任務時，它就站在 workflow 與 agent 的交界。這條界線的判準見 [[workflow-agent-handoff]]，與固定流程的對照見 [[fixed-workflow]]。
