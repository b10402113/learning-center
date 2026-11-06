---
id: tool-documentation
title: "Tool Documentation（工具文件）"
label: "Tool Documentation"
subject: ai-agent-workflows
type: concept
status: draft
summary: "工具文件是寫給模型看的說明，用清楚名稱、描述、參數與範例換取穩定的工具呼叫。"
aliases: []
prerequisites: []
related:
  - tool-metadata
sources:
  - "[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L297-L316]]"
created: 2026-11-06
updated: 2026-11-06
---

# Tool Documentation（工具文件）

## 定義

Tool documentation 是工具 metadata 的撰寫品質：名稱是否一看就懂、描述是否說明用途與差異、參數是否精確、是否附上使用範例。它針對的讀者是模型，不是人類同事。

## 為什麼重要

模型沒有辦法讀原始碼，也沒有真正的常識。文件寫得模糊，模型就選錯工具或傳錯參數；文件寫得精確，即使模型不大，也能穩定完成呼叫。

## 如何運作

撰寫時提供清楚的名稱與描述，讓模型分辨這個工具和其他工具的差別；參數要標明型別、格式與要求，並放入 examples，讓模型看過正確格式。最後避免設計過度寬泛或塞滿選項的參數。

## 例子

與其只寫「查詢天氣」，不如寫明「依城市名稱查詢目前天氣，城市需含國別或州別」，並附上 `{ "city": "Chicago, Illinois" }` 的範例。模型有具體樣板可模仿，輸出就更穩定。

## 邊界與常見誤解

文件不是愈長愈好，也不是把選項全部列出來。太多非必填參數與重疊工具會讓模型更難判斷。文件的目的在降低猜測，而不是展示功能。

## 進階

把文件品質納入 eval：追蹤工具選對率與參數正確率，並在每次新增工具時檢查描述是否與既有工具互相重疊。
