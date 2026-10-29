# History、State、Context：三個不同的東西

上一步把兩個物件留在桌上：History 已經完整，但這次呼叫要用的 Context 還沒準備好。這一步會建立 `harness/memory.ts`，把兩者分開。

這個檔案有三個概念和兩個函式。長對話之所以容易讓人混淆，多半是因為把這三個概念混為一談。

## 一個檔案，三個名稱

History 會永久保存每一輪對話。它是前一課提到的持久事件紀錄，不會刪除任何內容。

State 是舊對話的摘要。它比 History 短，而且是從 History 整理出來的。

Context 則是模型在這一輪會看到的內容。每次呼叫模型時都會重新組裝，用完就丟棄。

所以，History 是可信資料來源，State 是它的快取，Context 則是送出請求的內容。三者的存續時間不同，工作也不同。

<!--image:1-->

## 看 Token，不看對話輪數

Context 是否膨脹，要看 Token 數量，不是訊息數量。一輪對話如果包含六次工具呼叫，會比只有一句話的對話耗費更多 Token。

粗略來說，四個字元約等於一個 Token。實際比例會因模型使用的編碼器而異，所以這只能當作估算。

正式環境應使用與模型相符的分詞器。TikToken 是常見的標準工具，會對應模型使用的編碼器，但它是 Python 函式庫。雖然有 JavaScript 移植版，作者上次嘗試時，版本已經過時。

這一課先略過分詞器，改用字元數除以四。這樣能讓專案保持精簡，而且這個數字只用來判斷何時該壓縮內容。

## 預算包含輸入和輸出

服務供應商公布的 Context Window 數字，包含輸入與輸出的總量。但兩者分到的空間並不相同。

<!--image:2-->

通常會把較大的預算留給輸出，因為你提供給模型的內容比模型回覆的內容少。輸入能用的空間則較小。

所以，這裡要關注的是輸入端的預算。聊天內容每增加一輪，增加的就是這一側。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/memory.ts#L13-L20 -->
```ts
export function estimateTokens(messages: ModelMessage[]): number {
  const chars = messages.reduce(
    (n, m) =>
      n + (typeof m.content === "string" ? m.content.length : JSON.stringify(m.content).length),
    0,
  );
  return Math.ceil(chars / 4);
}
```

`estimateTokens` 會接收整個訊息陣列，把非字串的內容轉成字串，再計算字元數並除以四。結果會無條件進位，因此即使陣列幾乎沒有內容，也至少會算成一個 Token。

## buildContext：每一輪都重新組裝

接下來看看負責建立 Context 的函式。先讀它的參數：系統提示、任務、摘要，以及對話輪次清單。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/memory.ts#L22-L28 -->
```ts
// Three different things, on purpose:
//   · HISTORY  = everything that happened — the durable event log (Lesson 2).
//   · STATE    = a running SUMMARY of older turns (compacted working memory).
//   · CONTEXT  = what the model actually sees THIS turn, assembled on demand.
//
// buildContext hydrates the context: the system prompt, the pinned task, the
// summary of old work, and only the most recent turns verbatim.
```

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/memory.ts#L29-L44 -->
```ts
export function buildContext(
  systemPrompt: string,
  task: string,
  summary: string,
  turns: ModelMessage[][],
): ModelMessage[] {
  const context: ModelMessage[] = [
    { role: "system", content: systemPrompt }, // the CURRENT agent's prompt
    { role: "user", content: task }, // the goal is pinned, never summarized away
  ];
  if (summary) {
    context.push({ role: "system", content: `Summary of earlier work so far:\n${summary}` });
  }
  for (const turn of turns) context.push(...turn); // recent turns, verbatim
  return context;
}
```

有兩行比其他部分更重要。系統提示是目前這個代理程式使用的提示，不是儲存下來的提示。任務則是一則固定保留的使用者訊息，因此壓縮內容時，目標不會被摘要掉。

接著放入摘要，再原封不動地加入最近幾輪對話。順序代表優先程度：代理程式的身分、收到的任務、已經做過的事，最後才是未加工的近期對話。

<!--image:3-->

不要壓縮目標，也不要壓縮目前的系統提示。只有對話紀錄中間的部分可以壓縮。

## 摘要應放進系統提示

上面的程式把摘要當成第二則 `system` 訊息傳入。逐字稿指出，這不是好做法。

同一個請求裡放兩則系統訊息，可能會收到警告，也可能遇到錯誤。這種寫法通常還是能運作，但結構並不正確。

正確做法是把摘要附加到原本的系統提示內容中，讓請求裡只保留一則系統訊息，並把摘要放在最後一個區塊。

<!-- derived -->
```ts
const context: ModelMessage[] = [
  { role: "system", content: systemPrompt + (summary ? `\n\nSummary of earlier work so far:\n${summary}` : "") },
  { role: "user", content: task },
];

for (const turn of turns) context.push(...turn);
```

## buildContext 在哪裡呼叫

每當使用者送出訊息，harness 都會重新組裝 Context。每次呼叫之間不會保留任何內容。

關鍵在於當下組裝的順序：先取出新訊息，將它固定為任務，再把較舊的對話內容壓縮到它下面。

這就是區分兩者的重點。模型收到的是最新指令，加上一段逐漸縮短的過去，而不是先塞入過去，再把還放得下的內容補上。

`buildContext` 需要摘要和近期對話清單，但這個檔案目前還不會產生這兩者。接下來要處理的就是這件事，而這項工作需要一個觸發條件。
