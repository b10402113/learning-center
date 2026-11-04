# 只在改動的 code 上把關

Mutation lane 在每個 pull request 上，只對這次修改過的行執行 mutation。
檢查範圍不是整個 repo，而是這次的 diff。
這樣設計有三個考量：為什麼只檢查改動行、為什麼門檻設為 100%，以及由誰判定 equivalent mutant。

## 為什麼只檢查改動行

完整的 domain mutation 需要好幾分鐘。
而且早已確認有幾個 survivor 是 equivalent mutant。
如果用這些與本次改動無關的舊問題來判斷 PR，每個 PR 都會變紅。
PR 真正需要檢查的是這次修改的 code，因為這些行才是 review 的對象。
因此，`mutate-changed.mjs` 使用 git diff，找出這次在 `src/domain` 新增或修改的行，整理成一段段 range，再只對這些 range 執行 Stryker。
如果這次沒有改到 domain，就不執行 mutation，直接放行。

<!--image:1-->

## 為什麼門檻是 100%

在修改過的 code 裡，存活下來的 mutant 只有兩種可能：少了一個測試，或是它本來就是 equivalent mutant。
機器無法分辨這兩種情況。
因此，只要有任何 survivor，gate 就會變紅；設定中的 break 是 100%。
發現 survivor 時，第一步是補上能殺死它的測試，而不是想辦法把它註記掉。

<!--image:2-->

## equivalent mutant 的責任邊界

有些 mutant 確實無法殺死，因為改動後的 code 對所有輸入都會回傳相同結果。
例如，費用超過 100 就壓在 100；把 `>` 改成 `>=`，在費用剛好是 100 時，兩個版本都會回傳 100，沒有任何測試能分辨它們。
這就是 equivalent mutant。
要排除它，必須寫一行註解，指出是哪個 mutator，以及排除的理由：
`// Stryker disable next-line <Mutator>: equivalent — <why>`
但這個判斷不能由 agent 自行決定。
agent 找到 survivor 後，先寫測試嘗試殺死它。
如果 agent 認為它殺不掉，因為這項改動不影響行為，就必須停下來，把理由交給你判斷。
只有你同意後，才能加上那行 disable 註解。
如果執行流程中沒有人監督，PR 就會維持紅燈，問題也會寫進報告；agent 不會自行放行。

<!--image:3-->

## 三條規矩

這條 lane 的規矩可以濃縮成三句：只檢查這次改動的行、殺掉所有 survivor、把 equivalent mutant 的判斷交給人。
如果 equivalent mutant 多到難以處理，可以退一步，只對最關鍵的 code path 執行 mutation。
這樣需要判斷的 mutant 會變少，但受檢查的 code 也會變少，取捨必須清楚呈現。

mutation lane 管的是行為。但 agent 留在 code 裡的痕跡，並不都是行為問題，下一段補上這一層。
