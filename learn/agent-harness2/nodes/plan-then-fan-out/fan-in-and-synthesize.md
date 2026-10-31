# Fan-in：收下成功的，合成一封回覆

現在的 `settled` 陣列裡，既有成功完成的 promise，也有被拒絕的 promise。Fan-in 步驟就是把它們分開處理。

Fan-in 的工作很單純：收集成功結果、記錄失敗原因，然後繼續往下執行。在這裡，部分失敗不是例外狀況，而是流程原本就設計要處理的情況。

<!--image:1-->

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L91-L111 -->
```ts
  // FAN-IN — collect successes, record failures, and keep going (degrade).
  const findings: { agent: string; findings: string }[] = [];
  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    const step = plan.steps[i];
    if (result.status === "fulfilled") {
      findings.push(result.value);
    } else {
      await DBOS.runStep(
        () =>
          emit({
            type: EventType.SubagentFailed,
            workflowId,
            stepId: step.id,
            agent: step.agent,
            error: String(result.reason),
          }),
        { name: `subagent-failed-${step.id}` },
      );
    }
  }
```

這個迴圈會依照步驟順序走訪 `settled` 陣列。如果某個項目的狀態是 `fulfilled`，就把它的調查結果加入清單；如果狀態是 `rejected`，就會在某個步驟中送出 `SubagentFailed` 事件，內容包含步驟 ID、代理，以及轉成字串的失敗原因。

工作流程不會因此中止，而是先記錄失敗，再繼續處理後續項目。這正是 `CHAOS_FAIL` hook 想示範的優雅降級：即使部分代理失敗，整體流程仍能繼續。

<!--image:2-->

接著就要進行整合。工作流程會執行一次 `synthesize`，把任務內容和收集到的調查結果交給它，產生最終回覆。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L113-L128 -->
```ts
  // SYNTHESIZE.
  const reply = await DBOS.runStep(() => synthesize(task, findings), { name: "synthesize" });
  await DBOS.runStep(
    () => emit({ type: EventType.ModelCompleted, workflowId, text: reply }),
    { name: "synth" },
  );
  await DBOS.runStep(
    () => emit({ type: EventType.WorkflowCompleted, workflowId, output: reply }),
    { name: "completed" },
  );
  return reply;
}

export const runSupervisorWorkflow = DBOS.registerWorkflow(supervisorWorkflow, {
  name: "supervisorWorkflow",
});
```

`synthesize` 會撰寫主管代理的最終答案：它讀取任務與調查結果，整理成一封回覆給使用者。接著，工作流程送出 `ModelCompleted` 和 `WorkflowCompleted` 事件，回傳這封回覆，然後結束。

<!--image:3-->

最後一行會以 `supervisorWorkflow` 這個名稱，向 DBOS 註冊 `supervisorWorkflow`。這讓它和主要代理工作流程一樣，能夠被啟動，也能在中斷後復原。

要把它接進伺服器，需要修改兩個地方。先在 server index 匯入 `runSupervisorWorkflow`，接著在處理器中檢查訊息模式：如果模式是 `supervised`，就執行主管工作流程；否則，執行預設的代理工作流程。

因此，使用者按下 supervised 按鈕後，整套「先規劃、再執行」的流程就會啟動。以下是一個實際升級案件的執行方式：客戶的一則訊息同時提出三個問題——重複扣款、Safari 上無法使用的匯出按鈕，以及 50 個座位的定價詢問。

主管代理會先進行規劃。它回傳一個包含 `steps` 陣列的物件：帳務代理負責重複扣款，技術代理負責匯出功能的錯誤，業務代理則處理 50 個座位的定價問題。

接著，三個子代理同時啟動，三個都完成工作，最後由模型產生回覆。帳務調查員找出重複扣款，並建議退款；技術代理搜尋知識庫後，找到 Safari 匯出功能的錯誤報告，而且這個問題之前已經被回報過兩次；業務代理則提供 50 個座位的定價資訊。

主管代理會把所有結果整理成一封回覆：「您好，謝謝您的來信。我已經逐一確認您提出的問題，以下是目前的處理結果。」它能回答客戶提出的每一件事，是因為它只調查訊息中實際涉及的領域。

這就是完整的監督流程：先規劃一次，再平行分派，接著收集仍然成功的結果，最後合成一封回覆。主管代理從頭到尾都掌握控制權；這和 handoff 不同，handoff 會把控制權交給另一個代理。

部分失敗時，流程會優雅降級，而不是整個執行工作崩潰。這正是 `allSettled`、fan-in 迴圈，以及唯讀調查代理存在的理由。只要少了其中任何一項，一個失效的子代理就可能讓整封回覆一起失敗。
