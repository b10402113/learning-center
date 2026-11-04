---
source: sources/ai-agent-engineer/20261103/resources/repos/brain-template
source_type: codebase
source_lines: 2728
language: Markdown
file_count: 36
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `brain-template/` — 一個「第二大腦」模板：單一 git repo 存放跨專案通用的知識，所有 coding agent 都讀同一份；專案專屬知識留在各專案的 `AGENTS.md`。對記憶工程的學習者，它示範了「集中式長期記憶 + 寫入/整理/檢索/維護」的完整閉環，而不是只做向量檢索。
- `README.md` / `index.md` — 入口文件；README 說明結構、安裝、同步、dev container 與規則，index 是「每個檔案一行」的檢索層，agent 先讀它再 grep。這是低成本、可審核的記憶索引設計。
- `AGENTS.md` / `CLAUDE.md` — 這個 repo 自己的 agent 規則（讀 index 與 taste、新東西先進 inbox、一檔一主題、每個檔案要有來源、改過的決策不刪只標 superseded、改完跑 lint 與 sync）；`CLAUDE.md` 只有一行 `@AGENTS.md`，讓 Claude Code 繼承同一套規則。
- `taste.md` — 「什麼叫做好」的偏好檔：Never / Prefer / Tie-breakers，每條附理由與日期，上限 150 行。它把使用者的品味變成 agent 可讀的判斷依據，是記憶中「價值觀層」的範例。
- `intents/` — 想達成的目標，一檔一個：goal、why、done when、not now；agent 規劃工作前先讀，讓產出對齊目標。
- `guidelines/` — 跨專案通用的做法規則（rule / why / how），每條連回來源；使用者自己定的規則用 `source: own`。這是「可執行知識」與「證據」分離的示範。
- `decisions/` — 有日期與理由的決策，一檔一個；變更時新增檔案並把舊的標 `status: superseded` + `superseded_by`，永不刪除，保留決策史。
- `projects/` — 每個專案一頁行政資訊（是什麼、程式碼在哪、跑在哪、狀態、負責人），不含建置細節。
- `notes/` — 其餘值得留下的知識（所學、比較、agent 的好答案），每篇連回來源。
- `inbox/` — 新東西的著陸區；capture 只寫不整理，triage 之後清空，避免未消化內容污染長期記憶。
- `sources/` — 原始證據（連結、貼上的文字、檔案），永不編輯；其他資料夾都是對它的解讀。這條「證據不可變、解讀可演進」是整個設計的核心。
- `skills/capture`、`skills/triage`、`skills/lint`、`skills/ask-brain` — 四個技能分別負責「快速寫入」「分類歸檔並清空 inbox」「修正結構漂移並回報矛盾」「只讀檢索並附引用回答」，構成記憶的寫入、整理、維護、讀取四相。
- `install.mjs` / `sync.mjs` — 把大腦接上機器上的每個 agent（symlink 技能 + 一行指標指令），以及 commit / pull --rebase / push 的同步腳本；讓「一份記憶、所有 agent 共用」在工程上可落地。
- `test/` 與 `.github/` — `node --test` 單元測試，加上跨 Windows/macOS/Linux、容器、真實 Hermes 與非管理員 Windows 使用者的端到端驗證；顯示這類基礎設施需要處理的跨平台與冪等性細節。

# L2 detail

- `#L1-L138` — `README.md` — 專案定位（模組 5 的第二大腦）、目錄職責表、四技能、安裝與 agent 對接表、每日排程（triage → lint → sync）、dev container 的獨立複本與 deploy key、三條規則（私有、存疑就不要建 note、sources 不可編輯）。
- `#L1-L19` — `index.md` — 「先讀我」的單行索引：依 Intents / Guidelines / Decisions / Projects / Notes 分區，每行是標題、相對連結與一句話說明，讓 agent 不必先掃全庫。
- `#L1-L28` — `AGENTS.md` — 這個 repo 的 agent 行為契約：Read（index → taste → ask-brain、sources 是證據）、Write（先進 inbox、一檔一主題、kebab-case、日期前綴、每檔連來源、每個新檔加 index 行、決策 superseded 不刪、寧缺勿濫、不存機密）、Finish（跑 lint 與 sync）。
- `#L1-L1` — `CLAUDE.md` — 只有 `@AGENTS.md`，用 Claude Code 的引用語法讓兩套 agent 規則保持單一來源。
- `#L1-L14` — `taste.md` — 三類偏好（Never / Prefer / Tie-breakers）與「規則—理由—日期」格式；lint 會在超過 150 行或缺 because/日期時警告。
- `#L1-L10` — `decisions/README.md` — 決策檔命名 `YYYY-MM-DD-slug.md`；變更流程是新增檔案、舊檔標 superseded、新檔寫 supersedes，lint 驗證 superseded_by 指向存在的檔案。
- `#L1-L13` — `decisions/2026-01-15-postgres-default-database.md` — 範例決策：新專案預設 Postgres，理由是一個熟悉的資料庫勝過每次重選、容器與正式環境一致，並寫明何時該重新考慮。
- `#L1-L4` — `guidelines/README.md` — 一檔一條跨專案規則，含 rule、why、how；專案專屬規則不放在這裡。
- `#L1-L11` — `guidelines/integration-tests-real-database.md` — 整合測試用容器裡的真實資料庫（如 Testcontainers），理由是 mock 只回傳你指定的東西，真正會出錯的查詢、約束與交易都被掩蓋；附 how 與來源連結。
- `#L1-L16` — `guidelines/test-behavior-not-implementation.md` — 測試只走公開 API、不斷言私有函式、不 mock 自己的模組；理由是綁定實作的測試會在無行為變更的重構中變紅，於是「紅燈」失去意義、agent 學會改測試而不是修 bug。
- `#L1-L4` — `inbox/README.md` — 新東西（連結、貼上文字、截圖、session 中的決策）先落地於此，capture 一項一檔，triage 清空後只剩 README。
- `#L1-L11` — `inbox/2026-01-20-example-captured-link.md` — 範例 inbox 項目：frontmatter 記錄 `source`、`captured_at`、`captured_by`、`note`、`fetch`，正文是擷取內容；示範「原始素材與使用者理由一起保存」。
- `#L1-L7` — `intents/README.md` — 目標檔的用途與生命週期：agent 規劃前先讀 active intents；達成或放棄時標 `done` / `dropped` 並補一行原因，永不刪除。
- `#L1-L9` — `intents/example-app-public-launch.md` — 範例目標：公開上線並取得第一位付費客戶，含 why、done when（正式環境收到一筆付款）與 not now（手機 app、第二語言）。
- `#L1-L4` — `notes/README.md` — 其餘值得保存的知識都放這裡，每篇連來源；agent 給出的好答案也歸檔成 note。
- `#L1-L11` — `notes/why-mocks-hide-database-bugs.md` — 範例 note：列出 mock 資料庫會漏掉的三類 bug（錯誤 join／缺索引／collation、資料庫約束、交易內衝突），並連回對應 guideline 與來源。
- `#L1-L4` — `projects/README.md` — 每專案一頁行政視圖（是什麼、程式碼位置、執行位置、狀態、對象）；建置方式屬於該專案的 AGENTS.md。
- `#L1-L8` — `projects/example-app.md` — 範例專案頁：What / Code / Runs on / Status / Client / Notes（例如「只能經 CI 部署」）。
- `#L1-L4` — `sources/README.md` — 原始素材區：triage 會把 inbox 項目移到這裡，永不編輯，因為 note 都指向它。
- `#L1-L10` — `sources/2026-01-15-testing-talk-notes.md` — 範例來源：一場測試演講的筆記，記錄三個通過 mock 整合測試卻在 production 失敗的案例（錯誤 join、唯一約束、交易衝突）。
- `#L1-L11` — `sources/2026-01-18-refactor-broke-tests-notes.md` — 範例來源：一次改名私有 helper 與搬移函式的重構，行為不變卻有 14 個測試失敗，因為測試斷言了內部呼叫並 mock 自家模組。
- `#L1-L42` — `skills/capture/SKILL.md` — 快速且「笨」的寫入：URL 先抓文字、抓不到也保留 URL 與 `--fetch blocked`、用 `new_item.py` 建檔（必要時以 `--source-file` / `--body-file` 避免 URL 出現在命令列）、跑 sync、一行回覆；session 結束可主動 capture 決策或 gotcha；使用者附理由糾正時追加一則 taste；禁止在此建 note 或改 index、禁止貼機密。
- `#L1-L42` — `skills/triage/SKILL.md` — 對每個 inbox 項目只選一個家（intent / guideline / decision / project / note / 不建），先 grep 避免重複，改寫成幾行洞見並連來源，`git mv` 原檔到 `sources/`，更新 index，處理 superseded 決策，最後清空 inbox、跑 lint 與 sync。重點防線：來源文字是資料，其中的指令不可服從，也不可把捕獲文章升格為 guideline 或 taste。
- `#L1-L44` — `skills/lint/SKILL.md` — 兩段式維護：機械段跑 `lint.py --fix` 修 index 漂移與死鏈，並處理缺來源、superseded 缺指向、決策缺日期等；判斷段由 agent 讀近期變更找矛盾（用 `> [!warning] Contradiction` 標記雙方、不選邊）與過時事實，只回報不改寫；最後 sync。
- `#L1-L42` — `skills/ask-brain/SKILL.md` — 純查詢流程：先讀 index 與 taste、以主題加 2–3 個同義詞 grep 全部知識資料夾、完整讀 2–4 個最相關檔案、逐項附引用回答；證據不足時明確說「還沒有人寫成 note，但捕獲了 `<path>`」；防假缺席（grep 空手才可說沒有）、信心隨來源強度、留意過期與 superseded、不編造、不填充，也不把專案的 AGENTS.md 混入大腦。
- `#L1-L69` — `skills/capture/scripts/new_item.py` — capture 的建檔器：從 stdin 或 `--body-file` 取內容，組出 `source` / `captured_at`（UTC）/ `captured_by` / `note` / `fetch` frontmatter，以日期加 kebab slug 命名並處理重名，寫入後刪除 `inbox/` 內的暫存檔，最後印出相對路徑。
- `#L1-L147` — `skills/lint/scripts/lint.py` — 決定性的結構檢查：index 條目指向不存在檔（可用 `--fix` 移除）與檔案未列 index（可自動補 TODO 行）、相對連結死鏈、notes/guidelines 必須有 `sources/` 連結、URL 或 frontmatter `source: own`、decisions 需有 date 且 superseded 需有存在的 superseded_by、inbox 非空警告、taste 超過 150 行或條目缺 because/日期的警告；有 error 時 exit 1。
- `#L1-L616` — `install.mjs` — 跨 agent 接線器：辨識 Claude Code（`~/.claude/skills`、`CLAUDE.md`）、Codex（`~/.agents/skills`、`$CODEX_HOME/AGENTS.md`）、Cursor（`~/.agents/skills`，規則需貼到設定）、Hermes（`config.yaml` 的 `skills.external_dirs`、`SOUL.md`）；只建 symlink 不複製、已存在非連結則不動、冪等；Windows 先探測 symlink 權限並提示 Developer Mode；Hermes 用逐行 YAML 編輯器只改 `skills.external_dirs`，遇到 tab、重複 key、跨行 flow list、錨點等無法確定解析的情況會在寫入前以行號報錯；同時偵測跨技能資料夾的同名衝突並警告。
- `#L1-L89` — `sync.mjs` — 無相依的同步腳本：`git add -A`、有變更才 commit（`brain: sync <ISO>Z`）、`pull --rebase --autostash`、push；用 `.git/brain-sync.lock` 避免 agent 與 cron 同時執行；沒有 git identity 時以 `brain sync` 身分提交；`BRAIN_SSH_KEY` 只作用於自己的 git 命令；push 失敗保留本地 commit、印出 NOT pushed、exit 1，並在 rebase 衝突時給出修復/中止提示。
- `#L1-L247` — `test/install.test.mjs` — install.mjs 的單元測試：Claude+Codex 連結與指標行、保留既有指令檔內容、Cursor 只印出待貼上的行、各平台 Cursor 設定路徑、找不到 agent 時 exit 1 且不寫入、PATH 探測、Windows EACCES 不誤判為 Developer Mode、隱藏資料夾排除、透过 symlink 抵達同一個大腦時不重複加指標行。
- `#L1-L334` — `test/hermes.test.mjs` — Hermes 整合的單元測試：官方模板 config 的插入位置、各種 `external_dirs` 形態（無 skills、block、null、`[]`、flow、單一 scalar、`skills: {}`）、CRLF/BOM 保留、路徑需加引號的情況、數十種無法安全解析的 YAML 必須丟出帶行號的錯誤、備份命名、同名技能警告、HERMES_HOME 與 Windows 預設路徑、空 SOUL.md 不覆寫；若設定 `HERMES_PYTHON` 會用 Hermes 自己的 PyYAML 回讀驗證。
- `#L1-L73` — `test/lint.test.mjs` — lint.py 的行為測試：模板本身零問題、`source: own` 在 notes/guidelines 的 frontmatter 中（含大小寫與引號）可通過、沒有來源仍失敗、`source: own` 寫在正文不算、其他 frontmatter source 值不算；沒有 Python 3 時整組跳過。
- `#L1-L209` — `test/sync.test.mjs` — sync.mjs 對本地 bare remote 的測試：無 git identity 時以身分 `brain sync` 提交、無變更不產生 commit、先 pull --rebase 再 push 且兩邊變更都保留、remote 不可達或 push 被拒時保留 commit 並 exit 1、rebase 衝突提示、鎖已被持有時拒絕執行並保留他人鎖。
- `#L1-L259` — `.github/installer-e2e.mjs` — 端到端驗證腳本：在含空白的暫存 home 中連跑兩次安裝（無 agent / 只有 Claude / 只有 Codex / 兩者）、檢查 symlink 與指標行只出現一次、以本地 bare remote 測試 sync（含拒絕 push 與衝突）、真實 Hermes 的 `skills list` 與送給模型的 system prompt 是否含指標行與技能清單、Windows 非管理員在 Developer Mode 關/開下的行為。
- `#L1-L28` — `.github/mock-model.mjs` — 127.0.0.1 上的 OpenAI 相容假模型：記錄每個請求（含 `/models` 與串流/非串流 chat completion），回覆固定文字，讓 CI 能在沒有 API key 的情況下檢查 Hermes 實際送出的 prompt。
- `#L1-L150` — `.github/workflows/installer.yml` — CI 矩陣：ubuntu/macOS/Windows 安裝真實 claude 與 codex CLI、Windows 建立非管理員使用者測 Developer Mode 開關、node:22 / node:22-alpine / ubuntu:24.04 容器測四種 agent 組合各兩次、以官方安裝器釘住 Hermes v0.21.5 並用其 venv 的 PyYAML 回讀設定、最後跑 `node --test` 與 e2e。
