---
id: llm-as-agent-component
title: "LLM as Agent Component（LLM 是 agent 的零件）"
label: "LLM as Agent Component"
subject: ai-agent-workflows
type: concept
status: draft
summary: "LLM 只是 agent 架構裡的一個節點；agent 是包住模型、讓它能接觸環境並採取行動的完整系統。"
aliases: []
prerequisites:
  - llm
related:
  - agent
  - agent-harness
sources:
  - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L176-L199]]"
  - "[[sources/ai-agent-workflows/20261105/course/1-reasoning-llms-vs-agents.txt#L200-L246]]"
created: 2026-11-06
updated: 2026-11-06
---

# LLM as Agent Component（LLM 是 agent 的零件）

## 定義

LLM as agent component 指的是：LLM 不是 agent 本身，而是 agent 架構裡的一個零件、一個節點。Agent 是包在模型外面的完整系統，負責讓模型能接觸環境、取得回饋並採取行動。

## 為什麼重要

日常對話裡，人們常把 Claude、ChatGPT 或聊天機器人直接稱為 LLM，但在嚴格意義上，你使用的是被包裝好的 agent，模型只是其中一層。分清楚這一點，才能理解為什麼可以隨時切換背後的模型版本，而使用體驗與外層能力不必跟著重寫。

## 如何運作

Agent 的外殼負責連接外部世界：搜尋網路、呼叫工具、讀取檔案、把結果送回模型。LLM 在裡面負責文字理解與推理，決定要說什麼；但真正讓系統能「看到」與「動手」的，是外殼提供的工具與環境介面。

Agent 需要某種自主性；LLM 只能接受文字並輸出文字，無法直接對環境行動。這個差異就是兩者的分界。

## 例子

打開 claude.ai 或 ChatGPT 時，你面對的已經是一個 agent：它可以連網搜尋、執行工具，甚至讀取你電腦上的檔案。切換下拉選單裡的模型版本時，外層 agent 骨架不變，改變的只是內部調用的語言模型。

## 邊界與常見誤解

- **「我在用 LLM」通常不精確**：你用的是包住 LLM 的 agent 產品。
- **模型不是系統的全部**：工具、記憶、權限與流程都由外殼負責。
- **換模型不等於換 agent**：只要外殼不變，換模型通常不會改變整體架構。
- **LLM 不能單獨行動**：沒有外殼，它只能輸出文字。

## 進階

把模型與外殼分開看，是設計與除錯 agent 的起點。模型變強不代表任務會自動完成；真正決定 agent 能做什麼的，往往是外殼給了它哪些工具、哪些權限，以及怎麼把結果餵回去。外殼的實作細節見 [[agent-harness]]。
