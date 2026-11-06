---
id: bounded-context
title: Bounded Context（有界上下文）
label: Bounded Context
subject: ai-agent-workflows
type: concept
status: draft
summary: 每個步驟只拿到它真正需要的資訊，讓上下文維持小而乾淨。
aliases: []
prerequisites: []
related:
  - workflow-scorecard
  - context-budget
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/12-workflows-scorecard.txt#L41-L53]]
created: 2026-11-06
updated: 2026-11-06
---

# Bounded Context（有界上下文）

## 定義

Bounded context 是指系統刻意限制每個 LLM 步驟能看到的資訊範圍：只餵給它完成該步驟絕對必要的內容，不把整段對話或整份文件倒進去。上下文因此是有界的，而不是無限膨脹的。

## 為什麼重要

這是把任務拆成多個 LLM 步驟的主要理由。當每一步只看到相關資訊，模型較不容易被無關內容干擾，輸出更穩定；同時每個 prompt 更短，成本更低，也更容易單獨測試與除錯。

## 如何運作

開發者在每個步驟開始前，明確決定要傳哪些欄位給模型。常見做法包括：只傳上一步的結構化輸出、只檢索與子任務相關的片段、把長歷史摘要成幾個關鍵欄位。關鍵原則是「需要時才給、給剛好夠用」，而不是「先把所有資料塞進去再說」。

有界不代表資訊不足。每一步仍必須拿到完成任務所需的全部資訊；bounded context 要求的是去掉雜訊，不是砍掉必要條件。

## 例子

一個職涯 workflow 在「寫就業前景」這一步，只把選定的職業名稱傳給模型，而不把使用者的完整自傳、前三輪對話與其他子任務的草稿一起塞進去。模型因此專注在勞動市場資訊，輸出也更短更準。

## 邊界與常見誤解

- **有界不是越少越好**：少於任務所需會讓模型瞎猜；界線要畫在「剛好足夠」。
- **不等於 RAG**：RAG 是取得資訊的手段之一，bounded context 是對每個步驟輸入範圍的設計原則。
- **不是只有 workflow 適用**：agent 也需要控制上下文，只是 agent 自己決定要拉進什麼，控制權不同。
- **上下文乾淨比上下文大更能提升可靠度**：更多 token 往往帶來更多干擾。

## 進階

把 bounded context 與 reliability、cost 一起看，就是 [[workflow-scorecard]]。若上下文仍超出視窗，下一個工具是 [[context-budget]] 與壓縮策略。
