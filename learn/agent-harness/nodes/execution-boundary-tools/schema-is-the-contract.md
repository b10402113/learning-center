# Schema 是模型與程式之間的契約

上一課的搜尋工具只有一個 `query`，模型填什麼都收，查不到就回空結果。這種自由欄位還算好處理。

但如果工具的工作是分類，而程式只認得四種分類，就不能讓模型自己發明第五種。

這時候 schema 不只是給模型看的提示，而是模型和程式都要遵守的契約。

## 用 Zod 在執行時檢查形狀

課程用 Zod 定義 schema。它是 JavaScript 的 runtime schema checker：你寫一份 schema，程式在執行時拿它來驗證資料。

可以把它想成搬到執行期的 TypeScript，或是用在記憶體物件上的資料庫 schema。

Zod 是 JavaScript 生態裡最流行的一套，也和 AI SDK 相容，所以直接拿來寫 tool 的 inputSchema。

## enum 把選項鎖死

分類工具要吃兩個參數：要分類的項目 ID，以及分類本身。

<!-- derived -->
```ts
classifyItem: tool({
  description: "Classify a work item into one category.",
  inputSchema: z.object({
    itemId: z.string(),
    category: z.enum(["billing", "technical", "sales", "other"]),
  }),
  execute: async ({ itemId, category }) => {
    // ...
  },
}),
```

`z.enum` 的意思是「這幾個其中之一」。

模型可以選 billing、technical、sales 或 other，但不能傳「帳務問題」或「其他（急件）」。就像菜單只列四道菜，廚房也只會做這四道，客人不能自己發明第五道。

execute 收到 category 時，就知道它一定是這四個字串之一。

這就是契約：模型負責在允許的範圍裡挑一個，程式負責處理範圍內的東西。模型沒有義務理解你的資料庫，但它必須交出程式能吃的形狀。

![第 1 段配圖](./schema-is-the-contract-assets/image-1.webp)
*AI 生成示意圖*

## 欄位也值得一句 describe

schema 管的是形狀，不管模型知不知道這個欄位在幹嘛。所以每個欄位都可以加 `describe`。

素材裡的回答很直接：如果目標是讓 agent 知道欄位是什麼，那就該加。不過也要看情況。

有些模型看到 `itemId` 就懂，尤其你傳的資料本來就帶著這個欄位；但如果資料裡它叫別的名字，或得從另一筆資料查出來，describe 就是你把話講清楚的地方。

它和 description 一樣，是影響模型的一個表面，不是開關。寫了不保證模型一定懂，寫得好不好還是得量。

## 契約管形狀，不管誰動手

到這裡，schema 已經把參數約束成程式能處理的樣子。但還有一個問題：模型給了參數之後，是誰拿這些參數去執行？

在原本的寫法裡，execute 就黏在 tool 物件上。下一課會看到，這代表 AI SDK 會替你把這件事做掉，而這正是要拿回來的地方。
