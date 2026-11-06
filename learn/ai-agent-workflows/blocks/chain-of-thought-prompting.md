---
id: chain-of-thought-prompting
title: "Chain-of-Thought Prompting（思維鏈提示）"
label: "Chain-of-Thought Prompting"
subject: ai-agent-workflows
type: concept
status: draft
summary: "在提示詞裡要求模型一步一步思考，讓它在答案前先產生推理，通常能降低幻覺並提高答對率。"
aliases: []
prerequisites: []
related:
  - reasoning-llm
  - thinking-summary
sources:
  - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L112-L142]]"
created: 2026-11-06
updated: 2026-11-06
---

# Chain-of-Thought Prompting（思維鏈提示）

## 定義

Chain-of-thought prompting 是一種提示技巧：在提示詞裡要求模型「一步一步思考」，讓它在給出最終答案前先產生中間的推理步驟。

## 為什麼重要

研究人員發現，使用思維鏈提示後，LLM 明顯比較不會產生幻覺，也比較容易得出正確答案。這個發現後來改變了模型的訓練方式：既然提示有效，就直接把這套流程訓練進模型，成為 reasoning LLM 的基礎。

## 如何運作

使用者不必改變模型，只需在提示詞加入類似「Let's think step by step」的指令。模型收到後，會把多步問題拆成可追蹤的推理片段，逐步推導，最後才輸出答案。推理與答案仍然是一次文字輸出中的前後部分。

## 例子

同一個問題，直接問「答案是什麼」，模型可能直接猜；改成「請一步一步思考，再給答案」，模型會先列出比較與推導，再收斂到結論。差別來自提示，而不是換了模型。

## 邊界與常見誤解

- **它是提示技巧，不是架構**：思維鏈不會讓模型取得工具或改變環境。
- **推理文字可能出錯**：寫得頭頭是道，不代表結論正確。
- **不是萬靈丹**：簡單任務硬加推理，只會增加 token 與延遲。
- **已被內化**：現代推理模型已把這個流程訓練進去，使用者不再需要每次手動提示。

## 進階

思維鏈提示是 [[reasoning-llm]] 的前身。當實驗室把「先推理再回答」訓練成模型預設行為，提示詞裡的那句「一步一步思考」就從必要指令變成了可選的提醒。
