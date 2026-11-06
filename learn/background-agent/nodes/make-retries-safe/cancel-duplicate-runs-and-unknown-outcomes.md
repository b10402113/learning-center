# 取消不是補償

版本防線擋住了過期寫入，最後要處理的是重複的 run 與無法確認的外部結果。當你在後台按下一鍵「取消」某個正在運行的任務時，系統到底做了什麼？

許多人直覺以為取消就像按了復原鍵，所有做過的事都會退回原點。但在非同步工作流程與背景代理人（Agent）架構中，取消與補償是完全不同的兩件事。取消只能阻止未來尚未發生的步驟，無法抹去已經生效的操作。

### 用 cancelOn 阻斷重複執行

如果一個任務因為重試、操作員重複觸發或系統重啟，導致兩個工作流程帶著相同的 `runId` 同時運作，災難很快就會發生。這就像兩個人共用一份線上文件，把游標放在同一個位置同時打字，最後只會留下一團錯亂的文字。多個實例同時讀寫相同狀態，會引發嚴重的競爭條件（race condition）。

<!--image:1-->

要阻止同一個執行實體（run）繼續往下跑，最直接的方式是在取消時發出事件，並在流程定義中設定比對規則：

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L57-L61 -->

```typescript
export async function cancelRun(runId: string) {
  const run = await setRun(runId, 'cancelled', 'Cancelled by operator')
  await inngest.send({ name: 'agent/run.cancelled', data: { runId } })
  return run
}
```

當操作員決定中止某個執行時，系統會先更新本機狀態，接著對調度系統發出帶有 `runId` 的取消事件。

在接收工作流程端，則透過 `cancelOn` 指定要監聽的取消事件與比對欄位：

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L58-L71 -->

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
```

只要調度系統收到相符的 `runId`，就會在步驟之間（between-step）終止該次執行，阻止排在後面的步驟啟動。

### 取消只能阻止未來，不能抹去過去

`cancelOn` 的有效範圍僅限於「尚未執行的步驟」。

如果某個步驟已經向第三方金流扣了款，或是已經發出通知信，取消事件並不會讓那些已經送出的請求憑空消失。已經交付（committed）的變更依然對外界可見。

<!--image:2-->

若想把已經發生的影響倒扣回去，你需要的是「補償」（compensation）——例如建立操作帳本（effect ledger）記錄每一次成功發出的副作用，並在流程失敗或被取消時，啟動明確的補償工作流程（例如退款或發送撤回通知）。

### 無法確認的外部結果：保存待核對狀態

比「已成功」和「已取消」更棘手的，是呼叫外部服務時發生超時（timeout）。

如果本機服務存活，相同 ID 通常能可靠判斷是否處理過；但外部服務可能沒有支援冪等鍵（idempotency key），也不提供事後狀態查詢介面。當請求超時，你無法確認這筆操作究竟是根本沒送達，還是早已在對方系統裡完成、只是回傳逾時。

這時最危險的動作，就是讓代理人自行猜測並盲目重試，或者貿然發動補償流程。如果上一筆交易其實成功了，重試會造成重複扣款；如果上一筆其實失敗了，直接退款則會造成虧損。再完美的提示詞（prompt），也無法無中生有生出系統根本沒有收到的客觀證據。

面對這種情況，系統必須具備將狀態標記為「未知結果（unknown outcome）」並持久化保存的能力：

<!--image:3-->

1. 記錄這次呼叫處於不確定狀態，阻止代理人自動重試或執行補償。
2. 將任務轉入待核對佇列。
3. 透過批次對帳查詢（reconciliation query），或等待人工排查釐清外部系統的真實狀態。

只有在證據明確建立之後，系統才能安全地決定是該推進流程，還是著手清理現場。
