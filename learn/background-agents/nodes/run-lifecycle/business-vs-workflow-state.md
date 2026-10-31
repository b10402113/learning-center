# 兩種 state：業務資料在 Postgres，step 進度在 Inngest

上一步我們看到，agent 醒來後會先用 `runId` 查資料庫，判斷這次是新 run 還是既有 run 的延續。這自然帶出下一個問題：資料庫到底記了什麼、什麼會留到下次？

Agent 執行到一半，服務突然重啟，記憶體裡的資料全不見了。這時你可能會想：剛才執行到哪一步？哪些資料還留著？

這個問題沒有單一答案，因為我們談的是兩種不同的 state（狀態）。它們存放的位置不同，負責保存的人也不同。

## 兩種 state，不要混在一起

第一種是 **business state（業務狀態）**，也就是 Agent 所負責的服務資料。假設 Agent 的任務是處理 checkout 流程，那麼 checkout 資料，以及 incidents 這類資料，都屬於 business state。

這些資料由我們自己寫進 Postgres，也由我們負責保存。

第二種是 **workflow state（流程狀態）**，例如哪些 step 已經完成、整個流程目前跑到哪裡。這部分由 Inngest 處理，我們不必自己存。

所以，如果你想知道「step 的結果存在哪裡？之後要 resume（接續執行）時，怎麼知道該從哪裡繼續？」答案是：這些流程進度由 Inngest 保存，我們不需要另外處理。

<!--image:1-->

## Checkpoint 是 Inngest 在幫你存

你可以把 workflow 裡的 run 和 step 想成一連串的檢查點（checkpoint）。每完成一個 step，Inngest 就會存下一個 checkpoint，不需要我們自己動手保存。

我們只需要自行保存和 business logic（業務邏輯）有關的資料。只要是業務資料，就由我們寫進資料庫；Inngest 不會替我們保存這些內容。

<!--image:2-->

## Inngest 存的是你 return 的內容

Inngest 會保存 step 裡的 return 值。你在 step 中回傳什麼，該值就會存進對應的 workflow 和 step，之後 resume 時可以使用。

不過，Inngest 自動保存 return 值，和我們想在 step 裡另外做 checkpoint、讓 dashboard 顯示某些內容，是兩回事。

## 所以你需要自己的 observation

這就是為什麼我們還需要建立自己的 observation（觀察紀錄）。當 AI 決定要採取某個動作時，我們得自己把這件事記下來。

Inngest 會記住流程跑到哪裡，以及每個 step 回傳了什麼；如果你想在 dashboard 上看到業務紀錄，就得自己保存。

<!--image:3-->
