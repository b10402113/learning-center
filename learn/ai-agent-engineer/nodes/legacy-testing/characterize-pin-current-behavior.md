# Characterize：把今天的行為釘住

測試 legacy app 時，第二步是 understand it：**理解行為，不是找 bug**。每一個 characterization test 都是把 code 現在實際呈現的樣子 pin 住，包括那些看起來不對的地方。

通常是因為沒有人說得出這段 code 現在到底在做什麼，才需要這一步。改一段說不出行為的 code，就是在賭。

## Pin 的循環

每一個行為都走同一個五步循環：

1. 用一個真實的輸入寫一個測試，呼叫那段 code。
2. 斷言一個你預期會錯的值，例如 `expect(result).toBe(null)`。
3. 跑測試。失敗訊息會告訴你實際發生了什麼。
4. 把斷言換成實際的值。測試變綠，也記錄了目前的行為。
5. 換下一個輸入重來：測試邊界（零、一、上限、剛好超過上限）、空的情況和錯誤的情況。

<!--image:1-->

第二步那個「故意寫錯」的斷言是關鍵。它不是偷懶，而是讓工具回答「到底回了什麼」——不需要讀懂那段 code，也能知道它的行為。

每個測試都用它釘住的行為命名，例如「把 1 分的退款捨入成 0」。完成的判準是：target 區域裡每一個 public function，都有涵蓋 normal case、邊界與 error case 的 pin 測試，而且你能**不讀 code 就講出它的行為**。

## 看起來像 bug，也要 pin 住

循環走到第四步時，經常會遇到一個誘惑：釘出來的值明顯是錯的。「這個應該要修吧？」

不要修。照樣 pin 住，把測試命名成 `pins current behaviour — suspected bug: <哪裡不對>`，然後把它列入最終報告的 suspected bugs 清單。**修它是之後獨立進行的改動**——因為修正會改變行為，而是否改變行為，該由使用者看過報告後決定。

<!--image:2-->

TicketBay 的 fee code 就是這種情況：`serviceFee(0)` 回傳 100，所以一張 100% 折扣的訂單還是會被收取手續費。agent 把這個 suspected bug pin 住交給使用者，而不是順手「修好」它。characterization 只記錄現況；順手修掉問題會讓報告失真，也會讓後續的安全網失去基準。

## 大輸出用 approval test

JSON、HTML、文字報表這類大輸出，逐一斷言每個欄位很麻煩。approval test 的做法是：

1. 用固定輸入，讓 code 產生輸出。
2. 將輸出存成 approved 檔案，並和使用者一起 review 一次。
3. 之後每次執行，都拿新輸出和 approved 檔案比對。任何差異都會讓測試失敗，並顯示 diff。

在 JS/TS 裡，Vitest 和 Jest 的 snapshot（`toMatchSnapshot`、`toMatchFileSnapshot`）就是這種做法；其他語言則有 ApprovalTests 家族。

<!--image:3-->

完成的判準是：target 區域裡每一個大輸出，都有一份經使用者 review 過的 approved 檔案。

## Approval test 是鷹架，不是資產

approval test 是暫時的鷹架。用檔名（`*.approval.test.*`）或檔案裡的註解標記它們。等 functional test 覆蓋相同的行為後，大部分 approval test 都要刪掉。

approval test 比對的是整個輸出，所以任何變化都算失敗，連一個欄位搬家也不例外。這種測試適合確認今天的輸出長什麼樣，卻太容易因變動而失敗，不適合確認行為有沒有改變。因此它用來理解現況，並且只是 scaffolding。

<!--image:4-->

## 這一步的產出是理解，還有清單

走完之後，會有兩樣東西：一份釘住現行行為的測試，以及一份 suspected bugs 清單。前者是後續所有工作的基準；後者不會被偷偷修掉，而是原樣交給人決定。

有了基準，下一步是把這張網補到夠密。那要三種工具一起上。
