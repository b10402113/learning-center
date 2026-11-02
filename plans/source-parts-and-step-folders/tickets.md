# Tickets: 長文切分、step 資料夾集中、原稿不可變

把長文來源切成 part 檔、每個 step 的執行產物收進同一個資料夾、publisher 原稿不再被覆寫。完整設計見 [`source-parts-and-step-folders.md`](source-parts-and-step-folders.md)，決策見 [ADR 0008](../../docs/adr/0008-split-long-sources-into-parts.md) 與 [ADR 0009](../../docs/adr/0009-one-folder-per-step.md)。

Work the **frontier**：1 與 3 可並行；2 等 1。

## 1. Step 資料夾、原稿不可變、plan 進 node 目錄

**What to build:** 對一個 node 跑 `/article`，每個需要的 step 在 `output/<node>/<step>/` 產生 material、`original.md`、`polish.md` 與 `result.json`；publisher 寫完 `original.md` 後任何階段都不再改它；`publish` 從 `polish.md` 寫出 `nodes/<node>/<step>.md`。正式配圖清單同時搬到 `nodes/<node>/<step>.plan.json` 並進 git，`--force` 讓一個 step 從 publisher 重來，`reset-nodes` 用同一份清單清掉所有產物。完成後 `output/` 只剩暫存，clone 後仍能靠 node 目錄重畫圖片。

**Blocked by:** None — can start immediately.

- [ ] `prepare` 建立 `output/<node>/<step>/`，material bundle 在其中；回報的 `original` / `polish` / `plan` 路徑都是新位置
- [ ] publisher 只寫 `original.md` 與 plan；`original.md` 的 sha256 在 polish、markers-only、publish 之後完全不變
- [ ] `polish-article draft` 讀 `original.md`、寫 `polish.md`，並更新 plan 的 `heading` / `prompt`；重跑從 `original.md` 重新潤飾，不從 `polish.md` 疊加
- [ ] `run-article-agent --markers-only` 讀 `polish.md`，marker 數量／順序與 plan 不符時失敗，成功只寫 `result.json` 與 `blocks.json`，不再產生 `.article.md` 或 `.protected.md`
- [ ] `publish` 讀 `polish.md`（經 `result.json`），缺 completed 結果時失敗；成功後 `step.md` 的散文與 `polish.md` 一致（除 code 還原與 H1 正規化）
- [ ] `render-images`、`reset-nodes`、`batch-nodes` 都只讀 `nodes/<node>/<step>.plan.json`，不再讀 `output/image-plans`
- [ ] `prepare --force` 清掉舊的 `polish.md`／`result.json`／`blocks.json`／`request.json`，讓舊 run 無法 publish；`publish --force` 只在新文章成功寫入後清除舊圖片、quiz 與 polish／humanize 紀錄；失敗時舊文章與舊圖保留
- [ ] `reset-nodes` 保留 node 容器與 step plan，刪除上述產物與 humanize 產物
- [ ] 提供一次性遷移：把 node 的 `steps` 仍列出的 `output/image-plans/<node>/<step>.json` 搬到 node 目錄，孤兒 plan 與其餘 `output/` 刪除；搬遷後 `/generate-images` 仍能重用既有圖片
- [ ] `verify` 認得 `<step>.plan.json`，不當孤兒；plan 存在時是合法 JSON、1–5 項、每項 `prompt` 非空；不要求 `output/` 內的階段文章存在
- [ ] `output/` 內不再出現 `materials/`、`jobs/`、`image-plans/`、`humanized/`，也不再出現 `.article.md`、`.protected.md`
- [ ] `AGENTS.md` 的架構樹、Pipeline、Operations，以及 `article`、`generate-images`、`reset-nodes` skill 與 `docs/reference/verify.md` 同步更新
- [ ] `node --test` 綠，新增測試涵蓋 original 不變、polish 獨立、markers-only 不產文章、force 與 reset 的新資料夾

## 2. Humanize 以 `humanized.md` 為施工現場

**What to build:** humanize 階段先把 `step.md` 複製成 `humanized.md`，subagent 只編集 `humanized.md` 與 plan 的 `heading` / `prompt`；驗證結構與改前一致後，再把 `humanized.md` 複製回 `step.md`。不再需要獨立 workspace，也不再需要 `.plan.backup.json`。

**Blocked by:** 1. Step 資料夾、原稿不可變、plan 進 node 目錄

- [ ] humanize 前 `humanized.md` 是 `step.md` 的完整複本，位於 `output/<node>/<step>/`
- [ ] 編輯後 H1、code fence 與 provenance、marker 序列、既有圖片行與 caption、quiz block、相對連結完全不變
- [ ] plan 長度、順序、既有 `anchor` 不變，只有 `heading` / `prompt` 可變
- [ ] 驗證通過才覆寫 `step.md`；失敗時 `step.md` 不動，`humanized.md` 保留供修復
- [ ] `output/humanize/`、`.plan.backup.json`、`output/humanized/` 不再被讀寫或建立
- [ ] `batch-nodes` 的 Humanize 階段文件、`-skip-humanize` 說明與測試同步更新
- [ ] `node --test` 綠，新增測試涵蓋驗證失敗時 `step.md` 不變、成功時兩檔一致

## 3. 長文切分、coverage manifest 與 citation 遷移

**What to build:** 新增 `split-sources.mjs`：`--dry-run` 印出 chunk 表格且不寫檔，`--apply` 產生 `<stem>.<n>.part.txt` 與 `<stem>.parts.json`，成功後刪除原始 `.txt` 並保留 PDF。`learn-init` 與 `ingest` 遇到長文都先列計劃、等使用者確認再套用；`verify` 證明切分沒切壞；最後把 `principle-pi` 的 19 個 digest 與 46 處 citation 遷移到 part-local 行號。

**Blocked by:** None — can start immediately.

- [ ] 門檻 `>3000 行或 >250KB`；以章節為邊界，`< ~200` 行的 section 併入下一個，`> ~2000` 行的 section 在子標題或段落邊界再切；無標題文件以段落邊界每 ~1500 行切
- [ ] `--dry-run` 只輸出表格（原行號區間、新檔名、行數、首行標題），檔案系統沒有任何變動
- [ ] `--apply` 的 manifest 完整覆蓋原檔：`start`/`end` 無縫、無重疊、`lines` 總和等於 `total_lines`；無法覆蓋、目標檔已存在或找不到切點時 exit 非 0 且不刪原檔
- [ ] 原始 `.txt` 在成功後刪除，PDF 保留；重跑 `--apply` 不覆寫既有 part 檔
- [ ] `pdf-backfill` 偵測到 `<stem>.*.part.txt` 時跳過該來源，不從 PDF 重生大檔
- [ ] `verify` 檢查 manifest 覆蓋、part 檔行數、每個 chunk 恰對應一個 digest part，並要求有 manifest 的來源其 digest 指向 part 檔；負向 fixture 涵蓋缺口、重疊、行數不符、digest 指回大檔
- [ ] `learn-init` 與 `ingest` 都有「列出切分計劃 → 等待確認 → 套用」步驟；使用者拒絕時流程停止，不退回用未切分的大檔寫 digest；短來源不進切分流程
- [ ] `principle-pi` 完成遷移：原 `.txt` 切成 part 檔並刪除、19 個 digest 改指向 part 檔並更新 `source_lines` 與 L2、46 處 citation 改為 part-local（跨 chunk 拆兩筆）；`verify --subject principle-pi` 綠
- [ ] 文章散文、quiz、圖片完全沒變；diff 只出現在 node 的 `sources` YAML 與 digest 的 frontmatter / L2
- [ ] `docs/reference/source-reading.md` 改為「先切來源、再切 digest」，並說明 manifest 與 part-local 行號；`learn-init`、`ingest` skill 同步
- [ ] `node --test` 綠，fixture 涵蓋正常章節、過小 section、過大 section、無標題、覆蓋失敗
