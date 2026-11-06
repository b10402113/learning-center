---
id: adaptability
title: Adaptability（適應力）
label: Adaptability
subject: ai-agent-workflows
type: concept
status: draft
summary: agent 在執行時動態處理未窮舉情境的能力，讓同一套程式面對沒見過的輸入組合。
aliases: []
prerequisites: []
related:
  - single-agent-scorecard
  - agent-loop
  - agent-vs-workflow
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L72-L97]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Adaptability（適應力）

## 定義

Adaptability 是 agent 在執行當下，根據實際情況動態決定下一步的能力。它不需要開發者事先窮舉所有分支，而是讓模型依 context 與工具結果即時組合行動，處理沒見過的輸入。

## 為什麼重要

在計分卡上，適應力可能只佔一欄，但它往往決定一個功能「能不能做出來」。有些業務的組合爆炸到不可能寫死：每一種職業選擇、每一所學校、每一筆獎學金、每一條申請資格，都有不同的判斷路徑。沒有適應力，這類系統根本無法實作。

## 如何運作

1. 使用者輸入一個未預先分類的情境。
2. Agent 根據 context 自行決定要查哪些資料、用哪些工具。
3. 每次工具回傳後，agent 依結果調整下一步，而不是照固定腳本走。
4. 同一個程式因此能處理各種未見過的輸入組合。

## 例子

職涯顧問面對「我很有創意、喜歡幫助人、想留在南卡、需要資金」這種組合，不必為每種興趣、州別與財務狀況寫一條分支；agent 會自行搜尋職業、課程與補助，再依結果調整。

## 邊界與常見誤解

- **適應力不是免費的**：它通常伴隨較差的 context、較低的 reliability 與較高的 cost。
- **不是什麼都需要**：若流程固定、錯誤代價高，workflow 的確定性反而更適合。
- **不是無限制的自由**：仍要設計 agent 的邊界、工具權限與停止條件，否則適應力會變成失控。
- **不等於聰明**：適應力只描述「能處理未窮舉情境」，不保證每次判斷都正確。

## 進階

適應力是 [[single-agent-scorecard]] 上交換到的主要回報，也是 [[agent-vs-workflow]] 的核心分界。若某個任務的適應力需求不高，就不值得為它付出 context、可靠度與成本上的代價。
