---
id: tool-calling
title: "Tool Calling（工具呼叫）"
label: "Tool Calling"
subject: ai-agent-workflows
type: procedure
status: draft
summary: "模型輸出工具呼叫，harness 執行後把結果當 observation 餵回模型。"
aliases: []
prerequisites: []
related: []
sources:
  - "[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L199-L296]]"
created: 2026-11-06
updated: 2026-11-06
---

# Tool Calling（工具呼叫）

## 問題

語言模型本身只產生文字，不能查資料、寄信或改檔案。若沒有機制讓模型要求外部動作，它就只能憑訓練資料回答，遇到即時資訊或副作用就束手無策。

## 前置條件

需要一個包住模型的 harness，以及一份模型看得懂的工具定義。工具至少要有名稱、描述與參數 schema；harness 則負責把工具清單放進 context、解析模型輸出、執行函式，並把結果送回去。

## 步驟

1. harness 把工具名稱、描述與參數 schema 放進模型的 context。
2. 模型判斷需要外部動作時，輸出一段代表工具呼叫的文字，通常包含函式名稱與參數。
3. harness 解析這段輸出，找到對應的工具並執行。
4. 執行結果先回到 harness，再由 harness 以 observation 的形式餵回模型。
5. 模型讀到 observation 後繼續推理，可能再呼叫工具，直到產生最終回答或停止。

## 例子

客服 agent 要查某位學生的獎學金狀態時，模型輸出呼叫 `lookupScholarship` 的參數 `{ studentId: "s-42" }`。harness 執行查詢，把回傳的 JSON 當成 observation 送回模型；模型再根據結果決定要回覆什麼。

## 失敗模式

- 工具名稱或描述太模糊，模型選錯工具或完全不呼叫。
- 參數 schema 沒有約束，工具收到不能用的資料。
- harness 忘記把執行結果餵回模型，模型只能停在半途。
- 模型輸出的呼叫格式不穩定，parser 抓不到。
- 具備副作用的工具沒有 guardrail 或 approval，模型可能為了完成目標直接執行。

## 進階

工具呼叫的可靠度要靠 eval 衡量：工具選對率、參數正確率與完成率各是多少。把不可逆工具加上 approval 或 idempotency key，則是讓工具呼叫能上 production 的另一半。
