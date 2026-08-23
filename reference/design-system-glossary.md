# Design System 名詞參考（Glossary）

本節 node（design-system-boundary）四個 step 共用的名詞定義。各課程一律遵守這裡的用語。

## 核心概念

| 名詞 | 定義 |
|---|---|
| **Design System（設計系統）** | 把 typography、色彩、間距、圓角、陰影、元件規格寫下來的一份「視覺規格」。在 AI 工作流中，它是**人類與 AI 之間的視覺合約**，要求 AI 嚴格照做，不自由發揮。 |
| **Design Mockup / 設計稿（reference image）** | 設計的來源圖片，放在 `design/` 資料夾（與 `public/` 同級）。**它是 source of truth**——AI 的職責是精確複製，不是「改善」。 |
| **Visual Contract（視覺合約）** | Design System 對 AI 的角色定位：不是設計師之間的溝通文件，而是要求 AI 嚴格照做的約束文件。 |
| **Source of Truth** | 判斷「對不對」的唯一標準。在 UI 工作上，就是設計稿截圖。 |
| **AGENTS.md UI Rules** | 操作手冊裡的行為規則：「You do not design UI … Reproduce them exactly」。管「怎麼做、不能做什麼」。 |

## 技術層（step 2：Token）

| 名詞 | 定義 |
|---|---|
| **Design Token（設計 Token）** | 把設計稿上的具體數值（色號、字級、間距、圓角、陰影）命名成可被程式碼引用的變數。沒有 token，AI 只能「猜」藍色；有了 token，AI 只需要「複製」。 |
| **Tailwind v4 `@theme`** | Tailwind v4 在 CSS 檔裡宣告 theme 的語法。寫在 `@theme { … }` 區塊內的 CSS 變數，自動對應到 utility class（`--color-primary` → `bg-primary`、`text-primary`…）。 |
| **`globals.css`** | 存放 `@theme` 的單一檔案，是 token 的 single source of truth。AI 做 UI 前讀這一個檔案就拿到全部設計約束。 |
| **CSS Variable（CSS 變數）** | 原生 CSS 的自訂屬性，例如 `--color-primary: #F97316`。v4 的 `@theme` 直接就是 CSS 變數，不需要 JS config 轉譯。 |
| **Base Unit（間距基準）** | 間距 scale 的單位倍數。Vertex 用 4px：`--spacing-1`=4px、`--spacing-4`=16px… 消滅 magic number。 |
| **Typography Scale（字級表）** | 每級 heading/body 的 font-size + font-weight + line-height 組合，不只記 font-size。 |
| **`next/font` 橋接** | Next.js 用 `next/font/google` 載入字型，`variable` 選項把字型名寫進 CSS 變數（`--font-body`），再被 `@theme` 消費。 |

## 元件層（step 3：Typed Component Library）

| 名詞 | 定義 |
|---|---|
| **Typed Component Library（型別化元件庫）** | 帶 TypeScript props 定義的共享元件集合（Button、Card、Badge、Input…）。所有頁面從同一元件庫匯入，確保全站一致。 |
| **Variant** | 元件的視覺變體，例如 Button 的 `primary / secondary / ghost / danger`。用 TypeScript union type 限制，編譯時擋住非法用法。 |
| **Composition（組合）** | 「先重用、再新增」：新 UI 用現有元件組裝（`<Card><Button/></Card>`），而不是自建新元件。組合勝過繼承。 |

## 驗證層（step 4：Showcase）

| 名詞 | 定義 |
|---|---|
| **Showcase Route（展示路由）** | 一條專用路由（如 `/design-system`），把所有 token 與元件變體攤在同一頁，不做任何業務邏輯。可視化 + 可機器化。 |
| **Headless Chrome** | 無頭（不開視窗）的 Chrome，用腳本載入頁面、截取完整截圖。Playwright / Puppeteer 都以它為底。 |
| **Visual Diff（視覺比對）** | 逐像素比對兩張截圖，產出差異圖，偏離區用紅色標出。工具如 pixelmatch、Looks Same、Playwright `toHaveScreenshot`。 |
| **Visual Regression Testing（視覺迴歸測試）** | 每次 push 都跑的防護網（不要退步）。Showcase 驗證是建構階段的一次性入場門（一開始就對）。兩者互補。 |
| **Context Rot（上下文腐蝕）** | context 膨脹到 AI 開始「忘記」早期決定——約 50k token 後出現記憶模糊、150k 後判斷品質明顯下降。對策：每功能一個 session。 |
| **Session Budget** | 單一 session 的 token 上限紀律（Vertex 經驗值 ~150k）。 |

## 工作流（跨 step）

| 名詞 | 定義 |
|---|---|
| **Implementation Loop（實作迴圈）** | 先讀檔案/技能 → 寫 implementation prompt → 人工批准 → 才寫 code → 跑檢查 → 回報。Showcase 驗證掛在迴圈的「跑檢查」一步。 |
| **Rules vs Specs（規則 vs 規格）** | 規則（AGENTS.md）管行為邊界「不能設計」；規格（Design System）管具體內容「用哪些 token」。有規則無規格 → 偏差；有規格無規則 → 自行加料；兩者皆有 → 一致。**「規則關上門，規格把門焊死。」** |
