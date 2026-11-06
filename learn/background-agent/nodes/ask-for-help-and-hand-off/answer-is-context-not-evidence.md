# 人的回答是新上下文，不是復原證據

同一條 run 被喚醒、重新觀察之後，還有一個更細的陷阱：不要把人的回答當成完成證據。在自動化處理維運事故（incident）時，Agent 遇到無法自行解決的外部相依問題，往往會向工程師求助。工程師在介面中回覆：「資料庫連線已修復」或「服務已經重啟」。

很多時候，Agent 一讀到工程師的這句話，就立刻判定事故排除，寫下一份措辭漂亮的結案報告。這是一個非常危險的常見錯誤：一則漂亮的報告往往掩蓋了不安全的復原路徑。

工程師的回答本質上只是「新的上下文（context）」，它絕不是系統已經復原的「證據」。

## 提示詞中的明確邊界

當模型向人類求助並獲得回覆時，它必須清楚認知到這份資訊的定位。在系統指引中，通常會嚴格規範警報與求助回覆的角色：

<!-- source: sources/background-agent/20261105/server/agent-brain.ts#L33-L36 -->

```typescript
Use request_help when an external dependency cannot be fixed by your local tools.
Use wait when no safe local action remains; a later service event can wake this same incident run.
An alert is a trigger, not authoritative evidence. An answered help request does not prove recovery.
```

警報只是啟動處理流程的觸發點，不是權威事實；同樣地，人類回答了求助，只代表人類提供了線索或執行了外部操作，並不保證該操作真的生效、或者服務狀態已經符合預期。

<!--image:1-->

## 回答如何進入系統狀態

在背景執行架構（harness）中，人類的決策與回答會被彙整進 Agent 每一個週期的上下文物件中：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L87-L106 -->

```typescript
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
```

從資料結構可以看出，`humanDecisions` 與最近發生的 `events`、執行的 `actions` 以及當前的 `world` 狀態並列。它確實能讓 Agent 理解剛才發生了什麼事，但它本身並沒有直接將服務的健康指標改成健康。

<!--image:2-->

如果系統在這個階段只因為讀到了人類的文字回答，就跳過檢查直接標記結案，就等於把未經查證的對話當成系統健康指標。

## 完成必須由目標條件與真實狀態證明

任務是否完成，只能由系統重讀真實世界的狀態，並確認是否滿足目標條件來決定：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L87-L91 -->

```typescript
      if (goalSatisfied(state, run.goalCondition)) {
        const report = await step.run(`write-report-${cycle}`, () => writeReport(run.goal, state))
        await step.run(`complete-run-${cycle}`, () => setRun(runId, 'completed', null, report))
        return { report }
      }
```

唯有當目標條件（`goalSatisfied`）在最新的狀態資料下真正成立，流程才會產生報告並結案。

<!--image:3-->

如果人類回答了問題，但底層服務尚未確認健康（例如還在重啟中，或根本沒有恢復正常回傳），Agent 就不能擅自結案，而必須進入等待狀態，等待真實的服務事件推送更新：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L111-L133 -->

```typescript
        await step.run(`wait-status-${cycle}`, () =>
          setRun(
            runId,
            'waiting',
            decision.action === 'wait' ? decision.reason : 'Recovery is not verified',
          ),
        )
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

在等待過程中，系統會監聽後續的服務更新事件（例如服務送出新的健康事件）。一旦接收到事件、事件序列遞增，Agent 才會醒來重新讀取狀態，重新比對目標條件。

評價一個 Agent 的處理品質時，世界狀態（world state）、行動序列（action sequence）與人類邊界（human boundary）需要分開檢驗。一個謹慎向人類求助、獲取新線索後耐心等待健康事件證實的執行過程，遠比一個誤信對話文字就自信結案的流程更安全、更可靠。
