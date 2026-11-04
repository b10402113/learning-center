# Playwright 只測關鍵流程，Testcontainers 給你一個真資料庫

每個單元測試和整合測試都可能通過，頁面卻還是一片空白，因為沒有任何測試在真實瀏覽器裡打開過這個 app。每個零件各自正常，不代表組裝起來後，使用者看得到的功能也會正常。

要補上這一塊，需要兩樣東西：一個能像使用者一樣點擊的真實瀏覽器，以及一個真實資料庫。Playwright 負責前者，Testcontainers 負責後者。

## Playwright 只測關鍵流程

Playwright 測試會在真實瀏覽器裡，像使用者一樣操作 app。每條測試都要啟動真實瀏覽器，並花上好幾秒，因此數量要少，只測關鍵流程，例如 TicketBay 的訂票、付款和退款。這些測試會在 CI 上針對每個 pull request 執行。

斷言應檢查使用者看得到的行為，例如確認頁，以及 My orders 裡的訂單。不要檢查資料庫或內部狀態，因為使用者看不到這些內容，而重構一定會動到它們。

<!--image:1-->

TicketBay 的 checkout 測試會打開一個 event、選兩張票、完成付款，再檢查確認頁和 My orders，整個流程大約需要十一秒。

要執行一條 spec：

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L518-L520 -->
```bash
npx playwright install chromium
npm run test:ui -- e2e/<your-spec>.spec.ts --headed
```

## Testcontainers：真資料庫，不是 mock

E2E 測試需要資料庫，這裡使用的是真資料庫。Testcontainers 是開源函式庫，能在 Docker 裡啟動用完就丟的資料庫、message broker 和瀏覽器。它支援 Java、Go、.NET、Node、Python、Rust 等語言，也為 Postgres、MySQL、Kafka、Redis 等五十多種工具提供模組。啟動一個 Postgres 只要一行：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/server.ts#L12 -->
```ts
const container = await new PostgreSqlContainer("postgres:17").start();
```

這一行會依序完成五件事：拉取映像、啟動容器、將容器連接到空閒的隨機 port，避免平行執行的測試互相撞號、等待資料庫可以連線，再把連線 URL 交給測試。執行結束後，容器會被刪除。即使 process 被強制終止、來不及收尾，小型的 cleanup 容器也會負責刪除容器。每次執行都會使用獨立的空資料庫。

<!--image:2-->

真資料庫的行為和 production 一樣，因此比 mock 更能讓人放心。mock 會配合 agent 對資料庫的錯誤假設繼續運作，真正的資料庫則會直接拒絕。

## webServer：一個檔案把兩件事接起來

TicketBay 在同一個地方連接瀏覽器和資料庫：`e2e/support/server.ts` 就是 Playwright 的 webServer。它會啟動用完就丟的 Postgres，執行 migration、灌入 e2e 資料集，接著用 production build 啟動 app，並將 `DATABASE_URL` 指向該容器。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/server.ts#L12-L31 -->
```ts
const container = await new PostgreSqlContainer("postgres:17").start();
const url = container.getConnectionUri();

const db = openDb(url);
await migrateDb(db);
await seedE2E(db);
await closeDb(db);

const app = spawn("npx", ["next", "start", "-p", String(E2E_PORT)], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: url,
    TICKETBAY_TEST_CLOCK: "1",
    STRIPE_SECRET_KEY: "sk_test_e2e",
    BETTER_AUTH_SECRET: E2E_AUTH_SECRET,
    BETTER_AUTH_URL: E2E_BASE_URL,
  },
});
```

啟動 app 時還會設定幾個環境變數。其中 `TICKETBAY_TEST_CLOCK=1` 讓測試可以控制 app 的時鐘，付款則使用測試用的 `sk_test_e2e`。Better Auth 的兩個設定也寫在這裡，原因很明確：`next start` 不會讀取 `.env.example`，所以 secret 和 base URL 只能從這裡提供。

收尾也由同一處理。`stop()` 先用一個 `stopping` 旗標避免重複呼叫，再對 app 送出 SIGTERM、停止容器並結束 process。收到 `SIGTERM`、`SIGINT`，或 app 自行退出時，都會進入這段收尾流程。

<!--image:3-->

## 種子資料集：小、固定，只包含 spec 會讀取的資料

資料庫一開始是空的，因此每個 spec 需要的資料都必須先種進去。`e2e/support/seed.ts` 定義了整個 e2e 套件的資料集，原則只有一個：小、固定，而且只包含 spec 真的會讀取的資料。

每個 event 都使用同一個舊 demo 場地：共有 100 個座位，已售出 40 個，還剩 60 個，票價是 €50.00。需要在畫面上顯示 event 名稱的 spec，會使用好讀的名稱（`Book and Pay Night`）；其他 event 則都叫 `RockFest <id>`。資料集也會種入折扣碼，並把建立時間設為訂票日的三十天前。

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/seed.ts#L14-L37 -->
```ts
export async function seedE2E(db: Db): Promise<void> {
  await db.insert(events).values(
    Object.values(E2E_EVENTS).map((id) => ({
      id,
      name: EVENT_NAMES[id] ?? `RockFest ${id.slice(4)}`,
      category: "concert" as const,
      venue: "Test Arena",
      city: "Budapest",
      description: "Seeded for the Playwright suite.",
      startsAtMs: EVENT_START_MS,
      totalSeats: 100,
      seatsSold: 40,
      priceCents: 5000,
      createdAtMs: BOOKING_AT_MS - 30 * 86_400_000,
    })),
  );
  await db.insert(discountCodes).values({ ...E2E_CODE, createdAtMs: BOOKING_AT_MS - 30 * 86_400_000 });

  const auth = createAuth(db, { baseURL: E2E_BASE_URL, secret: E2E_AUTH_SECRET });
  for (const u of Object.values(E2E_USERS) as E2EUser[]) {
    await auth.api.signUpEmail({ body: { name: u.name, email: u.email, password: E2E_PASSWORD } });
    if (u.admin) await db.update(user).set({ role: "admin" }).where(eq(user.email, u.email));
  }
}
```

帳號不會直接 insert 進資料庫，而是透過 Better Auth 自己的 `signUpEmail` 建立。密碼由它負責 hash，和 `scripts/seed.ts` 使用相同的流程；admin 角色則在帳號建立後再補上。這樣建立的帳號和真實註冊的帳號沒有差別，用它測試登入才有意義。

<!--image:4-->

## 這兩件事合起來證明什麼

真實瀏覽器能證明「頁面不是空白的，按鈕按下去會有反應」；真實資料庫能證明「對資料的假設是正確的」。兩者都具備，E2E 測試才擋得住「每個零件都通過，組裝起來卻壞掉」的問題。

固定資料集還能讓每條 spec 都從相同的起點開始。座位剩 60 個、票價 €50.00、折扣碼存在，這些數字寫進斷言後，每次執行都在檢查同一件事。測試失敗，代表行為真的變了，而不是資料漂移。

工具備齊了，剩下的問題是：一條 spec 到底該斷言什麼。那是下一段的主題。
