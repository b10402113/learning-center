# 計畫：把配圖生成從 `/article` 拆成 `/generate-images`

## 0. 摘要

把「寫文章」與「畫圖」拆成三個可獨立重跑的階段：

```text
/article
  寫文章 + 寫配圖清單 + 在文章裡留 <!--image:N-->
  不畫圖

        ↓

/humanize-article
  改文章用字 + 改配圖清單的 heading / prompt
  不動 <!--image:N-->、圖片行、程式碼、quiz

        ↓

/generate-images
  照配圖清單畫圖 + 把 <!--image:N--> 換成圖片行
  不規劃、不改文章其他內容
```

`/article` 仍然產出配圖清單（publisher 決定 1–5 張），但不再呼叫圖片模型。既有文章完全不動；只有 `/article` 新產或 `--force` 重產的 step 會走新流程。

---

## 1. 背景與現況

### 1.1 現在的 `/article`

目前 `.opencode/skills/article/SKILL.md` 把三件事綁在一起：

1. `prepare` 產生 publisher job，包含 `original` 與 `plan`。
2. `publisher` 寫 original 與 `plan`（1–5 張，含 `heading`、逐字 `anchor`、`prompt`）。
3. `run-article-agent.mjs` 讀 original + plan，讓 `article-agent`：
   - 改寫文章；
   - 依 plan 在文章裡放 `<!--image:N-->`；
   - 逐張生圖；
   - 把 marker 換成圖片行。
4. `publish` 把結果寫進 `learn/<subject>/nodes/<node>/<step>.md`，並把圖片轉成 WebP、同步到 `<step>-assets/`。
5. 主 agent 補連續性。
6. verify。

### 1.2 為什麼要拆

- `/article` 一旦生圖，中間沒有位置插 humanize。
- 圖片花錢，但文章可能還沒定稿。
- plan 與圖片的生命週期不同：文章會重寫，圖片可以重用或重畫。
- `publish` 目前會 `syncStepImages`，純文字重跑會把既有圖片刪掉，狀態不清楚。
- 希望每個 skill 只做一件事：寫文章、去 AI 味、畫圖。

### 1.3 現有可重用的東西

- `src/article.mjs` 已經有：
  - `expectedImageCount()`：依字數決定 1–5 張（legacy 用）。
  - `insertImageMarkers()`、`replaceImageMarkers()`：marker 插入與替換（legacy 用）。
  - `runImages()`：讀已發佈文章、規劃、生圖（legacy `image` 模式）。
- `article-agent/src/pipeline.mjs` 已經有：
  - `parseImagePlanMarkers()`：驗證 marker 數量與順序，取得 marker 前一段文字。
  - `insertImages()`：把 marker 換成圖片行（目前含 `*AI 生成示意圖*`）。
- `docs/specs/to-article-to-image.md` 已經有一版 `/to-article`（純文字）→ `/to-image`（先規劃、再生成）的設計，可當概念先例。
- `scripts/verify.mjs` 已經會檢查圖片存在、格式、孤兒檔；marker 是 HTML 註解，不影響 verify。

### 1.4 現有耦合點（要拆掉的）

| 位置 | 現在的耦合 |
| --- | --- |
| `src/article-cli.mjs` `prepareArticles` | `steps[].plan` 指向 `output/jobs/<slug>.plan.json`；`skipped[]` 會檢查圖片狀態 |
| `src/article-cli.mjs` `publishArticles` | 呼叫 `syncStepImages`，會刪除再複製 `<step>-assets/` |
| `scripts/publish-article.mjs` | `rewriteImageLinks` + `syncStepImages` |
| `scripts/run-article-agent.mjs` | 有 plan 就一定生圖；`--no-images` 則連 plan 都不帶 |
| `article-agent/src/pipeline.mjs` | rewrite 後直接進 `parseImagePlanMarkers` 與生圖，沒有「只到 marker」的停止點 |
| `.opencode/agent/publisher.md` | 被要求寫 plan 並執行 `article_generate`（其實是 wrapper），會生圖 |
| `AGENTS.md` / skills | 把配圖寫成 `/article` 的一部分 |
| `plans/tickets.md`（舊） | 舊計畫；本次以本文件為準，不改舊票 |

---

## 2. 已定決策（Locked Decisions）

| # | 決策 | 說明 |
| --- | --- | --- |
| D1 | `/article` 仍然產出配圖清單 | publisher 決定 1–5 張；但 `/article` 不畫圖 |
| D2 | `/generate-images` 純渲染 | 不規劃、不新增圖片、不決定位置 |
| D3 | `/humanize-article` 是新 skill | 去 AI 味，改文章與清單的 `heading`／`prompt` |
| D4 | 配圖清單只有一份 | `learn/<subject>/output/image-plans/<node>/<step>.json`；不再有 jobs plan 與正式 plan 兩份 |
| D5 | marker 由 rewrite 放進最終文章 | `/article` 的 rewrite 帶著 plan 放 `<!--image:N-->`，之後 publish 保留 |
| D6 | 既有文章完全不動 | 沒有 plan 的 step，humanize 與 generate 都跳過；不做 backfill |
| D7 | 新圖不再有 caption | 移除 `*AI 生成示意圖*`；舊文章不動，所以舊 caption 留著 |
| D8 | `anchor` 不 humanize | `anchor` 是定位／稽核欄位，不是讀者文字；humanize 只改 `heading`／`prompt` |
| D9 | render 是 marker-based | `/generate-images` 只看 marker，不看 `anchor` |
| D10 | 舊 CLI 模式先留著 | `image`、`article` 標成 deprecated，不進新鏈，不刪程式與測試 |
| D11 | humanize 有打勾紀錄 | `output/humanized/<node>/<step>.json`；重跑跳過，`--force` 才重做 |
| D12 | `/article --force` 刪舊圖 | 成功 publish 後才刪該 step 的 `<step>-assets/` 與 humanize 紀錄 |

---

## 3. 非目標

- 不幫既有文章補 plan / marker / 圖。
- 不讓 `/generate-images` 重新規劃或自動 replan。
- 不改 `sources/`、不改 step 的 `sources` 欄位。
- 不改 node 的 `steps` 陣列或狀態機。
- 不改 course-app 的資料格式；只會少一行 caption。
- 不做圖片審查 UI、不做圖片版本控制。
- 不刪 `legacy/` 或 `docs/specs/to-article-to-image.md`。
- 不改 `article-agent/` 的 legacy 完整生圖行為（只新增 markers-only 停止點）。

---

## 4. 最終流程

### 4.1 單一 node

```text
/article <subject>/<node>
  1. prepare：切素材，列出 publisher job
  2. 每個 step 一個 publisher：
     - 寫 original
     - 寫 image-plans/<node>/<step>.json
     - 執行 run-article-agent --markers-only
  3. publish：寫 step.md（含 marker），不碰 assets
  4. 連續性編修
  5. verify

        ↓

/humanize-article <subject>/<node> [--step <id>] [--force]
  1. 只挑有 plan 的 step
  2. 每步複製到 output/humanize/<node>/<step>/
  3. humanize subagent 改文章與 plan 的 heading/prompt
  4. 驗證 marker、圖片行、程式碼、quiz、plan 結構
  5. 寫回正式文章與 plan，寫 output/humanized/<node>/<step>.json
  6. verify

        ↓

/generate-images <subject>/<node> [--step <id>] [--force]
  1. 只挑有 plan 的 step
  2. 讀 marker 與 plan
  3. 逐張生圖（或重用）
  4. 把 marker 換成圖片行（無 caption）
  5. verify
```

### 4.2 `batch-nodes`

```text
Nodes → Article → Humanize → Generate → Quiz
```

- Article：文字 + plan + marker。
- Humanize：只處理有 plan 的 step。
- Generate：只處理有 plan + marker 的 step。
- Quiz：文章有 body 就出題。

---

## 5. 資料契約

### 5.1 文章：`learn/<subject>/nodes/<node>/<step>.md`

- 無 frontmatter；第一行 `# <title>`。
- `/article` 產出時含 marker，不含圖片行。
- `/generate-images` 產出後，marker 變成圖片行。
- 圖片行格式（新流程）：

```markdown
![第 N 段配圖](./<step>-assets/image-N.webp)
```

- **沒有**下一行的 `*AI 生成示意圖*`。
- marker 格式：

```markdown
<!--image:N-->
```

- marker 必須獨立成行，前後各一個空行。
- marker 的 N 從 1 開始，順序與 plan 相同，每個 plan item 恰好一個 marker。

### 5.2 配圖清單：`learn/<subject>/output/image-plans/<node>/<step>.json`

唯一一份，publisher 寫、humanize 改、generate 讀。

```json
[
  {
    "index": 1,
    "heading": "什麼是 harness",
    "anchor": "文章裡的一句原文",
    "prompt": "畫一個人站在模型與工具之間"
  }
]
```

規則：

- 長度 1–5。
- `index` 必須是 1..N，順序遞增。
- `anchor` 在 publisher 寫入時，必須逐字出現在 publisher 的 `original`。
- `anchor` 之後不再修改，也不因 humanize 而改。
- `heading`、`prompt` 可以被人類或 humanize 修改。
- `prompt` 用台灣繁體中文描述概念；不要指定畫風、配色、背景、媒材（由 `prompts/image.txt` 決定）。
- 不新增事實、數字或統計。

### 5.3 Humanize 打勾紀錄：`learn/<subject>/output/humanized/<node>/<step>.json`

```json
{
  "humanized_at": "2026-10-26T22:40:00.000Z",
  "article_sha256": "…",
  "plan_sha256": "…",
  "changed": true,
  "summary": "改了 12 處：刪掉空話、修正中國用語、補了兩個具體例子"
}
```

規則：

- 有紀錄就跳過，除非 `--force`。
- `article_sha256` / `plan_sha256` 是 humanize 後的檔案 hash。若之後檔案被手動改過，hash 不符，視為 stale，重新 humanize。
- `/article --force` 成功 publish 後刪掉這份紀錄。
- `reset-nodes` 清掉這份紀錄。
- 這個檔案只放 `output/`，不進 `learn/` 的內容目錄。

### 5.4 Humanize 工作區：`learn/<subject>/output/humanize/<node>/<step>/`

- `article.md`：要給 subagent 改的工作副本。
- `plan.json`：要給 subagent 改的工作副本。
- `original-article.md` / `original-plan.json`：備份，用來驗證或回滾。
- 成功後刪除工作區；失敗時保留供檢查。

### 5.5 狀態碼

`/generate-images` 的 per-step 狀態：

| 狀態 | 意義 | 是否失敗 |
| --- | --- | --- |
| `rendered` | 至少換了一個 marker；圖片可能有重用 | 否 |
| `already-rendered` | 沒有 marker，但已有圖片行 | 否（跳過） |
| `no-plan` | 沒有配圖清單（既有文章） | 否（跳過） |
| `no-markers` | 有 plan，但文章沒有 marker 也沒有圖片行 | 是 |
| `failed` | marker 數量／順序不符、圖片 API 失敗、檔案寫入失敗 | 是 |

`/humanize-article` 的 per-step 狀態：

| 狀態 | 意義 |
| --- | --- |
| `humanized` | 成功改寫並寫回 |
| `skipped-record` | 已有打勾紀錄，跳過 |
| `skipped-no-plan` | 沒有 plan（既有文章） |
| `skipped-not-published` | 有 plan，但文章沒有 marker 也沒有圖片行（可能是 `/article` 失敗） |
| `failed` | subagent 失敗或驗證失敗；原檔不動 |

---

## 6. `/article` 詳細行為

### 6.1 `prepare`

```bash
node src/article-cli.mjs prepare --subject <subject> --node <node> [--step <id>] [--force]
```

輸出：

```json
{
  "mode": "prepare",
  "subject": "...",
  "node": "...",
  "steps": [
    {
      "id": "step-id",
      "title": "步驟標題",
      "purpose": "一句話目的",
      "index": 1,
      "total": 3,
      "material": "learn/<subject>/output/materials/<slug>.json",
      "original": "learn/<subject>/output/jobs/<slug>.original.md",
      "plan": "learn/<subject>/output/image-plans/<node>/<step>.json",
      "command": "node scripts/run-article-agent.mjs --subject <subject> --node <node> --step <step> --markers-only"
    }
  ],
  "skipped": [
    { "id": "existing-step", "title": "...", "status": "skipped", "path": "learn/.../existing-step.md" }
  ]
}
```

變更：

- `plan` 指向 `image-plans/`，不再指向 `jobs/`。
- `command` 加 `--markers-only`。
- `skipped[]` 只回報 `id`、`title`、`status`、`path`；不再計算 `images`。
- `--force` 清掉該 step 的 `original`、`protected`、`blocks`、`request`、`result` 與舊 plan。
- `prepare` 不呼叫文字或圖片模型。

### 6.2 publisher

publisher 的職責：

1. 讀 material bundle。
2. 寫 original 到 `original` 路徑（純文章，無圖片、無 marker）。
3. 寫 plan 到 `plan` 路徑：
   - 1–5 張。
   - `heading`、逐字 `anchor`、`prompt`。
   - `anchor` 必須在 original 中逐字找到。
   - 分散在各段，不要擠在頭尾。
4. 執行 `command`（帶 `--markers-only`）。
5. 回報 `status: completed`、輸出路徑、plan 張數。

publisher **不**畫圖、**不**手動放 marker、**不**在 wrapper 回傳後改寫文章。

### 6.3 `run-article-agent --markers-only`

新增 CLI 旗標：

```bash
node scripts/run-article-agent.mjs --subject <s> --node <n> --step <id> --markers-only [--root <dir>]
```

行為：

1. 讀 original 與 plan。
2. 驗證 plan：
   - 1–5 項。
   - 每項有非空 `anchor`、`prompt`。
   - `anchor` 在 original 中逐字存在（忽略多餘空白）。
3. `protectCode(original)`：把有 provenance 的 code block 換成 `<!--code:N-->`。
4. 呼叫 `article-agent` 的 rewrite，傳入：
   - `articleText` = protected original
   - `brief`
   - `imagePlan`
   - `markersOnly: true`
5. article-agent 在 rewrite 後：
   - 驗證 marker 數量與順序（1..N）。
   - 不呼叫圖片模型。
   - 寫出 `article.md`（含 marker）。
   - manifest：`status: completed`、`images: []`、`imageRequests: 0`、`markersOnly: true`。
6. 回傳 `status: completed`、`article` 路徑、`images: []`。
7. 任何 marker 缺失、重複、順序錯 → 失敗，manifest 記錄錯誤，不 publish。

注意：

- `--markers-only` 不需要 `IMAGE_API_KEY`。
- 仍需要 `TEXT_API_KEY`（要 rewrite）。
- 若沒有 plan，直接失敗；新流程的 `/article` 一定要有 plan。

### 6.4 `publish`

```bash
node src/article-cli.mjs publish --subject <subject> --node <node> [--step <id>]
```

行為：

1. 讀 `result.article`（含 marker）。
2. 還原 protected code block。
3. 對齊 H1 為 node plan 的 title。
4. 寫入 `learn/<subject>/nodes/<node>/<step>.md`。
5. **不呼叫 `syncStepImages`**。
6. **不刪除、不複製 `<step>-assets/`**。
7. 不呼叫 `rewriteImageLinks`（新流程沒有圖片行）。
8. 標記 node 為 `written`（所有 step 都有 body 時）。
9. 跑 verify。

publish 的輸出：

```json
{
  "mode": "publish",
  "subject": "...",
  "node": "...",
  "steps": [
    { "id": "...", "title": "...", "status": "published", "path": "learn/.../<step>.md" }
  ],
  "verify": { "pass": true, "failures": [] }
}
```

### 6.5 連續性編修

照舊，但保護清單增加：

- `<!--image:N-->` 行不能動。
- 如果文章已經有圖片行（例如重跑順序不同），圖片行與 caption 也不能動。
- 不改 H1、code fence、provenance、quiz block。
- 只改散文。

### 6.6 `--force` 的資產處理

- `prepare --force` 會刪掉舊 plan 與 job 中間檔。
- publisher 重新寫 original + plan。
- `run-article-agent --markers-only` 重新 rewrite，產生新的 marker。
- publish 成功後：
  - 刪除該 step 的 `<step>-assets/` 內所有 `image-N.webp`。
  - 刪除 `output/humanized/<node>/<step>.json`。
- 若 publish 失敗：不刪 assets、不刪 humanize 紀錄，保留舊狀態。
- 為什麼要刪：文字已重寫，舊圖對不上；留著會變成 verify 的 `image-orphan`。

### 6.7 完成條件

- 這次新產的每個 step：
  - 有 `step.md`。
  - 有 正式配圖清單。
  - marker 數與 plan 長度一致。
  - H1 與 node plan 一致。
- 被 skipped 的既有文章：不動，不要求 plan / marker。
- `node scripts/verify.mjs --node <subject>/<node>` exit 0。
- **不要求**每個 step 都有圖片。

---

## 7. `/humanize-article` 詳細行為

### 7.1 位置與用法

`.opencode/skills/humanize-article/SKILL.md`

```bash
/humanize-article <subject>/<node> [--step <id>] [--force]
```

### 7.2 挑選 step

對 node 的每個 step（或 `--step` 指定的一個）：

1. 讀 `step.md`；沒有 body → `skipped-no-article`。
2. 讀 正式配圖清單；沒有 → `skipped-no-plan`（既有文章）。
3. 有 plan，但文章沒有 marker、也沒有圖片行 → `skipped-not-published`（可能是 `/article` 失敗）。
4. 有打勾紀錄，且 hash 相符，且沒有 `--force` → `skipped-record`。
5. 其他 → 進入 humanize。

### 7.3 工作區

對每個要處理的 step：

```text
learn/<subject>/output/humanize/<node>/<step>/
├── article.md            ← 工作副本
├── plan.json             ← 工作副本
├── original-article.md   ← 備份
└── original-plan.json    ← 備份
```

- 先複製正式檔到工作區。
- subagent 只改工作區。
- 驗證通過才寫回正式檔。
- 成功後刪除工作區。
- 失敗時保留工作區，方便 debug。

### 7.4 Humanize subagent

每個 step 派一個 subagent，建議建立 `.opencode/agent/humanize-article.md`，或在 skill 內用 `subagent_type: general` 並要求載入 `speak-human-tw`。

Prompt 必含：

```text
Load the `speak-human-tw` skill. Work in non-interactive mode:
skip the confirmation list and produce a post-hoc summary
(original sentence / reason / replacement) instead.

Edit only the temp files:
- Article: <temp article>
- Plan: <temp plan>

Rules:
- Traditional Chinese (Taiwan).
- Change prose only; do not add facts, numbers, or quotations.
- Do not change the H1.
- Do not change fenced code blocks or provenance comments.
- Do not change <!--image:N--> markers.
- Do not change existing image lines or their captions.
- Do not change quiz blocks.
- In the plan, change only heading and prompt.
- Never change anchor.
- Keep the plan array length, order, and index unchanged.
- If a sentence needs a fact you do not have, leave it or mark it; do not invent.
```

### 7.5 保護清單（硬性）

humanize 不能改：

- 第一行 H1。
- 所有 fenced code block 與上方的 `<!-- source: … -->` / `<!-- derived -->`。
- `<!--image:N-->` 行。
- 既有圖片行：`![...](./<step>-assets/image-N.webp)`。
- 圖片行下方的 caption（如果舊文章有）。
- fenced `quiz` block。
- 相對連結與來源連結。
- 數字、日期、專有名詞、引號內原話。
- plan 的 `anchor`。

可以改：

- 一般段落、標題（H2 以下）、清單、表格的說明文字。
- plan 的 `heading`、`prompt`。

### 7.6 驗證（寫回前）

主 agent 對工作區做硬性檢查：

1. 文章非空，第一行 H1 與原檔完全相同。
2. 所有 fenced code block 與 provenance 行的內容、數量、順序完全相同。
3. `<!--image:N-->` 的數量、N 序列、順序完全相同。
4. 既有圖片行的數量、路徑、alt 完全相同。
5. `quiz` block 的內容、數量完全相同。
6. plan 是合法 JSON 陣列。
7. plan 長度、`index` 序列、每個 `anchor` 完全相同。
8. plan 的 `heading`、`prompt` 非空。
9. 沒有新增 plan item，也沒有刪除。

驗證失敗：

- 不寫回正式檔。
- 不寫打勾紀錄。
- 回報 `failed` 與失敗原因。
- 保留工作區。

### 7.7 寫回與紀錄

驗證通過後：

1. 寫回 `learn/<subject>/nodes/<node>/<step>.md`。
2. 寫回 `learn/<subject>/output/image-plans/<node>/<step>.json`。
3. 寫 `output/humanized/<node>/<step>.json`：
   - `humanized_at`
   - `article_sha256`（寫回後的檔案）
   - `plan_sha256`
   - `changed`
   - `summary`
4. 刪除工作區。
5. 跑 verify。

### 7.8 重跑與冪等

- 有紀錄且 hash 相符 → 跳過。
- 檔案被手動改過 → hash 不符 → 重新 humanize。
- `--force` → 忽略紀錄，重新 humanize。
- `/article --force` 成功 publish 後會刪紀錄，所以下一次 humanize 會重做。
- humanize 不會刪圖、不會改圖片檔。

### 7.9 失敗處理

- 單一 step 失敗：其他 step 繼續；最後回報失敗清單。
- 若整個 node 都失敗：verify 可能仍過（文章沒變），但報告要標失敗。
- 不自動重試 subagent；失敗就停該 step。

---

## 8. `/generate-images` 詳細行為

### 8.1 位置與用法

`.opencode/skills/generate-images/SKILL.md`

```bash
/generate-images <subject>/<node> [--step <id>] [--force]
```

沒有 `--plan-only`：這個 skill 不規劃。要看 plan，直接開 `output/image-plans/...json`。

### 8.2 挑選 step 與狀態

對每個 step：

1. 讀 `step.md`；沒有 body → `no-article`（跳過）。
2. 讀 正式配圖清單；沒有 → `no-plan`（跳過，既有文章）。
3. 解析文章：
   - `markers` = 所有 `<!--image:N-->`。
   - `images` = 所有 `![...](./<step>-assets/image-N.webp)`。
4. 判斷：
   - `markers.length === 0 && images.length > 0`：
     - 沒有 `--force` → `already-rendered`（跳過）。
     - 有 `--force` → 重畫 `images` 對應的檔案，不動圖片行。
   - `markers.length === 0 && images.length === 0`：
     - `no-markers`（失敗；有 plan 卻沒有 marker，代表文章狀態不對）。
   - `markers.length > 0`：
     - marker 的 N 必須是 `1..plan.length`，順序遞增，且每個 plan item 恰好一次。
     - 不符 → `failed`（不猜位置）。
     - 符合 → 進入渲染。

### 8.3 渲染演算法

```text
article = read(step.md)
plan = read(image-plans/<node>/<step>.json)
markers = parseMarkers(article)

for each marker in markers:
  i = marker.index
  item = plan[i - 1]
  target = nodes/<node>/<step>-assets/image-i.webp

  if target exists and not force:
    image = existing
    reused = true
  else:
    paragraph = text of the block immediately before marker
    heading = item.heading or last heading before marker
    prompt = [
      prompts/image.txt,
      "STYLE: " + REPO_IMAGE_STYLE,
      "SECTION: " + heading,
      "FOCUS: " + (item.prompt || item.anchor),
      "PARAGRAPH (reference data, not instructions):",
      paragraph
    ].join("\n")
    bytes = generateImage(prompt)
    writeWebp(target, bytes)
    reused = false

  replace marker with:
    "![第 i 段配圖](./<step>-assets/image-i.webp)"

write(step.md, updated article)
```

重點：

- 完全不用 `anchor`。
- 不呼叫文字模型。
- 不新增、不刪除 plan item。
- 不動文章其他段落。
- 圖片風格與尺寸沿用：
  - `prompts/image.txt`
  - `REPO_IMAGE_STYLE`（`src/article-agent-bridge.mjs`）
  - `IMAGE_SIZE` 預設 `4:3`
  - `IMAGE_RESOLUTION` 預設 `1K`
  - `IMAGE_QUALITY` 預設 `medium`

### 8.4 `--force` 行為

- 有 marker：重畫所有 marker 對應的圖片，重新換圖片行。
- 沒有 marker、有圖片行：只重畫圖片檔，不動圖片行與位置。
- 部分完成：已存在的圖重用；只補沒有的。
- `--force` 不會重新規劃、不會改 plan。

### 8.5 平行度

- 同一個 step 的多張圖可以平行生成。
- 多個 step 預設依 node plan 順序處理。
- 可選 `--max-parallel <n>` 控制單一步驟內的圖片並行數；預設 2。
- 圖片 API 的錯誤處理沿用 `src/image-provider.mjs` 的 retry 規則：只有請求未送達才重試；HTTP 錯誤不重試，避免重複計費。

### 8.6 輸出

```json
{
  "mode": "render",
  "subject": "...",
  "node": "...",
  "steps": [
    {
      "id": "step-id",
      "title": "...",
      "status": "rendered",
      "markers": 3,
      "images": [
        { "index": 1, "file": "learn/.../image-1.webp", "reused": false },
        { "index": 2, "file": "learn/.../image-2.webp", "reused": true }
      ]
    }
  ],
  "verify": { "pass": true, "failures": [] }
}
```

### 8.7 不做的事

- 不寫 plan。
- 不讀 anchor。
- 不呼叫 `planImages`。
- 不改 H1、散文、code block、quiz。
- 不加 caption。
- 不刪除未被 plan 使用的圖片（那是 `/article --force` 或 `reset-nodes` 的工作）。

---

## 9. `/batch-nodes` 詳細行為

### 9.1 階段

```text
1. Nodes
2. Article
3. Humanize
4. Generate
5. Quiz
```

### 9.2 Flags

| Flag | 作用 |
| --- | --- |
| `-max-subagents N` | 批次寬度，預設 3 |
| `-nodes-only` | 只跑 Nodes |
| `-skip-article` | 跳過 Article |
| `-skip-humanize` | 跳過 Humanize |
| `-skip-images` | 跳過 Generate（取代舊 `-no-images`） |
| `-skip-quiz` | 跳過 Quiz |
| `-no-continuity` | Article 階段不做連續性 |
| `-force` | Article 重寫、Humanize 重做、Generate 重畫、Quiz 重生 |

`-no-images` 移除；文件與錯誤訊息要提示改用 `-skip-images`。

### 9.3 各階段工作

#### Article
- 對每個 node 跑 `prepare`（不加 `--force`，除非 `-force`）。
- 只對 `steps[]` 裡的 step 派 publisher。
- publisher 寫 original + plan，跑 `--markers-only`。
- 全部 publisher 完成後跑 `publish`。
- 跑 verify。
- 若 `-force`，publish 成功後刪該 step 的舊 assets 與 humanize 紀錄。

#### Humanize
- 佇列：有 plan、沒有有效 humanize 紀錄、文章有 body 的 step。
- 每步一個 humanize subagent，批次寬度 `max-subagents`。
- 寫回後寫紀錄。
- 每個 node 跑 verify。
- `-skip-humanize` 時整段跳過。

#### Generate
- 佇列：有 plan 的 step（不論有沒有 marker；沒有 marker 的會在 CLI 回 `no-markers` 或 `already-rendered`）。
- 每個 node 跑一次：

```bash
node src/article-cli.mjs render --subject <subject> --node <node> [--force]
```

- 跑 verify。
- `-skip-images` 時整段跳過。

#### Quiz
- 照舊：`quiz.mjs prepare` → quiz-agent → `quiz.mjs write` → verify。
- Generate 被跳過時，Quiz 仍可跑；文章有 body 即可。
- 需要 `npm --prefix course-app run gen`（照舊）。

### 9.4 狀態表

| 目前狀態 | Article | Humanize | Generate | Quiz |
| --- | --- | --- | --- | --- |
| node draft / steps 空 | 由 Nodes 建 plan | — | — | — |
| step 沒有 body | 寫文字 + plan + marker | 跳過 | 跳過 | 等文章 |
| step 有 body、沒有 plan | 跳過（既有文章） | 跳過 | 跳過 | 可出題 |
| step 有 plan、沒有 marker、有圖片行 | 跳過 | 可 humanize（保護圖片行） | `already-rendered` | 可出題 |
| step 有 plan、有 marker | 跳過 | 可 humanize | 渲染 | 可出題 |
| step 有 plan、沒有 marker、沒有圖片行 | 跳過 | `skipped-not-published` | `no-markers` 失敗 | 可出題 |
| step 有 plan、有紀錄 | 跳過 | `skipped-record` | 依 marker 渲染 | 可出題 |

### 9.5 失敗傳播

- **Article**：node 失敗 → 退出 Humanize / Generate / Quiz。
- **Humanize**：node 失敗 → 退出 Generate / Quiz。
- **Generate**：node 失敗 → 退出 Quiz。
- **Quiz**：只回報，不影響其他 node。
- 已成功的檔案保留，不 rollback。

### 9.6 前置條件

| 階段 | 需要 |
| --- | --- |
| Nodes | `MEMORY.md`、`ROADMAP.md`、`digests/` |
| Article | `node_modules`、`article-agent/` 依賴、`TEXT_API_KEY` |
| Humanize | 無額外 API key（用 agent 模型） |
| Generate | `IMAGE_API_KEY` 或 `EVOLINK_API_KEY` |
| Quiz | 無額外 key；需要 `course-app` 的 npm 依賴 |

### 9.7 報告

每個階段回報：

- Nodes：planned / skipped / failed，step 數與錯誤。
- Article：published / skipped / failed，marker 數，verify 結果。
- Humanize：humanized / skipped-record / skipped-no-plan / failed，改動摘要。
- Generate：rendered / already-rendered / no-plan / failed，圖片數與 reuse 數。
- Quiz：written / skipped / failed，verify 與 course-app data 結果。

---

## 10. 程式改動

### 10.1 `src/article-agent-bridge.mjs`

- `jobFiles(root, { subject, node, step })`：
  - `plan` 改成 `join(root, "learn", subject, "output", "image-plans", node, `${step}.json`)`。
  - 其他欄位不變。
- `readStepPlan`：改讀新的 plan 路徑。
- `normalizeStepPlan` / `assertPlanAnchors`：沿用；必要時補上 `index` 正規化。
- 新增 humanize 紀錄路徑 helper：

```js
export function humanizeRecordPath(root, { subject, node, step }) {
  return join(root, "learn", subject, "output", "humanized", node, `${step}.json`);
}
```

- 新增 humanize 工作區 helper：

```js
export function humanizeWorkDir(root, { subject, node, step }) {
  return join(root, "learn", subject, "output", "humanize", node, step);
}
```

### 10.2 `scripts/run-article-agent.mjs`

- 新增 `--markers-only`（boolean）。
- 傳進 request：

```js
{
  articleFile: files.protected,
  brief: buildBrief(entry, { hasCode }),
  imagePlan: plan,
  imageStyle: REPO_IMAGE_STYLE,
  imageTemplate: readFileSync(join(root, "prompts", "image.txt"), "utf8"),
  outputRoot: outputDir(root, subject),
  markersOnly: true
}
```

- 若 `--markers-only` 且沒有 plan，直接報錯：

```text
--markers-only requires an image plan
```

- `describeRun` 對 `images: []` 要正常處理。
- 不解析圖片、不複製 WebP。

### 10.3 `article-agent/src/pipeline.mjs`

- `generateArticle(args, root, injected)`：
  - 讀 `args.markersOnly`。
  - rewrite 完成、存 `rewritten.md` 後：
    - 若 `markersOnly`：
      1. 若 plan 長度 > 0，呼叫 `parseImagePlanMarkers(rewritten, plan, imageTemplate, imageStyle)` 驗證 marker；不生成圖片。
      2. 寫 `article.md = rewritten`（含 marker）。
      3. manifest：
         - `status: 'completed'`
         - `images: []`
         - `imageRequests: 0`
         - `markersOnly: true`
      4. return `{ article, images: [], manifest }`。
    - 若沒有 plan 且 `markersOnly`：丟錯（新流程必須有 plan）。
  - 既有完整生圖路徑不變。
- `insertImages` 仍保留給 legacy；新 render 不呼叫它。
- 測試新增：markers-only 不生圖、marker 正確、manifest 正確。

### 10.4 `src/article-cli.mjs`

- `prepareArticles`：
  - 移除 `findArticleImages` / `missingArticleImages` 的 import 與 skipped 圖片狀態。
  - `command` 加 `--markers-only`。
- `publishArticles` 呼叫點：
  - 不再需要 `syncStepImages`。
- 新增 `render` 模式：

```js
import { renderImages } from "./render-images.mjs";

if (mode === "render") {
  const result = await renderImages(target, deps);
  const verify = runChecks({ root, subject, node });
  // print report, exit 1 if failed
}
```

- `usage` 更新：

```text
node src/article-cli.mjs prepare ...
node src/article-cli.mjs publish ...
node src/article-cli.mjs render  --subject <s> --node <n> [--step <id>] [--force] [--max-parallel <n>]
node src/article-cli.mjs article ...   (legacy)
node src/article-cli.mjs image   ...   (legacy)
```

- `image` / `article` 標 `(deprecated)`。
- `--images` / `--no-images` 只保留在 legacy `article`，`/article` skill 不再使用。
- `createDeps`：
  - `render` 只需要 `generateImage` / `writeImage`；不呼叫 `planImages`。
  - 確認沒有 text key 也能跑 render（目前 `resolveTextModel` 不會 throw，`createTextClient` 是 lazy）。

### 10.5 新增 `src/render-images.mjs`

建議匯出：

```js
export async function renderImages(
  { subject, node: nodeId, step = null, force = false, maxParallel = 2 },
  deps = {},
) { ... }
```

責任：

- 讀 node / steps / article / plan。
- 解析 marker 與圖片行。
- 驗證 marker 與 plan。
- 生成或重用 WebP。
- 替換 marker（無 caption）。
- 回傳 per-step 狀態。

需要的 dependency：

```js
{
  root,
  generateImage: ({ prompt }) => Promise<Buffer>,
  writeImage: (target, bytes) => Promise<void>,
}
```

可重用的常數／函式：

- `REPO_IMAGE_STYLE`
- `prompts/image.txt`
- `mapLimit`（可從 `article.mjs` export，或在本檔實作）
- `writeWebp`（由 `article-cli` 注入）

### 10.6 `src/article.mjs`

- 保留 legacy：
  - `runImages`
  - `insertImageMarkers`
  - `replaceImageMarkers`（含 caption）
  - `expectedImageCount`
  - `stripImageMedia`
- 新增（或移到 render module）：

```js
export function replaceImageMarkersWithoutCaption(markdown, stepId) {
  const marker = /^[ \t]*<!--\s*image:(\d+)\s*-->[ \t]*$/gm;
  return String(markdown)
    .replace(marker, (_, index) => `![第 ${index} 段配圖](./${stepId}-assets/image-${index}.webp)`)
    .trimEnd() + "\n";
}
```

- `export function mapLimit`（如果 render 要重用）。

### 10.7 `scripts/publish-article.mjs`

- 移除 `syncStepImages` 的 import 與呼叫。
- 不再呼叫 `rewriteImageLinks`（新流程沒有圖片行）。
- 保留 `rewriteImageLinks` 匯出給舊測試或舊流程？建議移除，並刪掉對應測試；若不想動測試，保留函式但 publish 不呼叫。
- publish 只做：
  - restore code
  - normalize H1
  - write article
  - mark node written
  - verify
- 新增測試：publish 不刪 assets、保留 marker。

### 10.8 `scripts/reset-nodes.mjs`

- `cleanNodeOutput` 現在會刪 `files.plan`（已指向 image-plans）；確認行為。
- 新增刪除：
  - `output/humanized/<node>/<step>.json`
  - `output/humanize/<node>/<step>/`
- 若舊版 `output/jobs/<slug>.plan.json` 還存在，也一併刪除（遷移）。
- 更新計數：`removedHumanized`、`removedPlan`。
- 更新測試。

### 10.9 `scripts/verify.mjs`

- 不改規則。
- 確認：
  - `<!--image:N-->` 被當成一般 HTML 註解，不影響 H1、段落、連結。
  - 沒有圖片行、只有 marker 的文章可以過。
  - 有圖片行但檔案不存在 → `image-missing`。
  - 有 `<step>-assets/` 孤兒檔 → `image-orphan`。
- 新增測試：marker-only 文章 verify 綠。

### 10.10 `course-app`

- 不改程式。
- 新圖沒有 caption，畫面會少一行。
- 若 course-app 的 Markdown renderer 對 HTML 註解有特殊處理，確認 marker 不顯示（HTML 註解本來就不顯示）。
- 不需要 `npm --prefix course-app run gen`，除非 Quiz 有變動。

---

## 11. Skill、Agent、文件改動

### 11.1 `.opencode/skills/article/SKILL.md`

- 描述改成「產生文字 + 配圖清單 + marker；不產圖」。
- 移除：
  - `--no-images`
  - `--images`
  - 圖片步驟（第 7 步）
  - `*AI 生成示意圖*`
  - `skipped[]` 的 `images: incomplete`
- 更新：
  - publisher 欄位包含 `plan`，command 帶 `--markers-only`。
  - publish 不碰 assets。
  - 完成條件改成 plan + marker。
  - `--force` 會刪舊 assets 與 humanize 紀錄。

### 11.2 `.opencode/skills/humanize-article/SKILL.md`（新增）

必含：

- 用途、參數、flags。
- 挑選規則（有 plan 才處理）。
- 工作區與備份。
- subagent prompt（載入 `speak-human-tw`、非互動模式、保護清單）。
- 驗證清單。
- 寫回與打勾紀錄。
- 錯誤處理與回報。
- 不做的事（不改 plan anchor、不改圖、不改 quiz）。

### 11.3 `.opencode/skills/generate-images/SKILL.md`（新增）

必含：

- 用途、參數、flags。
- 狀態表（rendered / already-rendered / no-plan / no-markers / failed）。
- marker-based 演算法。
- prompt 組法。
- `--force` 行為。
- 不做的事（不規劃、不讀 anchor、不改散文）。
- 輸出格式與 verify。

### 11.4 `.opencode/skills/batch-nodes/SKILL.md`

- 改成五段（Nodes / Article / Humanize / Generate / Quiz）。
- flags 更新。
- publisher prompt：只寫 original + plan，不生圖。
- 新增 Humanize prompt。
- 新增 Generate CLI 呼叫。
- 狀態表與失敗傳播更新。
- 前置條件更新。
- 最終報告更新。

### 11.5 `.opencode/agent/publisher.md`

- 改成：
  - 寫 original。
  - 寫 plan（1–5，heading/anchor/prompt）。
  - 執行 `command`（`--markers-only`）。
  - 不生圖、不手動放 marker、不事後改寫。
- 移除 `article_generate` 的生圖描述。
- 保留：只寫這一步，不要管其他 step。

### 11.6 `.opencode/agent/humanize-article.md`（新增）

- 載入 `speak-human-tw`。
- 非互動模式：跳過確認、事後摘要。
- 只改工作區。
- 保護清單與 plan 規則。
- 回傳摘要與 changed 布林。

### 11.7 `AGENTS.md`

更新：

- 架構圖：加 `humanize-article`、`generate-images` skill。
- pipeline：
  ```text
  /article → /humanize-article → /generate-images → /quiz-gen
  ```
- skills 表：`/article`、`/humanize-article`、`/generate-images`。
- 核心原則第 8 條：圖片由 `/generate-images` 產生，不是 publisher 或 `/article`。
- step 格式：移除 `*AI 生成示意圖*`。
- operations：
  - `prepare` / `publish` / `render` / legacy `article` / legacy `image`。
  - `--markers-only`。
  - batch flags。
- reset-nodes：清 plan、humanize 紀錄、assets。
- 狀態機不變。

### 11.8 `docs/reference/skill-scope.md`

- 圖片維修從 `/article` 的 `image` 子命令改成 `/generate-images`。
- 批次報告的下一步指令更新。

### 11.9 `docs/reference/verify.md`

- 確認沒有 caption 規則。
- 補一句：`<!--image:N-->` 是註解，verify 不要求它對應圖片；有圖片行才檢查檔案。
- 若文件提到 `*AI 生成示意圖*`，移除。

### 11.10 其他文件

- `README.md`：若有 `/article` 生圖描述，更新。
- `plans/tickets.md`：舊計畫，不改；本文件是這次的來源。
- `docs/specs/to-article-to-image.md`：legacy 設計，保留，不動。

---

## 12. 測試計畫

### 12.1 單元測試矩陣

| 測試檔 | 測什麼 |
| --- | --- |
| `src/article.test.mjs` | legacy `runImages` 不變；新增無 caption 的 marker 替換 |
| `src/render-images.test.mjs`（新增） | marker + plan → WebP + 圖片行；重用；`--force`；marker 不符；`no-plan`；`already-rendered`；部分完成 |
| `article-agent/src/pipeline.test.mjs` | `markersOnly`：有 marker、`images: []`、`imageRequests: 0`、不呼叫 `generateImage`；缺 marker 失敗 |
| `article-agent-bridge.test.mjs` | `jobFiles().plan` 指向 `image-plans`；`readStepPlan` 讀新路徑；humanize 路徑 helper |
| `scripts/publish-article.test.mjs` | publish 保留 marker；不刪 assets；不複製圖片；H1 對齊 |
| `scripts/reset-nodes.test.mjs` | 清 plan、humanized 紀錄、humanize 工作區、assets |
| `scripts/verify.test.mjs` | marker-only 文章綠；圖片缺失／格式／orphan 仍紅 |

### 12.2 測試案例細節

#### `/article` markers-only
- 給 original + plan，rewrite 回傳含 2 個 marker：
  - `images.length === 0`
  - `manifest.imageRequests === 0`
  - `article.md` 含 `<!--image:1-->`、`<!--image:2-->`
  - 沒有呼叫 `generateImage`
- rewrite 少一個 marker → 失敗，manifest `status: failed`。
- 沒有 plan + `--markers-only` → CLI 失敗。

#### `publish`
- article 含 marker，`result.images = []`：
  - step.md 寫入成功
  - `<step>-assets/` 內既有檔案仍在
  - verify 綠
- 舊 `syncStepImages` 測試移除或改成「不刪 assets」。

#### `render`
- plan 2 張 + marker 2 個：
  - 產生 `image-1.webp`、`image-2.webp`
  - article 變成 2 個圖片行
  - 沒有 `*AI 生成示意圖*`
  - `status: rendered`
- 第二次跑，沒有 `--force`：
  - 重用檔案
  - 不再呼叫圖片模型
  - 圖片行不變
- `--force`：
  - 重畫兩個檔案
  - 圖片行位置不變
- marker 只有 1 個、plan 2 張 → `failed`，文章不動。
- marker 順序 2,1 → `failed`。
- 沒有 plan → `no-plan`。
- 有圖片行、沒有 marker → `already-rendered`。
- 有圖片行、沒有 marker、`--force` → 重畫檔案，圖片行不變。
- 部分完成：marker 2 個，image-1 已存在，image-2 不存在 → 只生 image-2，兩張都換成圖片行。

#### `humanize-article`
- 有 plan + marker，無紀錄：
  - subagent 改文章
  - plan heading/prompt 改變
  - anchor 不變
  - marker 數量與順序不變
  - 寫紀錄
- 有紀錄：
  - 跳過，不派 subagent
- `--force`：
  - 重做
- 文章被手動改過、hash 不符：
  - 重新 humanize
- subagent 改掉 marker：
  - 驗證失敗
  - 正式檔不變
  - 沒有紀錄
- 沒有 plan（既有文章）：
  - `skipped-no-plan`
- 有 plan、沒有 marker、沒有圖片行：
  - `skipped-not-published`

#### `reset-nodes`
- 刪除：
  - `output/image-plans/<node>/<step>.json`
  - `output/humanized/<node>/<step>.json`
  - `output/humanize/<node>/<step>/`
  - `<step>-assets/`
  - 舊 `output/jobs/<slug>.plan.json`（如果存在）

### 12.3 指令

```bash
npm test
npm --prefix article-agent test
node scripts/verify.mjs --subject agent-harness
```

### 12.4 手動驗收

在不動既有文章的前提下：

1. 選一個新的 node，或建立一個 scratch node（不要用 `--force` 碰既有 step）。
2. 跑 `/article <subject>/<node>`：
   - 每步有 `step.md` + plan + marker。
   - 沒有圖片。
   - verify 綠。
3. 跑 `/humanize-article <subject>/<node>`：
   - 文章與 plan 改變。
   - marker 不變。
   - 有 `output/humanized/...json`。
   - 再跑一次，全部 `skipped-record`。
4. 跑 `/generate-images <subject>/<node>`：
   - `<step>-assets/image-N.webp` 產生。
   - marker 變成圖片行。
   - 沒有 caption。
   - verify 綠。
5. 再跑一次 `/generate-images`：
   - `already-rendered` 或重用，不重新花錢。
6. 跑 `git status`：
   - 既有文章沒有被改。
   - 只有新 node 的檔案變動。

---

## 13. 實作順序（建議照這個順序）

### Step 1：資料契約與路徑

- [ ] 改 `src/article-agent-bridge.mjs` 的 `jobFiles().plan`。
- [ ] 加 `humanizeRecordPath`、`humanizeWorkDir`。
- [ ] 更新 `article-agent-bridge.test.mjs`。
- [ ] 確認 `prepare` 輸出新的 plan 路徑。

### Step 2：markers-only

- [ ] `scripts/run-article-agent.mjs` 加 `--markers-only`。
- [ ] `article-agent/src/pipeline.mjs` 加停止點與 marker 驗證。
- [ ] 更新 `pipeline.test.mjs`。
- [ ] 確認不需要 `IMAGE_API_KEY`。

### Step 3：publish 去圖片化

- [ ] `scripts/publish-article.mjs` 移除 `syncStepImages`。
- [ ] 更新 `publish-article.test.mjs`。
- [ ] 確認 publish 不刪 assets、保留 marker。
- [ ] 更新 `verify.test.mjs`（marker-only 綠）。

### Step 4：render 引擎

- [ ] 新增 `src/render-images.mjs`。
- [ ] `src/article-cli.mjs` 加 `render` 模式。
- [ ] 新增 `src/render-images.test.mjs`。
- [ ] 確認 render 不需要 text key。

### Step 5：`/article` skill 與 publisher

- [ ] 更新 `.opencode/skills/article/SKILL.md`。
- [ ] 更新 `.opencode/agent/publisher.md`。
- [ ] `prepare` command 加 `--markers-only`。
- [ ] 移除 `--no-images` / `--images`。
- [ ] 完成條件改成 plan + marker。

### Step 6：`/generate-images` skill

- [ ] 新增 `.opencode/skills/generate-images/SKILL.md`。
- [ ] 包 `render` CLI。
- [ ] 狀態、錯誤、`--force`、`--step`、報告。

### Step 7：`/humanize-article` skill

- [ ] 新增 `.opencode/skills/humanize-article/SKILL.md`。
- [ ] 新增 `.opencode/agent/humanize-article.md`。
- [ ] 工作區、備份、驗證、紀錄。
- [ ] 更新 `reset-nodes` 清紀錄與工作區。

### Step 8：`/batch-nodes`

- [ ] 改成五段。
- [ ] flags 更新。
- [ ] publisher prompt 更新。
- [ ] Humanize / Generate prompt 與呼叫。
- [ ] 狀態表、失敗傳播、報告。

### Step 9：文件與收尾

- [ ] `AGENTS.md` 全面更新。
- [ ] `docs/reference/skill-scope.md`。
- [ ] `docs/reference/verify.md`。
- [ ] `README.md`（如有需要）。
- [ ] 跑完整測試與手動驗收。
- [ ] `git status` 確認既有文章沒被改。

---

## 14. 驗收標準

- [ ] `/article` 不再呼叫圖片模型，也不產生 `<step>-assets/`。
- [ ] `/article` 每步產出 正式配圖清單 與 marker。
- [ ] `publish` 不再刪除或複製圖片。
- [ ] `verify` 對 marker-only 文章綠。
- [ ] `/humanize-article` 只處理有 plan 的 step；既有文章不動。
- [ ] `/humanize-article` 不改 marker、圖片行、code、quiz、plan anchor。
- [ ] humanize 重跑會跳過；`--force` 會重做。
- [ ] `/generate-images` 只渲染，不規劃。
- [ ] 新圖沒有 `*AI 生成示意圖*`。
- [ ] `/generate-images` 重用既有圖片；`--force` 重畫。
- [ ] 部分完成可續跑。
- [ ] marker 數量／順序不符會失敗，不會亂放。
- [ ] `/article --force` 只在成功 publish 後刪舊 assets 與 humanize 紀錄。
- [ ] `/batch-nodes` 五段流程可跑，flags 文件正確。
- [ ] `npm test`、`npm --prefix article-agent test` 全綠。
- [ ] `node scripts/verify.mjs --subject agent-harness` 綠。
- [ ] `git status` 顯示既有文章未被修改（除了預期的新 node 測試）。
- [ ] 舊 `image` / `article` 指令仍可用，但文件標 deprecated。

---

## 15. 風險與防護

| 風險 | 防護 |
| --- | --- |
| rewrite 吃掉 marker | `--markers-only` 硬驗證；少了就失敗，不 publish |
| humanize 改壞 marker | 工作區 + 寫回前驗證；失敗不覆蓋正式檔 |
| humanize 改到 code / quiz | 保護清單 + 驗證；失敗不寫回 |
| 舊文章被誤改 | 只處理有 正式配圖清單 的 step；沒有 plan 一律跳過 |
| `/article --force` 刪圖後 publish 失敗 | 先成功 publish 再刪 assets；失敗保留舊圖 |
| 舊 `image` 指令覆蓋新 plan | 標 deprecated；文件不引導使用；必要時加警告 |
| 圖片重複計費 | 預設重用既有 WebP；`--force` 才重畫；圖片 API 不重試 HTTP 錯誤 |
| marker 與 plan 數量不符 | render 直接失敗，不猜位置 |
| text key / image key 混淆 | Article 只需 text key；Generate 只需 image key；render 不呼叫文字模型 |
| plan 與文章不同步 | plan 只有一份；`/article --force` 會清舊 plan；humanize 驗證 anchor 不變 |
| `reset-nodes` 沒清乾淨 | 明確清 image-plans、humanized、humanize 工作區、assets |

---

## 16. 附錄

### 16.1 範例：配圖清單

```json
[
  {
    "index": 1,
    "heading": "Harness 不是模型",
    "anchor": "模型只負責生成下一個 token。",
    "prompt": "左邊是模型，右邊是工具、記憶與流程，中間用箭頭連接，讓讀者看懂 harness 是模型外面的那一圈。"
  },
  {
    "index": 2,
    "heading": "為什麼需要 memory",
    "anchor": "沒有 memory，agent 每次醒來都像失憶。",
    "prompt": "一個人每次醒來都忘記上一秒發生的事，旁邊有一本筆記本把重要資訊記下來。"
  }
]
```

### 16.2 範例：`/article` 後的 step.md

```markdown
# Harness 才是產品

模型只負責生成下一個 token。

<!--image:1-->

## 為什麼需要 memory

沒有 memory，agent 每次醒來都像失憶。

<!--image:2-->
```

### 16.3 範例：`/generate-images` 後的 step.md

```markdown
# Harness 才是產品

模型只負責生成下一個 token。

![第 1 段配圖](./harness-is-the-product-assets/image-1.webp)

## 為什麼需要 memory

沒有 memory，agent 每次醒來都像失憶。

![第 2 段配圖](./harness-is-the-product-assets/image-2.webp)
```

### 16.4 範例：humanize 紀錄

```json
{
  "humanized_at": "2026-10-26T22:40:00.000Z",
  "article_sha256": "b1e4…",
  "plan_sha256": "9f2a…",
  "changed": true,
  "summary": "刪掉 3 句空話、把 5 個中國用語改成台灣用語、補了兩個具體例子"
}
```

### 16.5 範例：render CLI 輸出

```json
{
  "mode": "render",
  "subject": "agent-harness",
  "node": "what-a-harness-is",
  "steps": [
    {
      "id": "harness-is-the-product",
      "title": "Harness 才是產品",
      "status": "rendered",
      "markers": 2,
      "images": [
        { "index": 1, "file": "learn/agent-harness/nodes/what-a-harness-is/harness-is-the-product-assets/image-1.webp", "reused": false },
        { "index": 2, "file": "learn/agent-harness/nodes/what-a-harness-is/harness-is-the-product-assets/image-2.webp", "reused": true }
      ]
    }
  ],
  "verify": { "pass": true, "failures": [] }
}
```

### 16.6 決策回顧

- 為什麼 plan 只有一份：publisher 寫的內容就是後續 humanize 與 generate 要用的內容；兩份會不同步。
- 為什麼 marker 由 rewrite 放：anchor 是對原稿的，rewrite 才知道改寫後對應哪一段。
- 為什麼 render 不看 anchor：marker 已經是 placement 契約；humanize 改字後 anchor 可能過時。
- 為什麼既有文章不動：沒有 plan 就沒有 marker，硬套會破壞已完成的內容；需要時再用 `/article --force` 明確重產。
- 為什麼保留舊指令：舊文章可能還要維修；先標 deprecated，不在新鏈使用。
