# 將 step 課程改造成圖文並茂文章（/to-article → /to-image）

## Problem Statement

`/teach` 產出的 step 有兩份：薄的 step MDX（一行 `## Lesson`）與厚的 HTML 課程（`learn/<subject>/lessons/<node>/<step>.html`，含測驗）。HTML 課程只有文字，缺少視覺輔助；而 `article-agent/` 已經有一套成熟的「原文 → 一次改寫 → 依 agent 決定的配圖計畫逐段生圖 → 組裝」流程，但它是 Markdown 進、Markdown 出。

目標：在 node / step 完成（`content-written`）之後，用兩支新 skill 把既有 HTML 課程改造成圖文並茂的文章。**step 就是文章**，成品就是那份 HTML。**改寫與配圖分成兩個獨立階段**：`/to-article` 只改寫、把純文章發佈上線（不花生圖錢，供人先審稿）；`/to-image` 先規劃配圖位置、再實際生圖並插入。

## Solution

在 learning-center 引入兩支新 skill，並把 `article-agent` 的 pipeline 攤進來改成支援 HTML：

1. 複製 `article-agent/src/` 與 `article-agent/prompts/` 到 repo 根 `src/`、`prompts/`，原 Markdown 流程保留，另加 HTML 流程。
2. `/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N] [-max-parallel N]`：對範圍內每個節點，去掉 quiz/nav/footer 後把每個 step 的 HTML 正文交給文字 LLM 改寫成 HTML（照範本），一批內以有限並行送出（每步恰好一次呼叫）；程式驗證（code 區塊、連結保留）通過後把改寫文寫成 `rewritten.html`，並**直接組裝發佈回正式 `lessons/<node>/<step>.html`（純文章、無圖）**。此階段不插標記、不寫配圖計畫、不動 `illustration`。
3. `/to-image <subject> [tier<N> | node-slug ...] [-max-subagents N] [-plan-only] [-skip-ask]`：**先規劃、再生成**。
   - 規劃：逐 step 讀**正式 lesson**（即已發佈的文章），決定圖片張數與位置，把 `<!--image:N-->` 標記**就地插進正式 lesson**，並寫 `plan.input.json`；程式驗證標記與計畫相符後寫 `plan.json`、設 `illustration: planned`（**不重新組裝**，標記留在原地當插入點）。
   - 生成：逐張生圖，把標記**就地換成 `<figure>`**，設 `illustration: done`。整個流程**永不重建**正式 lesson。
4. step MDX frontmatter 新增選填 `illustration: none | planned | done` 記錄進度；node `status` 梯子不動。

## User Stories

1. 作為學習者，我想要既有的 HTML 課程變成有圖的文章，這樣複習時更容易理解。
2. 作為學習者，我想要在花錢生圖前先看過改寫後的文章（已發佈在正式網址），這樣不滿意可以及早喊停。
3. 作為學習者，我想要在生圖前先確認會生成幾張圖，這樣錢花得安心。
4. 作為學習者，我想要一次對整個 tier 或指定節點批次處理，這樣不用一課一課下指令。
5. 作為學習者，我想要改寫後的事實、程式碼範例與測驗維持可信，這樣教材不會被改壞。
6. 作為學習者，我想要知道哪些 step 已改寫、哪些已配圖，這樣能掌握進度。
7. 作為學習者，我想要圖片放在課程資料夾內並正常上線，這樣不用手動搬檔。
8. 作為學習者，我想要重跑不會把已改寫的文章越改越走樣，也不會把人工潤過的文句蓋掉。
9. 作為維護者，我想要既有的 Markdown article-agent 流程繼續可用，不因新增 HTML 模式而失效。

## Skill 呼叫介面

比照 `batch-nodes` 的輸入風格：

```
/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N] [-max-parallel N]
/to-image   <subject> [tier<N> | node-slug ...] [-max-subagents N] [-plan-only] [-skip-ask]
```

- 不給 scope → 全 roadmap 節點；`tier<N>`（如 `tier2`）→ 該 tier 所有節點；給 slug → 指定節點。
- `/to-article` 解析出的節點內**所有 step** 都改寫（無 HTML 的 step 跳過並回報）；`/to-image` 以 step 為單位。
- 分批：`/to-article` 每批 `max-subagents`（預設 3）**節點**，節點內以 `max-parallel`（預設 2）為上限並行改寫各 step。`/to-image` 的規劃與生成各以 step 為批次單位，每批 `max-subagents`。
- 跳過並回報：`/to-article` 跳過沒有 HTML 的 step（`--skip-existing` 時另跳過已改寫或有 `plan.json` 的 step）；`/to-image` 跳過沒有 HTML 的 step；已有 `plan.json` 的 step 沿用既有計畫（不重新規劃）。
- 兩支 skill 皆 `disable-model-invocation: true`，置於 `.opencode/skills/to-article/SKILL.md` 與 `.opencode/skills/to-image/SKILL.md`。`/to-article` 純 CLI 批次（不開 agent）；`/to-image` 每步開一個 `article-agent`（`plan` 或 `image` 模式）。

Prereqs：`learn/<subject>/MEMORY.md`、`learn/<subject>/ROADMAP.md` 存在；`src/` 已 npm install；`.env` 有 `TEXT_API_KEY`（`/to-article` 與 `/to-image` 規劃皆需要）與圖片金鑰（`/to-image` 生成需要）。

## /to-article pipeline（每步一次文字呼叫，不花生圖錢，純改寫）

1. 輸入：若 `learn/<subject>/output/<node>/<step>/original.html` 存在就讀它，否則讀正式 `learn/<subject>/lessons/<node>/<step>.html`。將原始稿存為 `original.html`（重跑一律從它起算）。
2. 切分：`<head>`（含 `../assets/shared.css` 連結）由程式保留；從 body 移除 quiz、`lesson-nav`、`footer`、`script`。`h1` 與 `.meta` 保留在送給 LLM 的內容中，**允許改寫**。
3. 一次文字呼叫（`.env` 的 `TEXT_MODEL`）。系統 prompt 為 `prompts/html-rewrite.txt`（依 step `type` 附加型別規則）；user 訊息含 `brief`（取自 `MEMORY.md`）與清理後的 HTML。要求只回傳 HTML，**不含任何圖片標記**。成功後寫 `rewritten.html`。
4. 驗證（硬失敗則不覆蓋、回報）：輸出為合法 HTML；原稿所有 code 區塊內容原樣保留；原稿所有 `<a href>` 連結全部保留。
5. 發佈：用 `assembleLesson` 把改寫文接回 quiz、`lesson-nav`、`footer`、`<script src="../assets/quiz.js">`，寫回正式 `learn/<subject>/lessons/<node>/<step>.html`。**這是唯一一次從改寫稿重建正式 lesson 的地方**；之後的階段只在它身上就地編輯。`illustration` 不動（維持 `none`）。
6. 保存 `rewritten.html`、`manifest.json` 至 `learn/<subject>/output/<node>/<step>/`。

## /to-image pipeline（規劃不花錢、生成付費）

1. 解析相同 scope，逐 step 分兩類：已有 `plan.json` 者沿用；其餘需規劃。
2. **規劃**（文字模型，每步一次）：`article-agent`（`plan` 模式）讀正式 lesson，數中文字數決定 1–5 張，挑位置，把 `<!--image:N-->`（N 依序從 1）就地插進正式 lesson，並把 `heading`/`anchor`/`prompt` 寫到 `plan.input.json`。agent 只能新增標記行，不得改寫內文。
3. `node src/html-cli.mjs plan`（純程式、無模型呼叫）：驗證標記數量與順序等於計畫；通過才儲存 `plan.json`，確保 figure 樣式在 `shared.css`，設 `illustration: planned`。**不組裝、不改動 lesson**（標記留在原地，就是後續插入 figure 的契約）。
4. 統計「M 課 / N 張圖」，除 `-skip-ask` 外先列出清單等使用者確認。`-plan-only` 則在此停止，只回報規劃結果。
5. **生成**（圖片模型，每張一次）：`article-agent`（`image` 模式）逐張生圖，先寫到 `output/<node>/<step>/assets/image-N.png`，複製到 `lessons/<node>/<step>-assets/image-N.png`；已存在則跳過（支援續跑與單張重生）。
6. 把正式 lesson 裡的 `<!--image:N-->` **就地換成** `<figure class="lesson-figure"><img src="./<step>-assets/image-N.png" alt=""><figcaption>AI 生成示意圖</figcaption></figure>`；舊版留下的 `lesson-figure pending` 佔位框也順帶遷移。設 `illustration: done`、更新 `manifest.json`。

## Storage layout

```
learn/<subject>/
  lessons/
    assets/shared.css                     ← figure 樣式
    <node>/<step>.html                    ← 文章本體（/to-article 發佈；/to-image 就地插 figure）
    <node>/<step>-assets/image-N.png      ← 配圖（會上線）
  output/                                 ← 工作區 / 紀錄（不上線）
    <node>/<step>/
      original.html                       ← 原稿備份，重跑時讀此
      cleaned.html                        ← 去 quiz/nav/footer 的正文
      plan.input.json                     ← agent 的配圖決定（輸入）
      plan.json                           ← 驗證通過後才寫入的配圖計畫
      rewritten.html                      ← /to-article 的改寫稿（稽核用）
      manifest.json                       ← 各階段狀態、呼叫次數
      assets/image-N.png                  ← 生圖原始輸出
```

`output/` 位於 `lessons/` 之外，因此 `course-app/scripts/build-data.mjs` **不需要修改**（它只複製 `lessons/`）。

## Schema 變更

- step MDX frontmatter 新增**選填**欄位 `illustration: none | planned | done`；缺欄位視為 `none`。`planned` 於 `/to-image` 規劃時寫入、`done` 於生成時寫入。
- `scripts/verify.mjs`：step frontmatter 檢查允許此欄位並驗值（允許集合不變），node `status` 允許清單不變。
- `course-app/scripts/build-data.mjs`：可選擇性把 step 的 `illustration` 帶進輸出（非必要）。
- node container frontmatter 不新增欄位；`status` 梯子與 `absorb` 回溯規則皆不變。
- `AGENTS.md` 更新：pipeline 圖、skills 清單、`/to-article` 與 `/to-image` 描述、`.opencode` 描述。

## 程式落點

- 複製 `article-agent/src/` 與 `article-agent/prompts/` 到 repo 根 `src/`、`prompts/`；原 Markdown 流程與 `cli.mjs` 保持可用（不在本次改動範圍）。
- `src/html-cli.mjs` 模式：`clean`（切分原稿）、`article`（單步改寫＋發佈）、`article-batch`（一節點多步並行改寫＋發佈，`--max-parallel`／`--skip-existing`）、`plan`（驗證標記＋寫 `plan.json`＋標 `planned`）、`image`（生圖＋就地換 figure）。
- `src/html.mjs`：`generateHtmlArticle` 改寫後 `assembleLesson` 發佈正式 lesson；`finalizeHtmlPlan` 驗證正式 lesson 內標記並記錄計畫（不組裝）；`generateHtmlImages` 讀正式 lesson 做 `markerContexts`，以 `markersToFigures` 就地換圖（並保留 `ensureFigure` 的舊佔位框遷移）。
- 根 `.gitignore` 補：`node_modules/`、`.env`、`.env.*`、`!*.env.example`、`learn/*/output/`。

## Testing Decisions

- 以 mock 文字 / 圖片 API 驗證不變量：「每個被改寫的 step 恰好一次文字呼叫」「改寫階段發佈純文章、不寫 plan.json、不標 illustration、不插標記」「plan 驗證正式 lesson 的標記、只寫 plan.json 與 illustration」「image 就地換 figure、不重新組裝、不再呼叫文字模型」「生圖重用已存在的 PNG」。
- 端到端手動驗證：對一個真實 node 跑 `/to-article`，確認審稿 HTML 正常以 shared.css 呈現、quiz 仍在、無圖；再跑 `/to-image`，確認圖出現在 `<step>-assets/` 且頁面正常、quiz 仍在。
- `node scripts/verify.mjs --subject <subject>` 需通過（`illustration` 欄位合法）。

## Out of Scope

- 不改動 step MDX 的 `## Lesson` 一行摘要（維持現狀）。
- 不改動 node `status` 梯子、`mastery.md`、`ROADMAP.md`、`/edges`、`/absorb`。
- 不改動 `build-data.mjs` 的複製邏輯（`output/` 在 `lessons/` 外）。
- 不新增圖片風格選項或每科 `imageStyle`（沿用既有 `prompts/image.txt` 中文資訊圖風格）。
- 不處理沒有 HTML 課程的 step（跳過並回報）。
- 不提供單一 step 的呼叫語法（僅 subject / tier / node slug）。
- 不改動舊的 Markdown pipeline（`article-agent/`、`cli.mjs`、`pipeline.mjs` 的 `generateArticle` 路徑、`prompts/rewrite.txt`／`publisher.txt`）。

## Further Notes / 預設值

- 圖說：`AI 生成示意圖`；未生成的圖先以 `<!--image:N-->` 標記留在正式 lesson（不顯示佔位框），生成時才換成 `<figure>`。
- 原稿備份存 `output/<node>/<step>/original.html`，不依賴 git；重跑 `/to-article` 一律從 original 起算，避免越改越失真。
- AI 生成圖片的中文字可能出錯或有亂碼，發佈前需人工核對。
- `plan.json` 內含生圖 prompt，不會上線（`output/` 不上線）。
- HTML 模式比純文字更容易出錯，改寫模型沿用 `.env` 的 `TEXT_MODEL`；若品質不佳再考慮調整。
