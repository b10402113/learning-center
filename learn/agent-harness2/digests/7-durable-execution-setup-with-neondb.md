---
source: sources/agent-harness2/20261029/7-durable-execution-setup-with-neondb.txt
source_type: text
source_lines: 256
supplements:
  - harness-engineering.1.part.md#L1-L39
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
---

# L1 overview

- 核心問題：client 或 server 在回應途中斷線，session 應該能續跑；執行必須與消費者解耦。
- durable execution ＝ 可重放、可 checkpoint、fault tolerant 的分散式執行，最好的類比是 CI/CD 的 stage retry 與 replay。
- 副作用（send reply、轉帳）不可重複，必須靠 idempotency 與 workflow ID 去重。
- 現況缺口：messages 只在記憶體、重啟即失憶；destructive action 一旦送出就收不回。
- 選用 DBOS：以 Postgres 為骨幹的 workflow engine，記錄每個 step 的 input/output，崩潰後從斷點續跑，且幾乎不改程式碼。
- 需要 Postgres；可用 Neon 的 72 小時免費 DB，連線字串去掉 `-pooler` 後放入 `.env` 的 `DATABASE_URL`。

# L2 detail

- `#L1-L24` — 開場提問：對話中途斷線或 server 掛掉後重連，使用者期待的是「接續同一個 session」，因此需要 checkpointing。
- `#L25-L42` — 定義 durable execution：resilient、fault tolerant，屬於分散式運算；以 CI/CD 作為入門類比。
- `#L43-L67` — CI/CD 類比：每個 stage 可 retry、replay、cache，非同步回報狀態，服務中斷後能從斷點恢復。
- `#L68-L79` — agent 的執行必須獨立於 client 與 consumer，能處理 process 結束與錯誤，否則體驗很差。
- `#L80-L94` — 重複副作用的代價：send reply 送兩次、轉帳轉兩次；因此動作需要 idempotency。
- `#L95-L115` — 本專案的具體缺口：messages 全在記憶體、重啟後完全不知道發生什麼；send reply 是 destructive action，只能發生一次。
- `#L116-L137` — 引入 Postgres 支撐的 durable store；DBOS 會記錄 workflow 中每個 step 的 input/output，replay 時直接跳過已完成的工作並從斷點續跑。
- `#L138-L176` — 為何選 DBOS：database-backed 而非外部付費服務（Cloudflare、Inngest、Upstash、Vercel Workflows、Temporal），且不需改寫程式碼。
- `#L177-L203` — 把現有 runtime 改寫成 step，input/output 入庫；以 workflow ID 判斷「這個 step 已做過」就跳過；step 的 idempotency 是我們的責任；另存 event log。
- `#L204-L220` — Drizzle 只是資料庫 SDK，不會深入；本地已有 Postgres 即可，否則需建立一個。
- `#L221-L256` — Neon 免註冊免費 DB（72 小時）：取得連線字串、放進 `.dev.vars` 或 `.env` 的 `DATABASE_URL`，並移除 `-pooler` 改用 non-pooling 版本。
