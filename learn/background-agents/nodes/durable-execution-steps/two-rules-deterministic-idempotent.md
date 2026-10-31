# 兩條規則：workflow deterministic、step idempotent

上一課說，resume 只是照著紀錄一張表往下讀。查表要對得上，前提只有一個：重跑時走過的路，跟第一次一模一樣。

偏偏 workflow 跑到一半，機器就停了。runtime 重新執行 workflow，從上次停下的地方接著跑。聽起來很安全，但安全的前提還是同一件事：之前走過的路必須一模一樣。

在 durable execution（耐久執行）這一層建立流程，只要記住兩條規則，就能守住這個前提。

## 規則一：workflow 的程式碼必須 deterministic

第一條規則管的是 workflow 本身。`createFunction` 裡面、不在 step 裡的那些程式碼，全部都得 deterministic：同樣的輸入，每次執行都要得到同樣的結果。

最常踩的坑是看時鐘。你不能在這一層寫「如果現在是幾點，就做某件事」這種邏輯，因為時間每次都可能不同，程式走的分支也會跟著改變。

等 workflow 重播（replay）的時候，路徑就對不上，原本那份安全保障也跟著失效。

<!--image:1-->

隨機也一樣。你不能在 workflow 的高層級做兩次隨機，否則重跑後就保證不了同樣的結果。這通常是不被允許的。

有些工具會直接幫你把關。像 Inngest 就會檢查程式碼裡有沒有不 deterministic 的寫法，必要時直接報錯。它寧可你早點發現問題，也不要等到半夜重播才踩雷。

## 規則二：step 必須 idempotent

第二條規則管的是 step：step 本身要具備 idempotent（冪等）的特性。

step 如果會做一次 mutation，也就是會改變資料的操作，那就算被呼叫兩次，也不該真的執行兩次。它應該知道自己已經做過，所以不再做第二次。

<!--image:2-->

而重播一定會發生。runtime 可能再次呼叫同一個 step；step 要是不記得自己做過什麼，同一個 mutation 就會再發生一次。

## Stripe 的 idempotency key

Stripe 就是現成的例子。

你呼叫 Stripe API 建立購買時，會用到一個 idempotency key。下次帶著同一個 key 再呼叫，Stripe 會去查這筆操作是否已經做過：做過就不再執行，直接回傳 200。

<!--image:3-->

回應是成功的，但 mutation 不會重複發生，錢也只收一次。

這不能靠運氣。你一定不希望 server 重播流程時，不小心呼叫兩次，結果向同一個人收了兩次錢。所以 step 必須在某種程度上具備 idempotent 特性：重播時，同一個 mutation 不會再執行一次。

## 換工具，規則不換

這兩條規則不只適用於 Inngest。

如果你用 Temporal，概念完全一樣，只是它把 step 稱為 activities。Vercel 的方案則使用 decorator，例如 `use workflow` 這類寫法。名稱不同，本質上都是 workflow 和 step。

我大概用過十種這類工具，它們做的事情都一樣：workflow 必須 deterministic，step 則應該是 idempotent。其他規則也大致相同，只是語法各有不同。別被語法綁住，這套觀念可以用在各種架構裡。

喔對，Cloudflare 也有一套方案。我覺得它相當不錯，是我繼 Inngest 之後最喜歡的。
