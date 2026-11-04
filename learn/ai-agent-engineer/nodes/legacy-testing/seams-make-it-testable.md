# Make it testable：替依賴裝上 seam，照 assess→propose→批准走

Legacy code 就是沒有測試的 code。上一段決定了要測哪個行為、每個依賴該用哪一種替身；但 legacy 的依賴常常直接長在函式裡面，替身沒有地方可放。這份工作的真正交付成果是一張**網**：鋪在承載商業行為的程式碼底下，讓任何人開始重構之前，都先有測試保護。

測試 legacy app 有固定的四個步驟，第一步永遠是 make it testable。流程是先 assess，再提出計畫，停下來等一次批准，之後就照計畫執行到底。這樣做的原因很直接：code 難測，最常見的原因是依賴。資料庫、API、message queue、時鐘和檔案系統，在測試裡不是太慢、太不穩，就是根本不存在。

## Seam：不改結構就能改變行為的地方

seam 是「可以改變行為，卻不必改變結構」的地方，也就是能讓測試放入 fake 的那道縫。

做法樸素得有點意外：把函式裡建立的依賴改成參數或 constructor 參數，並以現在使用的值當預設值。`new Client()`、`Date.now()`、`fs.readFileSync` 都是這種形式。這樣一來，呼叫端不必修改任何一行，仍會照原樣運作；測試則能從那道縫傳入替身。

- `new Client()` → 收一個 client 參數，預設值是 `new Client()`
- `Date.now()` → 收一個 `now`，預設值是 `Date.now()`
- `fs.readFileSync` → 收一個讀檔函式，預設值是原本的讀檔函式

<!--image:1-->

時鐘要另外處理：**每一個會讀時間的函式，都把 `now` 當成參數收進來**。時鐘是最常見、也最容易替換的依賴。注入時鐘後，退款視窗、到期日等邏輯就能測試。

## 個別判斷每個依賴：保留真的，或換成假的

替換依賴不代表要把所有東西都換成 double。每個依賴都依照以下三種情況判斷：

- **快的**（in-memory store、純計算）→ 保留真的。測試會更接近真實情況。
- **承載商業邏輯的**（pricing rules、code 依賴其 constraint 的資料庫）→ 也保留真的，但建立測試實例，例如用 Testcontainers 啟動資料庫。這樣測試才有意義。
- **慢或不可靠的邊緣**（payment provider、email、第三方 API）→ 換成 test double：介面相同的 fake，或回傳預錄回應的 stub。

<!--image:2-->

完成的標準很明確：target 區域裡的每個函式，都能在測試中呼叫，**不需要網路、不需要真的第三方服務，也不需要牆上的時鐘**。

## 先 assess，再擬定計畫

第一步不是寫測試，而是確認範圍。從 repo root 執行 `scripts/assess.sh [path]`（path 可以是檔案或資料夾），就能列出 repo 裡所有 import 這個目標的測試，以及沒有任何測試 import 的檔案。

取得清單後，接著檢查內容：

- 閱讀既有測試，也閱讀三塊最大的未測區域。
- 找出每塊區域裡 **load-bearing** 的行為：金錢、權限，以及不能遺失的資料。
- 列出 target 的 **entry points**，也就是外部輸入能抵達它的每個地方：HTTP route、CLI command、message handler、parser，或被其他程式以使用者資料呼叫的 exported function。可以在測試之外 grep 這個 target 的 imports，再一路追到邊界。

完成的標準是：對每塊區域，都能說明它做什麼、依賴什麼、哪些測試碰過它、entry points 在哪裡，以及出錯會如何傷害業務。

<!--image:3-->

## 提出計畫，然後停下來等一次批准

第二步是用以下模板寫計畫：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/skills/skills/legacy-testing/SKILL.md#L33-L41 -->
```text
Area: <files> — load-bearing: <behaviour>
Entry points: <route / command / handler / exported function> → <target>
1. <step> on <target> — why: <reason from the assessment>
2. ...
n. Crash-hunt property on <each entry point> — why: outside input reaches it; no input may crash it
n+1. Invariant properties on <rules> — why: <the rules with edge cases>
last. Refactor <target>: <the structure change> — why: <what the assessment found hard to read or change>
Skipped: <step> — why not needed here
Target: mutation score on <area> ≥ <n>% (coverage is a hint, not the goal)
```

從 menu 裡選出 repo 真正需要的步驟。assess 判斷不需要的步驟就跳過，並寫明理由。refactor 預設是計畫的最後一步；只有使用者明確要求，才能拿掉。完成的標準是：每個選中的步驟，都寫明 target（檔案或函式）以及選擇它的理由。

計畫寫完後就停下來，等一次批准。使用者只需要判斷兩件事：計畫是否瞄準 load-bearing 的行為；測試驗的是行為，還是目前的實作。批准計畫，也就代表批准其中的 refactor 步驟。

<!--image:4-->

批准後，不要再問「要繼續嗎」。依照順序完成每一步：開啟該步的 playbook、執行、跑測試，再進行下一步。只有三種情況需要停下來詢問：要把一個 mutant 標記為 equivalent；要修改計畫中沒有列出的 CI 或設定；或想直接修正 suspected bug，而不是把它 pin 住。refactor 要等 measure 步驟達成目標後才開始，並且與測試分開 commit。

最後只回報一次：執行前後的分數、新增的測試、發現的 suspected bugs（包括 crash hunt 抓到的問題）、refactor 的修改內容，以及尚未決定的事項。回報前先刪除所有 TEMPORARY 檔案。

## Payout report 的判斷

TicketBay 的 payout report 是一個例子：程式有三百行，直接在裡面讀取時鐘、手續費寫死、使用 raw SQL，而且沒有測試。

最後的決定不是「全部換掉」，而是**一半保留真的**：report 使用真實資料庫，因為哪些 orders 能納入報表，是由那段 SQL 決定的，這屬於商業邏輯；時鐘和 email 則加上 seam，讓測試能替換它們。修改後，mutation score 從 85% 升到 91%，達到計畫設定的 90% 目標；重構後的 79 個測試也全部通過。

## 換來的是「可測」

make it testable 不會改變任何行為，只會把依賴從函式裡移到函式外。依賴移出來後，測試才有縫可以進入，後續的 characterize、measure 也才有立足點。

縫開好了，下一個問題是：這段 code 現在到底在做什麼。
