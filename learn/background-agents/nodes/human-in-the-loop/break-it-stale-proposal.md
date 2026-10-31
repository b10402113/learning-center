# 如果批准了：先確認狀態沒跑掉

上一篇介紹的 approval 分支，已經能撐過等待。這篇要看 approve 之後的第一件事：真正執行前，先確認狀態沒有改變。

## 批准了，不代表仍然有效

我們做的是非同步 workflow。今天送出一個批准請求，可能要一個禮拜後才有人查看，也可能要等上三個禮拜。

送出 proposal 的當下，狀態是 ABC；一個禮拜後，狀態可能已經變成 XYZ。

當初看起來合理的下一步，現在很可能已經不該做了。這就是 stale proposal（過期提案）。

想像一下，如果這是轉帳批准：提案送出時，你的帳戶餘額綽綽有餘；等你終於批准時，錢卻已經不夠了。如果執行前不查餘額，就會直接透支。

所以，批准不等於可以執行。批准只回答了「人同不同意」，沒有回答「現在的條件是否仍然成立」。

<!--image:1-->

## 比對版本；不一致就作廢，而不是執行

approve 之後，我們先開一個 step：`fresh = await step.run("recheck approved state")`，並帶入 cycle。

接著取得 agent 的最新 state，並帶上 environment ID 和 run ID。

然後比對：`fresh.world.version` 和這次 workflow 啟動時的 input 版本是否一致。

如果一致，就往下走到執行那一行，真正執行 action。

如果不一致，就不執行，而是改做另一件事：開一個 step，叫 `invalidate approval`，並帶入 cycle。接著呼叫 `staleProposal`，用 proposal ID 將它在資料庫裡標記為 stale。這樣它就會從收件匣中消失。

然後呼叫 `continue`，回到外層迴圈。從最上面重新檢查狀態、取得最新資訊，再決定下一步。

<!--image:2-->

這裡要分清楚兩條路。人拒絕時，run 會被標記為 escalated。批准過期則不是拒絕：人按下了 approve，只是世界已經變了。因此流程不會走到 escalated，而是回到迴圈頂端，重新觀察狀態。

還有一個實作細節：原本那個 `return` 要拿掉。否則，approved 且 state 仍然新鮮時，流程就會跳不過去，action 永遠不會執行。

## 弄髒狀態：狀態變動後再按批准

這條分支不實際跑過，就不會知道是否有效，所以要故意讓狀態發生變化。

先啟動 dev agent。這次切到一個新分支，程式裡有 sleep，所以 agent 會慢慢執行。接著下 `fault release`。它會判斷應該執行 rollback，但 harness 會在這一層攔下它，因為這類動作需要 approval。於是 Harness 送出一個 approval request。

收件匣裡立刻多了一筆資料。

這筆資料不是通知，而是資料庫裡的一個 proposed action。Inbox 會從資料庫撈出所有 proposed action，所以能顯示這筆資料。我們沒有把通知送到其他地方，只是將 proposal 存進資料庫，再由 inbox 撈出來。它做的只是讀取那張表。

畫面上顯示：「propose rollback release，please review the exact action before I proceed」。上面沒有參數，這是刻意的：這些工具都是假的，工具本身什麼也不會做。換成真實情況，你會想知道要回滾到哪個版本、從哪個版本回滾；這些才是 arguments。這裡一個都沒有。

工具唯一拿到的參數，是 proposal 送出當下 state 的版本。這個資訊對人來說沒有意義。你看到只會想：「這是什麼？」它只代表 proposal 送出當下生效的是哪個版本。

好，現在不要照正常流程走。在按下批准之前，先修改 state，讓版本往前推進，然後再按 approve。

按下按鈕時，inbox 會觸發 `agent.approval.decided`，讓整個 workflow 再跑一次。不過前面執行過的步驟都已經 cache 了，所以流程幾乎會直接從 wait 那裡 resume，速度非常快。

回到程式碼時，流程已經不在 while 迴圈裡。它會從資料庫讀取人類的決定，看到結果是 approved。接著重新檢查狀態，取得最新 state，發現版本已經不同。

所以它不會執行 rollback，而是將 proposal 標記為 stale，讓它從收件匣中消失。run 則回到最上方，重新 observe，根據目前的狀態重新判斷。

## 解法是迴圈，不是重試

為什麼過期之後要回去 observe，而不是重跑同一個 action？

因為條件已經變了。正確的下一步可能根本不是原本那個動作。硬跑同一個 action，就等於拿過期的假設去賭。

回去 observe 之後，agent 會重新檢查狀態。如果它仍然認為 rollback 是正確選擇，就會再次選擇這個動作、重新送出 proposal。希望這次人能快一點回覆，不必一直重複。

但這總比拿著過期的狀態硬跑，再祈禱它會成功好得多。

這和一般寫程式時的直覺很不一樣。現在所有事情都是非同步的，你必須這樣思考：做出決定時所依據的世界，可能早已不復存在。

到這裡，run 能暫停、能續跑，也能拒絕過期的批准。剩下的風險在執行本身：如果 rollback 需要重試，要怎麼確保它不會執行兩次？
