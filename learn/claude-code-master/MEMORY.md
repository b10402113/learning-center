---
subject: claude-code-master
language: zh-Hant
created: 2026-10-28
updated: 2026-10-28
---

# MEMORY — claude-code-master

## Goal

把 Claude Code 從「一個會寫程式的聊天視窗」升級成自己的作業系統：skills、memory、routines、apps 四個層都親手搭起來，讓它替我自動跑重複性的工作，並且能把它接到我真正在用的工具（Gmail、行事曆、YouTube、筆記）上。最後還要用同一套 agent 平台，做出能上線、長得好看的網站／小工具。

判準不是「知道有這個功能」，而是：我能在自己的 workspace 裡指出哪個檔案、哪個 skill、哪條 routine 在替我做事，並且說出它斷掉時會怎樣。

## Why

我本來就在用 Claude Code 寫程式，但一直停在「打一句、它回一段」的表層，感覺只用到了它一成的力氣。看到同一個模型、同一層 harness，別人卻能靠「context」做出天差地遠的成果，我想把那條差距補起來。

更實際的動機：我有一堆重複性的工作（每週摘要、定時通知、內容產出、把工具串起來），不想再手動做。這門課的 ARMS 框架剛好是把「自動化我自己的日常」拆成可執行的四層。

## Prior experience

- 會寫 TypeScript／Node.js，讀得懂 Express 與 React；基本 SQL 與 Postgres 概念。
- 已經在用 Claude Code（終端機／VS Code 都有碰），但沒系統性設定過 skills、memory、routines。
- 走過 agent-harness 與 background-agents：懂 model 與 harness 的差別、context window、durable 與 state 的概念，知道「斷掉之後狀態去哪裡」。
- 自己有一個塞滿檔案與筆記的 repo（learning-center），對「把 workspace 變成第二大腦」這件事有真實素材可以套。
- 沒用過 MCP、CLI 連接器、Modal、Vercel 這類工具；design system 與前端品味屬於待建立。

## Anchors

- 每天開 Claude Code 寫程式 → 對照 Volume A 的三種介面、permission modes、models、effort。
- 「每週要產一份報告／摘要」→ local routine + skills（/last30days、/robo）自動生的 PDF。
- 「定時要寄通知／提醒」的 side project → routines 與 deterministic（Modal）自動化的分界。
- 平常在用 Gmail／行事曆／YouTube → 對照 Volume E 的 MCP vs API vs CLI，以及 token 成本差異。
- 用 React/Express 做過的 web 專案 → 對照 Volume F 的 CRAFT、design system、deploy 到 Vercel。
- 手上那個塞滿 md 的筆記 repo → 對照 CLAUDE.md / MEMORY.md 的「檔案櫃」與第二大腦。
- 「session 聊久了就變笨」的體感 → context window 與 compaction。

## Habits & constraints

- 每次 45–60 分鐘，一週 2–3 次。
- 一次一小段，能真的在自己機器上跑起來，比讀完更重要。
- 環境：本機 Node.js／TypeScript 專案，可裝套件；願意開免費的 GitHub repo、Modal、Vercel 帳號來實作。
- 語言：台灣繁體中文，技術名詞保留英文（skill、routine、memory、MCP、CLI、context 不硬翻）。

## Knowledge type

mixed，但**程序性主導**。這門課本質是「怎麼操作」的技能課：事實（有哪些模式、方案、限制）只學到夠用；重心是判斷——什麼時候用 MCP 還是 CLI、什麼該做成 routine 還是 deterministic、memory 該怎麼切、skill 何時值得存。

## How to teach me

- 先看「沒設定會怎樣」的失敗長相，再學對應機制；不要先背名詞定義。
- 每個抽象立刻綁到一個具體檔案、一個 skill、一條 routine 或一次錯誤訊息。
- 每一段都要有「你現在在自己的 Claude Code 打這個、會看到什麼」的可操作指令或步驟。
- 盡量保留一個「弄壞它／拆開它」的動作（關掉 routine、拿掉 memory、換成貴模型看 token 爆炸），讓我看到機制真的在作用。
- 不喜歡：名詞堆疊、沒有前因後果的功能清單、被要求先學完理論再動手。
