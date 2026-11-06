# 醒來後接著跑下一行

先檢查再等待解決了漏接，但還有一個問題：醒來之後是同一條 run 嗎？當系統遇到相依服務異常時，負責排障的背景工作（run）通常需要等待服務自行恢復。如果在這段等待期間，監控系統又連續送來好幾筆告警，背景代理人是會手忙腳亂地開出好幾個新工作，還是有辦法在原本的工作中繼續處理？

理想的做法是維持同一個工作實體：後續的告警與恢復事件全部併入同一個 run，而暫停的工作在收到事件後，直接從當初停下來的那一行程式碼醒來，重新向外部服務確認狀態，直到確認復原後結案。

### 事件併入同一個 Run，不重複開工

在排障情境中，同一個服務實例只會維持一個活躍的 incident run。第一個告警進來時會建立 run；如果在它處理期間又收到額外告警，系統只會遞增事件序號（`eventSequence`），而不會另開新 run：

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/incident-data.ts#L91-L111 -->

```typescript
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

這確保了哪怕短時間內發送多筆告警，所有事件都會附掛在同一個 incident 上。

### 暫停與喚醒：從 await 的下一行繼續

當工作發現條件尚未滿足時，會把狀態標記為等待中，並呼叫事件等待機制暫停執行。這段流程不是靠無窮迴圈盲目重試，而是掛起工作，等待特定 run ID 的事件更新通知：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L126-L133 -->

```typescript
          await step.waitForEvent(`wait-for-service-${cycle}-${check}`, {
            event: 'incident/updated',
            if: `async.data.runId == "${runId}"`,
            timeout: '10s',
          })
          // The timeout also reconciles an event that arrived just before the wait.
        }
        continue
```

這裡的關鍵在於控制流程：當 `waitForEvent` 等到事件而解除阻塞時，程式並不是重新從工作的第一行從頭跑，而是直接走進下一行的 `continue`。

<!--image:2-->

這個 `continue` 讓程式脫離內層等待的迴圈，回到外層主要流程的開頭。此時工作依然保留原有的 `runId` 與脈絡，準備進行下一輪評估。

### 重新觀察最新狀態，而非盲信事件內容

被喚醒之後，工作並不會直接假設系統已經完全修復，也不會直接把事件夾帶的 payload 當作最新狀態。代理人會透過 HTTP 主動向服務拉取當前的快照：

<!--image:3-->

<!-- source: sources/background-agent/20261105/server/observe.ts#L1-L17 -->

```typescript
import { z } from 'zod'

export const checkoutServiceUrl = process.env.CHECKOUT_SERVICE_URL || 'http://127.0.0.1:3004'

const snapshotSchema = z.object({
  instanceId: z.string().uuid(),
  version: z.number().int(),
  state: z.record(z.string(), z.unknown()),
})

// The agent reads the checkout process over HTTP. It does not share the
// service's memory or use an event payload as a state snapshot.
export async function getLatestState() {
  const response = await fetch(`${checkoutServiceUrl}/state`)
  if (!response.ok) throw new Error(`Checkout state request failed: ${response.status}`)
  return snapshotSchema.parse(await response.json())
}
```

當服務完成修復邏輯時，內部會發布復原事件：

<!-- source: sources/background-agent/20261105/service/checkout.ts#L95-L108 -->

```typescript
function emit(type: string, data: Record<string, unknown>) {
  const event = { id: randomUUID(), serviceId: 'checkout', instanceId, type, data }
  pendingEvents.set(event.id, event)
  void deliverEvents()
}

function recover(reason: string) {
  if (activeFault === 'none') return
  activeFault = 'none'
  state = { ...state, health: { status: 'healthy', errorRate: 1 } }
  version++
  recordLog('info', `Checkout recovered after ${reason}`)
  emit('health.recovered', { summary: `Checkout recovered after ${reason}`, version })
}
```

這個事件會喚醒等待中的工作。工作醒來並執行下一行的 `continue` 後，回圈開頭的重新觀察步驟便會向結帳服務發出 `/state` 請求。一旦拿到最新的狀態快照，確認上游狀態恢復健康且符合預期目標，原本的 run 就會順利標記為完成（completed），結束整個排障生命週期。
