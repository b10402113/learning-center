# 測試 public API

Legacy code 就是沒有測試的 code。它通常不是寫壞了，而是從來沒測過；沒測過的 code，修改時就有風險。你可能會想，讓 agent 補上測試就好。但 agent 替 legacy code 補測試時，常常會寫出不好的測試。

這些問題有跡可循。agent 學到的許多 repo，都把測試綁在 code 的結構上：直接呼叫 private function、檢查某個 internal call 有沒有發生，或是一個 class 配一個測試檔。這種測試在重構時容易壞掉，即使行為完全沒變。測試常常壞，久了就沒人想看，也就失去價值。

## 一個 unit 就是一個行為

unit 的定義很簡單：透過 public API 暴露出來、可以觀察到的單一業務行為。unit 是一個行為，不是一個 method，也不是一個 class。測試應該綁定這個行為，並用 app 裡其他 code 呼叫它的方式來測試。

交給 agent 的規則可以分成四條：

- 透過 public API 測行為：route handler，以及 app 真正會呼叫的 domain function。
- 檢查結果：state、response，或資料庫裡的那筆 record。
- 不測 private helper，也不檢查某個 internal method 有沒有被呼叫。
- 不 mock 自己的 module，只 mock 不屬於自己的外部系統。

<!--image:1-->

最後一條是 agent 最常犯的錯。把自己的 module mock 掉，就等於把要測的東西從測試裡拿掉。測試亮綠燈，只能證明 mock 有回應，不能證明你的 code 正確。測試要從 public API 進入、從結果確認；中間的 code 要怎麼拆、怎麼搬都可以，只要行為沒變，測試就應該維持綠燈。

## 五種 test double

test double 是由測試控制的依賴假版本。一共有五種；如果不加限制，agent 往往會全部用 mock。

| Double | 做的事 | 什麼時候用 |
|---|---|---|
| Dummy | 沒有行為的 placeholder，只是讓 code 能編譯 | 被測函式不會用到的 logger |
| Stub | 回傳事先準備好的值 | 提供測試輸入，例如從 API 硬編碼而來的薪資資料 |
| Spy | 記錄呼叫與參數，之後再檢查 | 確認「一次失敗的註冊剛好記了一條 error」 |
| Mock | 先設定預期，再驗證對外互動 | 檢查傳給不屬於自己的外部系統的指令，例如「事件已送到 Datadog」 |
| Fake | 輕量但可實際運作的實作，例如 in-memory repository | 測試自己的 repository。它能檢查狀態，因此測試不容易被重構影響 |

選哪一種，關鍵在於依賴是不是自己負責的。自己的 repository 用 fake，因為 fake 會實際儲存資料，也能檢查狀態。Datadog 這類無法控制的外部系統才用 mock，因為在這個邊界上，能確認的只有「指令已送出」。

<!--image:2-->

## 誠實的 double

「誠實」的意思很明確：double 不會讓 agent 對依賴的錯誤假設看起來成立。五種 double 裡，dummy、stub、spy、mock 都不會驗證系統的狀態。mock 驗證的是對外互動，所以只能確認「指令有送出去」；對方收到後怎麼處理，並不在測試範圍內。因此，測試亮綠燈所代表的範圍，永遠比你想像的窄。fake 則不同，它會實際執行一份實作並檢查狀態，錯誤假設不容易藏起來。

這就是「不 mock 自己的 module」這條規則的原因。自己 module 的狀態是自己要負責的事；用自己寫的 fake，測試才驗得到真正的結果。

<!--image:3-->

比起只寫規則，更有效的方法是在 codebase 裡放一份手寫的 fake，並在 prompt 裡直接指出來。agent 沿用既有 pattern，通常比遵守一般性的抽象建議可靠。放一個 in-memory repository 作為範例，agent 就能沿用相同做法，而不是另外發明一套。

## 這一步只定兩件事

這一步不修改任何 production code，只決定兩件事：測試的邊界在哪裡，也就是 public API 上的單一業務行為；以及每個依賴要換成哪一種 double。這兩件事確定後，後續才有安全網可以鋪。

不過決定歸決定，這些 double 要真的放得進去，前提是 code 本身可以被測。那是下一段要處理的事。
