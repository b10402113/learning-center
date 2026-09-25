# 將 step 課程改造成圖文並茂文章（/to-article → /to-image）

## Problem Statement

`/teach` 產出的 step 有兩份：薄的 step MDX（一行 `## Lesson`）與厚的 HTML 課程（`learn/<subject>/lessons/<node>/<step>.html`，含測驗）。HTML 課程只有文字，缺少視覺輔助；而 `article-agent/` 已經有一套成熟的「原文 → 一次改寫 → 依 agent 決定的配圖計畫逐段生圖 → 組裝」流程，但它是 Markdown 進、Markdown 出。

目標：在 node / step 完成（`content-written`）之後，用兩支新 skill 把既有 HTML 課程改造成圖文並茂的文章。**step 就是文章**，成品就是那份 HTML。`/to-article` 只改寫與規劃配圖（不花生圖錢），供人先審稿；`/to-image` 才實際生圖並插入。

## Solution

在 learning-center 引入兩支新 skill，並把 `article-agent` 的 pipeline 攤進來改成支援 HTML：

1. 複製 `article-agent/src/` 與 `article-agent/prompts/` 到 repo 根 `src/`、`prompts/`，原 Markdown 流程保留，另加 HTML 流程。
2. `/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N]`：對範圍內每個 step，去掉 quiz/nav/footer 後把 HTML 正文交給文字 LLM 改寫成 HTML（照範本），並在適合位置放 `<!--image:N-->`；寫回正式 HTML（佔位框形式）並記錄配圖計畫。
3. `/to-image <subject> [tier<N> | node-slug ...] [-max-subagents N] [-skip-ask]`：讀配圖計畫逐張生圖，插入 `<figure>`，完成文章。
4. step MDX frontmatter 新增選填 `illustration: none | planned | done` 記錄進度；node `status` 梯子不動。

## User Stories

1. 作為學習者，我想要既有的 HTML 課程變成有圖的文章，這樣複習時更容易理解。
2. 作為學習者，我想要在花錢生圖前先看過改寫後的文章，這樣不滿意可以及早喊停。
3. 作為學習者，我想要一次對整個 tier 或指定節點批次處理，這樣不用一課一課下指令。
4. 作為學習者，我想要改寫後的事實、程式碼範例與測驗維持可信，這樣教材不會被改壞。
5. 作為學習者，我想要知道哪些 step 已改寫、哪些已配圖，這樣能掌握進度。
6. 作為學習者，我想要圖片放在課程資料夾內並正常上線，這樣不用手動搬檔。
7. 作為學習者，我想要重跑不會把已改寫的文章越改越走樣。
8. 作為維護者，我想要既有的 Markdown article-agent 流程繼續可用，不因新增 HTML 模式而失效。

## Skill 呼叫介面

比照 `batch-nodes` 的輸入風格：

```
/to-article <subject> [tier<N> | node-slug ...] [-max-subagents N]
/to-image   <subject> [tier<N> | node-slug ...] [-max-subagents N] [-skip-ask]
```

- 不給 scope → 全 roadmap 節點；`tier<N>`（如 `tier2`）→ 該 tier 所有節點；給 slug → 指定節點。
- 解析出的節點內**所有 step** 都處理。
- 分批：每批 `max-subagents`（預設 3）節點，批次內平行（`task` subagent，`subagent_type: teach-agent`），批次間循序；結束後回報完成 / 失敗 / 跳過。
- 跳過並回報：`/to-article` 跳過沒有 HTML 的 step；`/to-image` 跳過沒有 `plan.json` 的 step。
- 兩支 skill 皆 `disable-model-invocation: true`，置於 `.opencode/skills/to-article/SKILL.md` 與 `.opencode/skills/to-image/SKILL.md`，內含比照 batch-nodes 的 embedded subagent prompt。

Prereqs：`learn/<subject>/MEMORY.md`、`learn/<subject>/ROADMAP.md` 存在；`src/` 已 npm install；`.env` 有金鑰。

## /to-article pipeline（每步一次文字呼叫，不花生圖錢）

1. 輸入：若 `learn/<subject>/output/<node>/<step>/original.html` 存在就讀它，否則讀正式 `learn/<subject>/lessons/<node>/<step>.html`。將原始稿存為 `original.html`。
2. 切分：`<head>`（含 `../assets/shared.css` 連結）由程式保留；從 body 移除 quiz、`lesson-nav`、`footer`、`script`。`h1` 與 `.meta` 保留在送給 LLM 的內容中，**允許改寫**。
3. Agent 讀清理後的 HTML，決定 `imagePlan`（1–5 項，每項 `heading`、`anchor`、`prompt`）。
4. 一次文字呼叫（沿用 article-agent 方法、`.env` 的 `TEXT_MODEL`）。系統 prompt 為新增的 `prompts/html-rewrite.txt`；user 訊息含 `brief`（取自 `MEMORY.md` 的語言與教學偏好）、`imagePlan`、清理後的 HTML。要求回傳 HTML，並在對應區塊後放獨立一行的 `<!--image:N-->`。
5. 驗證（硬失敗則不覆蓋、保留原稿、回報）：
   - 標記數量與順序等於 `imagePlan`；
   - 輸出為合法 HTML（可解析）；
   - 原稿所有 code 區塊內容原樣保留；
   - 原稿所有 `<a href>` 連結全部保留。
6. 組裝：LLM 回傳的 body + 接回 quiz、`lesson-nav`、`footer`、`<script src="../assets/quiz.js">`。寫回正式 `learn/<subject>/lessons/<node>/<step>.html`，每個 `<!--image:N-->` 直接換成指向未來圖片路徑的 `<figure>`（圖還沒生成也先寫好路徑）：
   ```html
   <figure class="lesson-figure"><img src="./<step>-assets/image-N.png" alt=""><figcaption>AI 生成示意圖</figcaption></figure>
   ```
7. 改寫成功後才儲存 `plan.json`（失敗則不留，避免 `/to-image` 撿到沒改寫過文章計畫），並儲存 `rewritten.html`、`manifest.json` 至 `learn/<subject>/output/<node>/<step>/`；step MDX 設 `illustration: planned` 並更新 `updated`。
8. 確保 `learn/<subject>/lessons/assets/shared.css` 含 figure 樣式（缺則附加）。

## /to-image pipeline（付費）

1. 解析相同 scope，統計「M 課 / N 張圖」（各 step 的 `plan.json` 項目數）。
2. 除 `-skip-ask` 外，先列出清單等使用者確認。
3. 逐張生圖（沿用 article-agent 生圖方法、`.env` 的 `IMAGE_MODEL`、既有 `prompts/image.txt` 風格）：圖片先寫到 `learn/<subject>/output/<node>/<step>/assets/image-N.png`；已存在則跳過（支援續跑與單張重生）。
4. 複製到 `learn/<subject>/lessons/<node>/<step>-assets/image-N.png`。
5. 確認每張圖的 `<figure><img src="./<step>-assets/image-N.png" alt=""><figcaption>AI 生成示意圖</figcaption></figure>` 存在（新流程在 `/to-article` 已寫入正確路徑）；若遇到舊版留下的 `lesson-figure pending` 佔位框，就地在該處換成上面的 `<figure>`。
6. step MDX 設 `illustration: done`、更新 `updated`；更新 `manifest.json`。

## Storage layout

```
learn/<subject>/
  lessons/
    assets/shared.css                     ← 新增 figure 樣式
    <node>/<step>.html                    ← 文章本體
    <node>/<step>-assets/image-N.png      ← 配圖（會上線）
  output/                                 ← 工作區 / 紀錄（不上線）
    <node>/<step>/
      original.html                       ← 原稿備份，重跑時讀此
      cleaned.html                        ← 去 quiz/nav/footer 的正文，供 agent 決定配圖
      plan.input.json                     ← agent 的配圖決定（輸入）
      plan.json                           ← 改寫成功後才寫入的配圖計畫
      rewritten.html                      ← 改寫後全文（含標記）
      manifest.json                       ← 各階段狀態、呼叫次數
      assets/image-N.png                  ← 生圖原始輸出
```

`output/` 位於 `lessons/` 之外，因此 `course-app/scripts/build-data.mjs` **不需要修改**（它只複製 `lessons/`）。

## Schema 變更

- step MDX frontmatter 新增**選填**欄位 `illustration: none | planned | done`；缺欄位視為 `none`。
- `scripts/verify.mjs`：step frontmatter 檢查允許此欄位並驗值（新增允許集合），node `status` 允許清單不變。
- `course-app/scripts/build-data.mjs`：可選擇性把 step 的 `illustration` 帶進輸出（非必要）。
- node container frontmatter 不新增欄位；`status` 梯子（`draft → probed → confirmed → nodes-written → content-written → edges-written`）與 `absorb` 回溯規則皆不變。
- `AGENTS.md` 需更新：架構樹（新增根 `src/`、`prompts/` 與 `learn/<subject>/output/`）、pipeline 圖（新增 `/to-article`、`/to-image`）、skills 清單、step 格式（`illustration`）。

## 程式落點

- 複製 `article-agent/src/`（`pipeline.mjs`、`cli.mjs`、`pipeline.test.mjs`、`test.ts`）與 `article-agent/prompts/`（`publisher.txt`、`rewrite.txt`、`image.txt`）到 repo 根 `src/`、`prompts/`。
- 新增根 `package.json`（依賴 `openai`）、`.env`（複製自 article-agent 並填金鑰）；於根目錄 `npm install`。原 Markdown 流程與 `cli.mjs` 保持可用。
- 新增 `src/html.mjs`（HTML pipeline：清理、改寫呼叫、驗證、組裝、生圖插入）與 `prompts/html-rewrite.txt`；`prompts/image.txt` 沿用。
- 新增薄 CLI `src/html-cli.mjs` 供兩支 skill 呼叫（每次處理一個 step，模式 `article` 或 `image`，並接受 subject/node/step 路徑與 scope 參數）。
- 根 `.gitignore` 補：`node_modules/`、`.env`、`.env.*`、`!*.env.example`、`learn/*/output/`。

## Testing Decisions

- 沿用 `article-agent/src/pipeline.test.mjs` 的 mock API 測試思路，為 `src/html.mjs` 新增單元測試：清理（去 quiz/nav/footer）、標記解析與驗證、code/連結保留驗證、組裝（接回 quiz/nav/footer/script、`<figure><img>` 路徑與舊版佔位框遷移）、resume（既有 original/plan/assets 行為）。
- 以 mock 文字 / 圖片 API 驗證「每次 /to-article 只呼叫一次文字模型」「生圖後不再呼叫文字模型」「標記不符即失敗」「改寫失敗不留 plan.json」。
- 端到端手動驗證：對一個真實 node 跑 `/to-article`，確認審稿 HTML 正常以 shared.css 呈現、`<img>` 路徑已指向未來圖片；再跑 `/to-image`，確認圖出現在 `<step>-assets/` 且頁面正常、quiz 仍在。
- `node scripts/verify.mjs --subject <subject>` 需通過（`illustration` 欄位合法）。

## Out of Scope

- 不改動 step MDX 的 `## Lesson` 一行摘要（維持現狀）。
- 不改動 node `status` 梯子、`mastery.md`、`ROADMAP.md`、`/edges`、`/absorb`。
- 不改動 `build-data.mjs` 的複製邏輯（`output/` 在 `lessons/` 外）。
- 不新增圖片風格選項或每科 `imageStyle`（沿用既有 `prompts/image.txt` 中文資訊圖風格）。
- 不處理沒有 HTML 課程的 step（跳過並回報）。
- 不提供單一 step 的呼叫語法（僅 subject / tier / node slug）。

## Further Notes / 預設值

- 圖說：`AI 生成示意圖`；未生成的圖先寫好 `<img>` 路徑（不顯示佔位框）；`-max-subagents` 預設 3。
- 原稿備份改存 `output/<node>/<step>/original.html`，不依賴 git；重跑 `/to-article` 一律從 original 起算，避免越改越失真。
- AI 生成圖片的中文字可能出錯或有亂碼，發佈前需人工核對。
- `plan.json` 內含生圖 prompt，不會上線（`output/` 不上線）。
- HTML 模式比純文字更容易出錯，改寫模型沿用 `.env` 的 `TEXT_MODEL`；若品質不佳再考慮調整。
