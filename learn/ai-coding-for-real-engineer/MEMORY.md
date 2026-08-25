---
subject: ai-coding-for-real-engineer
language: zh-Hant
created: 2026-08-18
updated: 2026-08-19
---

# MEMORY — ai-coding-for-real-engineer

## Goal
學會用 AI coding agent（Claude Code 或任何 CLI harness）把功能「離線交付」（AFK）：把規格/PRD 定清楚，把大塊實作交給 agent 放手執行，人走開，回來時拿到可以跑、有測試、已 commit 的程式碼。學會整套七階段流程：grill（訪談）→ research → prototype → PRD + plan → issues → implement（HITL 或 AFK）→ review。

## Why
吞吐量動機：一個人做超過一個人的事。agent 專心寫程式時，人可以同時規劃下一批工作（"plan while the AI ships"）。這是學習卡住時（setup 摩擦、agent 亂搞）真正拉著往前走的動力。

## Prior experience
- TypeScript / React / Node 熟悉 — 課程 playground 是 20k 行的 TS/React app，feedback loops（tsc + vitest）都用得上。
- 用過 LLM 寫程式 / 修 bug（非重度）— 知道「agent 幫我生 code」是什麼感覺，但沒有系統化流程。
- 未勾選：git/GitHub 進階流程、已日常使用 coding agent、軟體架構理論、Docker/sandbox。這些被當作新領域對待。

## Anchors
- 曾讓 LLM 寫過或修過程式碼 — 每個「讓 agent 放手」的元素都可以接回「以前是我在逐字改、現在交給 agent」的對比。
- 實際碰過 TS 專案（工作或 side project）— playground 的 repo 結構、migration、service + test 模式可對照。
- 未勾選 bad codebase 的痛、沒跑過 Docker、暫時沒有自己的 repo 要套用 — 這些課程章節要當新知識帶。

## Habits & constraints
- 每週 1–2 小時，集中在週末/晚上的長段時間。
- 可以在本機安裝並執行 agent 工具（Claude Code / 課程 repo）。
- 未勾選 Docker/Podman 可用的選項 — 進入 AFK sandbox 章節時會是明顯門檻，需要先補環境。
- 沒有自己的 codebase 要套用課程練習（用課程提供的 playground repo）。

## Knowledge type
Procedural — 以「做」為主。這是一門技能課（如何跑七階段流程），概念（context window、smart/dumb zone、feedback loops）是支撐，不是目的。

## How to teach me
- 先看完整實跑（worked run）：prompt → agent 行為 → 結果，一個完整的來龍去脈，再讓我上手。
- 簡潔、密度高、不要廢話；不耐煩冗長鋪陳。
- 要動手：在 playground repo 上做真實練習，不是讀過去。
- 無聊的點：工具安裝/basics（TypeScript/React 已熟，不需要 tooling walkthrough）、重複已經懂的東西。
- 講「為什麼」的機制（為什麼 context 會變笨、為什麼 feedback loop 有效）有助於記住「怎麼做」。
