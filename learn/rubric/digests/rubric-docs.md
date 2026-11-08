---
source: sources/rubric/20261108/supplement/rubric-docs
source_type: codebase
source_lines: 2507
language: JSON
file_count: 9
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **Server (server.js)**：零依賴的 Node `http` 伺服器，只綁 `127.0.0.1`。用單一 `POST /api/docs` 加 `_action` 分派檔案操作（tree/list/read/write/create/mkdir/rename/delete），另有 `/api/doc-comments` CRUD 與給 agent 的純文字 `summary` 端點；所有路徑都經 `safePath` 防穿越，選配 `RUBRIC_TOKEN`。
- **Integration (integrate.js + manifest.json)**：冪等的 scaffold 修補器。掃描同層含 `manifest.json` 的樣板、以子行程啟動其 `server.js`、用反向代理掛進 scaffold 主埠，並把樣板 HTML 注入成原生 tab（不用 iframe）。修補以版本化 marker 偵測，重跑安全且會留 `.bak`。
- **UI (index.html)**：單檔深色主題 SPA。左側檔案樹／搜尋／右鍵選單、`marked` 渲染 Markdown、contentEditable 富文本編輯加 `html2md` 回寫、格狀瀏覽，以及以選取文字為錨點的留言 highlight、popover 與 tooltip（resolve/reopen/edit/delete）。
- **Docs content (README.md + docs/Getting Started.md)**：README 是寫給 agent 的安裝與操作手冊（Intent Guide、API 合約、安全模型）；Getting Started 是預置範例文件，示範「選取文字 → 留言 → agent 讀 summary」的閉環。
- **Config (config.json + package.json)**：`brandName` 顯示於頁首、`docsRoot` 決定文件根目錄；`package.json` 僅有 `start: node server.js`，無任何 npm 依賴。
- **Manifest (manifest.json)**：scaffold 的外部樣板契約，宣告 `name`、`label`、`port`、`apiPrefixes`、`panelSelector`、`stripSelectors`，讓 Docs 成為 scaffold 的原生分頁。

# L2 detail

- `#L1-L331` — `README.md` — 完整的 agent 導向文件：Intent Guide（先掃描環境再建議安裝方式）、Install Prompt、Scaffold 整合說明與 manifest 欄位表、`/api/docs` 動作表與 curl 範例、留言端點與 `summary` 純文字格式、環境變數與安全模型。學習重點是「文件即人機介面」與留言迴圈。
- `#L1-L33` — `docs/Getting Started.md` — 預置的示範文件，列出瀏覽／編輯／搜尋／留言能力，並以 `curl .../api/doc-comments/summary?path=Getting%20Started.md` 示範 agent 如何取回留言（此處寫 5060，與預設 5050 不同，可作為設定練習）。
- `#L1-L395` — `server.js` — 伺服器進入點，無 export。關鍵：`.env` 手寫解析（L5-L19）、`DOCS_ROOT`/`COMMENTS_DIR`/`TRASH_DIR` 初始化（L32-L39）、1MB body 上限 `readBody`（L58-L76）、留言檔名以 `--` 攤平路徑（L80-L93）、`safePath` 防穿越（L97-L102）、token 檢查（L112-L118）、`summary` 純文字輸出（L143-L161）、留言 POST/PUT/DELETE（L171-L232）、`/api/docs` 各 `_action`（L253-L379）。學習重點是單一動作分派與 localhost 信任邊界。
- `#L1-L431` — `integrate.js` — ESM 修補腳本。`PATCH_VERSION`（L42）、`SERVER_TOP_PATCH` 掃 manifest／spawn 子行程／`__extProxy`（L44-L114）、請求處理器內的代理與 `/api/external`（L119-L147）、前端 `loadExternalTemplates` 與 `scopeCss`（L152-L311）、`removeOldPatchBlock` 版本替換（L318-L346）、`patchFile` 備份與錨點插入（L348-L398）。學習重點是冪等修補、marker 版本管理與無 iframe 的 CSS 隔離。
- `#L1-L1217` — `index.html` — 單檔前端。樣式與設計 token（L9-L242）、DOM 骨架（L244-L323）、`marked` 載入與 fetch token 包裝（L325-L340）、`md2html` 與樹狀渲染（L349-L421）、搜尋（L423-L486）、`openFile`（L506-L543）、`html2md`（L546-L578）、編輯／存檔／快捷鍵（L609-L641）、工具列（L651-L677）、檔案 CRUD 與 grid／context menu（L679-L851）、留言系統（L853-L1199）、設定與初始載入（L1201-L1217）。學習重點：選取文字錨定、三層 fallback 的 `highlightTextInViewer`、MutationObserver 重新套用 highlight。
- `#L1-L4` — `config.json` — 最小設定：`brandName`（頁首品牌）與 `docsRoot`（相對或絕對文件根目錄）。
- `#L1-L8` — `manifest.json` — 單分頁樣板宣告：`name: docs`、`label: Docs`、`port: 5055`、`apiPrefixes` 指向 `/api/docs` 與 `/api/doc-comments`、`panelSelector: .docs-container`、`stripSelectors: [".header"]`。
- `#L1-L8` — `package.json` — `rubric-docs` v1.0.0，`main` 與 `start` 都指向 `server.js`；沒有 dependencies，體現零安裝負擔。
- `#L1-L80` — `.claude/skills/docs/SKILL.md` — 給 Claude Code 的設定 skill：改 `docsRoot`、說明留言如何成為人機協作橋（highlight → JSON 檔 → summary 端點）、建議啟動時 curl summary、列出建立／刪除檔案的 API。注意其 `DELETE /api/docs?path=` 範例與 server.js 實際只接受 `POST /api/docs` + `_action: delete` 不一致，是理解「文件與實作落差」的好例子。
