---
source: sources/agent-harness/20260915/7-durable-execution-setup-with-neondb.txt
source_type: text
source_lines: 256
status: absorbed
absorbed_at: 2026-10-24
created: 2026-10-24
updated: 2026-10-24
---

# L1 overview

- Durable execution 要解決的是「執行到一半斷線」：session 應獨立於 client 與 server 的存活狀態，重連後能續跑。
- 核心期待是 checkpoint 與 replay：知道哪些步驟已完成，恢復時跳過而不是重做。
- 這種需求本質上是 distributed computing，CI/CD 是最好的類比——多階段、可重試、可重播、狀態非同步回報。
- Agent 的執行必須與任何 consumer 解耦，並且對 process 結束與錯誤有容錯能力。
- 副作用（送信、轉帳）必須 idempotent，否則重試就會重複執行不可逆的動作。
- 目前 agent 的 messages 全在記憶體，重啟即失憶；send reply 更是無法回收的破壞性動作。
- 選用 DBOS：以 Postgres 為骨幹的 workflow engine，記錄每個 step 的輸入輸出，程式碼幾乎不用改。
- 相對地，Inngest、Cloudflare Workflows、Temporal 等 hosted 服務功能相近但導入成本高，DBOS 勝在「資料庫即後端」。
- 開發環境用 neon.new 的免費 72 小時 Postgres，設定 `DATABASE_URL` 並移除 `-pooler` 以取得非連線池版本。

# L2 detail

- `#L1-L30` — 從 ChatGPT 斷網的經驗切入，定義 durable execution 的期待：工作階段不因 client 或 server 消失而中斷，重連後從 checkpoint 續跑。
- `#L31-L67` — 把問題放進 distributed computing 的框架，用 CI/CD 的多階段、重試、快取與非同步狀態回報說明什麼叫可恢復的執行。
- `#L68-L94` — 推導出 agent 的執行需獨立於 consumer，並以送信與銀行轉帳說明為何要有 idempotency，避免重試造成重複副作用。
- `#L95-L117` — 對照目前實作找出兩個缺口：messages 只在記憶體中，以及 send reply 這種破壞性動作無法復原。
- `#L118-L177` — 介紹 DBOS 並解釋選型理由：不需要改寫程式、以 Postgres 為後端；同時點名 Temporal、Inngest、Cloudflare、Vercel、Upstash 等替代方案與其複雜度。
- `#L178-L203` — 說明做法：把 runtime 的動作改寫成 step，輸入輸出寫進資料庫，重跑時比對 workflow ID 跳過已完成步驟；並要求 step 具備 idempotency。
- `#L204-L233` — 解釋 Drizzle 只是資料庫 SDK、不需要深入，並提供取得 Postgres 的兩條路：本機資料庫或 neon.new 的免註冊免費資料庫。
- `#L234-L256` — 實作細節：URL 放進 `DATABASE_URL`，貼上 Neon 連線字串時要刪掉 `-pooler` 段落，改用非連線池版本才不會和 DBOS 衝突。
