---
subject: mobile-app-course
language: zh-Hant
created: 2026-10-01
updated: 2026-10-01
---

# MEMORY — mobile-app-course

## Goal

把一個想法用 AI coding agent 端到端做成一個**真的能上架 App Store 的 mobile app**：plan → UI → features → backend → dev build → EAS → TestFlight → 送審。以三門課程的 demo app 當練手載體（Codexgram 社群 app／Convex、Cal AI 熱量追蹤／Neon + trigger.dev、Dentify 診所 app／Next.js + Neon），並把 **Codex 與 Claude Code 兩條工作流並行對照**——主要用 Codex 實作，Claude Code 的路線以閱讀對照學。

## Why

**做出自己的產品／開一條 side income。** 不是為了看懂某個 demo，而是要把「一人 + AI agent 出貨一個 mobile app」變成可重複的能力。評斷這個主題成功的標準是：**不用回頭看課程，也能把整套 pipeline 對一個新點子重跑一次**。

## Prior experience

- 全端開發者：日常 TypeScript / Node，React / Next.js（App Router）順手，熟悉 browser/server 邊界。
- 關聯式 DB + ORM（Postgres + Prisma/Drizzle 類）的概念有，但課程用的具體服務沒碰過。
- **Mobile 完全是新的**：沒寫過 React Native / Expo 或任何 native code。
- **課程後端堆疊全是新的**：Clerk、Convex、Drizzle、Neon、trigger.dev 皆未使用過。
- 有 **OpenAI Codex**（主要 agent），**沒有 Claude Code**；Claude 路線以 read-along 方式學。
- macOS 開發環境；有 iPhone，願意付 Apple Developer $99/年。

## Anchors

- 自己的 Mac + iPhone（可跑真實 dev build、可實際送審）。
- 既有 Next.js app 的經驗 —— 對照「token 放哪、哪邊是 server 邊界、API route 與 server component 的分工」。
- 寫過 Postgres schema / migration —— 對照 Clerk↔DB 同步、webhook、seed 資料。
- 日常使用 coding agent（Codex）—— 對照 plan mode、screenshot-compare 迴圈、CodeRabbit review、寫 skill/AGENTS.md。
- 三個 demo app 作為具體場景：Codexgram（社群）／Cal AI（消費型 + AI 背景任務）／Dentify（local business + web dashboard）。
- 未來的目標是自己的 side project —— 這門課的每個元素最終要能回接到「換成我的 app 時該怎麼做」。

## Habits & constraints

- 每週約 6–10 小時，平日晚上 + 週末零碎時間。
- 在 macOS 上學；偏好**以實作為主**，閱讀只到能解除卡點的程度。
- 到 release 階段願意投入 Apple Developer $99/年；目前裝置為 iPhone。

## Knowledge type

**Mixed，procedural 主導但要求真正的概念深度。** 核心是「會做且能重複」——跑 loop、接 Clerk、設 Convex/Neon schema、觸發背景任務、出 EAS build。但因為 backend/data layer 是預期中最難的一段，底層觀念（context window、server/client boundary、auth 模型、Convex 的 reactive 查詢、trigger.dev 的 retry 語意）要在做的過程中被講清楚，不能只給指令。

## How to teach me

- **在真實專案上動手做**，先給大圖（整體在做什麼、各階段如何相扣）再往下鑽細節。
- **對照弱做法 vs 強做法**建立信念：先示範為什麼 naive 的寫法會崩，再給規則。
- 每個元素最終要能**回接到自己的 app**；理論若沒有可執行／可決策的落點會很無聊。
- 用 quiz／probe 檢驗，比單向講述有效。
- 課程文章以**繁體中文（zh-Hant）**撰寫，技術名詞保留英文。
