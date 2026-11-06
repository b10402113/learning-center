# 等待一個綁定 proposal.id 的決定

提案寫進資料庫、只留下 id 之後，接著要等一個精準綁定這筆提案的決定。當背景 Agent 執行到需要人工審核（Human-in-the-Loop）的步驟時，工作流程必須停下來等待人類做出選擇。然而，等待外部事件不能只是「等任何一個審核動作發生」；如果沒有精確鎖定目標，系統中任何一筆無關的審核決定，都可能誤將所有等待中的任務一併喚醒並繼續執行。

要讓等待流程安全且可靠，必須做好三件事：透過條件過濾將事件綁定至特定的提案識別碼、喚醒後回資料庫重新讀取真實狀態，以及設定逾時機制來補救可能漏接的通知。

### 綁定 proposal.id 的等待事件

在等待人類審核時，我們通常會發送一個自訂事件（例如 `agent/approval.decided`）。如果工作流程直接監聽這個事件名稱，只要系統中有任何審核者按下同意或拒絕，該事件就會觸發所有處於等待狀態的流程。

<!--image:1-->

因此，在呼叫 `step.waitForEvent` 時，必須在過濾條件中比對事件資料內的 `proposalId`，確保只有針對目前提案所發出的事件才能喚醒當前的工作流程。

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L158-L170 -->

```typescript
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
```

在這段流程中，`if: async.data.proposalId == "${proposalId}"` 就是關鍵的過濾條件。它確保只有帶有相同 `proposalId` 的決策事件才能通過。如果沒有這層過濾，系統裡只要有一筆任務通過審核，所有等待中的任務都會被同時放行。

### 醒來後從資料庫重新讀取狀態

當等待結束、流程重新被喚醒時，程式碼並沒有直接從事件內容中讀取審核結果，而是重新呼叫了 `step.run` 執行 `getProposal` 從資料庫拉取最新紀錄。

事件本質上只是一個「喚醒鬧鐘」，通知工作流程外部狀態已經更新，但資料庫才是唯一的真實來源（Single Source of Truth）。通知可能會比資料寫入更早或更晚到達，甚至在等待期間提案可能已經過期。

<!--image:2-->

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L214-L226 -->

```typescript
export async function getProposal(proposalId: string) {
  const [proposal] = await db.select().from(approvals).where(eq(approvals.id, proposalId)).limit(1)
  if (!proposal) throw new Error('Approval request not found')
  if (proposal.status === 'pending' && proposal.expiresAt.getTime() < Date.now()) {
    const [expired] = await db
      .update(approvals)
      .set({ status: 'expired', decidedAt: new Date() })
      .where(eq(approvals.id, proposalId))
      .returning()
    return expired
  }
  return proposal
}
```

在 `getProposal` 的實作中，如果提案仍處於 `pending` 且已經超過有效期限（`expiresAt`），系統會立即將狀態更新為 `expired` 並寫入決定時間。因此，工作流程醒來後重新查詢資料庫，能同時處理正常審核通過、拒絕，以及提案逾時的狀態變化。

### 利用逾時機制補救漏接的事件

在分散式系統中，網路抖動或服務異常可能導致決策已經寫入資料庫，但喚醒事件卻發送失敗。

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L264-L271 -->

```typescript
  try {
    await inngest.send({
      name: 'agent/approval.decided',
      data: { proposalId, environmentId: proposal.environmentId, runId: proposal.runId },
    })
  } catch (error) {
    console.warn('Approval saved; wake event failed and the run will reconcile on timeout', error)
  }
```

在記錄審核結果時，發送 `inngest.send` 的區塊被包在 `try...catch` 中。一旦發送喚醒事件失敗，系統只會印出警告，而不會中斷整個儲存操作。

這正是 `waitForEvent` 設定 `timeout: '10s'` 的用意。即使外部事件遺失，只要等待達到設定的逾時期限，工作流程依然會醒來，並在 `while (proposal.status === 'pending')` 的迴圈中再次呼叫 `getProposal` 檢查資料庫。若此時資料庫已經更新為決定狀態，迴圈就會自然結束並繼續往下執行；若仍未決定，則進入下一個週期的等待。這種結合短逾時與資料庫狀態對齊（Reconciliation）的設計，能讓工作流程具備自我修復的能力。

<!--image:3-->
