---
source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay
source_type: codebase
source_lines: 6325
language: TypeScript
file_count: 32
part: 2
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- `tests/domain/refund.*` — 十個檔案把退款金額路徑拆成範例測試、性質測試、對抗測試與 mutation 擊殺測試，核心是「已售出的訂單必須永遠可退」與「開演瞬間視窗關閉」。它們示範如何從 docstring 反推不變量、用 BigInt 當獨立 oracle、以及針對浮點與邊界做窮追猛打。對驗證工程學習者而言，這是一套把金融計算寫到「每個 cent 都有理由」的完整範本。
- `tests/domain/booking*|pricing*|invoice.test.ts|fees.test.ts|cancellation.test.ts` — 預訂、定價、發票、手續費與取消預覽的行為測試。重點在拒絕訊息要精確、折扣堆疊上限、早鳥 30 天邊界，以及容量與溢位護欄的兩側都釘住。這組檔案展示「先擋壞輸入，再談公式」的測試分層。
- `tests/http/` — 用 `client.ts` 在行程內重現 Next.js 路由（proxy → route module → method handler），把真實 Request 打進真的 route handler，並以 Testcontainers Postgres、Better Auth API key 與假 Stripe 串起整合環境。`api-v1.test.ts` 是行為範例，`api-v1.property.test.ts` 則把健壯性、報價 oracle 與跨步驟狀態不變量寫成性質測試。
- `tests/lib/` — 純函式與安全邊界的測試：金額格式化的精確性、測試時鐘 cookie 的範圍防護、`safeNext` 的開放轉址攻防，以及 MCP `search_docs` 的路徑穿越、ReDoS 與排名不變量。適合學習「把攻擊面寫成可重跑的對抗案例」。
- `tests/payments/fake-stripe.test.ts` — 假支付供應商的契約測試：金鑰限制、整數 cent、idempotency 重播、退款不得超過原扣款。它說明為什麼測試替身本身也需要被測試。
- `scripts/` — 五個開發與 CI 輔助腳本：載入環境變數、套 migration、只對變更行跑 mutation 的 CI gate、Playwright 參考截圖，以及用真實 domain 模組產生決定性種子資料。對學習者而言，這些腳本展示「測試資料與驗證流程本身也要可重現、可稽核」。

# L2 detail

- `#L1-L11` — `scripts/local-env.ts` — 依序載入 `.env` 與 `.env.example`，讓 README 的快速開始不必手動複製檔案；已存在的環境變數優先。重點是設定來源的優先序與可重現的本機啟動。
- `#L1-L12` — `scripts/migrate.ts` — 對 `DATABASE_URL` 套用已提交的 Drizzle migrations，並在 finally 關閉連線。示範把資料庫遷移包成單一可重跑指令。
- `#L1-L74` — `scripts/mutate-changed.mjs` — CI mutation lane：解析 `git diff` 找出 `src/domain` 中本次變更的行，產生只 mutate 這些範圍的 Stryker 設定，門檻 100%，任何存活 mutant 都讓 PR 失敗。檔頭明訂 agent 不得自行判定等價 mutant，必須停下來問人；這是 mutation testing 與責任邊界的好教材。
- `#L1-L67` — `scripts/screenshots.ts` — 用 Playwright 對執行中的 app 擷取參考截圖，涵蓋活動列表、結帳、實際下單後的確認頁、我的訂單、admin 各頁與深色模式。重點是把 UI 狀態變成可重複產生的視覺證據。
- `#L1-L347` — `scripts/seed.ts` — 以固定種子的 mulberry32 產生 8 場活動、約 300 筆訂單、退款與折扣碼；價格一律走真實的 `buildInvoice` 與 `previewCancellation`，確保種子資料不可能出現 app 自己不會產生的訂單。demo 帳號透過 Better Auth 建立，重播時以 TRUNCATE RESTART IDENTITY 讓訂單編號從頭開始；示範「測試資料用生產邏輯生成」。
- `#L1-L127` — `tests/domain/booking.overflow-guard.test.ts` — 攻擊 booking 的溢位護欄：`gross` 在折扣前就檢查安全整數上限，因此會保守拒絕部分折扣後可表示的訂單。測試用 BigInt 揭露 `2**52+1` 乘法的浮點漂移，並釘住「寧可早擋，不可賣出不可退的單」這個權衡。
- `#L1-L94` — `tests/domain/booking.safe-total.test.ts` — 從付費側釘住 `Number.MAX_SAFE_INTEGER` 兩邊：超過就拒絕、剛好等於上限仍可賣且可全額退。核心不變量是「凡是賣出的訂單，退款路徑都必須接受」。
- `#L1-L141` — `tests/domain/booking.test.ts` — 邊界優先的預訂金額測試：每個輸入護欄單獨觸發、每個拒絕都比對顧客看到的完整訊息（不用 `toThrow(substring)` 以免空白訊息也過關），並涵蓋 NaN 折扣、100% 公關票、最後一張座位、半 cent 進位與超賣夾零。示範「一個壞值無法告訴你是哪條規則觸發」的拆解方式。
- `#L1-L54` — `tests/domain/cancellation.test.ts` — 驗證 `previewCancellation` 與 `netRefund` 一致、`fee + net = gross`、開演瞬間不再退款且座位釋放規則正確；用 fast-check 覆蓋時間偏移與票數。適合學習「用性質把兩個函式綁在一起」。
- `#L1-L29` — `tests/domain/fees.test.ts` — `serviceFee` 的 3%、最低 100 與上限 2000 三個區段邊界，以及 `vatPortion` 從含稅價反推 VAT。簡短但示範了費率懸崖（99→100、2000→2001）兩側都要測。
- `#L1-L97` — `tests/domain/invoice.test.ts` — `buildInvoice` 的單張、團體 5%/10%、早鳥 10%、折扣堆疊、服務費下限與上限、VAT 計算、早鳥剛好 30 天 vs 29 天，以及非正數量拒絕。重點是折扣組合與邊界包含性。
- `#L1-L34` — `tests/domain/pricing-reasons.mutation.test.ts` — mutation 測試車道：被拒絕的折扣碼必須告訴顧客原因（過期 vs 已用完），不能是空訊息。示範「使用者可見的錯誤字串」本身就是值得 mutant 擊殺的規格。
- `#L1-L142` — `tests/domain/pricing.test.ts` — 折扣碼正規化與狀態邊界（到期瞬間即失效、用量達上限即耗盡）、`priceTiers` 與發票一致性、`quote` 轉呼叫 `buildInvoice`、早鳥視窗在 30 天整點仍適用。適合學習「同一規則在兩層 API 之間保持一致」。
- `#L1-L134` — `tests/domain/refund.arithmetic.test.ts` — 用純 BigInt 的精確有理數參考實作，逐筆比對退款份額的四捨五入；同時驗證時鐘輸入（含 `null` 會被強制轉成 0 的陷阱）、MAX_SAFE_INTEGER 附近不漂移，並重現舊浮點算法多退一 cent 的案例。是「oracle 不能跟實作用同一種算術」的關鍵示範。
- `#L1-L435` — `tests/domain/refund.contract.property.test.ts` — 把 docstring 當規格逐條編碼：折扣百分比僅供參考、函式無狀態且可重複呼叫、bookTickets 賣出的訂單退款路徑必須接受、容量與團體折扣階梯。底部有 generator census，確保性質測試真的看到醜陋輸入。
- `#L1-L148` — `tests/domain/refund.post-event-cutoff.adversarial.test.ts` — 對抗車道第一輪，揭露退款函式收了 `nowMs` 卻從未與 `eventStartMs` 比較，既有測試都只在開演前呼叫。補上開演瞬間、+1ms、+1 天、部分取消、epoch、負時間與 `previousDouble` 的閉側測試。
- `#L1-L880` — `tests/domain/refund.property.test.ts` — 退款不變量主套件：退款非負且不超過實付、必為整數 cent、取消 0 張退 0、全取消退全額、對取消張數單調；手續費介於 0 與退款之間且不超過 2%+1 cent；`net + fee = gross`；拆分取消的漂移上界；完整 admitted range 與 bookTickets 往返。每個 property 上方都有英文 invariants 說明。
- `#L1-L280` — `tests/domain/refund.rounding.property.test.ts` — 專門驗證「逐張取消最多多退半 cent × 張數」的性質，前提是 `2 * (totalCents mod tickets) >= tickets`，而不是直覺的「票比錢多」。漂移用 BigInt 累積，避免 oracle 自己也被浮點騙；並驗證 docstring 點名的兩個範例與 generator census。
- `#L1-L96` — `tests/domain/refund.test.ts` — Arrange-Act-Assert 風格的退款範例測試：全退、半退、不退、開演後為 0、各種非法輸入丟 RangeError、`refundFee` 2%、`netRefund` 在最低手續費吞掉退款時夾為 0。是入門這條金額路徑的起點。
- `#L1-L809` — `tests/domain/refund.timegate-boundary.property.test.ts` — 第二輪性質套件，不假設邊界位置：用 `clockIndex` 把 double 對應到整數後二分搜尋「第一個退款變 0 的瞬間」，斷言它必須等於 `eventStartMs`。另涵蓋關閉視窗不得吞掉非法呼叫、手續費 50 cent 與 2% 交叉點逐 cent 驗證、`netRefund` 的每 cent 會計。
- `#L1-L387` — `tests/domain/refund.timegate.property.test.ts` — 補齊既有性質測試從未觸及的輸入域：開演後時鐘與超過一千張的票數。驗證關窗後退款為 0、晚到的時鐘不會多退、同一側只有一個答案、不能在活動後重複退款，並檢查 `refundFee` 對不可讀金額的行為。
- `#L1-L129` — `tests/domain/refund.validation.test.ts` — 第三輪對抗車道，專門擊殺 mutation 車道標記的三個可達 mutant：安全整數上限、折扣 0 與 100 兩端點、六個 RangeError 訊息必須互異且非空。示範「訊息就是診斷」以及如何從 mutant 反推缺失測試。
- `#L1-L226` — `tests/domain/refund.window-boundary.round2.adversarial.test.ts` — 攻擊「修好後的閘門」而非原本的洞：關閉視窗仍必須對壞呼叫丟錯（避免 gate 被移到驗證器之前）、開窗側用手算金額而非重算公式、手續費在 50 cent 與 2% 翻轉點逐 cent 驗證、跨邊界拆分取消不能多退。
- `#L1-L717` — `tests/http/api-v1.property.test.ts` — REST API 的性質測試：任何請求都必須 <500 且回 JSON 錯誤（不含 stack 或 SQL）、合法訂單必得 201 且早鳥邊界正確、報價對照依 help 文件寫成的簡單 oracle、三個使用者交錯 quote/order/cancel/時鐘推進的狀態機不變量，失敗會縮小並印出 seed。是整合層 property-based testing 的完整範例。
- `#L1-L345` — `tests/http/api-v1.test.ts` — API 行為範例：事件列表與單筆、報價含折扣碼、422 業務拒絕與 400 欄位錯誤、API key 認證（401/403）、Idempotency-Key 重播只扣一次、取消本人訂單與退款金額、他人訂單 404、重複取消 422、未知路徑 404/405/OPTIONS、非法 percent-encoding 400，以及測試時鐘開關。示範把路由、認證、服務與資料庫串起來的端到端測試。
- `#L1-L168` — `tests/http/client.ts` — 測試用 HTTP harness：先跑 `proxy.ts`，再依 Next.js 規則挑選 `app/api/v1` 下的 route module、解碼 params、呼叫對應 method handler，並重現 HEAD/OPTIONS/405 行為。請求可帶測試時鐘 cookie，回應統一解析成 `{status, body, isJson, text}`；也提供抑制 Better Auth 拒絕金鑰 log 的輔助。重點是「在行程內模擬框架路由」以換取速度與真實性。
- `#L1-L31` — `tests/lib/format.test.ts` — `money` 在 `Number.MAX_SAFE_INTEGER` 仍精確、負數格式、以及「顯示數字可反推回原始 cents」的 round-trip 性質；`orderNumber` 補零到五位。示範格式化函式也需要性質測試。
- `#L1-L41` — `tests/lib/regression-test-clock-range.test.ts` — 回歸測試：超出 `Date` 可表示範圍（±8.64e15 ms）的測試時鐘 cookie 以前會讓 handler 丟錯並回 500，現在必須視為沒有 cookie、改用牆上時鐘；範圍邊緣仍可接受，非數字也忽略。適合學習「把生產事故寫成回歸測試」。
- `#L1-L31` — `tests/lib/safe-next.adversarial.test.ts` — 對抗登入後 `next` 參數的開放轉址：`//evil.com`、反斜線、tab/newline、絕對 URL、`javascript:` 都必須留在同源；同時確認合法深連結（含陣列取第一個）不被破壞。示範 WHATWG URL 解析的瀏覽器怪癖如何成為攻擊面。
- `#L1-L27` — `tests/lib/safe-next.round2.adversarial.test.ts` — 第二輪攻擊：`new URL()` 會正規化 dot segments，讓 `/.//evil.com` 變成 `//evil.com`；因此 `safeNext` 的輸出本身不得以 `//` 開頭，且必須 idempotent。示範「修完一層要再攻擊修法本身」。
- `#L1-L52` — `tests/lib/search-docs.adversarial.test.ts` — 公開 MCP 工具 `search_docs` 的攻擊測試：查詢中的路徑穿越不得讀到 `help/` 以外的檔案、不得回傳疑似密鑰、原型鏈字詞與 unicode/控制字元不得拋錯、病理輸入必須線性（無 ReDoS）、limit 不得被濫用。重點是把公開工具當成敵對輸入面。
- `#L1-L107` — `tests/lib/search-docs.property.test.ts` — `search_docs` 排名性質：每個命中都含查詢詞、分數為正且遞減、結果數不超過 limit、2–200 字元任意 Unicode 不拋錯、用章節自身標題查詢會把它排第一、回傳的是原始章節且不重複。示範如何用性質描述搜尋品質而非固定答案。
- `#L1-L53` — `tests/payments/fake-stripe.test.ts` — 假 Stripe 的契約：缺金鑰、live key、非 test key 都拒絕啟動；只收正整數 cents；同 idempotency key 重播回原 charge、不同金額則衝突；多次退款總額不得超過原扣款；重播退款 key 視為同一筆。說明測試替身也必須有可驗證的契約。
