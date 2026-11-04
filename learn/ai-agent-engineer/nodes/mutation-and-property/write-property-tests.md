# 你寫幾條 property，讓工具生成例子

上一段補的是既有測試的斷言。還有一種漏補不到：該測的案例根本沒寫。這一整段講的，是另一種測試。

大多數測試都是 example test：每條測試都給程式一個確切的輸入，再檢查確切的輸出，例如布達佩斯到維也納的最短路徑是 243 公里。

這種測試沒有問題，但輸入組合永遠測不完。你寫下的幾個例子之間，還有大片從未測過的範圍。

agent 能很快寫出測試，但一萬條測試就代表一萬條要維護的測試。測試跑起來很慢，agent 每次讀取時也會占滿自己的 context window。

做法可以反過來：只寫少數幾條 property test，再讓工具生成測試案例。

## 四步

property test 可以拆成四個步驟：

1. 定義一個 property，也就是程式碼永遠必須遵守的規則。
2. 讓工具生成大量輸入組合。
3. 讓工具針對每組輸入執行測試邏輯。
4. 檢查每組輸入是否都符合 property。若有不符合的情況，工具會把失敗的輸入 shrink 到最小，讓 bug 更容易重現。

第四步是 property test 和 example test 最大的差別。失敗的輸入不一定是你想得到的例子，而可能是生成器隨機碰上的某組輸入。

經過 shrink 後，留下的是最小的失敗案例。這樣看到的就是 bug 本身，而不是包住它的其他條件。

<!--image:1-->

## 性質的例子：最短路徑

一張有一千座城市的地圖，大約有五十萬組城市配對。為每一組配對各寫一條測試並不實際，因此可以改寫成幾條永遠成立的規則：

- 對稱性：A 到 B 的最短路徑，和 B 到 A 一樣長。
- 非負性：路徑長度永遠不是負數。
- 一致性：同樣兩座城市，永遠得到同一個答案。

這三條規則就是三條 property。

property test 能抓出 example test 漏掉的邊角、極端值和輸入組合。每條 property 也都是寫成程式碼的商業規則，同時說明這段程式碼永遠必須做到什麼。

## 領域層的那條：退款金額

領域層的 property 有沒有價值，取決於它的依據。如果 property 只是把實作中的公式照抄一遍——在這裡重寫一次 `Math.round(total * cancelled / tickets)`——那它只能證明程式碼和自己相同，無法證明其他事情。

退款的 property 應以 `src/domain/refund.ts` 的 docstring 為依據，而不是照抄公式。每條不變式先用一句英文寫在檔案裡，再用測試程式碼表達：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/tests/domain/refund.property.test.ts#L121-L133 -->
```ts
// INVARIANT: a refund is money leaving the platform, so it is never negative
// and never more than the customer actually paid.
it("a refund is never negative and never exceeds what was paid", () => {
  fc.assert(
    fc.property(realisticScenario, ({ order, cancelled, beforeStart }) => {
      const r = calculateRefund(order, cancelled, beforeStart);
      expect(Number.isFinite(r)).toBe(true);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(order.totalCents);
    }),
    RUNS,
  );
});
```

其他以同樣方式寫下的性質還包括：退款金額永遠是整數分，不會出現付三分之一分的情況；取消零張票就退零元；取消全部票券就剛好退回實付金額，折扣後的實付金額一分都不能被捨入吃掉；取消張數增加時，退款不會變少；免費訂單退零元，不會變成一筆支出。

這些性質的價值，一半來自測試，一半來自生成器。

## 生成器才是視力

property test 的價值，取決於生成器實際產生什麼。因此，退款測試的生成器刻意涵蓋容易出問題的範圍：0 分、1 分、50 分手續費下限的懸崖、2% 跨過 50 的臨界點（2475）、無法整除的張數、100% 折扣，以及 `calculateRefund` 在驗證時明確允許的上界 `Number.MAX_SAFE_INTEGER`。

還要做專門的 generator census：抽樣執行生成器，並確認它真的抽到那些容易出問題的案例，包括不能以 double 精確表示的乘積、會超額的訂單、無法整除的張數，以及 `cancelled` 為 0、1、全部或嚴格部分的情況。

這樣做是因為實際發生過一個問題：漂移那組 property 連續兩輪都通過，因為生成器的上限停在 1e12，根本碰不到它自己的 oracle 會出錯的範圍，也沒有任何檢查能發現這件事。

後來，那組測試改為涵蓋驗證器允許的完整範圍，並使用 BigInt 當 oracle。若測試只因生成器範圍太窄、碰不到自己的 bug 才通過，反而比沒有測試更糟，因為它看起來像是證據。

<!--image:2-->

## API 層的那條：永遠不要 500

API 層只需要一條 property，就能檢查每個 TicketBay endpoint：不論收到什麼請求，回應都不能是 500，而且永遠必須是 JSON。

生成器每一輪都會建立一個隨機請求，涵蓋三種情況：合法請求，例如詢問兩張票的報價；錯誤請求，例如使用被撤銷的 key，或送出非 JSON 的 body；以及奇怪的請求，例如 event id 帶有控制字元。

<!-- source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L471-L489 -->
```ts
function expectRobust(r: Reply) {
  expect(r.status, `${r.status} ${r.text}`).toBeLessThan(500);
  expect(r.isJson, `${r.status}, not JSON: ${JSON.stringify(r.text)}`).toBe(true);
  expect(r.headers.get("content-type")).toMatch(/^application\/json/);
  if (r.status >= 400) {
    expect(r.body, r.text).toEqual({ error: expect.any(String) });
    expect(r.body.error).not.toMatch(/\n\s+at |Failed query|postgres|drizzle/i);
  }
}

it("any request under /api/v1 gets a status below 500 and a JSON body", async () => {
  const w = await world();
  await fc.assert(
    fc.asyncProperty(apiRequest, async (r) => {
      expectRobust(await call(await toCall(w, r)));
    }),
    runs(800),
  );
});
```

這條 property 在第 52 個請求後失敗，並把失敗案例 shrink 成只帶有一個 null byte 的 event id。資料庫拒收這個 null byte，API 因此回傳 500。這是真正的 bug，不是測試寫錯。

<!--image:3-->

## 分工與工具

分工方式是：你定義那些性質，agent 負責寫生成器並執行測試。

可用的工具包括：JavaScript 與 TypeScript 的 fast-check、Python 的 Hypothesis、Java 的 jqwik、C# 的 FsCheck，以及 Rust 的 proptest。

## 它是加上去的一層

property test 是加在單元測試之上的一層，不是用來取代單元測試。

當領域裡有明確規則時，property test 特別有用，例如金額、四捨五入、解析和狀態。若只是黏合各部分的程式碼，property test 的價值就低得多。

回頭看，兩種工具的責任不同：mutation testing 檢查你手上的測試有沒有真的驗到行為，property testing 檢查你的案例有沒有漏掉整片輸入。前者補斷言，後者補案例。
