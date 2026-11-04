---
source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay
source_type: codebase
source_lines: 4583
language: TypeScript
file_count: 55
part: 4
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `AGENTS.md` / `CLAUDE.md` — 這個 repo 給 coding agent 的兩條硬規則：測試只能透過公開 API 驗證行為、不能 mock 領域層；以及 mutation survivor 只能寫測試殺掉，不能自行標記 equivalent。`CLAUDE.md` 只有一行 `@AGENTS.md`，代表 Claude Code 會把同一份規則載入。學習重點是「agent 的邊界寫進 repo，而不是寫在提示詞裡」。
- `README.md` — TicketBay 是 AI Agent Engineer 課程的參考售票系統：Next.js App Router、Drizzle + Postgres、假 Stripe 支付、REST API 與 MCP server。它同時是「AI 寫的測試全綠、卻仍會 refund 已開演場次」的教材，說明 mutation score 量不到「沒被實作的需求」。
- `package.json` — 定義整個 repo 的執行面：dev/build、DB migrate/seed、`mcp:local`、unit/integration/http/ui/mutation 各條測試 lane。看懂 scripts 就等於看懂課程示範的「多層測試防線」如何被呼叫。
- `tsconfig.json`, `next.config.ts`, `drizzle.config.ts`, `postcss.config.mjs` — 編譯、Next 執行期與 Drizzle 產生 migration 的設定。`next.config.ts` 的 `agentRules: false` 與 `serverExternalPackages: ["pg"]` 是 agent 時代才有的設定細節。
- `vitest.config.ts`, `vitest.unit.config.ts`, `playwright.config.ts` — 三種測試速度層級：完整 Vitest（Testcontainers Postgres）、無 Docker 的 unit lane、只跑金流路徑的 Playwright。設定中的排除清單本身就在教你 agent worktree 與 Stryker sandbox 會如何污染測試。
- `stryker.config.json`, `stryker.integration.config.json` — mutation testing 的兩份設定：domain 走 unit lane，db/services 走 integration lane（concurrency 1，避免每個 worker 各開一個 Postgres）。註解直接說明「哪些 mutant 根本殺不到」。
- `docker-compose.yml`, `.env.example`, `.gitleaks.toml` — 本機 Postgres、假金鑰與 secret 掃描白名單。三者合起來示範「本地憑證可以進 repo，但必須明顯是假的，且被掃描器明確放行」。
- `box` — 用 devcontainer CLI 把 agent 關進沙箱的入口腳本；`./box` 開 Claude Code，`./box --docker` 額外接上只共享此 repo 的 Colima VM。它是課程「agent 有完整權限時，安全邊界放在容器而非提示詞」的實作。
- `docs/` — MCP 功能的建置決策、各家 MCP client 認證能力研究、以及以真實 `claude -p` session 錄下的端到端證明。這是把「agent 功能」當產品規格與驗收證據來寫的範例。
- `drizzle/` — 三個 migration 與對應 snapshot，涵蓋 events/orders/discount_codes、Better Auth 帳號與 API key、以及 checkout 去重與作廢刷卡。schema 的 CHECK 約束把金流不變量寫進資料庫。
- `.claude/` — 五個 tester 子代理（integration/mutation/property/ui/adversarial 由外部 skill 提供）、一個 PreToolUse 網路守門 hook，以及 debug-runbook skill。重點是「每個 critic 只做一件事、只碰自己的測試目錄」。
- `.devcontainer/` — 沙箱的 Dockerfile、compose、default-deny 防火牆、brain 同步腳本與 Docker-in-box 設定。它把「agent 能看見什麼、能連到哪裡」變成可檢視的基礎設施程式碼。
- `help/` — 顧客可見的政策頁，同時是 MCP `search_docs` 的檢索語料。政策數字必須與 `src/domain/` 一致，讓 agent 回答時有可引用的單一真相。

# L2 detail

- `#L1-L13` — `AGENTS.md` — 兩段規則。測試段要求只測 route handler 與 `src/domain`/`src/services` 的公開行為，禁止 mock 領域層，只允許 mock `lib/auth`、`src/db/client`、`src/payments` 三個接縫；重構不改變行為時不得弄壞測試。Bug 段指定回歸測試新檔位置（`tests/domain/regression-<slug>.test.ts` 或 `tests/lib/...`），並要求用不需 Docker 的 `npm run test:unit`。學習點：把「什麼算好測試」寫成 agent 可執行的判準。
- `#L1-L1` — `CLAUDE.md` — 只有 `@AGENTS.md`。說明 Claude Code 的 import 語法讓單一規則檔同時服務多個 agent 工具，避免兩份指令漂移。
- `#L1-L168` — `README.md` — 課程參考應用的全貌：技術棧、啟動指令、種子帳號、MCP 本地/遠端兩種服務方式、REST `/api/v1` 端點與錯誤碼、四種 HTTP 屬性測試、測試指令表、五個 tester agent 的分工，以及 `demo/loop-recording` 分支上「測試全綠但 refund 規則從未實作」的教學案例。金流以整數分表示、Testcontainers 跑真 Postgres、Playwright 只守關鍵金流，是三個反覆出現的設計主張。
- `#L1-L69` — `package.json` — 定義 Next 16 / React 19 / Drizzle / Better Auth / MCP SDK / Zod 4 等相依，以及所有測試與 DB 腳本。`test:unit` 不須 Docker、`test:http` 需 Postgres、`test:mutation` 與 `test:mutation:integration` 分開，直接對應課程示範的測試金字塔。
- `#L1-L21` — `tsconfig.json` — strict、`moduleResolution: bundler`、`@/*` 路徑別名，並排除 `.stryker-tmp`、`.claude/worktrees`、`reports`。後三者是 agent 與 mutation 工具產生的目錄，顯示型別檢查也要避開工具複本。
- `#L1-L17` — `next.config.ts` —  development server 才載入 `.env`，production build 只讀真實環境；`pg` 設為 `serverExternalPackages`；`agentRules: false` 讓 Next 不把 `CLAUDE.md`/`.claude` 當成自己的生成物。學習點：設定檔可以表達「這個 repo 同時是 agent 工作區」。
- `#L1-L11` — `drizzle.config.ts` — PostgreSQL dialect、schema 指向 `src/db/schema.ts`、migration 輸出到 `./drizzle`，並從 `loadLocalEnv()` 取得 `DATABASE_URL`。簡短但定義了 schema-first 的 migration 工作流。
- `#L1-L7` — `postcss.config.mjs` — 只掛 `@tailwindcss/postcss`，Tailwind 4 的最小設定。
- `#L1-L44` — `vitest.config.ts` — 匯出共用的 `@` alias 與 `exclude`；完整 lane 用 `globalSetup` 啟動一個 Testcontainers Postgres，hook timeout 拉到 60 秒。註解解釋為何排除清單要寫 `**/node_modules/**`、`.stryker-tmp`、`.claude/worktrees`、`e2e`、`.next`：工具會在 repo 內複製整個專案，讓測試重複收集。
- `#L1-L12` — `vitest.unit.config.ts` — 快速 lane，只收 `tests/domain`、`tests/payments`、`tests/lib`，重用父設定 alias 與 exclude。這也是 Stryker domain 測試所用的設定。
- `#L1-L30` — `playwright.config.ts` — 只跑 `e2e/` 的金流路徑；失敗保留截圖與 trace；`webServer` 先 build 再啟動 `e2e/support/server.ts`，用 Testcontainers 起自己的 Postgres，並以 SIGTERM 優雅關閉。示範「E2E 成本高，所以只花在會動到錢的流程」。
- `#L1-L29` — `stryker.config.json` — Vitest runner、只 mutate `src/domain/**/*.ts`、使用 unit config；忽略 `test-results`、`playwright-report`、`reports`、`coverage`、`.stryker-tmp`、`.next`、`data`，避免與並行的 Playwright 寫檔互撞。註解說明「沒有東西能在 domain 之外殺掉 domain mutant」。
- `#L1-L32` — `stryker.integration.config.json` — mutate `src/db/**/*.ts` 與 `src/services/**/*.ts`，排除 `admin-queries.ts` 讀模型與 `schema.ts`；`concurrency: 1` 因為每個 worker 都會跑 global setup、各起一個 Postgres。HTML 報告輸出到 `reports/mutation/integration.html`。
- `#L1-L23` — `docker-compose.yml` — Postgres 17、`env_file` 優先讀 `.env.example` 再讀可選的 `.env`、port 可用 `POSTGRES_PORT` 覆寫、named volume 與 `pg_isready` healthcheck。學習點：範例環境檔可直接當預設值，讓新人有可跑的起點。
- `#L1-L19` — `.env.example` — 只放本地假憑證：Postgres 帳密、`sk_test_` 假 Stripe key、Better Auth secret 與 URL。註解明說「任何正式部署都要換成隨機 secret」，示範如何把可提交的範例金鑰與真金鑰分開。
- `#L1-L18` — `.gitleaks.toml` — 繼承預設規則，只白名單三類：`sk_test_` 假支付 key、測試 fixture 的 `integration-secret-`/`adversarial-secret-`、以及記錄式 MCP session 裡的 `idempotency_key`。註解要求清單保持短、每個項目都要有理由。
- `#L1-L77` — `box` — Bash 入口：釘住 devcontainer CLI 版本、必要時啟動 Colima VM（只 mount repo 與唯讀 brain 設定）、檢查 Docker、`up` 沙箱、在 `--docker` 模式額外安裝 VM 防火牆，最後預設執行 `claude --dangerously-skip-permissions`。學習點：`--dangerously-skip-permissions` 的安全前提是容器隔離，腳本必須先建立隔離再放行權限。
- `#L1-L73` — `docs/mcp-build-plan.md` — MCP v2 的建置計畫：五個決策（訂單歸屬、refund 是否只給連結、admin gate、測試由誰寫、OAuth 是否只支援 localhost）、技術棧版本、八步建置順序、風險，以及後來砍掉 OAuth 的範圍變更。它是「先寫決策再寫程式」的規格範本。
- `#L1-L228` — `docs/mcp-client-auth-2026.md` — 2026 年各家 MCP client 的認證能力研究：Claude Code、Claude.ai/Desktop、ChatGPT、Cursor、VS Code、Hermes 是否接受 API key header、是否支援 OAuth/CIMD/DCR、能否連 localhost。附官方文件引文與「NOT VERIFIED」標記，結論是聊天應用多半只能走 OAuth，靜態 key 只覆蓋開發工具。
- `#L1-L177` — `docs/mcp-e2e-2026.md` — 用真實 `claude -p` 與 `--strict-mcp-config` 錄下的六段端到端證明：本地 stdio 找活動、`search_docs` 答退費政策、遠端 key 訂票/查訂單/退款、唯讀 key 被 403、`cancel_event` 只回連結由人類確認、撤銷 key 後 401。每段都附工具呼叫與最終回答，並指向 `docs/mcp-e2e/` 的 transcript。
- `#L1-L63` — `drizzle/0000_init.sql` — 初始 schema：`discount_codes`、`events`、`orders`。以 `bigint` 存毫秒與分，CHECK 約束保證 seats 在 0..total、價格非負、quantity > 0、refund 不超過 tickets 金額，並以 unique `idempotency_key` 防重複下單。
- `#L1-L93` — `drizzle/0001_accounts_api_keys_refund_reason.sql` — 加入 Better Auth 的 `user`/`session`/`account`/`verification`/`apikey` 表，`events.cancelled_at_ms`、`orders.user_id`、`orders.refund_reason`，以及對應 FK 與索引；最後把歷史 refunded 訂單回填為 `customer`。示範「加欄位時一併回填舊資料」。
- `#L1-L11` — `drizzle/0002_checkout_claims_and_voided_charges.sql` — 兩張小型帳務表：`checkout_claims`（以 idempotency_key 為主鍵，記錄處理中的結帳）與 `voided_charges`（記錄已作廢的刷卡）。用來處理併發結帳與補償交易。
- `#L1-L26` — `drizzle/meta/_journal.json` — Drizzle migration 日誌，列出三個 migration 的 idx、timestamp 與 tag。是 migration 工具判斷「已套用到哪一版」的依据。
- `#L1-L442` — `drizzle/meta/0000_snapshot.json` — 初始 schema 的完整快照（三個表、欄位、約束、索引），供 Drizzle 產生下一版 diff。學習點：snapshot 是 machine-readable 的 schema 歷史，不應手改。
- `#L1-L1071` — `drizzle/meta/0001_snapshot.json` — 加入 Better Auth 表與 orders/events 新欄位後的快照；`prevId` 串回上一版。可用來比對「一個 migration 實際改了哪些欄位」。
- `#L1-L1133` — `drizzle/meta/0002_snapshot.json` — 最新快照，包含 `checkout_claims` 與 `voided_charges`。三個 snapshot 的 `prevId` 鏈構成可追蹤的 schema 演進。
- `#L1-L23` — `.claude/agents/integration-tester.md` — 子代理定義：只可改 `tests/`，app code 唯讀；用 Testcontainers 對真 Postgres/訊息匯流排跑測試，mock DB 只能列為 finding、不算 coverage；Docker 不可用時必須停下而非退回 mock。
- `#L1-L78` — `.claude/agents/mutation-tester.md` — 最完整的 critic 定義：跑 Stryker、逐一解釋 survivor 代表的「測試在說的謊」、按金流影響排序、只寫能斷言商業結果的 killing test；equivalent 只能提證明給人類決定，不可自行 disable。另說明 `Object.is` 與 `-0` 的陷阱、timeout 被計為 kill 的假象，以及 mutation 無法衡量「根本不存在的功能」。
- `#L1-L23` — `.claude/agents/property-tester.md` — 用 fast-check 寫屬性測試：先把不變量寫成英文句子，再轉成 property；產生器要涵蓋 0、1、最大整數、奇數分割、1 分錢、100% 折扣；失敗時 shrink 到最小反例並回報。
- `#L1-L23` — `.claude/agents/ui-tester.md` — Playwright 子代理：只測關鍵流程、用 role/label selector、斷言使用者看得到的金額而非「頁面載入」；失敗要附截圖與 trace 並分類為真回歸、flaky selector 或環境問題。
- `#L1-L12` — `.claude/settings.json` — 註冊一個 PreToolUse hook：所有 Bash 呼叫都先經過 `guard-network.sh`。學習點：agent 的安全規則可以掛在工具層，而不是只靠模型遵守。
- `#L1-L55` — `.claude/hooks/guard-network.sh` — 以 shell 實作的網路外洩防線：缺 jq 就 fail closed；禁止 `env`/`printenv`/`export -p` 等環境 dump；`DISCORD_WEBHOOK_URL` 只能當唯一 curl 目標；curl/wget/nc 只能連本機 URL；其他含 literal URL 的指令只允許 git/gh/npm。處理 `http://localhost@evil.com` 這類 userinfo 繞過。
- `#L1-L31` — `.claude/skills/debug-runbook/SKILL.md` — debug 流程六步：先用 `help/` 判斷是 bug 還是政策、寫最小紅測試、依序看測試輸出/伺服器終端/DB、對照七大常見原因、查最近變更、做最小修正。Gotchas 說明 alias 設定錯誤不是 bug、integration/UI 需要 Docker、refund 基準是 `ticketsCents`、時間一律由外部传入。
- `#L1-L24` — `.claude/skills/debug-runbook/examples/early-bird-boundary.md` — 完整走一遍 debug runbook：回報「剛好 30 天前訂票沒有早鳥」，先確認為 bug，寫紅測試，定位到 `>` 應為 `>=`，修一行、跑 unit lane。是 boundary bug 的教學範例。
- `#L1-L15` — `.claude/skills/debug-runbook/references/not-a-bug.md` — 把客訴對應到 `help/` 頁面，並列出三個幾乎都是政策的回報：服務費不退、開演後退款為零、早鳥剛好 30 天結束。
- `#L1-L26` — `.claude/skills/debug-runbook/references/usual-causes.md` — TicketBay 七大 bug 來源：邊界比較、退款時間閘、四捨五入、折扣疊加、早鳥邊界、MCP 權限、API key 歸屬；每一項都指出規則所在的函式。
- `#L1-L14` — `.claude/skills/debug-runbook/references/where-things-live.md` — 一張對照表：哪個領域的程式在哪個目錄、對應哪種測試 lane，以及本地與遠端 MCP server 共用 `src/mcp/tools.ts`。
- `#L1-L29` — `.claude/skills/debug-runbook/scripts/db-peek.sh` — 唯讀查詢本機 dev DB 的 event 或 order；用 `default_transaction_read_only` 保證不改資料，並對卡住的 Docker daemon 做 5 秒 fail-fast。
- `#L1-L8` — `.claude/skills/debug-runbook/scripts/recent-changes.sh` — 列出近 30 天、最多 15 筆碰過指定路徑的 commit，用於回答「最近什麼改了」。
- `#L1-L18` — `.claude/skills/debug-runbook/scripts/repro.sh` — 用 unit config 跑單一 regression test，限定 `tests/domain`/`tests/lib`/`tests/payments`，輸出 RED/GREEN 並提醒「紅要紅在回報的原因，不是 import 錯誤」。
- `#L1-L86` — `.devcontainer/README.md` — 沙箱使用手冊：`./box` 與 `./box --docker` 的差異、box 內建 Postgres、第二個 clone 的 project name 衝突、Playwright MCP 版本釘選、brain volume 與 deploy key、Colima VM 只共享 repo、防火牆允許清單，以及明確列出「box 不保護什麼」。
- `#L1-L38` — `.devcontainer/devcontainer.json` — 標準 box：compose 兩服務（app + db）、非 root 的 `node` 使用者、四個 named volume（bash history、Claude 設定、node_modules、brain）、關閉 claude.ai connectors 與非必要流量、postStart 先跑防火牆再跑 brain 同步。
- `#L1-L66` — `.devcontainer/Dockerfile` — Node 22 bookworm 基底，安裝 firewall 工具、Chromium 系統庫、git-delta、docker CLI；釘選 Claude Code 2.1.284、Playwright MCP 0.0.83、Playwright 1.63 瀏覽器；sudoers 只允許 `node` 以 root 執行防火牆與 chown node_modules。
- `#L1-L131` — `.devcontainer/init-firewall.sh` — default-deny egress：從 GitHub meta 與 DNS 解析建立 GitHub/npm/Claude allowlist，備份 Docker DNS 規則，只放行本機 resolver、host 網段與 `db:5432`，丟棄 IPv6，最後自我驗證 example.com 被封、GitHub/npm/Postgres 可達。`--engine` 模式把同樣政策套到 Colima VM 的 `DOCKER-USER` 鏈。
- `#L1-L33` — `.devcontainer/brain-start.sh` — 每次啟動時 clone 或 pull 使用者的 second brain 到 box 內 volume，再用 `CLAUDE_DIR=/home/node/.claude` 跑 `install.mjs`；deploy key 只透過 `GIT_SSH_COMMAND` 使用、不寫進 git config；失敗只印一行、不阻止 box 啟動。
- `#L1-L53` — `.devcontainer/compose.yaml` — box 的兩個容器：`app` 掛載 repo 與唯讀 brain 設定、`DATABASE_URL` 指向 `db:5432`、port 只綁 `127.0.0.1`、`BETTER_AUTH_URL` 跟隨 `BOX_PORT`；`db` 是獨立 Postgres 17，不發佈到 host，避免與 `npm run db:up` 衝突。
- `#L1-L39` — `.devcontainer/docker/devcontainer.json` — `./box --docker` 專用：疊加 `docker/compose.yaml`、`initializeCommand` 先跑 `check-engine.sh` 拒絕非 Colima 引擎，其餘 volume 與環境變數與標準 box 一致。註解要求兩份 devcontainer.json 保持同步。
- `#L1-L26` — `.devcontainer/docker/compose.yaml` — 只做三件事：build 用 host network、掛入 VM 的 Docker socket、加入 VM docker group；固定 `10.217.0.0/24` 子網並設 `TESTCONTAINERS_HOST_OVERRIDE`，讓 Testcontainers 能從 box 連到它啟的容器。
- `#L1-L26` — `.devcontainer/docker/check-engine.sh` — 啟動前驗證：Docker engine 名稱必須是 `colima-*`，且 VM 共享的資料夾只能有 repo 與唯讀 brain 設定；否則拒絕啟動，因為 socket 等於把 engine 能看到的一切交給 box。
- `#L1-L6` — `help/README.md` — 說明 `help/` 是顧客政策頁，`search_docs` MCP 工具會檢索這些檔案；`##` 標題切成回傳段落；數字必須與 `src/domain/` 同步。
- `#L1-L13` — `help/booking-and-fees.md` — 服務費 3%、最低 €1、最高 €20、以折扣後票價計算且不退；價格含 27% VAT；訂票需要帳號。是 agent 回答費用問題的權威來源。
- `#L1-L18` — `help/early-bird-and-discounts.md` — 早鳥「至少 30 天前」10% off、團體 5–9 張 5%、10 張以上 10%、折扣碼不分大小寫、折扣相加且上限 100%、服務費以折扣後金額計算。條文直接對應 `earlyBirdApplies` 與 `buildInvoice` 的邊界。
- `#L1-L34` — `help/refund-policy.md` — 退款規則：開演前可退、退票價扣除 2%（最低 €0.50）退款費、服務費不退、座位回到販售；早鳥票以實際支付價退款、折扣不追回也不加回；開演後退零；主辦取消則全額退票價、不收退款費。三個範例可直接當測試 oracle。
- `#L1-L16` — `help/ai-agents-and-api-keys.md` — 顧客版 agent 說明：到 Settings → Developers 建立 `tb_` key、以 `Authorization: Bearer` 提供給 agent；唯讀 key 可看訂單但不可訂票/退款；撤銷後 agent 立即失效、rotate 保留名稱與 scope。
