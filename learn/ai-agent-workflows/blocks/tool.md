---
id: tool
title: Tool（工具）
label: Tool
subject: ai-agent-workflows
type: concept
status: draft
summary: Tool 是 harness 接給模型的外部能力，讓只能處理文字的 LLM 能讀取並改變環境。
aliases: []
prerequisites: []
related:
  - agent-loop
sources:
  - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L59-L64]]'
created: 2026-11-06
updated: 2026-11-06
---

# Tool（工具）

## 定義

Tool 是一個由外部程式（harness）提供給模型的函式，帶有名稱、描述與參數結構。模型本身看不到函式內容，只能輸出「要呼叫哪個工具、傳什麼參數」，真正執行的是模型外面的程式碼。

## 為什麼重要

大型語言模型只能輸入與輸出文字，知識又被預訓練截止日期鎖住。工具讓 agent 能呼叫外部資訊、發送 API 請求、執行程式碼，甚至呼叫其他模型，等於把文字生成器變成能與環境互動的行動者。

## 如何運作

harness 先把工具定義放進模型的 context。模型判斷需要外部動作時，輸出一段代表呼叫的字串；harness 解析後執行對應函式，再把結果以 observation 的形式餵回模型。模型讀到結果，才繼續推理或給出答案。

## 例子

一個呼叫外部 API 抓取某位使用者近期 Slack 訊息的函式，只要加上名稱與參數說明，就是一個工具。其他常見例子包括網路搜尋、查天氣，以及讓 agent 操作圖形介面的 computer use。

## 邊界與常見誤解

模型不會自己執行程式，也不看得到函式本體；工具也不是模型內建的能力。工具可分成唯讀與讀寫，後者有副作用。工具數量與說明品質往往比功能多寡更決定成敗。

## 進階

把不可逆的工具加上 guardrail、approval 或 idempotency key，並用工具選對率、參數正確率與完成率來評估，才適合放進正式環境。
