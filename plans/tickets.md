# Tickets: Markdown 課程系統重構

把 step 從「獨立 MDX + HTML lesson」改成「node 裡的一筆資料 + 一篇 Markdown 文章」，並讓 course-app 直接渲染。完整設計見 `plans/md-course-refactor.md`；pilot 在 `learn/agent-harness/`。

一次只做一張票，照順序推進；每張票完成後再開下一張。票與票之間是線性依賴，沒有可並行的分支。

## 1. 地基：舊系統退場，Pilot 在 course-app 可讀

**What to build:** 舊的 HTML lesson pipeline、互動教課、probe/tackle、element/mastery 全部集中到 `legacy/`，主路徑只剩一套 Markdown 流程。同時，學習者打開 course-app 就能選 `agent-harness`，看到 node 頁的兩個 step，點進去讀完整文章，deep link 可直接分享。這張票結束時，新資料格式已經有一個可看的垂直切片。

**Blocked by:** None — can start immediately.

- [ ] `legacy/` 有 README，列出搬入內容與原因；nested `article-agent/` repo 原地不動
- [ ] HTML pipeline、teach / to-article / to-image / probe / tackle、element / mastery / output 不在原本路徑
- [ ] `build-data` 讀 `.md`（不是 `.mdx`），node 的 `steps` 依陣列順序輸出
- [ ] node 頁顯示 title、goal、`## Lesson` 與 step 清單（title + purpose）
- [ ] step 頁用 `react-markdown` 渲染整篇文章，不再外連 lesson HTML
- [ ] 路由支援 `#/<subject>/<node>/<step>`，重整或貼上連結可直接落地
- [ ] 圖片從 `nodes/<node>/<step>-assets/` 供應，Markdown 相對路徑可顯示
- [ ] node 檔內的 `## Steps` 相對連結在編輯器與 GitHub 都可點
- [ ] `cd course-app && npm run build` 通過，dev 目視 pilot 兩個 step

## 2. 驗證與來源：verify 換新，digest 改行號

**What to build:** 一支 `verify` 就能判定新格式是否合法；一份來源進來後，digest 的 L2 是一張行號地圖，agent 可以直接挑「這幾行在講什麼」。PDF 在 ingest 時固定抽成 `.txt`，所有引用都指向它，行號不會漂移。這張票結束時，pilot 的引用是被程式驗過的，而不是人工相信。

**Blocked by:** 1. 地基：舊系統退場，Pilot 在 course-app 可讀

- [ ] root 只保留一個 YAML parser（`gray-matter`），刪掉自製 parser
- [ ] verify 檢查 node frontmatter、`id` = 檔名、`status` 合法、`steps` 無 `deps` / `type` / `order`
- [ ] verify 檢查 step 文章與 node `steps` 雙向一對一、H1 等於 title、`## Steps` 清單一致
- [ ] verify 檢查來源格式 `#Lx-Ly`、檔案存在、範圍合法、切片非空、不得指向 PDF
- [ ] verify 檢查每個 code block 有 `source` 或 `derived` provenance；repo 不得有 `.mdx`
- [ ] 每個規則都有負向 fixture，故意改壞會讓 verify 變紅
- [ ] PDF backfill 指令可重跑，已存在的 `.txt` 不覆蓋
- [ ] `/learn-init`、`/ingest` 產出的 digest 只有 L1 概覽 + L2 行號地圖，不再使用 slug locator
- [ ] verify 確認 step 引用落在某個 digest 行號範圍內；digest 的 `source_lines` 等於 `.txt` 實際行數
- [ ] 拿一個含 PDF 的科目跑通：PDF → `.txt` → digest → verify 綠
- [ ] `node scripts/verify.mjs --subject agent-harness` 綠

## 3. Node 生產線：roadmap 可點、node 有完整 steps

**What to build:** 規劃者從 roadmap 就能點進每個 node；跑完 `/nodes` 後，node 檔裡有完整的一串 step（title、purpose、來源行號、順序），每個 step 都有可點的連結。`/absorb` 也能把新素材追加成 step，不需要回頭手改 frontmatter。

**Blocked by:** 2. 驗證與來源：verify 換新，digest 改行號

- [ ] `/roadmap` 產出的 node 連結是相對於 `ROADMAP.md` 的標準 Markdown 連結
- [ ] 每個 node 連到的檔案存在，frontmatter 是新格式（空 `steps`、`status: draft`）
- [ ] `/nodes` 為每個 step 寫入 `id / title / purpose / sources`，陣列順序即教學順序
- [ ] `/nodes` 寫入的 `## Steps` 清單可點，且與 frontmatter 一致
- [ ] `purpose` 是一句話，不是文章摘要；過長會被 skill 或 verify 擋下
- [ ] `/absorb` 可追加 step，追加後 node 狀態回到 `confirmed`
- [ ] node 的 `status` 從 `draft` 進到 `confirmed`
- [ ] course-app 的 node 頁在文章尚未產生時，仍能列出 step 並標示未寫
- [ ] 一個 node 通過 verify

## 4. 文章與圖片：一次產出可讀的 step

**What to build:** 對一個 node 執行一次 `/article`，每個缺文章的 step 就出現一篇 Markdown 文章：第一行是正確標題、從讀者情境開場、引用來源內容、程式碼有 provenance。再跑一次配圖，文章裡會在正確位置出現正確數量的插圖，重跑不重複花錢。文章與圖片都直接進 course-app，不需要任何 HTML。

**Blocked by:** 3. Node 生產線：roadmap 可點、node 有完整 steps

- [ ] `prompts/article.txt` 以 publisher 語氣為底，不含 type 分流、字數上限、圖片標記、來源區塊
- [ ] CLI 的 `article` 模式讀 node 與 step sources，依行號切出切片（PDF 直接拒絕）
- [ ] 每個 step 一次 text call，寫入 `<step>.md`；預設跳過已存在，`--force` 重生，`--step` 可單跑
- [ ] `/article <subject>/<node>` 是薄殼，回報每個 step 的狀態
- [ ] 生成的文章通過 verify（H1、行號、provenance、連結）
- [ ] 配圖數量由定稿文章的繁中字數決定（1–5 張），計畫插在對應段落之後
- [ ] 圖片輸出到 `nodes/<node>/<step>-assets/image-N.webp`，Markdown 使用相對路徑
- [ ] 已存在的圖直接重用；`--force` 才重生；同一 node 連跑兩次不新增圖片請求
- [ ] verify 檢查圖片存在、格式、`*-assets/` 無孤兒檔；course-app 正確顯示圖片與圖說
- [ ] 舊 Markdown pipeline（`src/pipeline.mjs`、`src/cli.mjs`、publisher/rewrite prompt）搬到 `legacy/`

## 5. 收尾：完整閱讀體驗、端到端驗收、文件定稿

**What to build:** step 頁成為完整的閱讀單位：可以看圖、看題目（如果文章有）、看這一步引用了哪些來源、用 prev/next 走完整個 node；sidebar 不再有假的完成度。然後選一個科目，從來源走到 course-app，全程只用新流程，證明整套系統可以交付。最後把文件對齊，讓下一個 agent 只看文件就能工作。

**Blocked by:** 4. 文章與圖片：一次產出可讀的 step

- [ ] `quiz` code block 渲染成互動題；沒有 block 的文章不受影響
- [ ] 文末來源清單由 node 的 step sources 聚合，顯示檔名與行號
- [ ] prev/next 依 node 的 `steps` 陣列順序，首尾正確隱藏
- [ ] sidebar 移除 status 綠點與任何 mastery/進度概念；不再複製 `public/lessons`
- [ ] 舊科目缺文章時，UI 顯示「尚未產生」而不是壞連結
- [ ] 選一個科目從 ingest → roadmap → nodes → article → 圖片 → 閱讀全流程走完
- [ ] 該科目 `verify` 全綠、`npm run build` 通過、手動走過每個 node 與 step 沒有壞連結
- [ ] repo 內沒有新的 `.mdx`，也沒有新流程引用 `legacy/`
- [ ] `AGENTS.md`、`docs/reference/source-reading.md`、`docs/reference/verify.md` 對齊新格式
- [ ] 移除 probe / tackle / element / mastery 的 schema 描述；記錄 `/practice` 是 out of scope
- [ ] 文件內所有 node/step 連結可點；`legacy/README.md` 說明退場與保留的資產
