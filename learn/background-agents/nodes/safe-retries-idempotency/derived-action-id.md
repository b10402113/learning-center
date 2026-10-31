# 讓 ID 可以被推導出來

上一步提到，同一個 run 永遠使用同一個 key。這表示重播時，key 必須維持不變。

## randomUUID 本身沒有問題

最初的版本使用隨機 UUID，理由很簡單：我不在乎，隨機就好。

對於「每次呼叫都是新工作」的系統，隨機 ID 沒問題；但對 durable execution 來說就不行。step 重跑時，程式會再次執行 `randomUUID()`，並取得不同的值。

服務看到新的 key，自然會把它當成新工作。去重的前提是兩次呼叫使用相同的識別碼，而隨機 ID 保證兩次的結果一定不同。

因此，我們移除了隨機 UUID，改用 Inngest 內建的機制處理 idempotency。改變的是 ID 的產生方式，不是 step 裡的商業邏輯。

## 根據重播時不變的座標推導

新的規則是：根據 replay 時不會改變的資訊推導 ID。

run ID 不變：同一個 run 從頭到尾都只有一個 ID。cycle 不變：同一個 cycle 重播時，仍是同一個號碼。decision 也不變：同一個 cycle 做出的同一個決定，重播時仍是同一個決定。

run ID、cycle、decision，三者組合起來，就能得到始終相同的 action ID。這就是 deterministic 在這裡的意思。

<!--image:1-->

例如：run `run-abc` 的第 3 個 cycle 做出決定 `rollback_release`，推導出的 ID 是 `run-abc:3:rollback_release`。第一次執行時是這個字串，crash 後重跑時也還是同一個字串。

有些資訊不能納入推導。`Date.now()` 每次都不一樣。retry 的 attempt 次數也會改變：第一次是 1，重跑時就變成 2。若把這些資訊放進 key，重播時就會產生新的 ID，去重也會立刻失效。

## 為什麼 cycle 必須納入 key

只使用 run ID 並不足夠。同一個 run 會經歷很多輪，每一輪都可能做出決定。

如果 key 只有 run ID，第 2 輪的 rollback 和第 5 輪的 rollback 就會共用同一個 ID。

<!--image:2-->

共用同一個 ID 會怎樣？服務會認為這個 ID 已經處理過，於是回放第 2 輪的結果。第 5 輪真正要做的事，就會被誤認為重複操作。

因此，我們把範圍從「run 加 action」縮小到「cycle 加 action」，讓識別更精確。

action ID 一旦可以推導，前面的 step 就安全了，而且 step 的內容不必修改。同一個 step 重跑時，送出的仍是同一個 ID。服務辨識出這個 ID 後，就會回放結果。

同一個 key 永遠會指向同一個 intent。但即使某個 intent 在兩個 cycle 之前是正確的，現在也不一定適用。
