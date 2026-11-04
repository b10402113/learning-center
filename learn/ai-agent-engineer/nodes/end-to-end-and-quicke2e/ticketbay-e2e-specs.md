# 斷言使用者看得見的東西：金額、座位與退款行

一條 E2E spec 的價值，不在於證明「頁面載入了」，而在於把商業承諾轉成畫面上的斷言：顧客被收多少錢、還剩幾個座位、退款退了多少。顧客帶著折扣碼訂票，就應該**正好**被收取發票上承諾的金額。斷言要放在使用者看得見的地方，也就是頁面上的金額，不能只確認「page loaded」。`e2e/booking-discount.spec.ts`

TicketBay 的金錢流程有三種：使用折扣碼訂票、在退款視窗內退票，以及在退款視窗關閉後退票。每條 spec 都把一項規則轉成 Playwright 會反覆執行的檢查。

## 折扣碼：實際收費要和發票上的金額完全一致

這條 spec 直接進入結帳頁，網址帶著數量：`/events/{ev}/checkout?qty=2`。接著填入名字和折扣碼 `welcome10`，再按 Apply。

首先確認一件容易忽略的事：套用折扣碼後，顧客已填好的名字仍然保留。以前整頁 reload 會把名字清掉。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/booking-discount.spec.ts#L18-L23 -->
```ts
// What the customer already typed survives applying a code (it used to be wiped by a full reload).
await page.getByLabel("Name on tickets").fill("Alex Fan");
await page.getByLabel("Discount code").fill("welcome10");
await page.getByRole("button", { name: "Apply" }).click();
await expect(page.getByText("WELCOME10 applied")).toBeVisible();
await expect(page.getByLabel("Name on tickets")).toHaveValue("Alex Fan");
```

接著檢查三處金額：票價行 `Tickets €90.00`、總額行 `Total €92.70`，以及顯示實際扣款金額的按鈕 `Pay €92.70`。按鈕也必須可以點擊。

付款後，再檢查同樣的行，只是這次顯示 `Total paid €92.70`。最後回到 event 頁，確認座位數從 100 降到 58，代表兩張票確實已被訂走。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/booking-discount.spec.ts#L24-L34 -->
```ts
// 2 x €50.00 less 10%, plus the 3% service fee (€2.70).
await expect(ticketsLine(page)).toHaveText("Tickets €90.00");
await expect(totalLine(page)).toHaveText("Total €92.70");
await expect(page.getByRole("button", { name: "Pay €92.70" })).toBeEnabled();

await pay(page, customer);
await expect(ticketsLine(page)).toHaveText("Tickets €90.00");
await expect(totalLine(page)).toHaveText("Total paid €92.70");

await page.goto(`/events/${ev}`);
await expect(seatsLeft(page), "the two seats are taken").toHaveText("58 / 100");
```

兩張 €50.00 的票打九折後是 €90.00，再加上 3% 的服務費 €2.70，總額為 €92.70。測試不會自行重算這筆金額，而是直接比對發票上的三個字串，確認頁面顯示的金額是否相同。

<!--image:1-->

這條 spec 不會自行計算金額。它不 import 折扣模組、不呼叫費用函式，也不從資料庫讀取金額來比對，只讀取畫面上的三個字串。

如果服務費改成 4%，這條 spec 會在 `Total €92.75` 失敗，而不是因為某個內部函式回傳了不同的值而失敗。失敗的位置就是顧客會抱怨的地方。

## 繞路之後，回到同一個 checkout

結帳需要帳號，因此未登入的顧客會被導向登入頁。兩件事都必須成立：先被導向正確的 `next`，登入後再回到**同一個** checkout，而且數量不能在途中消失。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/booking-discount.spec.ts#L12-L17 -->
```ts
// Checkout needs an account. A signed-out customer is sent to sign in and
// must come back to the SAME checkout — the quantity survives the detour.
await page.goto(`/events/${ev}/checkout?qty=2`);
await expect(page).toHaveURL(`/sign-in?next=${encodeURIComponent(`/events/${ev}/checkout?qty=2`)}`);
await submitSignIn(page, customer);
await page.waitForURL(`/events/${ev}/checkout?qty=2`);
```

`toHaveURL` 檢查跳轉目標，`waitForURL` 檢查登入後的網址。如果實作弄丟了 `qty`，只把顧客送回沒有數量的 checkout，最後一項檢查就不會通過。

顧客不會看見「數量被丟掉了」，只會發現數量變成 1。因此，重導向也要納入斷言。

## 一個 spec 一個 event、一個帳號

要讓金額斷言穩定，每條 spec 都需要自己的資料。`e2e/support/env.ts` 透過兩個常數表管理資料：一個 event 表和一個帳號表。

每個 spec 使用一個 event，平行執行的 worker 就不會共用座位。每個 spec 使用一個帳號，「My orders」和 API key 清單就只會顯示該 spec 自己的資料列。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/env.ts#L17-L24 -->
```ts
/** One event per spec, so parallel workers never share seats. */
export const E2E_EVENTS = {
  discount: "e2e-discount",
  refundInWindow: "e2e-refund-in-window",
  refundAfterStart: "e2e-refund-after-start",
  adminCancel: "e2e-admin-cancel",
  bookAndPay: "e2e-book-and-pay",
} as const;
```

<!--image:2-->

平行執行還有一個不容易察覺的問題：登入。Better Auth 會依 client IP 限制登入次數；production 的限制是每 10 秒 3 次。

如果整個平行套件都從 `127.0.0.1` 登入，看起來就像同一個 client 一直送出表單。因此，每個需要登入的瀏覽器都先掛上自己的 `x-forwarded-for`，讓它們看起來像不同顧客各自上門：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/app.ts#L23-L32 -->
```ts
let clients = 0;
/**
 * Better Auth rate-limits sign-in per client IP (3 per 10 s in production). A
 * whole parallel suite on 127.0.0.1 would look like one client hammering the
 * form, so each signing-in browser gets its own address, like real customers.
 */
function clientIp(): string {
  clients += 1;
  return `10.${process.pid % 250}.${Math.floor(clients / 250) % 250}.${(clients % 250) + 1}`;
}
```

## 固定時鐘：讓「現在」成為確定的資料

要斷言退款金額，就得讓「現在」固定下來。測試採用固定時刻，而不是 `Date.now() + 10 days`。`env.ts`

specs 會設定 app 的時鐘。這個時鐘透過 cookie 控制，只有在 `TICKETBAY_TEST_CLOCK=1` 下才會被承認（見 `lib/clock.ts`），所以每次執行時，每一頁上的金額都相同。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/env.ts#L10-L15 -->
```ts
const DAY = 86_400_000;

/** Every seeded event starts at this instant. */
export const EVENT_START_MS = Date.UTC(2031, 5, 1, 18, 0, 0);
/** When customers book: ten days out — inside the refund window, outside early-bird. */
export const BOOKING_AT_MS = EVENT_START_MS - 10 * DAY;
```

調整時鐘只需要設定一個 cookie，而且只影響該 browser context。一個 context 的時間可以調到 2031 年，其他 context 仍使用真實時鐘。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/app.ts#L10-L13 -->
```ts
/** Serve this browser context as of `ms`. Other contexts keep the real clock. */
export async function setClock(context: BrowserContext, ms: number) {
  await context.addCookies([{ name: "tb-test-now", value: String(ms), url: `http://localhost:${E2E_PORT}` }]);
}
```

<!--image:3-->

訂票時間選在 `EVENT_START_MS - 10 * DAY`，是因為十天前仍在退款視窗內，卻已經超出早鳥優惠期間。這樣一來，每筆金額都不會受到其他時間相關規則影響。

## 退款視窗：把時鐘撥到邊界的兩側

退款規則是：取消只在 event 開始**之前**允許，從 `eventStartMs` 起退款金額為零（`src/domain/refund.ts`）。座位也只有在退款視窗開啟時才會回到架上。

因此，退款測試要確認邊界兩側的行為，而不只是確認「按了取消會退款」。做法是在同一個固定時刻訂票，再把 app 的時鐘撥到邊界的一側，最後檢查頁面上的**金額**和 event 頁上的**座位**。

視窗內的 spec 把時鐘撥到退款視窗仍開啟的最後一刻：`EVENT_START_MS - 1`。這個時間點本身就是一項檢查：如果系統早一毫秒關閉視窗，這裡就會顯示 €0.00。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/refund-window.spec.ts#L15-L30 -->
```ts
await setClock(context, BOOKING_AT_MS);
await signIn(page, customer);
await bookThroughUI(page, customer, ev, "2");
await expect(ticketsLine(page)).toHaveText("Tickets €100.00");
await expect(totalLine(page)).toHaveText("Total paid €103.00");

// The last instant the window is open: a gate that closes a millisecond early would show €0.00.
await setClock(context, EVENT_START_MS - 1);
await cancelOnPage(page);
// Refund is on the €100.00 paid for tickets, less the 2% fee (€2.00). The €3.00 service fee is kept.
await expect(refundLine(page)).toHaveText("Refunded €98.00");
await expect(cancelButton(page), "no second payout for the same order").toBeHidden();

await setClock(context, BOOKING_AT_MS);
await page.goto(`/events/${ev}`);
await expect(seatsLeft(page), "the refunded seats are for sale again").toHaveText("60 / 100");
```

三個斷言各自確認不同的事。`Refunded €98.00` 確認退款金額是票價 €100.00 扣掉 2% 手續費 €2.00；€3.00 的服務費不退。

取消按鈕消失，代表同一張訂單不能再次退款。`60 / 100` 確認退掉的兩個座位重新上架。

視窗外的 spec 使用另一個 event，並把時鐘撥到 `eventStartMs` 本身。這個時間點已經超出退款視窗，也就是「退款在這一刻關閉」。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/refund-window.spec.ts#L40-L51 -->
```ts
// `eventStartMs` itself is outside the window: "refunds close at this moment".
await setClock(context, EVENT_START_MS);
await page.reload();
await expect(page.getByText("The refund window has closed.")).toBeVisible();
await cancelOnPage(page);
await expect(refundLine(page), "the window closes AT eventStartMs — €0.00 back, not a payout").toHaveText("Refunded €0.00");
await expect(page.getByText("the seats stay yours")).toBeVisible();
await expect(cancelButton(page)).toBeHidden();

await setClock(context, BOOKING_AT_MS);
await page.goto(`/events/${ev}`);
await expect(seatsLeft(page), "a late cancellation must not free the seats").toHaveText("58 / 100");
```

同樣按下取消，這次退款行顯示 `Refunded €0.00`，頁面也會出現「the seats stay yours」，座位數則維持在 `58 / 100`。

兩條 spec 合在一起，呈現同一條規則的兩種結果：退款 €98.00、座位回到架上；或退款 €0.00、座位仍由顧客保留。

<!--image:4-->

`page.reload()` 時鐘是透過 cookie 調整的，因此調整後必須重新載入頁面，伺服器端算出的「視窗已關閉」才會顯示出來。spec 會先 reload，再檢查那行文字，不會假設頁面會自行更新。

## helper 也要清楚呈現失敗原因

`e2e/support/app.ts` 這些是 test harness helpers，**不是**應用程式碼。specs 透過瀏覽器操作真正的 app，包括實際頁面、server actions、domain modules 和 Postgres。

helpers 只負責包裝重複動作，並讓失敗原因容易理解。

`pay` 不會只按下付款按鈕、等著訂單頁出現，而是同時等待兩種結果：導向 `/orders/{id}?placed=1`，或 checkout 出現錯誤警報。

被拒絕的訂單會留在 checkout，預期的網址永遠不會出現。因此，helper 會在收到拒絕訊息時直接拋出錯誤，不必等到逾時才讓測試失敗。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/app.ts#L69-L77 -->
```ts
// A refused booking stays on checkout with an alert. Report what it said
// instead of timing out on a URL that will never come.
const outcome = await Promise.race([
  page.waitForURL(/\/orders\/\d+\?placed=1/).then(() => "ok"),
  checkoutError(page).waitFor().then(async () => `refused: ${await checkoutError(page).textContent()}`),
]);
if (outcome !== "ok") throw new Error(`booking was ${outcome}`);
await expect(page.getByText("Payment confirmed")).toBeVisible();
return Number(/\/orders\/(\d+)/.exec(page.url())![1]);
```

錯誤提示使用 `page.getByTestId("checkout-error")`，而**不是** `getByRole("alert")`。Next.js 會建立一個空的 route announcer，role 也是 alert；用 role 尋找時會找到那個空殼。

同樣地，`signIn` 會先走完真正的 `/sign-in` 頁，再等待 `networkidle`。首頁會預先載入每一個 event；如果立刻離開，prefetch 就會在途中被中斷，伺服器端也會記下一行 "The destination stream closed early."

最基本的 `book-and-pay.spec.ts` 會走完整個流程，只檢查兩個字串：確認頁上的「Payment confirmed」和 `Total paid €103.00`，接著到 `/orders` 確認看得到該場活動的名稱。

這條 spec 很短，因為它只驗證「按下按鈕後確實發生了事，而且金額明確可見」。其他檢查則交給各自負責商業承諾的 spec。

不過手寫 spec 只會涵蓋關鍵流程。沒有寫成 spec 的流程，仍然需要有人走一遍，那要換一套探索方式，也就是下一段的 QuickE2E。
