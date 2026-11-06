---
id: peer-to-peer-topology
title: Peer-to-Peer（點對點）
label: Peer-to-Peer
subject: ai-agent-workflows
type: concept
status: draft
summary: 所有 agent 平起平坐、沒有中央協調者，任何 agent 都能直接把對話交給任何同儕。
aliases: []
prerequisites: []
related: []
sources:
  - '[[sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt#L1-L38]]'
created: 2026-11-06
updated: 2026-11-06
---

# Peer-to-Peer（點對點）

## 定義

Peer-to-peer（也稱 any-to-any network、mesh、decentralized）是一種沒有中央協調者的多代理拓撲。所有 agent 地位平等，彼此可以直接對話、傳遞資訊與控制權；任何 agent 都能在任何時候把工作交給任何其他 agent，直到滿足停止條件。

## 為什麼重要

有些問題沒有自然的階層關係，而且開始前無法預測該怎麼拆。固定 workflow 需要確定性的程式碼安排下一步；supervisor 需要一個中央主管；peer-to-peer 則把「下一步找誰」完全交給 agent 自己判斷，理論上最能應付開放式協作。

## 如何運作

1. 每個 agent 都有自己的角色、工具與 system prompt。
2. 每個 agent 也都知道其他所有同儕的存在與專長。
3. 目前持有控制權的 agent 讀取共享對話，決定要自己回覆、使用工具，或把對話交給某個同儕。
4. 收到交接的 agent 成為新的 active agent，繼續處理。
5. 當某個 agent 認為資訊足夠時，它直接寫出最終答案；沒有協調者需要批准。

程式碼只負責記住「現在輪到誰」，以及執行該 agent 的下一步；它不決定下一個是誰。

## 例子

一個職涯系統有職涯顧問、教育培訓、資金補助與就業趨勢四個 agent。職涯顧問先分析方向，把對話交給趨勢 agent 評估市場；趨勢 agent 再轉給教育 agent 挑課；最後資金 agent 補上補助方案。任何一個 agent 都可以隨時把對話交回先前的角色。

## 邊界與常見誤解

- **不是比較靈活的 supervisor**：這裡沒有主管，沒有中央彙整，也沒有任何人負責全局。
- **最難除錯**：控制權完全交出，執行前無法預測路徑；出錯時很難定位是哪一段交接造成。
- **成本高且不穩定**：多個 agent 來回拋接，共享歷史越來越長，輪數與 token 都快速累積。
- **適合的場景很窄**：沒有自然階層、拆解未知時才可能考慮；多數 production 情境應先試其他架構。

## 進階

Agent 之間怎麼交接，見 Handoff Tool；它們共享什麼，見 Shared History。這個拓撲的兩個主要代價，見 Relation Growth 與 Coordination Failure。
