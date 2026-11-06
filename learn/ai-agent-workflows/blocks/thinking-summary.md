---
id: thinking-summary
title: "Thinking Summary（思考摘要）"
label: "Thinking Summary"
subject: ai-agent-workflows
type: concept
status: draft
summary: "畫面上顯示的 Thinking 文字是模型思考過程的摘要，不是內部運算的完整重現，也不是最終答案。"
aliases: []
prerequisites:
  - reasoning-llm
related:
  - chain-of-thought-prompting
sources:
  - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L143-L175]]"
created: 2026-11-06
updated: 2026-11-06
---

# Thinking Summary（思考摘要）

## 定義

Thinking summary 是推理模型在產生最終答案前，介面顯示出來的那段「思考中」文字。它是模型思考過程的摘要，不一定完全等同於模型內部底層運算的所有細節，也不是最後要交給使用者的答案。

## 為什麼重要

把思考摘要誤當成答案或完整推理，會導致兩個錯誤：一是以為模型還沒回答，二是把摘要當成可驗證的依據。正確理解它的地位，才知道什麼時候該等最終答案、什麼時候該懷疑摘要遺漏了關鍵步驟。

## 如何運作

推理模型先在內部整理思路、逐步推理，介面再把這段過程以摘要形式串流顯示。使用者會看到「Thinking」或「Read」等狀態，接著陸續浮現分析文字，最後才出現正式答案。摘要的作用是讓你看到模型正在做什麼，而不是提供完整的除錯紀錄。

## 例子

在 GitHub Copilot 或 Claude 貼上一段程式碼，問它有沒有問題。畫面會先顯示 Thinking／Read，然後浮現一段段分析文字。那些文字是模型思考的摘要，最後那段結論才是回答。

## 邊界與常見誤解

- **摘要不是全文**：它可能省略內部運算的細節。
- **摘要不是答案**：看到思考文字時，最終輸出還沒完成。
- **摘要不保證忠實**：它是給人看的版本，不應當成模型內部的逐字紀錄。
- **有摘要不代表有行動**：顯示「Read」也不等於模型真的執行了檔案操作；實際行動由外殼負責。

## 進階

思考摘要的價值在於讓推理過程可觀察。當 agent 行為不如預期時，可以先看摘要判斷它是否誤解任務；但真正的除錯仍要回到工具紀錄與最終輸出，而不是只靠摘要。
