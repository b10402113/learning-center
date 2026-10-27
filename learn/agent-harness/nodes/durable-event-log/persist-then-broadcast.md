# 先落地再廣播：emit 的順序

寫到現在，你的 `emit` 大概長這樣：事件丟給 bus，bus 逐一呼叫每個 listener，事情就結束了。

這種做法完全活在記憶體裡，程式一關，事件也跟著消失。但 agent 必須能在重啟後接續運作，因此事件得寫進資料庫。這個改變也會直接決定 `emit` 內部的執行順序。

這一節只談一件事：

> `emit` 要先把事件 insert 進 event log，確認已經落地，再 fan-out——也就是把同一個事件推給所有訂閱者。

如果順序顛倒，系統會出現很具體的不一致。

## bus 變 durable，emit 就變 async

先把背景對齊。

原本的 bus 是 in-memory bus，放在 server 裡。class 內保存一串 listener，`emit` 只要逐一呼叫它們就好。

現在把 bus 搬進 harness，改用資料庫保存事件。這樣一來，程式重啟後才能查看 event log，把過去的事件 replay，也就是按照紀錄重新跑一遍。

既然狀態不必再放在記憶體裡，原本那個 class 就可以拿掉。真正需要留下的只有三個函式：

- `subscribe`：指定誰要接收事件
- `emit`：發出一個事件
- `history`：讀回過去的事件

`emit` 也因此變成 async。原因很單純：它現在真的要做事，得把事件寫進資料庫，不再只是把事件丟給記憶體裡的一串 listener。

它接收一個 event input，回傳一個 promise。這個 promise resolve 後不會帶回任何資料，但它確實是 promise，因為函式裡有要等它跑完的動作。

<!--image:1-->

## emit 內部：先 insert，再 fan-out

`emit` 內部依序做三件事：

1. **組出事件**：取出 input 的欄位，再補上一個 random ID 和 timestamp，也就是事件發生的時間。
2. **寫入 event log**：把這筆事件 insert 進資料表。
3. **通知 listener**：確認事件已經寫入後，才逐一呼叫每個 listener。

`insert` 可以一次接收陣列、寫入多筆資料；但這裡只寫入一筆。至於 listener 有幾個，就呼叫幾次。

不過，這些呼叫都得等事件已經躺在資料庫裡之後才能開始。

<!-- derived -->
```ts
async function emit(input: EventInput): Promise<void> {
  const event: AgentEvent = {
    ...input,
    id: createRandomId(),
    timestamp: Date.now(),
  };

  // 先落地：把事件寫進 event log
  await db.insert(eventLog).values(event);

  // 確認在資料庫裡了，才廣播出去
  for (const listener of listeners) {
    listener(event);
  }
}
```

順序就是這段程式碼的全部重點：先落地，再廣播。

<!--image:2-->

## 為什麼敢廣播？因為它已經在資料庫裡了

廣播出去的事件收不回來。

listener 一被呼叫，client 那邊就看到了事件；這時候沒有一個可以按下的 undo 按鈕。因此，廣播永遠要放在最後：先把事件寫進資料庫，確認它確實存在，才通知 listener。

這樣換來的保證很簡單：

> 任何 client 看得到的事件，event log 裡一定有。

而 event log 正是 replay 的依據。反過來說，replay 看不見的事件，在系統的紀錄裡就等於從未發生過。

## 順序顛倒會壞在哪

如果把兩個動作對調，程式會變成這樣：

<!-- derived -->
```ts
// 反面教材：先廣播、後落地
async function emitWrong(input: EventInput): Promise<void> {
  const event: AgentEvent = {
    ...input,
    id: createRandomId(),
    timestamp: Date.now(),
  };

  for (const listener of listeners) {
    listener(event); // 已經送出去了，收不回來
  }

  await db.insert(eventLog).values(event); // 這步失敗，事件就只存在 client 的畫面上
}
```

問題不在於多跑一次流程，而在於兩邊的世界會對不起來。

listener 已經收過這個事件，但如果後來 insert 失敗，或程式在 insert 之前就中斷，事件就沒有落地。

client 已經看到事件，但 event log 裡沒有這一筆。程式重啟後，replay 也生不出這個事件；`history` 讀回來的紀錄，會和 client 當下看到的內容不一致。

<!--image:3-->

而且這種不一致沒有補救按鈕：廣播出去的事件收不回來，少寫進資料庫的那一筆也不會自動補上。

先 insert、再 fan-out，就是為了避免走到這一步。

記住一句話就夠了：

> 事件先落地，才輪到人知道。

事件落地之後，接著要面對兩個介面：誰在聽現在的事件、過去的事件怎麼讀回來。下一節來看 `subscribe` 與 `history`。
