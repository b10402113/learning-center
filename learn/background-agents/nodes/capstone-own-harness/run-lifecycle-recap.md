# 把一個 run 的一生連成一張圖：從事件到驗證完成

前面幾節，我們分別拆解了幾個機制：怎麼被事件叫醒、怎麼觀察、怎麼決策、怎麼暫停等待、怎麼等人核准，以及怎麼安全重試。這一節把它們串成一條線：

**event → observe → decide → wait → approve → retry → verify**

一個 run 從頭到尾會發生什麼、每一步的狀態最後去了哪裡、每個決定的權限在誰手上，就看這條線。整篇繞著一句話走：

> **模型提出動作，但每個決定的權限，分散在 harness、擁有效果的服務，以及人手上。**

## 從一個 alert 開始：event 是門鈴，不是狀態快照

故事從一個 alert 說起。

我們的範例是一個 checkout operations agent。系統中有一個獨立的本地 checkout 服務，它自己擁有一個小型 state 物件。這個服務可能出錯，出錯後就會發出 alert。

第一個 alert 會開啟一個 incident run。這裡有個關鍵：

**後續的 alert 會加入同一個 active incident，而不是每個 alert 都各自開一個 agent。**

一個 checkout instance 只會有一個 active incident run：第一個 alert 開啟它，後續 alert 加入它，並把它叫醒。這些 event 都存進 Neon，events 和 incidents 記在那裡。

alert 只是門鈴，不是狀態快照。收到它不代表你已經知道服務的狀態，只代表「世界變了，該去看一眼」。

<!--image:1-->

> **弄壞它：**在 agent 已經醒著、正在決策時，再送一個 alert 進來。觀察它會被附加到同一個 run，還是開出第二個 run。如果沒有 deterministic 的相關性訊號，就可能在這裡開出重複的 investigation。

## observe：決策前一定要重新看一眼

被叫醒後，第一件事是觀察。agent 透過 API 查看服務最新的 state、檢查證據，然後才進入決策。

有條規則很容易被忽略，卻非守不可：

**remediation 會改變 checkout 服務的 state，所以在下一次發言、宣告成功之前，agent 必須重新 observe 一次。**

你不能拿動作執行前看到的那份 state，去宣稱動作執行後的結果。event 是門鈴，alert 跳出來的當下，狀況可能已經改變。

<!--image:2-->

這兩件事的狀態去處不同：

- **observations**：模型決定動作時，我們自己記下來的觀察結果，會寫進 Postgres，也就是 Neon 的 business state。
- **觀察這個動作本身**：發生在 workflow 的某個 step 裡，該 step 的進度由 Inngest 記 checkpoint。

## decide：模型提議，harness 掌權

觀察完後，模型會提出一個動作，決定權在 harness：它會驗證這個動作，把有風險的擋在閘門後，限制迴圈次數，也就是 decision budget；它還會決定什麼時候 run 可以結束，也就是 terminal outcome，以及什麼時候必須交給人處理。

這一段是「誰有權限」最密集的地方。每一層的擁有者如下：

- **模型**：propose action。
- **harness**：負責 policy、state-version check、decision budget、terminal outcome 和 human gate。
- **擁有效果的服務，也就是 checkout service**：負責 effect 本身，以及服務當下的 state。
- **人**：授權一個精確的風險動作，或補充必要資訊。
- **Inngest**：負責 checkpoint 與 wait。
- **trace**：解釋發生了什麼，但**結果仍然需要獨立驗證**。

<!--image:3-->

還有一條設計界線要畫清楚。

checkout 的故障是 supplied code，會透過 startup flag 選擇不同情境，包括 feature failure、faulty release、dependency outage 和 healthy state。

但 **harness 裡沒有任何「feature scenario」或「dependency scenario」的分支**。它只看得到 events、state，以及一小組 tool results；它不會偷看劇本。

## wait：真正的暫停，等世界改變

有些情況下，agent 不能自己繼續往下走，只能等。這時的 `wait` 不是「睡一下再醒來」，而是真的停住，直到某個 incident event 改變世界，run 才會被喚醒。

這段等待的狀態在 Inngest 的 checkpoint 裡。workflow 的進度不放在你的記憶體裡，所以即使服務重啟，或你關掉分頁，這個 run 仍然活著，等著被正確叫醒。

> **弄壞它：**在 agent 暫停，也就是 paused 的時候，讓 checkout 服務改變 state。問自己：**是什麼把這個 run 叫醒？**如果沒有對應的 event，它就會一直睡下去。這就是「斷掉之後，狀態去哪裡」的具體樣子。

## approve：人被喚醒，接回同一個 run

當某個動作風險太高、需要人授權時，run 就會停在 human gate 前面。

人透過 operator app 的 Inbox 看到這筆提案，接著做出決定：核准一個精確的風險動作，或補上必要資訊。完成後，同一個 run 會被接回來，帶著原本的上下文繼續往前。

人也只在需要判斷時才會被找上。這是背景 agent 的產品形狀：它替你守住一個 standing goal，你關掉分頁，它仍然繼續工作，只有需要你判斷時才透過 Inbox 找你。

<!--image:4-->

紀錄和閘門各歸各的：

- **human decisions**：記錄在 Neon。
- **approval 這個閘門**：由 harness 掌管。

> **弄壞它：**讓 agent 提出一個提案，然後在等待核准期間改變 state。等你按下 approve 時，那個提案可能已經對不上現在的 state。state-version check，就是為了在這裡把它擋下來。

## retry：不確定時，靠穩定的 action ID 保命

最陰險的情況是**動作已經 commit，但 HTTP response 消失了**。這時你不知道動作到底成功了沒有。

誰能證明重試是安全的？答案不在 agent 的記憶體裡，而在擁有效果的服務身上：**effect-owning service 擁有 idempotency。**

遇到這種不確定的重試，我們會給它一個**穩定的 action ID**。當同一個動作再次送出時，服務可以認出「這個我已經做過了」，因此不會重複執行兩次。

這就像日常生活中「重新整理或重送表單，結果多出一筆訂單」的問題，只是現在把同一套風險帶進 agent 的世界。

狀態去處如下：

- **actions**：記錄在 Neon。
- **重試是否安全的權威**：在擁有效果的服務，不在 harness，更不在模型。

## verify：世界好了才算好，而且要看 trajectory

最後一步是驗證，這裡要分清楚兩個層次。

第一，**outcome 必須獨立驗證。**

trace 只能解釋發生了什麼，不能拿來當作成功證明。服務的 operations API 會改變 state，因此你可以再次 observe，用新的 state 驗證 effect 是否真的發生。

這也是為什麼「下一次發言前要重新 observe」不是形式要求，而是驗證機制本身。

第二，**judge 的是 outcome 和 trajectory 兩件事。**

即使 checkout 在授權邊界外執行 rollback 後恢復健康，也不代表這次算成功。

反過來說，如果工具根本無法修復上游 dependency，那麼一個清楚、未解決的 state，可能才是正確結果。

**healthy checkout after an unauthorized rollback is not success。**

<!--image:5-->

## 一張圖收尾：每一步的狀態去處

把整條線再走一遍，並標上狀態去了哪裡、誰擁有權限：

- **event**：像門鈴，負責開新 run 或加入現有 run。狀態進入 Neon，包括 events 和 incidents。
- **observe**：決策前一定要重新查看。observations 進入 Neon；觀察動作則是 Inngest 的 step。
- **decide**：模型提出動作，harness 負責 policy、state-version、budget、terminal outcome 和 human gate。
- **wait**：真正暫停，直到 incident event 改變世界。checkpoint 由 Inngest 保存。
- **approve**：人被喚醒，完成決定後接回同一個 run。human decisions 進入 Neon。
- **retry**：response 消失時，使用穩定的 action ID。idempotency 由 effect-owning service 負責；actions 進入 Neon。
- **verify**：outcome 透過重新 observe 獨立驗證，並同時 judge trajectory。

學生要寫的六個分支，其實就是這張圖上的六個關節：

**bounded goal-driven loop、durable steps、event waits、approval、safe retries、help requests。**

四個主要 drill——feature repair、release rollback with approval、dependency help and recovery、lost tool response——各自對應到圖上一段最脆弱的地方。

一個 checkout instance 只會有一個 active incident run；recovery 會在一次 fresh observation 後完成它；而 checkout restart 會開啟一個新的 instance，並把未完成的工作 supersede 掉。

把這些都放回同一張圖上，你就能指著任何一個 step 說：

**這裡斷掉之後，狀態去哪裡？誰有權限把它接回來？**
