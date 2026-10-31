# event_log：用 seq 定序的事件日誌

上一篇文章還有一件事尚未說明：DBOS 有地方可以寫入資料，但我們還沒有定義事件日誌本身——資料表的結構、每一列儲存的內容，以及程式首次啟動時如何建立資料表。

這篇文章就來談這件事。

## 一張資料表，兩個欄位

我們要建模的不是 agent，而是一份日誌。

`event_log` 只有兩個欄位，沒有其他欄位。Moss 稱它為事件尾端日誌：workflow 執行時會觸發許多事件，而這張表會依序記錄這些事件。

第一個欄位是 `seq`。它使用 `bigserial` 型別，數值會由 Postgres 自動遞增。

`seq` 用來表示全域順序，也是主鍵。有了這個順序，我們就能依照事件發生的先後重播，也能在同一個事件重複出現時，將多餘的項目去除。

![第 1 段配圖](./event-log-table-assets/image-1.webp)

第二個欄位是 `data`。它使用 `jsonb` 型別，可在 Postgres 欄位中儲存一般的 JSON 資料。由於 Postgres 支援 JSON，這種用法和文件型資料庫的概念相近。

`jsonb` 欄位只負責儲存事件內容。我們把它命名為 `data`，因為它的用途就是存放這些資料。

接著，`data` 會被設為不可為 null。重播事件時，途中出現一筆沒有內容的事件，可不是我們想要的結果。

## 上層的型別是給你用的，不是給 Postgres 用的

`data` 還有一個設定：TypeScript 泛型，表示這個欄位儲存的是 `AgentEvent`。

最好把這個設定的作用說清楚：它對資料庫沒有任何幫助。資料庫看到的只是一個一般的 JSON 物件，並不知道其他資訊。

![第 2 段配圖](./event-log-table-assets/image-2.webp)

這個泛型只在編輯器中派得上用場。使用 `row.data` 時，自動完成會知道它是 `AgentEvent`。Moss 特別說明，即使完全移除這個型別，整套系統仍然可以正常運作。

因此，這個 schema 包含一個排序欄位和一個內容欄位；內容的資料結構定義在 TypeScript 裡，而不是資料庫裡。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/db.ts#L1-L39 -->
```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pgTable, bigserial, jsonb } from "drizzle-orm/pg-core";
import type { AgentEvent } from "@shared/events";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set — copy .dev.vars.example to .dev.vars.");
}

// postgres.js connection (Neon requires SSL, carried in the URL). We keep the
// pool small — this is the durable event log, not a high-traffic app DB.
const client = postgres(connectionString, { max: 5 });
export const db = drizzle(client);

// The DURABLE event log. In Lesson 1 the event stream lived in a memory array
// that vanished on restart. Now every event is a row here, so the inspector can
// replay the whole timeline — including work that happened before a crash.
export const eventLog = pgTable("event_log", {
  seq: bigserial("seq", { mode: "number" }).primaryKey(), // global order
  data: jsonb("data").$type<AgentEvent>().notNull(),
});

// Create the table on boot. Keeps the workshop migration-free; in a real app
// you'd use Drizzle migrations instead.
export async function ensureSchema(): Promise<void> {
  await client`
    CREATE TABLE IF NOT EXISTS event_log (
      seq  bigserial PRIMARY KEY,
      data jsonb NOT NULL
    )
  `;
}

// Wipe the durable log (the "Clear" button in the inspector). Wired up in the
// memory lesson.
export async function clearEventLog(): Promise<void> {
  await client`TRUNCATE event_log`;
}
```

## 從頭到尾讀一遍這個檔案

匯入的項目分成兩組。`drizzle` 和 `postgres` 用來建立連線；`pgTable`、`bigserial` 和 `jsonb` 則來自 `drizzle-orm/pg-core`，是宣告資料表所需的元件。

接著是連線字串。Node 會透過 `process.env.DATABASE_URL` 讀取環境變數。

如果沒有設定 URL，程式就會立刻失敗。檔案會在其他程式碼執行前拋出錯誤，因為持久化儲存缺少連線位址，比起在啟動時直接報錯，後續才發現問題更糟。

建立 client 時，會把 `max` 設為 `5`。這是刻意設定的小型連線池，因為這裡用的是日誌，而不是繁忙的應用程式資料庫。

`db` 是包在這個 client 外層的 Drizzle 實例。如果你用過 ORM，可以把它想成資料庫的 SDK：你可以用 TypeScript 下達「查詢這張表」的指令，不必手動組裝 SQL。

`eventLog` 是資料表宣告。它目前不會建立任何東西，只是描述資料表的結構，讓其他程式碼在插入和查詢資料時，能取得型別資訊。

## ensureSchema 是執行階段的 migration

最後一個函式是 `ensureSchema`。它會在執行階段檢查資料表，並為這兩個欄位執行 `CREATE TABLE IF NOT EXISTS`。

這段 SQL 使用 template tag 撰寫：`await client\`...\``。Drizzle 允許你直接在這個 tag 裡放入 SQL，因此 schema 同時以 SQL 和上方的資料表宣告形式，存在於 TypeScript 中。

`IF NOT EXISTS` 會負責建立資料表：如果資料表不存在，就建立；如果已經存在，就不做任何事。

![第 3 段配圖](./event-log-table-assets/image-3.webp)

`ensureSchema` 是執行階段的 migration。Moss 表示，嚴格來說，這並非必要。這門課程是在錄影時遇到錯誤後才加入這段程式碼，目的是讓學生不會碰上相同的問題。實際的應用程式則應使用 Drizzle migrations。

## 這裡沒有任何 agent 專屬的設計

Moss 特別帶著大家逐段看這個檔案，儘管它和 agent 本身毫無關係。所有使用資料庫的應用程式都會做這些事：建立連線、宣告資料表，並確認 schema 已經存在。

這張資料表沒有任何 agent 專用的設計，而這正是它實用的地方。持久化層採用的是一般的工程做法；了解這些做法，就能自行除錯。

資料表已經準備好，但目前仍是空的。事件目前還留在記憶體中的 bus 裡：它是伺服器中的一個陣列，用來存放事件，重新啟動後就會消失。下一篇文章會用它取而代之：`emit` 先寫入資料列，接著 `subscribe` 喚醒監聽器，而 `history` 則根據 `seq` 重播事件。
