# AI 有沒有權限做這件事？

把特殊結果用 `return` 收乾淨之後，剩下的就是一般動作該怎麼安全執行。當 AI Agent 決定對系統採取行動時，例如檢查日誌、關閉某個功能或退回發布版本，我們不能放任它直接執行，但也不能在程式碼裡為每一個動作硬寫獨立的判斷邏輯。如果系統有三十個工具，寫三十個 `if` 判斷很快就會讓流程失控。

要解決這個問題，核心做法是用權限策略（Action Policy）把動作分流，並將具體的執行步驟交由具備冪等性（Idempotency）的工作流程步驟來保護。

## 用 actionPolicy 抽象化權限

與其判斷「AI 現在是不是要執行 `inspect_logs`」，不如判斷「AI 現在要做的是不是唯讀動作」。

<!--image:1-->

我們可以為所有工具動作定義一份對應表，將它們分類為幾種固定的權限政策，例如 `read`、`write`、`approval`、`help` 或 `terminal`：

<!-- source: sources/background-agent/20261105/server/tool-policy.ts#L1-L15 -->

```typescript
import type { ActionName } from '../shared/types'

// The harness reads policy metadata; it does not branch on checkout fault flags.
export const actionPolicy: Record<
  ActionName,
  'read' | 'write' | 'approval' | 'help' | 'terminal' | 'wait'
> = {
  inspect_logs: 'read',
  inspect_changes: 'read',
  disable_feature: 'write',
  rollback_release: 'approval',
  request_help: 'help',
  complete: 'terminal',
  wait: 'wait',
}
```

有了這層抽象，工作流程本體（Harness）就只要針對這幾種策略分支處理：
- `read`：單純讀取資訊，可以直接放行執行。
- `write`：修改狀態的動作，視風險決定是否需要進一步保護或記錄。
- `approval`：高風險動作（例如復原發布），必須暫停並等待人工審批。
- `help` 與 `terminal`：分別代表請求協助或流程結束。

未來即使新增十個只負責查詢的工具，只要將它們標記為 `read`，現有的流程邏輯就完全不用更動。

## 將執行包進 step 並傳送版本號

在具有重試機制的工作流程引擎中，任何會造成副作用的寫入操作都必須非常小心。如果工作流程在中途重新執行，絕不能讓轉帳或重設系統這類動作被執行兩次。

因此，執行動作必須包進 `step.run` 中，並給予唯一的 `actionId` 作為冪等鍵。同時，為了防止覆寫其他人或先前步驟已修改的狀態，非讀取的動作必須帶上當前的世界狀態版本（`expectedVersion`）：

<!--image:2-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L20-L56 -->

```typescript
async function executeAction(
  environmentId: string,
  runId: string,
  actionId: string,
  name: ActionName,
  expectedVersion?: number,
) {
  const input = expectedVersion === undefined ? {} : { expectedVersion }
  await logAgentActivity(environmentId, runId, 'act', `Calling ${name.replaceAll('_', ' ')}`, {
    actionId,
    input,
  })
  try {
    const response = await fetch(`${checkoutServiceUrl}/operations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionId, name, ...input }),
    })
    const result = (await response.json()) as Record<string, unknown>
    if (!response.ok) throw new Error(String(result.error || `Tool failed: ${response.status}`))
    if (result.stale !== true)
      await recordToolAction(environmentId, runId, actionId, name, input, result)
    return result
  } catch (error) {
    await logAgentActivity(
      environmentId,
      runId,
      'act',
      `${name.replaceAll('_', ' ')} attempt failed`,
      {
        actionId,
        error: error instanceof Error ? error.message : String(error),
      },
    )
    throw error
  }
}
```

在呼叫後端服務時：
- 如果政策是 `read`，不需要鎖定版本，`expectedVersion` 設為 `undefined`。
- 如果政策涉及狀態修改，就傳入目前的 `state.world.version`。
- 如果服務回傳 `stale === true`，表示動作已經執行過，或是服務端狀態已經變更，這時不要將它記錄為新的工具呼叫。

## 處理過期與重複的 stale 結果

在工作流程的執行迴圈中，策略分流、步驟封裝與過期檢查會串聯在一起：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L141-L207 -->

```typescript
      const actionId = `${runId}:${cycle}:${decision.action}`
      const policy = actionPolicy[decision.action]
      if (policy === 'approval' || policy === 'help') {
        const input =
          policy === 'help'
            ? { question: decision.detail }
            : { expectedVersion: state.world.version }
        const proposalId = await step.run(`propose-action-${cycle}`, async () => {
          const proposal = await proposeAction(
            environmentId,
            runId,
            actionId,
            decision.action,
            input,
          )
          return proposal.id
        })
        let proposal = await step.run(`read-human-${cycle}`, () => getProposal(proposalId))
        let check = 0
        while (proposal.status === 'pending') {
          check++
          await step.waitForEvent(`wait-for-human-${cycle}-${check}`, {
            event: 'agent/approval.decided',
            if: `async.data.proposalId == "${proposalId}"`,
            timeout: '10s',
          })
          proposal = await step.run(`reconcile-human-${cycle}-${check}`, () =>
            getProposal(proposalId),
          )
        }
        if (proposal.status !== 'approved') {
          await step.run(`stop-after-human-${cycle}`, () =>
            setRun(runId, 'escalated', `Human decision: ${proposal.status}`),
          )
          return
        }
        if (policy === 'help') continue
        const fresh = await step.run(`recheck-approved-state-${cycle}`, () =>
          agentState(environmentId, runId),
        )
        if (fresh.world.version !== input.expectedVersion) {
          await step.run(`invalidate-approval-${cycle}`, () => staleProposal(proposalId))
          continue
        }
      }

      const result = await step.run(`execute-action-${cycle}`, () =>
        executeAction(
          environmentId,
          runId,
          actionId,
          decision.action,
          policy === 'read' ? undefined : state.world.version,
        ),
      )
      if (result.stale === true) {
        await step.run(`stale-action-${cycle}`, () =>
          logAgentActivity(
            environmentId,
            runId,
            'act',
            'Action rejected because service state changed',
            result,
          ),
        )
        continue
      }
```

當需要人工審核（`approval`）時，系統會先建立提案、暫停等待事件，並在通過後再次比對版本號是否過期。

當動作真正進入 `executeAction` 時，它被保護在 `step.run` 內，結果會被記憶（memoized）。如果後端服務回傳 `stale: true`，代表該操作在冪等檢查下已經被完成過，或是狀態版本不符。這時工作流程不會將其視為當機崩潰，而是記錄一筆「動作因狀態變更而被拒絕」的紀錄，接著繼續下一個迴圈。這樣既能防止重複執行危險操作，也能讓整個 Agent 的執行軌跡清晰可追溯。

<!--image:3-->
