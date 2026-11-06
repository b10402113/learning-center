---
id: deterministic-baseline
title: "Deterministic Baseline（確定性基準）"
label: "Deterministic Baseline"
subject: ai-agent-workflows
type: concept
status: draft
summary: "完全由程式碼控制、不含 LLM 的起點版本，用來比較後續每個 AI 元件是否值得。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L92-L127]]"
created: 2026-11-06
updated: 2026-11-06
---

# Deterministic Baseline（確定性基準）

## 定義

Deterministic baseline 是一個完全由程式碼控制、不含任何 LLM 的系統版本。每一步的輸入、輸出與分支都由開發者決定，行為可重現、可預測。

## 為什麼重要

它是最便宜、最容易除錯的起點，也是評估後續 AI 元件的基準。沒有 baseline，就很難回答「加入這個 LLM 之後，系統真的變好了嗎，還是只是變貴了」。

## 如何運作

先用手寫規則、查表、條件分支或傳統程式庫把流程跑通。程式碼不必自己從零寫，也可以讓 Copilot、Claude 代筆；重點是邏輯百分之百確定，開發者掌握每一個決策點。等 baseline 完成後，再找出真的需要自然語言處理的步驟，逐一補上 LLM。

## 例子

一個職涯諮詢流程可以先用品質良好的關鍵字與規則做意圖分類，再依分類結果走固定回覆。這個版本沒有 LLM，卻能處理明確的常見問題；後續才針對模糊輸入加入模型。

## 邊界與常見誤解

Baseline 不是終點，也不是每個任務都做得到。當需求涉及開放式自然語言理解時，純程式碼會卡住，這時才需要往光譜右邊移動。另一個誤解是把 baseline 當成「隨便寫的醜版本」；它應該是一個可量測、可比較的正經實作。

## 進階

用同一組 eval 同時跑 baseline 與加入 LLM 的版本。若 LLM 版本沒有在可靠度或覆蓋率上帶來可見的淨收益，就保留 baseline。這種比較能防止「為了用 AI 而用 AI」。
