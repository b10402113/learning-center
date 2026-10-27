# subscribe 與 history：兩個方向的介面

事件寫進 event log（事件紀錄）後，事情還沒結束。

背景程式發生了什麼事，旁邊的客戶端需要即時知道；程式關掉又重新啟動、想接回原本的工作時，也要能把過去發生過的事件全部讀回來。

這兩件事由兩個函式分工：

- `subscribe` 往前看，把之後發生的事件即時推給你。
- `history` 往回看，依照 `seq` 把已經寫下的事件讀回來。

方向相反，但都是對同一份 event log 說話。

<!--image:1-->

## 訂閱者：listeners 就是客戶端

先來看即時通知。

event bus（事件匯流排）像一條大家都能把事件丟進來的通道，而有興趣的人就站在旁邊接收。每一個「有興趣的人」，就是一個 listener（監聽器）——事件一到，就會被呼叫的函式。

如果你做過 WebSocket server，應該知道管理一群客戶端是什麼感覺：誰連進來、誰還在線上、誰離開了，都要有人記住。

這裡的 `listeners` 就是做同樣的事：它是一個集合，裡面放著所有目前訂閱中的 listener。

## subscribe：加入訂閱，拿到一把清理的鑰匙

`subscribe` 接受一個 listener，先把它放進集合裡。

但真正重要的是它的回傳值：`subscribe` 會回傳另一個函式。呼叫這個函式，就能把剛才的 listener 從集合中移除。

<!-- derived -->
```ts
const listeners = new Set<Listener>();

export function subscribe(listener: Listener) {
  listeners.add(listener);
  // 回傳 cleanup：呼叫它就把這個 listener 刪掉
  return () => {
    listeners.delete(listener);
  };
}
```

這個模式你可能在 React 的 `useEffect` 看過。`useEffect` 裡可以回傳一個 cleanup function（清理函式），元件卸載時會呼叫它，順手把元件註冊過的東西拆掉。

這裡也是同一個概念：如果不把 listener 從集合裡刪掉，每次訂閱都會留下一個不會消失的參考。參考越積越多，就會形成 memory leak（記憶體洩漏）：用不到的東西一直佔著記憶體，回收不掉。

<!--image:2-->

所以 `subscribe` 沒有回傳 `void`（什麼都不回傳）就算了。它把「誰加入訂閱、誰負責清理」這件事直接寫進介面裡。

呼叫端拿到的不只是訂閱成功的結果，還有一把能把自己拆掉的鑰匙。

## history：重啟之後，把過去的事件讀回來

另一個方向是 `history`。

它是一個 async function（非同步函式），可以 `await` 需要等待的資料庫操作，最後回傳完整的 `AgentEvent` 陣列，也就是這份 log 裡的全部事件。

它的用途很直接：程式關掉又重新啟動，想要 pick back up（接回原本的工作）時，就需要 replay（重放）過去所有事件。

想「把所有事件重新跑一遍」的時候，就是在呼叫 `history`。

做法是把資料庫裡的資料列全部撈出來：從 `event_log` 選取所有資料，依照 `sequential`（`seq`）欄位排序，最後再把每一列的 `data` 映射出來。

<!-- derived -->
```ts
export async function history(): Promise<AgentEvent[]> {
  const rows = await db.select().from(eventLog).orderBy(eventLog.sequential);
  return rows.map((row) => row.data);
}
```

<!--image:3-->

排序這一步不能省略。

replay 的前提，是事件必須按照原本的先後順序回來。但資料庫不保證回傳資料時會維持原本的順序，因此要靠 `sequential` 欄位把順序固定下來。

至於每一列的其他欄位並不重要，映射時只保留 `data`。

## 兩個方向，同一份 log

`subscribe` 是往前看的：事件發生時，把它推給目前仍在訂閱的 listener。

`history` 則是往回看的：不論中間中斷過幾次，都能依照 `seq` 把完整的過去讀回來。

一個服務「現在正在聽的人」，另一個服務「重啟後回來接手工作的自己」。

同一份 event log，就有這兩種讀法。

把這兩種讀法接在一起的，是重啟之後的 replay。下一節直接把 server 殺掉來試。
