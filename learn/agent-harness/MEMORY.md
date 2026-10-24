---
subject: agent-harness
language: zh-Hant
created: 2026-10-22
updated: 2026-10-24
---

# MEMORY — agent-harness

## Goal

能自己寫出一個最小但可運作的 harness 骨架：agent 迴圈、durable 重啟、工具執行邊界、context 壓縮，並能用它解釋為什麼 demo 可以、production 會死。

不是背名詞，是能指著程式碼說出「這一行斷掉之後，狀態去哪裡了」。

## Why

想做出自己的 agent，尤其是會在背景長時間工作、可以被暫停與喚回的那種（goal → run → pause → wake → return）。

做出來之後才發現：卡住的不是 prompt，是「關掉之後還活著嗎」、「重試會不會重複扣款」、「對話變長之後模型變笨」。harness 就是這些問題的答案。

## Prior experience

- 會寫 TypeScript 與 Node.js，能讀懂 Express 與 React。
- 沒做過 agent runtime，沒碰過 durable execution、workflow engine、sandbox。
- 分散式概念（checkpoint、replay、idempotent、at-least-once）屬於初學，需要對照日常經驗建立。

## Anchors

- 一般的 web 請求／回應：程式重啟，記憶體裡的東西就沒了 —— 對照 naive agent loop 的 messages。
- 會寄信或發通知的 side project：重試一次就是多寄一封，這是 idempotency 的實際痛點。
- 用過 Claude Code 或類似工具，但沒想過它外面那層是誰寫的。
- 背景 agent 的生命週期（goal / run / pause / wake / return）：暫停之後還要能接回來，這正是 durable workflow 存在的理由。

## Habits & constraints

- 語言：台灣繁體中文，技術名詞保留英文（harness、step、workflow、checkpoint 不硬翻）。
- 學習節奏：一次一小段，能跑起來比讀完更重要。
- 環境：本機 Node.js／TypeScript 專案，可以裝套件、連免費 Postgres。

## Knowledge type

mixed，偏 procedural。概念（為什麼需要 harness）只是為了鋪路，真正的學習發生在「動手弄壞它、再補機制」的過程。

## How to teach me

- 先看失敗長什麼樣子，再學對應的機制；不要先背定義。
- 每一段都要有一個「你現在去跑會看到什麼」的具體指令或程式碼。
- 抽象名詞要立刻綁到一個檔案、一個函式或一次錯誤訊息。
- 不喜歡：名詞堆疊、沒有前因後果的機制清單、被要求先學完理論再動手。
