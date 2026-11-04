# 大多數測試都是 example test

上一段的 mutant 全被殺死，代表你寫的每個案例都真的在檢查行為。但這樣只補到「已寫的案例」。還有一種漏，是該測的輸入從來沒被寫成案例。先看最常見的測試長相。

「從布達佩斯到維也納的最短路徑是 243 公里。」這是一個測試，有一個確切的輸入和一個確切的輸出。

這就是 example test 的樣子，也是大多數測試的樣子。問題不在於測試寫錯，而是測試數量有限，永遠無法涵蓋所有輸入組合。

一張有一千座城市的地圖，兩兩配對大約有五十萬組。要用 example test 涵蓋這麼多組合，根本做不到。

## 一萬個測試，就有一萬個測試要維護

Agent 寫測試很快，反而會讓問題變大。寫一萬個測試，就得維護一萬個測試。測試跑起來很慢，agent 每次讀取它們，也會占掉 context window 的一大部分。

所以做法要反過來：寫幾條 property test，讓工具自動生成測試例子。

## 你寫規則，工具生例子

一條 property 就是程式永遠必須遵守的規則。流程分成四步：

1. 定義一條 property。
2. 工具生成大量輸入組合。
3. 對每一種組合執行測試邏輯。
4. 檢查每種組合是否都符合 property。

如果第 4 步失敗，工具還會把失敗的輸入縮小到最精簡的形式，讓 bug 更容易重現。

<!--image:1-->

## 五十萬組配對，濃縮成三條規則

回到最短路徑。地圖上有一千座城市，就有大約五十萬組配對。不必寫五十萬個測試，只要宣告永遠成立的規則：

- 對稱：A 到 B 的最短路徑，和 B 到 A 一樣長。
- 非負：路徑長度永遠不會是負數。
- 一致：同兩座城市，每次都會得到同一個答案。

Property test 能抓出 example test 漏掉的 corner case、edge case，以及沒想到的輸入組合。每一條 property 都是把業務規則寫成程式碼，也記錄了程式永遠必須遵守的行為。

<!--image:2-->

## 一條 property 涵蓋整個 API

TicketBay 用一條 property 涵蓋每一個 endpoint：不管收到什麼請求，回應永遠不是 500，而且永遠是 JSON。

每次執行 generator，都會產生一個隨機請求。可能是合法請求，例如替兩張票報價；也可能是錯誤請求，例如使用被撤銷的 key，或傳入非 JSON 的 body；還可能是奇怪的請求，例如 event id 帶有控制字元。

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

這條 property 在第 52 個請求後失敗，並把問題縮小到一個帶有 null byte 的 event id。資料庫拒收 null byte，API 因此回傳 500。

<!--image:3-->

分工方式是：你宣告 property，agent 負責寫 generator 和執行測試。各 stack 都有對應的 library：JavaScript 與 TypeScript 可用 fast-check，Python 可用 Hypothesis，Java 可用 jqwik，C# 可用 FsCheck，Rust 可用 proptest。

## 它是加法，不是替代

Property test 是疊加在 unit test 之上的一層，不會取代 unit test。

當你的領域有明確規則時，property test 才特別划算，例如金額、進位、解析和狀態。在膠水程式碼上，它的價值低得多。這會影響有限的 property 應該寫在哪裡。

行為和輸入都補上了，還有第三種假綠：每個零件都通過，合起來卻壞掉。
