# 計畫：Markdown 課程系統重構

把 step 從「獨立 MDX 檔 + HTML 課程」改成「node 裡的一筆資料 + 一篇 Markdown 文章」，移除教課 agent 與 HTML pipeline，course-app 直接渲染 Markdown。

現況 pilot 在 `learn/agent-harness/`：一個 node、兩個 step、兩份 digest，行號引用已驗證。

## 1. 目標與非目標

### 目標

- node 是唯一的結構檔案（`.md`），step 只是 node 裡的一筆資料 + 一個 `.md` 文章。
- 所有來源引用都是 `[[sources/<subject>/<file>#Lstart-Lend]]`，可被程式驗證。
- 文章由 CLI 依「purpose + 來源切片」一次生成，不再有互動式 `/teach`。
- 圖片由 Publisher 風格的 Markdown pipeline 產生（`<!--image:N-->` → 圖片連結）。
- course-app 直接渲染文章，不再外連 HTML lesson，也不再需要 MDX 編譯器。
- verify 成為格式的唯一真相，全部規則 hard fail。

### 非目標

- 不遷移已刪除的舊 `learn/` 內容；科目按需要重新 `/learn-init`、`/roadmap`、`/nodes`。
- 不做 `/practice`（題目生成）。保留 `quiz` block 格式與 course-app renderer，之後再接。
- 不改 `sources/` 的內容；只新增 PDF 抽出的 `.txt`。
- 不動 nested `article-agent/` repo；只把它的 prompt 當新 `prompts/article.txt` 的語氣種子。
- 不做完成度、mastery、element、probe、tackle。

## 2. 最終格式

### 2.1 佈局

```text
learn/<subject>/
├── MEMORY.md
├── ROADMAP.md
├── digests/<stem>.md
└── nodes/
    ├── <node>.md
    └── <node>/
        ├── <step>.md
        └── <step>-assets/image-N.webp
```

### 2.2 Node：`nodes/<node>.md`

```yaml
---
id: what-a-harness-is
title: "Agent Harness：LLM 之外的那些東西"
subject: agent-harness
tier: 1
order: 1
status: draft | confirmed | written
goal: "..."
prerequisites: ["learn/agent-harness/nodes/agentic-mindset.md"]
steps:
  - id: harness-is-the-product
    title: "Harness 才是產品：LLM 之外的基礎設施"
    purpose: "能用「LLM + harness」解釋 agent，並說出 memory、tools、long-running 為什麼屬於 harness。"
    sources:
      - "[[sources/agent-harness/20260915/1-what-is-an-agent-harness.txt#L7-L25]]"
created: 2026-10-22
updated: 2026-10-22
---

# Agent Harness：LLM 之外的那些東西

## Lesson
（2–3 句 node 概述）

## Steps
1. [Harness 才是產品：LLM 之外的基礎設施](what-a-harness-is/harness-is-the-product.md)
2. [Demo agent 為什麼一進 production 就死](what-a-harness-is/demo-vs-production.md)
```

規則：

- `steps` 陣列順序就是教學順序；沒有 `order`、`deps`、`type`。
- node 層沒有 `sources`；來源全部掛在 step 上。
- body 的連結相對於 node 檔案所在目錄。
- body 的 id / title / 順序必須與 frontmatter 完全一致。

### 2.3 文章：`nodes/<node>/<step>.md`

- 無 frontmatter；第一行 `# <title>`，必須等於 node 裡的 title。
- 自由長度、自由 `##` 小節；publisher 的 editorial 語氣、短段落、台灣繁中。
- 不寫來源區塊（由 course-app 從 node 聚合）。
- 不寫 `## 練習`（未來由 `/practice` 追加）。
- 圖片：`![第 N 段配圖](./<step>-assets/image-N.webp)`，下一行 `*AI 生成示意圖*`。
- 每個 fenced code block 上方必須有
  `<!-- source: sources/<subject>/<file>#Lx-Ly -->` 或 `<!-- derived -->`。

### 2.4 Digest

```markdown
---
source: sources/<subject>/<path>.txt
source_type: text
source_lines: 216
status: absorbed
absorbed_at: 2026-10-22
---

# L1 overview
（5–8 個重點）

# L2 detail
- `#L1-L11` — 這幾行在講什麼
- `#L12-L25` — ...
```

- PDF 先在 ingest 時抽成同目錄 `.txt`；引用一律指向 `.txt`。
- digest 只做 discovery 與覆蓋率檢查，不再是內容載體。

### 2.5 Locator

- 格式：`#Lstart-Lend`；單行 `#L12`。
- 不得引用 PDF；不得使用舊的 `#section-slug`。
- 行號以 ingest 當下的 `.txt` 為基準，之後不重抽。

### 2.6 Quiz（保留格式，暫不生成）

````markdown
```quiz
{
  "question": "...",
  "options": ["...", "..."],
  "answer": 1,
  "explain": "..."
}
```
````

- 一題一個 block、純 JSON、`answer` 為 0-based、`options` 2–5 個。
- 現在不要求 `## 練習` 存在；course-app 遇到才渲染。

## 3. 產生流程

```text
/learn-init → /ingest → /roadmap → /nodes → /article → (images)
```

| 指令 | 角色 |
| --- | --- |
| `/learn-init` | MEMORY + digest（L1 + 行號 L2）；PDF→`.txt` |
| `/ingest` | 新素材建 digest，不改 roadmap/nodes |
| `/roadmap` | 產生 ROADMAP + draft node（空 steps） |
| `/nodes` | 填 steps（title/purpose/sources/順序），status `confirmed` |
| `/absorb` | 把新 digest 併進既有 node（可追加 step） |
| `/article` | 薄殼，呼叫 CLI 寫文章；`--images` 觸發配圖 |
| `/edges` | 保留；連結改用 `.md` |

### CLI

```bash
node src/article-cli.mjs article --subject X --node Y [--step Z] [--force] [--max-parallel 2]
node src/article-cli.mjs image   --subject X --node Y [--step Z]
```

`article`：

1. 讀 node `.md`，取 step 的 purpose + sources。
2. 依行號切出 raw slices（PDF 拒絕）。
3. 一次 text call，system prompt 為 `prompts/article.txt`，user message 為 JSON `{ brief, purpose, sources: [...] }`。
4. 寫 `<step>.md`；預設跳過已存在，`--force` 重生。

`image`：

1. 讀文章，依繁中字數決定 1–5 張（<900 → 1、900–1,499 → 2、1,500–2,099 → 3、2,100–2,699 → 4、≥2,700 → 5）。
2. 一次 text call 產生 `{ index, heading, anchor, prompt }` 陣列。
3. 在文章插入 `<!--image:N-->`，逐張生成、壓成 WebP、換成 Markdown 圖片。
4. 已存在的圖直接重用，重跑 idempotent。

### `prompts/article.txt`

以 `publisher.txt` 的語氣為底，改寫成「從 purpose + slices 寫一篇新文章」：

- 第一行 `# <title>`（title 由使用者訊息提供）。
- 不寫學習目標、不寫來源、不寫練習、不插圖片標記。
- 不規定字數；內容不足不硬湊。
- 台灣繁中、短段落、從讀者情境開場、避免制式轉折語。

## 4. course-app

- `build-data` 讀 `.md`（gray-matter），文章全文進 `step.articleMd`。
- 路由 `#/<subject>/<node>/<step>`；node 頁列 step（title + purpose）。
- `react-markdown` + `remark-gfm`：
  - `code` renderer 認 language `quiz` → 互動題元件（沿用 `quiz.js` 行為）。
  - 圖片套 `.lesson-figure` 樣式。
- 文末來源清單由 node 的 step sources 聚合。
- prev/next 依 node 的 `steps` 陣列順序。
- 移除：`public/lessons` 複製、`coursePage`、status 綠點、任何 mastery/進度概念。
- 圖片資產複製到 `public/nodes/<subject>/<node>/<step>-assets/`。

## 5. verify 規則

全部 hard fail：

1. repo 不得存在 `.mdx`。
2. node 檔名 = `id`；frontmatter 欄位齊全；`status` 合法。
3. `steps` 陣列：至少 1 個、id 不重複、無 `deps` / `type` / `order`。
4. 每個 step 都有 `<step>.md`；每個文章都對應一個 step。
5. 文章第一行 `# ` 等於 node 的 title。
6. body `## Steps` 的 id / title / 順序與 frontmatter 一致。
7. 每個 source 引用：檔案存在、格式 `#Lx-Ly`、`1 ≤ start ≤ end ≤ lines`、切片非空、不得是 PDF。
8. 每個引用落在 digest 的某個 L2 行號範圍內。
9. 每個 code block 有 source 或 derived provenance。
10. 圖片引用存在；`*-assets/` 無孤兒檔。
11. node→step 相對連結可解析；文章內相對連結可解析。
12. 若存在 `quiz` block：JSON 合法、`options` 2–5、`answer` 在範圍、`explain` 非空。

## 6. 舊系統處置

搬到 `legacy/`（不刪除），保留 nested `article-agent/` repo。

| 搬入 legacy | 原因 |
| --- | --- |
| `src/html.mjs`、`src/html-cli.mjs` | HTML lesson pipeline 退場 |
| `prompts/html-rewrite.txt` | 同上 |
| `.opencode/skills/teach/`（含 types） | 不再互動教課 |
| `.opencode/agent/teach-agent.md`、`article-agent.md` | 由 CLI 取代 |
| `.opencode/skills/to-article/`、`to-image/` | 由 `/article` 取代 |
| `.opencode/skills/probe/`、`tackle/` | 移出範圍 |
| `learn/**/elements/`、`mastery.md` | element / mastery 退場 |
| `learn/**/output/` | 舊 working files |
| `scripts/generate-data.mjs` | 舊 graph generator |

保留：`prompts/image.txt`、`shared.css` 的視覺樣式（搬成 course-app 樣式來源）、`/edges`（改 `.md` 連結）。

`src/pipeline.mjs`、`src/cli.mjs`、`prompts/rewrite.txt`、`prompts/publisher.txt` 先留著當參考，等文章 CLI 完成後再搬。

## 7. Phase 與 ticket 對照

| Ticket | 對應工作 |
| --- | --- |
| 1. 地基 | 舊系統退場、Pilot 在 course-app 可讀 |
| 2. 驗證與來源 | verify 換新、行號 digest、PDF→`.txt` |
| 3. Node 生產線 | roadmap 可點、`/nodes` 與 `/absorb` 寫完整 steps |
| 4. 文章與圖片 | 文章 CLI + `/article` + 配圖生成 |
| 5. 收尾 | 閱讀器收尾、單科目端到端、文件定稿 |

完整票券見 `plans/tickets.md`（root 的 `tickets.md` 已被另一個知識地圖專案佔用）。

## 8. 風險

- **PDF 行號漂移**：只在 ingest 抽一次 `.txt`，之後不重抽；重抽視為換來源。
- **文章語氣不一致**：所有文章共用同一個 prompt，不按 type 分流；用 pilot 當基準。
- **大量重產成本**：`/article` 預設跳過已存在；先單 node 驗收再放大。
- **course-app 與舊資料脫節**：舊 `learn/` 已空，app 只會顯示有 node 的科目。
- **圖片重跑**：以檔名存在即重用，`--force` 才重生。

## 9. 驗收

```bash
node scripts/verify.mjs --subject agent-harness
cd course-app && npm run build
cd course-app && npm run dev
```

- pilot 的 node/step 全部可讀、連結可點、引用合法。
- 一個完整科目從 sources 走到 app，不需人工改檔。
- repo 內沒有 `.mdx`，也沒有新流程引用 `legacy/`。
