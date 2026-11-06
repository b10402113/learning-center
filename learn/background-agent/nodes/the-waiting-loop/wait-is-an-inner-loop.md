# 每一次都重新檢查

在非同步或分散式架構中開發背景工作流程時，你常常會遇到一個棘手的問題：工作流程不是單純的請求與回應模式（request-response）。當背景程式在執行時，系統其他實例可能同時操作同一個工作階段。這意味著在進行下一步之前，底層的狀態隨時都可能被修改、取消或提前結束。

如果程式假設「開始執行時狀態有效，後面就一定有效」，系統很容易產生非預期的行為。為了解決這個問題，在等待事件推進的過程中，我們需要使用巢狀的 `while` 迴圈，並且在每一步推進前重新確認最新狀態。

## 為什麼需要巢狀的等待迴圈

工作流程本身通常會有一個外層迴圈（以 `cycle` 游標記錄），負責整體的輪次運算。但在某些步驟中，系統需要暫停並等待特定事件發生，例如等待事件序列推進，或是等待外部系統更新狀態。

<!--image:1-->

這時候，我們在外層迴圈中再開一層內層迴圈 `while (true)`。內層迴圈的任務是反覆檢查目前的最新狀態，並透過等待機制暫停片刻，直到有新事件推進，或者確認任務已經無法繼續為止。

為了保證每一步在耐久執行（durable execution）引擎中都可以被重播與快取，內層迴圈需要獨立的計數器 `check`。結合外層的 `cycle` 與內層的 `check`，每個步驟名稱都會是獨一無二的，例如 `read-event-sequence-${cycle}-${check}`。

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L118-L134 -->

```typescript
        let check = 0
        while (true) {
          const latest = await step.run(`read-event-sequence-${cycle}-${check}`, () =>
            getRun(runId),
          )
          if (['cancelled', 'superseded', 'failed'].includes(latest.status)) return
          if (latest.eventSequence > state.eventSequence) break
          check++
          await step.waitForEvent(`wait-for-service-${cycle}-${check}`, {
            event: 'incident/updated',
            if: `async.data.runId == "${runId}"`,
            timeout: '10s',
          })
          // The timeout also reconciles an event that arrived just before the wait.
        }
```

## 每次動步前都檢查終止狀態

在分散式環境下，從發起步驟到真正執行，中間可能已經經過一段時間。其他實例可能已經把這個執行階段標記為已取消（cancelled）、已覆蓋（superseded）或失敗（failed）。

因此，每次進入內層迴圈的第一件事，就是重新向資料庫或服務查詢最新狀態（`getRun(runId)`）。拿到狀態後，立刻判斷：

<!--image:2-->

1. **是否已經終止**：若狀態屬於 `cancelled`、`superseded` 或 `failed`，表示這項工作已經不該繼續執行，直接退出函式。
2. **事件序列是否已經推進**：如果 `latest.eventSequence` 大於目前工作流程掌握的 `state.eventSequence`，代表已經有新資料進來，這時就可以用 `break` 跳出內層等待迴圈，交回外層迴圈處理下一輪邏輯。

## 結合超時機制的事件等待

如果最新狀態顯示沒有新事件，而且工作也還沒結束，我們就遞增 `check` 計數器，並進入等待：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L126-L130 -->
```typescript
await step.waitForEvent(`wait-for-service-${cycle}-${check}`, {
  event: 'incident/updated',
  if: `async.data.runId == "${runId}"`,
  timeout: '10s',
})
```

這段邏輯設定了十秒的超時等待。十秒內如果有符合條件的事件更新，等待就會解除；即使十秒內沒有任何事件，超時時間一到也會自動放行，讓迴圈回到頂部重新讀取最新狀態。

<!--image:3-->

這種做法就像是有條件事件監聽的暫停機制。它既能即時回應外部事件，又能透過超時機制對剛剛好在等待前到達的事件進行對帳（reconciliation）。每一次迴圈前都重新檢查狀態，雖然看起來反覆，但在分散式環境中，這是確保系統不會帶著過期假設繼續執行的必要防線。
