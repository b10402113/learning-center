# 通知可能搶在等待註冊之前

把等待寫成內層迴圈之後，接著要處理等待本身最容易漏接的時間差。當系統正在處理事件，背後的代理人（Agent）若判斷目前沒有需要執行的操作，通常會選擇等待外部事件通知。然而在分散式系統中，事件發送與等待註冊往往處於不同行程。

這會衍生出一個經典的競態問題：外部服務的更新通知，可能搶在工作流程正式註冊監聽器之前就已經送達。如果程式只是單純掛上監聽函式，這則搶先抵達的通知就會遺失，導致整個流程停滯不前。

為了解決這個時間差，最關鍵的做法是用狀態序號搭配逾時重檢。

### 用遞增序號標記事件進展

要判斷事件是否已經發生，不能只依賴單純的推播通知，而是要讓資料庫裡的狀態自帶遞增的序號。

<!--image:1-->

以 Incident 服務為例，每次有新的進展或更新寫入資料庫時，都會將這筆執行的 `eventSequence` 數值往上加一：

<!-- source: sources/background-agent/20261105/server/incident-data.ts#L89-L119 -->

```typescript
    const healthy =
      (world.state.health as Record<string, unknown> | undefined)?.status === 'healthy'
    if (!run && input.type !== 'service.started' && !healthy) {
      ;[run] = await tx
        .insert(runs)
        .values({
          id: randomUUID(),
          environmentId: environment.id,
          eventId: input.id,
          instanceId: input.instanceId,
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

當工作流程進入等待邏輯時，手中已經持有一份剛才讀取到的 `state.eventSequence`。只要資料庫中的序號比手上的序號大，就表示在開始等待前或等待途中，外部其實已經有了新的變化。

### 先檢查、後等待的迴圈設計

既然序號會持續增加，等待邏輯就不該是一次性的監聽，而要寫成一個檢查迴圈：

<!--image:2-->

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

這段程式有三個關鍵步驟：

1. **先查最新狀態**：進入迴圈的第一步，先透過步驟向資料庫讀取最新的執行資料 `latest`。如果 `latest.eventSequence` 已經大於工作流程目前的 `state.eventSequence`，代表早已收到新事件，立刻跳出迴圈，直接往下建立新的觀察步驟。
2. **註冊持久化事件監聽**：如果序號尚未改變，才透過 `step.waitForEvent` 註冊監聽特定的更新事件（例如匹配 `runId` 的 `incident/updated`）。
3. **設定逾時作為對齊檢查點（Reconciliation Tick）**：在註冊監聽時，必須帶上逾時設定（例如十秒）。

### 為什麼不能只用 sleep，也不能只靠 waitForEvent

若只用 `step.sleep` 定時去資料庫查詢，雖然不怕漏接事件，但無論事件多快發生，流程都必須白白乾等完整個睡眠週期；對於動輒幾十分鐘的等待而言，會嚴重拖慢處理節奏。

使用 `step.waitForEvent` 的優勢在於：一旦事件在等待期間抵達，工作流程會立刻被喚醒繼續執行，不需要乾等。

但萬一事件抵達的瞬間，剛好夾在「查詢最新序號」與「完成 `waitForEvent` 註冊」這兩行程式碼之間的極短空檔呢？此時事件會穿過監聽註冊，導致監聽器接不到事件。

<!--image:3-->

這時 `waitForEvent` 所設定的逾時（timeout）就成了最後的安全網。這裡的逾時並非模型或業務邏輯的決策，而是一個系統級的狀態對齊點。一旦逾時，流程只不過是結束當次等待，回到迴圈頂端重新查詢 `latest.eventSequence`。搶在註冊前落地的事件，就會在下一次的序號比對中被立刻接住。
