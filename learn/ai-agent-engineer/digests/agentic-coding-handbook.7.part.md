---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.7.part.txt
source_type: text
source_lines: 222
part: 7
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- **Chapter 7 · Loop Engineering** — 把「你逐一餵 prompt」換成一套自己會 prompt agent、跑到達標為止的系統。示範迴圈處理客服 bug email，一路開到 pull request；章內反覆用 MODEL / PROMPT / CONTEXT / HARNESS / MEMORY / LOOP / BOUNDARY 這些零件定位工作。
- **Lesson 7.1 · Loop engineering** — 每輪固定五步：discover、plan、do、verify、fix 後重跑。任務要進迴圈需三條件：常重複、完成可自動判定、失敗便宜。沒有「done」的檢查就先別建迴圈。開放迴圈 vs 封閉迴圈的成本差異（單 agent 50K–200K tokens，agent fleet 500K–2M）與六個零件：trigger、自己的 worktree、skills、connectors、獨立 checker、run 外的 memory；最後是 gate（編譯器、測試、CI，agent 辯不贏）。
- **Lesson 7.2 · The email loop** — TicketBay 的 bug email 迴圈：Claude Code routine 每小時跑、push 到自己的 `claude/` 分支、用 `bug-triage` skill、Gmail + GitHub connectors、測試與人工 review 當 checker、Gmail label 當 memory。流程六步（先在 Discord 宣告、寫失敗測試、修、跑全套、開 PR、通知可 review），三種結局，且永不 merge。
- **Lesson 7.3 · Prompt injection** — email 來自任何人，指令與資料在同一 context 無法可靠區分。致命三要素（private data、untrusted content、exfiltration 通道）＋ EchoLeak 實例。防線由弱到強：prompt 宣告 email 只是資料、專用 inbox、關掉 web fetch/search（`.claude/settings.json` 的 deny 規則）、guard hook 攔 shell、網路 allowlist。

# L2 detail

- `#L1-L22` — 章名 Loop Engineering 與章旨：從客戶的 bug email 到 pull request；列出 MODEL、PROMPT、CONTEXT、HARNESS、MEMORY、LOOP、BOUNDARY 作為本章零件圖。
- `#L23-L27` — 問題設定：一次一個 prompt 時 agent 每步都等你讀輸出、決定下一步；loop engineering 用系統取代這個位置，並以 email→PR 為例。
- `#L28-L52` — Lesson 7.1 開場：每輪五步（discover、plan、do、verify against goal、fix and repeat）；任務適用的三個勾選條件，以及「寫不出 done 的檢查就還不能建迴圈」。
- `#L53-L60` — 開放迴圈與封閉迴圈：開放式目標的 token 量與無用產出，對比先建好目標／步驟／逐步檢查／停止點的封閉框架，且每輪餵養下一輪。
- `#L61-L113` — 迴圈六零件表：trigger（排程或事件）、每次 run 自己的 worktree／分支、skill 檔承載目標與規則、MCP connectors 接通 PR／ticket／chat、分開的 checker（自己檢查會重複自己的假設）、run 外的 memory 檔或 label。
- `#L114-L124` — The gate：只採 agent 無法爭辯的檢查（compiler、tests、CI），結果非過即敗；出錯時加規則並用測試或 linter 固定，讓每次 run 都攔到同一錯誤。
- `#L125-L130` — Lesson 7.2 開場：TicketBay 迴圈符合三條件——bug 持續進來、新測試由紅轉綠加全套綠、失敗只是關掉一個 PR。
- `#L131-L158` — email 迴圈的零件對映：Claude Code routine 每小時雲端執行、每次新機器與 `claude/` 分支、`bug-triage`（dmoka/skills）skill、Gmail 讀信與 GitHub 開 PR、測試加人工 review、Gmail label 記錄已處理。
- `#L159-L169` — 單輪流程：取最舊的未標記 email，依序在 Discord 宣告、寫重現 bug 的失敗測試、修到測試通過、跑全套、開 PR 讓 CI 重跑、再通知可 review。
- `#L170-L174` — 三種結局（開 PR／無法重現且不改碼／可疑報告）；因任何人可寄信，prompt 與 skill 都禁止 merge，一律人工 review。
- `#L175-L180` — 頁尾與 Discord 頻道示意（picked up → ready for review），接 Lesson 7.3 標題。
- `#L181-L186` — Prompt injection 原理：agent 把指示與 email 讀成同一串文字，無法可靠分辨來源，因此信裡一句話可能像你下的指令。
- `#L187-L197` — Lethal trifecta：private data、不受控內容、外送通道三者同時存在；EchoLeak 把內部資料塞進圖片 URL。email 迴圈三者皆備（整個信箱、任何人可寫的信、Discord／Gmail 轉寄／公開 repo 的 PR）。
- `#L198-L215` — What stops it：先把 prompt 當最弱防線，再移除攻擊所需——專用 inbox、deny web fetch/search、guard hook 攔環境變數輸出與非指定 curl、只放行 GitHub／registry／Discord 的網路 allowlist。
- `#L216-L222` — 頁尾與 `.claude/settings.json` 片段 `"permissions": { "deny": ["WebFetch", "WebSearch"] }`，標註出處 course kit m7/routine-guide.md step 4。
