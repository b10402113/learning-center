---
source: sources/rubric/20261108/supplement/rubric-editor
source_type: codebase
source_lines: 4865
language: JavaScript
file_count: 32
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- **伺服器（`server.mjs`）**：零依賴 Node HTTP 服務，只綁 `127.0.0.1`；每次請求即時組裝 `app/editor.html`，注入專案的 `STORE_KEY`、`ns`、token 與 `rubric-state.json` 的 keys，再提供 `/api/projects`、`/api/state/<id>` 讀寫。其餘是專案媒體的 byte-range 檔案服務；host 白名單擋 DNS rebinding，只收 JSON、body 上限 1 MB，且不服務隱藏檔與 `rubric-state.json`。
- **專案與工具（`tools/make-project.mjs`、`tools/render-export.mjs`）**：`spec.json` 是唯一輸入（clips、versions、raw、keeps、words、layers、scenes）。`make-project` 用 ffmpeg/ffprobe 產生五個資料檔（`reels-data.js`、`source-data.js`、`fixes.js`、`approvals.js`、`resolutions.js`）與 media（poster、filmstrip、waveform、proxy）；`render-export` 依 Export 存下的請求，從 raw 重切、裁切、loudnorm，再用 ffprobe 與完整解碼驗證。
- **審查 app（`app/editor.html`、`app/home.html`、`app/shim.js`）**：editor 以 localStorage 為工作狀態，undo 歷史同時涵蓋留言與剪點；留言是畫面 pin、時間點 ADD 或聲音 layer 註解。`Copy comments` 把 `EXTEND`／`TRIM`／`DELETE`／`PIN`／`ADD`／`APPROVED` 與新的 keep ranges 編成 Markdown 交給 agent。shim 在頁面載入前把磁碟上的 `rubric-state.json` 寫回 localStorage，之後每次變更延遲 POST；離線時留在 pending，恢復後補送。
- **時間軸（`app/editor-timeline.js`、`app/editor-timeline.css`）**：同一個 player 上疊 raw 與成品兩條時間軸。每個 keep 是 raw 上的一段，拖邊界等於還原或再剪，`C` 切半，`H` 隱藏剪點。reel time ↔ raw time 用兩邊共享的字詞建 anchor，再逐 clip 建線性映射（`buildKmap`）；只繪製視窗內片段，所以長錄音不會卡。`api.markdown` 產生 trim 清單，`api.exportOf` 給出渲染用的 keeps。
- **`/cut` skill**：`transcribe`（逐字時間；AssemblyAI／ElevenLabs／Whisper）→ agent 讀 `sentences.txt` 寫 `plan.json`（`sections.keep` ＋ `why`）→ `cut.mjs --dry` 產 `cut-review.md` 檢查 KEPT TEXT → `cut.mjs` 把每個邊界落在音訊的真實停頓上、輸出版本與 `spec.json` → `make-project` 建專案。核心規則：最後一次乾淨 take 整段保留、假開場與長停頓刪除、每個刪除都要有理由。
- **範例專案（`sample/`、`projects/sample-recording/`）**：58 秒合成錄音（93 字、2 段），刻意埋了 line 2 的 false start（take 1）與 line 3 後的 6.7 秒長停頓。`plan.json` 的 keep 與 `cut-review.md` 的 KEPT TEXT 是預期輸出；`projects/sample-recording/` 是伺服器一啟動就能開的專案（V1 成片、rubric.json、media）。

# L2 detail

- `#L1-L27` — `README.md` — 用一段話定義 agent-first 編輯循環：raw → `/cut` 轉錄、保留最後乾淨 take、剪掉假開場與長停頓 → 放上編輯器 → 使用者審查 → Copy comments → 重剪。也說明 sample 的兩個刻意缺陷，讓使用者先看懂「被剪掉的是什麼」。
- `#L28-L60` — `README.md` — 安裝面：Node.js 18+、ffmpeg，沒有 `npm install`；`env.local` 與轉錄 key。三種轉錄器的速度／成本／key 取捨（AssemblyAI 預設、ElevenLabs Scribe、本機 Whisper 免費但慢）。
- `#L61-L103` — `README.md` — 審查操作與回饋契約：Space／R／S／D／F、拖 clip 邊界、`C` 切半、`Del`、`H` 收合剪點、畫面 pin、`A` 標記新增、Approve。按下 Copy comments 後，每個項目都帶著「它是什麼、在哪裡、那裡說了什麼」，agent 只重剪有變動的段落。
- `#L143-L176` — `README.md` — 安全模型與建置圖：只聽 localhost、無 CORS、1 MB 上限、可選 `RUBRIC_TOKEN`。raw → words/sentences → plan → cut-review → cuts/spec → project → server 的全省略圖，以及路由與 `rubric-state.json` 的儲存鍵（`:srcTrim`、`:teach`、`:export`）。
- `#L1-L59` — `server.mjs` — 啟動檢查、`env.local` 載入（不覆蓋既有環境變數）、PORT／PROJECTS_DIR／TOKEN、MIME 表，以及缺少資料檔時的 STUB（空的 `RESOLVED`／`FIXES`／`APPROVED`／`SOURCE`）。
- `#L120-L138` — `server.mjs` — 頁面組裝是「每次請求重寫」而非預先打包：把 timeline CSS/JS 換成 `/__rubric/*`、把 `STORE_KEY` 換成專案鍵、把 boot payload（project、prefixes、keys、token、orientation）注入 `<head>`，再載入 shim。
- `#L165-L249` — `server.mjs` — 安全與 API 核心：host 白名單（403 擋 DNS rebinding）、`/api/state/<id>` 的 GET/POST（`{set, del}`）、只接受屬於該專案前綴的鍵、非工作類鍵（游標、速度、版面、teach、export）不更新 `workAt`；檔案路由拒絕 `..`、隱藏檔與 `rubric-state.json`。
- `#L52-L77` — `tools/make-project.mjs` — 讀 spec、驗證 clip 清單與 id、解析 `PROJECTS_DIR`（與 server 一致），建立 `projects/<id>/`。spec 是重建專案的穩定介面；重跑不會碰 `rubric-state.json`。
- `#L81-L174` — `tools/make-project.mjs` — 把媒體轉成編輯器看得懂的資料：words 正規化（秒／毫秒自動判斷）、每 50/100 Hz 的峰值包絡、poster、每秒一格 filmstrip、瀏覽器可播的影片 copy（必要時轉 h264）、只覆蓋 `t0..t1` 的 raw proxy，以及 keeps 的順序／重疊／長度檢查與 `rawToEdit` 映射。
- `#L176-L295` — `tools/make-project.mjs` — 建 `REELS` 與 `SOURCE`：版本、scenes、tokens、layers（Mute/Solo 用）、overlays、removed 段與原因、raw 的 proxy／strip／keeps；最後寫出五個 `window.*` 資料檔與 `rubric.json`（storeKey、ns、orientation、spec 路徑）。
- `#L1-L14` — `tools/render-export.mjs` — Export 的契約：請求存在專案裡（尺寸、clips、trims、approvals），這支腳本只負責渲染。有 raw 的 clip 從 raw 按 trim 重切（畫面與聲音同影格邊界，避免對嘴漂移），沒有 raw 的就用完成的影片。
- `#L57-L141` — `tools/render-export.mjs` — 渲染核心：`cropFor`（rubric.json `exportCrop` 或置中裁切）、NVENC 偵測與 CPU 退回、`rawGraph` 以 `-ss/-to` 一次解碼＋`split/trim/concat` 產生 filter graph、loudnorm 音量一致化，最後比對寬高、長度、音軌與完整解碼錯誤。
- `#L143-L186` — `tools/render-export.mjs` — 請求選擇與紀錄：`--id`、`--list`、`--dry`、`--again`；輸出永不覆寫（`-2`、`-3`），每次渲染寫入 `exports/export-log.json`，讓 agent 能回報實際檔案而非只說「完成」。
- `#L261-L320` — `app/editor.html` — header 與面板骨架：Export 彈出選單（三種尺寸、this clip／all）、`Teach my /cut`、`Teach my /animate`、Copy comments（單 clip／全部）、Approve；右側 rail 是版本清單與整體筆記，下方是 Script、Comments、Timeline。
- `#L376-L460` — `app/editor.html` — 狀態模型：`state = {version, global, reels:{id:{note,marks}}}` 存在 localStorage；`ST`（timeline）另外存 `:srcTrim`。undo/redo 用一份 snapshot 同時記錄 comments 與 trim，typing 進入 textarea 時合併成一個 undo step。
- `#L976-L1046` — `app/editor.html` — **回饋契約的實作**：`buildMarkdown(scope)` 逐版本輸出檔名、狀態、trim 的 keep ranges（`Source trims`）、Overall 筆記，以及每個 pin／ADD 的時間、畫面區位、當下說的話、scene 與 V2 標籤。未解留言才匯出，已套用的列在 `Already applied`；結尾固定 `## For my agent` 的 Teach 指示。
- `#L1064-L1160` — `app/editor.html` — Teach 開關與 Export 請求：Teach 存在 `STORE_KEY:teach`，不進 undo；Export 把 `{id, scope, width, height, clips, instruction}` 存進 `:export`，並複製一行「Render … run node tools/render-export.mjs --id …」的指示。`Render all` 對每個 clip 取已核准版本，否則取最新版。
- `#L135-L250` — `app/home.html` — 專案首頁：`fetch('/api/projects')` 後以卡片或表格呈現；`/` 聚焦搜尋、六種排序、landscape／vertical 篩選、hover 播放第一個 clip。它只讀 server 的摘要，不碰專案檔案。
- `#L1-L44` — `app/editor-timeline.js` — 模組契約與狀態：`window.SrcTrim` 是 editor 與 timeline 之間的唯一介面；raw 與成品兩個 video 疊在同一個預覽框，`park` 保存使用者放下的 playhead，避免來回 seek 造成位置漂移。
- `#L150-L301` — `app/editor-timeline.js` — 兩件核心運算：`changesOf` 用區間差集合算出 EXTEND／TRIM／DELETE 與其對應文字；`buildAnchors` 用 reel 與 raw 共享的字詞建立對齊點（容忍 1–6 字偏移），`buildKmap` 再為每個 clip 擬合線性映射，讓成品時間與 raw 時間可互轉。
- `#L572-L641` — `app/editor-timeline.js` — 拖邊界：`bounds` 限制 clip 不得短於 0.2 s、不得越過鄰居；pointer 移動超過 3 px 才算拖曳，拖曳時停止播放、即時更新波形與預覽，並在放手時寫入 undo 與 localStorage。
- `#L1247-L1330` — `app/editor-timeline.js` — 對外 API：`addMark`（`+` 或 `A`，可拖出 raw 區間）、`api.markdown`（trim 清單＋新的 keep ranges JSON code block）、`api.exportOf`（合併相鄰 keeps、排除刪除片段、回傳 `source/t0/t1/keeps/trims`）、`api.load`（套用 undo 快照）。
- `#L40-L120` — `app/editor-timeline.css` — 時間軸視覺語言：`.st-tl` 的 head＋lane grid、ruler、gap 斜線、clip 與 filmstrip canvas、選取與刪除狀態、`st-handle` 邊界握把、waveform、word chips、留言 marker、playhead（用 transform 移動，播放時不重排）。
- `#L121-L172` — `app/editor-timeline.css` — 兩種特殊情況：沒有 raw 的動畫 reel（`.synthetic`，只保留 scrub 與留言），以及聲音 layers／V2 overlays 的 lane（Mute／Solo、眼睛開關、overlay 在播放頭進入時才顯示）。
- `#L1-L78` — `app/shim.js` — localStorage ↔ 磁碟的同步層：載入前「磁碟優先，但保留尚未送出的 pending」；攔截 `setItem`／`removeItem`，400 ms debounce 後 POST `{set, del}`；401／413 有明確提示，離線時顯示紅色橫幅，`pagehide` 用 `keepalive` 補送。
- `#L1-L28` — `skills/cut/SKILL.md` — `/cut` 的觸發語與前置條件：Node 18+、ffmpeg、editor 路徑、server 已啟動、轉錄 key。也定義三種轉錄器的取捨，以及 key 只能寫進 `env.local`、不可回印。
- `#L29-L47` — `skills/cut/SKILL.md` — 八步工作流：Brief → Transcribe → Plan（先讀 `my-style.md`）→ Dry run（讀整段 KEPT TEXT）→ Cut → Apply comments（EXACT 邊界、ADD、PIN、APPROVED）→ Teach my /cut → Render。每一步都有「done when」條件，讓 agent 可以自我驗收。
- `#L49-L68` — `skills/cut/SKILL.md` — 保留／刪除規則：最後一次乾淨 take 整段勝出、不可把兩個 take 的頭尾接起來（音高與呼吸會變）、假開場／slate／自我指示要刪、超過約 0.6 s 的停頓刪除但保留 0.1 s air、其餘全留；不確定就留並標記 `check:`。
- `#L1-L122` — `skills/cut/scripts/transcribe.mjs` — 轉錄器轉接層：先把音訊壓成 16 kHz 單聲道 MP3，再依 `--engine` 或 `settings.json` 呼叫 AssemblyAI（verbatim prompt、保留重複與 filler）、ElevenLabs Scribe 或本機 Whisper；輸出 `recording.json`、`transcript.json`、`words.json`、`sentences.txt`（句子結尾或 >1.2 s 間隔換行）。
- `#L1-L86` — `skills/cut/scripts/lib.mjs` — 共用工具：`settings()`（預設 transcriber／air／quietDb／reviewHeight）、`editorDir()`（settings → 環境變數 → skill 出貨位置）、`secret()`（環境或 `env.local`，從不輸出）、`ffmpeg`／`probe`（含 fps 與 `voff`，聲音可能比畫面早）、`samples`／`readWords`。
- `#L39-L72` — `skills/cut/scripts/cut.mjs` — 把 transcript 的時間換成音訊上的真實邊界：10 ms 一格算 dB、取房間噪音地板推 `QUIET`，`startEdge` 往前找聲音起點、`endEdge` 往後找 0.25 s 靜音，再加 `air`，最後對齊影格。
- `#L75-L148` — `skills/cut/scripts/cut.mjs` — `cut-review.md` 的產生：逐段列出 KEEP／cut 與原因、KEPT TEXT 與 CHECK；檢查邊界是否切進字、是否有四字詞重複（retake 留在裡面）、以及段與段之間被移除的內容。`--dry` 到這裡就停，強迫 agent 先讀再剪。
- `#L150-L221` — `skills/cut/scripts/cut.mjs` — 實際剪輯：把 keeps 轉成影格區間、合併鄰近 run、用一份 filter script 一次解碼並 `concat`，輸出 720p review copy 與 `*.words.json`；`history.json` 讓同一段的新 keep 成為 V2、V3；最後寫 `spec.json` 並呼叫 `make-project`。
- `#L1-L23` — `skills/cut/scripts/words.mjs` — 除錯用小工具：印出指定時間窗內每個字的 start／end 與超過 0.3 s 的停頓，讓 agent 在寫 plan 前確認某段是否為 retake。
- `#L1-L108` — `sample/spec.json` — 範例專案規格：兩個 clip（`01-intro`、`02-three-tips`）、raw 與 rawWords、keeps、removed（含「false start…last clean take stays」與「long pause (6.7 s)」）、applyHint、versions。這是 `make-project` 的完整輸入範例。
- `#L1-L23` — `sample/plan.json` — agent 應寫出的計畫格式：`sections[].keep` 是 raw 秒數、`why` 以時間為 key 說明刪除原因；兩段分別對應「第一次失敗重說」與「長停頓＋段間停頓」。
- `#L1-L11` — `sample/recording.json` — 轉錄產出的中繼資料：錄音檔、長度 57.7 s、1280×720、轉錄器與模型、語言、字數、時間戳。讓 cut 流程不必重新探測也知道來源。
- `#L1-L92` — `sample/words.json` — 逐字時間軸（93 個 word，start／end 秒）。可以看到 `your-`、`um,`、`sorry,` 等 false start 痕跡，以及 16.66 s 起重說的乾淨版本；這是「保留最後一次」規則的原始證據。
- `#L1-L8` — `sample/sentences.txt` — agent 實際閱讀的句子檔：每行「起始-結束 文字」，在句號或 >1.2 s 間隔換行。line 2 的失敗版與 line 3 的重說版並列，是 plan 判斷 retake 的主要依據。
- `#L1-L30` — `sample/cut-review.md` — dry run 的預期輸出：每段列出 cut/KEEP 與理由、KEPT TEXT，最後是「Total kept: 0:29.5 of 0:57.7 raw」。它示範 agent 該如何用「聽起來的樣子」驗證剪輯，而不是只看時間碼。
- `#L1-L45` — `sample/cuts/history.json` — 版本紀錄：每個 section 的 `v`、檔案、當時的 keeps、note 與時間。這是 `cut.mjs` 判斷「keep 沒變就沿用 V1、變了就生 V2」的依據。
- `#L1-L10` — `projects/sample-recording/rubric.json` — 專案設定：標題、kicker、orientation、建立／建置時間、spec 路徑、`storeKey` 與 `ns`。`storeKey` 決定 localStorage 與 `rubric-state.json` 的鍵前綴，重跑 `make-project` 時會保留。
