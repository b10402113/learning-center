---
id: working-memory
title: "Working Memory（工作記憶）"
label: "Working Memory"
subject: ai-agent-workflows
type: concept
status: draft
summary: "agent 每輪維護的即時狀態，包含目標、已嘗試步驟、工具結果與推理筆記。"
aliases: []
prerequisites: []
related:
  - context-budget
  - semantic-memory
  - memory-retrieval
sources:
  - "[[sources/ai-agent-workflows/20261105/course/6-agent-memory.txt#L1-L63]]"
created: 2026-11-06
updated: 2026-11-06
---

# Working Memory（工作記憶）

## 定義

Working memory（工作記憶）是 agent 程式碼在執行過程中持續維護的即時狀態（running state）。它包含使用者最初設定的目標、agent 到目前為止嘗試過哪些步驟、呼叫工具後回傳的結果，以及使用推理型模型時留下的內部思考筆記。

## 為什麼重要

LLM 本身是無狀態的：每次呼叫都只讀當下的 context，回覆完就忘掉一切。如果 agent 看起來記得對話，那是因為程式碼把歷史重新送進 prompt。工作記憶就是這份「該送什麼」的來源。沒有它，agent 無法跨回合追蹤目標、累積進度或記得剛才工具做了什麼。

## 如何運作

在每一次呼叫模型之前，agent 從工作記憶狀態重新拼裝出一份乾淨的 context；模型回覆後，再把新的輸出存回狀態，供下一次呼叫使用。因此 context 只是窺探工作記憶的一扇暫時性視窗，每一輪都會重新建立。設計 agent 的一大部分工作，就是決定哪些內容該進到這份狀態：摘要舊對話、丟掉不再相關的工具輸出、讓使用者的目標始終清楚可見。

## 例子

一個客服 agent 的工作記憶可能包含：客人要退款、已查過訂單狀態、退款工具回傳「尚未入帳」，以及一則推理筆記「需要確認承諾的天數」。下一輪模型不需要重讀整段對話，就能從這份狀態接續處理。

## 邊界與常見誤解

- **context 不是工作記憶**：context 是每一輪臨時組出來的字串，工作記憶是背後持續存在的狀態。
- **轉傳聊天紀錄不等於完整工作記憶**：agent 還要追蹤目標、工具結果與自己的推理。
- **工作記憶不是愈大愈好**：它受 context window 限制，塞滿會增加時間與金錢成本。
- **它不是長期記憶**：互動結束、context 清空後仍要保留的內容，才屬於長期記憶。

## 進階

工作記憶的大小直接受 [[context-budget]] 約束。跨 session 要保留的事實屬於 [[semantic-memory]]，要取回的經歷屬於 [[episodic-memory]]；把這些長期記憶帶回來的方法見 [[memory-retrieval]]。
