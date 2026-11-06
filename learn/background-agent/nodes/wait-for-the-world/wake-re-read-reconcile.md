# 醒來之後，重讀世界

`waitForEvent` 只負責把你叫醒，醒來之後要做什麼才是關鍵。當你寫一個會等待外部訊號的背景 Agent 時，最直覺的做法往往是：註冊等待某個事件，等事件送來時，直接拿事件裡帶的資料（payload）當作系統現況，然後繼續往下做。

這種做法很容易在真實環境出問題。外界系統的狀態隨時都在變動，依賴的服務可能在 Agent 還在睡眠時就修復好了，也可能同時有好幾條警示在描述同一場故障。

把事件當成「門鈴」，而不是「房間內部的現狀」。門鈴響了，只代表門外有人按鈴，催促你起身查看；門鈴本身的震動並不是屋內的完整快照。

### 不要把事件 Payload 當成狀態快照

常見的錯誤，是直接拿喚醒事件裡的 payload 當作恢復的證明。

結帳服務發出信號後，API 會將其持久化並關聯到當前的事態（incident）。Agent 被喚醒時，應該建立一個新的觀察步驟（observation step），重新向結帳服務查詢最新狀態。過去的觀察會保留在歷史紀錄中，但已經不再代表當前現況。

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/observe.ts#L11-L17 -->

```typescript
// The agent reads the checkout process over HTTP. It does not share the
// service's memory or use an event payload as a state snapshot.
export async function getLatestState() {
  const response = await fetch(`${checkoutServiceUrl}/state`)
  if (!response.ok) throw new Error(`Checkout state request failed: ${response.status}`)
  return snapshotSchema.parse(await response.json())
}
```

這段程式碼直接透過 HTTP 向服務拉取最新狀態，而不共享記憶體，也不拿事件 payload 當作狀態快照。這是一條工程合約，而不是靠 Prompt 提醒模型去遵守的規範。

### 事件與等待的競爭條件

在分散式系統中，事件發送與等待註冊之間可能發生時間差（race condition）。如果一個更新事件剛好在 Agent 進入持續等待（durable wait）之前抵達，Agent 可能會錯過那個事件，導致流程卡死。

<!--image:2-->

為了解決這個問題，系統需要維護一個遞增的版本號碼 `eventSequence`。每當有新事件關聯到當前的 run 時，就在資料庫中遞增該序號：

<!-- source: sources/background-agent/20261105/server/incident-data.ts#L99-L111 -->

```typescript
          eventSequence: 1,
          goal: configuredGoal(),
          goalCondition: DEFAULT_CONDITION,
          status: 'running',
        })
        .returning()
      dispatch = 'opened'
    } else if (run) {
      await tx
        .update(runs)
        .set({ eventSequence: sql`${runs.eventSequence} + 1`, updatedAt: new Date() })
        .where(eq(runs.id, run.id))
    }
```

寫入資料庫後，系統會送出帶有穩定事件 ID 的通知，避免重複派送：

<!-- source: sources/background-agent/20261105/server/incident-data.ts#L143-L154 -->

```typescript
  if (outcome.runId && outcome.dispatch) {
    await inngest.send({
      id: `${input.id}:incident`,
      name: outcome.dispatch === 'opened' ? 'incident/opened' : 'incident/updated',
      data: {
        runId: outcome.runId,
        environmentId: environment.id,
        instanceId: input.instanceId,
        eventId: input.id,
      },
    })
  }
```

### 結合 eventSequence 與逾時的調和迴圈

在 Agent 端，不能單純呼叫一次等待就結束。我們需要一個迴圈，比對當前持久化的 `eventSequence` 與 Agent 手上的序號：

<!--image:3-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L118-L133 -->

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
        continue
```

這個迴圈有三個關鍵防護：

1. **狀態檢查**：如果當前 run 已經被取消、被取代（superseded）或失敗，就直接結束流程。舉例來說，如果結帳服務重新啟動，因為服務實例（instance）變更，舊的 run 會被取代，這時重用過去的審核或觀察結果就非常危險。
2. **序號比對**：只要資料庫裡的 `latest.eventSequence` 大於 Agent 目前記錄的 `state.eventSequence`，表示在檢查當下已經有新事件進來，立刻跳出等待迴圈往下執行。
3. **設定逾時（Reconciliation Tick）**：在 `waitForEvent` 設定短暫的逾時（例如 10 秒）。如果事件剛好在準備進入等待的瞬間抵達，導致事件通知先發完了才開始等待，10 秒的逾時會強制醒來，重新讀取一次 `eventSequence`。這裡的逾時並不是模型做出的決策，而是一個純工程機制的狀態調和跳動（reconciliation tick）。

醒來之後，重新讀取世界，比對版本號碼，並用定期的調和逾時避免漏網之魚——這樣才能確保背景 Agent 在任何交錯與重疊的事件中，都不會迷失方向。
