---
id: tool-overload
title: "Tool Overload（工具過載）"
label: "Tool Overload"
subject: ai-agent-workflows
type: concept
status: draft
summary: "工具過載是把過多或重疊的工具塞給同一 agent，讓模型難以選擇並拖垮 context。"
aliases: []
prerequisites: []
related:
  - tool-metadata
sources:
  - "[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L317-L330]]"
created: 2026-11-06
updated: 2026-11-06
---

# Tool Overload（工具過載）

## 定義

Tool overload 是指提供給 agent 的工具在數量或功能上超過它能有效分辨的程度，導致模型選錯工具、重複嘗試，或因為 context 被吃光而表現下降。

## 為什麼重要

每一個工具的 metadata 都會一直留在 context 裡。工具一開始流行時，常見團隊一次做幾十個工具塞給同一個 agent，結果功能互相重疊，模型根本分不清何時該用哪一個，錯誤率反而升高。

## 如何運作

工具越多，context 中常駐的說明越長，模型能分給任務的空間越少；工具越重疊，模型越難從描述中找出差異。兩件事疊加，就讓選擇與參數填寫都變得不穩定。

## 例子

一個客服 agent 同時掛上 50 個查詢與寫入工具，其中好幾個都能取得訂單資訊。模型常在相近工具間猶豫，或選到副作用更大的那一個。

## 邊界與常見誤解

工具過載不代表工具越少越好，也不是把功能硬塞進同一個工具。重點是職責分明、說明具體，讓每個工具的存在都有清楚理由。

## 進階

用分層工具、依任務挑選子集、或把部分能力拆給專門的子 agent，都能降低單一 context 的工具負擔。
