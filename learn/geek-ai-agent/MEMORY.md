---
subject: geek-ai-agent
language: zh-Hant
tune: none
tune-scope: elements-steps
created: 2026-08-19
updated: 2026-08-19
---

# MEMORY — geek-ai-agent

## Goal
學會用 AI coding agent 把企業級真實項目「做成」：先建立一套能落地的 AI 編程工作流（SDD + Harness），再真動手從 0 寫出一個 Agent OS（OryxOS：JDK 21 + Spring Boot + 自研 ReAct loop），把「用 AI 把一件事做成」變成肌肉記憶。When（分布式延時系統）以概念與案例理解為主，不真動手。

## Why
吞吐量動機延續自 ai-coding-for-real-engineer：一個人做超過一個人的事（"plan while the AI ships"）。本主題再疊一層：想真正搞懂 Agent / Agent OS 技術本身，能自己從 0 寫或基於開源二開——把「AI 編程能力」沉澱成「可遷移的工程判斷力」。

## Prior experience
- TypeScript / React / Node 熟悉（舊主題的 20k 行 TS/React playground）。
- 已學過 ai-coding-for-real-engineer：七階段流程（grill→research→prototype→PRD+plan→issues→implement→review）、AFK 離線交付、Claude Code 基本操作、PRD-to-plan skill、公平比較的實驗設置。
- 用過 LLM 寫程式 / 修 bug；有「系統化工作流」的意識，但尚未內化成肌肉記憶。
- Java 是增量——OryxOS 是 JDK 21 + Spring Boot 3.x + Spring AI，要當新領域補（不會一步步教 IDE，直接進項目）。
- 未勾選：git/GitHub 進階、Docker/sandbox、軟體架構理論。

## Anchors
- 舊主題的 playground 與 fair-test-setup 實驗——「受控比較」姿勢可對照到 Skills/Spec 的評估與迭代。
- 日常就在用 opencode / Claude Code 這類 agent 工具（有實際操作手感）。
- 沒有自己的 codebase 要套用——以課程的 OryxOS/When 當 playground。
- 認知篇（02–08）與舊主題高度重疊：已學過的不深讀，只挑 GitHub 趨勢(04)、自動化邊界(06)、SDD+Harness(07) 深讀；其餘略過。
- 源材料不含 DifyPro/mq9——roadmap 範圍就是 認知篇(02–08) + 擴展篇(09–15) + OryxOS(16–19) + When(20–23)。

## Habits & constraints
- 每週 1–2 小時，集中在週末/晚上的長段時間。
- 可以在本機安裝並執行 agent 工具與 Java 開發環境（JDK 21 / Maven / Spring Boot）。
- 時間緊，範圍需裁剪：項目壓到 OryxOS 一個，When 只做概念與案例理解。
- Docker 未確認可用——OryxOS 的 sandbox/部署若涉及容器會是明顯門檻，需要先補環境（延續舊主題的未勾選項）。

## Knowledge type
Mixed，以 procedural 為主。真正的學習發生在「動手建 OryxOS」與「跑通 SDD+Harness 工作流」；認知/擴展篇提供支撐性概念（Agent 五組件+一循環、SDD/Harness、自動化邊界、Skills），是「知道為什麼」的骨架，不是目的。

## How to teach me
- 先看完整實跑（worked run）：prompt → agent 行為 → 結果，一個完整來龍去脈，再上手。
- 簡潔、密度高、不要廢話；不耐煩冗長鋪陳。
- 要動手：在 OryxOS 項目上做真實練習，不是讀過去。
- 無聊的點：工具安裝/basics（TS 已熟、認知篇重疊部分）、重複已經懂的東西。
- 講「為什麼」的機制（為什麼 ReAct loop 要自研、為什麼時間輪 O(1)、為什麼 Harness 是三道防線）有助於記住「怎麼做」。
