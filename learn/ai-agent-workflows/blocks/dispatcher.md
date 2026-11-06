---
id: dispatcher
title: "Dispatcher（分流器）"
label: "Dispatcher"
subject: ai-agent-workflows
type: concept
status: draft
summary: "先分類一次，從固定路徑選單挑一條，交給唯一一個專門 agent 處理後就退場。"
aliases: []
prerequisites: []
related:
  - route-menu
  - bad-route-recovery
  - clarification-lane
sources:
  - "[[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L1-L38]]"
created: 2026-11-06
updated: 2026-11-06
---

# Dispatcher（分流器）

## 定義

Dispatcher（也稱 routing、triage、classifier、router）是一種多代理拓撲：入口先做一次分類，判斷使用者輸入屬於哪一類，然後把整個請求轉交給一個對應的專門 agent。選定之後，dispatcher 不再參與，也不會回收結果；被選中的 agent 自行完成工作並直接回覆使用者。

## 為什麼重要

很多應用的使用者意圖本來就有限而清楚。這種情況下，用最強的模型在 runtime 規劃步驟既慢又貴；只要把分類做好，就能把簡單請求送給小模型、把難的工作留給大模型，成本通常比其他多代理模式低。

## 如何運作

1. 分類步驟讀取使用者輸入，判斷它落在哪一個既有類別。
2. 從固定的路徑選單中選出唯一一條 lane。
3. 把使用者的原始請求（或一段交接說明）交給該 lane 的專門 agent。
4. 專門 agent 用自己的 ReAct 迴圈與工具完成任務，直接產生最終回覆。
5. 這一輪互動結束，等待下一次輸入。

它不是任務分解：dispatcher 不會先做計畫、不會連續呼叫多個 agent，也不會把多個結果合成一份答案。

## 例子

職涯諮詢系統有三條 lane：職涯探索、培訓課程、資金補助。使用者問「我想找生物相關的工作」，分類器選中職涯探索，交給職涯 agent；問「有哪些線上課程」就轉給培訓 agent。只有被選中的那一個會啟動。

## 邊界與常見誤解

- **可靠性綁在分類器上**：分類一旦選錯，後面再強的 agent 也只能在自己的角色裡作答，很難自行發現走錯路。
- **不是 supervisor**：supervisor 會拆解、會呼叫多個 agent、會整合結果；dispatcher 只分流一次。
- **選單必須有限且可分**：類別重疊或數量爆炸時，分類準確度會下降。
- **分類模型可以很便宜**：現在有專門的分類模型，能把每次判斷從數美元壓到幾分錢。

## 進階

路徑選單怎麼設計，見 [[route-menu]]。分類錯誤後的補救，見 [[bad-route-recovery]]；其中最常用的一招是 [[clarification-lane]]。
