---
subject: vertex-learning-platform
language: zh-Hant
polish: default
created: 2026-08-22
updated: 2026-08-22
---

# MEMORY — vertex-learning-platform

## Goal
當這個主題結束時，要能重複「代理式工程（agentic engineering）」的完整工作流：先定義產品與邊界，寫出像 AGENTS.md 這樣能讓 AI 照著執行的操作手冊，走「先寫實作 prompt → 人工批准 → 才寫 code → 跑檢查」的循環，安全地把一個生產級全端應用交給 AI 建出來——以 Vertex 學習平台（Next.js + Sanity + Clerk + PostHog + Sanity Context MCP 智慧搜尋）當作練手載體，而不只是看懂這個 demo。

## Why
「如果 AI 寫程式讓你覺得危險，很好——你才是工程師。」想要的是掌控感加速度：不靠盲目 prompt 到能用，而是先給 AI 一套系統，讓它只做執行，人保留產品與架構決策。這是替未來自己驗證「可以信任但必須核驗 AI 寫的 code」的工作方式。

## Prior experience
- 寫過 Next.js 應用（App Router 有實作經驗），React/TypeScript 順手
- 一般前端/全端開發者，熟悉瀏覽器與伺服器、路由、資料請求的基本分工
- 對 Sanity / headless CMS、Clerk、PostHog、MCP、AI 搜尋是「有接觸但不深」——這次要把它們真的接起來
- 對「AI 寫程式」有動機但還在建立方法論，不是拿它當玩具

## Anchors
- 自己建過一個 Next.js 應用（可拿來對照：在「我的 app」裡 token 該放哪、哪邊是 server 邊界）
- 對「盲目 prompting 到能用」的崩塌有感——知道為什麼需要 plan-before-code 的工作流
- 學習平台 demo（作者在 Sanity 建課程、學習者在 Next.js 看課並搜尋）作為整條主線的具體場景

## Habits & constraints
- 每週數小時、分次進行（burst），不是長時間連續馬拉松
- 需要時可以自己建 Sanity / Clerk / PostHog 免費帳號，無額外摩擦
- 用文字學習為主（生成的文章與筆記），不需要重看影片

## Knowledge type
Mixed，以程序性（procedural）為主：核心是「會做且能重複」的工作流——跑 loop、接 Clerk、寫 GROQ、ingest 一支影片。概念性（declarative）內容（grounding、資料模型、安全邊界）要在「做的過程」裡講，不要單獨空講理論。

## How to teach me
- 用「做」來學，並用對比來建立信念：先給弱的做法與它為何崩塌，再給規則（「不能把 token 放瀏覽器」要講為什麼）
- 討厭空泛理論；每課最好結尾落在一件「真的能跑或真的能決定」的事上
- 用「為什麼 X 很重要？」點出價值，用具體例子與數字支撐，不堆術語
- 教學語言：繁體中文（zh-Hant）
