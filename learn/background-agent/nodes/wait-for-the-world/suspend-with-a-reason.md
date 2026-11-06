# 三種暫停：wait、complete、request_help

決定要站在門口等之後，下一個問題是暫停的理由要怎麼表達。背景 Agent 在自主運作時，不會只有「繼續執行」與「成功結束」兩種情況。很多時候流程會停下來，但「停下來」背後的原因往往完全不同。如果測試框架或執行環境（harness）只把流程標記為暫停，卻沒有釐清理由，維運人員就很難判斷究竟是系統正在等外部事件、Agent 遇到困難，還是它誤判了任務進度。

在 harness 的流程控制中，通常會把暫停（suspend）細分為三種不同的語意情境：`wait`、`complete` 與 `request_help`。

<!--image:1-->

### 三種暫停動作的語意

第一種是純粹的 `wait`。Agent 判斷當前環境尚未滿足下一步的執行條件，例如正在等待非同步任務完成或外部資源就緒，因此主動要求稍微等一下，稍後再繼續檢查。

第二種是帶有驗證門檻的 `complete`。Agent 本身認為自己已經達成目標，宣告工作完成。但只要 harness 事先設定了客觀的目標檢核條件（goal condition），Agent 的宣告就不能直接算數。如果檢核條件尚未通過，harness 就會判定這項完成無效，強制將狀態轉為暫停，也就是拒絕完成（reject completion）。這代表 Agent 與系統的判斷出現分歧，流程進入僵局，需要人工介入確認。

第三種是 `request_help`。Agent 遇到無法自行排解的障礙，或是需要取得額外授權與資訊，主動發起求助請求。在支援機制尚未完全自動化前，harness 也會先將這個求助請求推遲並暫停，等待人類提供解答。

### 記錄需要人工介入的事件

當 Agent 宣告完成卻未通過目標條件時，harness 會透過活動記錄（activity log）留下稽核軌跡，並把階段標註為需要人類處理的階段：

<!-- source: sources/background-agent/20261105/server/agent-log.ts#L6-L32 -->

```typescript
type AgentActivityPhase =
  | 'start'
  | 'observe'
  | 'resume'
  | 'loop'
  | 'predict'
  | 'act'
  | 'pause'
  | 'human'
  | 'terminal'

export async function logAgentActivity(
  environmentId: string,
  runId: string,
  phase: AgentActivityPhase,
  message: string,
  detail: Record<string, unknown> = {},
) {
  await db.insert(timeline).values({
    id: randomUUID(),
    environmentId,
    runId,
    kind: `agent:${phase}`,
    message,
    detail,
  })
}
```

這類記錄會寫入時間軸資料庫，並將 phase 設定為 `'human'`，訊息則明確註記為被設定的目標條件阻擋。這樣一來，後續接手的工程師就能立刻看出問題並非系統當機，而是 Agent 提早退出了任務。

<!--image:2-->

### Harness 如何記下等待狀態與理由

確認完特定的暫停動作後，harness 會統一將這次執行的狀態更新為等待中（`waiting`），並記錄對應的暫停原因：

<!--image:3-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L99-L117 -->

```typescript
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
```

如果是 Agent 主動發起的 `wait`，狀態中記錄的理由就會直接採用 Agent 決策時附帶的 `decision.reason`；若是因為目標條件未滿足而遭到拒絕的 `complete`，harness 則會寫入像是「復原尚未驗證」或對應的阻擋理由。

透過這樣的分工，Agent 的意圖與 harness 的客觀檢驗得以明確分開，所有暫停的流程也都有跡可循。
