# 失敗落在效果與確認之間

在呼叫遠端服務或背景 API 時，如果收到 503 Service Unavailable，一般直覺往往是「剛才的請求失敗了，重新發送一次就好」。但在分散式架構中，最危險的狀況往往不是請求沒送達，而是請求已經執行成功，確認回應卻在回傳途中遺失。

這就是「失敗落在效果與確認之間」（failure lands between an effect and its acknowledgement）。

### 回應遺失不等於操作失敗

假設工作流程正在執行關閉特定功能的動作。在服務端，功能狀態已經變更，資料庫也已經寫入：

<!-- source: sources/background-agent/20261105/service/checkout.ts#L153-L160 -->

```typescript
    case 'disable_feature': {
      state = { ...state, featureEnabled: false }
      recordChange('Disabled checkout express feature')
      if (activeFault === 'feature') recover('feature disablement')
      else version++
      result = { featureEnabled: false, version }
      break
    }
```

然而，就在狀態更新完成、準備把成功結果回傳給客戶端時，網路連線發生中斷，或是伺服器拋出了 503 錯誤：

<!--image:1-->

<!-- source: sources/background-agent/20261105/service/checkout.ts#L171-L179 -->

```typescript
  if (
    loseNextActionResponse &&
    (input.name === 'disable_feature' || input.name === 'rollback_release')
  ) {
    loseNextActionResponse = false
    return response
      .status(503)
      .json({ error: 'Simulated acknowledgement lost after the operation committed' })
  }
```

這時客戶端或背景 Agent 看到的只是一個 503 錯誤，工作流程無法確認剛才的操作到底是有做還是沒做。持久化執行架構（durable execution）雖然能儲存每一個成功步驟的輸出，但它沒辦法儲存一個「從未收到」的回應。

如果這時採取天真的重試策略——每次重試都隨機產生一個新的識別碼（Action ID）重新發送——伺服器就無法判斷這個請求到底是一次重試，還是一筆全新的操作。在真實系統中，這類天真重試可能導致重複扣款、寄出兩封重複的 Email、重複部署版本，或是建立兩張相同的工單。

### 為什麼不該把多個副作用塞進同一個 Step

要避免重試帶來災難，第一條原則是：不要把多個具有副作用（產生實際變更）的非同步操作打包在同一個 step 裡。

如果一個 step 依序呼叫了 A、B、C 三個操作，當 A 和 B 執行成功，卻在執行 C 時拋出錯誤，工作流程引擎會判定整個 step 失敗並重新執行。這意味著 A 和 B 會再被執行一次，因為它們被綁在同一組執行邊界內，引擎無法自動跳過前半段。

<!--image:2-->

只要把每個具破壞性或會改變狀態的操作拆成各自獨立的 step，工作流程就能自然獲得細粒度的重試能力：A 成功就記錄 A，B 成功就記錄 B；只有失敗的 C 會被重跑，完全不需要在 step 內部自己手刻交易機制來追蹤進度。

### 步驟本身必須具備冪等性

將操作拆成獨立 step 之後，還必須面對另一個問題：Step 內部的業務邏輯如果不具備冪等性（idempotence），重試依然會壞掉。

舉例來說，某個 step 負責呼叫一段包含 50 行業務邏輯的 API。這段程式碼在前半段建立了使用者資料，卻在後半段處理其他邏輯時發生未預期的例外中斷。當這個 step 收到錯誤重新執行時，程式碼又試圖拿同一個 Email 去建立使用者，結果因為「使用者已存在」而直接噴錯中斷。

<!--image:3-->

原本第一次中斷可能只是短暫的網路波動，重試本該修復問題，卻因為程式碼沒有處理「操作已經部分完成」的情境，導致工作流程卡死。

處理副作用重試時，除了將步驟拆小，重試時也必須攜帶穩定的識別碼（derived ID），讓下游接收端能辨認出「這是同一個意圖的再次嘗試」，確保就算重跑，效果也只會落地一次。
