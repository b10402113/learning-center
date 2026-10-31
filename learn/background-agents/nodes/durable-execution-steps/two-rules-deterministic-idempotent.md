# Workflow 要 deterministic，Step 要 idempotent

上一篇結尾提到：要讓 replay 成立，step 外的程式碼每次都必須做出相同的選擇。這句話其實只說完了一條規則的上半段。

在 durable execution 這一層建立系統，只要記住兩條規則：一條管 workflow 的程式碼，另一條管 step 裡的副作用。這兩條規則，都是從 memoized replay 的運作方式推導出來的。

## 規則一：workflow 的程式碼必須 deterministic

`createFunction` 這個 function 裡所有不在 step 內的程式碼，都必須是 deterministic。

簡單來說，就是每次執行都必須得到相同的結果。你不能在這一層寫「如果現在是幾點，就做某件事」這類邏輯。這個分支每次執行時可能走向不同結果，replay 就會因此失效，你也會失去那層安全保障。

<!--image:1-->

像 Inngest 這類工具甚至會替你檢查。只要寫了不 deterministic 的程式碼，它可能就會直接報錯。

隨機性也是一樣。你不能在 workflow 的高階層隨機抽兩次，否則就無法重跑 workflow 並取得相同結果。通常這類寫法是不允許的。

為什麼限制這麼嚴？因為 replay 仰賴執行順序。時間和隨機性會讓同一段程式碼走進不同分支，進而改變 step 的順序。順序一變，手上的記錄就無法對應。

## 規則二：step 本身要 idempotent

idempotent 的意思是：假設某個 step 會執行一次 mutation，即使呼叫兩次，也不應真的執行兩次。它必須能辨認出操作已經做過，因此不會再次執行。

Stripe 就是很好的例子。你呼叫 Stripe API 建立一筆購買時，可以帶上一個 idempotent key。之後再次使用同一個 key 呼叫 API，Stripe 會查詢這筆操作是否已經完成；如果已完成，就不會重複執行，而是直接回傳先前的結果。

<!--image:2-->

所以，呼叫仍然會成功，但 mutation 不會再次發生。

為什麼要在意這件事？因為你絕對不希望 server 重播某個操作時，不小心呼叫兩次，害你向客戶收了兩次錢。step 必須在某種程度上具備 idempotency，這樣重播時才不會讓同一個 mutation 再次發生。

## 同一套拆法，不同的名稱

這不只適用於 Inngest。用 Temporal 時，概念完全一樣，只是它把 step 稱為 activity。Vercel 的方案則使用 decorator，例如 `use workflow` 這類寫法。

名稱不同，本質上卻是同一回事：有 workflow，也有 step。Cloudflare 也有一套相當不錯的方案，是我在 Inngest 之後第二喜歡的。

我大概用過十種這類工具，它們做的事情都差不多：workflow 必須 deterministic，而 step 最好具備 idempotency。其他規則也大同小異，只是實作方式各有不同。所以別被語法綁住，這套觀念可以套用到任何架構。

兩條規則都講完了，接下來只剩一個很實際的問題：在真正的 loop body 裡，哪些呼叫該包進 `step.run`，哪些該留在 workflow？
