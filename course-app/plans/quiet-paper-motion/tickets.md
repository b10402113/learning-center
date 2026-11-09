# Tickets: Quiet Paper Motion — Course App 動態

把 [`ANIMATION-PLAN.md`](../ANIMATION-PLAN.md) 的 A–E 批次切成 5 張可獨立驗證的垂直切片：先建立動態語彙，再分頭做導覽/閱讀、quiz、地圖與 overlay，最後做跨切面驗收。完整設計與「明確不做」清單以該計畫為準。

Work the **frontier**：任何 blocker 都完成的票就可以開始。1 是先做的 prefactor；2–4 完成 1 後可各自並行；5 等 1–4。

## 全域護欄（每張票都適用）

- 只動 `opacity`、`transform`；例外僅 sidebar accordion 的高度與 modal 的縮放。
- 位移上限 8px；出場 ≤150ms、進場比出場慢；一畫面最多 1–2 個主動畫。
- 文章段落本體不做 scroll reveal；不做計畫第 1 節「明確不做」清單（h2 底線、視差、scroll-jacking、逐字/逐行、spring、彩帶、全域色彩 crossfade、頁面出場、滑鼠跟隨）。
- 全數尊重 `prefers-reduced-motion`；JS 驅動的動態用 `matchMedia` 或共用 hook 判斷。
- 不加任何套件。
- 每張票完成時 `npm test`、`npm run build` 必須綠。

## 1. Motion foundation + App shell

**What to build:** 建立全站動態語彙，並讓 app 外殼在 route 切換、focus mode、載入與主題切換時有安靜的第一眼回饋。導覽要先能用、內容要先可讀，動態只是定位與狀態提示，不能延遲上一頁/下一頁，也不能讓文章位置跳動。

**Blocked by:** None — can start immediately.

- [ ] `:root` 與 `:root.dark` 都有 `--mo-fast`、`--mo-base`、`--mo-slow`、`--mo-ease`、`--mo-ease-io`，兩主題同值
- [ ] 共用的 `usePrefersReducedMotion` 回傳目前偏好，media query 在執行中變更（不需重載）時即時更新；偏好解析有可單測的 pure seam，`npm test` 覆蓋
- [ ] `.lc-enter`、`.edge-draw`、`.figure-in` 三個 utility 可用；既有全域 reduced-motion 規則保留
- [ ] route 變更時 main 內容以 200ms、6px 上浮淡入播放一次；切 theme / focus / rail 不重播
- [ ] 導覽不因進場動畫延遲，上一頁/下一頁立即切換
- [ ] focus mode 讓側欄與 ContextRail 以 160ms 淡出/淡入；保留掛載、不改欄寬，文章位置不動
- [ ] focus mode 隱藏的側欄/rail 以 `inert`（或等效）退出 Tab 順序，鍵盤不會進到隱藏控制
- [ ] 閱讀進度條以 90ms linear 過場移動；比例 0 或 1 時外框以 150ms 淡出；仍用 `scaleX`，不動 layout
- [ ] 載入分支改為 1.6s 慢呼吸（opacity .55↔.85），最短顯示 150ms，`aria-busy="true"`
- [ ] 主題按鈕 icon 以 180ms `rotate(-12deg)` + opacity 交換；不做全站色彩過場
- [ ] reduce 下所有上述動態立即完成、內容立即可讀
- [ ] 既有測試與 build 綠；沒有新增套件

## 2. Sidebar + 閱讀面

**What to build:** 讓左側課程導覽的展開/收合與手機 drawer 順暢，右側目錄的 active 提示從「文字變色」升級為一條會移動的書籤，目錄跳轉尊重 reduced-motion，文章圖片載入時安靜淡入且不造成 CLS。

**Blocked by:** 1. Motion foundation + App shell

- [ ] 選取節點時 step 子清單以 `0fr→1fr` + 淡入 200ms 展開，切換節點時平滑收合；不再瞬間出現/消失
- [ ] 非展開節點的 step 連結不可被 Tab 聚焦（`inert` / `hidden` / 等效），避免鍵盤進到看不到的內容
- [ ] 桌面版 sidebar 展開/收合不移動文章；手機 390px 內容不被裁切
- [ ] 手機 drawer 統一 180ms 位移、遮罩 150ms `--mo-ease`；既有 `aria-hidden` 行為不變
- [ ] ContextRail 目錄出現一條絕對定位橘色指示條，量測 active link 的 `offsetTop`/`height` 並以 160ms `translateY` 移動；`useLayoutEffect` + `ResizeObserver` 在視窗縮放時重算
- [ ] 指示條在 dark mode 對比足夠；不與既有 active 文字樣式打架
- [ ] `jumpTo` 在 `prefers-reduced-motion: reduce` 時用 `behavior:"auto"`；正常模式維持平滑
- [ ] 文章圖片初始 `opacity:0`，`onLoad` 以 240ms 淡入；`img.complete`（已快取）直接顯示，不閃爍
- [ ] 圖片淡入不造成 CLS（不縮放、不加 blur、不改尺寸）
- [ ] reduce 下指示條不移動、圖片不淡入、目錄立即跳；內容立即可讀
- [ ] 既有測試與 build 綠

## 3. Quiz 回饋

**What to build:** 讓作答的每個狀態都有清楚但克制的回饋：按下的觸感、答錯的單次輕推、答對的框線/打勾/解析、換題的方向感、進度圓點與完成頁的一次性進場。不改答題邏輯與可及性。

**Blocked by:** 1. Motion foundation + App shell

- [ ] 選項按鈕 pointer down 時 `active:scale(0.995)`，120ms；文字位置不變
- [ ] 答錯時一次性水平輕推 `translateX(-2px→2px→0)` 180ms，只跑一次；不 loop、不 shake、不彈跳
- [ ] 答對時選項橘框淡入 160ms；打勾 SVG 以 `stroke-dashoffset` 描邊 280ms（需 `pathLength=1`）；解析以 opacity + 4px 上浮 200ms
- [ ] QuizDeck 換題記住 next/prev 方向，內容以 `translateX(±8px)→0` + 淡入 180ms 進場；`key={index}` 保留
- [ ] active 進度圓點 `scale(1.3)` 160ms，transform-origin center；顏色照舊
- [ ] 完成頁標題/分數/按鈕以 20ms stagger 淡入上移 4px，總長 <400ms，只跑一次
- [ ] 答題狀態、正解判定、`aria-live` 與 disabled 行為完全不變
- [ ] 手機 390px 換題與按壓正常
- [ ] reduce 下無位移/描邊，解析與完成頁內容立即可讀
- [ ] 既有測試與 build 綠

## 4. 地圖與 overlay

**What to build:** 讓 Roadmap 第一次進場有結構感、hover/focus 的連線不再硬切、縮放有過場但拖曳不延遲；知識圖在篩選與 settle 時安靜 crossfade；Block modal 開關有進出場、關閉可中斷、modal 內切換知識點時內容 crossfade，且 focus trap / focus restore 不變。

**Blocked by:** 1. Motion foundation + App shell

- [ ] Roadmap 首次掛載時節點卡依 tier + 順序以 20ms/張、`opacity` + `translateY(8px)` 進場，總長 <600ms；reduce 時直接顯示
- [ ] 先備邊以 `pathLength=1; stroke-dasharray:1; stroke-dashoffset:1→0` 描繪 400ms，依 tier 延遲；邊多時上限 600ms；reduce 時停用
- [ ] 地圖開場總長 <1s；50 個節點時無明顯掉幀；開場不阻塞 hover/drag/zoom
- [ ] hover/focus 節點時邊的 `stroke-opacity`/`stroke-width` 以 CSS transition 140ms 過場；非鄰居淡出 160ms；不再每次 render 硬切
- [ ] 縮放按鈕/重設的 transform 有 160ms 過場；`pointerdown` 拖曳與 wheel 縮放期間移除過場，拖曳維持 1:1 無延遲
- [ ] BlockGraph 外層 wrapper 在篩選重建時 180ms opacity crossfade，force settle 後 200ms 淡入；canvas 本身不加 CSS transition，不干擾既有 `fitted` opacity 邏輯
- [ ] BlockModal 開啟時遮罩 150ms 淡入、面板 220ms `scale(.98)→1` + `translateY(8px)→0`；不改 focus trap
- [ ] BlockModal 關閉反向 140ms 後才呼叫 `onClose`；Esc 與背景點擊走同一條；local `closing` state 避免閃爍；關閉動畫可中斷
- [ ] modal 關閉後焦點正確回到觸發元素；body scroll lock 保留
- [ ] modal 內切換相關知識點時，內容區只在 `blockId` 改變時以 160ms opacity crossfade
- [ ] reduce 下上述動態立即完成；地圖與 modal 內容立即可讀
- [ ] dark mode 下邊線、遮罩、面板對比足夠
- [ ] 既有測試與 build 綠
- [ ] 若單一 context 吃不下，實作時可拆成 4a（Roadmap）與 4b（BlockGraph + BlockModal），但 blocking edges 不變

## 5. Motion acceptance sweep

**What to build:** 在整個 app 中逐項驗收計畫第 9 節的行為，確認 1–4 的動態彼此不打架；只修整合時發現的缺陷，不新增動態效果。

**Blocked by:** 1. Motion foundation + App shell; 2. Sidebar + 閱讀面; 3. Quiz 回饋; 4. 地圖與 overlay

- [ ] `npm test`、`npm run build` 通過
- [ ] `prefers-reduced-motion: reduce` 下：無位移、無描邊、無平滑捲動；所有內容立即可讀
- [ ] 鍵盤 Tab 在 focus mode 關閉側欄後不會進到隱藏控制
- [ ] modal 開關焦點正確回到觸發元素；Esc 有出場動畫且可中斷
- [ ] 切換 theme / focus / rail 不會重播 view 進場（route 進場只綁 routeKey）
- [ ] 路由切換不延遲、不阻擋上一頁/下一頁
- [ ] 地圖開場總長 <1s；節點 50 個時無明顯掉幀
- [ ] 圖片淡入不造成 CLS；已快取圖片不閃
- [ ] 手機 390px：drawer、accordion、quiz 換題都正常
- [ ] dark mode 下指示條、邊線、骨架對比足夠
- [ ] 執行中把 `prefers-reduced-motion` 切到 reduce（不重載）時，監聽即時生效
- [ ] 沒有新增套件，也沒有做計畫「明確不做」清單中的效果
