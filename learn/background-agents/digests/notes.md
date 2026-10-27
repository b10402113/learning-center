---
source: sources/background-agents/20261027/notes
source_type: codebase
source_lines: 31
language: Markdown
file_count: 3
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **課程計畫（`course-plan.md`）** — 定義學習承諾（給 agent 一個 standing goal、離開、再回來看它如何被事件／失敗／人工決定喚醒）、對象（專業 JS/TS 工程師、一日工作坊後轉 VOD）、六個 branch 的 harness 主線與四個 drill，並說明 checkout 服務、Neon、Inngest 各自的責任邊界。
- **教材撰寫與排練（`lesson-authoring.md`）** — 說明 `lesson-N` / `lesson-(N+1)` 的相鄰 branch 慣例、`notes:generate`/`notes:check`/`docs`/`docs:build` 的用途、排練流程（打字、format/lint/typecheck、對 fresh checkout 驗證）與必看的五條 trace；強調切 branch 不會重置 Neon 或 Inngest。
- **Checkout 服務契約（`simulator.md`）** — 把「模擬器」正名為受控的合成服務：記憶體狀態、instance ID、啟動旗標、`GET /state|/logs|/changes` 與 `POST /operations`、穩定 event ID、`expectedVersion`、`actionId` 去重與 `--lose-next-action-response`。這是 harness 唯一能信任的外部世界介面。

# L2 detail

- `#L1-L11` — notes/course-plan.md — 課程總計畫。學習承諾是「give an agent a standing goal, leave it working, and understand how it wakes correctly after an event, a failure, or a human decision」；形式是一日 live workshop、之後 VOD，每課含工程討論、小型 live coding、trace 或失敗實驗、至少 15 分鐘 Q&A。界定三個系統的職責：checkout process 擁有狀態並發 alert、operator app 只有 Inbox/Activity/Events、Neon 存事件與決策、Inngest 存 checkpoint 與 wait。Correlation 規則是一個 instance 一個 active run、首個 alert 開啟、後續加入、恢復後完成、重啟 supersede；並明說多服務生產環境需要 incident key。最後提醒：舊 OpenSpec 檔案是歷史設計紀錄，README 與 lesson notes 才是現況。
- `#L12-L22` — notes/lesson-authoring.md — 教材製作與排練手冊。六課以相鄰 branch 為 checkpoint，學員只在 `server/agent-workflow.ts` 動手，其餘（checkout、dashboard、event intake、DB、model adapter）都是 supplied code。`npm run notes:generate` 由 `scripts/lesson-data.json`、`scripts/lesson-prose/*.md` 與相鄰 branch 的實際 diff 產生六頁；`notes:check` 抓漂移；`docs` 本機服務、`docs:build` 檢查連結與渲染。排練要求：先講、再從 start branch 打字、跑 format/lint/typecheck、對 fresh checkout 驗證、留 15 分鐘。必看 trace 有五條（feature repair、event wait/recovery、release rollback with approval、lost acknowledgement and safe retry、dependency help request）。結束提醒：不要讓模型看到 simulator 的 fault flag，`.env` 與 Neon 連線字串不得進 Git。
- `#L23-L31` — notes/simulator.md — Checkout service 契約。服務是 harness 之外的獨立 process，狀態在記憶體、每次啟動有新 instance ID；旗標可選 healthy、broken feature rollout、faulty release、dependency outage，並對外提供 `GET /state`、`GET /logs`、`GET /changes`、`POST /operations`（port 3004）。Event body 含穩定 event ID、`serviceId`、`instanceId`、type、data；operator API 負責持久化並指派給該 instance 的唯一 active incident，重複 ID 不會再開 incident，重啟則 supersede 舊 run 與 pending approval。讀操作回 logs/changes；`disable_feature` 與 `rollback_release` 改狀態並接受 `expectedVersion`；每個 operation 都帶 `actionId`，服務記住結果、重試回原結果、同 ID 不同參數則拒絕。`--lose-next-action-response` 提交一次卻回 503，用來證明 durable step 單獨不足以保证單一 effect。最後說明 outbox 與同步寫入是 production 才需要的保證。
