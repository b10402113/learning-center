---
source: sources/ai-agent-engineer/20261103/resources/repos/skills
source_type: codebase
source_lines: 3935
language: TypeScript
file_count: 27
part: 2
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `shared/lib.mjs` — 整個 PR 審查 skill 的決定性引擎：把 `gh`、`git diff`、設定檔與檔案路徑轉成可驗證的 facts、noise 分類、測試配對與閱讀順序。對學習者而言，它示範「模型只解釋事實，不負責計算事實」的架構邊界。
- `shared/build.mjs`、`shared/annotate.mjs` — 兩階段 tour 管線。`build` 先產生不含模型的 layer-1 報告（diff 解析、facts、intent 來源），`annotate` 再當唯一閘門，逐欄位比對模型寫的註記與 diff／作者原話，任何一項不合格就整份拒絕。
- `shared/config.md`、`shared/notes.md` — 前者是 `.github/pr-review.jsonc` 與多 repo 清單的設定規格，後者是模型撰寫 `tour-<n>.notes.json` 的寫作與驗證規則。兩份文件把「可調參數」與「可寫欄位」的界線說清楚，是 prompt／schema 設計的好範本。
- `shared/diagrams.mjs`、`shared/vendor/beautiful-mermaid.mjs` — 從 import 關係計算變更地圖，並檢查、渲染模型提供的 Mermaid 圖。重點是「圖在打包時才變成 SVG」，讀者端不載入任何圖表函式庫。
- `shared/render.mjs`、`shared/viewer/` — 把 viewer 的 CSS／JS 與報告 JSON 打包成單一自帶資料的 HTML。沒有伺服器、沒有建置步驟、沒有網路請求；頁面只是 JSON 的視圖，不新增事實。
- `tools/` — `sync-shared.mjs` 把 `shared/` 同步到各 skill 的 `scripts/`、`references/`，`vendor-mermaid.sh` 用 esbuild 重建 vendored 圖表 bundle。兩者展示「單一來源、可檢查漂移」的 monorepo 維護方式。
- `tests/` — Node 內建 test runner 的單元與端到端測試，涵蓋註記閘門、diff 分類、快取、preflight、viewer 打包與 skill 檢查器；另有需要真實模型呼叫的 shell eval。對學習者而言，測試本身就是這套 harness 的行為規格。
- `tests/fixtures/write-great-skill/` — 故意做對與做錯的 SKILL.md 範例，讓 `check-skill` 的 fail／warn 規則可被重跑驗證。小檔案卻精準展示 frontmatter、description 長度、placeholder、腳本可執行權限等檢查點。

# L2 detail

- `#L1-L466` — `shared/lib.mjs` — 零依賴的決定性核心。`parseArgs`、JSONC 解析、glob→regex、`parseDiff` 把 unified diff 轉成帶新舊行號的 hunks；`classify` 辨識 lockfile、generated、ORM snapshot、binary、純改名、格式變更、只動 import、minified／大型 JSON 等 noise；`computeFacts` 產生 skipped test、focused test、移除 assertion、破壞性 SQL、新增依賴、未測變更等帶檔案與行號的 fact；`readingOrder` 依 hotspot、layer、測試跟隨原始碼、noise 收尾排序；`intentStatus` 依 spec／description／issue／commits／title 的強度判定意圖等級。學習重點是每個 fact 都附出處，模型不能自行增加事實。
- `#L1-L286` — `shared/annotate.mjs` — 模型文字進入報告的唯一入口。triage 模式檢查 `order` 是否涵蓋所有 PR、是否與各 PR 的 attention 等級一致；tour 模式逐一驗證 `attention`、`claims`、`explains`、`items`、`fileNotes`、`why`、`points`、`chapters`、`diagrams`、`shape`。指標必須是 diff 內的行，且 `code` 必須是該行的逐字片段，藉此抓到差一行的錯誤；引用必須逐字（至少 4 字元、大小寫敏感）；任何 LGTM／looks safe／approve 類判決字眼都會被拒。全部通過才寫回檔案，否則列出所有問題並 exit 1。
- `#L1-L214` — `shared/build.mjs` — 建立 tour 的決定性半邊。支援單一 PR、快取中的多 repo PR、本地 branch range、已存 diff 四種來源；依序收集 spec 檔、PR 描述、連結 issue、commit message、title 作為 intent 來源；解析 diff、分類、計算 facts 與 change map；輸出 `tour-<key>.json`，內含檔案 hunks、items、order、intent、changeMap，模型欄位先留 null。`headReader` 會在 PR head 讀取變更後檔案，讓 import 圖反映合併後狀態；`readCommands` 產生 judge 可離線讀快取的 `git --git-dir … diff/show/grep` 指令。
- `#L1-L141` — `shared/diagrams.mjs` — 變更地圖與 Mermaid 工具。`importsOf` 抓 JS／TS 與 Python 的 import specifier，`resolveImport` 解析相對路徑、`@/`／`~/` alias 與 `index`／`__init__`；`buildChangeMap` 只在至少 3 個檔案、且有非測試對非測試的邊時才回傳地圖，避免畫出「測試使用其原始碼」這種廢話。`checkMermaid` 驗證圖型種類、行數、header、節點與邊數，並實際 parse／render；`changeMapMermaid` 依 layer 分 subgraph，只用紅／琥珀標記 high／medium finding。
- `#L1-L70` — `shared/render.mjs` — 打包器。讀取 `triage.json` 或單一 `tour-<n>.json`，把每份 tour 的 Mermaid 在打包時渲染成 SVG（失敗則保留原始碼），將資料以跳脫後的 JSON 嵌入 `<script type="application/json" id="data">`，再內嵌 `viewer.css` 與 `viewer.js`，輸出單一 HTML。佇列頁會順手刪除舊版分頁檔；重點是「一個檔案帶走所有 queue 與 tour」且資料不會提前關閉 script 標籤。
- `#L1-L150` — `shared/config.md` — 設定規格與預設值。說明 `.github/pr-review.jsonc` 的 `areas`（只當提示，不計分）、額外 `tests`／`noise` glob、`tour.specDirs` 與 `readingOrder`；也定義多 repo 的 `~/.config/pr-triage/repos.jsonc`、host 支援範圍、preflight 檢查順序、bare partial clone 快取與 lock 行為。內建預設段落等於一份「什麼算測試、什麼算 noise、怎麼讀」的清單，適合當規則目錄閱讀。
- `#L1-L273` — `shared/notes.md` — 模型撰寫註記的完整指南。定義 `attention` 四級判準（critical 會動錢／權限／不可回復資料；high 可能改動錢、權限、資料或與作者說法矛盾；medium 有界線的行為變更；low 機械性變更），並要求高於 low 的判斷附上驅動判斷的那一行。其餘章節逐一說明 `whatItDoes`、`why`（只能逐字引用作者原話）、`points`、`shape`、`chapters`、`fileNotes`、`claims`、`explains`、`items` 的寫法與上限，最後給出「像一個人對另一個人說話」的寫作規則，包括禁止結語式摘要與任何 merge／security 判決。
- `#L1-L3` — `shared/vendor/beautiful-mermaid.mjs` — 由 beautiful-mermaid 1.1.3、elkjs 0.11.1 與 entities 7.0.1 打包而成的單一 ESM bundle（其餘行是壓縮後的實作）。只匯出 `renderMermaidSVG` 與 `parseMermaid`，在打包報告時使用、不會隨頁面送到讀者端。學習重點是「vendoring 換取零 npm install」與授權標頭必須保留。
- `#L1-L314` — `shared/vendor/THIRD_PARTY_LICENSES.md` — 三個 vendored 套件的完整授權：beautiful-mermaid（MIT）、elkjs（EPL-2.0）與 entities（BSD-2-Clause）。檔頭說明 bundle 只在 render 時執行、不隨頁面出貨，並指出 elkjs 的 EPL 原始碼位置。對學習者而言，這是第三方碼入庫時應附的授權紀錄範例。
- `#L1-L257` — `shared/viewer/viewer.css` — 深色 oklch 主題與版面。定義色彩 token、隊列表格、attention／severity／FACT／MODEL／ASK WHY 標籤、diff 表格與新增／刪除底色、TL;DR 卡、shape／diagram 區塊、意圖證據雙欄、walkthrough 檔案卡、側邊目錄與手機版 overlay。重點是所有視覺語彙都對應報告 JSON 的語意，例如紅色只代表 finding，而不是一般裝飾。
- `#L1-L453` — `shared/viewer/viewer.js` — 無依賴的前端渲染器。從頁面內嵌 JSON 建出 triage queue 或單一 tour；提供小型 Markdown inline／block 解析、逐行語法高亮、hash routing（`#/pr/<key>?at=…`）、依 attention 排序的佇列、TL;DR、Overview、change map、Shape、Where to look、Intent and evidence、章節式 walkthrough、noise 折疊與 scroll-spy 側欄。佇列列可整列點開 tour，變更地圖節點可點回檔案；所有連結都使用 PR key，避免多 repo 時編號衝突。
- `#L1-L36` — `tools/sync-shared.mjs` — 把 `shared/*.mjs` 複製到 `skills/pr-triage/scripts/` 與 `skills/pr-tour/scripts/`，`shared/*.md` 複製到 `references/`，`shared/viewer/*` 與 `shared/vendor/*` 複製到對應子目錄。`--check` 只回報漂移並 exit 1，適合放進 commit 前檢查；學習重點是「同一份程式要能被單獨 `cp -r` 安裝，又不能各自漂移」的取捨。
- `#L1-L8` — `tools/vendor-mermaid.sh` — 在暫存目錄 `npm i beautiful-mermaid@1.1.3 esbuild`，產生只匯出兩個函式的 `vend.js`，再用 esbuild bundle／minify 成 neutral ESM。輸出後需手動加上授權標頭並複製回 `shared/vendor/`。簡短示範可重現的 vendoring 流程。
- `#L1-L210` — `tests/annotate.test.mjs` — 針對註記閘門的端到端測試：接受逐行檢查的註記並重排、拒絕不在 diff 的行、拒絕非逐字 claim、拒絕 verdict、無 intent 時不得有 claims、title-only 與 intent map 的差別、test 繼承其程式碼的解釋、`code` 片段抓出 off-by-one、quote 大小寫與長度、最多 8 個 items、attention 等級與必要指標、triage 排序完整性與等級單調性、why／points／chapters／shape 驗證、render 打包與 route group 連結。幾乎每個規則都有正反案例。
- `#L1-L58` — `tests/check-skill.test.mjs` — `write-great-skill` 檢查器的規格測試。驗證 frontmatter 的 quoted／folded／plain description 解析、first sentence 切法、好 skill 零 fail 零 warn、壞 skill 的 name 格式／資料夾不一致／TODO placeholder／缺失連結／模糊描述／filler／缺 Gotchas／腳本未執行權限，以及 description 超過 Agent Skills 1024 只 warn、超過 Claude Code 1536 才 fail。最後跑過 repo 內所有 skill，確保沒有 FAIL。
- `#L1-L190` — `tests/lib.test.mjs` — `shared/lib.mjs` 與 `shared/diagrams.mjs` 的單元測試。涵蓋 JSONC 註解與尾逗號、glob、測試與原始碼配對、移除 assertion 指向舊行、diff 行號與 rename、各類 noise 與非 noise 邊界、facts（skip／focus／destructive SQL／依賴變更／未測變更）、閱讀順序、機械式改名與字串常值差異、intent 判定、change map 的 import 解析與 Mermaid 檢查。是理解分類器行為最快的一組範例。
- `#L1-L397` — `tests/pr-triage-repos.test.mjs` — 多 repo triage 的整合測試。解析 `github:` 條目、拒絕 GitLab／Azure／未知 host、載入 JSONC repo 清單與 slug 去重、以假 runner 驗證 preflight 的安裝／登入／讀權限順序與唯讀性、GitHub adapter 的 PR metadata 與 `refs/pull/<n>/head`、bare partial clone 快取與 lock／stale lock／prune／rebuild、跨 repo 佇列 key 與排序、以假 `gh` 跑完整端到端流程，以及 `readCommands` 對怪異 home 路徑的 shell quoting。適合學習如何在不碰網路的前提下測試外部 CLI 依賴。
- `#L1-L89` — `tests/legacy-testing-assess.test.mjs` — `legacy-testing/scripts/assess.sh` 的行為測試。在暫存目錄即時建立小型 repo，驗證檔案目標能找到另一個資料夾中 import 它的測試、沒有測試的檔案會被列出、資料夾目標會在整個 repo 搜尋且路徑保持 repo-relative、Stryker sandbox 不被誤認為測試、Python dotted import 可被辨識、完全沒有測試的 repo 會明說、路徑不存在時 exit 2。示範用真實檔案系統 fixtures 測 shell 工具。
- `#L1-L117` — `tests/write-great-skill.eval.sh` — 需要 `claude -p` 與真實模型呼叫的 live eval。`release`  clone 一個 repo，要求把 release checklist 變成 skill，檢查是否真的使用 write-great-skill、SKILL.md 與可執行腳本存在、description 是否含觸發詞、腳本是否含 tag／push／dry-run 護欄、是否有 Gotchas、且執行期間不得建立 tag；`rotate` 從零產生 API key 輪替 skill 並檢查無 secret 字串；`autopick` 用 5 個該觸發與 2 個不該觸發的請求測試 skill 是否被自動選中。重點是把「skill 品質」變成可重跑的驗收條件，並嚴格限制沙箱寫入範圍。
- `#L1-L10` — `tests/fixtures/write-great-skill/bad-skill/SKILL.md` — 反面教材：`name` 用了大寫與底線、description 空泛、內文有「make sure／best practices」filler、`TODO` placeholder，並連到不存在的 `references/missing.md`。用來觸發多條 fail 與 warn。
- `#L1-L2` — `tests/fixtures/write-great-skill/bad-skill/scripts/go.sh` — 被 SKILL.md 直接執行、但 fixture 沒有可執行權限的腳本，用來驗證檢查器會 warn「run directly but is not executable」。
- `#L1-L14` — `tests/fixtures/write-great-skill/folded-skill/SKILL.md` — 使用 YAML folded scalar `>` 的 description，並含「Use when」與 Gotchas。驗證 parser 會把多行 description 攤平成一句，且 first sentence 只取第一句。
- `#L1-L15` — `tests/fixtures/write-great-skill/good-skill/SKILL.md` — 正面教材：quoted description 同時含動作、觸發詞與腳本入口，步驟有 `Done when` 檢查點，Gotchas 明確，並引用存在的 reference。應零 fail 零 warn。
- `#L1-L3` — `tests/fixtures/write-great-skill/good-skill/references/notes.md` — 被 SKILL.md 連結的 reference 檔，內含 `src/app.ts:12` 這類專案內行號引用。測試特意說明「指向專案的行號不檢查」，因為 skill 可能被安裝到別的 repo。
- `#L1-L2` — `tests/fixtures/write-great-skill/good-skill/scripts/release.sh` — 最簡可執行腳本，存在且具執行權限，用來滿足「SKILL.md 呼叫的腳本必須存在且可執行」這條規則。
- `#L1-L12` — `tests/fixtures/write-great-skill/spec-length/SKILL.md` — description 超過 Agent Skills 規格的 1024 字元上限，但仍低於 Claude Code 的 1536 截斷點；預期只有 warn、沒有 fail。
- `#L1-L12` — `tests/fixtures/write-great-skill/too-long/SKILL.md` — description 超過 Claude Code 的 1536 字元上限，預期 fail，因為實際載入時會被截斷。
