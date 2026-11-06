# 等到事件，或等到逾時

把暫停語意分清楚之後，接著看 harness 用什麼 primitive 真的停下來等。在設計長流程的後端工作流程（Workflow）時，常會遇到需要「等待外部通知」的情境。例如等待使用者點擊驗證信、等待審批完成，或是等待外部系統回傳處理狀態。如果這個通知一直沒來，系統也不能永遠卡在那裡，必須設定一個時間上限，時間到了就繼續往下走或進行例外處理。

Inngest 的 `step.waitForEvent` 就是為了解決這個問題而設計的步驟。

## `step.waitForEvent` 的三個核心參數

使用 `step.waitForEvent` 時，除了第一個參數是該步驟的唯一名稱之外，第二個參數物件通常包含三個設定：

1. `event`：欲等待的事件名稱。工作流程會開始監聽這個特定的事件類型。
2. `if`：事件過濾條件。在分散式系統中，同類型的事件可能會頻繁發送，你通常只關心與當前流程相關的那一筆。透過 `if` 表達式（例如比對資料中的 ID），只有符合條件的事件才會喚醒工作流程，其他不相關的事件會被直接忽略。
3. `timeout`：逾時時間。設定等待的上限（例如 `10s` 或 `3d`）。事件送達或逾時抵達，兩者只要其中一個先發生，等待步驟就會結束。

<!--image:1-->

以下是在輪詢與等待事件的迴圈中，使用 `step.waitForEvent` 的範例：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L118-L132 -->

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

當步驟結束後，回傳值會代表等待的結果。如果是在逾時前收到符合過濾條件的事件，變數就會拿到該事件的內容；如果是因為逾時而結束，結果就不會包含該事件。你可以藉此判斷後續要走正常流程還是逾時處理邏輯。

## 等待並不是掛起呼叫堆疊

在程式碼中寫下 `await step.waitForEvent(...)`，看起來就像一般的 JavaScript 非同步等待。但這背後的運作方式，跟單純在伺服器上 `await` 一個長時間的 Promise 完全不同。

如果在一般伺服器函式裡硬等三天，整個行程（process）或呼叫堆疊（call stack）就必須持續掛在那裡，不僅浪費記憶體與連線資源，伺服器一旦重啟，等待中的狀態也會全部消失。

`step.waitForEvent` 並不會掛起伺服器的呼叫堆疊。當程式執行到這個步驟時，工作流程引擎會將等待條件記錄下來，而當前執行的伺服器函式就直接正常結束、釋放所有資源。

<!--image:2-->

當等待的事件真的送達，或是設定的逾時時間到了（本質上就像定時排程的觸發器），系統會重新喚醒這支工作流程函式，將它重新執行一次。這個過程就像 React 元件因為狀態改變而重新觸發一次 render cycle 一樣。

## 頂層控制流程必須具備確定性

正因為工作流程在等待結束後會重新執行，整支工作流程函式的頂層控制流程必須是確定性（deterministic）的。

如果程式在等待三天後被重新喚醒並重新執行，它必須能夠循著與先前完全相同的路徑走回這個等待步驟。倘若你在頂層流程寫了 `Math.random()` 或依賴每次執行都會變動的外部狀態來決定 `if/else` 分支，重新執行時就可能走進完全不同的分支路徑，導致先前紀錄的步驟結果無法正確對應，甚至破壞整個工作流程的執行狀態。

<!--image:3-->
