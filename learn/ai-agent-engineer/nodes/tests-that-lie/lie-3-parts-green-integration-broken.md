# 單元與整合測試全綠、mutation score 很高，頁面還是一片空白

前兩段補的分別是「測試有沒有檢查行為」和「該測的輸入有沒有寫成案例」。兩者都補滿，還是有第三種假綠。

這句話值得再讀一次。每一個單元測試都通過，每一個整合測試也都通過，mutation score 還很高，但打開頁面，看到的卻是一片空白。

原因很簡單：前面兩段看的都是單一零件，這裡看的是零件之間的接縫，而沒有任何測試在真正的瀏覽器裡開啟 app。

<!--image:1-->

## Playwright 只測關鍵流程

Playwright 會在真正的瀏覽器裡操作 app，模擬使用者的行為。它適合用來測試關鍵流程，例如 TicketBay 的訂票、付款和退款。

代價是執行時間較長。每個測試都要啟動真正的瀏覽器，通常需要幾秒，因此測試數量應該保持精簡，並在 CI 中每個 pull request 執行一次。

斷言應該檢查使用者看得到的行為，例如確認頁面和 My orders 裡的訂單，不要檢查資料庫或內部狀態。TicketBay 的結帳測試流程就是：開啟一個活動、選兩張票、付款，再確認確認頁面和 My orders，大約需要十一秒。

<!--image:2-->

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L518-L520 -->
```bash
npx playwright install chromium
npm run test:ui -- e2e/<your-spec>.spec.ts --headed
```

## Testcontainers：每次執行都使用真正的資料庫

Testcontainers 是一個開源 library，可以在 Docker 裡啟動用完即丟的資料庫、message broker 和瀏覽器。Java、Go、.NET、Node、Python、Rust 都能使用，五十幾種工具都有現成的 module，包括 Postgres、MySQL、Kafka 和 Redis。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L527-L527 -->
```ts
const container = await new PostgreSqlContainer("postgres:17").start();
```

這個過程會先拉取 image，再啟動 container，並將它連到一個空閒的隨機 port，避免平行執行時互相衝突。接著，系統會等到資料庫就緒，再把連線 URL 提供給測試。測試完成後，container 就會刪除。即使測試失敗，也有一個小型的清理 container 負責收尾。

因此，每次執行測試，都會有一個專屬的空資料庫。

<!--image:3-->

## 真正的資料庫會拒絕 agent 的錯誤假設

真正的資料庫行為和 production 一樣，因此比 mock 更能提供信心。

差別就在最後一哩：mock 會配合 agent 對資料庫的錯誤假設，照著演一遍；真正的資料庫不會配合，而是直接拒絕。

Playwright 會真正走過使用者的流程，Testcontainers 則確保資料庫不是假的。兩端都補上，「測試全綠但頁面空白」的情況才會逐漸消失。

走完三段，三種假綠各有對應的測試：測試沒檢查行為，用 mutation testing；重要案例沒寫，用 property testing；零件都通過、合起來卻壞掉，用 end-to-end 測試。
