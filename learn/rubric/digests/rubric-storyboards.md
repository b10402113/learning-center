---
source: sources/rubric/20261108/supplement/rubric-storyboards
source_type: codebase
source_lines: 4548
language: JavaScript
file_count: 17
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **server（`server.mjs`）**：本機 HTTP 應用與狀態核心，把 `projects/<id>/` 內的 `project.json`、`comments.json`、`board/` 當成唯一資料來源。提供 board 讀取、pitch 時間拖曳、留言 CRUD、wireframe/final/export 工作啟動與取消。所有耗時工作都轉成 job 狀態寫回專案，前端靠輪詢顯示進度。
- **agent 與 prompts（`agent.mjs`、`prompts.mjs`）**：`AGENT_CMD` 是唯一的外部代理入口，prompt 由 stdin 送入，在暫存空資料夾執行。`agent.mjs` 負責組命令、過濾環境變數、抓取 JSON storyboard、解析成本與工具進度；`prompts.mjs` 定義 wireframe schema 與 final 的 `window.__reel` 契約。
- **player（`player.js`）**：把 step 1 的 JSON storyboard 畫成灰盒 animatic 的 canvas 播放器。`draw(t)` 是時間的純函式，支援 camera、transition、element enter/exit/move，因此播放、拖曳與截圖結果一致；這是「先看節奏，再做美術」的視覺化引擎。
- **pitch maker（`make-pitch.mjs`）**：把一份 spec 加一資料夾劇照變成 `kind: "board"` 專案。它複製圖片、依序串接鏡頭時間、寫入 caption 與 bullets，並用穩定 shot `id` 讓重跑後留言仍黏在原鏡頭上；`--reset-times` 才會放棄手動拖曳的時間。
- **video import（`import-video.mjs`）**：用 ffmpeg/ffprobe 把完成的 MP4 拆成一鏡一張劇照，寫入 `kind: "video"` 專案與 `video` 中繼資料。重跑只更新時間與劇照，既有留言保留，是把「已拍完的片」拉回同一套評論介面的入口。
- **MCP generator（`gen-mcp.mjs`）**：final 階段可選的 stdio MCP server，提供 `generate_image` 工具。它用 fal.ai 的 GPT Image 2.5 生圖，任何人為花費都先比對 ledger 與硬預算，通過才送出；金鑰只從 `env.local` 讀取，圖片存回該次執行資料夾。
- **export（`export.py`）**：把 final 的 `index.html` 逐格 seek 後截圖，管線送進 ffmpeg 編成 MP4，再透過 `__reel.audio()` 離線算整條音軌並 mux。這是「網頁即時序」變成可交付影片的最後一哩。
- **skill（`skills/rubric-storyboards/SKILL.md`）**：給代理讀的操作契約，說明 `project.json` 與 `comments.json` 的欄位、哪些留言是 `open`、如何依鏡頭分組、如何把處理完的留言標成 `applied`。它把「人類在畫面上留言」接到「代理修改來源」。
- **sample（`examples/sample-pitch/` 與 `projects/sample-pitch/`）**：一組可跑的 Harbor Cold Brew 範例，示範 HTML 分鏡 `frames.html` → Playwright 截圖 → `pitch.json` → `make-pitch.mjs` 的完整鏈路，以及 board 留言與整體留言的資料長相。

# L2 detail

- `#L1-L216` — `README.md` — 使用者手冊：board 操作、留言交付代理、pitch 製作、影片匯入、wireframe/final 兩階段、MP4 匯出、`env.local` 設定與安全模型；適合先建立整體心智模型。
- `#L1-L50` — `skills/rubric-storyboards/SKILL.md` — 代理用 skill：`project.json` 的 `kind`/`board` 欄位、留言 target 與 status、處理 open 留言的步驟，以及用 API 或直接改檔標記 `applied`。
- `#L1-L69` — `config.mjs` — 設定載入：`HERE`、`VERSION`、`CONFIG`（port、projectsDir、workDir、agentCmd、models、timeout、envUnset、dryRun、python、token、imageTool、falKey）；重點是每個代理執行都在系統暫存資料夾的獨立工作區。
- `#L164-L665` — `server.mjs` — 應用核心：`runAgent` 生命週期、`startWireframe`/`startFinal`/`startExport`、storyboard `normalize`、pitch `retime`、host/origin/token 檢查與所有 `/api` 路由；理解 job 狀態與留言如何落地看這裡。
- `#L1-L234` — `agent.mjs` — 無頭代理執行：`EFFORTS`、`splitCommand`、`buildArgv`（`{model}`/`{effort}`/`{step}`/`{mcp_config}` 填空與空值連旗標移除）、`agentStatus`、`imageToolStatus`、`prepareRun`、`spawnAgent`、`stopTree`、`extractStoryboard`、`resultMeta`、`readProgressLine`。
- `#L1-L143` — `prompts.mjs` — 兩階段提示：`VOCAB`、`WIREFRAME_SCHEMA`、`WIREFRAME_SYSTEM`、`wireframePrompt`、`describeComment`、`finalPrompt`；final prompt 明確要求純時間函式、`seek(t)`、`audio(sampleRate)` 與 60fps。
- `#L59-L486` — `player.js` — `WireframePlayer`：`load`、`draw(t)`、`sceneIndex`、`camera`、`background`、`element`、`kind`（text/shape/image/ui/chart/particles/3d/line/grid）、轉場與 overlay；展示「storyboard 欄位如何變成動態畫面」。
- `#L524-L1759` — `app.html` — 前端應用：API client、board 卡片與大圖、pinned/overall 留言、Copy comments、timeline 拖曳與 undo/redo、wireframe/final 版本切換、New video 與 Make/Revise/Export 對話框。
- `#L1-L101` — `make-pitch.mjs` — pitch 產生器：spec 驗證、shot id 去重、`board/<nn>-<slug>` 複製、時間 back-to-back、`t` 夾在鏡頭內、保留舊拖曳時間、寫 `project.json` 與空 `comments.json`。
- `#L1-L95` — `import-video.mjs` — 影片匯入：ffmpeg/ffprobe 檢查、複製 `video.mp4`、讀 duration/尺寸/fps/音訊、逐鏡截圖、`kind: "video"` 專案與 `import.json` 冪等重跑。
- `#L1-L208` — `gen-mcp.mjs` — 可選圖片工具：MCP `initialize`/`tools/list`/`tools/call`、`generate_image` schema、fal 價格表估算、ledger 與 `GEN_BUDGET_USD` 上限、上傳參考圖、將 PNG 存到 `generated/`。
- `#L1-L102` — `export.py` — MP4 匯出：Playwright 開頁、等 `window.__reel`、逐格 `seek` 截圖進 ffmpeg、`AUDIO_JS` 取離線音軌、WAV 封裝與 AAC mux；無音訊時仍輸出畫面。
- `#L1-L63` — `examples/sample-pitch/pitch.json` — pitch spec 範例：`id`、`title`、`aspect`、`request`（treatment）、`briefBullets`、四個 shots 的 `image`/`length`/`t`/`caption`/`animate`/`bullets`。
- `#L1-L36` — `examples/sample-pitch/render.py` — 劇照產生範例：Playwright 開 `frames.html`、呼叫 `show(n)`、逐鏡截圖成 `frames/01.jpg`…；示範「HTML mock-up → stills → pitch」。
- `#L1-L161` — `projects/sample-pitch/project.json` — 實際 board 專案：`kind: "board"`、`duration`、`aspect`、`board[]` 的 `id`/`file`/`t`/`start`/`end`/`title`/`caption`/`animate`/`bullets`，以及 `wireframes`/`finals`/`job` 狀態欄位。
- `#L1-L27` — `projects/sample-pitch/comments.json` — 留言資料範例：board pin（`target: "board"`、`panel`、`x`/`y`、`status: "open"`）與整體留言（`target: "video"`、`t`/`x`/`y` 全 null），是代理交接時最該先讀的格式。
