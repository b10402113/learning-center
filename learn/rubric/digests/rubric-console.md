---
source: sources/rubric/20261108/supplement/rubric-console
source_type: codebase
source_lines: 10677
language: Markdown
file_count: 68
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **scaffold（基礎外殼）** — 一個 Node.js server、一個 port（5050）、一個 `index.html`；啟動時掃描同層 template 資料夾，把已安裝的模板併成原生 tab。可帶走的原則是「一個 shell + 可插拔視圖」：核心只負責導航、agent 狀態、搜尋與偏好，其餘能力由資料夾是否存在決定是否出現。
- **agents** — 把每個 agent 變成一張卡片：pixel icon、狀態點、任務文字，前端定期輪詢 `POST /api/agent-status`。設計重點是狀態機（active / waiting / recent / idle）由伺服器統一推算，前端只負責呈現。
- **team** — 用 org chart 表達「lead + sub-agents」：角色、職責、skill 標籤與可展開的 skill 清單；skill 由檔案系統（`.claude/skills/`）掃描而得，不是使用者手動填寫。
- **crons** — 唯讀的週曆：讀取多個 cron registry 檔、解析五欄 cron 表達式，畫出 7 天 grid、Next Up 與分類顏色。設計原則是 registry 檔才是真相來源，session 內的排程只是暫時投射。
- **flows** — 把 agent 的 skill 序列畫成 pipeline，支援 demo 播放與 WebSocket 即時事件；資料在 `data/workflows.json`，每個 step 可連到一份 `SKILL.md`。學到的是「視覺化層與執行層解耦」。
- **skill-trees** — force-directed 圖：agent 是大節點、skill 是小點，邊代表誰擁有哪個 skill；跨平台自動偵測 Claude Code / OpenClaw / Antigravity 的 skills 目錄。設計重點是 auto-detect 加上 config override。
- **icons** — 內建 50 個 8×7 mirrored pixel icon 的圖庫，供 `config.json` 的 `icon` 欄位使用；把視覺資產也當成可瀏覽、可點擊複製的資料，而不是散落在程式碼裡的字串。

# L2 detail

- `#L1-L88` — `README.md` — 專案總覽與給 AI agent 的安裝契約：scaffold 是必要基礎、其他 template 是 add-on；server 會自動偵測同層資料夾，複製資料夾即可出現 tab。另含安全模型（只綁 127.0.0.1、無 CORS、可選 `RUBRIC_TOKEN`、1MB 上限、唯讀掃描）、模板對照表與平台支援。
- `#L1-L235` — `templates/scaffold/README.md` — 基礎 console 的完整安裝指南：Intent Guide、統一架構、安裝前掃描、Quick Start、`config.json` 欄位、agent 狀態 hook、各模板設定、API 端點與環境變數。是整個 repo 的「agent 操作手冊」主文件。
- `#L1-L53` — `templates/scaffold/.claude/skills/scaffold/SKILL.md` — 給 agent 的 scaffold 設定 skill：用 `config.json` 定義 agent、在 `settings.json` 加 session start/end hook、說明模板以原生 tab 運作、用 Icons tab 選 icon、啟動 server。
- `#L1-L23` — `templates/scaffold/config.json` — 最小設定範例：`brandName` 與三個 agent（`id`、`name`、`color`、`icon`）。展示設定檔就是整個 dashboard 的資料來源。
- `#L1-L762` — `templates/scaffold/server.js` — 統一伺服器。重點區段：Node 版本檢查與 template 偵測（L12-L48）、skill-tree 掃描邏輯（L61-L249）、team / crons / flows 的資料載入（L251-L355）、config 與 pixel icon 解析（L357-L379）、body 大小上限（L386-L405）、agent 狀態與 prefs 檔（L407-L426）、HTTP 路由（L428-L695）、WebSocket 即時事件與 127.0.0.1 綁定（L697-L762）。
- `#L1-L363` — `templates/scaffold/index.html` — head 與全部 CSS：設計 token（黑底、`#50e3c2` accent、Outfit/JetBrains Mono）、sidebar、狀態點、搜尋、各 tab 的版面與 responsive 規則。
- `#L365-L564` — `templates/scaffold/index.html` — body 結構：選擇性 `RUBRIC_TOKEN` 的 fetch 包裝、可收合 sidebar、agent 狀態面板、全域搜尋、Welcome / Agents / Flows / Skill Trees / Crons / Team / Icons 七個 tab panel。
- `#L566-L907` — `templates/scaffold/index.html` — scaffold 核心 JS：pixel icon 繪製、`init()`、agent 狀態輪詢、tab 啟用與 drag-to-reorder（含分隔線、首頁設定、localStorage 排序）、全域搜尋索引。
- `#L908-L1024` — `templates/scaffold/index.html` — Agents tab：SVG pixel icon（靜態與 hopping 動畫）、卡片 grid 渲染、輪詢與 demo tick。
- `#L1025-L1487` — `templates/scaffold/index.html` — Flows tab：canvas 節點物理、pipeline / scattered 兩種視圖、demo 播放、hover tooltip、detail panel、markdown 檢視與 WebSocket 客戶端。
- `#L1488-L1669` — `templates/scaffold/index.html` — Skill Trees tab：force-directed canvas、節點半徑依 SKILL.md 大小縮放、pan/zoom、tooltip 與 detail panel。
- `#L1670-L1847` — `templates/scaffold/index.html` — Crons tab：`parseCronExpr` 與欄位展開、分類顏色、7 天週曆、Next Up / All Active / Monthly 清單與自動刷新。
- `#L1848-L1909` — `templates/scaffold/index.html` — Team tab：mission quote、lead 卡片、connector label、sub-agent grid 與 skill 掃描結果渲染。
- `#L1910-L2013` — `templates/scaffold/index.html` — Icons tab：把 50 個 pixel icon 做成可點擊複製名稱的圖庫，並提供 hopping 預覽。
- `#L1-L180` — `templates/scaffold/icons.html` — 獨立 icon 圖庫頁：50 個 icon 的 pixel map 陣列、`makeHopSvg`、toast 與 clipboard 複製。可直接在瀏覽器開啟挑 icon。
- `#L1-L14` — `templates/scaffold/package.json` — 套件 metadata：`type: module`、`start: node server.js`、Node >= 18、無 dependencies；說明 scaffold 刻意保持零依賴（`ws` 為選用）。
- `#L1-L199` — `templates/agents/README.md` — Agents 模板的 agent-facing 指南：Intent Guide、四種狀態、以 curl 回報狀態、Claude Code hook、Install Prompt、設定欄位、icon 庫與 API。
- `#L1-L72` — `templates/agents/.claude/skills/agents/SKILL.md` — 給 agent 的 agents 設定 skill：mirror scaffold 的 agent id、設定 hook、四狀態對照、手動 curl、demo mode。
- `#L1-L26` — `templates/agents/config.json` — 三個 placeholder agent（Alpha / Beta / Gamma）與 role；提醒安裝時必須換成使用者真正的 agent。
- `#L1-L196` — `templates/agents/server.js` — 零依賴 standalone server：config 載入、icon library、in-memory agent status 與 5 分鐘 recent 判定、`/api/agent-status` 與 `/api/config`。
- `#L1-L334` — `templates/agents/index.html` — Agents 卡片式 UI：狀態 dot、pixel icon、task label、demo 切換與輪詢；可獨立運行或併入 scaffold。
- `#L1-L189` — `templates/team/README.md` — Team 模板指南：lead + agents 的 org chart、skill scanning 規則（shared `.claude/skills/` 加 per-agent）、設定欄位與 API。
- `#L1-L69` — `templates/team/.claude/skills/team/SKILL.md` — 給 agent 的 team 設定 skill：定義 lead、sub-agents、mission、`skillsRoot` / `serverLabel`，並要求與 scaffold 的 agent 身分一致。
- `#L1-L36` — `templates/team/config.json` — team 設定範例：mission、server label、lead 與兩個 sub-agents 的 role/description/skills/icon/color。
- `#L1-L106` — `templates/team/server.js` — 零依賴 team server：讀 `config.json`、遞迴掃描 `SKILL.md` 目錄、shared + agent-specific skill 合併、`/api/team` 與 `/api/team/skills`。
- `#L1-L264` — `templates/team/index.html` — Team org chart UI：mission quote、lead card、connector line、sub-agent grid 與可展開 skill 清單。
- `#L1-L228` — `templates/crons/README.md` — Crons 模板指南：週曆視圖、Claude Code session-only cron 的運作方式、registry 格式、`cronPaths` 多檔合併、cron 語法與分類顏色。
- `#L1-L77` — `templates/crons/.claude/skills/crons/SKILL.md` — 給 agent 的 crons 設定 skill：`cronPaths`、registry 必要欄位、五欄 cron 語法與範例。
- `#L1-L5` — `templates/crons/config.json` — 最小 crons 設定：`brandName`、`cronPaths`、`timezone: auto`。
- `#L1-L47` — `templates/crons/data/crons.json` — 範例 registry：七個 cron（每日 sync、週報、每小時健康檢查、工作日 standup、晚間 review、內容掃描、停用的備份檢查），示範 `crons` wrapper 與 `enabled` 旗標。
- `#L1-L149` — `templates/crons/server.js` — 唯讀 cron server：讀取多個 registry 檔、支援 array / `jobs` / `crons` 三種格式與 `cron` / `schedule` 兩種欄位，正規化後回傳 `/api/crons`。
- `#L1-L588` — `templates/crons/index.html` — 週曆 UI 與前端 cron parser：`categorize`、`expandField`、`parseCronExpr`、`formatTime`、7 天 grid、Next Up、All Active、Monthly 與每 30 秒刷新。
- `#L1-L194` — `templates/flows/README.md` — Flows 模板指南：把 agent + skills 表示成 pipeline、workflow JSON schema、`SKILL.md` 目錄結構、icon 類型、demo 與 WebSocket 事件、合併進 Console 的步驟。
- `#L1-L75` — `templates/flows/.claude/skills/flows/SKILL.md` — 給 agent 的 flows 設定 skill：建立 workflow、為每個 step 寫 `SKILL.md`、用 HTTP POST 回報 `workflow:start` / `step:*` / `workflow:complete`。
- `#L1-L43` — `templates/flows/data/workflows.json` — 範例 workflow「Market Research Brief」：agent metadata、inline SVG icon、四個 skills（pick-niche、find-competitors、analyze-positioning、write-report）與各自的 `skillPath`。
- `#L1-L252` — `templates/flows/server.js` — 具 WebSocket 的 flows server：`ws`、workflow 讀寫、`/api/workflows`、`/api/workflow-events`、`/api/workflow-state`、安全檢查的 `skill-content` 讀檔、事件廣播與 late-join sync。
- `#L1-L1499` — `templates/flows/index.html` — Flows 前端：workflow sidebar、canvas 節點圖、物理模擬、pipeline 播放、icon 繪製、markdown 檢視與 WebSocket 即時狀態。
- `#L1-L16` — `templates/flows/workflows/market-research-brief/workflow.md` — 範例 workflow 文件：四步研究流程的 overview、input 與 output，示範 workflow 與 skill 文件如何分層。
- `#L1-L12` — `templates/flows/workflows/market-research-brief/agent.md` — 範例 agent 文件：Research Agent 的能力與使用方式，會被 Flows 的 info box 讀取。
- `#L1-L16` — `templates/flows/workflows/market-research-brief/skills/pick-niche/SKILL.md` — 單一步驟 skill 的標準寫法：Purpose / Input / Process / Output，讓 agent 執行時有明確 contract。
- `#L1-L201` — `templates/skill-trees/README.md` — Skill Trees 模板指南：force-directed graph、平台自動偵測表、`config.json`、`SKILL_TREE_ROOT` / `PLATFORM`、API 與合併進 Console 的步驟。
- `#L1-L74` — `templates/skill-trees/.claude/skills/skill-tree/SKILL.md` — 給 agent 的 skill-tree 設定 skill：設定 workspace root、平台 auto-detection、icon 與 pixel art、覆寫名稱/顏色、doc paths。
- `#L1-L26` — `templates/skill-trees/data/example-config.json` — skill-tree 設定範例：兩個 agent 的 workspace、`skillDirs` 與 `docPaths`（CLAUDE.md / SOUL.md）。
- `#L1-L480` — `templates/skill-trees/server.js` — 掃描與圖資料 server：`PLATFORM` 與 `SKILL_TREE_ROOT`、config 讀寫、`safePath`、`detectSkillDirs`、`detectAgentWorkspaces`、`buildSkillTree`、`getAllSkillDirs` 與 API 路由。
- `#L1-L744` — `templates/skill-trees/index.html` — 前端 force-directed 圖：canvas 物理、節點縮放、pan/zoom、tooltip、SKILL.md / CLAUDE.md / SOUL.md 的 detail panel 與 markdown 渲染。
- `#L1-L16` — `templates/skill-trees/example-workspace/agents/alpha/CLAUDE.md` — 範例 agent 的 `CLAUDE.md`：Identity（Name / Role）、工作方式、skills 位置與規則；展示 scanner 如何抽 agent 名稱與角色。
- `#L1-L5` — `templates/skill-trees/example-workspace/agents/alpha/SOUL.md` — 範例 agent 的 `SOUL.md`：人格與語氣，示範「身分文件」與「技能文件」分離的設計。
- `#L1-L13` — `templates/skill-trees/example-workspace/agents/alpha/.claude/skills/web-research/SKILL.md` — 範例 per-agent skill：YAML frontmatter（name / description）加簡短指示，是 scanner 解析的最小單位。
- `#L1-L15` — `templates/skill-trees/example-workspace/.claude/skills/daily-planning/SKILL.md` — 範例 shared skill：放在 workspace 根層、所有 agent 共用，示範 shared 與 per-agent skill 的差別。
