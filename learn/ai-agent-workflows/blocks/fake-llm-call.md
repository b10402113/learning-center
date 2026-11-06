---
id: fake-llm-call
title: "Fake LLM Call（假模型呼叫）"
label: "Fake LLM Call"
subject: ai-agent-workflows
type: procedure
status: draft
summary: "先用回傳固定內容的假呼叫跑通流程，再逐點換成真實 API。"
aliases: []
prerequisites: []
related:
  - prompt-chaining
  - code-gate
sources:
  - "[[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L13-L40]]"
created: 2026-11-06
updated: 2026-11-06
---

# Fake LLM Call（假模型呼叫）

## 問題

開發 LLM 工作流時，模型的輸出每次都不一樣。如果一開始就接上真實 API，出錯時很難分清是程式邏輯寫錯，還是模型這次發揮失常。除錯成本因此變得很高。

## 前置條件

先確定每個步驟的介面：它收到什麼輸入、要回傳什麼形狀的輸出，以及用哪一段 system prompt。介面定了，假呼叫才有東西可以模仿。

## 步驟

1. **寫一個統一的呼叫函式**：所有步驟都透過同一個 `callLLM(systemPrompt, userMessage)` 與模型互動。
2. **讓它回傳固定內容**：暫時不連網，直接回傳預先寫好的字串或 JSON。
3. **用步驟區分回應**：以 system prompt 或步驟名稱當 key，查表回傳對應的假輸出。
4. **標記替換點**：在程式碼裡用註解寫清楚真實 API 呼叫要放在哪裡、需要哪些環境變數。
5. **先跑通整條流程**：確認順序、資料傳遞與 gate 都正確，再把假呼叫逐一換成真呼叫。

<!-- derived -->

```text
async function callLLM(systemPrompt, userMessage) {
  // REPLACE: real API call goes here
  return fakeResponses[systemPrompt];
}
```

## 例子

職涯鏈的兩步共用一個 `callLLM`。當傳入的是「挑職業」的 prompt，它回傳一段固定 JSON；當傳入的是「排培訓路徑」的 prompt，它回傳四行固定的學習路徑。整支程式不需要金鑰、不需要網路，也能示範資料如何從第一步流到第二步，以及 gate 如何在空輸入時攔下請求。

## 失敗模式

- **假輸出太理想**：永遠回傳乾淨 JSON，掩蓋了真實模型會包 Markdown 的問題，gate 因此從未被測到。
- **忘記標記替換點**：專案上線前漏掉某個假呼叫，系統永遠回傳同一份答案。
- **假呼叫散落各處**：沒有一個統一入口，之後要換真 API 得改很多地方。

## 進階

假呼叫不只是開發階段的權宜之計，也可以留下來當測試替身：用固定的假輸出跑 [[prompt-chaining]] 的流程測試，確認 [[code-gate]] 在壞資料時真的會停下。真實 API 的格式風險，則要靠 [[structured-json-output]] 與 gate 一起處理。
