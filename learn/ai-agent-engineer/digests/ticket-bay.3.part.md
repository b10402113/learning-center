---
source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay
source_type: codebase
source_lines: 5473
language: TypeScript
file_count: 34
part: 3
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `e2e/` — 五個 Playwright spec 從真實瀏覽器走完購票、折扣、退款視窗、API key 生命週期與主辦方取消活動。每個 spec 都盯著畫面上的金額、退款行與剩餘座位，而不是只確認「頁面有載入」。對學端對端驗證的人來說，這是最直接的一課：把商業承諾寫成使用者看得見的斷言。
- `e2e/support/` — 測試 harness：`env.ts` 固定時間與帳號、`seed.ts` 建最小資料集、`server.ts` 用 Testcontainers 起拋棄式 Postgres 與正式 build、`app.ts` 封裝登入與付款。它示範如何讓平行 worker 互不汙染，並用 cookie 驅動可控時鐘。
- `tests/integration/` — Vitest 整合測試，全部打真 Postgres（Testcontainers 或外部實例），只有付款供應商是 fake。檔案層級的資料庫隔離、TRUNCATE 而非包交易，是為了讓真正的競態測試能同時提交。
- `tests/integration/{database,global-setup,fixtures,accounts,template}.ts` — 整合測試的共同基礎：每個檔案克隆一個 template 資料庫、固定時鐘的 shop fixture、Better Auth 帳號與 tb_ API key 工廠、JSON-RPC 呼叫輔助。讀者能學到「真資料庫、真 auth、真 key，但可控時間與付款」的測試切面。
- `tests/integration/*.property.test.ts` — 以 fast-check 對 `cancelEvent`、MCP 工具的金額整形與 scope 規則做性質測試。重點不是列舉案例，而是把不變量（退款不超過已付、座位恰好釋放一次、工具只在具備精確 scope 時執行）寫成可反覆驗證的述句。
- `tests/integration/*adversarial.test.ts` — 對抗式測試，按三輪 catch-D mini-loop 堆疊：checkout claims、owner token、void ledger、advisory lock、死鎖重試。每一輪都針對上一輪修補後仍可能漏掉的競態或孤兒扣款，示範「修完再攻擊」的驗證節奏。
- `tests/integration/mcp-*.ts` — 遠端 MCP 端點與工具的行為驗證：API key 解析、scope 強制、匿名與跨使用者存取、admin 專屬的 cancel_event 深連結。這是理解「agent 用什麼身分、能做什麼」的實作範本。
- `tests/integration/orders-*.ts` — 訂單repository、service 與金流競態：欄位精度、資料庫約束、退款恰好一次、同 key 重送、最後座位被搶走時的退款。適合學「把不變量放進資料庫，再把競態放進測試」。

# L2 detail

- `#L1-L93` — `e2e/admin-cancel-event.spec.ts` — 主辦方從 MCP 工具給的深連結取消活動；兩個客戶先各自購票，管理員登入後看到影響摘要、輸入活動 id 確認，最後每位客戶在訂單頁看到全額票價退款且座位不再釋出。學習重點：破壞性操作要有預覽、人工確認、冪等與跨帳號結果驗證。
- `#L1-L76` — `e2e/api-keys.spec.ts` — Settings → Developers 的 API key 生命週期：建立時 secret 只顯示一次、預設 scope 是唯讀、旋轉保留原 scope、撤銷後重新載入仍消失。示範把「一次性秘密」與「權限不應悄悄放大」寫成 UI 斷言。
- `#L1-L21` — `e2e/book-and-pay.spec.ts` — 最短的端對端快樂路徑：登入、選兩張票、結帳、看到付款確認與 €103.00，再到 My orders 找到活動名稱。適合當第一個 E2E 範例，因為它只驗證一條主幹。
- `#L1-L35` — `e2e/booking-discount.spec.ts` — 未登入者被導去登入後要回到同一個 checkout，輸入折扣碼後表單內容保留，畫面顯示 €90.00 與 €92.70，付款後座位從 60 變 58。學習重點：導頁不丟狀態、金額在每個階段一致、座位副作用可見。
- `#L1-L52` — `e2e/refund-window.spec.ts` — 用可控時鐘分別測試退款視窗的最後一毫秒與活動開始瞬間：前者退 €98.00 並釋放座位，後者退 €0.00 且座位不回來。示範邊界條件要用固定時間測，而不是靠 `Date.now()` 的巧合。
- `#L1-L93` — `e2e/support/app.ts` — Playwright 輔助：設定測試時鐘 cookie、逐一把瀏覽器登入、付款並處理被拒絕的結帳、從活動頁完成購票、在頁面上取消。還用 `x-forwarded-for` 讓平行 suite 不會被 Better Auth 的登入速率限制誤傷。
- `#L1-L50` — `e2e/support/env.ts` — E2E 的共用常數：固定活動與購票時間、每個 spec 專屬的活動與帳號、折扣碼與密碼。把時間與身分集中宣告，讓平行測試不共享座位或訂單列。
- `#L1-L37` — `e2e/support/seed.ts` — 建立 E2E 資料集：每個活動 100 席、已售 40、€50.00，帳號透過 Better Auth 註冊後再升級 admin。重點是用正式 auth 產生密碼雜湊，而不是手寫 user 資料列。
- `#L1-L43` — `e2e/support/server.ts` — Playwright 的 webServer：啟動 Postgres 容器、套 migration、seed，再以正式 build 啟動 Next，並在收到 SIGTERM 時一起收掉容器。示範測試伺服器與資料庫的生命週期綁定。
- `#L1-L462` — `tests/integration/accounts-services.test.ts` — 服務層的帳號歸屬與取消活動：`cancelOwnOrder` 的 IDOR 防護、跨使用者 idempotency 重送、`cancelEvent` 全額退款與可續傳的失敗重試，最後驗證沒有路由在前時工具自己的匿名守衛。學習重點：授權與退款要同時在 service 與 tool 層成立。
- `#L1-L140` — `tests/integration/accounts.ts` — 帳號與 MCP 測試輔助：用真 Better Auth 註冊、建立 tb_ key、指定 scope、撤銷、過期，並提供 JSON-RPC 請求與 SSE/JSON 回應解析。也整理 `toolResult` 讓測試能同時斷言 transport 與工具層錯誤。
- `#L1-L68` — `tests/integration/admin-queries.test.ts` — 用手工歷史驗證 admin 讀模型：營收、票數、退款、同期比較、銷售率 basis points、訂單篩選排序與 TB- 編號搜尋。示範讀模型測試要固定資料與時鐘，才能對數字做精確斷言。
- `#L1-L260` — `tests/integration/cancel-event.property.test.ts` — `cancelEvent` 的性質測試：任意價格、數量、折扣與自助退款組合下，已付款訂單全額退票價、座位恰好釋放、結果與管理員看到的 impact 對帳、開始後拒絕且不改任何狀態、付款失敗可重試到恰好一次。是把商業規則寫成 invariants 的範例。
- `#L1-L197` — `tests/integration/checkout-claims.adversarial.test.ts` — 第一輪 checkout claim 攻擊：過期 claim 被接管時舊嘗試的 finally 不可刪掉新 claim；接管後不可在已 void 的扣款上產生已付款訂單；並測試 claim 洩漏、20 個同 key 同時送出、等待逾時與 50 個重試風暴不拖垮連線池。
- `#L1-L139` — `tests/integration/checkout-claims.round2.adversarial.test.ts` — 第二輪：owner token 與 void-under-claim。驗證接管後每筆扣款最後不是被訂單承接就是全額退回，沒有孤兒扣款；以及 void 在交易內呼叫外部退款時，十個失敗預訂不會耗盡連線池。
- `#L1-L61` — `tests/integration/database.ts` — 每個測試檔建立自己的資料庫並從 template 克隆，預設在每个 test 前 TRUNCATE。特別說明為何不用包交易：競態測試需要兩個連線各自提交並互相等鎖。
- `#L1-L128` — `tests/integration/deadlock-race.round3.adversarial.test.ts` — 第三輪死鎖：`cancelEvent` 以 event→orders 順序取鎖，顧客退款以 order→event 取鎖，Postgres 會犧牲一方；`withDeadlockRetry` 必須把它變成乾淨重跑或可讀錯誤。反覆 120 次與 25 次多客戶競態，斷言沒有原始 driver error、沒有重複付款。
- `#L1-L99` — `tests/integration/fixtures.ts` — 整合測試 fixture：固定 `NOW`、100 席 40 已售的 venue、折扣碼、可控制時鐘的 shop、讓多筆扣款同時完成的 payment provider、以及取出 Postgres 約束錯誤的 helper。這些工具讓競態可重現而不靠 sleep 猜測。
- `#L1-L91` — `tests/integration/global-setup.ts` — Vitest 全域設定：優先用 Testcontainers 起 Postgres 17，沒有 Docker 時改用 `DATABASE_URL` 的外部伺服器，建立並遷移 template 資料庫，提供 admin 與 template 連線字串給各測試檔克隆。
- `#L1-L244` — `tests/integration/mcp-caller.adversarial.test.ts` — 「呼叫者是誰」的攻擊面：畸形 Authorization、撤銷/旋轉/停用/過期 key、被封鎖或刪除的使用者、角色即時變更，以及一個使用者不能讀取、撤銷或旋轉他人的 key。也驗證 scope 只能由伺服器端設定，瀏覽器不能自行提權。
- `#L1-L138` — `tests/integration/mcp-key-actions.adversarial.test.ts` — 直接呼叫真的 Settings server actions：`createKeyAction` 拒絕假 scope 與未登入/偽造 cookie；`rotateKeyAction` 保留 scope、不能動他人的 key、拒絕怪異 key id；`revokeKeyAction` 同樣做 ownership 檢查。
- `#L1-L297` — `tests/integration/mcp-key-scopes.test.ts` — 以 route 的 POST 驅動真 Request：唯讀 key 可瀏覽與列出自己的訂單但不能訂票、退款、取消；讀寫 key 可以；沒有 tickets 權限的 key 連 `my_orders` 都被拒。另驗證 `search_docs` 的引用來源與 `cancel_event` 深連結的 URL 安全。
- `#L1-L350` — `tests/integration/mcp-route.test.ts` — MCP 端點端對端：API key 對應到唯一擁有者、壞憑證一律 401 且不會降級成匿名、匿名只能用公開工具、訂單歸屬與跨使用者退款、同 key 重送、admin 的 `cancel_event` 只產生確認連結不改狀態。示範 route 層如何把 auth、工具與資料庫串起來。
- `#L1-L146` — `tests/integration/mcp-scopes.property.test.ts` — scope 的性質測試：對任意 scope 集合與私有工具，只有精確具備所需 scope 才執行；被拒絕的呼叫不會寫入訂單、活動或付款。另對 `search_docs` 驗證任意 2–200 字查詢都不報錯且尊重 limit。
- `#L1-L276` — `tests/integration/mcp-tools.adversarial.test.ts` — 以真的 Streamable HTTP 驅動 MCP handler：匿名、大小寫/空白變體、唯讀 key 重放他人 idempotency key、唯讀 admin 拿不到取消連結、精確 scope 規則、JSON-RPC batch 混呼叫、跨使用者訂單與取消活動的角色限制。
- `#L1-L464` — `tests/integration/mcp-tools.property.test.ts` — 工具金額與篩選的性質測試：`list_events` 只回傳可售且落在布達佩斯日曆範圍內的活動、列表價格等於 `quote_price` 的 Tickets 行、報價行項目可加總、報價等於實際扣款、`my_orders` 的退款分解與 `refund_order` 一致、任何合法但非本人的訂單 id 都回可讀的 not found。
- `#L1-L194` — `tests/integration/orders-lock.round3.adversarial.test.ts` — 第三輪鎖：慢速付款供應商不能癱瘓連線池；單一 key 的重試風暴不餓死其他顧客；失敗的 checkout 不留下 advisory lock；不同 key 不互相等待；顧客退款續傳不會重複付款或重複釋放座位。
- `#L1-L276` — `tests/integration/orders-mcp-money.adversarial.test.ts` — 模組 6 的金流對抗測試：重試失敗的 `book_tickets` 不可在已 void 扣款上留下免費訂單、同 key 併發只產生一筆且不退款、他人不能重放 key、`cancelOwnOrder` 的 IDOR、`cancelEvent` 對已開始活動的拒絕、部分退款失敗可重試、取消與結帳競態不留下已付款訂單。
- `#L1-L221` — `tests/integration/orders-money.round2.adversarial.test.ts` — 第二輪金流：同 key 重試與失敗中重疊時不可產生「已付款但扣款已 void」的訂單；兩個使用者搶同一 key 時輸家什麼都拿不到；`cancelEvent` 的可續傳付款在雙擊、併發、單筆持續失敗下都恰好付一次；顧客退款失敗可重試。
- `#L1-L229` — `tests/integration/orders-repo.test.ts` — 訂單表的真 Postgres 保真度：金額欄位以 number 回傳、最大安全整數無損、分數分錢在進 SQL 前被擋、BIGINT 直寫也會拒收、退款不可超過票價、座位不可超賣或負釋放、同 idempotency key 唯一、退款交易 rollback 後仍可重試，最後用兩個連線實測列鎖只讓一個贏。
- `#L1-L247` — `tests/integration/orders-service.test.ts` — 服務層的購票與取消：座位恰好釋放一次、活動開始後退款為零但保留座位、退款視窗邊界、被手續費吃掉的退款仍釋放座位、發票金額、早鳥與折扣碼、重送不重複扣款、最後座位在刷卡過程被搶走時退款、限量碼不被兩個 checkout 共用。
- `#L1-L70` — `tests/integration/seed.test.ts` — 以子程序真的跑 `npm run db:seed`，再驗證 8 個活動、250–400 筆訂單、退款與折扣碼、TB-00001 連續編號、每筆金額等於 invoice/refund 模組計算、每個活動座位數等於訂單持有數。示範 seed 也是需要被測的產品行為。
- `#L1-L2` — `tests/integration/template.ts` — 只宣告 template 資料庫名稱，讓全域設定與各測試檔共用同一個克隆來源；檔案極小但把「一個 template、每檔一庫」的約定集中在一處。
- `#L1-L174` — `tests/integration/void-ledger.round3.adversarial.test.ts` — 第三輪 void ledger：失敗預訂的退款記在 per-key advisory lock 下、外部退款在交易外呼叫、失敗可由同 key 下一次嘗試補完；測試連續失敗、20 個同 key 併發只 void 一次、以及 checkout 與 cancelEvent 的鎖順序不產生原始死鎖錯誤。檔尾以 `it.skip` 標記兩個已知風險，示範把接受的风险留在測試裡。
