---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.5.part.txt
source_type: text
source_lines: 234
part: 5
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- Chapter 5 · Memory Engineering — 開場指出每個新專案都讓 agent 從零認識你的工作方式；解方是「第二個大腦」，一個所有 agent 都會讀寫的 markdown git repo。章節骨架沿用 MODEL / PROMPT / CONTEXT / HARNESS / MEMORY / LOOP / BOUNDARY 的模組階梯。

- Lesson 5.1 The centralized brain — 沒有共享記憶時只有三個壞選項：每次重講、把規則複製進每個專案的 `AGENTS.md`（日後不同步）、只用本機 global `CLAUDE.md`（Codex、伺服器上的 AI employee 與 box 讀不到）。對策是分成「專案層」與「大腦層」兩層，大腦自成一個 git repo，跨專案 skills 也放在裡面。

- The scheme — 固定目錄結構：`AGENTS.md`、`index.md`（每則一行，agent 先讀）、`inbox/`、`intents/`、`guidelines/`、`taste.md`、`decisions/`、`projects/`、`notes/`、`sources/`（原文永不編輯）、`skills/`（capture、triage、lint、ask-brain）。數百則筆記用 index 加文字搜尋即可，不需要 vector database。決策檔含 decision／why／revisit when。

- How it works — 六步循環：說 "save this" 進 inbox → brain triage 歸檔並補 index → sync script commit/push 到 GitHub → 其他 agent 下次執行 sync 時 pull → triage 後跑 lint 修簡單問題 → ask-brain 回答時附上每則筆記連結。新機器 clone 後跑 install script 即取得整個大腦。

- Lesson 5.2 Connect every agent — 從 `dmoka/brain-template` 建 private repo，`git clone` 後跑 `node install.mjs`；install 會找機器上的 agent、把 skills 連結進各自的 global skills 資料夾、在 global 指令檔加一行指標（Cursor 沒有該檔則印出讓你貼）。

- Setup rules — 大腦要放在可見資料夾（`~/brain`，Claude Code 搜尋預設跳過隱藏資料夾）；每次變更後跑 `node sync.mjs`（commit、pull、push）；絕不存放 secrets、token、密碼或他人個資。

- Beyond your laptop — 伺服器上的 AI employee 與 TicketBay box 各自 clone 大腦並排程 pull；box 用自己的 deploy key（只能寫 brain repo）push。課程示範：空資料夾的 agent 原本選 SQLite，安裝後讀到測試 guideline 與資料庫決策，改選 Postgres 並用容器跑真資料庫測試。

- Lesson 5.3 Getting knowledge in — 儲存若超過幾秒你就不會做，手動分類則會積到沒人讀，所以拆成 capture（立即存）與 brain triage（之後分類）兩個 skill；另有 lint。Capture 也會在 session 結束前自動存下決策、gotcha 與「no, do it this way」這類修正（成為帶日期與原話的 taste 條目）。

# L2 detail

- `#L1-L24` — 章名 MEMORY ENGINEERING，副標「One brain for every agent you run」；模組階梯含 MODEL、PROMPT、CONTEXT、HARNESS、MEMORY、LOOP、BOUNDARY。
- `#L25-L73` — 問題陳述（agent 不記得你的 coding guidelines、已做的決策、測試寫法）與 Lesson 5.1 開頭；三個壞選項；兩層表：專案層（專案自己的 AGENTS.md、子資料夾指令檔、skills）vs 大腦層（跨專案 guidelines、decisions、每專案一短檔、部署等行政資訊，住在其 git repo）。
- `#L74-L131` — 大腦目錄結構與每個資料夾用途；guideline 與 taste 的例子（整合測試用真資料庫、偏好 boring solutions）；sources 永不編輯讓筆記可回溯原文；共享 skill 如 create-project；規模到數百則用 index 加文字搜尋即可。
- `#L132-L155` — 決策檔範例 `decisions/2026-01-15-postgres-default-database.md`（decision／why／revisit when）；六步運作循環；新機器 clone 加 install script。
- `#L156-L206` — Lesson 5.2：以 template 建 repo 的指令、install script 三件事、指標句原文、之後新增 agent 要重跑、Windows 需 Developer Mode；三條 setup rules（可見資料夾、sync.mjs、禁存 secrets）；伺服器與 TicketBay box 的 clone／pull／deploy key 機制；SQLite→Postgres 的課堂示範。
- `#L207-L234` — Lesson 5.3：capture 與 triage 分工的理由；capture 可從手機經 AI employee 使用，並在 session 結束前存決策、gotcha、修正；知道歸屬時可自行編輯再由 lint 補 index；brain triage 由「process my inbox」觸發，每項只選一個家（intent／guideline／decision／project note／general note），寫短筆記附來源、把原件移入 `sources/`、補 index（段落在此截斷）。
