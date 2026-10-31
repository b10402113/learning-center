# eventSequence：醒來之後怎麼知道有新東西

上一步看到，定義 run 的所有資料都序列化進 state，state 才是 run 真正的身分。但 agent 睡著的這段時間，世界一直在變——它醒來後要怎麼知道有沒有新事情發生？還是只是被同一件事又提醒了一次？

如果每次醒來都從頭重看所有資料，會很浪費。更有效率的做法，是用一個簡單、可靠的訊號，快速判斷有沒有新事件。

## event 是門鈴，不是整個房間

世界不會等 agent 跑完一輪才發生變化。依賴服務可能在 agent 閒著時恢復，也可能有好幾個 alert 都在描述同一次故障。

所以你可以把每個 event 想成門鈴，而不是整個房間。checkout process 發出訊號，API 把它存下來、掛到目前的 incident，接著 agent 醒來，再回頭讀取 checkout process。

<!--image:1-->

重點是，agent 不會把 event 的 payload 當成完整快照。payload 只代表有事件發生，並不包含事情的全貌。

因此，agent 會因為收到事件而醒來；如果手上的資訊還不完整，就會發現「目前沒有事能做，需要更多資訊」，接著回去睡，等待後續變化。

## eventSequence：一筆一筆排下來的序號

那要怎麼判斷有沒有新事件？答案是一個簡單的計數器：`eventSequence`。

`eventSequence` 就是服務送出的事件序號。每來一個新事件，序號就加一。對每個 run 來說，`eventSequence` 會隨著新事件一路遞增；run 也會在 state 裡記住自己醒來時看到的序號。

<!--image:2-->

要判斷有沒有新事件，就把最新的序號和 run 原本記住的序號比一比：

<!-- derived -->
```typescript
if (latest.eventSequence > state.eventSequence) {
  // 期間有新事件發生，跳出 while 迴圈
  check += 1;
}
```

如果最新序號比 run 原本記住的序號大，代表這段時間有新事件發生。這時就停止 `while` 迴圈，並把 `check` 加一。

<!--image:3-->

## 醒來之後，先比序號再決定

把這兩件事接起來，就是 agent 醒來後的流程。

Agent 醒來時，先重新確認目前狀況，而不是直接相信 event 的 payload。確認後，再比較 `latest.eventSequence` 和 `state.eventSequence`。

如果序號沒變，代表醒來後沒有新事件，agent 就可以回去睡。若最新序號比較大，代表有新事件進來，agent 就跳出等待，繼續往下做。

一個遞增的序號，就能幫助 agent 分辨「醒來了」和「真的有新事件」；不必每次醒來都從頭檢查所有資料。
