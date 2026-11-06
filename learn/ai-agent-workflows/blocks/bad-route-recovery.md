---
id: bad-route-recovery
title: "Bad Route Recovery（錯誤路由恢復）"
label: "Bad Route Recovery"
subject: ai-agent-workflows
type: concept
status: draft
summary: "分類器選錯 lane 後，用檢查代理或澄清路徑把請求拉回正軌的補救機制。"
aliases: []
prerequisites: []
related:
  - dispatcher
  - clarification-lane
  - route-menu
sources:
  - "[[sources/ai-agent-workflows/20261105/course/23-dispatcher.txt#L117-L157]]"
created: 2026-11-06
updated: 2026-11-06
---

# Bad Route Recovery（錯誤路由恢復）

## 定義

Bad route recovery 是指 dispatcher 把請求送進錯誤 lane 之後，系統用來發現並修正這個錯誤的機制。因為 dispatcher 選完就退場，被選中的專門 agent 通常只會用自己的有限工具作答，不會自動知道「我其實不該處理這個請求」。

## 為什麼重要

Dispatcher 的可靠性幾乎完全取決於入口分類器。分類錯誤不是罕見例外，而是這個模式的結構性弱點：一旦走錯，系統很難靠自己回到正確路徑，使用者拿到的會是牛頭不對馬嘴的答案。

## 如何運作

常見做法有兩種：

1. **配置檢查代理（checker agent）**：在專門路徑執行時，安排另一個輔助機制檢查目前 agent 是否陷入困境、是否偏離使用者需求。發現不對就回報或重導。
2. **在選單加入澄清路徑**：給分類器一個明確的「我不確定」選項。當輸入模糊、難以抉擇時，不要硬猜，而是轉到澄清 agent，先向使用者補問關鍵資訊，再重新分類。

另外，程式碼層的防呆也很重要：若模型輸出的 lane 名稱不在選單上，就落到預設 agent，而不是讓系統崩潰。

## 例子

使用者想問學費補助，分類器卻把他送進職涯規劃 agent。職涯 agent 只會根據自己的角色談適配度，答不出補助方案。若系統有 checker，可能在發現答案與問題型態不符時介入；若有澄清 lane，分類器原本就可以選擇「先問清楚」而不是勉強猜。

## 邊界與常見誤解

- **恢復機制不是免費**：多一個檢查 agent 就多一次模型呼叫與延遲。
- **澄清不是萬能**：若使用者自己也說不清楚，補問可能來回多輪。
- **防呆只擋格式錯誤**：名稱比對能擋「選了不存在的 lane」，擋不了「選了一個存在但不適合的 lane」。
- **最好的恢復是減少錯誤**：把選單設計好、描述寫清楚，通常比事後補救更有效。

## 進階

澄清路徑的設計見 [[clarification-lane]]；選單本身的邊界見 [[route-menu]]；dispatcher 的整體取捨見 [[dispatcher]]。
