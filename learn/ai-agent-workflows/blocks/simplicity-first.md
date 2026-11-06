---
id: simplicity-first
title: Simplicity First（先選最簡單）
label: Simplicity First
subject: ai-agent-workflows
type: principle
status: draft
summary: 從人能掌握箭頭的最簡單拓撲開始，只有單一流程真的不夠時才把控制權交出去。
aliases: []
prerequisites: []
related:
  - control-ownership-spectrum
  - workload-fit
  - supervisor-cost
sources:
  - >-
    [[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L152-L205]]
created: 2026-11-06T00:00:00.000Z
updated: 2026-11-06T00:00:00.000Z
---

# Simplicity First（先選最簡單）

## 主張

設計多代理系統時，先從開發者能掌握箭頭流向、最簡單可用的拓撲開始；只有在單一流程確實無法應付任務複雜度時，才逐步把畫箭頭的權力交給模型。能由人寫死順序或分支的流程，優先於讓模型在 runtime 自行決定下一步的動態架構。

## 為什麼成立

控制權讓渡得越多，系統的自主性越高，但不確定性、成本與除錯難度也同步上升。由人畫箭頭的流程，路徑可預測、可重現、出錯時容易定位；由模型在 runtime 畫箭頭的架構，則必須接受路徑無法事先預測。對多數 production 需求而言，可維護性比「看起來比較智慧」更重要。

此外，多代理模式在 production 很少單獨存在：一個 orchestrator 可能外圍包著 evaluator-optimizer，聚合機制可能嵌在任何拓撲裡，單一 agent 本身又可能是 ReAct、code execution 或 plan-and-execute。架構本來就會層層嵌套，更沒有理由一開始就選最複雜的那一層。

## 適用範圍

- 需求能拆成固定順序或固定分支時。
- 使用者意圖落在少數清楚類別時。
- 團隊需要能追蹤、能重跑、能定位錯誤的系統時。
- 成本敏感、呼叫次數高的產品功能。

## 反例

並非所有任務都能簡化。若工作本身就需要在 runtime 決定下一步，而且無法事先列出固定分支，硬把它塞進固定流程反而做不完；這時才需要往更右邊的拓撲移動。反之，若需求只是少數固定路徑，硬用動態架構只會增加成本。重點不是「永遠選最簡單」，而是「先證明簡單的不夠用，再往上加」。

## 進階

控制權光譜提供判斷位置的地圖，見 [[control-ownership-spectrum]]。工作型態如何影響選擇，見 [[workload-fit]]；多代理的成本代價見 [[supervisor-cost]]。
