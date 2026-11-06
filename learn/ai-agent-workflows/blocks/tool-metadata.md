---
id: tool-metadata
title: Tool Metadata（工具詮釋資料）
label: Tool Metadata
subject: ai-agent-workflows
type: concept
status: draft
summary: Tool metadata 是模型唯一看得到的工具資訊，包含名稱、描述與參數結構。
aliases: []
prerequisites: []
related:
  - tool
sources:
  - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L109-L112]]'
  - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L131-L154]]'
created: 2026-11-06
updated: 2026-11-06
---

# Tool Metadata（工具詮釋資料）

## 定義

Tool metadata 是一個工具給模型看的說明，包含名稱（name）、功能描述（description）與參數結構（schema）。它和實際執行的函式本體是分開的：模型只讀 metadata，程式只跑函式。

## 為什麼重要

模型看不到你寫的程式碼，決定「要不要呼叫這個工具」與「要傳什麼參數」的唯一依據就是 metadata。工具出錯大多不是程式寫壞，而是文字描述不夠清楚。

## 如何運作

harness 把每個工具的 metadata 放進模型的 context。模型根據名稱與描述判斷是否相關，再依參數 schema 產生呼叫字串。函式本體則留給 harness 執行。

## 例子

一個查天氣的工具若參數只寫 `city`，模型就得猜是郵遞區號、城市名加州名，還是單純城市字串。只要猜錯，呼叫就中斷，而問題往往出在 metadata 而非模型能力。

## 邊界與常見誤解

metadata 不是寫給人看的註解，而是給 token 預測器的線索。如果你自己讀都覺得模糊，模型會更難判斷。名稱清楚、描述精確、附上範例，比堆疊功能更能提升成功率。

## 進階

把 metadata 當成產品介面來設計，並用工具選對率與參數正確率驗證；多個工具時，還要確保彼此的職責與描述能互相區隔。
