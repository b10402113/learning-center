---
id: prompted-tool-use
title: "Prompted Tool Use（提示式工具使用）"
label: "Prompted Tool Use"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用 system prompt 約定輸出格式，讓未受工具訓練的模型也能呼叫工具。"
aliases: []
prerequisites: []
related:
  - tool-calling
  - tool-training-reliability
sources:
  - "[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L246-L279]]"
created: 2026-11-06
updated: 2026-11-06
---

# Prompted Tool Use（提示式工具使用）

## 定義

Prompted tool use 是不依賴模型內建工具呼叫能力，改用 system prompt 約定一種輸出格式（例如大寫 `TOOL` 加上函式名稱與參數），再由 harness 解析並執行的方法。

## 為什麼重要

多 agent 系統為了控制成本，經常選用小型模型，而這些模型往往沒有受過工具呼叫的微調。Prompted tool use 只要多寫幾行提示詞，就能讓它們也使用工具，不必換成昂貴的大模型。

## 如何運作

在 system prompt 中明確規定：當你想呼叫工具時，請印出指定格式，例如大寫 `TOOL`、函式名稱與參數。harness 用簡單的正則表達式抓出名稱與參數，執行對應函式，再把輸出餵回模型。整體流程和高階模型相同。

## 例子

小模型輸出 `TOOL get_weather(city="Chicago")`，harness 用 regex 解析後執行查詢，再把天氣結果送回模型。

## 邊界與常見誤解

它讓模型能用工具，但不保證穩定。未受訓模型更容易看懂情境、選錯工具或格式跑掉，因此需要更多防呆提示與解析容錯。

## 進階

當可靠度或成本更關鍵時，可改用受過工具訓練的模型；prompted tool use 則是低成本、跨模型的通用替代方案。
