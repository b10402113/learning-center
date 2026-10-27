# 把 tool call 與回填包成 step

上一節把 model turn 包進 step 了。你的 agent loop 現在會自己呼叫 model，也會收到一串 tool call；過去這些工作由 AI SDK 處理：執行工具，再把結果塞回訊息裡。

現在，你要把控制權拿回來。但這也代表每一步都會寫進資料庫。只要 step 包錯位置，重跑一次就可能出問題。

這一節會做三件事：

1. 自己執行 tool call  
2. 使用 `tool` role，把結果回填給 model  
3. 把流程中的 `emit` 一起包進 step  

## 沒有 step 的 emit 為什麼會出事

`emit` 就是「把一筆事件寫進 event log」的動作，而 event log 寫的是資料庫，不是暫存在記憶體裡的資料。

如果兩次 `emit` 直接放在 workflow 裡，中途發生錯誤、重新執行時，系統不會記得它們已經做過。重試一次就是多做一次，而且每次的結果都可能不一樣。

這就是 **不具冪等性（idempotent）**：做一次和做很多次，最後效果不同。

所以規則很簡單：`emit` 會寫資料庫，必須放進一個 step 裡。這就像寄通知信這種副作用，重試一次可能就多寄一封；除非你先記下「這封信已經寄過了」。

<!--image:1-->

## toolStep：兩次 emit 中間夾一次執行

`tool call` 要做的事，和 model turn 類似：

1. 開始前發出一個事件  
2. 真的執行工具  
3. 執行完成後，再發出一個事件  

把這段流程包成自己的 function，叫做 `toolStep`。它接收 `workflowID` 和那個 tool call，最後回傳工具的輸出。

所有參數都要帶上 `workflowID`，事件才知道自己屬於哪個 workflow。

<!-- derived -->
```ts
async function toolStep(
  workflowID: string,
  call: ToolCall,
): Promise<Record<string, unknown>> {
  // 開跑前：告訴大家這個 tool call 即將發生
  await emit({
    type: EventType.toolRequested,
    workflowID,
    toolCallID: call.toolCallID,
    name: call.toolName,
    arguments: call.inputs,
  });

  // 真的執行工具
  const output = await runTool(call.toolName, call.inputs);

  // 跑完：把結果寫回 event log
  await emit({
    type: EventType.toolCompleted,
    workflowID,
    toolCallID: call.toolCallID,
    results: output,
  });

  return output;
}
```

要特別注意 `toolCallID`。

每個 tool call 都有自己的 ID，事件帶著這個 ID，之後才能找到它對應的是哪一次呼叫。

`arguments` 記錄呼叫當下傳入的參數，`results` 記錄工具執行後的輸出。從開始到結束，整個過程都有紀錄。

<!--image:2-->

## 收尾的兩個 emit 也要關進 step

當 `turn.toolCalls.length` 等於 `0`，表示 model 說：「我做完了，沒有其他工作要交給你。」

這時要發出收尾事件。但 `emit` 會和資料庫互動，如果讓它直接漂在 workflow 裡，就不具冪等性。重跑一次，可能又會多發一遍。

做法是把每一個 `emit` 個別放進 `DBOS.runStep`。step 名稱則把編號放進去，這樣從名稱就能看出流程跑到哪裡：

<!-- derived -->
```ts
if (turn.toolCalls.length === 0) {
  await DBOS.runStep(() => emit(modelDoneEvent), {
    name: `model-done-${stepNumber}`,
  });
  await DBOS.runStep(() => emit(completedEvent), {
    name: `completed-${stepNumber}`,
  });
  return text;
}
```

這裡有兩個 step：一個叫 `model-done`，另一個叫 `completed`。兩者都會各自持久化。

如果流程中斷後重新執行，已經跑過的 step 就不會再次發出相同事件。

## 自己跑 tool call，關進 step

有 tool call 時，就由你自己執行，一個一個處理。

把整段 `toolStep` 放進 `DBOS.runStep`，step 名稱就用 `toolCallID`。這樣查看日誌時，可以立刻知道是哪一次工具呼叫：

<!-- derived -->
```ts
for (const call of turn.toolCalls) {
  const output = await DBOS.runStep(() => toolStep(workflowID, call), {
    name: `tool-${call.toolCallID}`,
  });

  // 回填結果給模型，見下一節
}
```

「關進 step」的意思是：這段程式會被記錄成一個持久化單位。

流程中斷後重新執行時，已經跑過的 step 不會重做；還沒跑過的 step 則會接著執行。

從這一刻開始，tool call 才算是 durable。整體邏輯和以前的 loop 一樣，只是現在每一步都會被保留下來，recovery 之後可以重新執行。

## 用 tool role 把結果交回去

工具執行完了，但 model 還不知道結果。

你要把工具輸出塞回 `messages`，下一個 turn 才能讓 model 讀到。這裡有一個固定規則：`role` 永遠是 `tool`。

它代表的是：「你叫我執行工具，我現在回來交作業了。」

<!-- derived -->
```ts
messages.push({
  role: 'tool',
  content: [
    {
      type: 'tool-result',
      toolCallID: call.toolCallID,
      toolName: call.toolName,
      output: { type: 'json', value: output },
    },
  ],
});
```

`toolCallID` 是用來配對的。

model 看到這個 ID，才知道這份結果是在回應哪一次工具呼叫。`toolName` 則把工具名稱帶回去。

`output` 是工具真正產生的結果。這裡 OpenAI 要求先包成 `{ type: 'json', value: output }`，再交回給 model。

<!--image:3-->

## 這一段買到什麼

這些工作以前都是 AI SDK 在做。現在把控制權拿回來，只有一個理由：這樣才能把每一步放進 step。

現在整個流程——呼叫工具、寫入事件、回填結果——都包在 step 裡，並持久化到 Postgres。

系統掛掉、recovery 之後，已經跑過的 step 不會再執行一次；還沒跑過的 step 則會接著跑。這才是你真正需要的 rerun。

該包的都包進 step 了。但重啟之後，是誰決定哪些 step 要跳過？下一節看 recovery 與註冊。
