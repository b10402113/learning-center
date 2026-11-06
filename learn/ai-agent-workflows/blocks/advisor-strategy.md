---
id: advisor-strategy
title: "Advisor Strategy（顧問策略）"
label: "Advisor Strategy"
subject: ai-agent-workflows
type: concept
status: draft
summary: "小模型先執行，只有自認撐不住時才向上呼叫大模型支援，以降低成本。"
aliases: []
prerequisites: []
related:
  - dispatcher
  - supervisor-cost
  - workload-fit
sources:
  - "[[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L158-L256]]"
created: 2026-11-06
updated: 2026-11-06
---

# Advisor Strategy（顧問策略）

## 定義

Advisor strategy 是一種成本導向的模型配置：讓較輕量的模型（例如 Haiku 或 Sonnet）站在第一線負責執行任務、呼叫工具；只有當它判斷自己無法勝任時，才向上呼叫更強的旗艦模型（例如 Opus）協助推進。控制權反過來，由便宜模型決定何時需要顧問。

## 為什麼重要

傳統做法是把最聰明、最貴的模型放在系統頂層，負責統籌與分派。Advisor strategy 質疑這個預設：如果多數請求其實不難，讓大模型在每一次呼叫都坐鎮，等於為簡單工作付旗艦價。把升級變成例外，可以大幅壓低平均成本。

## 如何運作

1. 第一線模型接收請求，照常推理與使用工具。
2. 它評估自己是否卡住、是否超出能力。
3. 若判斷需要協助，呼叫旗艦模型，把目前狀態與問題傳過去。
4. 旗艦模型提供方向或補救，第一線模型繼續完成。
5. 若不需要協助，整個流程完全不碰旗艦模型。

## 例子

Anthropic 在 2025 年分享的做法是：Haiku 或 Sonnet 負責跑任務與工具，遇到自己處理不了的情況才呼叫 Opus。他們回報這讓成本維持在較低水準，整體表現也不錯。

## 邊界與常見誤解

- **小模型不一定知道自己不行**：這是此策略最脆弱的假設。Cognition 嘗試類似架構時發現，小模型很難判斷何時該升級，升級時也常說不清楚自己需要什麼。
- **不是免費的降級**：若升級判斷失準，可能反覆呼叫大模型，成本優勢消失。
- **不是每個任務都適用**：需要長時間保持全局推理的任務，可能一開始就該用大模型。
- **與 dispatcher 不同**：dispatcher 是在入口依難度分流；advisor strategy 是在執行途中由第一線模型決定是否求援。

## 進階

分流式的成本控制見 [[dispatcher]]；多代理整體的 token 倍數見 [[supervisor-cost]]。是否值得採用，仍取決於工作型態，見 [[workload-fit]]。
