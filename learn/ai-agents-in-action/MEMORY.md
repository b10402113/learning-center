---
subject: ai-agents-in-action
language: zh-Hant
tune: wang
tune-scope: elements-steps
created: 2026-08-17
updated: 2026-08-17
---

# MEMORY — ai-agents-in-action

## Goal
能動手構建並交付可運行的 AI agent 系統——從單一 agent（OpenAI Agents SDK）一路到多智能體系統、MCP 伺服器、RAG+記憶、評估與部署。學完能自己搭出工具、MCP server、多智能體流程，且不是玩具，是可以部署的形態。

## Why
職業成長。想把 AI agent 變成可寫入履歷的技能棧，不只是看熱鬧。這層動機要支撐到最難的部署與安全章節。

## Prior experience
- Python 熟手——類、非同步、裝飾器都順手，可跳過語法噪音直接讀架構
- 用 LangGraph 實際搭過 multi-agent 做 RAG 分析（具體框架、具體任務）
- 用過 Agent 框架（OpenAI Agents SDK / LangGraph / Dify / Coze 這類），概念骨架已存在
- 對 LLM API、提示工程有實戰基礎，MCP 可能有零星接觸，但不算熟

## Anchors
- 用 LangGraph 搭多智能體 + RAG 分析的實作經驗——所有單 agent vs 多 agent、flow/orchestration 對比都能掛回這次經歷
- 已有能跑 Python 的本地機器
- 目前沒有真實可插的資料/服務——以純學習為主，roadmap 用真實開源資料與「模擬真實工作」補上

## Habits & constraints
- 每週 3–5 小時，一兩次整塊時間
- 本地有可跑碼的機器；未確認 API 額度，預設按「有基本調用能力」設計，但不依賴昂貴實驗
- 學習以讀 + 跑為主

## Knowledge type
mixed——概念（五層架構、模式、推理方法）與程序性技能（寫 agent、寫 MCP server、跑評估）並重，程序性略重。

## How to teach me
- 概念與程式碼逐節交錯，邊讀邊跑（書本身即此節奏）
- **只有「真的用在工作上」才記得住**——每個 node 以「交付任務」而非「做題」組織：真實開源資料、真實部署形態；建議挑一個小型的私人專案當靶子
- 已懂的概念（單 agent、RAG 基礎）壓淺，深度放在架構、多智能體、推理與評估