# Course App 動態計畫（Quiet Paper Motion）

狀態：**已討論、尚未實作**
定案：全部 A–E 批次都做；強度一律「安靜紙本」；不做 h2 底線簽名動畫。

## 1. 定案與邊界

- 動態只服務「導覽定位、狀態回饋、第一眼理解結構」，不當裝飾。
- 位移上限 8px（地圖開場的卡片上浮也維持 8px）。
- 只動 `opacity`、`transform`；例外僅側欄 accordion 的高度與 modal 的縮放。
- 進場比出場慢；出場 ≤150ms，且不阻塞導覽。
- 一個畫面最多 1–2 個主動畫；文章段落本體不做 scroll reveal。
- 不加任何套件：CSS transition/keyframes + 少量 Web Animations API 即可。
- 全部遵守 `prefers-reduced-motion`；JS 驅動的動態另外用 `matchMedia` 判斷。
- 不改「文章位置不動」的既有承諾：focus mode 只淡出側欄，不改欄寬。

**明確不做**：h2 底線描繪、視差、scroll-jacking、逐字/逐行進場、彈跳 spring、彩帶、全域色彩 crossfade、頁面出場動畫、滑鼠跟隨效果。

## 2. Motion Tokens

加在 `src/index.css` 的 `:root` / `:root.dark`（兩邊同值即可）：

```css
--mo-fast: 120ms;   /* 按壓、hover 回饋 */
--mo-base: 200ms;   /* 進場、accordion、面板 */
--mo-slow: 340ms;   /* 地圖開場、簽名式動態 */
--mo-ease: cubic-bezier(0.22, 1, 0.36, 1);       /* 進場、位移 */
--mo-ease-io: cubic-bezier(0.65, 0, 0.35, 1);    /* 狀態切換 */
```

全域 reduced-motion 規則已存在（`index.css:123`），會把 animation/transition 歸零；新增動態不需再重複處理，**但 JS 觸發的平滑捲動與 canvas/JS 動畫要自己擋**。

## 3. 共用工具

1. `src/lib/use-prefers-reduced-motion.mjs`：回傳 boolean，監聽 media query 變化。給 `jumpTo`、RoadmapCanvas、BlockGraph 使用。
2. `src/index.css` 新增 utilities：`.lc-enter`（view 進場）、`.edge-draw`（地圖畫線）、`.figure-in`（圖片淡入）。
3. `App.jsx` 的 `routeKey`（`App.jsx:193`）只包含 subject/node/step/block，**不含** theme/focus/rail，正好可作為 view 進場的 key，不會因 UI 狀態重播。

---

## 4. Phase A — 導覽骨架

| # | 位置 | 觸發 | 規格 | 備註 |
|---|---|---|---|---|
| A1 | `src/App.jsx` main 內容容器（約 647–693） | route 變更 | 外層 `<div key={routeKey} className="lc-enter">`；`opacity 0→1`、`translateY(6px)→0`，200ms `--mo-ease`。只做進場 | 不用出場，避免導覽延遲；inner key 本來就會 remount |
| A2 | `src/App.jsx` 側欄與 ContextRail 條件渲染（633、699） | focus mode 切換 | 保留掛載，`opacity 1↔0` 160ms；同時 `inert` + `pointer-events-none` 避免鍵盤進入 | 不加寬度動畫，文章不動 |
| A3 | `src/components/Sidebar.jsx` active node 的 step 子清單（230–259） | 選取節點 | 外層 `display:grid; grid-template-rows:0fr→1fr`，內層 `overflow:hidden`；搭配淡入 200ms | 需要把條件渲染改成「永遠渲染 + 展開 class」，或用 measured max-height |
| A4 | `src/components/Sidebar.jsx` drawer（384–402） | 開關 | 維持既有 translate，統一 180ms `--mo-ease`；遮罩 150ms | 只調參數 |

## 5. Phase B — 閱讀與目錄

| # | 位置 | 觸發 | 規格 | 備註 |
|---|---|---|---|---|
| B1 | `src/components/ContextRail.jsx` TocLink / `<ol>`（109） | active heading 改變 | 在 `<ol>` 內放一條絕對定位橘色指示條，量測目標 link 的 `offsetTop/height`，`transform: translateY()` 160ms | 「書籤移到下一行」；`useLayoutEffect` + `ResizeObserver` |
| B2 | `src/components/ContextRail.jsx` `jumpTo`（8–13） | 點目錄 | 先判斷 `prefers-reduced-motion`；reduce 時 `behavior:"auto"` | 無障礙修正 |
| B3 | `src/components/Markdown.jsx` img（117–125） | 圖片載入 | 初始 `opacity:0`；`onLoad` 加 `.is-loaded` 淡入 240ms。已快取（`img.complete`）直接顯示 | 不縮放、不加 blur，避免 CLS |
| B4 | `src/App.jsx` ReadingProgress（113–123） | 捲動 | 進度條加 `transition: transform 90ms linear`；比例 0 或 1 時外框 `opacity` 淡出 150ms | 保留 `transform: scaleX()`，不動 layout |

## 6. Phase C — 測驗回饋

| # | 位置 | 觸發 | 規格 | 備註 |
|---|---|---|---|---|
| C1 | `src/components/Quiz.jsx` 選項按鈕（48–74） | pointer down | `active:scale(0.995)` 120ms | 只做按下回饋，不改文字位置 |
| C2 | `src/components/Quiz.jsx` 答錯 | 選到錯項 | 一次性水平輕推 `translateX(-2px→2px→0)` 180ms，跑一次 | 不用 shake 迴圈、不彈跳 |
| C3 | `src/components/Quiz.jsx` 答對 | 選到正解 | 選項橘框淡入 160ms；打勾 SVG 用 `stroke-dashoffset` 描邊 280ms；解析 `opacity+4px rise` 200ms | 打勾需加 `pathLength=1` |
| C4 | `src/components/QuizDeck.jsx` Quiz（77–82） | 換題 | 記住方向（next/prev），內容 `translateX(±8px)→0` + 淡入 180ms；方向決定正負 | `key={index}` 保留 |
| C5 | `src/components/QuizDeck.jsx` 進度圓點（61–73） | index 改變 | active 圓點 `scale(1.3)`，160ms；顏色照舊 | transform-origin center |
| C6 | `src/components/QuizDeck.jsx` 完成頁（32–50） | 進入 finished | 標題/分數/按鈕 20ms stagger 淡入上移 4px，總長 <400ms | 只跑一次 |

## 7. Phase D — 地圖與知識圖

| # | 位置 | 觸發 | 規格 | 備註 |
|---|---|---|---|---|
| D1 | `src/components/RoadmapCanvas.jsx` 節點卡（223–261） | 首次掛載 | 每張卡 `--i` 依 tier+順序，`opacity+translateY(8px)` 進場，delay 20ms/張，總長 <600ms | reduce 時直接顯示 |
| D2 | `src/components/RoadmapCanvas.jsx` 先備邊（190–206） | 與 D1 同時 | `pathLength=1; stroke-dasharray:1; stroke-dashoffset:1→0`，400ms，依 tier 延遲 | 邊多時上限 600ms；reduce 時停用 |
| D3 | `src/components/RoadmapCanvas.jsx` hover（190–206） | hover/focus 節點 | 邊的 `stroke-opacity`/`stroke-width` 改 CSS transition 140ms；非鄰居淡出 160ms | 現在是每次 render 硬切 |
| D4 | `src/components/RoadmapCanvas.jsx` transform 容器（164–170） | 縮放按鈕/重設 | 加 160ms transform 過場；`pointerdown` 期間與 wheel 縮放時移除 class | 拖曳不能有延遲感 |
| D5 | `src/components/BlockGraph.jsx` 外層容器（502） | 篩選重建 / settle | 外層 wrapper `opacity` crossfade 180ms；settle 後淡入 200ms | canvas 不放 CSS transition；force 模擬本身就是動態 |
| D6 | `src/components/BlockModal.jsx` 遮罩與面板（127–139） | 開啟 | 遮罩淡入 150ms；面板 `scale(.98)→1` + `translateY(8px)→0` 220ms | 不改 focus trap |
| D7 | `src/components/BlockModal.jsx` 關閉 | 關閉 | 反向 140ms 後才呼叫 `onClose`；Esc 與背景點擊走同一條 | 需要 local `closing` state；避免關閉時閃爍 |
| D8 | `src/components/BlockModal.jsx` 相關知識點切換 | modal 內導覽 | 內容區 `opacity` crossfade 160ms | 只在 blockId 改變時 |

## 8. Phase E — 載入與主題

| # | 位置 | 觸發 | 規格 | 備註 |
|---|---|---|---|---|
| E1 | `src/App.jsx` 載入分支（610–616） | course 載入中 | 骨架改為 1.6s 慢呼吸（`opacity .55↔.85`）；最短顯示 150ms 避免閃爍；`aria-busy="true"` | 取代靜態 OrbitMark + Loading 文字 |
| E2 | `src/App.jsx` 主題按鈕 icon（593） | 切換主題 | icon `rotate(-12deg)+opacity` 交換 180ms | 不做全站色彩過場（canvas 讀色時機會打架） |
| E3 | `src/App.jsx` header PixelMark（549） | hover | 維持現有 ring 變化即可，不加動態 | 控制總量 |

---

## 9. 驗收清單

- [ ] `npm test`、`npm run build` 通過
- [ ] `prefers-reduced-motion: reduce` 下：無位移、無描邊、無平滑捲動；所有內容立即可讀
- [ ] 鍵盤 Tab 在 focus mode 關閉側欄後不會進到隱藏控制（A2 的 `inert`）
- [ ] modal 開關焦點正確回到觸發元素；Esc 有出場動畫且可中斷
- [ ] 切換 theme / focus / rail 不會重播 view 進場（A1 只綁 `routeKey`）
- [ ] 路由切換不延遲、不阻擋上一頁/下一頁
- [ ] 地圖開場總長 < 1s；節點 50 個時無明顯掉幀
- [ ] 圖片淡入不造成 CLS；已快取圖片不閃
- [ ] 手機 390px：drawer、accordion、quiz 換題都正常
- [ ] dark mode 下指示條、邊線、骨架對比足夠
- [ ] `prefers-reduced-motion` 變更為動態（非重新載入）時，監聽會即時生效

## 10. 實作順序與預估

1. **Token + 共用 hook + `.lc-enter`**（基礎，0.5 天內）
2. **Phase A**：view 進場 → focus fade → accordion → drawer 參數
3. **Phase B**：TOC 指示條 → jumpTo 修正 → 圖片淡入 → 進度條
4. **Phase C**：quiz 按壓/答錯/答對 → 換題 → 點與完成頁
5. **Phase E**：骨架與主題 icon（小，順手做）
6. **Phase D**：roadmap 開場畫線 → hover/縮放 → block graph fade → modal 進出

D 放最後，因為它是唯一需要實測效能的批次；若時間不足，可只做 D3/D5/D6，跳過 D1/D2 的地圖開場。
