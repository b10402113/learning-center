# Cover the behavior：先補齊覆蓋，refactor last

測試 legacy app 的四步流程已進入後半段：第三步是 cover the behavior，第四步是 refactor last。順序不能顛倒。**只有安全網撐得住，而且該區域的 mutation score 達到計畫目標後，才能開始重構。**

第三步要補上 example test 想不到的部分。property test 會生成意料之外的輸入；coverage 會指出從未執行過的程式行；mutation testing 則會找出沒有任何測試檢查的行為。三種工具各自補足不同盲點，缺一不可。

## Property test：讓工具生成輸入

property test 會生成大量輸入，檢查一條「對每個輸入都必須成立」的規則。測試失敗時，函式庫會把輸入縮小成最精簡的失敗案例，方便重現。

測試 legacy code 時，要寫兩種 property，順序固定：先做 crash hunt，再驗證 business invariants。

## 一、crash hunt：每個 entry point 都不能 crash

entry point 是外部輸入進入這段 code 的地方。例子包括 HTTP endpoint、CLI command、message 或 queue handler、檔案或字串 parser，以及其他 code 使用使用者資料呼叫的 exported function。

legacy code 常在沒測過的輸入下 crash，例如空的結果集、不合法的日期或缺少欄位。每次 crash 發生在 production，都可能造成 500，或拋出未被捕捉的例外。

每個 entry point 的 property 只有一個要求：**不管生成什麼輸入，呼叫都必須以已處理的結果結束。**

- HTTP：status 必須低於 500，body 必須能解析成文件規定的型別（例如 JSON，且符合文件描述的 shape；4xx 必須附上 error body）。
- CLI：exit code 必須是 0，或文件規定的錯誤碼；stderr 不能出現 stack trace。
- Handler 或 function：必須回傳一個值，或拋出文件規定的錯誤型別（例如 `ValidationError`）。`TypeError`、`RangeError`、null 解引用、index 超出範圍和 timeout，都算違反規則。

generator 要混合不同輸入：用 `oneof` 把有效值和錯誤值混在一起，讓大部分測試能通過驗證，真正執行到邏輯。只生成錯誤輸入的 generator，只能測到驗證器。

輸入類別也要涵蓋完整：字串（空字串、空白、一萬字、unicode、NUL byte 與控制字元、引號、`;`、`../`、`%`）；數字（0、-1、`NaN`、`Infinity`、最大安全整數，以及值相同但帶小數的數字）；日期與區間（不合法日期、`from` 在 `to` 之後、零長度區間、閏日、日光節約換日）；ID（格式正確但不存在的 ID、別人的 ID、格式錯誤的 ID）；結構（缺少參數、重複參數、型別錯誤、未知欄位、空 body、非 JSON body）；資料狀態（零列、一列、欄位為 null 或 0 的列，以及很多列）。

<!--image:1-->

呼叫要留在對外暴露的那一層，並且在 in-process 執行：route handler 接收一個 `Request`、CLI 的 main 函式接收一個 argv 陣列、handler 接收一個 message 物件，資料庫則使用原本的那一個。

run 的設定也要固定：使用固定 seed，失敗時印出 seed。本機狩獵時，每個 property 約跑一千次；CI 則跑二十五到一百次。

測試途中失敗很常見，處理方式如下：

- 把縮小後的輸入加成普通測試，命名為 `pins current behaviour — suspected bug: <input> crashes with <error>`。
- 把問題列入最終報告的 suspected bugs 清單。
- 用註解將這類輸入從 generator 排除，並指出對應的 pin 測試。這樣 property 能維持綠燈，也能繼續尋找其他 crash。
- **不要修正這個 crash。** 修正會改變行為，應由使用者看過報告後決定是否處理。

## 二、business invariants：檢查規則邊界

第二種 property 用來檢查業務依賴的規則，是否對所有輸入都成立。bug 常藏在規則的邊界，因此要先把規則寫成一句話，再把它寫成 property：

- 錢：退款永遠不能超過實付金額；各部分加總必須等於總額。
- 上限：賣出的座位數永遠不能超過可用座位數。
- round trip：`parse(format(x))` 等於 `x`。
- 順序：如果規則是輸入越大、費用不會越小，就要驗證費用確實不會變小。

<!--image:2-->

property 失敗時，也要把縮小後的輸入加成普通測試。如果它在目前的 code 上失敗，就是 suspected bug：用測試 pin 住，列入清單，不要順手修正。

各種語言都有現成的函式庫：JavaScript 與 TypeScript 可用 fast-check，Python 可用 Hypothesis，Java 與 Kotlin 可用 jqwik，.NET 可用 FsCheck，Rust 可用 proptest，Go 可用 rapid。這些函式庫都能設定 seed 和執行次數，例如 `fc.assert(prop, { seed: 42, numRuns: 50 })`。

## Measure：coverage 是提示，mutation score 才是目標

要確認安全網完成之前，先測量兩個指標。它們回答的問題不同：

- **Coverage** 顯示哪些程式行從未執行。用它找盲點，不要把它當成目標。
- **Mutation testing** 顯示哪些行為從未被檢查，即使那些程式行已經執行過。它會在 code 裡植入小型 bug，再計算測試殺掉多少個。**load-bearing 區域的 mutation score** 才是目標。

mutation testing 很耗資源，因此要從兩方面縮小範圍：

1. 只變異 target 檔案。Stryker 使用 `npx stryker run --mutate <file>`，Pitest 使用 `targetClasses`，mutmut 使用 `paths_to_mutate`。
2. 只執行相關測試。`scripts/assess.sh <file>` 會列出 import 這個 target 的測試。若已有 project script，就使用它；否則將 runner 指向那些測試（Stryker 的 vitest runner 接受 `vitest.dir` 或 `vitest.configFile`）。
3. 臨時設定檔必須標示為 **TEMPORARY**：第一行寫上 TEMPORARY 和理由，不要 commit，回報前也要刪除。計畫未列出的 mutation 設定或 CI 設定，都不要修改。

每個 surviving mutant 都要用一句話解釋，然後補上能殺死它的測試，或標記為 equivalent 並附上理由。

完成標準是：dry run 只涵蓋相關測試，而且 target 區域的 mutation score 達到已核准計畫中的目標。

<!--image:3-->

## Refactor last

指標達標後，才能進入第四步。重構要遵守「不改變 code 的行為」，只改善命名、設計和架構。

重構時要注意以下幾點：

- 小步進行，每一步完成時都要讓測試維持綠燈；能用 IDE 的自動重構功能就用。
- 每個 refactor commit 只改結構。行為變更要獨立提交，並附上自己的測試。
- 把註解改寫成命名清楚的函式；重複出現第三次時才去重。
- 重構完成後，刪除已被 functional test 覆蓋的 approval test。

完成標準是：該區域容易閱讀、全套測試都通過，而且 mutation score 不低於重構前。

<!--image:4-->

## 收尾成果

TicketBay 的 payout report，mutation score 從 85% 升到 91%，超過計畫設定的 90% 目標。重構後，79 個測試全部通過。

順序就是先補齊安全網並達到目標，再調整結構，最後移除過渡用的測試。
