# 事件是門鈴，不是世界狀態

當系統發出警報，通知結帳服務出現異常時，你的背景 Agent 會收到一個觸發事件。開發時最容易犯的錯誤，就是直接把事件 payload 裡的欄位當成當前系統的真實狀態來處理。

事件的本質只是一聲「門鈴」。門鈴響了，代表有事情發生、世界可能改變了；但門鈴本身不會告訴你門外現在站著誰。如果在收到事件幾秒甚至幾分鐘後，依然拿著事件帶過來的資料做決策，往往會做出錯誤的判斷，因為外部服務可能已經自行重啟、或是被其他操作改變了狀態。

要讓背景 Agent 做出可靠的判斷，核心原則是：從事件只取識別碼，每一輪思考都要重新向目標服務讀取最新的即時快照。

## 從觸發事件取得 run

背景 Agent 不是即時回應的聊天機器人，它採用非同步觸發（fire-and-forget）。以工作流引擎 Inngest 為例，當監控系統發出 `incident/opened` 事件時，工作流被喚起，事件資料（`event.data`）中最重要的只有識別碼，例如 `environmentId`、`runId` 與 `instanceId`。

收到事件後，第一件事是拿 `runId` 到資料庫查詢對應的 run 物件。這樣能確認是否已經有正在進行中的調查，避免重複排查，也能在服務重新觸發時延續既有的上下文。

<!--image:1-->

在工作流的主迴圈中，每一輪循環都代表一次「觀察與決策」的週期：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L72-L85 -->

```typescript
  async ({ event, step }) => {
    const { environmentId, runId, instanceId } = event.data
    const run = await getRun(runId)
    if (
      run.instanceId !== instanceId ||
      ['completed', 'failed', 'cancelled', 'escalated', 'superseded'].includes(run.status)
    )
      return

    for (let cycle = 1; cycle <= 24; cycle++) {
      const current = await getRun(runId)
      if (['completed', 'failed', 'cancelled', 'escalated', 'superseded'].includes(current.status))
        return
      const state = await step.run(`observe-state-${cycle}`, () => agentState(environmentId, runId))
```

這段工作流替 Agent 設定了硬性的循環上限（例如 24 輪），並在每輪開始前檢查 run 的狀態。只要任務沒有被取消或完成，就透過步驟檢查點執行 `agentState` 取得最新狀態。

## 每一輪都向外部服務重讀 `/state`

在決策迴圈中，觀察世界不能依賴記憶或快取。Agent 必須主動向獨立運行的結帳服務發送 HTTP 請求，讀取當前最新的狀態快照。

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

結帳服務是獨立的進程，有自己的狀態與 API。Agent 透過 HTTP 呼叫 `getLatestState()` 取得帶有版本號（`version`）與實例 ID（`instanceId`）的快照。這裡不共享記憶體，也不使用啟動時事件帶來的舊 payload，確保拿到的都是系統當下的真實情況。

<!--image:2-->

## 四種狀態的界線與快照組裝

要避免 Agent 產生混淆，必須清楚劃分四種不同的狀態：

1. **世界狀態（World state）**：結帳服務當前 `/state` 回傳的即時資料。
2. **運行狀態（Run state）**：當前這起 incident 的目標、狀態（如進行中、等待中）以及決策次數。
3. **執行歷史（Execution history）**：工作流引擎已經固化、記錄的 checkpoint。
4. **事件歷史（Event history）**：記錄過去發生的通知清單，提醒世界可能曾發生變更。

在每輪迴圈的 `agentState` 函式中，我們把這些狀態平行讀取並組裝成完整的決策快照：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L63-L121 -->

```typescript
export async function agentState(environmentId: string, runId: string) {
  const [world, run, recentEvents, recentActions, recentApprovals] = await Promise.all([
    getLatestState(),
    getRun(runId),
    db
      .select()
      .from(events)
      .where(eq(events.runId, runId))
      .orderBy(desc(events.createdAt))
      .limit(8),
    db
      .select()
      .from(actions)
      .where(like(actions.id, `${runId}:%`))
      .orderBy(desc(actions.createdAt))
      .limit(8),
    db
      .select()
      .from(approvals)
      .where(eq(approvals.runId, runId))
      .orderBy(desc(approvals.createdAt))
      .limit(4),
  ])

  const state = {
    environmentId,
    eventSequence: run.eventSequence,
    world,
    events: recentEvents.map((item) => ({
      type: item.type,
      data: item.data,
      at: item.createdAt.toISOString(),
    })),
    actions: recentActions.map((item) => ({
      id: item.id,
      name: item.name,
      input: item.input,
      result: item.result,
      at: item.createdAt.toISOString(),
    })),
    humanDecisions: recentApprovals
      .filter((item) => item.status !== 'pending')
      .map((item) => ({ action: item.action, status: item.status, answer: item.reason })),
  }

  if (run.environmentId !== environmentId) throw new Error('Run belongs to a different environment')
  if (world.instanceId !== run.instanceId)
    throw new Error('Checkout service restarted during this incident')
  if (run.status === 'waiting' || run.status.startsWith('needs_')) {
    await logAgentActivity(environmentId, runId, 'resume', 'Resumed and read current state', {
      afterDecision: run.iteration,
    })
  }
  await logAgentActivity(environmentId, runId, 'observe', 'Observed latest state', {
    version: world.version,
    state: world.state,
  })
  return state
}
```

`agentState` 透過 `Promise.all` 同時取得結帳服務的即時世界狀態、資料庫中的 run 記錄，以及最近的事件、動作與人工審查結果。

<!--image:3-->

組裝時有嚴格的防禦檢查：如果結帳服務的 `instanceId` 和目前 run 記錄的實例 ID 不一致，代表結帳服務在排查期間重啟過，環境已經不單純，程式會直接拋出例外中止。

透過「事件只當門鈴、每輪重讀 `/state`」的設計，Agent 每次面對決策時，看到的都是世界最新、最真實的模樣，而不是幾分鐘前的歷史幻影。
