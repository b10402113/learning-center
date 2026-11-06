# 批准只對當初那個版本有效

等到決定、重讀資料庫之後，不能假設世界還停在提案當下。當 Agent 提出一個高風險操作（例如重啟服務或轉帳），流程停下來等待真人審批。幾天甚至幾週後，負責人終於在後台按下了「批准」。

如果程式在收到「批准」的當下不加思索直接執行，系統很可能會出事。發出請求時，帳戶可能有足夠餘額；但等到審批通過時，餘額可能早就不足，這時執行轉帳就會導致透支。在事故處理流程中也是如此：Agent 針對版本 1 的狀態提議了回滾，但如果中間系統狀態已經改變、甚至有人手動部署了其他修復，這份針對舊版本的批准就不能當作後續版本的空白支票。

要避免執行過期操作，Agent 必須在收到批准後重驗世界狀態版本，並正確處理被拒絕與已過期的請求。

## 被拒絕時升級為 escalated

審批結果不外乎兩種：同意或拒絕。如果人類選擇不批准，Agent 該怎麼辦？

雖然你可以設計讓 Agent 去尋找替代路徑，但在很多關鍵維運情境下，Agent 已經判斷「這件事非做不可」，人類卻說不行。這時最合理的做法不是回報失敗，也不是假裝完成，而是把執行狀態（run status）標記為 `escalated`（已升級）。

狀態設為 `escalated` 的意義在於：Agent 沒有出錯，也沒有完成目標，而是它確認需要執行該動作但遭到人類阻擋，超出它的自主決策邊界，因此只能把問題拋回給工程師處理。

<!--image:1-->

## 執行前重驗 world version

如果人類批准了，Agent 不能直接跳去執行動作。在工作流程中，執行前必須再呼叫一次狀態檢查，比對當前環境的 `world.version` 與工作流程啟動時的 `expectedVersion` 是否一致：

<!--image:2-->

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L171-L185 -->

```typescript
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
```

這段邏輯處理了兩個關鍵分支：

1. **未獲批准**：如果 `proposal.status` 不是 `approved`，立刻執行步驟將 run 狀態設為 `escalated` 並退出流程。
2. **重驗版本**：獲准後，先以 `recheck-approved-state` 取得最新的 `fresh` 狀態。一旦 `fresh.world.version` 不等於最初的 `input.expectedVersion`，表示狀態在等待批准期間已經變更。此時立即將該筆提議標記為過期，並透過 `continue` 回到迴圈頂端，讓 Agent 依據最新狀態重新思考下一步。

## 用 staleProposal 清理過期提議

當狀態發生改變、原本的提議不再適用時，這筆提議不能繼續以「待審批」或「已批准」的形式留在系統中。資料庫操作需要將該筆記錄更新為 `stale`：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L228-L288 -->

```typescript
export async function decideProposal(
  proposalId: string,
  status: 'approved' | 'rejected',
  reason?: string,
) {
  const proposal = await getProposal(proposalId)
  if (proposal.status !== 'pending') return proposal
  const run = await getRun(proposal.runId)
  if (['completed', 'cancelled', 'failed', 'escalated', 'superseded'].includes(run.status)) {
    const [stale] = await db
      .update(approvals)
      .set({ status: 'stale', reason: 'Incident is no longer active', decidedAt: new Date() })
      .where(eq(approvals.id, proposalId))
      .returning()
    return stale
  }
  if (proposal.action === 'request_help' && status === 'approved' && !reason?.trim()) {
    throw new Error('An answer is required before the agent can continue')
  }
  const [updated] = await db
    .update(approvals)
    .set({ status, reason, decidedAt: new Date() })
    .where(and(eq(approvals.id, proposalId), eq(approvals.status, 'pending')))
    .returning()
  if (!updated) return getProposal(proposalId)
  await logAgentActivity(
    proposal.environmentId,
    proposal.runId,
    'human',
    proposal.action === 'request_help'
      ? status === 'approved'
        ? 'Human answered help request'
        : 'Human could not help'
      : `${proposal.action.replaceAll('_', ' ')} ${status}`,
    { proposalId, reason },
  )
  try {
    await inngest.send({
      name: 'agent/approval.decided',
      data: { proposalId, environmentId: proposal.environmentId, runId: proposal.runId },
    })
  } catch (error) {
    console.warn('Approval saved; wake event failed and the run will reconcile on timeout', error)
  }
  return updated
}

export async function staleProposal(proposalId: string) {
  const proposal = await getProposal(proposalId)
  await db
    .update(approvals)
    .set({ status: 'stale', reason: 'State changed before this action ran', decidedAt: new Date() })
    .where(eq(approvals.id, proposalId))
  await logAgentActivity(
    proposal.environmentId,
    proposal.runId,
    'human',
    'Approved action became stale',
    { proposalId },
  )
}
```

在 `staleProposal` 函式中，提議的狀態會被設為 `stale`，並註記原因為「State changed before this action ran」（動作執行前狀態已變更）。同時，寫入一筆活動日誌記錄該動作已過期。

在被動機制下，這個檢查發生在人類批准後的執行瞬間；若想更進一步，也可以建立主動清理機制：只要環境發生任何狀態變更，就主動掃描所有待處理的提議，將不再有效的項目標記為 `stale` 並移出收件匣（inbox），確保操作員在畫面上只會看到當前版本真正能執行的操作。

<!--image:3-->
