# 知識星雲（Knowledge Nebula）— 學習路線塔地圖網站

Status: ready-for-agent
Feature: knowledge-nebula
Created: 2026-08-11

## Problem Statement

學習資料以純 markdown 存在（每個 subject 有 ROADMAP + paths + nodes + edges），但學習者沒有任何視覺方式看見「學習路線的整體形狀」或「下一步該學什麼」。目前只有逐篇文章可讀，沒有總覽、沒有順序感、沒有關聯感。

使用者想要一個「知識星雲」：把每個 subject 的路線畫成一張爬塔遊戲地圖（類似殺戮尖塔 Slay the Spire）——每個 tier 是一個大關卡（樓層），裡面的 path 是 mini-boss 節點，節點之間有順序與箭頭（不只是 Obsidian 那種無方向的關聯球）。外觀必須沿用 chartr/web 的視覺語言。

## Solution

在 repo 頂層新增一個 standalone 的 React app（`knowledge-map/`），`npm run dev` 即可執行、無後端。一支 Node 生成 script 把 `learn/*/` 的 markdown（frontmatter + wikilinks + tier/order）parse 成一份 `data.json`（commit 進 repo），app 只吃這份靜態資料。

地圖是一棵「鋸齒塔」：每個 tier = 一條水平樓層，樓層由上往下疊成塔；塔上的每個 mini-boss tile = 一個 path。Spine 箭頭沿全局 `order` 蛇形穿過整塔、tier 交界下墜到下一層。連線分三種語義、用不同樣式：spine 主幹實線、共享概念虛線、顯式 edge 輝光線（現在 `edges/` 還是空的，但 renderer 要支援）。未寫完（`status != content-written`）的 path 是未點亮的 ghost tile，學習者用 localStorage 標記通關後點亮。

點擊 tile 彈出半透明 backdrop-blur DetailPane，兩層導覽：該 path 教的 node 與關聯的 node chips，點 chip 面板內滑動切換到 node 全文；右上角有「整篇閱讀」全屏模式。支援 pan/zoom、鳥瞰預設、hash deep-link。外觀復刻 chartr：暖色單調暗色座艙、IBM Plex、fill-over-border、輝光只用在地圖上。

## User Stories

1. 作為學習者，我能在頂欄切換 subject，所以我可以一次只探索一個知識星雲（避免跨 subject 的 ID 混淆）。
2. 作為學習者，我開場就能鳥瞰整座塔，所以我可以一眼看到整個學習路線的形狀與規模。
3. 作為學習者，我能看到每個 tier 是一個獨立樓層並有它的描述性標題（如「心智模型」「操作規則」），所以我知道路線如何分關卡。
4. 作為學習者，我能看到每個樓層內的 path 依 `order` 從左到右排列，所以我知道該關卡內的先後順序。
5. 作為學習者，我能看到塔的鋸齒錯位（zig-zag），所以地圖有遊戲關卡選擇的爬塔感。
6. 作為學習者，我能看到每個 tier 的最後一個 path 帶有 boss 標記，所以我知道每個大關卡的頭目在哪。
7. 作為學習者，我能看到 spine 實線箭頭沿全局順序蛇形穿過整塔，所以我知道跨樓層的學習路徑。
8. 作為學習者，我能看到 tier 交界處 spine 箭頭下墜到下一層，所以我知道關卡之間的通道。
9. 作為學習者，我能看到兩個 path 共享同一個概念 node 時畫出的虛線連結，所以我知道哪些關卡在概念上相通。
10. 作為學習者，當某個 subject 的 `edges/` 有顯式 edge 時，我能看到輝光線並與其他連線區分，所以我能注意到跨 path 的高價值關係。
11. 作為學習者，我能看到 `status != content-written` 的 path 是未點亮的 ghost tile，所以我知道哪些關卡還沒完成、塔還有哪些部分會長出來。
12. 作為學習者，我能把一個 path 標記為完成，tile 便永久點亮（未完成的自動變為可點亮），所以我有爬塔通關的進度感。
13. 作為學習者，我的通關進度存在 localStorage，重整或下次開啟還在，所以我不會失去進度。
14. 作為學習者，我能重置進度，所以我可以重爬這座塔。
15. 作為學習者，我 hover 一個 tile 能看到 tooltip（標題、狀態、學習目標），所以我在點擊前就能分辨關卡。
16. 作為學習者，我點擊 tile 會在半透明模糊的 DetailPane 中看到該 path 的 Lesson，所以我可以在不離開地圖的情況下讀內容。
17. 作為學習者，DetailPane 會列出該 path「教的 node」chips，所以我知道這關的主軸概念。
18. 作為學習者，DetailPane 會列出該 path「關聯的 node」chips（由概念圖推導：Connections 雙向、前置知識、顯式 edge），所以我知道這關跟星雲的哪部分接壤。
19. 作為學習者，我點任一 node chip，面板會在同一位置滑動切換到該 node 的全文（Problem Statement／比喻／Connections／Questions…），所以我可以深入任何概念而不迷失在地圖之外。
20. 作為學習者，內容中的 `[[wikilinks]]` 會被解析成可點擊的內部導航，所以我可以順著連結在星雲中移動。
21. 作為學習者，我點「整篇閱讀」會把該 path 展開成全屏 markdown 排版文章，所以我可以在需要專注時進入深讀模式。
22. 作為學習者，我可以 grab 拖移、滾輪縮放地圖，所以我可以檢查塔的任何細節。
23. 作為學習者，我有 zoom/reset 按鈕回到鳥瞰，所以我不會迷失。
24. 作為學習者，當前位置可用 hash deep-link（`#s=<subject>&p=<path-id>`）表達，所以我可以分享或重整而不丟失所在關卡。
25. 作為學習者，我看到的是 chartr 風格的暖色暗色座艙介面，所以視覺與我熟悉的工具一致。
26. 作為學習者，UI chrome 標籤是 zh-Hant、node/path 標題保持資料原樣，所以介面語言跟學習內容一致。
27. 作為開發者，我改完 markdown 後重跑生成 script 就能得到更新的 `data.json`，所以地圖永遠跟 source of truth 同步。
28. 作為開發者，生成 script 是確定性的，同一份 markdown 永遠產出同一張圖，所以我能可靠地測試它。
29. 作為開發者，`npm run dev` 就能跑整個 app（無後端、無 CORS），所以我可以獨立於其他工具開發這個功能。
30. 作為開發者，ddia 底下的嵌套重複資料夾會被生成器排除，所以地圖不會出現幽靈節點。
31. 作為開發者，當 subject 有 skeleton path（`nodes: []`）、沒有 edges 資料夾或邊是空的時，app 照常渲染（空面板、無輝光線），所以任何 subject 都能開圖。

## Implementation Decisions

- **專案**：repo 頂層新增 `knowledge-map/`，React 19 + Vite + TypeScript + Tailwind v4（CSS-first）+ `@fontsource` self-host IBM Plex Sans/Mono + 一套輕量 React icon 集。Standalone、無後端、`npm run dev` 即可跑。
- **資料管道**：`scripts/generate-data.mjs`（Node）parse `learn/*/` 的 path/node/edge frontmatter、body wikilinks、path 的 `tier`/`order`；排除 ddia 的嵌套重複資料夾；輸出 `data.json` commit 進 repo。內容 markdown 由 script 預渲染成 HTML，metadata 保留原始 markdown 字串以備除錯。
- **資料契約**（`data.json`，來自本次設計討論，非原型）：
  ```ts
  type SubjectGraph = {
    subject: string;                 // slug，如 "design-data-intensive-applications"
    tiers: { tier: number; title: string; pathIds: string[] }[];
    paths: PathNode[];               // 地圖上的 mini-boss
    edges: Edge[];                   // 三種語義
  };
  type PathNode = {
    id: string; title: string; tier: number; order: number;
    duration: string; goal: string;
    status: "draft" | "confirmed" | "nodes-written" | "content-written" | "edges-written";
    taughtNodeIds: string[];         // 來自 frontmatter `nodes:`
    relatedNodeIds: string[];        // 由 Connections 雙向 / 前置知識 / 顯式 edge 推導
    contentHtml: string;             // Lesson + nodes 摘要，預渲染
    fullArticleHtml: string;         // 整篇閱讀用
    sources: string[];               // [[sources/...]] 原樣
  };
  type Edge = {
    from: string; to: string;        // path ids
    kind: "spine" | "shared-concept" | "explicit";
    label?: string;                  // explicit edges 才有
  };
  ```
- **圖模型**：塔上節點 = path。連線語義：`spine`（實線箭頭，tier 內依 `order`、tier 交界由上層最後一個 path 指到下層第一個）、`shared-concept`（虛線，兩個 path 的 `nodes:` 重疊）、`explicit`（輝光線，來自 `edges/` frontmatter 的 from/to）。視覺以 chartr 星圖色區分（resolved 綠／frontier 藍／claimed 琥珀）。
- **佈局**：鋸齒塔。每 tier = 一條水平樓層、垂直堆疊；樓層內 tiles 依 `order` 左到右並 zig-zag 錯位；每層最後一個 path 飾以 boss 標記。tile 尺寸與樓層間距為可調參數（保留在單一佈局模組）。
- **渲染**：SVG（DOM）— tile 與箭頭是真實 DOM，hover/click 免費、文字清晰。pan/zoom 用相機 transform；預設鳥瞰整塔；zoom/reset 按鈕。背景加星塵/輝光強化「星雲」感（SVG 元素即可，不需要 canvas 粒子引擎）。
- **deep-link**：hash 路由 `#s=<subject>&p=<path-id>`；開啟時自動聚焦該 tile；subject 切換與 path 選取都寫回 hash。
- **DetailPane**：半透明 backdrop-blur、border-left 接縫、疊在地圖上（復刻 chartr DetailPane）。兩層導覽：`taughtNodeIds` 與 `relatedNodeIds` chips，點擊在面板內滑動切換到該 node 全文；右上角「整篇閱讀」切到全屏文章檢視（同面板內狀態，不做獨立路由頁）。
- **關聯 node 推導**：某 path 的相關 node = 其 `nodes:` 內每個 node 的 `Connections` 段落連出去與連進來的 node + 前置知識（如 `Prerequisites`）指向的 node + `edges/` 的 from/to。保留在生成 script，前端只消費 `relatedNodeIds`。
- **進度**：localStorage 存「完成 path」集合；`content-written` 自動視為完成；手動標記通關點亮 ghost tile；可重置。不實作匯出/匯入。
- **視覺 token**：從 chartr/web `app.css` 移植 oklch token 盤（`#0C0C09` 底、warm charcoal card、ivory foreground、muted olive-gray、10% white border、0.45rem radius）到 CSS variables；dark-only。fill-over-border 原則：tile 用淡色平版，border 只表示選中/焦點。
- **chrome 語言**：zh-Hant 標籤；node/path 標題照資料原樣。subject 切換器放頂欄 40px bar。

## Testing Decisions

- **單一測試 seam**：生成 script 的「markdown → `data.json`」契約。這是全 feature 唯一高風險、高決策密度、純 Node 無 DOM 的點；UI 全部以 `npm run dev` 人工驗證，不寫單元測試（越多 seam 越差，理想是 1 個）。
- **測什麼**：以 fixture markdown（小型假 subject，含多 tier、skeleton、重複資料夾、空 edges 資料夾）餵入生成函式，斷言：tier/order 排序、spine/shared-concept edge 的推導、status 判定、`taughtNodeIds`/`relatedNodeIds`、wikilink 解析成內部 id、嵌套重複資料夾排除、輸出確定性（同輸入兩次結果一致）、`contentHtml`/`fullArticleHtml` 產生。
- **怎麼測**：Vitest + 純 Node（不需要 jsdom）。生成器拆成純函式 `parseMarkdown(tree) → SubjectGraph` + 薄 CLI wrapper，讓測試只碰純函式。
- **先例**：chartr/web 已用 Vitest 測 star-map seam、layout 確定性、tokens、reorder logic — 本 repo 已有 vitest 先例，測試風格沿用。

## Out of Scope

- 淺色主題（dark-only；token 用 CSS 變數，未來好加）。
- 撰寫/編輯 `edges/` 的 UI（renderer 支援顯式 edge，但資料尚未存在）。
- 進度匯出/匯入（跨裝置同步）。
- 後端、持久化、登入。
- 獨立路由頁（不用 react-router；hash deep-link 即可）。
- 第三方圖表/圖形 library（自繪 SVG，無 d3/recharts）。
- 遊戲化超越「點亮進度」（無分數、無解鎖機制）。
- chartr 的其它功能（terminal、tickets、star-map 的完整實作）。

## Further Notes

- 先前被引用的 `.plan/maps/knowledge-nebula/assets/tower-map-stub.html` 在所有 repo 中都不存在 — 無既有 artifacts，此 spec 為唯一來源。
- 視覺 token、`.cockpit-bar`、`.prose` 排版、star-map 輝光色直接參考 `chartr/web/src/app.css` 與 `chartr/web/src/lib/starmap/theme.ts`。
- 遵循 AGENTS.md：`sources/` 不可變；生成 script 只讀 `learn/` 與 `sources/`（source 連結原樣保留），不改寫任何來源。
- 4 個 subject 的 path 數量範圍 11–30、tier 範圍 4–8 — 佈局參數需在最多（ai-coding 30 paths / 8 tiers）與最少（quant 11 paths / 4 tiers）之間都讀得順。
- 後續 `/to-tickets` 可依此 spec 拆 ticket（tracer-bullet 順序：資料契約 → 生成 script → SVG 塔 → DetailPane → 深讀 → 互動細節）。
