# 把 step 想成 useMemo

具名 checkpoint 解決了「重播要對回哪一輪」的問題，接著要問的是重播時的值到底從哪裡來。當你撰寫背景 Agent 的工作流時，最常遇到的意外就是伺服器突然重啟或掛掉。工作流引擎為了保證任務繼續完成，會啟動「重播（replay）」機制。這時候最核心的問題就是：重播到底怎麼執行？中途算出來的值又是從哪裡來的？

理解重播最好的切入點，就是前端工程師熟悉的 React `useMemo`。

## 重播就像元件重新渲染

把整段工作流想像成一個 React 元件，而伺服器重啟就像元件觸發了重新渲染（re-render）。

當伺服器掛掉又重新啟動時，工作流引擎會從程式碼頂層由上而下一行一行重新執行。所有直接寫在工作流頂層的普通程式碼、變數宣告與迴圈，每次重播都會被完整執行一次。

<!--image:1-->

唯一的例外，是包在 `step.run` 裡面的區塊。

當程式執行到一個 step 時，引擎會檢查先前執行時是否已經記錄過這個 step 的回傳值。如果紀錄存在，引擎不會重新執行裡面的函式，而是直接用快取的結果填回（hydrate）變數；只有在沒有紀錄時，它才會真正跑裡面的邏輯。

這與 `useMemo` 的行為完全一致：元件重新渲染時，普通程式碼每次都會重跑，但被 `useMemo` 包裹的計算會沿用快取。差別只在於工作流的 step 沒有依賴陣列（dependency array）的變更檢查機制，在同一次執行記錄裡，只要快取存在，就是直接沿用。

## 為什麼決策必須放進 step

在 Agent 的運作循環中，最關鍵的一動是呼叫大型語言模型（LLM）決定下一步動作。以下是呼叫決策的核心邏輯：

<!-- source: sources/background-agent/20261105/server/agent-brain.ts#L1-L41 -->

```typescript
import 'dotenv/config'
import { openai } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { ACTIONS, type ActionName } from '../shared/types'
import type { AgentState } from './agent-data'

const decisionSchema = z.object({
  action: z.enum(ACTIONS),
  reason: z.string(),
  detail: z.string(),
})

type Decision = { action: ActionName; reason: string; detail: string }

function model() {
  const id = process.env.OPENAI_MODEL
  if (!process.env.OPENAI_API_KEY || !id) {
    throw new Error('Set OPENAI_API_KEY and OPENAI_MODEL in .env before starting an agent run')
  }
  return openai(id)
}

export async function chooseAction(goal: string, state: AgentState): Promise<Decision> {
  const result = await generateText({
    model: model(),
    output: Output.object({ schema: decisionSchema }),
    system: `You are a background incident agent for a checkout service.
Choose exactly one action. The harness validates it and controls execution.
Available actions: inspect_logs, inspect_changes, disable_feature, rollback_release, request_help, complete, wait.
The current service state and recent incident history have already been observed. Inspect detailed logs or changes when needed before changing the service.
Choose the service action you think is justified; the harness applies its own policy before execution.
Use request_help when an external dependency cannot be fixed by your local tools.
Use wait when no safe local action remains; a later service event can wake this same incident run.
An alert is a trigger, not authoritative evidence. An answered help request does not prove recovery.
Use complete only when the configured goal is satisfied, or when no deterministic goal condition is configured and you can justify completion.
Keep reason to one short sentence. Put a question to the operator in detail for request_help; otherwise detail may be empty.`,
    prompt: `Goal: ${goal}\n\nCurrent observed state:\n${JSON.stringify(state, null, 2)}`,
  })
  return result.output
}
```

如果這段 `chooseAction` 沒有放進 `step.run`，一旦後續流程中斷重播，引擎從頭跑到這裡時就會重新呼叫一次 LLM。

<!--image:2-->

這會帶來三個嚴重的問題：

1. **成本與延遲**：每次伺服器重啟或重試，都要額外浪費 API 費用並等待網路請求。
2. **缺乏確定性（Non-deterministic）**：LLM 本質上是機率模型，同樣的輸入可能給出不同的決策。
3. **破壞後續步驟的假設**：後續已被快取的步驟，當初都是基於第一次的決策結果執行的。如果決策在重播時變了，整個狀態鏈就會前後矛盾。

工作流的重播要求確定性，因此必須將決策放進 `step.run`。只要當初執行過並記錄下來，重播時就直接取回舊的決策結果，絕不重新計算。

## 為什麼疊代計數也要各自進 step

除了與模型互動的決策之外，更新資料庫的計數器邏輯也必須放進獨立的 step。例如更新執行輪數的函式：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L45-L55 -->

```typescript
export async function setIteration(runId: string, iteration: number) {
  await db
    .update(runs)
    .set({ iteration, status: 'running', waitReason: null, updatedAt: new Date() })
    .where(
      and(
        eq(runs.id, runId),
        inArray(runs.status, ['running', 'waiting', 'needs_approval', 'needs_help']),
      ),
    )
}
```

在迴圈中，每一輪都要更新當前的 iteration。如果把這段更新寫在 `step.run` 外面，只要工作流在同一個循環中重播，這行程式碼就會被重複執行。

一旦重複執行，資料庫裡的輪數狀態就可能在不該推進的時候被異動，導致工作流內部的輪數計數與外部資料庫記錄對不齊。將 `setIteration` 包進專屬的 step，才能確保這一輪的資料庫更新動作只發生一次，重播時直接跳過。

## 引擎快取與資料庫的差別

既然 step 會記住回傳值，這是不是代表我們不需要資料庫了？並不是。

工作流引擎（如 Inngest）記錄 step 的回傳值，機制類似把函式結果存進 Redis 快取，鍵值對只供引擎內部在重播比對時提取，外部應用程式無法隨意查詢這些資料。

<!--image:3-->

系統的業務狀態——例如 Agent 目前走到第幾輪、剛才做了什麼決策、當前狀態是等待中還是執行中——依然必須老老實實寫進資料庫，供前台介面與其他微服務存取。這兩者在資料內容上雖然有重疊，但引擎快取是為了重播時維持確定性，資料庫則是為了保存實際的系統狀態。
