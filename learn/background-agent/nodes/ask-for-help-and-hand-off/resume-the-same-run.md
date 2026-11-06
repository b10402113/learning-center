# 同一條 run 繼續

問題送進 inbox、流程停在 `needs_help` 之後，關鍵是回答進來時要喚醒哪一條 run。當背景執行的 Agent 遇到無法獨自決策的狀況時，向人類發出求助請求是很常見的設計。但在收到人類的回覆之後，系統該如何接續執行？許多開發者直覺會考慮為這個回覆另開分支，或者啟動一個全新的 run，但這往往會讓狀態追蹤與上下文同步變得複雜。

最乾淨的做法，是讓原本暫停的同一個 run 直接喚醒，並透過迴圈的 `continue` 回到起點，帶著新取得的資訊從頭重新觀察。

### 共用喚醒事件，恢復同一個執行流程

當人類在收件匣（Inbox）看到求助請求並送出回答時，後端會將回答寫入資料庫，並觸發喚醒事件。無論是一般的動作審核（approval）還是求助（request help），都可以共用同一套喚醒機制：

<!--image:1-->

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L244-L273 -->

```typescript
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
```

這段邏輯確保了在回答未填寫時無法通過，並在資料庫更新後發送 `agent/approval.decided` 事件。這個事件帶有原本的 `runId`，讓背景工作流程能夠準確喚醒暫停中的同一個 run，而不是另外啟動新任務。

### 為什麼求助只需要 `continue`？

當工作流程收到喚醒事件後，會檢查這項決策的性質。如果這是一般的危險動作審批，流程通常需要檢查環境版本是否有衝突；但如果這是一次求助，處理方式會單純許多：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L171-L184 -->

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

在工作流程的迴圈中，一旦判定 `policy === 'help'`，程式碼直接執行 `continue`。

這行 `continue` 的目的不是立刻去執行任何具體操作，而是強迫 Agent 跳回迴圈頂部「重新思考」。在系統設計中，負責讀取環境狀態的函式本身就會一併撈取資料庫中所有提問與最新回答。因此，當迴圈重新開始時，Agent 再次調用狀態讀取函式，眼前看到的狀態就已經包含人類剛才給出的答案。

<!--image:2-->

### 重新觀察，而非直接執行操作

這種設計等於是在背後「引導」（steer）Agent。人類回答完問題後，系統不該直接替 Agent 執行原本卡住的動作，而是讓 Agent 進行全新的觀察（fresh observation）。

舉例來說，在結帳服務降級的演練情境中，Agent 詢問人類後收到解答，但服務此時可能依然處於降級狀態。如果直接執行操作，系統依然會報錯；但若回到迴圈頂端重新觀察，Agent 發現服務仍未恢復，便能正確切入等待復原事件的邏輯，直到確認環境健康為止。

讓同一條 run 繼續執行，還能確保活動記錄（Activity feed）具有完整的因果脈絡。在同一個時間軸上，你可以依序看見提問、暫停、人類回答、喚醒以及最終產出報告的完整歷程，不必在多個 run 或分支之間拼湊事件順序。

<!--image:3-->
