---
source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay
source_type: codebase
source_lines: 7285
language: TypeScript
file_count: 100
part: 1
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `app/` — Next.js App Router 的兩個介面：公開購票流程（活動、結帳、訂單、開發者設定）與 admin 後台（總覽、活動、訂單、退款、折扣碼）。頁面幾乎都是 server component，直接呼叫 `src/db`、`src/domain`、`src/services`；server actions 只做 session 檢查與轉呼叫，讓同一套規則同時被網頁、REST 與 MCP 使用。`app/api` 另外提供 Better Auth、REST v1 與遠端 MCP 三個入口。
- `components/` — 依用途分層的 React 元件：`app` 是狀態徽章、Meter 等產品原語，`admin` 是 KPI 與圖表，`public` 是發票明細與站頭，`shell` 是主題與導覽，`auth` 是登入表單。`ui` 是 shadcn/Radix 的 primitives，只負責焦點、鍵盤與 ARIA 行為。對學習者而言，這裡展示「業務元件」與「設計系統 primitive」如何分開。
- `lib/` — 瀏覽器與 Next.js 邊界的薄層：`api.ts` 把 route handler 包成一致的 405/OPTIONS JSON 合約，`auth.ts` 建 singleton 並提供 `requireSession`，`clock.ts` 提供可注入的測試時鐘，`format.ts` 只在顯示端把 cent 轉成人類金額。`safe-next.ts` 與 `status.ts` 則把安全與狀態語意集中在一個地方。
- `src/` — 與框架無關的核心：`domain` 是純函式定價、退款、發票規則，`db` 是 Drizzle repository 與 schema，`services/orders` 編排金流、座位與 idempotency，`api/v1` 與 `mcp` 只是薄介面。這個分層讓網頁、REST、MCP 三個入口共享同一套金額與退款不變量。學習 agentic engineering 時，重點是「工具與 API 不得自己算錢」。
- `mcp/` — 本機 stdio MCP 伺服器入口，只註冊公開工具（瀏覽活動、查價、搜尋說明），不接觸網路也不做驗證。它把 `src/mcp/tools.ts` 的同一份工具定義用 `serveStdio` 曝露給 Claude Code、Cursor 等客戶端，示範「本地唯讀 agent」與「遠端可寫 agent」的權限切分。
- `proxy.ts` — Next.js 前置中介層：只檢查 session cookie 是否存在就把未登入者導向 `/sign-in`，並保留完整 path/query 作為 `next`；`/api/v1` 則只驗證 percent-encoding，其餘授權留給 route。這是「快速擋人、真正授權仍由頁面與路由自己做」的兩層設計。

# L2 detail

- `#L1-L91` — `app/(public)/page.tsx` — 首頁活動列表。以 `listEvents` 讀取全部活動，依 `now()` 切成 upcoming 與 past，並用 `eventStatus` 顯示早鳥、售完、開演等狀態；示範 server component 直接查資料庫、把時間判斷留給共用 helper。
- `#L1-L18` — `app/(public)/layout.tsx` — 公開頁面的外框：`SiteHeader`、最大寬度主內容與頁尾免責聲明，並強制 dynamic。重點是版面責任與資料責任分離。
- `#L1-L148` — `app/(public)/events/[id]/page.tsx` — 活動詳情頁：顯示日期、場地、早鳥說明、`priceTiers` 價格表與剩餘座位 Meter，並用 GET form 把 qty 帶到結帳頁。展示「價格表由 domain 計算，頁面只負責呈現」。
- `#L1-L150` — `app/(public)/events/[id]/checkout/page.tsx` — 結帳頁 server component：`requireSession` 保護、`checkCode` 驗折扣碼、`quoteOrder` 產生發票，並以 `randomUUID()` 建立一次性 idempotency key。`next/form` 讓更新數量或套用折扣碼時不會清掉已輸入資料。
- `#L1-L36` — `app/(public)/events/[id]/checkout/actions.ts` — `placeOrderAction` server action：從 session 取 email 與 userId（不信任表單），呼叫 `placeOrder`，成功後 redirect 到訂單頁。把「顧客可讀的拒絕」與「真正的程式錯誤」分開處理。
- `#L1-L64` — `app/(public)/events/[id]/checkout/checkout-form.tsx` — 結帳表單 client component：用 `useActionState` 接 server action，將 eventId、qty、code、idempotencyKey 放在 hidden 欄位，email 唯讀並顯示測試卡號。重點是 idempotency key 跟著一次頁面瀏覽，而不是每次點擊重生。
- `#L1-L69` — `app/(public)/orders/page.tsx` — 「我的訂單」列表：`requireSession` 後以 `listOrdersByUser` 只查本人訂單，顯示訂單編號、活動、日期、張數、金額與狀態。示範授權過濾發生在查詢參數，而不是前端隱藏。
- `#L1-L182` — `app/(public)/orders/[id]/page.tsx` — 訂單詳情：先檢查 `isOrderId` 與 `userId`，別人的訂單一律 `notFound()`；再用 `previewCancellation` 顯示「現在取消可退多少」、發票明細與取消表單。核心概念是「不洩漏訂單是否存在」與「退款金額由 domain 預覽」。
- `#L1-L24` — `app/(public)/orders/[id]/actions.ts` — `cancelOrderAction`：session 檢查後呼叫 `cancelOwnOrder`，成功以 `revalidatePath` 更新頁面。把 ownership 檢查留在 service，action 只負責轉接。
- `#L1-L22` — `app/(public)/orders/[id]/cancel-form.tsx` — 取消訂單按鈕的 client component，以 `useActionState` 顯示 pending 與錯誤訊息。簡單但示範 destructive action 的最小 UX。
- `#L1-L53` — `app/(public)/settings/developers/page.tsx` — 開發者設定頁：列出使用者的 API keys、顯示 MCP endpoint 與 Claude Code 安裝指令，並提示唯讀 key 與讀寫 key 的差別。重點是讓 agent 的權限邊界對使用者可見。
- `#L1-L65` — `app/(public)/settings/developers/actions.ts` — 建立、撤銷、輪替 API key 的 server actions。建立 key 是 server-only 呼叫，scope 由伺服器決定；輪替會先建新 key 再刪舊 key。展示「client 不能自選權限」與「撤銷立即生效」。
- `#L1-L157` — `app/(public)/settings/developers/api-keys-panel.tsx` — API key 管理 UI：建立時可選 read/read-write，secret 只顯示一次，支援複製、撤銷與輪替，並用 toast 回饋。對學習者而言，這是「一次性 secret 與可撤銷憑證」的實作範例。
- `#L1-L14` — `app/(public)/sign-in/page.tsx` — 登入頁：用 `safeNext` 清洗 `next` 參數，再交給 `SignInForm`。重點是登入後的返回路徑必須是站內路徑。
- `#L1-L14` — `app/(public)/sign-up/page.tsx` — 註冊頁，與登入頁共用 `SignInForm` 的 sign-up 模式，同樣先過 `safeNext`。展示登入與註冊共享表單、只切換模式。
- `#L1-L171` — `app/admin/page.tsx` — 後台總覽：呼叫 `getOverview` 取得營收、票數、退款、sell-through 的 KPI 與每日序列，搭配 `RevenueChart`、`Sparkline`、`Delta` 與 top events/recent orders 表格。示範把聚合邏輯留在 query 層，頁面只組版。
- `#L1-L31` — `app/admin/layout.tsx` — 後台外框與權限閘門：`requireSession` 後檢查 `role === "admin"`，非管理員只看到提示；通過才掛 sidebar/topbar。重點是授權在 layout 與頁面各檢查一次。
- `#L1-L116` — `app/admin/events/page.tsx` — 活動管理列表：`listEventsAdmin` 聚合每場活動的營收、訂單、退款與售出率，並在取消後顯示退款結果與未付款退款的重試入口。展示 admin 讀模型與操作回饋。
- `#L1-L42` — `app/admin/events/actions.ts` — 取消活動與重試退款的 server actions。取消前要求管理員輸入完整 event id 作為確認，並在 action 內再次檢查角色；重試則呼叫同一個 `cancelEvent` 冪等路徑。這是「高風險操作需要人類確認」的範例。
- `#L1-L36` — `app/admin/events/cancel-event-form.tsx` — 取消活動表單：要求輸入 event id、顯示錯誤、提供「Keep the event」與 destructive 送出按鈕。把不可逆操作的確認成本做進 UI。
- `#L1-L75` — `app/admin/events/[id]/cancel/page.tsx` — 活動取消影響頁：顯示會被退款的訂單數、票數與金額，`via=mcp` 時標示「AI 只準備、尚未變更」。這是 MCP `cancel_event` 深連結落地的人類確認頁。
- `#L1-L21` — `app/admin/events/retry-refunds.tsx` — 重試未送達退款的小型 client form，顯示待處理筆數並呼叫 `retryCancelRefundsAction`。展示「交易已標記、金流尚未完成」的補償路徑。
- `#L1-L84` — `app/admin/orders/page.tsx` — 訂單管理頁：解析 status/event/q/sort/page/peek 參數，呼叫 `listOrdersAdmin` 分頁查詢，並可用 `peek` 開啟單筆訂單 drawer。重點是把 URL 當作 admin 的篩選狀態。
- `#L1-L222` — `app/admin/orders/orders-table.tsx` — 訂單表格 client component：可排序欄位、點列開 Sheet 預覽、顯示顧客、發票、退款、paymentId 與 idempotency key。對學習者而言，這是把「營運除錯所需欄位」直接暴露給管理員的範例。
- `#L1-L83` — `app/admin/orders/filters.tsx` — 訂單篩選器：搜尋 email/name/訂單號、狀態切換、活動下拉，全部同步到 URL，搜尋有 250ms debounce。示範 client 狀態與 server 查詢參數的同步。
- `#L1-L92` — `app/admin/refunds/page.tsx` — 退款報表：彙總退款筆數、退還金額、保留手續費與晚取消（未釋放座位）數量，並列出每筆訂單的退款細節。重點是讓退款政策的结果可稽核。
- `#L1-L71` — `app/admin/codes/page.tsx` — 折扣碼報表：用 `listCodesAdmin` 與 `codeStatus` 顯示折扣、狀態、使用次數/上限、到期日、帶來的訂單與營收。展示 domain 狀態機如何直接驅動 admin 顯示。
- `#L1-L24` — `app/layout.tsx` — 根 layout：載入 Geist Sans/Mono、`ThemeProvider`、`Toaster` 與全域 CSS，設定預設 metadata。重點是字型與主題在全站只初始化一次。
- `#L1-L13` — `app/not-found.tsx` — 全域 404 頁，提供回首頁連結。小檔案但完成 App Router 的錯誤邊界。
- `#L1-L165` — `app/globals.css` — Tailwind v4 設計 token：以 oklch 定義亮/暗色、資料色（chart/positive/negative）、`.surface` 髮絲線邊框與 `.num` 等寬數字。展示「顏色只留給資料、其餘用灰階」的設計系統。
- `#L1-L5` — `app/api/auth/[...all]/route.ts` — Better Auth 的 Next.js catch-all handler，把 GET/POST 轉給 `getAuth()`。所有登入、註冊、session、API key 端點都由這個檔案承接。
- `#L1-L64` — `app/api/mcp/route.ts` — 遠端 MCP server：先用 `resolveCaller` 解析 API key，再為每個請求建立新的 `McpServer`（stateless），匿名者可呼叫公開工具，私有工具則回 JSON-RPC 401。展示「認證在工具之前、每次請求重建 server」的遠端 agent 介面。
- `#L1-L6` — `app/api/v1/[[...path]]/route.ts` — `/api/v1` 的 catch-all：任何未命名路徑都回 JSON 404，避免 Next.js 回 HTML。重點是 API 的錯誤格式一致。
- `#L1-L8` — `app/api/v1/events/route.ts` — `GET /api/v1/events` 的薄 route，只把 `apiDeps()` 與 request 交給 `listEventsEndpoint`。示範 route 檔只做 wiring。
- `#L1-L8` — `app/api/v1/events/[id]/route.ts` — `GET /api/v1/events/{id}` 的薄 route，await params 後交給 `getEventEndpoint`。參數解析與錯誤映射都在 `src/api/v1`。
- `#L1-L8` — `app/api/v1/orders/route.ts` — `POST /api/v1/orders` 的薄 route，交給 `placeOrderEndpoint`。認證、Idempotency-Key 與 body 驗證都在 handler。
- `#L1-L8` — `app/api/v1/orders/[id]/cancel/route.ts` — `POST /api/v1/orders/{id}/cancel` 的薄 route，交給 `cancelOrderEndpoint`。展示 REST 與 web 共用 `cancelOwnOrder`。
- `#L1-L8` — `app/api/v1/quote/route.ts` — `POST /api/v1/quote` 的薄 route，交給 `quoteEndpoint`。報價與下單走同一套 `quoteOrder`，避免兩套價格邏輯。
- `#L1-L25` — `components/admin/delta.tsx` — 期間對比元件：計算百分比或基點變化，`invert` 讓退款下降顯示為好事，`points` 顯示百分點。展示「同一個數字，好壞方向由指標語意決定」。
- `#L1-L84` — `components/admin/revenue-chart.tsx` — Recharts 營收圖：本期用面積圖、前期用虛線，tooltip 顯示兩期金額，顏色全部取自 CSS 變數。重點是圖表元件只吃已整理好的資料點。
- `#L1-L18` — `components/admin/sparkline.tsx` — 伺服器渲染的迷你 SVG 趨勢線，依 min/max 正規化，無互動。適合放在 KPI 卡片內，避免為小圖引入 client JS。
- `#L1-L27` — `components/admin/timeframe.tsx` — 時間範圍選擇器：`TIMEFRAMES` 固定 7/30/90 天，`parseTimeframe` 清洗輸入，選中狀態存在 URL。示範 admin 篩選狀態的可分享性。
- `#L1-L67` — `components/app/primitives.tsx` — 產品原語：`PageHeader`、`StatusBadge`、`Tag`、`SectionLabel`、`Mono`、`Meter`。把狀態標籤與 sell-through 視覺集中在一個檔案，讓全站語彙一致。
- `#L1-L17` — `components/auth/auth-card.tsx` — 登入/註冊卡片的版面與 `FormError`。小元件的責任是統一樣式與錯誤呈現。
- `#L1-L74` — `components/auth/sign-in-form.tsx` — client 登入/註冊表單：呼叫 `authClient.signIn.email` 或 `signUp.email`，成功後 `router.push(next)` 並 refresh。展示 Better Auth client 與 `safeNext` 的搭配。
- `#L1-L67` — `components/auth/user-menu.tsx` — 使用者下拉選單：顯示姓名/email、我的訂單、開發者設定、admin 入口與登出。把角色可見性放在選單層，但真正授權仍在頁面。
- `#L1-L73` — `components/public/invoice-lines.tsx` — 發票明細元件：顯示小計、折扣（含 group/early-bird/code 組成的說明）、tickets、服務費、總額與內含 VAT，所有數字來自 `src/domain/invoice`。附 test id，方便行為測試。
- `#L1-L39` — `components/public/site-header.tsx` — 公開站頭：server component 讀 session，顯示 logo、活動/我的訂單導覽、主題切換與使用者選單。示範 header 的登入狀態由伺服器決定。
- `#L1-L53` — `components/shell/admin-sidebar.tsx` — 後台側欄：以 `usePathname` 判斷 active，列出 Overview/Events/Orders/Refunds/Codes 與回 storefront 連結。展示 admin 導覽的 URL 結構。
- `#L1-L20` — `components/shell/admin-topbar.tsx` — 後台頂欄：顯示 Ops 標籤、幣別、主題切換與管理員 initials。純呈現元件。
- `#L1-L13` — `components/shell/logo.tsx` — TicketBay 標誌與首頁連結，可傳入 href 與樣式。全站品牌的小共用件。
- `#L1-L11` — `components/shell/theme-provider.tsx` — `next-themes` 包裝，使用 class 策略、預設亮色、關閉系統跟隨。展示主題在 root 初始化。
- `#L1-L21` — `components/shell/theme-toggle.tsx` — 亮/暗模式切換按鈕，依 `resolvedTheme` 切換。小但完整的 client 主題控制。
- `#L1-L48` — `components/ui/badge.tsx` — shadcn 風格 Badge：`cva` variants 與 `asChild`，只處理外觀與 Slot 轉發。
- `#L1-L64` — `components/ui/button.tsx` — shadcn 風格 Button：variant/size 用 `cva` 定義，支援 `asChild` 與 SVG 間距。展示設計系統 primitive 的 API 形狀。
- `#L1-L158` — `components/ui/dialog.tsx` — Radix Dialog 包裝：overlay、content、header/footer、title/description 與關閉按鈕，含進出場動畫 class。
- `#L1-L257` — `components/ui/dropdown-menu.tsx` — Radix DropdownMenu 包裝：item、checkbox/radio、label、separator、submenu 等完整子元件。
- `#L1-L21` — `components/ui/input.tsx` — 原生 input 的樣式包裝，處理 focus ring、invalid 與 dark mode。
- `#L1-L24` — `components/ui/label.tsx` — Radix Label 包裝，處理 disabled/peer 狀態。
- `#L1-L31` — `components/ui/progress.tsx` — Radix Progress 包裝，以 translateX 顯示百分比。
- `#L1-L190` — `components/ui/select.tsx` — Radix Select 包裝：trigger/content/item/scroll buttons，支援 sm 尺寸與 popper 定位。
- `#L1-L28` — `components/ui/separator.tsx` — Radix Separator 包裝，支援水平/垂直。
- `#L1-L143` — `components/ui/sheet.tsx` — Radix Dialog 的側邊 drawer 包裝，支援四個方向與關閉按鈕。admin 訂單預覽使用。
- `#L1-L13` — `components/ui/skeleton.tsx` — 載入占位塊，`animate-pulse` 搭配 accent 背景。
- `#L1-L40` — `components/ui/sonner.tsx` — Sonner Toaster 包裝，跟隨主題並自訂 icon 與 CSS 變數。
- `#L1-L116` — `components/ui/table.tsx` — 表格 primitive：Table/Header/Body/Footer/Row/Head/Cell/Caption，處理 overflow 與 hover/selected 狀態。
- `#L1-L91` — `components/ui/tabs.tsx` — Radix Tabs 包裝，支援 default/line variant 與水平/垂直方向。
- `#L1-L18` — `components/ui/textarea.tsx` — 原生 textarea 的樣式包裝，處理 field-sizing 與 invalid 狀態。
- `#L1-L38` — `lib/api.ts` — REST API 的 wiring 層：`apiDeps()` 組出 db/payments/auth/clock，`endpoint()` 為每個 route 補齊 JSON 405 與 OPTIONS Allow，`noEndpoint()` 提供一致的 JSON 404。展示「Next.js 預設回應」如何被改成可預測的 API 合約。
- `#L1-L33` — `lib/auth.ts` — Better Auth 的 app singleton：`getAuth()` 延遲建立、`getSession()` 讀 headers、`requireSession(next)` 未登入即 redirect 並保留返回路徑。把認證入口集中在一個檔案。
- `#L1-L5` — `lib/auth-client.ts` — client 端 Better Auth 實例，掛 `apiKeyClient`。供登入表單與使用者選單使用。
- `#L1-L41` — `lib/clock.ts` — 全 app 的「現在」來源：正式環境用 `Date.now()`，測試時可透過 `TICKETBAY_TEST_CLOCK=1` 與 `tb-test-now` cookie 指定時間；`nowFor(request)` 讓 route handler 在 Next 請求範圍外也能用同一套時鐘。對學習者而言，這是「時間必須可注入」的乾淨示範。
- `#L1-L74` — `lib/format.ts` — 顯示格式化：`money()` 用整數運算拆歐元/cent，避免浮點誤差；另有日期、相對天數與 `orderNumber`。重點是金額只在顯示邊界除 100。
- `#L1-L21` — `lib/safe-next.ts` — 開放轉址防護：用 URL parser 正規化 `next`，只允許同源、單斜線開頭、不含反斜線的路徑。展示「先用瀏覽器的方式解析，再驗證結果」。
- `#L1-L57` — `lib/status.ts` — 活動狀態機與顯示對照：`eventStatus` 依取消、開演、售完、剩不到 10%、早鳥排序，另提供 label 與 Tailwind 色票。讓狀態語意只有一份。
- `#L1-L6` — `lib/utils.ts` — `cn()`：`clsx` + `tailwind-merge`，全站 className 合併的共用工具。
- `#L1-L31` — `mcp/server.ts` — 本機 stdio MCP 入口：載入 `.env`、建立 db/payments、用 `serveStdio` 註冊 `includePrivate: false` 的 server。註解明講 stdout 屬於 protocol，不能 `console.log`。展示本地 agent 的最小安全面。
- `#L1-L35` — `proxy.ts` — Next.js middleware：有 session cookie 就放行，否則導向 `/sign-in?next=...`；`/api/v1` 只檢查 URL percent-encoding，避免 Next 在 route 前回 plain-text 500。重點是 cookie 檢查只是 UX 閘門，真正授權仍在頁面與 route。
- `#L1-L250` — `src/api/v1.ts` — REST v1 的所有 handler：zod 驗證 body/params、`ApiError`/`OrderError`/`PaymentError` 轉 4xx、未知錯誤記錄後回固定 500；`writer()` 檢查 API key 與 `tickets:write` scope，`placeOrderEndpoint` 把 key 命名為 `api:<userId>:<key>`。展示「薄介面、共用 service、可讀錯誤」。
- `#L1-L86` — `src/auth/auth.ts` — Better Auth 設定：email/password、admin plugin、API key plugin（`tb_` 前綴、每分鐘 120 次、預設讀寫）、scope 展開與 `mcpEndpoint`。重點是 API key 的權限模型與 agent 需要的較高 rate limit。
- `#L1-L259` — `src/db/admin-queries.ts` — 後台讀模型：`getOverview` 用一次讀取在 TypeScript 算 KPI、每日序列、sell-through 與 top events；`listEventsAdmin`/`listOrdersAdmin`/`listRefunds`/`listCodesAdmin` 提供篩選、排序、分頁與聚合。展示「小資料集用應用層聚合，金額全程整數 cent」。
- `#L1-L144` — `src/db/auth-schema.ts` — Better Auth 的 Drizzle 表：user/session/account/verification/apikey 與 relations，由 CLI 產生。檔案明講要重新產生而不是手改，展示 schema 與認證套件的同步方式。
- `#L1-L33` — `src/db/checkout-claims-repo.ts` — checkout claim：以 `INSERT ... ON CONFLICT DO UPDATE ... setWhere` 單一語句搶 key，逾期 claim 可被接手；release 只刪自己的 token。重點是「用資料列而非資料庫連線等待慢速金流」。
- `#L1-L47` — `src/db/client.ts` — Postgres/Drizzle 連線層：`openDb` 建 pool、處理 idle error、`migrateDb`、`getDb` 以 globalThis 保持 dev hot reload 單例；匯出 `Db`/`Tx`/`DbLike` 型別。展示 repository 可同時吃 db 與 transaction。
- `#L1-L37` — `src/db/codes-repo.ts` — 折扣碼 repository：讀取、`getCodeForUpdate` 取 row lock、`incrementUses` 原子加一。讓「最後一次使用」不會被兩個結帳同時吃掉。
- `#L1-L52` — `src/db/events-repo.ts` — 活動 repository：`toDomainEvent` 轉 domain 型別、`getEventForUpdate` 鎖列、`adjustSeatsSold` 原子加減、`markEventCancelled`。座位正確性靠 row lock 與 CHECK constraint 雙保險。
- `#L1-L134` — `src/db/orders-repo.ts` — 訂單 repository：建立前檢查安全整數、查詢本人/活動訂單、`markRefunded` 用 `WHERE status='paid'` 保證只退一次、`toDomainOrder` 把服務費排除在可退金額外。展示「冪等由 SQL 條件保證」。
- `#L1-L139` — `src/db/schema.ts` — 資料庫 schema：events、discount_codes、orders、checkout_claims、voided_charges。金額與時間用 BIGINT number、加 CHECK 約束（座位範圍、價格非負、退款不超過票款）與索引。檔案開頭說明「金流路徑不用浮點」。
- `#L1-L21` — `src/db/voided-charges-repo.ts` — 作廢扣款：`lockCheckoutKey` 用 `pg_advisory_xact_lock` 序列化同一 checkout key 的金錢決策，`recordVoid` 先記錄再退款，`isChargeVoided` 讓後續 booking 拒絕已作廢的 charge。這是避免「退錢又被訂走」的關鍵。
- `#L1-L42` — `src/domain/booking.ts` — 預訂純函式：`seatsAvailable` 夾在 0 以上、`bookTickets` 驗證整數/折扣/價格/開演並拒絕超賣，還在折扣前檢查 `gross` 是否安全整數；`groupDiscount` 定義 5+ 5%、10+ 10%。展示「賣出的訂單必須能被退款路徑接受」。
- `#L1-L29` — `src/domain/cancellation.ts` — 取消預覽：以 `calculateRefund` 與 `netRefund` 算 gross/net，`feeCents = gross - net`，`windowOpen` 決定是否釋放座位。把退款與庫存兩個結果綁在同一個決策物件。
- `#L1-L12` — `src/domain/fees.ts` — 服務費 3%、最低 100、上限 2000 cent；`vatPortion` 從含稅總額反推 27% VAT。兩個小函式但邊界明確。
- `#L1-L74` — `src/domain/invoice.ts` — 發票計算：小計、團體/早鳥/折扣碼百分比、合計上限 100%、服務費與內含 VAT；早鳥定義為距開演至少 30 天。是 REST、MCP、網頁共用的唯一價格來源。
- `#L1-L79` — `src/domain/pricing.ts` — 折扣碼與報價：`normalizeCode`、`codeStatus`（disabled/expired/exhausted）、`checkDiscountCode` 回顧客可讀原因、`priceTiers` 產生價格表、`quote` 先跑 `bookTickets` 再 `buildInvoice`。展示「報價不能繞過預訂限制」。
- `#L1-L87` — `src/domain/refund.ts` — 退款核心：開演後退 0，否則依實際支付比例用 BigInt 精確四捨五入；`refundFee` 取 2%、最低 50、且不超過退款額；`netRefund` 保證非負。註解說明逐張取消的累積誤差上界，是金融計算的好教材。
- `#L1-L48` — `src/mcp/caller.ts` — MCP 呼叫者解析：沒有 Authorization 就是匿名（只有公開工具）；有 `Bearer tb_…` 就驗 API key、查 user、拒絕 banned；憑證存在但無效時直接拒絕而不是降級成匿名。重點是「撤銷的 agent 要立刻發現」。
- `#L1-L70` — `src/mcp/docs.ts` — MCP `search_docs`：把 `help/*.md` 依 `## ` 切成 section，做去停用詞、去複數的關鍵字比對，標題命中權重 3、內文 1。沒有 embedding，適合小型說明中心，也展示「讓 agent 從政策回答而不是憑記憶」。
- `#L1-L459` — `src/mcp/tools.ts` — MCP 工具定義：公開 `list_events`/`get_event`/`quote_price`/`search_docs`，私有 `book_tickets`/`my_orders`/`refund_order`/`cancel_event`；每個工具驗證輸入、呼叫 service、把結果整理成模型可讀的 EUR/日期/退款說明，並以 scope 與 role 限制。`cancel_event` 只回人類確認連結，展示「agent 準備、人決定」。
- `#L1-L120` — `src/payments/index.ts` — 假 Stripe provider：記憶體內 charge/refund、同 key 同金額回傳原 charge、不同金額回 idempotency conflict、退款不得超過扣款；只接受 `sk_test_`，並用 globalThis 保持單例。展示「用真介面、假實作」讓金流邏輯可測。
- `#L1-L403` — `src/services/orders.ts` — 訂單用例核心：`quoteOrder`、`placeOrder`（claim key、避開並行、退款作廢、row lock、重新檢查座位/折扣碼、deadlock retry）、`cancelOrder`/`cancelOwnOrder`、`cancelEvent`（先標記再付款、可重試未付款退款）。是整份 codebase 最值得學的 agentic 金流範例：每個外部呼叫前後都想過重試與冪等。
