# Tickets: 把配圖生成從 `/article` 拆成 `/generate-images`

把「寫文章」、「去 AI 味」、「畫圖」拆成三個可獨立重跑的階段，讓 `/article` 只產文字、配圖清單與 marker，`/generate-images` 只渲染圖片。完整設計見 [`split-image-generation.md`](split-image-generation.md)。

Work the **frontier**：任何 blocker 都完成的票就可以開始。1 是 prefactor，2 完成後 3 與 4 可並行，5 等 2、3、4，6 最後收尾。

## 1. 配圖清單定位：單一路徑與清理

**What to build:** 把 publisher 寫的配圖清單搬到正式位置 `learn/<subject>/output/image-plans/<node>/<step>.json`，讓 `prepare`、publisher、`run-article-agent`、`reset-nodes` 與 legacy `image` 模式都讀寫同一份。這是 prefactor：既有 `/article` 仍然會生圖，使用者看到的行為不變，但後續拆分不必再處理兩份 plan。

**Blocked by:** None — can start immediately.

- [ ] `prepare` 回報的 `plan` 指向 `output/image-plans/<node>/<step>.json`
- [ ] `run-article-agent` 從同一路徑讀 plan，`anchor` 逐字驗證照舊
- [ ] `reset-nodes` 會刪掉該 step 的正式 plan，也會清掉舊版 `output/jobs/<slug>.plan.json`（若存在）
- [ ] legacy `image` 模式與新路徑並存，不再產生第二份 plan
- [ ] 既有 `/article` 流程（含生圖與 publish）仍可跑，`npm test` 與 article-agent 測試綠
- [ ] 既有文章與圖片不被修改

## 2. `/article` 產生文字、配圖清單與 marker，不再生圖

**What to build:** 對一個 node 跑 `/article`，每個需要寫的 step 產出 `step.md`（文字 + `<!--image:N-->`）、一份 1–5 項的配圖清單，以及一個標記 `written` 的 node；整個流程不呼叫圖片模型、不建立 `<step>-assets/`。`publish` 只還原 code、對齊 H1、寫入文章，不再同步或刪除圖片。`--force` 重寫成功後才清掉該 step 的舊圖與 humanize 紀錄。既有文章（沒有 plan / marker）照舊跳過。

**Blocked by:** 1. 配圖清單定位：單一路徑與清理

- [x] `/article <subject>/<node>` 的每個新 step 都有文章、正式 plan、marker 數量等於 plan 長度；沒有新圖
- [x] `prepare` 的 `command` 帶 `--markers-only`；`skipped[]` 只回報 `id` / `title` / `status` / `path`，不再計算圖片
- [x] `run-article-agent --markers-only` 在沒有 plan 時失敗；rewrite 少 marker、重複或順序錯時失敗，不 publish
- [x] markers-only 執行後 manifest 是 `completed`、`images: []`、`imageRequests: 0`、`markersOnly: true`，且不需要 `IMAGE_API_KEY`
- [x] `publish` 不呼叫圖片同步、不刪 `<step>-assets/`、保留 marker；只有成功寫入 step 後才清舊 `image-N.webp` 與 humanize 紀錄；寫入失敗時舊圖保留
- [x] `/article` skill 與 `publisher` agent 不再提生圖、`--images`、`--no-images`、`*AI 生成示意圖*`；publisher 只寫 original + plan，再跑 command
- [x] verify 對只有 marker、沒有圖片行的文章綠；既有文章與圖片不被修改
- [x] 舊 `article` / `image` CLI 仍可用，usage 標 deprecated
- [x] `npm test`、`npm --prefix article-agent test` 綠

## 3. `/generate-images` 把 marker 渲染成圖片

**What to build:** 對一個 node 跑 `/generate-images`，只挑有 plan 的 step，依文章中的 marker 逐張生成或重用 WebP，再把 marker 換成沒有 caption 的圖片行。它不規劃、不改散文、不讀 `anchor`；重跑不重複花錢，`--force` 只重畫。

**Blocked by:** 2. `/article` 產生文字、配圖清單與 marker，不再生圖

- [ ] 有 plan + marker 的 step：產生 `image-N.webp`，marker 變成 `![第 N 段配圖](./<step>-assets/image-N.webp)`，沒有 `*AI 生成示意圖*`
- [ ] 第二次跑沒有 `--force`：重用既有圖片，不呼叫圖片模型，文章不變
- [ ] `--force`：重畫所有 marker 對應圖片，圖片行位置不變；沒有 marker 但有圖片行時只重畫檔案，不動圖片行
- [ ] marker 數量或順序與 plan 不符時 `failed`，文章不動；有 plan 但沒有 marker 也沒有圖片行時 `no-markers`
- [ ] 沒有 plan 的既有文章 `no-plan`；已有圖片行、沒有 marker 時 `already-rendered`
- [ ] 部分完成可續跑：已存在的圖重用，只補缺的；單張失敗時文章保持 marker，已寫入的圖保留
- [ ] `--step`、`--max-parallel` 可用；render 不需要文字模型或 `TEXT_API_KEY`
- [ ] `/generate-images` skill 只描述渲染，不含規劃、`anchor`、`--plan-only`
- [ ] verify 綠；`npm test` 綠，新增 render 測試涵蓋上述狀態
- [ ] 既有文章與圖片不被修改

## 4. `/humanize-article` 去 AI 味並同步修改清單

**What to build:** 對一個 node 跑 `/humanize-article`，只處理有 plan 且有 marker（或已有圖片行）的 step；在備份工作區改文章與 plan 的 `heading` / `prompt`，驗證通過才寫回，並留下 hash 紀錄。重跑跳過已處理的 step，`--force` 才重做；沒有 plan 的既有文章完全不動。

**Blocked by:** 2. `/article` 產生文字、配圖清單與 marker，不再生圖

- [ ] 有 plan + marker 且無有效紀錄：文章被改寫，plan 的 `heading` / `prompt` 可變，`anchor` 不變，marker 數量 / 順序、圖片行、H1、code / provenance、quiz、相對連結完全不變
- [ ] 寫回前驗證失敗（marker 被改、code / quiz 被動、plan 結構或 `anchor` 改變）時，正式檔不動、不寫紀錄，工作區保留
- [ ] 成功後寫 `output/humanized/<node>/<step>.json`，內含時間、文章與 plan 的 sha256、`changed`、`summary`；工作區刪除
- [ ] 已有紀錄且 hash 相符時 `skipped-record`；檔案被手動改過導致 hash 不符時重新 humanize；`--force` 忽略紀錄重做
- [ ] 沒有 plan 時 `skipped-no-plan`；有 plan 但沒有 marker 也沒有圖片行時 `skipped-not-published`；沒有文章 body 時跳過
- [ ] `/article --force` 會在成功重寫後刪掉該 step 的 humanize 紀錄；`reset-nodes` 會清掉紀錄與工作區
- [ ] `/humanize-article` skill 與 humanize agent 存在，載入 `speak-human-tw`、非互動模式、列出保護清單
- [ ] `npm test` 綠，reset-nodes 測試涵蓋 plan、humanized 紀錄、工作區、assets 的清理
- [ ] 既有文章與圖片不被修改

## 5. `/batch-nodes` 五段流程

**What to build:** `/batch-nodes` 依序跑 Nodes → Article → Humanize → Generate → Quiz。Article 只產文字、plan、marker；Humanize 只處理有 plan 的 step；Generate 只渲染 marker；Quiz 照舊。每個階段可跳過、可續跑、可 `-force`，失敗只影響下游階段並在報告中列出。

**Blocked by:** 2. `/article` 產生文字、配圖清單與 marker，不再生圖；3. `/generate-images` 把 marker 渲染成圖片；4. `/humanize-article` 去 AI 味並同步修改清單

- [ ] 五個階段按順序執行，`-nodes-only`、`-skip-article`、`-skip-humanize`、`-skip-images`、`-skip-quiz`、`-no-continuity`、`-force` 行為與文件一致；`-no-images` 移除並提示改用 `-skip-images`
- [ ] Article 的 publisher prompt 只要求 original + plan + `--markers-only`，不再要求生圖
- [ ] Humanize 只排有 plan、文章有 body、沒有有效紀錄的 step；Generate 只排有 plan 的 step；Quiz 在文章有 body 時仍可獨立跑
- [ ] 失敗傳播正確：Article 失敗的 node 不進 Humanize / Generate / Quiz；Humanize 失敗不進 Generate；Generate 失敗不進 Quiz；已成功檔案保留
- [ ] 每個階段結束後跑對應 verify；Quiz 有寫入 sidecar 時重建 course-app 資料
- [ ] 前置條件檢查（`node_modules`、`article-agent`、`TEXT_API_KEY`、`IMAGE_API_KEY`）在派工前完成，缺 key 時停止並指名
- [ ] 最終報告列出每階段 planned / published / humanized / rendered / written、skipped 原因、failed 與 verify 結果
- [ ] 用一個 scratch node 跑完整五段，既有文章不被修改

## 6. 文件與端到端驗收

**What to build:** 把 repo 的主要文件改成三條命令的語言：`/article` 只寫文字與 marker，`/humanize-article` 去 AI 味，`/generate-images` 才畫圖；舊 `image` / `article` 標成 deprecated。最後用一個新 node 從 `/article` 走到 `/generate-images`，證明既有文章沒被動到、marker-only 文章 verify 綠、新圖沒有 caption。

**Blocked by:** 2. `/article` 產生文字、配圖清單與 marker，不再生圖；3. `/generate-images` 把 marker 渲染成圖片；4. `/humanize-article` 去 AI 味並同步修改清單；5. `/batch-nodes` 五段流程

- [ ] `AGENTS.md` 的架構圖、pipeline、skills 表、核心原則第 8 條、step 格式、operations、reset-nodes、batch flags 都對齊新流程
- [ ] `README.md`、`docs/reference/skill-scope.md`、`docs/reference/verify.md` 不再說 `/article` 生圖；`verify` 文件說明 marker 是註解、不要求對應圖片，有圖片行才檢查檔案
- [ ] 舊 `image` / `article` CLI 文件標 deprecated，但指令仍可用
- [ ] `node scripts/verify.mjs --subject agent-harness` 綠
- [ ] `npm test` 與 `npm --prefix article-agent test` 全綠
- [ ] 用 scratch node 跑 `/article` → `/humanize-article` → `/generate-images`：有 plan、marker、humanize 紀錄、無 caption 圖片；再跑一次 humanize 全部 `skipped-record`、再跑 generate 全部 `already-rendered`
- [ ] `git status` 顯示既有文章未被修改，只有 scratch node、文件與預期檔案變動
- [ ] 文件內沒有殘留 `*AI 生成示意圖*` 的新流程描述，也沒有把配圖寫成 publisher 的責任
