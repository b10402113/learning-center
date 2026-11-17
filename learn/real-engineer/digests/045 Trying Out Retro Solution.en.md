---
source: sources/real-engineer/20261116/course/045 Trying Out Retro Solution.en.txt
source_type: text
source_lines: 113
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 實跑人工審查：sidebar 的「saved」不符 glossary，UI 應使用 bookmarks／notes 等領域詞。
- 其他評論：`testdb` 型別該放到更全域的位置；測試 setup 該走模組自己的函式而非直接操作 DB。
- 也反映偏好：不要留解釋簡單函式的註解，寧可讓程式本身更明顯。
- 展現領域專業：用 branded types 區分純文字與 markdown，讓型別系統更有幫助。
- 跑 retro 於 PR 34 的全部 session：它先載入 writing-for-agents skill，找到全部六個 session（含 code review 生成的 sub-agent）並讀取 PR 評論。
- retro 很燒 token；跨多 session（如 25 個）時建議拆給多個 sub-agent 分批讀。
- 不能讓 retro 自動套用修正：它會陷入不斷改進反而更糟的迴圈。
- 實例：它誤判「修完沒再跑一次 code review」應改 skill（作者認為太硬），但正確抓到偏好沒寫下來、專案既有慣例教了反例。
- 產出：兩個新規則進 `CODING_STANDARDS.md`、加 branded types、共用 test db 型別、刪掉模組 banner 註解。

# L2 detail

- `#L1-L8` — 開始正規人工審查：sidebar 元件中指向 bookmark 頁的標籤寫成 saved，作者認為 sidebar 應直接寫功能名稱，且 UI 文字該用 glossary 裡的 bookmarks／notes，因此把這則評論寫成容易被轉成 coding standard 的形式。
- `#L9-L18` — 兩則結構性評論：`bookmarks.server.test` 裡建立的 `testdb` 型別應搬到更全域的位置；`beforeEach` 的測試 setup 直接操作資料庫，違反「測試 setup 應透過模組已知函式」的原則，否則日後換資料庫存取方式時測試會連帶受影響；作者自陳這些是他的個人偏好與經驗。
- `#L19-L24` — 對註解的偏好：不喜歡解釋函式在做什麼的註解，它們很快會與程式脫節，寧可把程式本身改得更明顯，尤其簡單函式更不需要這種註解。
- `#L25-L33` — 展現領域專業：型別系統應區分純文字與 markdown（branded types），讓每個函式都知道該期待什麼、獲得更完整的型別協助；作者提到自己曾任 TypeScript 講師；此時已留下四、五則評論。
- `#L34-L46` — 執行 retro 於 PR 34 的所有 session：retro 立刻載入 writing-for-agents skill，因為它教如何設計 skill、寫 `AGENTS.md`、評斷 repo 中的東西；它找到全部六個 session（建 PR、寫 body、code review 與修正），並包含 code review 生成的 sub-agent，也會讀取 PR 評論；作者指出 retro 很花 token，跨 25 個 session 時應拆給四、五個 sub-agent 分批讀。
- `#L47-L60` — 讀 retro 報告的心法：它會有些判斷出錯；常見疑問是為何不讓 retro 直接套用修正——因為它可能陷入不斷改進、反而更糟的迴圈；例如它抓到「code review 修完後沒有再跑一次 code review」並建議在 code review skill 加最後一步重跑 standards 檢查，作者認為這種改法太硬，雖可嘗試。
- `#L61-L71` — 第二點才是重點：你的偏好沒被寫下來，而既有程式碼教了相反的慣例；作者評論要求「讓程式明顯而非加註解」，但 agent 模仿了專案中 server 模組的 banner 標頭慣例，修正 commit 反而多加了 32 行註解——顯示 automated review 與作者偏好的風格不一致。
- `#L72-L87` — 續談第二點：測試 setup 問題顯示多處測試直接 `db.insert schema`；retro 建議兩者都屬判斷題，應寫進 `CODING_STANDARDS.md`——一是「讓程式自我說明，名稱與抽取直到註解多餘，註解只為程式無法表達的 why」，作者補充若連 why 都表達不了，或許該寫 ADR 而非註解；二是「透過受測模組安排測試」，需要函式時就加進模組而非直接插列；它也建議補上沒進 code review skill 的 Fowler 內容，並主張刪掉模組 banner 註解，否則每個新模組都會複製、審查者持續標記實作者正確模仿的程式碼。
- `#L88-L104` — 作者決策：忽略第一點、不動 code review skill，但第二點全採納，外加第五、六點（branded types 與共用 test db 型別）；agent 於是加上 branded types（把 body 標為 markdown）、實作單一共用 test db 型別、移除模組 banner 註解，並在 `CODING_STANDARDS.md` 新增兩條規則。
- `#L105-L113` — 收尾：retro 是作者工具箱中最強大的 skill 之一，改變了「該不該做人工審查、該做多少」的計算，讓人更願意審查因為知道它會強化自動審查；若某次 session 出錯或產生 bug，也可 retro 該 session 避免重演。
