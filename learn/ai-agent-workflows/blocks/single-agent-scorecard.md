---
id: single-agent-scorecard
title: Single-Agent Scorecard（單一 Agent 計分卡）
label: Single-Agent Scorecard
subject: ai-agent-workflows
type: concept
status: draft
summary: 用 context、reliability、cost、adaptability 四欄比較單一 agent 與 workflow 的代價與回報。
aliases: []
prerequisites: []
related:
  - workflow-scorecard
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/18-single-agent-systems-scorecard.txt#L1-L7]]
created: 2026-11-06
updated: 2026-11-06
---

# Single-Agent Scorecard（單一 Agent 計分卡）

## 定義

單一 agent 計分卡是一個比較框架，用四個維度檢視把固定 workflow 換成單一 agent 之後的變化：情境背景（context）、可靠度（reliability）、成本（cost）與適應力（adaptability）。它強迫團隊把「換架構」當成一筆交易，而不是一種信仰。

## 為什麼重要

Agent 不是免費升級。若只看到它能處理複雜任務，卻沒有把變差的地方攤開，就容易在高風險場景做出錯誤選擇。計分卡讓代價與回報同時可見，也讓「什麼時候該換、什麼時候不該換」有共同語言。

## 如何運作

逐欄比較同一任務在兩種架構下的表現：

1. **Context**：單一 agent 把所有資訊塞進同一個視窗，負擔變重，關鍵資訊容易遺失。
2. **Reliability**：agent 自行決定步數，無法事先知道會走幾步，也難以在步驟間放閘門。
3. **Cost**：迴圈反覆思考與呼叫工具，比固定 workflow 貴，但仍低於多 agent。
4. **Adaptability**：agent 能動態處理未窮舉的情境，這是換架構換到的主要回報。

## 例子

升學與職涯顧問系統從固定流程換成單一 agent：context、reliability、cost 三欄都變差，但 adaptability 讓系統能處理各種興趣、州別與獎學金條件的組合，而這些組合原本不可能逐一寫死。

## 邊界與常見誤解

- **四欄不是全部**：延遲、安全、可觀測性也可能決定成敗，只是未被放進這張表。
- **分數隨任務改變**：在簡單、高重複的任務上，agent 的 adaptability 可能完全用不到。
- **不是「agent 一定比較好」**：若情境固定、錯誤代價高，workflow 往往仍是正確答案。
- **不是一次性的評估**：任務規模或工具改變後，計分卡應該重算。

## 進階

計分卡的價值在於逼你承認取捨。若最後發現只有 adaptability 變好、其他三欄都明顯惡化，就該問「這個適應力是否真的決定功能能不能做出來」。把這張表與 [[workflow-scorecard]] 並排看，會更容易選出最簡單可用的架構。
