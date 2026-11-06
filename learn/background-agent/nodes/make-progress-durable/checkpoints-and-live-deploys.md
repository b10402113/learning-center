# 兩個時鐘，兩個儲存位置

處理完重播與重試的安全問題，最後要釐清的是進度究竟被保存在哪裡。當你在開發會長時間運行的背景 Agent 時，常常會遇到一個讓人困惑的問題：當程式跑到一半當機或需要重啟時，我們到底該去哪裡找回「目前的進度」？

答案通常分成兩個完全不同的儲存位置，因為它們各自回答完全不同的問題。

<!--image:1-->

### 業務狀態與檢查點

第一個問題是：「**現在的事實是什麼？**」（What is true now?）

這個答案必須由我們自己的資料庫來保存，例如 PostgreSQL。在電商或維運場景中，這包括結帳流程目前的真實狀態、發生的事件記錄、等待人工審批的單據，以及顯示在儀表板上的執行狀態。

<!-- source: sources/background-agent/20261105/server/agent-data.ts#L10-L43 -->

```typescript
export async function getRun(runId: string) {
  const [run] = await db.select().from(runs).where(eq(runs.id, runId)).limit(1)
  if (!run) throw new Error('Agent run not found')
  return run
}

export async function setRun(
  runId: string,
  status: string,
  waitReason: string | null = null,
  report?: string,
) {
  const run = await getRun(runId)
  if (['completed', 'cancelled', 'failed', 'escalated', 'superseded'].includes(run.status))
    return run
  const [updated] = await db
    .update(runs)
    .set({ status, waitReason, report: report ?? run.report, updatedAt: new Date() })
    .where(eq(runs.id, runId))
    .returning()
  const phase = ['completed', 'cancelled', 'failed', 'escalated', 'superseded'].includes(status)
    ? 'terminal'
    : status === 'waiting'
      ? 'pause'
      : status.startsWith('needs_')
        ? 'human'
        : 'resume'
  if (status !== run.status || status === 'waiting') {
    await logAgentActivity(run.environmentId, runId, phase, `Run ${status.replaceAll('_', ' ')}`, {
      waitReason,
    })
  }
  return updated
}
```

這段程式碼處理的就是業務狀態。我們將 Agent 的運行狀態、等待原因與報表記錄在資料庫中，讓團隊與使用者能在畫面上即時掌握進度。

第二個問題則是：「**這次執行已經做過什麼？**」（What did this run already do?）

這不是業務狀態，而是工作流狀態（Workflow state）。現代持久執行（Durable Execution）平台（例如 Inngest）會自動為你接管這部分。在工作流中，每當一個步驟（step）執行完成，平台就會自動替這個步驟存下一份檢查點（checkpoint）與回傳值。

你不需要自己在資料庫裡開一張資料表記錄「步驟 1 完成了、步驟 2 成功了」。當系統中斷重啟時，平台會根據這些檢查點自動跳過已經完成的步驟，直接從尚未完成的地方繼續恢復執行。

### 為什麼這兩件事必須分開？

一個常見的誤解是：既然平台幫我記錄了每個步驟的結果，那我不就能把平台的檢查點當作真實世界的狀態嗎？

不行，因為真實世界是會變動的。

如果在第 3 輪循環中，步驟 `observe-state-3` 記錄到庫存不足，那僅僅代表「Agent 在第 3 輪觀察時看到庫存不足」，絕對不代表「到了第 4 輪世界依然如此」。我們之所以在每一輪迴圈都要建立新的觀察步驟，正是因為外在系統隨時可能改變。

<!--image:2-->

這也帶來了步驟劃分的取捨：
* 如果把整個複雜迴圈包成單一一個步驟，一旦中間失敗，平台就只能全部重跑，抹煞前面的部分進展。
* 如果把每一行微小的純運算都拆成獨立步驟，又會讓執行紀錄充斥雜訊，徒增平台的歷史負擔。

最合適的做法，是只為那些「當機重啟後需要保留結果」的呼叫建立檢查點：例如讀取外部狀態、做出關鍵決策、執行外部操作（side effect）以及寫入狀態報告。

### 長跑工作流遇上新版部署的代價

當 Agent 需要長時間執行，甚至可能休眠幾天等待人工審核時，另一個難題就出現了：**如果在舊的工作流還在跑的時候，你部署了新版程式碼，會發生什麼事？**

這就像資料庫結構遷移（migration）一樣。如果你修改了步驟，舊的執行實例醒來時可能會發現結構對不上：

<!--image:3-->

1. **Step ID 與記憶化（Memoization）**：平台通常依靠步驟 ID 來比對先前儲存的檢查點。如果新程式碼沿用了舊 ID，醒來的舊執行就會直接使用舊的快取結果；但如果你改了步驟名稱或 ID，原本執行過的步驟可能會被視為全新步驟，導致呼叫外部模型或發送通知等副作用被「重新執行」一次。
2. **多版本平行運作**：成熟的工作流平台通常支援版本管理。這意味著新觸發的任務會走新版程式碼，而已經在跑的長任務則繼續由舊版邏輯跑完，隨著舊任務結束逐漸淘汰。
3. **終止或遷移的抉擇**：如果舊工作流的任務不是生死攸關，你可以選擇手動終止舊版任務；但如果任務不可中斷，你就必須在改動步驟名稱與邏輯之前，仔細盤點那些正在沉睡中的執行實例，確認它們在醒來時不會重跑危險的操作。

理解這兩個儲存位置的分工，你就能把精力集中在真正屬於業務邏輯的狀態設計上，同時在系統迭代部署時，避開長跑工作流常見的重放風險。
