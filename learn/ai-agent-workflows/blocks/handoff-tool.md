---
id: handoff-tool
title: "Handoff Tool（交接工具）"
label: "Handoff Tool"
subject: ai-agent-workflows
type: concept
status: draft
summary: "把控制權轉給同儕的工具；呼叫它不會回傳資料，而是讓對方成為下一個執行者。"
aliases: []
prerequisites: []
related:
  - peer-to-peer-topology
  - shared-conversation-history
  - tool-calling
sources:
  - "[[sources/ai-agent-workflows/20261105/supplement/practical-ai-agents-code-exercise-main/multi-agent-systems/careerPeerToPeerMultiAgent.js#L1-L166]]"
created: 2026-11-06
updated: 2026-11-06
---

# Handoff Tool（交接工具）

## 定義

Handoff tool 是一種特殊的工具，執行時不是回傳計算結果，而是把對話的控制權移交給另一個 agent。它通常命名為 `transfer_to_<peer>`，並附帶一段簡短說明，告訴對方接手後要做什麼。

## 為什麼重要

它讓「換手」變成 agent 的一般動作，不需要另一套協調 API。每個 agent 只要把自己的工具清單加上同儕的交接工具，就能在需要時把工作交出去；程式碼也不必判斷誰該接棒，只要跟著 agent 的選擇走。

## 如何運作

1. 建立所有 peer agent。
2. 對每個 agent，為其他每一位同儕註冊一個 `transfer_to_<name>` 工具。
3. 工具的 description 寫清楚對方專長，以及交接時要附上什麼資訊。
4. Agent 輸出 `Action: transfer_to_job_market_analyst` 與一段 note。
5. 系統把 note 寫進共享歷史，並把 active agent 換成被指定的同儕。

## 例子

Career Matcher 找到幾個候選職涯後，判斷就業市場不是自己的專長，於是呼叫 `transfer_to_job_market_analyst`，note 寫著「請比較這三個職涯的就業前景」。Job Market Analyst 接手後看到的不是一筆資料回傳，而是整段共享對話加上這則交接說明。

## 邊界與常見誤解

- **交接不同於委派**：委派會等對方回傳結果；交接是把控制權整段讓出去，原 agent 不一定會再拿回來。
- **交接可以回頭**：同儕可以把對話交回給已經執行過的角色，所以流程可能繞回。
- **描述就是路由依據**：description 寫得含糊，agent 就會把工作交給不適合的對象。
- **不是免費移動**：每次交接都帶著共享歷史，context 與成本會累積。

## 進階

這個工具是 [[peer-to-peer-topology]] 的核心機制。交接後對方看到的內容，取決於 [[shared-conversation-history]]；底層仍是 [[tool-calling]] 的形式。
