# 現在為真的事，和這次 run 已經做過的事

上一段說 replay 會跳過已完成的步驟，但要跳過什麼、重讀什麼，得先分清狀態的種類。在開發背景執行的 Agent 或長時間運作的 Workflow 時，最常踩到的陷阱，就是把所有叫做「狀態」的東西混在一起。

當 Agent 當機重試、或是等待人工審批幾小時後被喚醒，程式碼需要釐清三個完全不同的問題：外部受控服務現在的真實情況如何？這次 Agent 執行任務走到哪一個階段？以及 Workflow 引擎在這次執行裡已經跑過了哪些步驟？

這三個問題分別對應到三種狀態：**World state**、**Run state** 與 **Execution history**。把它們拆開並清楚知道各自存放在哪裡，是寫出穩定 Agent 的核心基礎。

## World state：現在為真的事

World state 代表 Agent 所負責的外部世界「當前」的狀態。在結帳系統的維運 Agent 中，這包含了結帳服務是否健康、當前發布版本、功能開關（feature flags）以及依賴的上游服務狀況。

<!--image:1-->

這個狀態的答案必須直接向業務系統或儲存當前環境的資料庫讀取。在系統的資料庫定義中，它被記錄在環境表（`environments`）內：

<!-- source: sources/background-agent/20261105/server/schema.ts#L1-L120 -->

```typescript
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import type { GoalCondition, WorldState } from '../shared/types'

// The existing physical table names are retained so an instructor's Neon data
// remains readable; the application contract is an environment, never a scenario.
export const environments = pgTable('labs', {
  id: uuid('id').primaryKey(),
  // Legacy columns remain mapped so existing Neon workshop databases can be
  // used without a destructive schema change. Agent code never reads them.
  scenario: text('scenario').notNull(),
  seed: integer('seed').notNull().default(1),
  counter: integer('counter').notNull().default(0),
  running: boolean('running').notNull().default(false),
  rate: integer('rate').notNull().default(1),
  eventTypes: jsonb('event_types').$type<string[]>().notNull(),
  featureEnabled: boolean('feature_enabled').notNull(),
  release: text('release').notNull(),
  upstreamHealthy: boolean('upstream_healthy').notNull(),
  state: jsonb('state').$type<WorldState>().notNull().default({}),
  version: integer('version').notNull().default(0),
  goal: text('goal').notNull(),
  goalCondition: jsonb('goal_condition').$type<GoalCondition>(),
  failNextAction: boolean('fail_next_action').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Unused historical tables are retained for the same non-destructive reason.
export const eventPlans = pgTable('event_plans', {
  id: uuid('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  total: integer('total').notNull(),
  sent: integer('sent').notNull().default(0),
  intervalMs: integer('interval_ms').notNull(),
  weights: jsonb('weights').$type<Record<string, number>>().notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const observations = pgTable('observations', {
  id: uuid('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  healthy: boolean('healthy').notNull(),
  errorRate: integer('error_rate').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const events = pgTable('events', {
  id: uuid('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  runId: uuid('run_id').references(() => runs.id),
  instanceId: text('instance_id'),
  type: text('type').notNull(),
  data: jsonb('data').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const actions = pgTable('actions', {
  id: text('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  name: text('name').notNull(),
  input: jsonb('input').$type<Record<string, unknown>>().notNull(),
  result: jsonb('result').$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const runs = pgTable('runs', {
  id: uuid('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  eventId: uuid('event_id'),
  instanceId: text('instance_id'),
  eventSequence: integer('event_sequence').notNull().default(0),
  goal: text('goal').notNull(),
  goalCondition: jsonb('goal_condition').$type<GoalCondition>(),
  status: text('status').notNull(),
  iteration: integer('iteration').notNull().default(0),
  waitReason: text('wait_reason'),
  report: text('report'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  runId: uuid('run_id')
    .notNull()
    .references(() => runs.id),
  actionId: text('action_id').notNull(),
  action: text('action').notNull(),
  input: jsonb('input').$type<Record<string, unknown>>().notNull(),
  status: text('status').notNull(),
  reason: text('reason'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  decidedAt: timestamp('decided_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const timeline = pgTable('timeline', {
  id: uuid('id').primaryKey(),
  environmentId: uuid('lab_id')
    .notNull()
    .references(() => environments.id),
  runId: uuid('run_id').references(() => runs.id),
  kind: text('kind').notNull(),
  message: text('message').notNull(),
  detail: jsonb('detail').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

World state 是高度可變（mutable）的。即使 Agent 在第三輪循環執行過一次觀察，並把結果存了下來，那也僅代表「第三輪時看到的世界長這樣」，絕不保證第四輪時外部世界還是一樣。

這也是為什麼 Agent 的每個迴圈都必須重新向資料庫發起一次觀察步驟，去讀取最新的 World state，而不能直接沿用上一輪的快照。

## Run state：這次任務本身的業務狀態

Run state 是這次 Agent 執行的業務層級進度。它關心的不是整個世界，而是「這一次目標是什麼、目前進行到第幾次迭代、處於什麼狀態」。

在資料庫裡，它獨立存放在 `runs` 資料表，包含 `goal`、當前迭代次數 `iteration`、執行狀態 `status`（例如是否在等待審批 `waiting`），以及最後的總結報告 `report`。

當程式需要獲取特定一次執行的業務狀態時，會直接從 `runs` 表中查詢：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L10-L14 -->

```typescript
export async function getRun(runId: string) {
  const [run] = await db.select().from(runs).where(eq(runs.id, runId)).limit(1)
  if (!run) throw new Error('Agent run not found')
  return run
}
```

當 Agent 在每一個決策循環開始時，通常需要把當下的 World state 與這筆 Run state 組合起來，同時載入跟這次 run 相關的近期事件、操作與人工審批結果，形成決策上下文：

<!--image:2-->

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L63-L123 -->

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

export type AgentState = Awaited<ReturnType<typeof agentState>>
```

從這段邏輯可以看出，`world` 與 `run` 是分開讀取的：`getLatestState()` 回答的是當前外部世界的真實模樣，而 `getRun(runId)` 回答的是這趟任務本身的進度與條件。

## Execution history：這次 run 已經做過的事

Execution history 則是工作流程引擎（例如 Inngest）底層記錄的執行軌跡。它回答的問題是：「這次執行已經做過了哪些步驟？」

當 Agent 包含多個步驟（讀取狀態、呼叫 LLM、觸發外部動作），Workflow 引擎會為每一個完成的步驟建立 checkpoint。若伺服器重啟或從暫停狀態喚醒，引擎會重新執行該函式，但會拿著先前已記錄的步驟結果直接跳過已經執行過的部分，還原出當前的執行路徑。

這份歷史紀錄存在 Inngest 等 Durable Execution 服務中，而不是業務資料庫的 `runs` 表。Inngest 記錄的是「每個步驟回傳了什麼值」，用來在重播（replay）時提供快照；而業務資料庫記錄的是「系統對外發生的業務事件與動作」。

## 清楚劃分邊界

把這三者放在一起看，就能釐清各自的權責與讀取來源：

<!--image:3-->

1. **World state**：回答「外部世界現在長怎樣？」，隨時間與外部事件隨時改變，每次循環都必須向環境資料庫或外部服務重新查詢。
2. **Run state**：回答「這趟任務目前走到哪？」，由業務資料庫的 `runs` 表持久化，記錄迭代輪數、目標與整體狀態。
3. **Execution history**：回答「這次執行已經做完了哪些步驟？」，由 Workflow 引擎（如 Inngest）維護，用於當機重啟或喚醒時重播程式碼並跳過已完成的副作用。

分清楚「現在為真的事」與「這次 run 已經做過的事」，就不會誤把過去步驟的執行快照當成世界當前的真相，也能避免在重播執行路徑時搞混業務狀態。
