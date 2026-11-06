---
id: agent-harness
title: "Agent Harness（代理外殼）"
label: "Agent Harness"
subject: ai-agent-workflows
type: concept
status: draft
summary: "Harness 是包住 LLM、負責執行工具並把結果餵回模型的程式碼，是 agent 真正動手的地方。"
aliases: []
prerequisites: []
related:
  - tool
  - agent-loop
sources:
  - "[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L200-L217]]"
created: 2026-11-06
updated: 2026-11-06
---

# Agent Harness（代理外殼）

## 定義

Agent harness 是包在語言模型外面的程式碼層。它負責把工具清單放進 context、解析模型的輸出、執行對應的函式，並把執行結果送回模型。模型只產生字串，harness 才是真正呼叫工具的角色。

## 為什麼重要

看到 agent 自動查資料、串接資料庫時，很容易誤以為是 LLM 自己伸出手去執行。實際上 LLM 完全不會執行工具，一切都是 harness 在背景跑腿。理解這件事，才知道 agent 的可靠度與錯誤該往哪裡修。

## 如何運作

harness 先組好工具定義並放進對話；模型輸出函式名稱與參數後，harness 解析這段字串、在伺服器上執行函式；函式的回傳值先回到 harness，再由 harness 包成 observation 餵回模型。模型收到新訊息，才能繼續下一步。

## 例子

模型輸出 `get_weather` 與括號內的參數，harness 讀懂後執行查詢，再把天氣資料包成 observation 送回模型，模型才回答使用者。

## 邊界與常見誤解

harness 可以是自己寫的，也可以由 Copilot 或 Claude 協助產生；它不是模型的一部分。最常見的失誤是 harness 忘記把工具結果餵回模型，讓 agent 停在半途。

## 進階

harness 也是放 guardrail、停止條件與審計紀錄的位置。把 harness 設計好，往往比換更大的模型更能提升 agent 穩定度。
