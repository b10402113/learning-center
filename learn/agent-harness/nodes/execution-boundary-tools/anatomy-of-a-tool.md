# 一個 tool 的三個部位：description、schema、execute

你大概已經知道，agent 要能查資料、動手做事，靠的是 tool（工具）。

等到你要在 harness 裡建立 tools 檔案，親手把工具交給模型時，會發現一個 tool 看起來只是一包物件設定，裡面卻混著三種性質完全不同的東西。

這不是錯覺。它們本來就是三個不同部位：description、input schema、execute。

這篇文章會把它們拆開來看，說清楚每個部位的文字或程式，最後影響的是誰——模型，還是伺服器。

## 先把舞台搭好：tools 檔案與一個假的知識庫

要寫 tool，先要有地方放。

你可以在 harness 裡建立一個 tools 檔案，再使用 AI SDK 的 `tool` 函式建立工具。這個函式會接收一個物件，而物件裡就是工具的完整定義。

另外，還需要一個假的 knowledge base（知識庫）當作道具。

這門課的重點不是做出多聰明的 agent，而是先把 harness 本身搭起來。因此，有些部分會先用 mock（假造）的方式處理，做出最陽春、但能查詢的版本就好。

## 一個 tool 的全貌

第一個工具叫做 `searchKnowledgeBase`，用途是到知識庫裡尋找相關文章。

整個定義看起來像一整包設定，其實是三個部位擠在一起。

<!--image:1-->

<!-- derived -->

```ts
import { tool } from "ai";

export const tools = {
  searchKnowledgeBase: tool({
    description: "search the support knowledge base for relevant articles",

    inputSchema: z.object({
      query: z.string().describe("what to look up"),
    }),

    execute: async ({ query }) => {
      // 真的被呼叫時，跑在這裡
    },
  }),
};
```

`export const tools` 是一個裝滿工具的物件，模型可以使用的工具都會掛在裡面。

接下來，我們一個部位一個部位拆開來看。

## 部位一：description，寫給模型看的說明

description 是模型決定要不要呼叫工具時，唯一讀得到的東西。

你寫在這裡的文字，主要是在回答兩個問題：

- 什麼時候該使用這個工具？
- 這個工具到底會做什麼？

<!--image:2-->

範例中的文字是 `"search the support knowledge base for relevant articles"`。

你可以直接照抄，也可以換成自己的說法，沒有唯一的標準答案。因為這不是一道是非題：模型不會因為「讀懂了」就一定呼叫工具。

它的決定落在機率尺度上，本身不是決定性的（deterministic）。description 寫得好不好，最後還是要靠 evals（評測）量出來，光看文字本身很難判斷。

那到底該怎麼寫？

可以想像自己正在帶一位剛到職的同事。你會告訴他這個工具為什麼會被用到，以及它能做什麼。把這些話講清楚，通常就是好的開始。

## 部位二：input schema，參數的契約

input schema 是一份會被強制執行的契約。

模型一旦決定呼叫工具，就必須同時提供 schema 規定的參數。工具在伺服器端執行時，拿到的就是模型傳進來的內容。

<!--image:3-->

為什麼需要這層契約？

因為程式碼必須知道自己會收到什麼。有了這份規格，function 裡就不會突然出現一堆無法處理的參數。

以 `searchKnowledgeBase` 為例，使用這個工具時一定要提供 `query` 欄位。它的型別是 `string`，並且用 `.describe` 說明這個欄位的用途，範例文字是 `"what to look up"`。

這個寫法和工具本身的 description 很像，也可以把它想成是在教一位剛到職的同事：「這個參數是做什麼的？」照實說明就好。

這個部位要注意兩面：

- 欄位名稱、型別和說明文字是給模型讀的，會影響模型傳入什麼參數。
- 「參數必須符合契約」這件事，則是由伺服器端負責把關。

## 部位三：execute，被呼叫時真正執行的程式

前面兩個部位是文字和規格，`execute` 才是工具被呼叫後，真正會發生事情的地方。

它收到的就是 input schema 定義的物件，因此這裡一定拿得到 `query`。

<!--image:4-->

`execute` 裡面想做什麼都可以，甚至也能再呼叫另一個 LLM。

但有一件事非做不可：一定要回傳結果。

因為你回傳的內容會被餵回模型，成為模型下一步的輸入。

這個範例做的是最基本的記憶體文字搜尋：先把知識庫中的條目攤開來比對，並在比對前把 `query` 轉成小寫，避免只因大小寫不同而漏掉結果。

<!-- derived -->

```ts
execute: async ({ query }) => {
  return Object.entries(knowledgeBase).filter(([key]) =>
    query.toLowerCase().includes(key)
  );
},
```

搜尋本身不是重點。

重點是，`execute` 這個位置可以放任何邏輯，而它的輸出就是模型收到的工具結果。

## 誰影響模型，誰影響伺服器

三個部位拆完後，可以用一個問題檢查自己是不是真的分清楚了：

**這一段文字或程式，最後作用在誰身上？**

- **description**：寫給模型看的。模型會讀這段文字，判斷要不要呼叫工具。
- **input schema 的欄位說明**：寫給模型看的。模型會讀這些文字，判斷要傳入哪些參數。
- **input schema 的驗證**：由伺服器端把關。`execute` 收到的參數必須符合契約。
- **execute**：在伺服器上執行的程式。它的回傳值會再交回模型。

下次打開 tools 檔案時，先別急著看它能做什麼。

先問自己：**每一個部位，是寫給誰看的？**
