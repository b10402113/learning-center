---
source: sources/background-agents/20261027/README.md
source_type: text
source_lines: 99
status: skipped
skip_reason: "Repository scaffolding, not part of the course material."
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- 課程定位 — 一日 TypeScript workshop，主題是「prompt 結束後仍持續工作的 agent」，學員自己打造 harness，外部 checkout 服務提供變動的世界。
- 系統邊界 — checkout（3004）發 alert 給 operator API（3001），incident agent（3002）以 HTTP 讀取現況並執行操作，人工決策會喚醒暫停的 Inngest run。
- 核心機制 — 事件只是通知、決策前必須重新觀察；一次事故只開一個 run，後續 alert 併入同一 run；重啟後舊 run 會被新實例取代。
- 環境需求 — Node LTS、npm、LLM API key、暫時性 Neon Postgres；三個終端機分別跑 agent、operator/inngest、checkout，另有 docs 站。
- 課程分支 — 六課各自從前一課的 solution 分支開始，分支切換只改原始碼，不動 Neon 或 Inngest 歷史。

# L2 detail

- `#L1-L4` — 標題與一句話定位：永不睡眠的 AI agent、一日 TypeScript workshop。
- `#L5-L16` — 系統邊界圖與責任劃分：checkout 擁有狀態、operator API 持久化事件並開 run、agent 讀現況後決策、人工決策恢復同一 run、重啟使舊 run 失效；goal 與完成條件在 `server/environment.ts`。
- `#L17-L40` — 安裝與環境設定：`npm install`、`.env`、Neon 連線字串、`OPENAI_API_KEY`／`OPENAI_MODEL`／可選 `OPENAI_BASE_URL`、`db:push`、`preflight`、`db:seed`。
- `#L41-L72` — 三個長駐終端機與服務位址表：agent 3002、operator/web/inngest 3001/5173/8288、checkout 3004、docs 5174；port 檢查與 `npm run stop`；durable-restart 用 `AGENT_SETTLE_DELAY=20s`。
- `#L73-L85` — fault drill 指令：`--fault feature|release|dependency|none`、alert 數量與間隔、`--recover-after-ms`、`--lose-next-action-response` 暴露副作用與 ack 的落差；UI 三個路由與「一次只跑一個 checkout」。
- `#L86-L99` — 課程分支表（lesson-1→lesson-2 … lesson-6→main）、Oxfmt 格式規範、每課後跑 format／lint／typecheck。
