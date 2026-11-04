# 決策上限與 terminal 狀態：讓迴圈停下來

就算完成判定是確定性的，模型仍可能一直選不到能達標的動作。在設計自動化 Agent 時，最常遇到的問題不是模型能不能推理，而是它會不會永遠停不下來。如果放任模型自己決定何時大功告成、何時該繼續嘗試，一旦遇到非預期的錯誤或無法判斷的邊界情境，程式就可能陷入無止盡的迴圈，消耗資源甚至引發副作用。

要把 Agent 放到生產環境，就不能讓模型全權主導自己的成功條件。外層的控管機制（harness）必須承擔兩項最核心的職責：設定明確的決策上限，以及定義不可逆的終止（terminal）狀態。

### 模型只是推理函式，不是控制者

構建 Agent 的核心思維，是把大語言模型（LLM）視為單純的「推理函式」。

大部分程式邏輯依然是確定性（deterministic）的程式碼，唯有需要理解與權衡的關鍵節點，才交由模型處理。由外層 harness 負責維護動作目錄、驗證並執行選取的動作，再把最新狀態回傳給模型。模型能根據證據在不同動作間選擇，但它絕不能成為自身是否成功的唯一裁判。

基本的運作迴圈如下：

1. 觀察當前環境狀態（observe current world）
2. 選擇一個動作（choose one action）
3. 讓外層 harness 驗證並執行該動作（harness validate and execute）
4. 再次觀察環境狀態（observe again）

### 用決策上限約束迴圈範圍

為了防止模型在迷航時無限遞迴，迴圈必須有硬性規定的執行次數上限。在處理事件的背景任務中，決策次數會被嚴格限制：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L58-L86 -->

```typescript
export const incidentAgent = inngest.createFunction(
  {
    id: 'incident-agent',
    name: 'Checkout incident agent',
    triggers: { event: 'incident/opened' },
    retries: 2,
    cancelOn: [{ event: 'agent/run.cancelled', match: 'data.runId' }],
    // This limits executing steps, not the number of waiting incidents.
    concurrency: { limit: 1, key: 'event.data.environmentId' },
    onFailure: async ({ error, event }) => {
      const original = event.data.event as { data?: { runId?: string } }
      if (original.data?.runId) await setRun(original.data.runId, 'failed', error.message)
    },
  },
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

在這個實作中，迴圈最多只允許跑 24 個週期（cycle）。每一次進入迴圈前，都會先檢查當前執行個體（run）的狀態；只要達到決策上限而未完成，外層機制就會強制介入終止，將狀態設為升級人工處理（`escalated`）：

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L214-L214 -->

```typescript
    await step.run('stop-at-limit', () => setRun(runId, 'escalated', 'Decision limit reached'))
```

當次數耗盡，系統不會任由 Agent 繼續猜測，而是明確標記「已達到決策上限（Decision limit reached）」，讓維運人員接手。

### 終止狀態的鎖定

除了固定次數的決策上限，狀態機本身也必須具備 terminal 狀態的保護機制。

在系統中，以下幾種狀態代表生命週期已經結束，屬於 terminal 狀態：
- `completed`（完成）
- `cancelled`（取消）
- `failed`（失敗）
- `escalated`（升級處理）
- `superseded`（被後續事件取代）

負責更新狀態的資料層函式會嚴格阻擋對已結束狀態的重複寫入：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L16-L43 -->

```typescript
export async function setRun(
  runId: string,
  status: string,
  waitReason: string | null = null,
  report?: string,
) {
  const run = await getRun(runId)
  if (['completed', 'cancelled', 'failed', 'escalated', 'superseded'].includes(run.status))
    return run
  const [updated] = await db
    .update(runs)
    .set({ status, waitReason, report: report ?? run.report, updatedAt: new Date() })
    .where(eq(runs.id, runId))
    .returning()
  const phase = ['completed', 'cancelled', 'failed', 'escalated', 'superseded'].includes(status)
    ? 'terminal'
    : status === 'waiting'
      ? 'pause'
      : status.startsWith('needs_')
        ? 'human'
        : 'resume'
  if (status !== run.status || status === 'waiting') {
    await logAgentActivity(run.environmentId, runId, phase, `Run ${status.replaceAll('_', ' ')}`, {
      waitReason,
    })
  }
  return updated
}
```

一旦執行個體進入上述任何一個 terminal 狀態，後續所有的狀態變更請求都會直接被忽略。這確保了無論是非同步的重試機制、其他背景工作、或是尚未退出的模型推理，都不可能把一個已經結束或轉交人工的任務悄悄重啟。

<!--image:2-->

藉由外層 harness 控制的「決策上限」與「terminal 狀態鎖定」，系統能在模型推理失準或遇到障礙時主動踩剎車，而不是被動等待模型自行結束。
