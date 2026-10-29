# Capstone 四個 trial：先預測，再跑，再對照

上一節把一個 run 的一生畫成一張圖。現在，把那張圖放進真實世界驗證。

最後兩段 code edit 刻意做得很小：一個 action ID，以及一條 help 路徑。

寫 code 不難，難的是世界真的變了之後，它們還要照樣運作。所以這個 capstone 要看的不是報告有沒有說服力，而是整套 harness 系統。

開始之前，先讓 agent、operator app 和 Inngest 持續執行。

每一次 trial 開始時，先在 checkout 的 terminal 按下 Ctrl-C，再用題目提供的指令開啟一個全新的 checkout instance。

同時開著以下四個畫面：

- [Activity](http://127.0.0.1:5173/activity)
- [Events](http://127.0.0.1:5173/events)
- [Inbox](http://127.0.0.1:5173/)
- [Inngest traces](http://127.0.0.1:8288)

動手之前，先記下新的 run ID。run ID 就是這次 run 的編號，之後所有動作都要對回這個編號。

這裡有一條規則要先說清楚：模型可以用不同方式選擇和思考，但下面每一項要證明的不變量（invariant）不能改變。

每一次 trial 開始之前，先做兩件事：預測「可以接受的終局」會是什麼樣子，以及每個 effect 的權限擁有者是誰。

effect 指的是這次 run 真正會改變世界的那個動作；權限擁有者則是有權決定「這個動作可以執行」的角色。

跑完之後，再回頭記錄四件事：service 的狀態、action 的順序、人做了哪些決定，以及 run 的報告是否能被這些紀錄支持。

<!--image:1-->

四個 trial 各自用一行指令重開 checkout，各自證明一件事。

<!--image:2-->

## Trial 1：一次 incident，好幾個 alert

<!-- source: sources/background-agents/20261027/lessons/advanced-lab/index.md#L11 -->
```bash
npm run dev:checkout -- --fault feature --alerts 3 --interval-ms 1000
```

要證明的是：這幾個 alert 會被併進同一個 active incident。

agent 可以檢查不同的證據，但在完成之前，必須先觀察到 checkout 處於健康狀態。

## Trial 2：有範圍的人工權限

<!-- source: sources/background-agents/20261027/lessons/advanced-lab/index.md#L12 -->
```bash
npm run dev:checkout -- --fault release
```

先在 Inbox 裡拒絕那個 rollback。

預期結果是：rollback 不應該發生，而且 run 應該 escalate。接著用相同的 flag 重開 checkout，批准新的 proposal，並在真正執行操作前，確認目前批准的版本仍然對得上。

<!--image:3-->

## Trial 3：不確定的 acknowledgement

<!-- source: sources/background-agents/20261027/lessons/advanced-lab/index.md#L13 -->
```bash
npm run dev:checkout -- --fault feature --lose-next-action-response
```

有一個 operation 已經 commit，但第一次回應是 503。

Activity 應該顯示一次失敗的嘗試。接著使用**同一個 action ID** 重試，service 會回傳它已經記錄過的結果，而 effect 只會套用一次。

<!--image:4-->

## Trial 4：help 是 context，不是 recovery

<!-- source: sources/background-agents/20261027/lessons/advanced-lab/index.md#L14 -->
```bash
npm run dev:checkout -- --fault dependency --recover-after-ms 45000
```

當 checkout 還處於 degraded 狀態時，前往 Inbox 回答那個問題。

同一個 run 應該 resume、繼續 wait，並在 `health.recovered` 上醒來，重新觀察狀態，最後才完成。

四個 trial 講的是同一件事：先寫下「什麼是可以接受的結局」，以及「誰有權執行哪個 effect」，再讓世界發生變化，看看這套 harness 有沒有守住你事先寫下的答案。
