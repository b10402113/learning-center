# 把整個迴圈的 checkpoint 換成具名 step，並保留唯一的 cycle 後綴

如果把 Agent 的整個執行迴圈包在單一的 `step.run` 裡，只要 Node.js 行程在執行途中中斷或重啟，工作流程就沒有中途存下的檢查點。Agent 即使已經讀取日誌、呼叫模型甚至觸發了系統變更，重試時仍必須從迴圈的第一步整段重來。

耐用執行（Durable Execution）的機制並不是凍結並還原記憶體中的呼叫堆疊（call stack），而是在工作流程被喚醒或重試時，重新執行整段函式程式碼。當引擎遇到已執行過的 `step.run` 時，會直接跳過回呼函式（callback），傳回上次持久化儲存的結果；直到遇到第一個未完成的步驟，才真正繼續運作。

因此，更好的架構是把迴圈從單一 step 抽出來，放到工作流程的頂層，再將每一輪中的關鍵動作切成具名的 step。

### 決定哪些操作該被快取

把迴圈拉到工作流程層級時，必須區分哪些邏輯需要檢查點（checkpoint），哪些邏輯每次重跑都必須取得最新狀態：

<!--image:1-->

1. **工作流程的主迴圈必須具備決定性（Deterministic）**：
   在工作流程層級撰寫迴圈是安全的，前提是迴圈條件具備確定性，例如使用固定的次數上限（如 1 到 24 輪），而不能依賴像隨機數這類不確定的條件。

2. **每輪迴圈頂部的狀態檢查不放進 step**：
   在每一輪開始時查詢目前的執行個體（run），並檢查狀態是否已變成完成（completed）、失敗（failed）或取消（cancelled）。這項查詢不該放進 `step.run`，因為我們不希望它的結果被快取（memoized）。如果快取了狀態，當外部事件或 Agent 前一輪的動作已將狀態標註為結束時，工作流程就無法即時感知並中斷退出。

3. **環境觀察與動作執行放進具名 step**：
   每一輪觀察到的系統狀態（state）是昂貴且具時效性的操作，需要被快取保存。只要該步驟成功完成，後續如果發生重試，就不必重新向外部環境拉取該輪的狀態。

### 加入 cycle 後綴確保步驟識別碼唯一

如果每一輪迴圈都使用相同的步驟名稱（例如單純叫做 `observe-state`），在重播（replay）與持久化記錄中就會發生衝突，引擎無法辨認這個結果到底屬於哪一輪。

<!--image:2-->

解決方式是在步驟名稱加上迴圈計數器的後綴，例如 `observe-state-${cycle}`。

<!-- source: sources/background-agent/20261105/server/agent-workflow.ts#L72-L85 -->

```typescript
  async ({ event, step }) => {
    const { environmentId, runId, instanceId } = event.data
    const run = await getRun(runId)
    if (
      run.instanceId !== instanceId ||
      ['completed', 'failed', 'cancelled', 'escalated', 'superseded'].includes(run.status)
    )
      return

    for (let cycle = 1; cycle <= 24; cycle++) {
      const current = await getRun(runId)
      if (['completed', 'failed', 'cancelled', 'escalated', 'superseded'].includes(current.status))
        return
      const state = await step.run(`observe-state-${cycle}`, () => agentState(environmentId, runId))
```

`observe-state-3` 保存的是 Agent 在第 3 輪當下看到的環境切片。因為外部系統隨時在改變，第 3 輪的狀態不等於第 4 輪的現況，為每一輪建立獨立且具名的觀察步驟，既保留了每一輪的執行軌跡，也確保重播時能精準對回對應輪次的檢查點。
