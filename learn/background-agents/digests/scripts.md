---
source: sources/background-agents/20261027/scripts
source_type: codebase
source_lines: 565
language: JavaScript (Node ESM), JSON, Markdown
file_count: 12
status: absorbed
absorbed_at: 2026-10-27
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **教材產生器（`build-notes.mjs`）** — 把 `lesson-data.json`、`lesson-prose/*.md` 與相鄰 Git branch 的 `git diff --unified=3` 組裝成六篇 lesson 頁面；`--check` 模式比對現有檔案，任何漂移就丟錯。核心主張是「教學頁面不是手寫的，diff 本身就是教材」。
- **環境檢查與程序管理（`check-ports.mjs`、`preflight.mjs`、`stop.mjs`、`wait-for.mjs`）** — 啟動前檢查六個固定 port、Node 版本、Neon schema 與 OpenAI 變數，等待健康端點，結束後依 process group 清掉 workshop 程序。示範把「可重複的教學環境」當成工程問題處理。
- **課程中繼資料（`lesson-data.json`）** — 六課的 `slug`、`start`、`solution`、`promise`、`opening`、`edit`、`verify`、`experiment`、`mistakes`、`challenge`，加上每個 diff hunk 對應的 `editCues`。它是教材的 single source of truth。
- **逐課概念散文（`lesson-prose/01..06.md`）** — 六篇第一人稱的工程論述：harness 與 goal、durable execution、event wait、human approval、idempotent retry、求助與評估。散文談原理，程式區塊才談實作。

# L2 detail

- `#L1-L132` — scripts/build-notes.mjs — 教材產生器。`diffBlocks(start, solution)` 只針對 `teachingFiles`（`server/agent-workflow.ts`）跑 git diff，逐 hunk 收集保留脈絡、`+`、`-` 行；`renderLesson` 依序輸出 H1、start/solution、Outcome、The engineering idea、See it in the lab、Live coding、Verify、Break it on purpose、Engineering challenge、Catch up，並要求 diff hunk 數等於 `editCues[number]` 長度，否則拋出「N code edits but M location cues」。`--check` 逐篇比對輸出檔，是最後的防漂移閘門；主迴圈把結果寫到 `lessons/<slug>/index.md`。學習重點：教材與程式碼的同步可以被機械驗證。
- `#L133-L203` — scripts/check-ports.mjs — port 前置檢查。`names` 對照 3001 operator API、3002 agent endpoint、3004 checkout service、5173 dashboard、5174 lesson notes、8288 Inngest Dev Server。`hostPortIsFree` 先 bind 再 close，`hostPortAcceptsConnections` 用 500ms timeout 試連，`portIsFree` 同時檢查 `127.0.0.1` 與 `::1`，並容忍 `EAFNOSUPPORT`/`EADDRNOTAVAIL`。錯誤訊息直接告訴使用者「先停掉既有 workshop 程序」，示範可操作的失敗提示。
- `#L204-L257` — scripts/preflight.mjs — 課前環境健檢。檢查 Node major ≥ 22、`OPENAI_API_KEY` 與 `OPENAI_MODEL` 不是佔位值、`OPENAI_BASE_URL` 必須是合法 http(s)，再以 `postgres` 連 `DATABASE_URL` 並查 `select to_regclass('public.labs')`；連得到但沒 schema 就提示 `npm run db:push`。所有問題收集後一次列出，最後印出「Node, database schema, and OpenAI configuration are ready」。
- `#L258-L330` — scripts/stop.mjs — 收尾腳本，僅支援 macOS/Linux。以正則辨識 workshop 指令（`server/operator.ts`、`server/agent.ts`、`service/checkout.ts`、`node_modules/.bin/vite|vitepress`、`inngest dev -u http://127.0.0.1:3002/api/inngest`），用 `ps` 取 pid/pgid/command，再用 `lsof` 確認 cwd 等於專案 root，排除自己的 process group；先 `SIGTERM`，1.5 秒後仍在就 `SIGKILL`。示範「只殺自己啟動的東西」需要 cwd 與 pgid 兩層佐證。
- `#L331-L348` — scripts/wait-for.mjs — 健康等待器。參數是 service health URL，最多 100 次、每次間隔 100ms、單次 fetch timeout 500ms，成功即 `exit(0)`；失敗註解說明「服務還沒開始 listen」，逾時則提示去看 operator API 的啟動輸出。這是啟動腳本排序的基本積木。
- `#L349-L463` — scripts/lesson-data.json — 六課的課程資料。`lessons[]` 依序為 `01-goal-and-harness`（`lesson-1`→`lesson-2`）、`02-durable-execution`、`03-events-and-waiting`、`04-human-approval`、`05-safe-retries`、`06-incident-drill`（`lesson-6`→`main`），每筆含 `promise`、`opening`、`edit`、`verify`、`experiment`、`mistakes`、`extension`、`challenge`；`editCues` 以課號為 key，長度分別是 1、1、2、2、3、4，正好對應各課 diff hunk 數。讀這份檔案就能掌握整門課的教學節奏與故障腳本（`--fault feature`、`release`、`dependency`、`--lose-next-action-response`）。
- `#L464-L478` — scripts/lesson-prose/01.md — 第 1 課散文：chat agent 是介面、background agent 是生命週期；harness 擁有動作目錄、決策上限與完成判定；四種資訊（world state、run state、execution history、event history）不可混淆；工具刻意少而清楚，日誌是證據不是指令（引 AgentDojo）。
- `#L479-L505` — scripts/lesson-prose/02.md — 第 2 課散文：durable execution 把歷史存到 process 之外，`step.run` 的完成結果會被 memoize 並在重播時跳過；replay 不是還原 suspended stack，函式本體會重跑；model 選擇必須 checkpoint，否則重播會改寫決策；兩個時鐘兩個 store（checkout 現況 vs PostgreSQL/Inngest 歷史）；step 邊界要放在「崩潰後仍有意義」的呼叫上，並注意改 step ID 對舊 run 的影響。
- `#L506-L516` — scripts/lesson-prose/03.md — 第 3 課散文：event 是門鈴不是房間；一個 checkout instance 只允許一個 active run，屬應用層 correlation 而非 LLM 判斷；`wait` 以 `waitForEvent` 暫停並用 `eventSequence` 對帳競態；`request_help` 在此階段誠實記錄「尚未提供」；producer 也有 outbox 失敗窗口；重啟產生新 instance 並 supersede 舊 run。
- `#L517-L541` — scripts/lesson-prose/04.md — 第 4 課散文：能看出 release 有問題不等於有權 rollback；inbox 是未監督工作回頭找人的地方，項目要含意圖、理由、預期狀態與到期時間；順序是 persist proposal → 等 correlated decision → 重讀 → 重新觀察 → 才執行；approval 是 scoped capability（run、action、expected version、expiry），且 approval 不是萬用安全罩（來源標示、窄動作目錄）。
- `#L542-L552` — scripts/lesson-prose/05.md — 第 5 課散文：失敗可能落在「效果已提交、回應遺失」之間；durable step 只保存成功結果，服務端必須以 `actionId` 記住結果並拒絕同 ID 不同參數；本課把 action ID 改為由 run、cycle、action 推導，使重播得到同一個 intent key；`expectedVersion` 是第二道柵欄；cancellation 不等於 compensation；核心問題是如何表示 unknown outcome。
- `#L553-L565` — scripts/lesson-prose/06.md — 第 6 課散文：dependency outage 是本地工具修不了的，`request_help` 讓同一個 run 停下來等人回答；答案是新 context，不是恢復證據；Activity trace 要能讀成一個故事；評估要分別看 world state、action sequence、human boundary（引 τ-bench）；`agentState` 只給有界切片，長期 incident 需要 context policy；壞決策要先問是證據、工具設計、可用動作還是 harness 政策出問題。
