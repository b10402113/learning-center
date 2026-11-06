---
id: debugging-trajectory
title: "Debugging Trajectory（除錯軌跡）"
label: "Debugging Trajectory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "多代理除錯要沿著每個 agent 的執行軌跡往回追，因根因常在前幾步而非最後出錯處。"
aliases: []
prerequisites: []
related:
  - peer-to-peer-topology
  - relation-growth
  - verification-gap
sources:
  - "[[sources/ai-agent-workflows/20261105/course/26-multi-agent-systems-summary.txt#L88-L105]]"
created: 2026-11-06
updated: 2026-11-06
---

# Debugging Trajectory（除錯軌跡）

## 定義

Trajectory 是一個 agent 從開始到結束的完整執行軌跡：它想過什麼、呼叫了哪些工具、得到什麼觀察、最後怎麼產出答案。Debugging trajectory 就是沿著這條軌跡找出錯誤是從哪一步開始的。在多代理系統裡，每個 agent 都有自己的軌跡，除錯必須把多條軌跡接起來看。

## 為什麼重要

多代理的錯誤很少停在表面出錯的那個 agent。當最終輸出明顯不對，真正的根因往往在一兩步之前：某個 agent 的搜尋被帶偏、某段輸出夾帶了微小錯誤，後面的 agent 再把這個錯誤當前提繼續推論。只看最後一個 agent，會修錯地方。

## 如何運作

1. 從最終輸出往回找，定位第一個明顯偏離預期的 agent。
2. 檢視該 agent 收到的輸入，而不是只看它產出的輸出。
3. 沿著交接鏈再往前追，確認錯誤是它自己產生的，還是前一手帶進來的。
4. 在每一步比對工具結果與推理，找出偏離的起點。
5. 修正起點後，重跑整條鏈，確認錯誤不再往下傳。

若系統沒有中央協調者，還得先重建「誰在什麼時候把對話交給了誰」，追蹤成本會更高。

## 例子

職涯系統最後推薦了一個不合適的職涯。表面看是規劃 agent 寫錯，但往回追發現：市場分析 agent 只拿到兩個職涯名稱，漏了最合適的那一個；再往前，是職涯 agent 的交接 note 寫得不完整。真正要修的是交接內容，不是最後一段文字。

## 邊界與常見誤解

- **不是看 log 就好**：log 只記錄事件，還要理解每個 agent 當時的推理前提。
- **不是最後出錯的 agent 最可疑**：它通常只是第一個「明顯」錯的地方。
- **增加 agent 會讓軌跡更難接**：每多一層交接，就多一條要對齊的軌跡。
- **沒有共享歷史時更難**：若 agent 之間不共享對話，得靠額外追蹤機制重建路徑。

## 進階

在 [[peer-to-peer-topology]] 中，路徑由 agent 自行決定，軌跡最難預測。Agent 數量增加會讓追蹤更複雜，見 [[relation-growth]]；缺乏查核則讓錯誤更容易一路傳下去，見 [[verification-gap]]。
