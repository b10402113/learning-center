# 兩種 state，要分清楚

上一節留下了一個問題：run 只是一次喚醒，因此尚未完成的工作必須存放在耐久的地方，而且會分別存放在兩個地方。先從最直接的測試開始：重新部署服務。

## 重啟服務之後，什麼不見了

服務重啟後，記憶體裡的內容全都消失了，但工作並沒有因此從頭開始。

<!--image:1-->

原因是這兩部分的狀態原本就不在記憶體裡。第一部分是 business state，也就是服務本身的資料。這個 agent 負責 checkout 流程，相關資料都存放在 Postgres，像 incidents 這類資料也在其中。這部分由我們的程式寫入。

第二部分是 workflow state：哪些 step 已經完成，以及執行進度到哪裡。這部分交由 Inngest 處理，我們不需要自行儲存。

重啟真正清掉的，是那些沒有寫入任何一方的暫存內容。重要的兩部分狀態都不在記憶體裡，所以重新部署不會讓工作歸零。

## Checkpoint 由 Inngest 儲存

可以把 run 和 step 想成一連串的 checkpoint。workflow 每完成一個 step，就會儲存一個 checkpoint。負責儲存的不是我們，而是 Inngest。

因此，對於「step 的結果究竟存在哪裡？我們又怎麼知道要從哪裡 resume？」這個問題，答案是：Inngest 會全部處理好，我們不必做任何事。

workflow state 這部分不需要我們自行儲存。哪些 step 已經完成、執行進度到哪裡，Inngest 都會記錄下來。重新部署後，工作之所以能從原本的位置繼續，就是因為有這份紀錄。

## Inngest 補不上的那一塊

Inngest 會儲存你 return 的內容。你在 step 裡 return 什麼，該值就會存進該 workflow 的該 step。之後 resume 時，Inngest 會取用這個值。

但 Inngest 不會儲存 business logic。它不知道回傳值對你的業務代表什麼，也不會替你在 dashboard 上留下業務紀錄。

舉例來說，agent 決定關閉一個 flag，step 隨後 return success。resume 時，Inngest 會重用這個 success。但「有人選擇了這個動作」這筆紀錄，只有在我們的程式寫入後才會存在。

<!--image:2-->

因此，我們需要自行建立一筆 observation。當 AI 決定執行某個動作時，就由我們把這件事記錄下來。這和 Inngest 的 checkpoint 是兩回事：一個記錄 workflow 執行到哪裡，另一個記錄業務上發生了什麼。

兩種狀態，分別由兩個保管者存放在不同地方。接下來自然會有個問題：既然一部分在 Postgres，另一部分在 Inngest，那 Postgres 裡有哪些資料表？它們各自存放哪一部分？
