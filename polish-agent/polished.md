# 建立工具檔與假的知識庫

## 前言

模型只能產生文字。它無法自行查詢費用、分派客服案件，也不能寄送電子郵件。這些事情之所以辦得到，是因為有人先把它們寫成工具，再交由執行框架呼叫。

少了這些準備，你做出來的就只是一次碰巧成功的展示。流程會呼叫工具、讀取結果，再呼叫下一個工具，直到模型認為自己可以回答為止。但過程中沒有紀錄，也無法防止具有副作用的操作被重複執行；更不會在金錢即將流動之前停下來徵求確認。等你第一次把可能影響外部世界的工具交給代理程式，就會發現這些缺口。

這個單元會分四個步驟補上這些缺口：建立工具檔與背後的知識庫、辨別每個工具都有的三個欄位、使用 Zod 撰寫兩個安全工具，最後加入一個不可逆的工具，看看只靠文字設定的防護措施為什麼無法阻止它。

首先，先回答一個較小的問題：在執行框架把工具交給模型之前，必須先準備什麼？

## 先建立檔案，不急著實作功能

執行框架首先需要的是一個檔案。在 `harness/` 裡建立 `tools.ts`。AI SDK 提供了 `tool` 輔助函式，因此這個檔案需要從 `ai` 匯入 `tool`，並從 `zod` 匯入 `z`。

這門課要做的是執行框架，而不是打造一個打磨到能上線的代理程式。代理程式本身還有許多事情要處理，因此底層資料先用簡單、通用的假資料代替。第一份假資料就是知識庫。

知識庫是一組供代理程式查詢的資訊。你可以把它想成代理程式用來查資料的維基百科。把資料放在上下文之外，而不是每一輪都重貼同一段文字，就能避免反覆消耗 token。

![第 1 段配圖](./tools-file-and-fake-knowledge-base-assets/image-1.webp)

所謂「放在外部」，是指代理程式必須透過你選定的機制取得資料。你可以使用 RAG，也可以使用傳統搜尋。這裡採用最簡單的做法：在記憶體中搜尋四筆資料。

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L18-L26 -->

```ts
const KNOWLEDGE_BASE: Record<string, string> = {
  billing:
    "Double charges are usually a duplicate authorization that drops off in 3–5 days. If it already settled, refund immediately.",
  refund: "Refunds post in 5–10 business days. Pro accounts can be expedited.",
  export:
    "The Safari export failure is a known bug (TICKET-4412). Workaround: use Chrome or the CSV export.",
  pricing:
    "Team plans are $20/seat/mo with a volume discount at 25+ seats. For 50+ seats, send the pricing PDF.",
};
```

這四筆資料應該視為操作手冊，而不是說明文件。遇到重複扣款時，`billing` 說明這通常是重複授權，款項會在三到五天內消失；如果款項已完成請款，則應立即退款。`refund` 說明退款需要五到十個工作天才會入帳，也提到 Pro 帳戶可以加快退款流程。

`export` 將 Safari 匯出失敗列為已知問題 TICKET-4412，並提供改用 Chrome 或匯出 CSV 的替代方案。`pricing` 列出 Team 方案的費率與適用的用量門檻，並指示席位數超過五十個時寄送定價 PDF。

這些資料是代理程式遇到不同情況時可以依循的操作手冊，因此應該放在模型之外。代理程式的行為依據應該存放在可編輯、可比對差異的檔案裡，而不是只靠模型記住某一段提示詞。

![第 2 段配圖](./tools-file-and-fake-knowledge-base-assets/image-2.webp)

<!-- source: sources/agent-harness2/20261029/harness-engineering/harness/tools.ts#L28-L34 -->

```ts
export function searchKB(query: string): string[] {
  const q = query.toLowerCase();
  const hits = Object.entries(KNOWLEDGE_BASE)
    .filter(([key]) => q.includes(key))
    .map(([, article]) => article);
  return hits.length ? hits : ["No exact match — use your judgment."];
}
```

搜尋時，函式會先將查詢文字轉成小寫，再留下鍵值出現在查詢文字中的資料。這裡刻意採用很簡單的做法，因為本課程不會介紹 RAG：比對方式就是檢查鍵值是否包含在小寫的查詢字串中。

查無結果時的處理方式，和找到資料一樣重要。找不到符合項目時，函式回傳的不是空陣列，而是一句話。這句話本身也是一項指示：模型讀到後，會據此決定下一步該怎麼做。

![第 3 段配圖](./tools-file-and-fake-knowledge-base-assets/image-3.webp)

這些資料是否真的能改善輸出，是另一個問題。若要衡量這些上下文對代理程式的影響，就需要進行 eval；不過這不在本課程的範圍內。

## 下一步需要補上什麼

目前知識庫和查詢函式都已經準備好了，但模型還無法使用它們。若要讓模型呼叫 `searchKB`，得先回答三個問題：要如何向模型說明這個工具、模型必須提供哪些參數，以及執行框架收到呼叫後要做什麼。接下來會逐一處理這些問題。
