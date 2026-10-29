# 用 token 預算，以 turn 為單位壓縮

上一個步驟留下了一個缺口。`buildContext` 需要摘要和最近幾個回合的清單，卻沒有任何程式產生它們。這一步會補上缺少的部分。

有兩個地方負責這件事：`summarize` 函式會把較早的回合整理成文字；agent 迴圈開頭的檢查則會判斷何時該呼叫它。

## 在呼叫模型前先檢查

agent 迴圈會持續執行 `while`，每次執行一個模型回合，也讓歷史紀錄越來越長。

歷史紀錄太長時，模型回合就會出問題。送出超過預算的請求，provider 就會拒絕。因此，檢查要放在呼叫模型之前，而不是之後。

<!--image:1-->

迴圈會在各次執行之間保留兩個變數。`turns` 是由多個陣列組成的近期回合紀錄；`summary` 則存放持續更新的摘要文字，初始值是空字串。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L97-L135 -->
```ts
  let currentAgent = triageAgent;
  const turns: ModelMessage[][] = [];
  let summary = "";

  let step = 0;
  while (step < MAX_STEPS) {
    // 1. Compact old turns once the window is over budget.
    if (estimateTokens(turns.flat()) > MAX_CONTEXT_TOKENS) {
      const old: ModelMessage[][] = [];
      while (turns.length > 1 && estimateTokens(turns.flat()) > KEEP_CONTEXT_TOKENS) {
        const oldest = turns.shift();
        if (oldest) old.push(oldest);
      }
      if (old.length > 0) {
        summary = await DBOS.runStep(() => summarize(old, summary), { name: `summarize-${step}` });
        const contextTokens = estimateTokens(
          buildContext(currentAgent.systemPrompt, input, summary, turns),
        );
        await DBOS.runStep(
          () =>
            emit({
              type: EventType.MemoryCompacted,
              workflowId,
              summarizedTurns: old.length,
              contextTokens,
              summary,
            }),
          { name: `compacted-${step}` },
        );
      }
    }

    // 2 + 3. Hydrate the CURRENT agent's context and run one turn over it.
    const context = buildContext(currentAgent.systemPrompt, input, summary, turns);
```

這段程式的第一步是壓縮，而且每次迴圈都會執行。第二、三步則是重建上下文，再呼叫模型。

## 兩個門檻，一個滑動視窗

這個迴圈由兩個數字控制，但它們的用途不同。`MAX_CONTEXT_TOKENS` 是觸發門檻，數值為 3000；`KEEP_CONTEXT_TOKENS` 是目標值，數值為 1500。

<!--image:2-->

外層的 `if` 只確認一件事：目前是否超過觸發門檻？內層的 `while` 則會逐一移除最舊的回合，直到 token 數降到目標值以下。

這兩個數字刻意設得很小。即使是簡短任務，也會很快碰到門檻，讓你能直接看到壓縮流程，而不只是讀到它的說明。

`turns.length > 1` 這個條件很重要。壓縮時至少會保留一個回合，因此模型不會收到空的歷史紀錄。

## 移除整個回合，不拆單則訊息

`turns.shift()` 移除的是一整個回合，不是單一訊息。

回合才是適合切分的單位，因為不能隨便從訊息中間切開。若剛好切在工具呼叫和工具結果之間，模型收到的請求就會缺少必要資訊，無法回答。

<!--image:3-->

因此，每個回合都會完整儲存：使用者輸入、工具呼叫，以及回覆訊息。迴圈會把整個回合一起放進去。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/runtime.ts#L213-L214 -->
```ts
    turns.push(turnMessages);
    step++;
```

以回合為單位切分，也能讓程式保持精簡。若改成逐則訊息處理，就得加入一堆角色檢查，避免留下不完整的對話尾段。

## summarize 是一通有不同任務的 LLM 呼叫

摘要器不是 agent。它有自己的 system prompt 和目標，因為它要整理工作紀錄，而不是回覆使用者。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/memory.ts#L46-L74 -->
```ts
// Compress old turns into the running summary. This is an LLM call, so in the
// runtime it's wrapped in a DBOS step — the summary is checkpointed and a crash
// won't re-summarize.
export async function summarize(
  oldTurns: ModelMessage[][],
  priorSummary: string,
): Promise<string> {
  const transcript = oldTurns
    .flat()
    .map((m) => `${m.role}: ${typeof m.content === "string" ? m.content : JSON.stringify(m.content)}`)
    .join("\n")
    .slice(0, 6000);

  const { text } = await generateText({
    model,
    messages: [
      {
        role: "system",
        content:
          "You compress an agent's work log into a short running summary. Preserve concrete facts: item ids, categories, draft ids, amounts, and what was already sent. Be terse.",
      },
      {
        role: "user",
        content: `Prior summary:\n${priorSummary || "(none)"}\n\nFold in this newer work:\n${transcript}\n\nReturn the updated summary.`,
      },
    ],
  });
  return text;
}
```

有三個細節是關鍵。首先，較早的回合會整理成 `role: content` 格式的文字行，並截短至 6000 個字元。其次，先前的摘要也會一併納入，讓新摘要成為「摘要的摘要」。最後，system prompt 會明確列出必須保留的資訊：id、類別、金額，以及已經送出的內容。

`messages` 陣列最後一則訊息必須是 `user`。如果沒有這則訊息，模型就沒有要回覆的請求，也不會產生有用的內容。

這裡呼叫的是 `generateText`，而不是 `streamText`。沒有人需要一邊看摘要一邊等它生成；迴圈必須先拿到完整字串才能繼續，因此會等它完成。

## 用 DBOS step 包住 LLM 呼叫

摘要來自一通需要付費、結果也不固定的呼叫。如果工作流程中途當掉後重新執行，就不希望為同一份摘要付兩次錢。

<!--image:4-->

`DBOS.runStep(() => summarize(old, summary), { name: `summarize-${step}` })` 會替結果建立檢查點。重新執行時，檢查點會直接提供先前的摘要，不必再次呼叫模型。

`MemoryCompacted` 事件也會放在獨立的 step 中，名稱是 `compacted-${step}`。事件內容有四個欄位：workflow id、納入摘要的回合數、壓縮後的上下文 token 數，以及摘要本身。

<!-- source: sources/agent-harness2/20261029/harness-engineering/shared/events.ts#L24-L25 -->
```ts
  // memory: old turns compacted into a running summary
  MemoryCompacted = "memory.compacted",
```

<!-- source: sources/agent-harness2/20261029/harness-engineering/shared/events.ts#L49-L49 -->
```ts
  | { type: EventType.MemoryCompacted; workflowId: string; summarizedTurns: number; contextTokens: number; summary: string }
```

發出這個事件，不只是為了機器，也有助於人員追蹤。壓縮代表模型剛剛忘掉一段對話。紀錄會標明壓縮發生的時間，以及這次壓縮花了多少成本。

## 用新摘要重建上下文，再執行回合

完成壓縮後，迴圈會重新建立上下文。呼叫方式是 `buildContext(currentAgent.systemPrompt, input, summary, turns)`，也就是同時傳入最新摘要和保留下來的回合。

模型回合要收到的是 `context`，而不是原始訊息陣列。原始陣列裡沒有摘要，若直接傳入，就等於丟掉剛才整理好的內容。

如果這一輪沒有執行壓縮，其他流程不會改變。`buildContext` 仍會執行，`summary` 也維持原值，送出的請求仍是一般歷史紀錄。

現在，事件已經寫進紀錄，但你還沒查看它。下一步會清除紀錄、重新執行任務，再從紀錄中讀出 `MemoryCompacted`。
