# 換成自己的場景：durable runtime 選型與權限邊界

走到這裡，你已經有一台會執行、停止、喚醒與重試的 incident-response agent。

但這門課真正想教的，不是讓你記住這個範例，而是把同一套模式搬回自己的工作流程。

這一節只做三件事：

1. 替自己的場景挑一個 durable runtime。
2. 畫出 harness 與 agent 之間的權限邊界。
3. 決定哪些工作交給 harness，哪些工作交給 agent。

## durable runtime 是 agent 的靈魂

先掌握一個判斷標準，它會影響你後面的選擇。

durable runtime 不是可有可無的外掛，它是讓 agent「活著」的那一層：它一直在那裡、持續接收事件，也能在需要時醒來。

沒有它，你手上就只是一個 server、一個 API；有了 durable execution，它才變成活的。

<!--image:1-->

所以，當你想做一個「關掉之後還能繼續活著」的背景 agent，要先想清楚它的靈魂要放在哪裡。

## 先挑一個 durable runtime

除了課程使用的 Inngest，還有幾個類似的服務可以選擇：

- **DBOS**：把狀態存在資料庫裡，而不是另外開一個服務。對已經使用 Postgres 的人來說，可以少維護一個元件。
- **Temporal**：就是那個 Temporal，不是大腦的顳葉；它也是同類型的方案。
- **Vercel Workflows**：功能非常類似。有些方案會讓每個項目自動變成 step，不必自己處理「切 step」這件事。
- **Upstash Workflows**：採用 HTTP。因為它是 HTTP based，你可以搭配各種服務使用，也能跑在 serverless 上。

<!--image:2-->

這裡最容易犯的錯，是把選 runtime 當成「選最強、功能最多」的比賽。

材料裡的建議其實很直接：挑一個你用得順手的就好，這些方案都很好。

會真正卡住你的，是有沒有選到一個適合自己場景、也確實跑得起來的方案。

## 畫出權限邊界：harness 管什麼、agent 管什麼

選好 runtime 後，下一個問題就是怎麼分工。

這門課從頭到尾都在示範同一條界線：

> model 負責提議動作，harness 負責管理政策。

把六個 branch 攤開來看，分工會是這樣：

- **model**：提出 action。
- **harness**：掌握 policy、state-version 檢查、decision budget、terminal outcome，以及 human gate。
- **真正擁有副作用的服務**：負責 idempotency。

<!--image:3-->

這條界線不只畫給程式看，也畫給你自己看。

當你把範例換成自己的場景，第一個要問的就是：

> 這件事應該由 harness 決定，還是交給 agent 自己決定？

材料在談「放大軟體開發」時，也給了同一條界線的極端版本：你要做的是一個完全不寫程式的自訂 harness。

它不自己扮演 coding agent，只提供一個 tool 去和 hosted 的 coding agent 溝通，讓 coding agent 負責寫程式。

哪些事情放進 harness，哪些事情交給 agent 自己判斷，就照課程裡的這套方式去思考。

## 換成自己的場景：員工 harness，而不是另一個 coding agent

把上面的概念搬到軟體開發，會得到一個好用的心智模型：**員工 harness**。

它裡面有很多 tool，也有一台電腦，負責和 hosted 的 coding agent 互動；但它自己不寫程式。

<!--image:4-->

這個框架可以套用在任何有 state machine 的場景。

你先定義有哪些 state，再決定哪些部分交給 agent。

以軟體開發為例，從 idea 一路走到 production，本身就是一整套狀態：

- GitHub 的事件
- 進來的 log
- Linear 或 Jira 上的 task
- Slack 頻道裡的一則訊息

如果想把這套流程規模化，不可能只靠生成程式碼。

你需要的是一個「完全不寫程式、只負責協調」的 harness。

## 回家自己蓋一個：然後親手弄壞它

最後，把這套方法換成你自己的場景。

材料裡最酷、也最貼近這門課的建議，就是回家自己動手做。

你可以讓 AI 幫你寫程式：把這些筆記丟給 coding agent，再給它一個你想做的 background agent 點子，請它幫你建出來。

接著才是關鍵的後半段：推敲它、試著弄壞它，看看它能不能真的完成某件事。

<!--image:5-->

這些東西通常比想像中容易很多。

挑一個用得順手的 runtime，畫好 harness 與 agent 之間的權限邊界，再把筆記丟給 coding agent，開始試著弄壞它。

這就是把課程內容搬回自己場景的整套動作。
