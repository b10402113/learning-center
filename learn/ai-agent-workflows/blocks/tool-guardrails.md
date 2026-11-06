---
id: tool-guardrails
title: "Tool Guardrails（工具防護）"
label: "Tool Guardrails"
subject: ai-agent-workflows
type: concept
status: draft
summary: "Tool guardrail 是把防護放進工具層，限制 agent 能執行的動作與影響範圍。"
aliases: []
prerequisites: []
related:
  - read-only-vs-read-write-tools
sources:
  - "[[sources/ai-agent-workflows/20261105/course/2-tools.txt#L70-L79]]"
created: 2026-11-06
updated: 2026-11-06
---

# Tool Guardrails（工具防護）

## 定義

Tool guardrail 是在工具或 harness 層加入的限制，用來約束 agent 可以呼叫什麼、能傳什麼參數、以及能造成多大的副作用。它不依賴模型自律，而是在程式端強制執行。

## 為什麼重要

agent 剛出現時，大家只顧著讓模型能動手，幾乎沒有防護，結果很快就出現誤刪檔案、甚至正式環境資料庫被清空的災情。這些教訓說明：能力愈強，防護愈要在執行端做足。

## 如何運作

guardrail 可以檢查參數是否落在允許範圍、限制可存取的路徑或 API、對高風險操作要求人工確認，或直接封鎖已知危險指令。因為工具是 harness 接給模型的介面，把檢查放在這裡最直接。

## 例子

在執行刪除類指令前先比對白名單，遇到 `rm -rf` 或正式環境字樣就中止；寫入類工具則要求二次確認或附上 idempotency key。

## 邊界與常見誤解

guardrail 不是叫模型「小心一點」，也不是寫在 prompt 裡的建議。若模型能繞過檢查直接觸發副作用，防護就等於沒有。

## 進階

把 guardrail 與可觀測性結合：記錄每次高風險呼叫、失敗原因與審批結果，讓事後追查與規則調整都有依據。
