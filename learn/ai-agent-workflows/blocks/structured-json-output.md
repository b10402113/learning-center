---
id: structured-json-output
title: "Structured JSON Output（結構化 JSON 輸出）"
label: "Structured JSON Output"
subject: ai-agent-workflows
type: concept
status: draft
summary: "要求模型只輸出固定 schema 的 JSON，讓程式碼能精確驗證中間結果。"
aliases: []
prerequisites: []
related:
  - code-gate
  - classifier
  - error-compounding
sources:
  - "[[sources/ai-agent-workflows/20261105/course/9-prompt-chaining-example-workflow.txt#L258-L356]]"
created: 2026-11-06
updated: 2026-11-06
---

# Structured JSON Output（結構化 JSON 輸出）

## 定義

Structured output 是指用提示詞約定模型只回傳特定結構的資料，通常是 JSON，且欄位固定。它的目的不是好看，而是讓呼叫端能用程式碼讀取與檢查，而不是靠文字猜測。

## 為什麼重要

只要中間輸出是可解析的 JSON，開發者就能寫出確定性的檢查：欄位在不在、型別對不對、值是否落在允許範圍。這讓步驟之間的把關變得便宜且可靠，也讓後續步驟拿到的是明確的參數，而不是一段需要再解讀的散文。

## 如何運作

做法通常是三件事一起講清楚：

1. **指定格式**：在 system prompt 說明只輸出 JSON，不要其他文字。
2. **指定 schema**：列出必要欄位與允許值，例如職業與理由。
3. **在呼叫端解析與驗證**：用 `JSON.parse` 讀取，再檢查欄位；解析失敗或欄位缺失就當成失敗。

<!-- derived -->

```text
Respond ONLY with JSON:
{"career": "...", "reason": "..."}
```

Schema 越窄，後續的檢查就越精確；相對地，模型能自由發揮的空間也越小。

## 例子

一個挑職業的步驟被要求只回傳 `{"career": "...", "reason": "..."}`。下一步不需要重新理解一段自然語言，而是直接取用 `career` 去組新的提示詞。routing 的分類步驟也一樣：只回傳 `{"route": "explore" | "roadmap" | "switch", "reason": "..."}`，程式碼就能用 `route` 查表。

## 邊界與常見誤解

- **JSON 不保證正確**：格式對不代表內容對，`career` 仍可能是個不合理的選擇。
- **模型會加料**：有時會在 JSON 外層包 Markdown 或補一句說明，解析因此失敗。
- **不是越複雜越好**：schema 越深，模型漏欄位的機率越高。
- **不是所有輸出都該 JSON**：要給人讀的最終回覆，通常還是自然語言。

## 進階

結構化輸出是 [[code-gate]] 能發揮作用的前提：gate 只檢查得到它看得懂的形狀。當解析失敗時，正確做法是讓流程停下或重試，而不是把原始字串硬塞給下一步，這正是避免 [[error-compounding]] 的關鍵。分類場景見 [[classifier]]。
