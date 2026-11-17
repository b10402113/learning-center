---
source: sources/real-engineer/20261116/course/083 Explore Before You Commit.en.txt
source_type: text
source_lines: 81
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L97
---

# L1 overview

- 已看過 implement、review、merge；但來自外部資料源的回饋不該直接進 implement。
- 外部回饋要先驗證：確認對方是否在正確版本（可能誤發 prototype、或對方沒重新整理／下載）。
- Explore 也要查重複 issue，並判斷是否該先 grilling 出一點決策，還不到實作階段。
- Explore 階段會驗證 claim、找出相關程式碼位置、截圖呈現現況，並列出未解問題，讓人決定是否 approve。
- 適合餵進 explore 的來源：公開 issue／論壇回饋、bug tracker（BugSnag、Sentry）、慢查詢、cron 定時檢查。
- 練習前先把 PR merge、pull main，同步大家的位置。
- 練習要開一批模糊、粗魯、難以指名的 issue（且故意包含重複），再用 label 批次觸發。
- 一次貼 label 不會開 N 個 run，而是單一 run 收下全部 issue，因此能辨識重複。

# L2 detail

- `#L1-L8` — 前面已走過 implement、review、merge 三個步驟；但遇到 issue list 這類資料源時，不該看到一則就直接實作，「lesson notes look like garbage」對 agent 而言不是好 prompt。
- `#L9-L20` — 假設這是外部來源，要先驗證對方是否在正確版本（可能誤發 prototype 到 production、或對方沒重新整理瀏覽器／沒重新下載 App）；外部回饋如公開 issue list 還需驗證其說法、確認是否重複既有 issue，有些內容甚至需要先 grilling 出決策，還不適合進實作。
- `#L21-L32` — 因此處理 repo 外的資訊時適合加一個 explore phase：逐一驗證 issue 的每個 claim、找出相關程式碼位置、截圖呈現 UI 現況、整理未解問題與待改進處；人類讀完 issue 上的留言再決定是否 approve 進 implement；任何進入 app 環境的資料源都能用這招。
- `#L33-L44` — 可餵給 explore 的來源：讓使用者送 feedback 的公開 issue／論壇、來自 bug tracker（BugSnag 或 Sentry）的 bug report、資料庫慢查詢、或每 X 小時／天跑一次的 cron 定時整理程式碼；這些都觸發 explore 再回到主流程，explore 等於外部資訊進入 repo 的 sanity check。
- `#L45-L55` — 開始前先做 housekeeping：把 PR merge、重新 pull main 讓大家同步；然後到 send feedback 按鈕狂送 issue，瀏覽 app 找出不滿意處並填標題與經過，且刻意加入幾張高度相似的重複 ticket。
- `#L56-L64` — 要以非 dev team 成員的身分寫 issue：模糊、粗魯、難以指名，甚至需要 dev team 做決策；也可趁機抱怨長期困擾的 bug；不想照抄可暫停影片自己寫。
- `#L65-L72` — 作者最後累積九張 issue，例如「my name isn't emma...」極其模糊，只寫著從 courses 的 feedback 按鈕送出、左下角只看得到名字；另有一組重複：「電腦是 light mode 但 app 是 dark mode」與反向描述；現實中即使看得到別人的 issue，使用者仍會重複回報。
- `#L73-L81` — 做法是勾選全部後批次貼上 `agent explore`；這不會啟動九個 run，而是單一 run 收下全部九張 issue，因此能判斷重複，再對九張各自留言，產生大量 exploration 資訊；執行期間會拆解 agent explore workflow 看它內部怎麼運作。
