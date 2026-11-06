# Tickets: Block 知識點萃取與知識圖

把 step 文章萃取成獨立 block，接上 coverage、course-app 詳情頁、step 右側欄與知識圖。完整設計見 [`blocks-knowledge-graph.md`](blocks-knowledge-graph.md)。

Work the **frontier**：任何 blocker 都完成的票就可以開始。這是線性鏈：1 → 2 → 3 → 4 → 5；3 與 4 都完成後才進 5。

## 1. Block 格式、coverage 引擎與 edges 退役

**What to build:** 讓 block 成為可驗證的第一級內容格式。手寫一個 block、把它接到一個 step，就能通過 verify，並用 CLI 印出 coverage 與 drift。block 的 `label` 是名詞／專有名詞，`summary` 才是一句話解釋；step entry 可以列出 `blocks:`；`coverage.json` 能從已確認的 audit 與 step links 算出 Step coverage、Course coverage、目前與補齊後 block 數、reuse factor。`/edges` 從 active pipeline 與文件消失，歷史 ADR/spec 不動。

**Blocked by:** None — can start immediately.

- [ ] 合法 block 通過 verify；錯誤的 label（句子、過長、句末標點）、缺少 type 必要 section、壞 source locator、斷鏈 `prerequisites` / `related`、prerequisite 成環，都以具名檢查失敗
- [ ] `label` 是名詞／專有名詞，`summary` 是一句話；`slug` 符合 kebab-case；`type` / `status` enum 正確
- [ ] block 的 `sources` 至少一個、locator 合法、digest 覆蓋正確；code block 有 provenance
- [ ] step entry 接受 `blocks:`；id 必須存在、同 subject、不重複
- [ ] `coverage.json` 可由 confirmed audit 與 step entries 產生；`block: null` 代表未覆蓋
- [ ] `report` 印出 Step coverage、Course coverage、目前 block 數、補齊後 projected block 數、reuse factor、未覆蓋 concept 清單
- [ ] `check` 印出 drift：step 比 block 新、block 來源不再被引用、concept 沒 block、orphan block、prerequisite 斷鏈或成環
- [ ] verify 檢查 block／step／coverage 三方一致；有 coverage 的 concept 必須反向出現在該 step 的 `blocks:`
- [ ] 新增 parser／validator／coverage 計算的單元測試與 negative fixtures
- [ ] `/edges` skill 刪除；AGENTS、README、active pipeline 不再提 edges；歷史 ADR/spec 保留
- [ ] 手寫一個 block + 一個 step link，`report` / `check` / `verify` 可 demo

## 2. `/blocks` 萃取 skill 與 pilot

**What to build:** 對一個 subject 跑 `/blocks`，完成 audit → subject 級確認表格 → 寫入。audit 為每個 node 派一個 block-agent，讀 written step 與引用來源，每步產出 3–6 個 concept；主 agent 彙整成一張依 node 分組的表，使用者一次確認後才建立 draft block、更新 step `blocks:`、重算 coverage、跑 verify。重複概念要能重用或合併；block 可更新，但 `reviewed` 不會被批次流程默默覆蓋；pilot subject 最後有真實、standalone、可讀的 block 與 coverage。

**Blocked by:** 1. Block 格式、coverage 引擎與 edges 退役

- [ ] `/blocks <subject>` 的 audit 模式為每個 node 派一個 block-agent；只處理 written 且有文章 body 的 step
- [ ] 每個 step 產出 3–6 個 concept；短 step 允許 1–2 並在 coverage 註明原因；超過 6 個標記 overflow，不自動拆 step
- [ ] concept 候選有 `slug`、名詞型 `label`、`sources`、候選類型（new / reuse / merge / fuzzy）
- [ ] audit 只寫 `output/` 中間檔，不改正式 block、step、node
- [ ] 主 agent 彙整成 subject 級表格，依 node 分組，列出 new / reuse / merge / uncovered；使用者一次確認，`--yes` 可跳過
- [ ] 確認後寫入 `draft` block、更新 step `blocks:`、跑 coverage apply、verify 綠
- [ ] 重複概念先依 id / alias / 正規化標題重用；模糊候選要人工確認才合併
- [ ] 合併時 canonical id 不變、舊 id 進 `aliases`、改寫所有 step `blocks` 與 block `prerequisites` / `related`；v1 不做舊 URL redirect
- [ ] `status: draft | reviewed`；`--force` 只重生 draft；`--rewrite` 對 reviewed 先給 diff；`--refresh` 針對 drift 更新並先給 diff
- [ ] `/blocks --check` 可單獨跑，報告 stale step、orphan block、斷鏈 prerequisite、未覆蓋 concept
- [ ] pilot subject 的 block 不讀 step 也能看懂；標題是名詞，不是句子
- [ ] pilot 的 coverage 報告能回答「目前有幾個 block、補齊後需要幾個、Step/Course coverage 各是多少」

## 3. Block 詳情頁與 step 右側欄

**What to build:** 讓讀者在 course-app 看到 block。build-data 把 block summary 與 step 的 block 清單放進 subject 資料，block 全文放 per-block 資料並在開頁時 lazy load。block 詳情頁顯示標題、type/status、summary、內文、prerequisites、related、backlinks（哪些 step 用到、哪些 block 指過來）與 sources。step 頁在 `xl` 以上出現 sticky 右欄，列出本步知識點；`xl` 以下改成文章後、自我檢查前的可折疊「本步知識點」。點任何一張卡都導到 block 詳情頁，`[[block-id]]` 走 app 內導覽，不整頁重載。

**Blocked by:** 2. `/blocks` 萃取 skill 與 pilot

- [ ] subject 資料只含 block summary、step 的 block summary 與 graph 邊；不含 block 全文
- [ ] 每個 block 有獨立的全文資料，開啟 block 頁才載入
- [ ] block 詳情頁顯示 title、type/status、summary、Markdown 內文、prerequisites、related、backlinks、sources
- [ ] backlinks 能列出使用該 block 的 step，以及指向它的其他 block
- [ ] step 頁 `xl` 以上有 sticky 右欄，卡片含 type badge、title、summary；不在本步的 prerequisite 有「先備」chip
- [ ] step 頁 `xl` 以下有可折疊的「本步知識點」，位置在文章後、自我檢查前
- [ ] 點 block 卡或 `[[block-id]]` 都導到 block 詳情頁，且不會整頁重載
- [ ] 沒有 block 的 step 不顯示空右欄或空卡片
- [ ] build-data 測試涵蓋 block summary、step blocks、per-block 全文與 backlinks
- [ ] course-app `gen` / `test` / `build` 綠

## 4. Block 索引頁與知識圖

**What to build:** 新增 subject 層級的知識點入口。`/subject/blocks` 可在清單與圖之間切換；清單列出所有 block 並連到詳情頁；圖用 d3-force + SVG 呈現 block 與 prerequisite／related 邊，固定 seed，支援拖曳、縮放、hover 高亮一階鄰居、點擊開 block、type 篩選與搜尋。subject overview 有「知識圖」入口。圖只載 summary 與邊，不載全文。

**Blocked by:** 2. `/blocks` 萃取 skill 與 pilot；3. Block 詳情頁與 step 右側欄

- [x] `/subject/blocks` 路由可用，頁面可切換清單／圖
- [x] 清單列出所有 block，含 type、title、summary，點擊開詳情頁
- [x] graph 的節點來自 block，邊來自 `prerequisites`（有向）與 `related`（無向）
- [x] graph 用 d3-force + SVG，固定 seed，重新整理後版面一致
- [x] 支援拖曳、縮放、hover 高亮一階鄰居、點擊節點開 block 頁
- [x] 支援 type 篩選與搜尋
- [x] subject overview 有「知識圖」入口
- [x] graph 資料只含 summary 與邊，不含 block 全文
- [x] 行動版可操作，不溢出畫面
- [x] course-app `gen` / `test` / `build` 綠

## 5. 文件與端到端驗收

**What to build:** 把 repo 的主要文件改成 block 的語言：block 是獨立知識點、step 用 `blocks:` 連過去、coverage 是進度報告、edges 已退役。用 pilot subject 從 `/blocks` 跑到 course-app，證明 block 頁、右側欄、索引頁與知識圖都能用，且 verify、course-app 測試與 build 全綠。

**Blocked by:** 3. Block 詳情頁與 step 右側欄；4. Block 索引頁與知識圖

- [ ] AGENTS.md 的架構圖、schema、pipeline、skills 表、operations 都包含 block 與 `/blocks`，且不再提 edges
- [ ] README、verify 文件與 active 文件沒有 edges 殘留；歷史 ADR/spec 保留
- [ ] pilot subject 的 block、step `blocks:`、coverage.json 三方一致
- [ ] step 右側欄、block 詳情頁、索引頁、知識圖都可用
- [ ] `node scripts/verify.mjs --subject <pilot>` 綠
- [ ] coverage `report` 與 `check` 輸出可讀且數字正確
- [ ] course-app `gen` / `test` / `build` 全綠
- [ ] 沒有 stale generated data；git diff 只有預期檔案
- [ ] 文件中的 label 範例都是名詞／專有名詞，沒有句子型 label
