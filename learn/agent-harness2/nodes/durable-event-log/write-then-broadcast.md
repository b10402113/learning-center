# 先落地，再廣播

上一篇文章留下了一張已經準備好、卻仍空著的資料表。事件匯流排仍以陣列的形式存在伺服器裡，因此每個事件都會隨著處理程序結束而消失。

現在，匯流排要搬家了。它的工作也從一件變成兩件：先寫下事件，再把事件送出去。

## 匯流排搬進 harness

第一步是搬檔案。匯流排原本放在 server 目錄裡，現在我們把它移到 harness 資料夾，並修改 server 的 index 檔案中的匯入路徑。

匯流排現在屬於 harness 的工作，因此應該放在 harness 裡。一旦匯流排開始負責寫入資料庫，它就是基礎設施的一部分，而不再只是 WebSocket 的細節。

## 三個函式，不用 class

舊版匯流排是個 class，而這個 class 存在的唯一理由，就是把狀態保存在記憶體裡。

狀態改存到 Postgres 後，class 就沒有需要保存的東西了。Moss 把它刪掉，最後只留下 `listeners` 集合，以及三個函式：`subscribe`、`emit` 和 `history`。

![第 1 段配圖](./write-then-broadcast-assets/image-1.webp)

`listeners` 裡存放的是已連線的用戶端。如果你曾經架過 WebSocket 伺服器，應該已經熟悉這部分：一組回呼函式，連線時加入，斷線時移除。

`subscribe` 會回傳一個清理函式。你呼叫 `listeners.add(listener)`，再回傳一個會呼叫 `listeners.delete(listener)` 的函式。

這個回傳值很重要。沒有它，每次連線都會留下未清理的 listener，下一次廣播就得遍歷一整組已失效的 socket。Moss 把它比喻成你從 `useEffect` 回傳的清理函式。

## emit：先寫入，再通知

`emit` 正是整個節點發揮作用的關鍵。

它現在是 `async`，因為它確實會執行可能失敗的操作。它接收一個 `EventInput`，並回傳一個解析結果為空值的 promise。

首先，它會建立事件：展開輸入內容，用 `randomUUID` 加上 `id`，再用 `Date.now()` 加上時間戳記。

接著，它會插入資料。`db.insert(eventLog).values({ data: event })` 會等待操作完成，然後將資料列連同 `seq` 一起寫入 Postgres。

只有在這個 await 完成後，它才會遍歷 listeners，逐一呼叫。

`emit` 會先寫入資料列，再通知其他人。Moss 一再說明這件事，因為這正是重點：事件一旦存進資料庫，就可以放心地傳給所有已連線的用戶端。

![第 2 段配圖](./write-then-broadcast-assets/image-2.webp)

這個順序讓系統保持可靠。如果處理程序在插入資料後停止，事件已經妥善保存，用戶端可以重新播放它。如果處理程序在插入前停止，就不會有任何用戶端收到不實的通知。

比較兩種情況，就能看出差異。舊版在廣播途中當機時，有些用戶端可能已經收到事件，但事件之後就消失了。現在，資料庫才是紀錄的來源，廣播只是通知。

## history：從資料表重播

`history` 是這個承諾的另一半。它會以 `AgentEvent[]` 的形式回傳目前為止的所有事件。

函式會查詢 `eventLog`，依 `eventLog.seq` 排序，再呼叫 `rows.map(row => row.data)`。其他欄位我們都不需要。

`seq` 這個欄位之所以存在，就是為了排序。資料列會依照寫入順序回傳，而不是依照 Postgres 找到它們的順序。

![第 3 段配圖](./write-then-broadcast-assets/image-3.webp)

重新連線的用戶端會呼叫這個函式，取得完整的事件時間軸，包括用戶端離線期間發生的工作。

`seq` 也讓辨識重複事件變得很簡單：同一個鍵值不可能同時出現在兩個資料列中。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/bus.ts#L1-L29 -->
```ts
import { randomUUID } from "node:crypto";
import { db, eventLog } from "./db";
import type { AgentEvent, EventInput } from "@shared/events";

// The harness event bus. Two jobs now:
//   1. DURABLY persist every event to Postgres (so the timeline survives a crash)
//   2. broadcast it live to any connected inspector
//
// `emit` is async now — we write to the database before we hand the event out.

type Listener = (event: AgentEvent) => void;
const listeners = new Set<Listener>();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function emit(input: EventInput): Promise<void> {
  const event: AgentEvent = { ...input, id: randomUUID(), ts: Date.now() };
  await db.insert(eventLog).values({ data: event }); // durable, ordered by `seq`
  for (const listener of listeners) listener(event); // live
}

// The full timeline so far, in order — read back from Postgres on every connect.
export async function history(): Promise<AgentEvent[]> {
  const rows = await db.select().from(eventLog).orderBy(eventLog.seq);
  return rows.map((row) => row.data);
}
```

## 底層的契約

如果事件沒有固定的形狀，這一切就無法運作。`shared/events.ts` 就是用來定義這個形狀的地方。

它是 harness 和 inspector 之間的契約。harness 執行的所有事情都會成為這條事件串流上的事件；UI 不會直接和模型或工具溝通，只會呈現這條串流。

事件記錄就是整個系統。這句話也說明了為什麼記錄需要一張資料表、需要排序，也需要一條重播路徑。

![第 4 段配圖](./write-then-broadcast-assets/image-4.webp)

這份契約是一個聯集型別 `EventInput`，每種事件各有一個成員：`workflow.started` 帶有 `workflowId` 和 `input`；`tool.requested` 帶有 `toolCallId`、名稱和 args。每個成員也都帶有 `workflowId`，也就是上一篇文章用來略過已完成工作的 ID。

`EventType` 為每個字串提供一個名稱。你可以寫 `EventType.WorkflowStarted`，不用直接寫字串 `"workflow.started"`。編譯器會抓出拼字錯誤，自動完成也會列出 harness 能發出的所有事件。

接著，`AgentEvent` 會再加上匯流排呼叫 `emit` 時提供的兩個欄位。

<!-- source: sources/agent-harness2/20261029/harness-engineering/shared/events.ts#L59-L63 -->
```ts
// The harness stamps every event with an id + timestamp when it emits.
export type AgentEvent = EventInput & { id: string; ts: number };

// What harness code calls to push an event onto the stream.
export type Emit = (event: EventInput) => void;
```

這就是為什麼上一篇文章中的 `jsonb` 欄位會以 `AgentEvent` 作為型別。這個型別會告訴編輯器 `row.data` 的資料形狀。Postgres 裡儲存的仍然是一般 JSON。

有件小事值得一提。刪除 class 時，TypeScript 對舊版事件匯流排和未定義的事件型別提出了錯誤。編譯器指出的，正是最後一處仍與記憶體版本相連的程式碼。

## 這個節點修好了什麼

原本的問題很單純：如果伺服器在一個回合進行到一半時停止，agent 就不知道剛才發生了什麼。

現在有四件事成立。工作流程會拆成多個步驟執行，並記錄每個步驟的輸入和輸出，因此重試時可以略過已完成的步驟。這些步驟之所以具備冪等性，是因為我們在設計時就讓它們如此，而不是因為 DBOS 讓它們變得冪等。每個事件都會成為 `event_log` 中的一筆資料列，帶有 `seq`，並且在任何用戶端收到通知前先寫入。`history` 則能從資料表重建完整的時間軸。

檢查點、重播和冪等性都集中在同一處，而匯流排也會先寫入，再進行廣播。

最直接的測試，就是這個節點一開始提出的測試：在 agent 執行到一半時終止伺服器，重新啟動後查看 `event_log`。當機前的事件都還在，而且順序正確。

修復的內容就是這些。工作階段不再取決於是否有人正在觀看，因為它的紀錄也不再依賴一個可能隨時結束的處理程序。
