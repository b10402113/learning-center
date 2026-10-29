# 所有 sub-agent 在同一個 step 裡平行跑

三位調查員已經準備好了。上一個步驟留下的問題，現在有了明確答案：把他們一次全部執行。

每個 sub-agent 都會平行派送，並擁有各自的 context window。這也是我們讓 AI SDK 負責執行調查員的原因：三個調查員的工作，會合併在同一個 step 裡完成。

<!--image:1-->

讓它們共用同一個 step，關鍵在於執行時機。我們不希望先讓一名調查員獨自執行，接著才執行下一名；而是希望三者同時開始。這樣一來，如果這個 step 需要重試，三個調查員也會一起重試。這是最佳做法嗎？不一定，但這就是目前的設計。

如果要同時執行多個 promise，並收集所有結果而不在中途拋出錯誤，可以使用 `Promise.allSettled`。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/supervisor.ts#L64-L89 -->
```ts
  // DISPATCH — every sub-agent runs in parallel, each in its own context window.
  const settled = await Promise.allSettled(
    plan.steps.map((s) =>
      DBOS.runStep(
        async () => {
          await emit({
            type: EventType.SubagentStarted,
            workflowId,
            stepId: s.id,
            agent: s.agent,
            objective: s.objective,
          });
          const findings = await runInvestigator(s.agent, s.objective);
          await emit({
            type: EventType.SubagentCompleted,
            workflowId,
            stepId: s.id,
            agent: s.agent,
            findings,
          });
          return { agent: s.agent, findings };
        },
        { name: `subagent-${s.id}` },
      ),
    ),
  );
```

`allSettled` 會包住 `plan.steps.map`。它會為計畫中的每個步驟啟動一個 DBOS step，名稱格式是 `subagent-<id>`。在這個 step 裡，會依序做三件事。

第一，透過 emit 通知訂閱者某個 sub-agent 已經開始執行，並附上 workflow id、step id、agent 和目標。第二，step 會等待 `runInvestigator` 完成，取得調查結果。第三，再透過另一個 emit 發出通知，表示 sub-agent 已經完成，並帶回這些結果。

接著，step 會回傳 `{ agent, findings }`，這就是 `allSettled` 最後交回的內容。

為什麼使用 `allSettled`，而不是 `Promise.all`？因為 `allSettled` 會等待每個 promise 完成，不論結果是成功或失敗，最後再逐一回傳，並標示各自的狀態。相較之下，`Promise.all` 只要遇到第一個失敗就會拋出錯誤，其他工作也可能因此受到影響。

<!--image:2-->

這個選擇會影響下一個步驟。即使其中一名調查員當機，其他調查員仍然可以完成工作。整個平行派送流程不會因為其中一條分支失敗，就像骨牌一樣全部倒下。

因此，`settled` 是一份清單，其中每個項目可能是成功完成並附上調查結果，也可能是失敗並附上錯誤原因。部分分支或許已經失敗，接下來要處理的問題就是：如何面對這包混合結果——保留成功的內容、記錄失敗的原因，然後繼續執行。

<!--image:3-->
