---
id: skill-bundled-scripts
title: "Skill 綁定腳本（Bundled Scripts）"
label: "Skill 綁定腳本"
subject: ai-agent-workflows
type: concept
status: draft
summary: "Skill 可綁定實際程式腳本，agent 執行後只有輸出進入 context，確定性任務因此更穩。"
aliases: []
prerequisites: []
related:
  - skill-lazy-loading
sources:
  - "[[sources/ai-agent-workflows/20261105/course/3-mcp-skills.txt#L246-L266]]"
created: 2026-11-06
updated: 2026-11-06
---

# Skill 綁定腳本（Bundled Scripts）

## 定義

Skill bundled scripts 是 skill 除了文字指示外，還能綁定的實際程式腳本。Agent 呼叫並執行腳本時，只有腳本的輸出結果會進入 context，執行過程本身不會污染對話紀錄。

## 為什麼重要

對確定性任務而言，與其每次在 prompt 裡教模型怎麼做、再賭它這次會不會猜對，不如把邏輯寫成程式。腳本每次執行都回傳穩定正確的結果，也省下反覆推敲所浪費的 context 與運算。

## 如何運作

在 skill 中引用一段腳本，agent 判斷需要時執行它。因為只有輸出進入 context，腳本內部的細節不會佔用對話空間；適合的任務包括表單欄位驗證、檔案格式轉換與資料清理。

## 例子

需要驗證表單欄位或轉換檔案格式時，直接執行綁定的腳本，拿到通過或轉換後的結果，而不是讓模型憑空生成格式。

## 邊界與常見誤解

綁定腳本適合 deterministic、規則明確的任務；需要判斷、創造或理解模糊情境的工作，仍應交給模型。腳本不是萬能，錯誤的腳本只會穩定地產生錯誤。

## 進階

把重複出現的規則沉澱成腳本，能同時提升正確率、降低 context 用量與執行成本，是 skill 從「提示」升級為「工具」的關鍵一步。
