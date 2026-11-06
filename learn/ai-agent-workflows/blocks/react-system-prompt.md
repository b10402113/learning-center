---
id: react-system-prompt
title: "ReAct System Prompt（ReAct 系統提示詞）"
label: "ReAct System Prompt"
subject: ai-agent-workflows
type: concept
status: draft
summary: "用 system prompt 教模型 ReAct 格式、工具清單與停下來等 observation 的規則。"
aliases: []
prerequisites: []
related:
  - react
  - tool-calling
sources:
  - "[[sources/ai-agent-workflows/20261105/course/14-react.txt#L309-L354]]"
created: 2026-11-06
updated: 2026-11-06
---

# ReAct System Prompt（ReAct 系統提示詞）

## 定義

ReAct system prompt 是放在對話最前面的指令，負責告訴模型「你現在是一個 ReAct agent」。它定義角色、互動格式、可用工具，以及模型在每次輸出後必須停下來等待外部程式回傳 observation 的規則。

## 為什麼重要

模型本身不知道自己在跑什麼架構。如果不把格式寫進提示詞，它可能直接回答問題、自己編造工具結果，或一次輸出多個 action，讓解析器無法處理。把規則講清楚，是讓迴圈能被程式碼穩定驅動的前提。

## 如何運作

一份可用的 ReAct system prompt 通常包含：

1. **角色**：例如「你是一位職涯顧問，請推薦一個最適合的職業並說明如何進入」。
2. **互動模式**：要求交錯使用 Thought、Action 與 Observation。
3. **各步驟職責**：Thought 根據已知資訊推理下一步；Action 只能從工具清單選一個並附上輸入。
4. **停頓規則**：每次只輸出一組 Thought 與 Action，然後停止，等待程式回傳 Observation。
5. **工具清單**：名稱與描述要和程式實際提供的工具一致。
6. **格式範例**：附上一到兩組完整軌跡，等於用 few-shot prompting 示範輸出長相。

## 例子

職涯 agent 的 system prompt 會寫明：要用工具時輸出 `Thought:`、`Action:`、`Action Input:` 後停止；資訊足夠時輸出 `Thought:` 與 `Final Answer:`。工具清單則由程式從 tools 物件自動產生，避免提示詞和實際工具脫節。

## 邊界與常見誤解

- **提示詞不是萬靈丹**：模型仍可能格式錯誤，程式端必須有解析與錯誤回餵。
- **工具描述要精準**：名稱或描述重疊時，模型會選錯工具，換更大模型通常不是解法。
- **範例不是越多越好**：少量高品質軌跡通常比塞進大量不相關範例有效。
- **不能只寫「你是 agent」**：沒有格式與停頓規則，模型不會自動變成 ReAct。

## 進階

提示詞決定模型輸出的形狀，程式碼則決定這個形狀如何被執行。兩者要一起設計：parser 能接受什麼格式，提示詞就該要求什麼格式。工具端的設計見 [[tool-calling]]，整體迴圈見 [[react]]。
