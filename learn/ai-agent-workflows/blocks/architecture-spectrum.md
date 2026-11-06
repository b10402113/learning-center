---
id: architecture-spectrum
title: Architecture Spectrum（架構光譜）
label: Architecture Spectrum
subject: ai-agent-workflows
type: concept
status: draft
summary: 從全程式碼控管到多 agent 的連續光譜，選型是挑位置，不是二選一。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/28-wrapping-up.txt#L92-L127]]'
  - >-
    [[sources/ai-agent-workflows/20261105/supplement/ai-agent-workflows-slides.txt#L418-L430]]
created: 2026-11-06
updated: 2026-11-06
---

# Architecture Spectrum（架構光譜）

## 定義

Architecture spectrum 是一條把 AI 系統由簡到繁排列的連續線。左端是開發者完全掌控的 deterministic code，往右依序是加入 LLM 的 workflow、single agent，以及自主性最高的 multi-agent system。光譜上的每個位置都是合法選項，而不是「用 agent」與「不用 agent」的二分法。

## 為什麼重要

把選型當成是非題，很容易一開始就跳到最複雜的架構。光譜的觀點提醒你：先問「哪個最左邊的位置能把事情做好」，再決定要不要往右移動。這直接影響 context、reliability 與 cost。

## 如何運作

越往左，開發者掌握越多控制權，行為越可預測、成本越低；越往右，模型承擔越多決策，能力與彈性增加，但 context 消耗、成本與除錯難度也上升。移動的方式是一次只加一個元件：先加一個 LLM，再看下一個步驟是否真的需要。

## 例子

職涯諮詢系統的核心需求可能只是意圖分類加路線分發。用 dispatcher 就能維持很小的 context 與很低的成本，雖然外觀不如 multi-agent 炫目，卻是剛好切合問題的位置。反過來說，若問題可拆成多個獨立子問題，且每個子問題都需要大量 context，往右移動才有正當理由。

## 邊界與常見誤解

越右不代表越好。更複雜的架構通常更貴、更難除錯，可靠度也不一定上升。另一個誤解是以為光譜只能單向前進；量測後若發現左邊的版本更好，就應該退回去。

## 進階

把光譜當成實驗順序：先做最左邊的版本，量測，再往右一格，再量測。每一步都要有 eval 支撐，而不是靠「聽起來比較先進」決定位置。
