---
id: coordination-failure
title: "Coordination Failure（協調失敗）"
label: "Coordination Failure"
subject: ai-agent-workflows
type: concept
status: draft
summary: "兩個 agent 無法正確溝通或交接，導致任務在傳遞過程中走樣或中斷。"
aliases: []
prerequisites: []
related:
  - peer-to-peer-topology
  - relation-growth
  - handoff-tool
sources:
  - "[[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L137-L208]]"
created: 2026-11-06
updated: 2026-11-06
---

# Coordination Failure（協調失敗）

## 定義

Coordination failure 是指兩個 agent 之間無法順利溝通或正確交接。具體表現包括：交接說明被誤解、任務格式跑掉、把工作交給不適合的同儕，或接手者不知道前一步做了什麼。它不同於單一模型答錯；問題出在「傳遞」這個環節。

## 為什麼重要

在中央化架構裡，協調邏輯集中在一個地方，錯誤面較小。Peer-to-peer 則讓所有 agent 都直接與所有其他 agent 溝通，系統中存在大量交接點；任何一處會錯意，都可能沿著後續交接連鎖放大，可靠度通常低於其他拓撲。

## 如何運作

1. Agent A 決定把對話交給 Agent B，並寫下一段 note。
2. Note 經過共享歷史傳遞，B 讀到的是文字，不是 A 的完整意圖。
3. 若 note 缺少關鍵背景、格式不一致，或 B 誤判自己的角色，B 就會從錯誤前提開始。
4. B 再把（可能已偏差的）結果交給 C，錯誤繼續累積。
5. 最終輸出看起來由最後一個 agent 產生，但根因可能在前段某次交接。

## 例子

職涯 agent 把「比較這三個職涯的市場」交給趨勢 agent；note 只寫了兩個職涯名稱，趨勢 agent 便只分析那兩個。後面教育 agent 依照不完整的清單挑課，最後推薦缺了一個原本很合適的職涯。每一個 agent 都做了自己認為對的事，錯在交接資訊不完整。

## 邊界與常見誤解

- **不是模型能力問題**：即使每個 agent 都很強，交接格式不穩仍會失敗。
- **中央化不是沒有協調成本**：它只是把協調集中在主管，失敗面較小、較容易追蹤。
- **增加 agent 會增加風險**：交接點變多，協調失敗的機率也變高。
- **精確的角色描述只能降低、不能消除風險**：清楚的專長說明有幫助，但無法保證每次交接都正確。

## 進階

這是 [[peer-to-peer-topology]] 的結構性弱點，並隨 [[relation-growth]] 惡化。交接機制的設計見 [[handoff-tool]]。
