---
id: fork-vs-decomposition
title: "Fork vs Decomposition（分岔與拆解）"
label: "Fork vs Decomposition"
subject: ai-agent-workflows
type: contrast
status: draft
summary: "Fork 從固定選單挑一條路走完；decomposition 把任務拆成多個子任務再整合。"
aliases: []
prerequisites: []
related:
  - dispatcher
  - supervisor
  - dynamic-decomposition
sources:
  - "[[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L39-L116]]"
created: 2026-11-06
updated: 2026-11-06
---

# Fork vs Decomposition（分岔與拆解）

## A 是什麼

Fork（分岔）是在入口做一次分類，然後只選一條既有路徑走完。路徑的集合是事先定義好的有限選單，選中後由該路徑的專門 agent 全權處理，入口的分流器不再介入，也不整合結果。Dispatcher 就是 fork 的多代理版本。

## B 是什麼

Decomposition（拆解）是把一個請求拆成多個子任務，分別交給不同 agent 執行，最後把結果收回來整合。子任務可能事先固定，也可能在 runtime 由協調者動態決定；重點是會同時或依序動用多個 agent，並由協調者合成最終答案。

## 關鍵差異

- **動用幾個 agent**：fork 一次只啟動一條 lane；decomposition 會啟動多個子 agent。
- **有沒有人整合**：fork 的結果由被選中的 agent 直接回覆；decomposition 由協調者回收並合成。
- **路徑從哪來**：fork 的路徑是開發者事先列好的固定選單；decomposition 的子任務可能是 runtime 才產生。
- **控制權歸屬**：fork 只把「選哪條」交給模型；decomposition 把「要拆成什麼」也交給模型。
- **失敗成本**：fork 選錯路徑很難在流程內補救；decomposition 可在中途追加或重派子任務。

## 何時用哪個

當使用者意圖落在少數清楚、互斥的類別，而且每類只需要一個專門 agent 時，用 fork（dispatcher）。當任務需要多個角度、多份資料或彼此相依的步驟，而且無法事先固定子任務時，用 decomposition（supervisor）。

如果需求其實是「同一件事要跑很多次再投票」，那既不是 fork 也不是 decomposition，而是平行化。

## 進階

Fork 的實作與成本優勢，見 [[dispatcher]]。Decomposition 的動態版本，見 [[dynamic-decomposition]]，角色安排見 [[supervisor]]。
