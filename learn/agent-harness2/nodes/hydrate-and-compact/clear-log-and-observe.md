# 清空 event log，看 `MemoryCompacted` 真的出現

上一步觸發了 `MemoryCompacted`，也把它留在 log 裡。但你還沒打開 log，所以目前沒有證據能確認它真的發生了。

有件事會妨礙你確認：資料表裡還留著之前執行的事件。新的一次 compaction 混在舊資料裡，你看不出哪一筆是剛新增的。

所以先清空 log，再執行一次任務，從空白的資料表開始查看。

## 一個函式就能清空資料表

清空資料表只需要一個 SQL 指令，函式就放在其他資料庫輔助函式旁邊。

`TRUNCATE` 會清空資料表，但保留資料表本身。這正是這裡需要的效果：結構留下，資料列清空。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/db.ts#L35-L39 -->
```ts
// Wipe the durable log (the "Clear" button in the inspector). Wired up in the
// memory lesson.
export async function clearEventLog(): Promise<void> {
  await client`TRUNCATE event_log`;
}
```

不要對正式環境的資料執行這個指令。事件 log 一旦被清空就無法復原，過去執行時用來說明狀況的工作流程紀錄也會一起消失。

## Inspector 使用另一個連接埠

Inspector 是獨立的前端，和伺服器位於不同的來源（origin）。伺服器必須先允許它，瀏覽器才會讓它呼叫 API。

這道檢查叫做 CORS。瀏覽器會先送出一個 `OPTIONS` 請求，也就是預檢請求（preflight），再從回應中確認允許使用哪些方法和標頭。

<!--image:1-->

<!-- source: sources/agent-harness2/20261029/harness-engineering/server/index.ts#L27-L40 -->
```ts
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // inspector runs on a different port
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
  app.get("/health", (_req, res) => res.json({ ok: true }));

  // Clear the durable log. The inspector calls this, then reloads.
  app.post("/api/clear", async (_req, res) => {
    await clearEventLog();
    res.json({ ok: true });
  });
```

對本機 Inspector 來說，允許任何來源的萬用字元設定就足夠了。中介層會自行回覆預檢請求，狀態碼為 204，其他請求則會繼續通過。

路由很單純，就是 `POST /api/clear`。它會呼叫 `clearEventLog`，接著回傳 `{ ok: true }`。UI 裡的 Clear 按鈕已經會呼叫這個路由，因此不必再修改前端。

## 執行任務，再查看結果

啟動伺服器後，按一次 Clear。如果寫入失敗，問題會在執行任務前就顯示出來，這時找出錯誤比較省事。

接著貼上範例任務，讓 agent 開始執行。請求結束時可能一次 compaction 都沒發生。對於工具呼叫不多的短任務，這很正常。

如果什麼都沒觸發，別再猜了，調低門檻就好。這個示範的重點是觀察機制，不是硬湊出某個數量。

## 查看事件

compaction 觸發後，log 會出現一筆 `memory.compacted` 事件。示範執行中，`summarizedTurns` 顯示 3，`contextTokens` 則是 619。

<!-- derived -->
```text
memory.compacted   summarizedTurns=3   contextTokens=619
```

這四個欄位分別回答四個問題。workflow id 會指出事件屬於哪次執行；`summarizedTurns` 表示有幾個對話輪次離開了 context；`contextTokens` 表示摘要加入後，請求的大小是多少；`summary` 則存放模型接下來會繼續使用的文字。

<!--image:2-->

當歷史紀錄接近上限時，每多一輪對話，就會再次超過上限。因此 log 裡會反覆出現事件，而不只一筆。

這就是上一個步驟的檢查，只是現在可以直接從資料裡看到結果。它會在每次迴圈一開始執行，所以任務繼續進行時，log 裡就會不斷新增 compaction 紀錄。

## 數字看起來奇怪，程式碼說明了原因

compaction 事件顯示的 token 數，可能高於觸發門檻。示範中的數字是 619，而上限是 500。

檢查時只計算 `turns`，事件裡的數字則是整個組合後的 context：system prompt、任務、摘要，以及保留下來的對話輪次。

差異來自摘要和固定保留的內容。這些部分不會被移除，因此會疊加在 context window 裡的其他內容上。

<!--image:3-->

這個估算也不精確：程式把字元數除以四，當成 token 數。所以逐字稿說這種計算法不太準，卻仍然繼續使用。

## 這裡的設定刻意調得很激進

示範用的門檻設得很低。逐字稿裡作者說，實際上絕不會這樣設定，他說得沒錯。

正式部署時會保留較大的 context window，並等更晚才進行 compaction。機制本身不變，調整的只有那兩個數字。

另外還值得加上一道限制：如果摘要本身變得太長，可以在 summarize 呼叫中用 `maxOutputTokens` 設定上限。只叫模型簡短回答，並不等於真的設下了上限。

## 這個節點確認了什麼

有三件事各自分開處理：History 是持久保存的 log，不會縮小；State 是從 History 整理出的摘要；Context 則是每一輪組合而成，用完就丟。

Compaction 發生在後兩者之間。它會在模型開始新一輪之前觸發，移除完整的對話輪次，透過 DBOS step 將摘要存成檢查點，並送出 `MemoryCompacted` 事件。

log 就是證據。先清空，再執行任務，然後計算事件筆數。接著調低門檻，看筆數怎麼增加。
