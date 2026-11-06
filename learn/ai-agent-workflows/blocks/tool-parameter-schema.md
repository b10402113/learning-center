---
id: tool-parameter-schema
title: Tool Parameter Schema（工具參數結構）
label: Tool Parameter Schema
subject: ai-agent-workflows
type: concept
status: draft
summary: 參數 schema 說明工具每個參數的型別、格式與必填與否，是模型產生正確呼叫的依據。
aliases:
  - tool-schema
prerequisites: []
related:
  - tool-metadata
  - tool-calling
  - codeact
sources:
  - '[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L142-L178]]'
created: 2026-11-06T00:00:00.000Z
updated: '2026-11-06'
---

# Tool Parameter Schema（工具參數結構）

## 定義

Tool parameter schema 是工具 metadata 的一部分，描述每個參數的名稱、型別、格式、是否必填，以及參數之間的關係。它告訴模型該輸出什麼形狀的呼叫字串。

## 為什麼重要

模型只能照 schema 猜參數。若 schema 只寫一個含糊的欄位名，模型就得自行腦補格式，猜錯時整個呼叫就失敗。明確的 schema 能把這種不確定性降到最低。

## 如何運作

harness 把 schema 放進 context，模型在產生呼叫時依欄位名稱與說明填入值。harness 再依同一份 schema 驗證參數，通過才執行函式。schema 與文件一致，模型與程式才不會各說各話。

## 例子

查天氣工具的 `city` 參數若只寫 `city`，模型會猶豫該填郵遞區號還是「Chicago, Illinois」。改成明確說明格式並附範例，模型就能穩定輸出正確值。

## 邊界與常見誤解

參數不是越多越有彈性。塞入大量非必填選項，小型模型尤其容易混淆，不知道何時該用哪一個。參數模糊是工具錯誤主因，不是 agent 不會用工具。

## 進階

用標準化的結構描述（如 JSON Schema）搭配範例約束參數，並在 eval 中檢查參數正確率，讓 schema 成為可驗證的契約。
