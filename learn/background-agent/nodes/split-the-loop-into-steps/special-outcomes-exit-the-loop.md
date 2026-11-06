# 需要一個 return，否則迴圈會繼續跑

step 的界線畫好之後，還有一種很容易漏掉的情況：某些動作不該繼續下一輪。在撰寫背景運作的 Agent 迴圈時，每一輪迭代都會先觀察狀態，再由模型決定下一步要執行什麼動作。最容易踩到的陷阱之一，就是處理完特殊動作後忘記中斷流程。

如果 Agent 判定任務已經完成，或是需要等待外部事件，程式卻沒有及時 `return` 結束工作流程，迴圈就會若無其事地順著往下執行。這會導致 Agent 試圖去解決一個「已經完成」的問題，不僅邏輯錯亂，還會平白浪費大量呼叫大型語言模型（LLM）的 API 費用。

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L81-L139 -->

```typescript
    for (let cycle = 1; cycle <= 24; cycle++) {
      const current = await getRun(runId)
      if (['completed', 'failed', 'cancelled', 'escalated', 'superseded'].includes(current.status))
        return
      const state = await step.run(`observe-state-${cycle}`, () => agentState(environmentId, runId))

      if (goalSatisfied(state, run.goalCondition)) {
        const report = await step.run(`write-report-${cycle}`, () => writeReport(run.goal, state))
        await step.run(`complete-run-${cycle}`, () => setRun(runId, 'completed', null, report))
        return { report }
      }

      const decision = await step.run(`choose-action-${cycle}`, () => chooseAction(run.goal, state))
      await step.run(`set-iteration-${cycle}`, () => setIteration(runId, cycle))
      await step.run(`record-decision-${cycle}`, () =>
        recordDecision(environmentId, runId, cycle, decision.action, decision.reason),
      )

      if (decision.action === 'wait' || (decision.action === 'complete' && run.goalCondition)) {
        if (decision.action === 'complete') {
          await step.run(`reject-completion-${cycle}`, () =>
            logAgentActivity(
              environmentId,
              runId,
              'human',
              'Completion blocked by configured goal condition',
              { condition: run.goalCondition },
            ),
          )
        }
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
      }
      if (decision.action === 'complete') {
        const report = await step.run(`write-report-${cycle}`, () => writeReport(run.goal, state))
        await step.run(`complete-run-${cycle}`, () => setRun(runId, 'completed', null, report))
        return { report }
      }
```

### 完成任務：產生報告並結束

當決策動作是 `complete` 時，代表目標已經達成。這時工作流程需要執行兩件事：產出總結報告，並將該次執行記錄標記為完成。

<!--image:1-->

呼叫模型撰寫報告屬於非確定性（nondeterministic）的操作，因此必須放在 `step.run` 裡執行。每個 `step.run` 都是一個檢查點（checkpoint），工作流程系統會把結果持久化儲存。萬一中途斷線重試，就不需要花費額外的 token 重新呼叫模型。

報告寫好且執行狀態更新為完成後，務必直接 `return { report }`。一旦回傳，整個背景迴圈就此終止。如果少了這行，程式碼會滑入後續的工具呼叫或下一輪迴圈，讓已經結束的工作又被重跑一次。

### 等待事件：中斷當前輪次

如果 Agent 的動作是 `wait`，或者雖然模型認為完成了，但系統設定的目標條件（`goalCondition`）尚未滿足，流程就必須停下來等待。

在上面的實作中，遇到條件未滿足的完成請求，會先記錄拒絕完成的原因，並將狀態更新為等待中。接著工作流程會進入監聽迴圈，等待特定的更新事件抵達。

<!--image:2-->

在雛形開發階段，若事件監聽邏輯還沒寫好，通常會先將執行狀態標記為無法處理並記錄事件。此時最關鍵的依然是補上 `return`，確保工作流程在此打住。如果沒有立刻 return，迴圈就會繼續向下穿透，執行本該在等待後才做的動作。而在事件機制完整時，則是用 `continue` 推進到下一輪迴圈，重新觀察環境。

### 請求協助：交出控制權

除了等待與完成，另一個常見的分支是請求人工協助（`request_help`）。當模型判斷當前環境缺乏權限，或是遇到無法自行排除的障礙時，會拋出求救信號。

這個分支的處理概念與等待類似。在系統還沒有串接真人操作介面之前，可以先建立一個步驟，將狀態更新為「真人協助功能尚未建置」或暫時無法處理。接著同樣要執行 `return` 結束當前執行，避免 Agent 在無人回應的情況下，繼續拿著未解決的狀態胡亂猜測與行動。

為這三種特殊情況加上獨立分支與明確的 `return`，才能確保 Agent 只在該行動時行動，該停下時毫不猶豫地停下。
