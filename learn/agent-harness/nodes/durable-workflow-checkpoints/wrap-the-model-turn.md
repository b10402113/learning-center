# 把 modelTurn 包成 step

上一節說，重跑會出事的就包進 step。你的 `while` 迴圈裡最貴的那個是 `streamText`，它目前大概是這樣運作：

每繞一圈，就呼叫一次 `streamText`，看模型要不要使用工具。模型要求工具時，就執行工具，把結果放回 `messages`，再進入下一圈。

這個迴圈能正常執行，只是 `streamText` 沒有被標記成 step，這會燒錢。

這一節只做一件事：把「呼叫 LLM 一輪」抽成 `modelTurn`，再用 DBOS step 包住它。完成後，你就能改寫 `while` 迴圈，讓 workflow 重啟時，不必重新執行已經付過錢的 LLM 呼叫。

## 先看重啟之後發生什麼事

如果直接把 `streamText` 寫在 `while` 迴圈裡，它就不屬於任何 step。這種寫法在 workflow 重啟時，會讓整段迴圈重新執行。

問題其實很直接：這一輪 LLM 呼叫明明已經跑過，只是中途停止了，為什麼重啟後還要再跑一次？跑一次，就會支付一次 token；重跑幾次，就付幾次。

<!--image:1-->

DBOS 是一個 workflow 引擎，可以把一段段工作標記成 step。完成過的 step 會留下紀錄，workflow 重啟後就不會重做。

LLM 呼叫正是最需要保護的部分：重複執行，就等於重複扣費。

## 什麼是一個 turn

動手修改前，要先把執行單位切清楚。

一個 turn 的流程是：先呼叫 LLM。模型可能要求一次 tool call，也可能直接結束。如果模型要求 tool call，就先執行工具，再回到 LLM，讓它根據工具結果重新思考。

每需要做一次 tool call，就是一個 turn。

`while` 迴圈每繞一圈，就是一個 turn。把 turn 記進 event log，之後 workflow 接續執行時，才知道自己停在哪一輪，可以從那一輪繼續，不用從頭開始思考。

<!--image:2-->

## 抽出 modelTurn

要替 turn 加上 step，第一步是把原本放在 `while` 迴圈裡的那一大段程式，抽成獨立函式：`modelTurn`。

它接收 `workflowID` 與 `messages`，回傳一個 Promise。這個 Promise resolve 出來的，就是這一輪的 turn。

`ModelMessage` 是從 `ai` 套件匯入的型別，使用 `import type`。

<!-- derived -->

```ts
type ToolCall = {
  toolCallID: string;
  toolName: string;
  inputs: Record<string, unknown>;
};

type Turn = {
  text: string;
  toolCalls: ToolCall[];
  responseMessages: ModelMessage[];
};
```

這兩個 helper 型別，把資料結構說清楚：

- tool call 包含 ID、名稱與參數。
- turn 包含這一輪的最終結果、這一輪要求的 tool calls，以及要接回對話的 response messages。

<!-- derived -->

```ts
async function modelTurn(
  workflowID: string,
  messages: ModelMessage[],
): Promise<Turn> {
  const result = streamText({
    model,
    messages,
    tools,
  });

  for await (const part of result.fullStream) {
    if (part.type === "text-delta") {
      emit(EventType.modelDelta, workflowID, part.text);
    }
  }

  const rawCalls = await result.toolCalls;
  const toolCalls = rawCalls.map((call) => ({
    toolCallID: call.toolCallID,
    toolName: call.toolName,
    inputs: call.inputs,
  }));

  const responseMessages = (await result.response).messages;

  return {
    text: await result.text,
    toolCalls,
    responseMessages,
  };
}
```

函式裡的邏輯，和原本寫在迴圈裡的內容相同，只是搬到另一個地方：

- `streamText` 接收 `model`、`messages` 與 `tools`。
- 迭代 `result.fullStream`。每收到一段文字，就 emit `EventType.modelDelta`，讓外部即時看到文字逐段輸出。
- 串流結束後，等待 `result.toolCalls`，把這一輪的工具請求整理成 `toolCallID`、`toolName` 與 `inputs`。
- 等待最終回應，取得 response messages，再和這一輪的最終結果一起包成 turn 回傳。

## 用 step 包住 modelTurn

有了 `modelTurn` 之後，就可以回頭修改 `while` 迴圈：

拿掉原本直接呼叫 `streamText` 的部分，改成 `await runStep(...)`。

step 可以直接 `await`。`runStep` 會接收 `modelTurn`、`workflowID` 與 `messages`，最後替這個 step 指定名稱。素材中的做法是使用 step count 命名：執行到第幾輪，就叫做第幾個 step。

<!-- derived -->

```ts
const turn = await runStep(
  modelTurn,
  workflowID,
  messages,
  `step ${stepCount}`,
);

if (turn.toolCalls.length === 0) break;

// 執行工具、把結果塞回 messages，繞下一圈
```

模型不再要求工具時，就 `break`；如果有工具，就執行工具，然後進入下一圈。下一圈會再建立一個新的 step。

重啟之後，已經完成的 step 不會重跑，還沒完成的那一輪則照常執行。LLM 呼叫因此從「每次重啟都重跑」，變成「做過就跳過」。

<!--image:3-->

## await step，串流沒有停

最後有一個地方很容易誤會：`await` 這個 step，不代表串流停止了。

`modelTurn` 裡面仍然會呼叫 `streamText`、迭代 `fullStream`，也照樣一段一段 emit 文字。我們等待的是「這個 step 執行完畢」，不是一次等回整條串流的結果。

所以文字照樣逐段吐出來，只是這一輪跑完，會被記錄成一個 step。

model turn 包好了，剩下的是 tool call 和它前後的 `emit`。下一節把它們也關進 step。

<!--image:4-->
