# 第一次跑，只挑一個 module

上一段說明 mutation score 比 coverage 更能反映測試品質。分數不會自己出現，要跑一次工具才有；而第一次跑，只需要一個 module。

mutation testing 的流程固定：工具每次在程式碼裡植入一個小 bug，重新執行整套測試，再記錄結果。測試失敗，mutant 就被殺掉；整套測試都通過，代表 bug 漏了過去。每個存活的 mutant，都表示測試套件有一個地方沒抓到問題。

完整流程是先跑 baseline，再選工具、手寫 config，接著只測一個 module。每個 survivor 都要用一句話說清楚，並寫測試把它殺掉。最後要了解 CI 如何只 gate 改動行。

## 先跑兩次 baseline

mutation tool 不會接受測試本來就失敗的 baseline。baseline 不綠，後續每個 mutant 的判定都沒有意義，所以一開始要把整套測試跑兩次。

兩次都通過才算數。如果同一個測試兩次結果不同，那就是 flaky test，後續每個 mutant 的判定都是噪音。這種測試要隔離：skip 掉，並用註解寫清楚原因，以及需要人類決定的事項。除非看得出真正的缺陷，而且修法就在測試裡，否則不要動它，更不要為了讓測試符合某個方向而另訂規格。

專案只有 e2e 測試、測試只能在 CI 執行，或整套測試在本機要跑好幾分鐘，也同樣是 BLOCKED。mutation testing 需要一套能在本機快速執行的單元測試，缺少這套測試本身就是一項發現。在 monorepo 裡，要在目標 module 所屬的 package 內工作。絕對不要為了取得一個數字而排除失敗的測試。

## 安裝工具，自己寫 config

工具要安裝在專案裡，不要執行互動式的 init wizard，config 檔要自己寫。要全域安裝之前，先詢問。JavaScript、TypeScript 專案使用 StrykerJS。

config 主要要設定兩件事：要測什麼，以及用哪套測試來殺 mutant。TicketBay 的 domain 設定如下：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/stryker.config.json#L2-L12 -->
```json
{
  "packageManager": "npm",
  "testRunner": "vitest",
  "vitest": { "configFile": "vitest.unit.config.ts" },
  "mutate": ["src/domain/**/*.ts"],
  "coverageAnalysis": "perTest"
}
```

測試 runner 要指向 unit lane，而不是整套測試。每次 sandbox run 都啟動一個 Postgres container，速度太慢；而且 src/domain 以外的測試本來就無法殺掉 domain 的 mutant。coverageAnalysis 設為 perTest，工具就不用為每個 mutant 重跑整套測試。

## 第一次只跑一個 module

挑業務上最關鍵的檔案：使用者指定的檔案，或是發生無聲 bug 時代價最高的檔案，例如金額計算、權限或資料寫入。沒人指定時，就自行挑選；README 或套件結構通常能看出商業邏輯放在哪裡。挑好後，要說明選了哪個檔案，以及選擇的理由。

這樣做有實際原因。真實 codebase 第一次就跑整個 repo，可能要好幾個小時，而且常常跑到一半就中斷。一個 module 幾分鐘就能跑完，也足以確認這條路值得繼續。第一次成功後，才擴大範圍。如果專案小到一個 module 就是整個 codebase，就如實說明並繼續，不要為了符合這個步驟硬找更小的範圍。

執行時只輸出到 console，不要讓工具在磁碟留下報告檔。survivors 直接從 console 查看。

<!--image:1-->

## 每個 survivor 都要用一句話說明

每個存活的 mutant，都要用一句話解釋給沒有寫測試的人聽：它改了什麼，以及某個具體輸入會得到什麼錯誤輸出。

例如，手續費上限被刪掉，就寫：「1,000 歐元的訂單付了 30 歐元手續費，而不是 20 歐元的上限。」數字要保留。「大額訂單被超收」沒有具體資訊，無從查證。

說明完後，依照 blast radius 排優先順序：金錢和資料遺失相關路徑排最前面，邊界條件其次，log 和格式化最後。

## 殺掉它，或寫一份 claim

能殺掉的 survivor，就新增一條驗證商業結果的斷言，再重跑工具，確認 mutant 確實被殺掉。沒有重跑確認，就只有一條新測試，不能算殺掉了 mutant。

殺不掉的 survivor，不能自行認定它是 equivalent。最想讓 gate 變綠的 agent，往往也最可能把能殺掉的 mutant 說成殺不掉。所以這裡要寫的是 claim：說明為什麼沒有任何輸入能分辨 mutant 和原版，並指出這個判定適用於 in isolation，還是只適用於 context 裡。

<!--image:2-->

## 硬規則

- 永遠不要改 config 來提高分數。分數只是信差。排除檔案、調高 timeout、關閉某個 mutator、跳過一個測試檔，都是為了讓分數變綠而做的事，一律禁止。
- 殺 mutant 的測試要驗證商業結果，不是 mutant 的行為。如果無法用一句話說明這條測試替使用者保障了什麼，那就是一條只為了推高數字而寫的測試，應該刪掉。
- 關鍵路徑上的一個 survivor，比任何分數都重要。即使分數有 95%，付款程式碼裡還有一個 mutant 存活，結果仍然是紅的。
- production source 唯讀。測試、build 檔和 tool config 可以修改，但報告必須列出每個碰過的檔案。
- 一個 shell call 只執行一個指令：`for` 迴圈、`&&` 串接、`;` 串起來，或 pipe 進 `tail` 都不行。每個複合指令都會讓 harness 停下來詢問權限。
- 工作要留在 repo 裡。暫時腳本和等價性檢查放在專案自己的忽略目錄，或你的 agent workspace；不要放到隔壁資料夾或系統 temp。

## CI 只測改動的行

TicketBay 的 CI lane 由一支腳本執行。腳本從 git diff 找出這次改動在 src/domain 裡的行，並把這些範圍設為唯一要 mutate 的範圍：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/scripts/mutate-changed.mjs#L16-L16 -->
```bash
node scripts/mutate-changed.mjs origin/main
```

腳本會自行組出一份範圍較窄的 config，把從 diff 收集到的 `file:start-end` 放進 `mutate`，再把所有門檻設為 100：

<!-- source: sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/scripts/mutate-changed.mjs#L52-L62 -->
```js
const config = {
  $schema: "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  packageManager: "npm",
  testRunner: "vitest",
  vitest: { configFile: "vitest.unit.config.ts" },
  mutate: ranges,
  reporters: ["clear-text", "progress"],
  coverageAnalysis: "perTest",
  thresholds: { high: 100, low: 100, break: 100 },
};
```

只 gate 改動行有兩個原因。整個 domain 的測試要跑好幾分鐘，而且原本就有幾個能證明等價的 survivor。若用 PR 沒改過的舊 survivor 判定 PR，會讓每個 PR 都變紅。改動行上的任何 survivor 都必須讓 gate 失敗，因為它只可能是兩種情況：缺少一條測試，或是等價的 mutant。機器無法分辨這兩者，所以 survivor 一律讓 gate 變紅。

沒有改動行時，腳本會直接回報 nothing to mutate，並以 exit 0 結束，不會拿空範圍執行沒有意義的 mutation。

<!--image:3-->

## 分數看不見的東西

mutation testing 評估的是「現有測試」能否抓出「已經寫好的程式碼」中的問題。從未實作的商業規則不會產生 mutant，所以完全缺少某項功能，也可能拿到 100% 分數。不同工具的能力也不一樣：有的只逐一修改運算子，有的只替換整個函式本體。較弱的 mutator 即使得到 100%，背後仍可能藏著一個沒有測到的 off-by-one。

因此，報告分數時要一併說明工具名稱和已知盲點，不能只報一個百分比。

## done means

- 範圍內的程式碼不能有任何 survivor 會改變金額、權限或已儲存的紀錄。
- 每個 survivor 都要用一句帶有具體數字的話解釋。
- 新增的每條測試都要驗證商業結果，並且重跑工具確認它殺掉對應的 mutant。
- repo 必須乾淨：工具輸出目錄要刪除或加入 gitignore，config 裡的 scope 要在完成時放寬或移除，報告要列出新增和修改的每個檔案。要用檔案系統確認，不能只看 `git status`。有些工具會在自己的輸出目錄裡寫一份 `.gitignore`，於是 `git status` 顯示乾淨，幾百 MB 的檔案卻還留著。

跑完一輪，survivors 清單上通常還剩幾個殺不掉的。上一段說殺不掉就要寫 claim，下一段處理那份 claim 要怎麼被檢驗，以及誰有權把它排除。
