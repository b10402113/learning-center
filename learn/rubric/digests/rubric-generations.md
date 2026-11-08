---
source: sources/rubric/20261108/supplement/rubric-generations
source_type: codebase
source_lines: 1812
language: Markdown
file_count: 13
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **server（`server.js`）** — 零依賴 Node ESM HTTP 伺服器，綁在 `127.0.0.1:5050`。提供五組 `/api` 端點（列表、星號、刪除、refs 上傳、styles/models）與 `generations/` 靜態檔。關鍵概念：整個 gallery 只是「資料夾 + JSON 檔」的投影，伺服器本身不呼叫任何模型 API，金鑰只給 agent 的 skill recipe 使用。
- **UI（`index.html`）** — 單檔黑底 dashboard：masonry grid（2–6 欄）、All/Images/Videos/References 篩選、去抖搜尋、新舊排序、星號、下載、刪除、拖放上傳、影片 hover 播放與 Load More。設計重點是 UI 完全由 API 資料驅動，Styles/Models 面板不需改 HTML。
- **skill（`skill/SKILL.md`）** — 給 agent 的媒體生成流程手冊：讀 model recipe、必要時把參考圖 base64、呼叫 API、把結果存進 `generations/`，gallery 便自動出現。另含檔名慣例、新增 style/model 的步驟，以及評估 aggregator 的準則。
- **model registry（`data/generation-models.json`）** — 5 個模型的 UI 級規格：`id/name/type/provider/docs/aspect/resolution/mode/duration/features`。Models panel 由此檔自動渲染，參數順序固定為 aspect → resolution → mode → duration，`n/a` 表示不適用。
- **data（styles 與 starred）** — `generation-styles.json` 收錄 8 組視覺風格，每組有 `id/name/description/image/prompt`，prompt 是可直接貼上的完整提示詞；`generation-starred.json` 僅是一個檔名陣列，伺服器靠它把星號項目置頂。
- **example generations（`generations/`）** — 實際產出物：根目錄的生成檔、`refs/` 參考圖、`styles/` 風格預覽。檔名慣例為 `{project}_{variant}_{attempt}_{timestamp}.{ext}`，影片再加模型前綴（`kling3_`、`veo_`）。

# L2 detail

- `#L1-L271` — `README.md` — 寫給 AI agent 的安裝契約：安裝前掃描、與 RUBRIC Scaffold 的整合或 standalone 模式、三家 provider 的金鑰矩陣、`/api` 端點與查詢參數表、環境變數、安全模型（loopback、無 CORS、可選 `RUBRIC_TOKEN`、1MB 上限、路徑穿越防護）、資料夾結構。是理解整個模板的入口文件。
- `#L1-L14` — `package.json` — 套件 metadata：`type: module`、`main: server.js`、`start: node server.js`、Node >= 18、零 dependencies。示範「單檔伺服器 + 原生 ESM」的最小執行環境。
- `#L1-L27` — `server.js` — 啟動設定：Node 18 版本檢查、`PORT` 與 `GEN_DIR` 解析、手寫 `.env` 載入器（不靠 dotenv）。學到零依賴也能有 12-factor 式設定。
- `#L29-L52` — `server.js` — MIME 對照表、`json()` 回應 helper、`safePath()` 路徑穿越防護，以及 `MAX_BODY` 1MB 上限常數。
- `#L55-L127` — `server.js` — `GET /api/generations`：掃描 `generations/` 與 `refs/`、以副檔名判定 image/video 與 gen/ref、合併 starred 狀態、套用 `type/media/q/starred` 篩選、星號優先再依 mtime 排序，最後分頁回傳 `{items,total,page,limit,hasMore}`。
- `#L129-L172` — `server.js` — `POST /api/generations/star` 與 `/delete`：星號把檔名寫回 JSON 陣列；刪除先把路徑 resolve，再驗證必須落在 `GEN_DIR` 內，否則 403。是「使用者輸入永遠不能直接當路徑」的範例。
- `#L174-L213` — `server.js` — `POST /api/generations/refs`：手寫 multipart/form-data 解析、清洗檔名、寫入 `refs/`。展示不裝套件也能處理檔案上傳，但邊界情況需自行負責。
- `#L215-L229` — `server.js` — `GET /api/generation-styles` 與 `/api/generation-models`：直接讀 `data/` 的 JSON 回傳，缺檔時回空陣列。UI 的資料驅動設計靠這兩個端點成立。
- `#L231-L289` — `server.js` — 靜態檔路由（`styles/`、`refs/`、`generations/`，皆帶 1 小時 cache）與 `/` 回傳 `index.html`；`server.listen(PORT, '127.0.0.1')` 只綁 loopback，啟動時印出資料夾與 styles/models 載入狀態。
- `#L9-L49` — `index.html` — 設計 token（黑底、`#ff6b1a` accent）與 gallery CSS：masonry grid、ref/gen badge、星號、下載/刪除按鈕、複製提示，以及 900px/500px 的 responsive 斷點。
- `#L51-L143` — `index.html` — 版面骨架：品牌區、sticky header（搜尋、篩選、星號、排序、2–6 欄選擇）、可收合的 Styles 與 Models 面板、gallery、empty state 與 Load More。
- `#L145-L159` — `index.html` — `fetch` 包裝：當瀏覽器設定 `window.RUBRIC_TOKEN` 時，自動為所有 `/api/` 請求加上 `x-rubric-token`。前端與後端的選用驗證在此閉環。
- `#L195-L217` — `index.html` — `loadStyles()`：抓取風格清單、渲染卡片，點擊即複製 `styles/{image}` 路徑，供貼進對話或生成請求。把「風格」做成可引用的資產而非抽象設定。
- `#L219-L277` — `index.html` — `loadModels()` 與 `renderCard`/`renderSection`：依 video/image 分兩區渲染，固定顯示 aspect/resolution/mode/duration 與 features，`n/a` 淡化處理，並連到 provider docs。
- `#L279-L434` — `index.html` — gallery 狀態與渲染：`allFiles/currentFilter/currentCols/genPage/currentSearch/currentSort/showStarredOnly`、`renderGrid()`（影片 hover 播放、badge、star/delete/download、點擊複製絕對路徑）、`buildApiUrl()`、`loadGenerations()`、`window._genLoadMore()`。
- `#L436-L524` — `index.html` — 控制列事件：篩選、欄數、300ms 去抖搜尋、排序切換、starred-only，以及整個版面的 drag-and-drop 上傳 overlay（只收圖片副檔名），最後初始化 styles/models/generations。
- `#L1-L215` — `skill/SKILL.md` — agent 用的生成 skill：模型速查表、金鑰位置、輸出路徑與檔名慣例、圖片/影片/參考圖流程、循序執行避免 rate limit、Dashboard 三區說明、新增 style/model 的四步驟、aggregator 評估與 prompt 技巧。
- `#L1-L67` — `skill/models/nano-banana-2.md` — 預設圖片模型（Google，同步）。`generateContent` 請求中參考圖以 `inlineData` 放在 text prompt 之前，回應從 `candidates[0].content.parts` 取 `inlineData`；`imageSize` 的 `K` 要大寫，一次只回一張。
- `#L1-L49` — `skill/models/nano-banana-pro.md` — 高品質圖片模型（Kie AI），請求結構與 NB2 相同，差別在 aspect（9:16/16:9/1:1）與解析度（1K/2K/4K）。可作為「同介面、換供應商」的對照。
- `#L1-L75` — `skill/models/gpt-image-1.5.md` — 非同步圖片模型：`createTask` 取得 `taskId`，輪詢 `recordInfo` 至 `success/fail`，再解析 `resultJson` 的 `resultUrls` 下載。無參考圖支援，prompt 上限 3000 字元。
- `#L1-L96` — `skill/models/kling-3.0.md` — 預設影片模型（Kie AI，非同步）：required 欄位、`std/pro`、3–15 秒、多鏡頭與聲音；image-to-video 的 `image_urls` 必須是公開 URL，範例用 litterbox 暫時託管，且產出的 `tempfile` URL 會過期需立即下載。
- `#L1-L75` — `skill/models/veo-3.1.md` — Google 影片模型：`predictLongRunning` 啟動後輪詢 operation 到 `done`，從 `generatedSamples[0].video.uri` 取得連結，下載需 `curl -L` 跟隨 302。示範「長時任務 + operation 輪詢」的另一種協定。
- `#L1-L76` — `data/generation-models.json` — 5 個模型的註冊表，每個含 type/provider/docs/四項參數與 `{label,detail}` features。Models panel 的唯一資料來源，也是 agent 挑模型時的機器可讀清單。
- `#L1-L58` — `data/generation-styles.json` — 8 組視覺風格（pixel 8/32/64、3D、liquid glass、isometric、paper craft、claymation），每組的 `prompt` 包含色彩限制與 negative guidance。示範「把風格寫成可重複使用的完整提示詞」。
- `#L1-L1` — `data/generation-starred.json` — 星號清單，初始為空陣列 `[]`；伺服器讀寫這個檔案來實作「星號置頂」。說明持久化可以只是一個極小的 JSON。
