---
source: sources/real-engineer/20261116/course/082 Retro A Run Solution.en.txt
source_type: text
source_lines: 165
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- Retro 的輸入是一段表達感受的 prompt 加兩個 action run；輸出是一份具體編號的改善清單。
- 發現一：verdict 重複每個 inline comment → 改 `prompt.md`，只寫「已修」項目，每個軸一行理由。
- 發現二：review 不夠積極，沒把無測試的 deep module、重複程式碼、server 依賴 UI 直接修掉，拖慢人工審查。
- 發現三：token check 逼出的拆檔被 review 判成 scope creep，兩個 automated 機制互相打架 → 寫進 coding standards。
- 發現四：兩次 run 都臨時 `agent-browser install` 下載 Chromium → 改成 workflow 預裝並快取。
- 發現五：兩次 run 都從零摸索如何以 enrolled student 登入 → prompt 加一段簡短登入說明。
- 發現六：reviewer 貼了沒用的截圖 → 要求截自己修正後的畫面並在瀏覽器檢查 PR 的 after 狀態。
- 「想要卻找不到的規則」被分成 checks（dependency cruiser、自訂 OX lint、boundaries、檔案系統測試檢查）與 standards（controlled 欄位 keyed by entity、client/server 共用 normalization、why comment 反轉需說明）。
- 作者否決「每次編輯檔案前先跑腳本」的 implement prompt 寫法，因為太吵；保留在 commit 階段，只在 `AGENTS.md` 預告。
- why comment 的立場：產品決策不該放註解（會過時），該進 ADR；註解裡塞滿 why 是流程失常的訊號，應在 PR 標記並大力刪除。
- 收尾：24 條 route 都 import DB 使「route 不查 module 資料」的 check 會變成巨大豁免清單，改列 standards；新 check 用 throwaway 檔案驗過；PR 是 two-way door、blast radius 只有工廠，直接 merge 進 main。

# L2 detail

- `#L1-L14` — 先寫 prompt：review 的 summary 與 code comment 大量重複、review 挖出一些可放進 coding standards 的東西、請一併檢查 run 本身的效率；retro 回來的第一項就是 verdict 重複每個 inline comment，修法在 `prompt.md`，agent 只寫已修的項目，每個軸一行理由，讓 summary 真正只是摘要。
- `#L15-L26` — 作者追加兩個感受：review 修得不夠多（無測試又介面淺的 module、重複程式碼、server module 依賴 UI component 都該用 commit 直接修掉）、reviewer 找修法不夠積極，把 deep module 的修法丟回人工，導致人工審查變慢。
- `#L27-L48` — 下一個發現：token check 在 run 後段逼出重構，reviewer 卻把它標成 scope creep——automated checks 與 automated review 互相牴觸；建議在 coding standards 加一條「因 token check 觸發的拆檔屬於任何 ticket 的範圍，確認行為未變且不得標為 scope creep」。Retro 也建議在 implement prompt 加「編輯檔案前先跑這腳本，失敗就先單獨 commit 拆檔」，作者否決，因為每個檔案編輯都觸發太吵，寧可把檢查批次留到最後 commit；做法是在 `AGENTS.md` 加註記，讓 implementer 事先知道。
- `#L49-L66` — Reviewer 想要的規則被分成 checks 與 standards：server module 不得 import app component 用 dependency cruiser；輸入要走 Zod 而非 Number，用 `lint rules` 裡的自訂 OX lint 規則；route 不查 module 擁有的資料再用 boundaries 檢查；新 module 必須附測試，用簡單的檔案系統檢查（每個 module 都要有含測試的 tests 資料夾）。作者指出一旦走上 automated check 這條路，agent 就知道未來 run 與 retro 都多了這些選項。
- `#L67-L76` — 判斷類的規則歸 coding standards：controlled 欄位以它編輯的實體為 key（正好修掉 lesson A 草稿覆蓋 lesson B 的真實 bug）、client 與 server 共用同一個 trimming 與上限的 normalization 函式（可避免 unsaved changes 狀態不清除）；還有一條「反轉 why comment 的 PR 要說明」，作者要求更多上下文。
- `#L77-L90` — 後續編號發現：兩次 run 都臨時呼叫 `agent-browser` 才安裝並執行 `agent-browser install`，在 agent step 內下載 Chromium → 改成加一個帶快取的 workflow 安裝步驟；兩次 run 都從零摸索如何以 enrolled student 登入 → 加一段簡短簽入說明；reviewer 貼了無用截圖 → review prompt 要求截自己修正造成的變化，並在瀏覽器檢查 PR 的 after 狀態。
- `#L91-L119` — 作者接受全部建議（少數小項除外），要開一個對 main 的獨立 PR 去做；過程中需回饋，agent 差點直接進實作，作者打斷追問 why comment：main 上 lesson route 的註解寫「notes 在影片下方，讓學生邊看邊寫」，是該產品決策的唯一紀錄，implementer 把 notes 往下移時連註解一起刪了；建議是 PR 描述要點名反轉、必要時用新理由取代註解。作者立場更強：why 註解會過時，產品決策該進 ADR，甚至可以刪掉；若註解裡塞滿 why，代表流程有問題，應在 PR 標記並大力移除。
- `#L120-L136` — 準備 build 前又被叫住：掃描發現 24 條 route 同時 import module 與 DB/drizzle ORM，代表「route 不查 module 資料」這條 check 從第一天就會有巨大豁免清單，於是放棄該 check、改列 coding standards。接著發現 agent 違背指示，在 `AGENTS.md` 寫了「編輯大檔案前先跑腳本，失敗就拆檔算你這次的改動」，作者排訊息要求改掉（太重），最後改成「編輯大檔案即代表要在同一次改動中拆開」。
- `#L137-L153` — 改動漸大但預期仍在 150 行以內、內容不複雜，不致掉進 dumb zone；可見它安裝 Agent Browser 並快取 Chrome 版本（省去每次重新下載），commit 通過 hook 且很快；PR 內容為「讓 reviewer 修更多、findings 只列一次、補上它要的 checks」，含新 checks、standards 與 docs、證據，每個新 check 都在 throwaway 檔案上試過；workflow 變更無法先測（workflow 只從 main 跑），但這是 two-way door、blast radius 只有工廠，作者直接 merge。
- `#L154-L165` — 回到本機 `git checkout main`、`git pull` 取得變更；這就是隨時間改善 software factory 的流程：讓 run 更有效率、調成自己想要的樣子；retro 也能套在更大的範圍（例如最近 10 次 implement、20 次 review run），而所有人工作業的成果又回饋進 automated review 與 automated checks——「the circle of life」。
