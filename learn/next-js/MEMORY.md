---
subject: next-js
language: zh-Hant
created: 2026-10-04
updated: 2026-10-04
---

# MEMORY — next-js

## Goal
成為 Next.js 高手，能**看懂 AI 寫的架構**。具體拆成三層能力，按序推進、重心放中間：
1. **讀懂** — 能解釋 AI 產出的每個檔案與資料流（route handler 在幹嘛、元件的 server/client 身分、資料從哪進哪出）。
2. **判斷（重心）** — 一眼看出 AI 架構決策哪裡對、哪裡踩雷：快取放錯、server/client 邊界畫錯、server action 濫用、N+1 query 等。
3. **主導** — 能先講清楚正確架構，再讓 AI 照著寫，而不是被 AI 的產出牽著走。

## Why
AI 會寫 code，但我要當那個**懂架構、能驗收與決策**的人——這是軟體工程師在 AI 時代的護城河。不想只會叫 agent 幹活，而要能在 AI 產出之上做技術判斷。

## Prior experience
- **能自己寫**：TypeScript / Node、React、Next.js App Router 基本操作（routing、RSC 邊界、檔案式路由）。
- **看過 / 跟做過、還沒自己想透**：NextAuth、Server Actions、Mongoose / MongoDB、ISR / PPR、快取與 revalidate、Route Handlers、正式部署。
- 全端開發者，熟悉 browser/server 邊界；用過 Postgres + ORM；用過 NoSQL（Redis/MongoDB）但場景有限。
- 重度使用 coding agent（主力 Codex，其次 Claude Code）。

## Anchors
- **平常讓 Codex / Claude Code 產出的 Next.js 專案** —「AI 寫的架構」最直接的素材（主要錨點）。
- **本 repo 的 DevFlow 原始碼**（`sources/next-js/20261004/jsmasterypro_devflow`）—「正確範本」，用來對照 AI 的常見寫法。
- **mobile-app-course 的 Dentify**（Next.js + Neon 診所 app）。
- 工作上的 Next.js / React 專案。
- 日常：macOS + VS Code + Node + Git；隨手就能叫 agent 生一個專案來讀。

## Habits & constraints
- 每週約 5–8 小時，平日晚上 + 週末碎片時間。
- macOS + VS Code + Node 開發環境；無硬 deadline。

## Knowledge type
Mixed，**declarative 主導**。瓶頸在心智模型與取捨判斷（「為什麼這樣設計、什麼時候會錯」），不只在動手；procedural 作為輔助，靠讀真實 code 與小實驗驗證。

## How to teach me
- **先大圖再細節**：先攤開整體架構與各層如何相扣，再往下鑽。
- **好 / 壞寫法對照**：每個概念給「AI 常犯版 vs 正解版」，用對照建立判斷力——這是本門的核心手法。
- **場景導向**，不要抽象概念轟炸。
- **以真實 code 對照為主，可跑的實作標成選配**（碎片時間下不強迫每課都動手）。
- 每課附自測（用 `/tackle`）。
- 文章以 **zh-Hant（台灣繁體）** 撰寫，**技術名詞保留英文**。
