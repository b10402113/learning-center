# 塊開發 block devlop

以 Next.js 16 App Router 製作的 Markdown 部落格。延續 course-app 的暖紙色、橘色、襯線標題、舒適行寬、目錄與知識塊閱讀方式。

## 啟動與編輯

需要 Node.js 22 以上。

```bash
cd blog-app
npm ci
npm run dev
```

- 網站：<http://127.0.0.1:3001/>
- 本機編輯器：<http://127.0.0.1:3001/studio/>

`npm run dev` 一次啟動 Next.js 與只監聽 loopback 的編輯服務。不需要資料庫、API key 或帳號。編輯器能建立文章、知識塊與 Roadmap，修改摘要、日期、分類、標籤和草稿狀態，並左右對照 Markdown 與閱讀預覽。⌘ S / Ctrl S 儲存至原始 `.md` 檔案。

編輯器僅在開發模式啟用。正式輸出不包含寫入 API，`/studio/` 顯示本機使用說明並設定 noindex。這個版本的管理方式是「本機編輯 → 建置 → 部署」；不提供登入後在線上修改正式網站的 CMS。

## 內容位置

```text
content/
  articles/<slug>.md     # 完整文章
  blocks/<slug>.md       # 可獨立閱讀的小知識塊
  roadmaps/<slug>.md     # 路線說明 + YAML 階段與關係
public/
  media/                # 文章圖片，可在 Markdown 引用 /media/xxx.webp
  uploads/              # 編輯器上傳的圖片，自動插入 Markdown 內文末尾
```

初始展示內容複製自 `learn/agent-harness2`、`learn/ai-agent-workflows` 與 `learn/background-agent`，保留內文與可用圖片；未修改原課程、來源檔或原有 course-app。這些是網站版型的展示內容，正式發佈前可在編輯器換成自己的獨立文章。`source` 欄位僅供本機追蹤，不放入公開資料。

### 文章與知識塊

```markdown
---
title: 我的第一篇文章
description: 一兩句清楚描述這篇文章解決什麼問題，作為搜尋與分享摘要。
status: draft
date: '2026-11-18'
category: ai-development
tags:
  - Agent
blocks:
  - agent
author: 塊開發編輯室
---

# 我的第一篇文章

內文使用一般 Markdown，不使用 MDX。標題顯示以 title 為準。

## 第一個觀念

支援表格、程式碼、數學公式，以及 [[agent|Agent 知識塊]] 連結。
```

檔名決定網址，請使用小寫英文、數字與連字號。`status: draft` 不產生公開頁面，也不出現在搜尋、RSS 與 sitemap。改成 `published` 後重新建置才會公開。`date` 是發佈日期，沒有排程發佈功能。可選填 `updated: '2026-11-19'` 表示最後修改日期。

`category` 可自行新增。內建中文顯示名稱位於 `lib/content.mjs` 的 `categoryNames`；未設定時顯示分類 ID。知識塊與文章格式相同，文章的 `blocks` 欄位是知識塊檔名。`[[agent|顯示名稱]]` 可在文章中開啟關聯知識塊。圖片用 `![有意義的替代文字](/media/file.webp)` 引用，或直接在編輯器上傳 PNG、JPEG、WebP、GIF（上限 8 MB），自動存入 `public/uploads/` 並插入 Markdown。所有 public 圖片都會隨網站發佈，請只放準備公開的素材。

### 編輯 Roadmap

在編輯器選擇「Roadmap」：

1. 新增路線並填寫標題、副標題、摘要與適合程度。
2. 新增階段，從選單加入既有文章或知識塊。
3. 用 ↑ ↓ 調整階段及項目的排列順序。
4. 在「先修項目」選擇排在前面的項目；按住 ⌘ / Ctrl 可多選或取消選取。
5. 查看下方路線圖，即時檢查順序與連線，再儲存 Markdown。

資料格式也能在「完整 Markdown / YAML」頁籤直接修改：

```yaml
---
title: AI Development
subtitle: 從模型呼叫，到可靠的 Agent
description: 循序理解 AI 開發、工具與記憶。
status: published
date: '2026-11-18'
level: 入門 → 進階
stages:
  - id: foundations
    title: 建立心智模型
    description: 先理解模型與 Agent 的分工
    items:
      - id: intro
        type: article
        ref: beyond-the-model
        requires: []
      - id: agent-concept
        type: block
        ref: agent
        requires:
          - intro
---

這條路線適合剛開始接觸 Agent 的開發者。
```

`id` 是每條路線內唯一的連線識別碼；`ref` 是文章或 block 檔名。文章和 block 可被不同路線重用。階段與 items 的陣列順序就是閱讀順序；`requires` 只能指向前面的項目，因此無法形成循環。每階段至少保留一個項目。移動或刪除項目後若先修關係不成立，儲存會說明需要調整的連線。公開 Roadmap 不可連到草稿或不存在的內容。

路線圖可橫向捲動，並提供清單模式。文章節點直接開啟文章，側欄與前後篇導覽會沿用該 Roadmap 的文章順序；知識塊節點展開閱讀視窗，也有獨立永久網址可分享。

## 建置與部署

```bash
npm run check
npm run build
npm test
npm run preview
```

正式網站在 `out/`，本機正式版預覽為 <http://127.0.0.1:3002/>。不需要長駐 Node 伺服器。可部署到 Vercel、Cloudflare Pages、Netlify 或其他靜態空間。設定專案根目錄為 `blog-app`、建置命令為 `npm run build`、輸出目錄為 `out`；Vercel 可使用 Next.js 預設偵測。

**更換正式網域時，在部署平台設定 `SITE_URL=https://你的網域`，然後重新建置。** 預設使用這個專案的 Sites 展示網址；網站本身不會因設定 SITE_URL 而自動綁定網域。若使用私有 Sites 展示，它只供預覽，搜尋引擎無法收錄；公開站台須部署到公開空間或另行調整訪問權限。

SEO 包含：預先產生的文章 HTML、獨立 title / description、canonical、Open Graph、Twitter 卡片、BlogPosting 與麵包屑 JSON-LD、`sitemap.xml`、`robots.txt`、RSS、繁體中文語系，以及可在無 JavaScript 時讀取的主要內容。社群分享圖在 `public/og.png`；修改 `scripts/generate-og.mjs` 後執行 `node scripts/generate-og.mjs` 可重做。

儲存採原子替換與版本比對，避免多個編輯器互相覆蓋。完整檢查會驗證必要欄位、發佈狀態、分類、知識塊關聯、Roadmap 參照及先修順序。測試涵蓋衝突、路徑限制、錯誤資料不覆寫、Markdown 往返，以及正式輸出的內部連結、圖片與 SEO。

`npm run format` 格式化網站程式碼。色彩、字型與響應式規則集中在 `app/globals.css`，網站名稱、作者、正式網址設定在 `lib/site.mjs`。
