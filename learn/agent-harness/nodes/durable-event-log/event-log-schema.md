# Event log 的 schema：seq 與 jsonb

上一節的結論是：你需要一份可重播的事件紀錄，而它就存在一張資料表裡。先從一個情境想起：想像你在跑一個要跑很久的 workflow。過程中它不斷產生 event：呼叫了哪些工具、拿到什麼結果、下一步要做什麼。

當程式掛掉重啟，或需要把整段流程 replay 一次時，立刻會遇到兩個問題：

- 這些 event 的先後順序是什麼？
- 已經發生過的 event 又進來一次，該怎麼辦？

答案不在 prompt 裡，而在資料庫的一張表。這一節就來看看這張表長什麼樣子。

## 先開一張表

做法很普通：在 Postgres 裡建立一張名為 event log 的 table。

<!-- derived -->
```ts
export const eventLog = pgTable("event_log", {
  seq: integer().primaryKey(),
  data: jsonb().$type<AgentEvent>().notNull(),
});
```

欄位只有兩個重點，一個是 `seq`，一個是 `data`。

<!--image:1-->

先講結論：這是一張再平常不過的資料庫表格。它和 agent 沒有什麼特殊關係，跟任何一個需要儲存資料的 app 都差不多。

## seq：順序就是一切

`seq` 是 sequential 的縮寫，代表事件的流水號。workflow 執行時會持續發出 event，而 `seq` 負責記住它們發生的順序。

這個順序主要用來做兩件事。

第一件是 replay：重新執行時，按照原本的順序重放 event，產生的結果才會和原先一致。

第二件是去重（de-dupe）。這就像你寫過的寄信 side project：如果重試一次就多寄一封信，event log 就能靠 `seq` 抓出重複事件。

同一個 event 進來兩次，比對 `seq` 就認得出來，可以把重複的丟掉。

<!--image:2-->

`seq` 同時也是這張表的 primary key。白話來說，primary key 就是資料表裡的「身分證欄位」：資料庫會替它建立唯一索引，同一個 key 不會存進兩筆資料。

多數資料表會另外放一個 `id` 來做這件事，但這裡直接使用 `seq`。

## data：payload 用 jsonb 存

`seq` 旁邊的欄位叫做 `data`，用來存放這個 event 的 payload，也就是事件本身的內容。

欄位型別是 `jsonb`，這是 Postgres 用來儲存 JSON 文件的型別。對資料庫來說，裡面就是一個普通的 JSON 物件；它不知道，也不在乎物件裡裝的是什麼。

這裡有個很容易誤會的地方。你在程式碼裡可能會看到 Drizzle 在這個欄位上標記 `$type<AgentEvent>`。Drizzle 是個用 TypeScript 描述資料表的套件。

這是一個 generic，講白話就是先告訴編輯器：「這個欄位的型別是什麼。」之後你使用 `eventLog.data` 時，編輯器就會把它當成 `AgentEvent`，提供欄位提示與型別檢查。

重點是：這層型別跟資料庫一點關係都沒有。把它拿掉，程式照樣可以執行；資料庫裡存的也仍然是那個 JSON 物件。它純粹是為了改善開發體驗，不代表資料庫因此理解了更多內容。

<!--image:3-->

順帶一提，`data` 不能是 `null`。理由很實際：不允許空的 event，因為一個事件總要帶著一些內容。

## 確認表格真的存在：ensureSchema

最後再補上一道保險。

使用 Drizzle 的 SQL template tag 寫一小段 SQL，並在程式啟動時執行一次。如果表格不存在，就把它建立起來：

<!-- derived -->
```ts
await client.sql`create table if not exists event_log (...)`;
```

`create table if not exists` 就是字面上的意思：表格不存在時才建立。

這有點像一個小型的 runtime migration。作者自己也說，這段不是必要功能，是製作這門課時遇到錯誤，才補上來避免大家再撞一次牆。

它和前面的 schema 定義做的是同一件事，只是改用 SQL 再寫一遍。

## 這張表沒有任何 agent 專屬的東西

回頭看整張表：

- `seq` 管理順序、負責去重，也兼任 primary key。
- `data` 使用 `jsonb`，收下每個事件的 payload。
- `null` 會被擋掉，不允許出現沒有內容的 event。

作者講得很直接：這是任何需要使用資料庫的 app 都可能採用的做法，一點也不 agent 專屬。

這個 schema 這樣設計只為了一件事：讓 event 能按照順序重放，也能辨認並排除重複事件。

表開好了。事件要按什麼順序進到這張表、再送到前端，就是下一節的主題。
