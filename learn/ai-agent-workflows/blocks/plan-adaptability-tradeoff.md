---
id: plan-adaptability-tradeoff
title: "Plan Adaptability Trade-off（計畫適應力取捨）"
label: "Plan Adaptability Trade-off"
subject: ai-agent-workflows
type: principle
status: draft
summary: "一次規劃、固定執行能換來較少呼叫與較低成本，代價是無法在途中修改計畫。"
aliases: []
prerequisites: []
related:
  - plan-and-execute
  - react-vs-plan-and-execute
sources:
  - "[[sources/ai-agent-workflows/20261105/course/15-plan-execute.txt#L25-L58]]"
created: 2026-11-06
updated: 2026-11-06
---

# Plan Adaptability Trade-off（計畫適應力取捨）

## 主張

Plan-and-execute 用「一次規劃、一路執行」換取較少的模型呼叫與較低的成本，但這個好處是用適應力換來的：計畫一旦寫下，就不會因為中途的觀察結果而修改。

## 為什麼成立

計畫在任務開始時就由模型一次寫成，之後執行者只負責逐步完成，不需要在每一步之後重新呼叫規劃器。模型呼叫次數下降，成本通常也跟著下降；流程固定，測試與除錯也比邊走邊改的迴圈容易。反過來說，因為計畫是根據有限的初始資訊寫成的，執行中若出現意外，系統沒有機制回頭修正。

## 適用範圍

任務能在開始前乾淨拆解、步驟之間不太會出現非預期轉折時，這個取捨划算。例如在物件裡替換幾個變數名稱、依固定欄位整理資料，或步驟順序事先就能確定的顧問流程。重點不是任務簡單，而是「執行途中不需要改方向」。

## 反例

寫程式是典型反例：程式碼很難一次改對，測試結果往往會推翻原本的假設，必須邊做邊修。需要查研究資料、比較多個候選答案，或任何「某一步的結果可能讓你知道原本計畫錯了」的任務，都應該改用能重新規劃的 ReAct。硬套 plan-and-execute 會讓 agent 明知結果不對，仍照原計畫走完。

## 進階

這個取捨也可以反過來看：如果任務其實完全可預測，為什麼不直接寫成 workflow？Plan-and-execute 仍有存在價值，因為計畫由 LLM 產生，能容納比手寫流程更多的步驟與一點動態彈性；但控制權仍在程式碼手上。相關設計見 [[plan-and-execute]]，與 ReAct 的對照見 [[react-vs-plan-and-execute]]。
