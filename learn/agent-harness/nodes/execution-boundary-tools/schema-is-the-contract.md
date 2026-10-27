# Schema 是模型與程式之間的契約

你寫好工具的 `execute function`，裡面假設 `category` 只會是 `billing`、`technical`、`sales`、`other` 四種。

結果某天模型傳入了 `"feedback"`，`switch` 跑進 `default`，最後回傳一個莫名其妙的結果。

問題不在模型笨，而在於你從來沒有把「我能處理什麼」寫下來給它看。

<!--image:1-->

工具的參數由模型產生，但真正執行的是你的程式。兩邊要對得上，靠的不是默契，而是一份事先寫好的契約——**schema**。

## Zod：在執行時期檢查物件的形狀

Zod 是用來在執行時期檢查物件形狀的工具。

TypeScript 的型別只存在於編輯器裡，程式實際跑起來之後就消失了。Zod 則不一樣，它有點像資料庫的 schema，只是檢查的對象不是資料表，而是記憶體裡的物件。

你先定義好資料形狀，程式執行到那一步時，Zod 才會真的進行驗證。它是 JavaScript 世界裡很受歡迎的選擇，也和 AI SDK 相容，因此工具的 input schema 可以直接用 Zod 來撰寫。

<!-- derived -->
```ts
// classify item 工具的 input schema
const inputSchema = z.object({
  itemId: z.string(),
  category: z.enum(["billing", "technical", "sales", "other"]),
});
```

一個工具大致上包含三個部分：

- 一段描述（description）
- 一份輸入格式（input schema）
- 一個實際做事的 `execute function`

其中，契約就寫在 input schema 裡。

## enum：把選項釘死

`enum` 的意思很簡單：這個欄位只允許使用清單中的其中一個值。

<!--image:2-->

範例中要模型替項目分類，而類別只有四種：`billing`、`technical`、`sales`、`other`。

用 `z.enum` 列出這四個字串後，模型就只能從這份清單裡選。如果它想填入 `"feedback"`，這個值會在 schema 驗證這一關被擋下來。如此一來，你的 `execute function` 收到的就只會是這四種值之一。

這就是「程式真的能處理」的意思：schema 擋掉的不是模型的創意，而是那些你根本沒有撰寫處理邏輯的輸入。

參數約束得越貼近 `execute function` 的能力範圍，模型填錯的空間就越小。

## describe：告訴模型這個欄位到底是什麼

如果欄位名稱不夠直白，就在 schema 裡使用 `describe`，把意思說清楚。

<!--image:3-->

工具的輸入欄位要不要加上 description？要，百分之百要——只要你的目標是讓模型知道欄位代表什麼，就應該把 description 寫上去。

這也是一個會影響模型的介面，和工具本身的描述一樣值得花心思。

不過，是否需要補充說明，還是要看情況。

有時候欄位叫做 `item ID`，模型一看就懂，不需要多說。但如果你的資料裡，item ID 使用了另一個欄位名稱，或是必須從另一筆資料才能取得，就應該用 `describe` 跟模型說清楚：item ID 其實就是它接下來會看到的那個欄位。

把這層關係講明白，模型才比較能把正確的值放進正確的欄位。
